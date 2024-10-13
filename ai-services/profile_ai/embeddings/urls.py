from django.urls import path
from .views import create_embeddings_text
from .views import create_embeddings_doc


urlpatterns = [
    path('v1/create_embeddings_text/', create_embeddings_text, name='create_embeddings_text'),
    path('v1/create_embeddings_doc/', create_embeddings_doc, name='create_embeddings_doc'),
]
