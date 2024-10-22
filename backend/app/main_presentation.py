import os
import tempfile
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import UploadFile, File
from starlette.middleware.cors import CORSMiddleware

from langchain_core.messages import HumanMessage, RemoveMessage, AIMessageChunk

from chainlit.auth import create_jwt
from chainlit.user import User
from chainlit.utils import mount_chainlit
from pymongo.mongo_client import MongoClient
from langgraph.checkpoint.memory import MemorySaver
from .agents.data_processor import PDFProcessor
from .auth import get_current_user, auth_router
from .graph import workflow


load_dotenv()

mongo_client = MongoClient(os.getenv("MONGO_URI"))
try:
    db = mongo_client[os.getenv("MONGO_DB")]
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
current_dir = os.path.dirname(os.path.realpath(__file__))
# Construct the path to the frontend dist directory
frontend_dir = os.path.join(current_dir, "..", "..", "frontend", "dist-presentation")

app = FastAPI()
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/custom-auth")
async def custom_auth():
    # Verify the user's identity with custom logic.
    #token = create_jwt(User(identifier="Test User"))
    token = "test"
    return JSONResponse({"token": token})

@app.get("/")
async def serve_react_root():
    return FileResponse(os.path.join(frontend_dir, "index-presentation.html"))

@app.post("/api/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(file.file.read())
            temp_file_path = temp_file.name
        print('File name=', str(file.filename))
        # Load the PDF content into a document object using PyMuPDFLoader
        collection = db.questions
        pdfloader = PDFProcessor(temp_file_path)
        questions = pdfloader.extract_questions()
        _question = collection.find_one({"filename": file.filename})
        print('questions=', questions)
        if _question:
            exists = True
            print('Question already exists. Updating...')
            collection.update_one({"filename": file.filename}, {"$set": {"questions": questions}})
        else:
            exists = False
            collection.insert_one({"questions": questions, "filename": file.filename})
            print('Question does not exist. Inserting...')
            
        os.remove(temp_file_path)
        
        return JSONResponse(content={"exists": exists, "questions_count": len(questions)}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/api/clear_memory")
async def clear_memory(obj: dict, current_user: dict = Depends(get_current_user)):
    config = {"configurable": {"thread_id": "1"}}
    state = workflow.get_state(config=config)
    messages = state.values.get("messages", [])
    for message in messages:
        workflow.update_state(config, {"messages": RemoveMessage(id=message.id)})
    return JSONResponse(content={"status": "success"})

app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dir, "assets")), name="static")

mount_chainlit(app=app, target=f"{current_dir}/cl_app.py", path="/chainlit")