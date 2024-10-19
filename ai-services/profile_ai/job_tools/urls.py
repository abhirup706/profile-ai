from django.urls import path
from .views import generate_resume


urlpatterns = [
    path('v1/generate_resume/', generate_resume, name='generate_resume')
]
