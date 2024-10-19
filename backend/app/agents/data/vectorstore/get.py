import os
from qdrant_client import QdrantClient
from langchain_qdrant import QdrantVectorStore
from langchain_openai import OpenAIEmbeddings

from dotenv import load_dotenv

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

client = QdrantClient(
    api_key=os.environ["QDRANT_API_KEY"],
    url=os.environ["QDRANT_URI"]
)

vector_store = QdrantVectorStore(
    client=client,
    collection_name=os.environ["QDRANT_COLLECTION"],
    embedding=embeddings,
)

retriever = vector_store.as_retriever()

if __name__ == '__main__':
    query = "What is the document about?"
    results = retriever.invoke(query)
    print(f'****query={query}, results=', results)


