import os
import tempfile
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse
from pymongo.mongo_client import MongoClient
from .auth import auth_router
from .webrtc import webrtc_router
from .agents.data_processor import PDFProcessor

load_dotenv()
app = FastAPI()
mongo_client = MongoClient(os.getenv("MONGO_URI"))
try:
    db = mongo_client[os.getenv("MONGO_DB")]
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


# Get the directory of the current file
current_dir = os.path.dirname(os.path.realpath(__file__))

# Construct the path to the frontend dist directory
frontend_dir = os.path.join(current_dir, "..", "..", "frontend", "dist")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(webrtc_router)

@app.get("/")
async def serve_react_root():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

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

app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dir, "assets")), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)