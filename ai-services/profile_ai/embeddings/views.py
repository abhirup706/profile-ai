from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pinecone import Pinecone
from openai import OpenAI
import json
from django.conf import settings
import os

# Initialize Pinecone and MongoDB
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

# Initialize OpenAI
os.environ['OPENAI_API_KEY'] = settings.OPENAI_API_KEY

client = OpenAI()

# client = MongoClient("<Your MongoDB URI>")
# db = client["your_database_name"]
# collection = db["your_collection_name"]


@csrf_exempt
def create_embeddings_text(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data['user_id']
            journal_topic = data.get('journal_topic')
            journal_text = data['journal_text']


#           Call OpenAI API to create vector embeddings
            response = client.embeddings.create(
                input=journal_text,
                model="text-embedding-ada-002"
            )
            embeddings = response.data[0].embedding

            metadata = {"user_id": user_id}
            if journal_topic:
                metadata['journal_topic'] = journal_topic


            # Example for storing in Pinecone
            index.upsert(vectors=[(user_id, embeddings , metadata )])

            return JsonResponse({"status": "success", "message": "Embeddings created successfully."}, status=200)

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)
