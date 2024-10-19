from dotenv import load_dotenv
from fastapi import APIRouter, Depends, WebSocket
from fastapi.responses import JSONResponse
from .auth import get_current_user
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCConfiguration, RTCIceServer
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage, RemoveMessage, AIMessageChunk
from langgraph.checkpoint.memory import MemorySaver
from .graph import graph
from typing import Dict

#TURN Server
ice_servers = [ 
    RTCIceServer(urls=["stun:stun.l.google.com:19302"]),
]
configuration = RTCConfiguration(iceServers=ice_servers)
#pc = RTCPeerConnection(configuration=configuration)


load_dotenv()

memory = MemorySaver()
app = graph.compile(checkpointer=memory)

webrtc_router = APIRouter()

# Initialize OpenAI
llm = ChatOpenAI(temperature=0, model_name="gpt-4o")

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are expert in asking questions. Your goal is to ask full name, age, and address of a person."),
    MessagesPlaceholder(variable_name="messages")
])

chain = prompt | llm #remove this
user_memories: Dict[str, ConversationBufferMemory] = {} #remove this


@webrtc_router.post("/api/webrtc/offer")
async def webrtc_offer(offer: dict, current_user: dict = Depends(get_current_user)):
    pc = RTCPeerConnection(configuration=configuration)
    offer_obj = RTCSessionDescription(sdp=offer["sdp"], type=offer["type"])

    await pc.setRemoteDescription(offer_obj)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    # Create a new memory for the user if it doesn't exist
    if current_user.username not in user_memories:
        user_memories[current_user.username] = ConversationBufferMemory(
            return_messages=True)

    @pc.on("datachannel")
    def on_datachannel(channel):
        @channel.on("message")
        async def on_message(message):
            # Process the message using LangChain
            memory = user_memories[current_user.username]
            user_message = HumanMessage(content=message)

            memory.chat_memory.add_user_message(user_message) #r

            config = {"configurable": {"thread_id": current_user.username}}
 
            astream = app.astream({"messages": [user_message], "fields":"full name, birthdate", "values":"John Doe, 1990-01-01"}, config=config, stream_mode="messages")
            async for msg, metadata in astream:
                if isinstance(msg, AIMessageChunk):
                    channel.send(msg.content)
                    
    return JSONResponse(content={
        "sdp": pc.localDescription.sdp,
        "type": pc.localDescription.type
    })


@webrtc_router.post("/api/webrtc/ice-candidate")
async def webrtc_ice_candidate(candidate: dict, current_user: dict = Depends(get_current_user)):
    # In a real-world scenario, you'd store and forward this candidate to the other peer
    return JSONResponse(content={"status": "success"})


@webrtc_router.post("/api/webrtc/clear_memory")
async def webrtc_clear_memory(obj: dict, current_user: dict = Depends(get_current_user)):
    config = {"configurable": {"thread_id": current_user.username}}
    state = app.get_state(config=config)
    messages = state.values.get("messages", [])
    for message in messages:
        app.update_state(config, {"messages": RemoveMessage(id=message.id)})
    return JSONResponse(content={"status": "success"})
