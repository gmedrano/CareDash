# CareDash

CareDash simplifies healthcare visits by helping patients navigate required documents and medical questionnaires through a user-friendly chatbot. It offers real-time assistance and context to ensure patients fully understand and accurately complete all forms. 

This demo features the following:
- The medical provider can upload pdf and the medical questions are extracted from the pdf and stored into a database.
- Other extracted information related to the medical provider's policies and procedures are stored in a vector database to be used for RAG.
- A FastAPI backend with websocket and REST API endpoints for frontend communication.
- Modern frontend built with React.js, Vite for fast development, and Tailwind CSS for responsive styling

## Local Deployment

1. Install dependencies

First, ensure you have Node.js version 20.11 installed. You can check your version with:

```bash
node -v
```

If you need to install Node.js, you can download it from [nodejs.org](https://nodejs.org/).
Start by going to the frontend directory and installing the dependencies:

```bash
cd frontend
pnpm install # Install  pnpm if not installed: npm install -g pnpm
```

Next, go to the backend directory and install the python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

2. Run the application

```bash
./run.sh
```

## Security

The token is stored in the local storage of the browser. This is not recommended for production but is fine for this demo. We recommend using session storage or a secure method to store the token.

