import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, ToolMessage
from langgraph.graph import END
from .prompt import VERIFICATION_PROMPT, SYSTEM_PROMPT
load_dotenv()
MODEL = os.getenv("MODEL")

@tool
def invalid(field:str, value:str, counter:int):
    """
    Call this tool if the user's response is not valid for one of the fields you are verifying.
    """
    if counter >= 3:
        return f"The user's response for {field} with value {value} is not valid. Politely end the conversation and after ask them to call the support number. Give them the support number: 1-800-555-1234. You must not continue with the conversation but only reply about the support number"
    else:
        return f"The user's response for {field} with value {value} is not valid. Indicate to the user that it does not match our records. Please ask the user one more time."

@tool
def completed(**kwargs):
    """
    Call this tool when verification is complete and successful.
    """
    return "Verification complete. Prompt the user that we are moving on to medical questions. Do not end with a farwell. Mention that during the next stage the patient can ask any questions they have."

tools_by_name = {
    "invalid": invalid,
    "completed": completed
}

def verification_route(state):
    if not state["messages"]:
        return END
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "verification_tool_node"
    else:
        return END

class VerificationAgent:
    def __init__(self):
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("system", VERIFICATION_PROMPT),
            ("system", "Fields:{fields}"),
            ("system", "Values:{values}"),
            MessagesPlaceholder(variable_name="messages")
        ])
        self.llm = ChatOpenAI(model=MODEL, temperature=0, streaming=True)
        self.chain = self.prompt | self.llm.bind_tools([invalid, completed])
        
    def __call__(self, state):
        result = self.chain.invoke(state)
        return {**state, "messages": [result]}
    
def process_tool(state): 
    last_message = state["messages"][-1]
    print('COUNTER**********', state["counter"])
    messages = []
    for tool_call in last_message.tool_calls:

        if tool_call["name"] == "invalid":
            print('TOOL CALL************', tool_call, tool_call["args"])
            if tool_call["args"]["field"] == state.get("current_field"):
                state["counter"] += 1
            else:
                state["current_field"] = tool_call["args"]["field"]
                if not state.get("current_field"):
                    state["current_field"] = tool_call["args"]["field"]
       
                state["counter"] = 1
                
            message = tools_by_name[tool_call["name"]].invoke({**tool_call["args"], "counter": state["counter"]})

            messages.append(ToolMessage(name=tool_call["name"], tool_call_id=tool_call["id"],  content=message))
        elif tool_call["name"] == "completed":
            state["next"]+=1
            print("COMPLETED!!!!!", state["next"])
            messages.append(ToolMessage(name=tool_call["name"], tool_call_id=tool_call["id"],  content="Verification complete. Prompt the user that we are moving on to medical questions. Do not end with a farwell. Mention that during the next stage the patient can ask any questions they have."))
        else:
            messages.append(ToolMessage(name=tool_call["name"], tool_call_id=tool_call["id"],  content=""))
    return {**state, "messages": messages}
        
    
    
