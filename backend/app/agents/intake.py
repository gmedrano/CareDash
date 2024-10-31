import os
import json
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langgraph.graph import END
from .prompt import SYSTEM_PROMPT, CONTEXT_PROMPT, QUESTION_PROMPT
from .medical import medical_query
load_dotenv()
MODEL = os.getenv("MODEL")


@tool
def user_query(query: str):
    """\
        The 'user_query' tool is designed to handle all non-medical questions a user might have. It retrieves relevant information about administrative, insurance, customer service, and consent-related queries. This tool focuses on addressing general inquiries that help users navigate the administrative side of healthcare, including:

        - Insurance inquiries (e.g., coverage, billing, financial responsibility)
        - Customer service contact details (e.g., phone numbers, email addresses)
        - Information about forms and consent documents (e.g., types of forms to sign, purposes, requirements)
        - General administrative questions (e.g., appointment scheduling policies, office hours, telemedicine protocols)
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
    "completed": completed,
    "medical_query": medical_query
}


def intake_route(state):
    if not state["messages"]:
        return END
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "rag_tool_node"
    else:
        return END


class IntakeAgent:
    def __init__(self, llm: ChatOpenAI, questions=[]):
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("system", QUESTION_PROMPT),
            ('system', CONTEXT_PROMPT),
            MessagesPlaceholder(variable_name="messages")
        ])
        self.llm = llm
        self.chain = self.prompt | self.llm.bind_tools([user_query, completed, medical_query])
        self.questions = json.dumps([{**q, "id":'q'+str(i+1)} for i, q in enumerate(split_questions(questions['questions']))])

    def __call__(self, state):
        response = self.chain.invoke({**state, "questions": self.questions})
        return {**state, "messages": [response]}

def split_questions(questions:list[dict])->list[dict]:
    num_options = 10
    output = []
    for question in questions:
        if len(question.get('options', [])) >= 2*num_options:
            for i in range(0, len(question['options']), num_options):
                _question = question.copy()
                _question['options'] = question['options'][i:i+num_options]
                output.append(_question)
        else:
           output.append(question)
    return output