import time
import math
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langgraph.graph import StateGraph
from typing_extensions import Annotated, TypedDict
from langgraph.graph import add_messages, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_community.document_loaders import PyMuPDFLoader
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o", temperature=0)
memory = MemorySaver()

class PDFProcessor:
    def __init__(self, file_path, chunk_size=500, chunk_overlap=200):
        self.file_path = file_path
        self.text = ""
        self.docs = PyMuPDFLoader(self.file_path).load()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )

    def extract_text(self): 
        for doc in self.docs:
            self.text += doc.page_content
        return self.text

    def extract_questions(self):
        questions = []

        chunks = self.text_splitter.split_text(self.extract_text())
    
        config = {"configurable":{"thread_id":f"thread_{math.floor(time.time())}"}}

        question_sets = workflow.batch(config=config, inputs=[{"context":chunk, "previous_questions":[]} for chunk in chunks])

        for item in question_sets:
            questions.extend(item.get("previous_questions", []))
        
        
        #clear memory after creating questions
        #memory.clear()
            
        return [q.content for q in questions]


#Agent to create questions from a context
class State(TypedDict):
    previous_questions: Annotated[list, add_messages]
    context:str

prompt = ChatPromptTemplate.from_template(
    """
    You are an expert at ingesting documents and creating questions for a medical questionnaire to be answered by patients with a high school level education. Given the following context that should contain medical questions, and from only this context extract all medical questions separated by '\n\n' that would be appropriate for a patient to answer. Indicate if the question is a multiple choice and the include the possible choices. If there are no medical questions in the context, output 'None'.

    Context:
    {context}
    """
)

def create_questions(state):
    results = (prompt | llm | StrOutputParser()).invoke(state)
    questions = results.split("\n\n")
   
    questions = [q for q in questions if q and q != 'None']
    return {"previous_questions":questions, "context":state.get("context","") or ''}


graph = StateGraph(State)
graph.add_node("create_questions", create_questions)
graph.set_entry_point("create_questions")
graph.add_edge("create_questions", END)
workflow = graph.compile(checkpointer=memory)

#Agent to edit questions

prompt_edit = ChatPromptTemplate.from_template(
    """
    You are an expert at ingesting documents and creating questions for a medical questionnaire to be answered by patients with a high school level education. Given the following context that should contain medical questions, and from only this context extract all medical questions separated by '\n\n' that would be appropriate for a patient to answer. Indicate if the question is a multiple choice and the include the possible choices. If there are no medical questions in the context, output 'None'.

    Context:
    {context}
    """
)
class StateEdit(TypedDict):
    questions: Annotated[list, add_messages]
    context:str

def edit_questions(state):
    results = (prompt_edit | llm | StrOutputParser()).invoke(state)
    questions = results.split("\n\n")
   
    questions = [q for q in questions if q and q != 'None']
    return {"previous_questions":questions, "context":state.get("context","") or ''}

graph_edit = StateGraph(StateEdit)
graph_edit.add_node("edit_questions", edit_questions)
graph_edit.set_entry_point("edit_questions")
graph_edit.add_edge("edit_questions", END)
workflow_edit = graph_edit.compile(checkpointer=memory) 








