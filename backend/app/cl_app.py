from langchain_core.messages import HumanMessage,  AIMessageChunk
import chainlit as cl
from app.graph import workflow
from dotenv import load_dotenv

load_dotenv()


@cl.on_chat_start
async def on_chat_start():
    msg = cl.Message(content="")
    await msg.send()

    user_message = HumanMessage(content="Hi, who are you?")
    config = {"configurable": {"thread_id": "1"}}
    
    astream = workflow.astream({"messages": [user_message], "fields":"full name, birthdate", "values":"Tom Smith, 1990-01-01"}, config=config, stream_mode="messages")
    async for message, metadata in astream:
        if isinstance(message, AIMessageChunk):
            await msg.stream_token(message.content)
    
    await msg.update()


@cl.on_message
async def on_message(message: cl.Message):

    msg = cl.Message(content="")
    await msg.send()

    user_message = HumanMessage(content=message.content)
    config = {"configurable": {"thread_id": "1"}}
    
    astream = workflow.astream({"messages": [user_message], "fields":"full name, birthdate", "values":"Tom Smith, 1990-01-01"}, config=config, stream_mode="messages")
    async for message, metadata in astream:
        if isinstance(message, AIMessageChunk):
            await msg.stream_token(message.content)
            
    await msg.update()