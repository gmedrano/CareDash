import os
import hashlib
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import tiktoken
load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

def tiktoken_len(text):
    tokens = tiktoken.encoding_for_model(os.environ["MODEL"]).encode(
        text,
    )
    return len(tokens)

def read_files_in_folder(folder_path):
    # Ensure the folder path exists
    output = []
    if not os.path.exists(folder_path):
        print(f"The folder {folder_path} does not exist.")
        return
    # Iterate over all files in the folder
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        # Check if it's a file (not a subdirectory)
        if os.path.isfile(file_path) and file_path.endswith('.pdf'):
            try:
                document = PyMuPDFLoader(file_path).load()
                for doc in document:
                    doc.metadata['id'] = hash_string(
                        str(doc.metadata['page'])+doc.metadata['source'])
                output += document
                print('Adding file****', file_path)
            except Exception as e:
                print(f"Error reading {filename}: {str(e)}")

    return output


def chunk_and_upload(documents, embeddings=embeddings, chunk_size=1000, chunk_overlap=100, collection_name=os.environ["QDRANT_COLLECTION"]):
    print(
        f'Chunking documents using embedding {type(embeddings)} ')
    
    #se recursive character splitting
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=tiktoken_len,
    )
    # for documents in documentFiles:
    if isinstance(documents, list):
        split_chunks = text_splitter.split_documents(documents)
        QdrantVectorStore.from_documents(
            split_chunks,
            embeddings,
            url=os.environ["QDRANT_URI"],
            prefer_grpc=True,
            api_key=os.environ["QDRANT_API_KEY"],
            collection_name=collection_name,
        )
    else:
        split_chunks = text_splitter.split_text(documents)
        QdrantVectorStore.from_texts(
            split_chunks,
            embeddings,
            url=os.environ["QDRANT_URI"],
            prefer_grpc=True,
            api_key=os.environ["QDRANT_API_KEY"],
            collection_name=collection_name,
        )
    

def hash_string(input_string, algorithm='sha256'):
    # Convert the input string to bytes
    input_bytes = input_string.encode('utf-8')

    hash_object = hashlib.new(algorithm)

    hash_object.update(input_bytes)

    return hash_object.hexdigest()


if __name__ == '__main__':
    folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'combined_forms', 'temp'))
    print('****file****', folder)
    documents = read_files_in_folder(folder)
    chunk_and_upload(documents)
