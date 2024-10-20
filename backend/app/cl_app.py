from langchain_core.messages import HumanMessage, RemoveMessage, AIMessageChunk
import chainlit as cl
from fastapi import Depends
from langgraph.checkpoint.memory import MemorySaver
from app.auth import get_current_user
from app.graph import graph
from dotenv import load_dotenv

load_dotenv()

memory = MemorySaver()
workflow = graph.compile(checkpointer=memory)

@cl.on_chat_start
async def on_chat_start():
    #cl.user_session.set("current_user", current_user)
    cl.user_session.set(
        "message_history",
        [{"role": "system", "content": "You are a helpful assistant."}],
    )
    await cl.Message(content="Hi, how can I help you today?").send()


@cl.on_message
async def on_message(message: cl.Message):
    message_history = cl.user_session.get("message_history")
    message_history.append({"role": "user", "content": message.content})

    msg = cl.Message(content="")
    await msg.send()

    user_message = HumanMessage(content=message.content)
    config = {"configurable": {"thread_id": "test"}}
    
    astream = workflow.astream({"messages": [user_message], "fields":"full name, birthdate", "values":"John Doe, 1990-01-01"}, config=config, stream_mode="messages")
    async for message, metadata in astream:
        if isinstance(message, AIMessageChunk):
            await msg.stream_token(message.content)
            

    message_history.append({"role": "assistant", "content": msg.content})
    await msg.update()