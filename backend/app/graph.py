import os
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from pymongo.mongo_client import MongoClient
from .agents.supervisor import SupervisorAgent
from .agents.verification import VerificationAgent, process_tool, verification_route
from .agents.intake import IntakeAgent, intake_route
from .agents.rag import RAGTool
from .agents.state.state import GraphState
from .agents.data.vectorstore.get import retriever

#find question in the db
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client[os.getenv("MONGO_DB")]    
collection = db.questions

questions = collection.find_one({"filename": "ACTC-Patient-Packet.pdf"})

memory = MemorySaver()

graph = StateGraph(GraphState)

supervisor = SupervisorAgent()
graph.add_node("supervisor_agent", supervisor)
graph.add_node("verification_agent", VerificationAgent())
graph.add_node("verification_tool_node", process_tool)
graph.add_node("intake_agent", IntakeAgent(questions=questions))
graph.add_node("rag_tool_node", RAGTool(retriever=retriever,
               llm=ChatOpenAI(model=os.environ["MODEL"])))

graph.set_entry_point("supervisor_agent")

graph.add_edge("verification_tool_node", "verification_agent")
graph.add_edge("rag_tool_node", "intake_agent")

graph.add_conditional_edges(
    'supervisor_agent',
     supervisor.route
)
graph.add_conditional_edges(
    "verification_agent",
    verification_route,
    {"__end__": END, "verification_tool_node": "verification_tool_node"}
)
graph.add_conditional_edges(
    "intake_agent",
    intake_route,
    {"__end__": END, "rag_tool_node": "rag_tool_node"}
)

workflow = graph.compile(checkpointer=memory)

async def run_verfication(app, fields="", values=""):
    config = {"configurable": {"thread_id": 1}}

    _input = input('User: ')
    while _input != 'quit':
        async for event in app.astream_events({"messages": [('user', _input)], "fields": "full name, birthdate", "values": "John Doe, 1990-01-01"}, config=config, version="v2"):
            if event['event'] == "on_chat_model_stream":
                data = event["data"]
                if data["chunk"].content:
                    print(data["chunk"].content.replace(
                        "\n", ""), end="", flush=True)

        _input = input('\nUser: ')


async def run(app):
    from langchain_core.messages import AIMessageChunk, HumanMessage
    config = {"configurable": {"thread_id": 1}}
    _user_input = input("User: ")

    while _user_input != "quit":
        out=""
        astream = app.astream({"messages": [HumanMessage(content=_user_input)], "fields":"full name, birthdate", "values":"John Doe, 1990-01-01"}, config=config, stream_mode="messages")
        async for msg, metadata in astream:
            if isinstance(msg, AIMessageChunk):
                out+=msg.content
        print('Assistant: ', out)
        _user_input = input("User: ")
    

#if __name__ == "__main__":
    #app = graph.compile(checkpointer=memory)
    #asyncio.run(run(app))

