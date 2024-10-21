import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langgraph.graph import END
from .prompt import SYSTEM_PROMPT, CONTEXT_PROMPT, QUESTION_PROMPT
load_dotenv()
MODEL = os.getenv("MODEL")

@tool
def user_query(query:str):
    """
    Call this tool to retrieve the context of the conversation for the user's query which is an unambiguous and concise query with enough context from the message history.
    """
    return query

@tool
def completed(**kwargs):
    """
    Call this tool when all medical questions have been completed.
    """
    return True

tools_by_name = {
    "user_query": user_query,
    "completed": completed
}

def medical_route(state):
    if not state["messages"]:
        return END
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "rag_tool_node"
    else:
        return END
    
class MedicalQuestionAgent:
    def __init__(self, questions=[]):
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("system", QUESTION_PROMPT),
            ('system', CONTEXT_PROMPT),
            MessagesPlaceholder(variable_name="messages")
        ])
        self.llm = ChatOpenAI(model=MODEL, temperature=0, streaming=True)
        self.chain = self.prompt | self.llm.bind_tools([user_query, completed])
        self.questions = questions
        
    def __call__(self, state):
        response = self.chain.invoke({**state, "questions": self.questions})
        return {**state, "messages":[response] }
    
