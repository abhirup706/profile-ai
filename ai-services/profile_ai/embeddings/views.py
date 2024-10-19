from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pinecone import Pinecone
from openai import OpenAI
import json
from django.conf import settings
import os
import requests
from PyPDF2 import PdfReader
import logging
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter, RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.document_loaders import PyPDFLoader




# Initialize Pinecone and MongoDB
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

# Initialize OpenAI
os.environ['OPENAI_API_KEY'] = settings.OPENAI_API_KEY

client = OpenAI()

logger = logging.getLogger(__name__)

# client = MongoClient("<Your MongoDB URI>")
# db = client["your_database_name"]
# collection = db["your_collection_name"]

@csrf_exempt
def create_embeddings_text(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data['user_id']
            document_id = data['document_id']
            journal_topic = data.get('journal_topic')
            journal_text = data['journal_text']

            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
            texts = text_splitter.split_text(journal_text)

#           Call OpenAI API to create vector embeddings
            response = client.embeddings.create(
                input=texts,
                model="text-embedding-ada-002"
            )
            embeddings = response.data[0].embedding

            metadata = {"user_id": user_id}
            if journal_topic:
                metadata['journal_topic'] = journal_topic

            metadata['type'] = 'text'
            metadata['journal_text'] = journal_text


            # Example for storing in Pinecone
            index.upsert(vectors=[(document_id, embeddings , metadata )])

            return JsonResponse({"status": "success", "message": "Embeddings created successfully."}, status=200)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)

@csrf_exempt
def create_embeddings_doc(request):
    if request.method == 'POST':
        try:
            # Parse the POST request data
            data = json.loads(request.body)
            user_id = data.get('user_id')
            document_id = data['document_id']
            doc_url = data.get('doc_url')  # URL of the document location
            journal_topic = data.get('journal_topic', None)  # Optional metadata
            logger.info(f"Received request with user_id: {user_id} and doc_url: {doc_url}")


            if not doc_url or not user_id:
                return JsonResponse({"status": "error", "message": "user_id and doc_url are required."}, status=400)


            # Check if the doc_url is a local path
            if os.path.isfile(doc_url):  # If it's a local file path
                logger.debug("Inside local file condition")
                file_path = doc_url
#             else:  # Otherwise, treat it as a URL
#                 logger.info("Inside public url condition")
#                 response = requests.get(doc_url)
#                 if response.status_code != 200:
#                     return JsonResponse({"status": "error", "message": "Failed to fetch the document."}, status=400)
#
#                 file_path = BytesIO(response.content)

            # Extract text from the PDF file
            if os.path.isfile(file_path):  # Local file path
                with open(file_path, 'rb') as pdf_file:

                    loader = PyPDFLoader(file_path)
                    data = loader.load()

                    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
                    documents = text_splitter.split_documents(data)
                    texts = [str(doc) for doc in documents]

            # Call OpenAI API to create vector embeddings
            embedding_response = client.embeddings.create(
                input=texts,
                model="text-embedding-ada-002"
            )
            embeddings = embedding_response.data[0].embedding

            # Metadata for Pinecone (optional)
            metadata = {"user_id": user_id}

            if journal_topic:
                metadata['journal_topic'] = journal_topic

            metadata['type'] = 'file'
            metadata['url'] = file_path

            # Store in Pinecone with metadata
            index.upsert(vectors=[(document_id, embeddings, metadata)])

            # Store in MongoDB with metadata and file URL

            return JsonResponse({"status": "success", "message": "Embeddings created successfully from the document."}, status=200)

        except Exception as e:
            logger.error(str(e))
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)