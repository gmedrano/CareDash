from langchain_core.messages import HumanMessage, RemoveMessage, AIMessageChunk
import chainlit as cl
from fastapi import Depends
from langgraph.checkpoint.memory import MemorySaver
from app.auth import get_current_user
from app.graph import workflow
from dotenv import load_dotenv

load_dotenv()


@cl.on_chat_start
async def on_chat_start():
    msg = cl.Message(content="")
    await msg.send()

    user_message = HumanMessage(content="Hi")
    config = {"configurable": {"thread_id": "1"}}
    
    astream = workflow.astream({"messages": [user_message], "fields":"full name, birthdate", "values":"John Doe, 1990-01-01"}, config=config, stream_mode="messages")
    async for message, metadata in astream:
        if isinstance(message, AIMessageChunk):
            await msg.stream_token(message.content)
    
    await msg.update()
    #await cl.Message(content="Hi, how can I help you today?").send()


@cl.on_message
async def on_message(message: cl.Message):

    msg = cl.Message(content="")
    await msg.send()

    user_message = HumanMessage(content=message.content)
    config = {"configurable": {"thread_id": "1"}}
    
    astream = workflow.astream({"messages": [user_message], "fields":"full name, birthdate", "values":"John Doe, 1990-01-01"}, config=config, stream_mode="messages")
    async for message, metadata in astream:
        if isinstance(message, AIMessageChunk):
            await msg.stream_token(message.content)
            
    await msg.update()