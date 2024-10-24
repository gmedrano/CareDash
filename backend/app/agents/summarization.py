from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI

PROMPT_SYSTEM = "You are an expert in medical field and know how to create SOAP notes from patient data. You are take the message history below and create a SOAP note with headers of Subjective, Objective, Assessment, and Plan. You are to use the information provided to create a comprehensive SOAP note."

class SummarizationAgent:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", PROMPT_SYSTEM),
            MessagesPlaceholder(variable_name="messages")
        ])
        
    def __call__(self, messages):
        chain = self.prompt | self.llm
        return chain.invoke({"messages": messages})
        
    
        
