from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_openai import ChatOpenAI
from .medical import tools_by_name

SYSTEM_PROMPT = """\
You are an expert in answering questions succintly and correctly only within context and chat history. Answer user's last question on the chat history and look at the message history for further context if needed. If you are not able to answer the last question of user based on the context reply with "I don't know". Never make up an answer.
"""

CONTEXT_PROMPT = """\
Context:
{context}

Chat History:
{chat_history}
"""

def map_messages(messages):
    text = ""
    for message in messages:
        if isinstance(message, HumanMessage):
            text += f"Human: {message.content}\n"
        elif isinstance(message, AIMessage):
            text += f"AI: {message.content}\n"
    return text


class RAGTool:
    def __init__(self, llm: ChatOpenAI, retriever: None):
        self.retriever = retriever
        self.llm = llm
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ('user', CONTEXT_PROMPT)
        ])


    def __call__(self, state):
        last_message = state["messages"][-1]
        messages = []
        for tool_call in last_message.tool_calls:
            print('TOOL CALL**********************',
                  tools_by_name[tool_call["name"]],  tools_by_name[tool_call["name"]].invoke({**tool_call["args"]}))
            if tool_call["name"] == "user_query":
                query = tools_by_name[tool_call["name"]].invoke(
                    {**tool_call["args"]})
                response = self.retriever.invoke(query)
                print('RESPONSE**********************', response)
                messages.append(ToolMessage(name=tool_call["name"], tool_call_id=tool_call["id"],
                                            content=f"Context:\n{response}\n\nRemember to try to get back to asking the patient medical questions after the user has no further question."))
            elif tool_call["name"] == "completed":
                state["next"] += 1
                print("COMPLETED!!!!!", state["next"])
                messages.append(ToolMessage(name=tool_call["name"], tool_call_id=tool_call["id"],
                                content="Medical Intake complete. Tell the user or patient that we are done with the intake process. Give them a professional and friendly farewell and mention about looking forward to seeing them at the appointment."))
            else:
                messages.append(ToolMessage(
                    name=tool_call["name"], tool_call_id=tool_call["id"],  content=""))

        return {**state, "messages": messages}