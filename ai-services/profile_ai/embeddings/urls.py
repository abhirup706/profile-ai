from django.urls import path
from .views import create_embeddings_text

urlpatterns = [
    path('v1/create_embeddings_text/', create_embeddings_text, name='create_embeddings_text'),
]
