import json
import os
from typing import List, Dict, Any, Optional
from enum import Enum
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain_core.output_parsers import JsonOutputParser
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain_community.document_loaders import PyMuPDFLoader
from .data.vectorstore.generate import chunk_and_upload

from dotenv import load_dotenv
load_dotenv()

class PDFProcessor:
    def __init__(self, file_path):
        self.file_path = file_path
        self.text = ""
        self.docs = PyMuPDFLoader(self.file_path).load()
        self.get_text()
    
    def get_text(self): 
        for doc in self.docs:
            self.text += doc.page_content
        return self.text

    def extract_questions(self):
        questions = []
        
        extracted_questions = extract_medical_questions(self.text)
        questions = post_process_questions(extracted_questions)
        return questions
    
    def extract_to_vectorstore(self):
        chunks = chunk_and_upload(self.text)
        return chunks

# Define question types
class QuestionType(str, Enum):
    MULTI_SELECT = "MULTI_SELECT"
    SINGLE_SELECT = "SINGLE_SELECT"
    YES_NO = "YES_NO"
    TEXT_INPUT = "TEXT_INPUT"
    NUMERIC_INPUT = "NUMERIC_INPUT"
    DATE_INPUT = "DATE_INPUT"
    LIKERT_SCALE = "LIKERT_SCALE"
    MATRIX = "MATRIX"
    RANKING = "RANKING"
    SLIDER = "SLIDER"

# Define the structure for extracted questions
class ExtractedQuestion(BaseModel):
    id: str = Field(description="Unique identifier for the question")
    text: str = Field(description="The question text")
    type: QuestionType = Field(description="The type of question")
    options: Optional[List[str]] = Field(default=None, description="Options for multi-select, single-select, or ranking questions")
    range: Optional[Dict[str, float]] = Field(default=None, description="Range for numeric input, Likert scale, or slider questions")
    matrix: Optional[Dict[str, List[str]]] = Field(default=None, description="Row and column labels for matrix questions")
    unit: Optional[str] = Field(default=None, description="Unit for numeric input questions")
    format: Optional[str] = Field(default=None, description="Format for date input questions")
    labels: Optional[Dict[str, str]] = Field(default=None, description="Labels for the minimum and maximum points of a slider or Likert scale")
    required: bool = Field(default=True, description="Whether the question is required to be answered")

# Function to chunk the document
def chunk_document(document: str, chunk_size: int = 4000, chunk_overlap: int = 200) -> List[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    return text_splitter.split_text(document)

# Define prompts
document_analyzer_prompt = ChatPromptTemplate.from_template(
    """You are a document analyzer. Your task is to analyze the given chunk of a medical document and identify if it contains any medical questions.

    Document Chunk:
    {chunk}

    Does this chunk contain any medical questions? Respond with YES or NO.

    Response:"""
)

question_extractor_prompt = ChatPromptTemplate.from_template(
    """You are a medical question extractor. Your task is to extract medical questions from the given section of a document.
    Identify questions and categorize them according to the following types:
    MULTI_SELECT, SINGLE_SELECT, YES_NO, TEXT_INPUT, NUMERIC_INPUT, DATE_INPUT, LIKERT_SCALE, MATRIX, RANKING, SLIDER

    Section:
    {chunk}

    Extract all medical questions and format them as JSON objects with the following structure:
    {{
        "id": "unique_identifier",
        "text": "The question text",
        "type": "QUESTION_TYPE",
        "options": ["Option1", "Option2", ...],  // For MULTI_SELECT, SINGLE_SELECT, RANKING
        "range": {{"min": min_value, "max": max_value, "step": step_value}},  // For NUMERIC_INPUT, LIKERT_SCALE, SLIDER
        "matrix": {{"rows": ["Row1", "Row2", ...], "columns": ["Col1", "Col2", ...]}},  // For MATRIX
        "unit": "unit_of_measurement",  // For NUMERIC_INPUT
        "format": "date_format",  // For DATE_INPUT
        "labels": {{"min": "Min label", "max": "Max label"}},  // For SLIDER, LIKERT_SCALE
        "required": true/false
    }}

    Provide the extracted questions as a JSON array.

    Response:"""
)

question_validator_prompt = ChatPromptTemplate.from_template(
    """You are a question validator and editor. Your task is to review the extracted questions and ensure there are no duplicates or similar questions. If you find any duplicates or very similar questions, remove them and keep only the best-formulated one. We define duplicates as questions that are semantically the same and have the same options, if any.
    
    Extracted Questions: {questions}
    
    Provide the validated list of questions as a JSON array, maintaining the same structure as the input.
    
    Response:"""
)

# Create LLM
llm = ChatOpenAI(temperature=0, model=os.environ["MODEL"])

# Create chains
document_analyzer_chain = document_analyzer_prompt | llm | StrOutputParser()
question_extractor_chain = question_extractor_prompt | llm | JsonOutputParser()
question_validator_chain = question_validator_prompt | llm | JsonOutputParser()

# Define processing functions
def process_chunk(chunk: str):
    contains_questions = document_analyzer_chain.invoke({"chunk": chunk}).strip().upper() == "YES"
    if contains_questions:
        extracted_questions = question_extractor_chain.invoke({"chunk": chunk})
        return extracted_questions
    return []

def process_all_chunks(chunks: List[str]):
    all_questions = []
    for chunk in chunks:
        all_questions.extend(process_chunk(chunk))
    return all_questions

def validate_questions(questions: List[Dict]):
    validated_questions = question_validator_chain.invoke({"questions": questions})
    return validated_questions

# Create the main chain
main_chain = RunnablePassthrough.assign(
    chunks=lambda x: chunk_document(x["document"])
) | RunnableLambda(
    lambda x: {"questions": process_all_chunks(x["chunks"])}
) | RunnableLambda(
    lambda x: {"validated_questions": validate_questions(x["questions"])}
)

# Function to extract medical questions
def extract_medical_questions(document: str) -> List[Dict[str, Any]]:
    result = main_chain.invoke({"document": document})
    return result["validated_questions"]

# Function to post-process and deduplicate questions
def post_process_questions(questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen_questions = set()
    unique_questions = []
    for question in questions:
        question_text = question['text'].lower().strip()
        if question_text not in seen_questions:
            seen_questions.add(question_text)
            unique_questions.append(question)
    return unique_questions

# Example usage
if __name__ == "__main__":
    sample_document = """
    Medical Policy:
    This document outlines the procedures for handling patient information and conducting medical examinations.

    Patient Questionnaire:
    1. Have you experienced any chest pain in the last 30 days?
    2. On a scale of 1 to 10, how would you rate your current pain level?
    3. Which of the following symptoms have you experienced? (Select all that apply)
       a) Fever
       b) Cough
       c) Shortness of breath
       d) Fatigue
    4. Are you currently taking any medications?
    5. What is your current weight in kilograms?
    6. When was your last physical examination?
    7. For each of the following activities, rate how difficult they are for you:
       [Easy, Moderate, Difficult, Unable to do]
       - Walking up stairs
       - Lifting groceries
       - Performing household chores
    8. Rank the following factors in order of their impact on your health (1 being most impactful):
       - Diet
       - Exercise
       - Sleep
       - Stress management
    """

    try:
        extracted_questions = extract_medical_questions(sample_document)
        processed_questions = post_process_questions(extracted_questions)
        print(json.dumps(processed_questions, indent=2))
    except Exception as e:
        print(f"An error occurred: {str(e)}")