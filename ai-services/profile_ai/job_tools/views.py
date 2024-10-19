from openai import OpenAI
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from fpdf import FPDF
import os
from pinecone import Pinecone
from django.conf import settings
import logging
import json
from pylatex import Document, Section, Command, Itemize, Package
from pylatex.utils import italic
from scipy.spatial.distance import cosine
import subprocess
from docx import Document
import re




# Initialize Pinecone
# Initialize Pinecone and MongoDB
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

# Initialize OpenAI
os.environ['OPENAI_API_KEY'] = settings.OPENAI_API_KEY

client = OpenAI()

logger = logging.getLogger('profile_ai')

@csrf_exempt
def generate_resume(request):
    if request.method == 'POST':
        try:
            # Parse the POST request data
            data = json.loads(request.body)
            user_id = data.get('user_id')
            job_description = data.get('job_description')
            additional_prompt = data.get('prompt', '')  # Optional prompt
            tex_file_path = settings.TEX_RESUME_FORMAT_PATH

            if not user_id:
                return JsonResponse({"status": "error", "message": "user_id is required."}, status=400)

            # Step 1: Get user embeddings

            # Step 2: Generate job description embedding
            logger.debug("Calling get_job_description_embedding...")
            job_embedding = get_job_description_embedding(job_description)


            logger.debug("Calling get_matching_embeddings...")
            relevant_documents = get_matching_embeddings(user_id,job_embedding)

#             # Step 3: Find best matching documents
#             logger.debug("Before calling find_best_matching_documents")
#             relevant_documents = find_best_matching_documents(job_embedding, user_embeddings)
#             logger.debug("After calling find_best_matching_documents")
            tex_format = read_tex_file(tex_file_path)

            # Step 4: Generate the LaTeX resume using LLM
            logger.debug("Calling generate_latex_resume_with_llm...")
            query_response = generate_resume_with_llm(job_description, relevant_documents,tex_format)

            #Step 5 : Extract latex code from the response
            logger.debug("Calling extract_latex_code...")
            latex_code = extract_latex_code(query_response)

            #logger.debug("Resume Content : ",query_response)



            # Step 6: Save the resume as a Word document
            output_dir = "resumes/"  # Directory to store the resume files
            file_name = f"resume_{user_id}"
            try:
                #docx_file_path = save_resume_as_word(resume_content, output_dir, file_name)
                docx_file_path = compile_latex_to_pdf(latex_code, output_dir, file_name)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)


            # Step 6: Return the .docx file path
            return JsonResponse({'docx_file_path': docx_file_path}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)

def read_tex_file(tex_file_path):
    with open(tex_file_path, 'r') as file:
        return file.read()

def get_matching_embeddings(user_id,job_embedding):
    # Query Pinecone for user-specific embeddings
    logger.debug("inside get user embeddings")
    query_filter = {"user_id": {"$eq" : user_id}}
    logger.debug("Query Filter :",query_filter)

    try:
        response = index.query(
            top_k=10,  # Retrieve top 10 matches
            vector = job_embedding,
            filter=query_filter,
            include_metadata=True
        )
    except Exception as e:
        logger.error(e)

    return response.matches

def get_job_description_embedding(job_description):
    response = client.embeddings.create(
        input=job_description,
        model="text-embedding-ada-002"
    )
    return response.data[0].embedding

def extract_latex_code(text):
    # Define the regular expression pattern to capture everything between \documentclass and \end{document}
    pattern = r"(\\documentclass.*?\\end{document})"

    # Use re.DOTALL to ensure the pattern matches across multiple lines
    match = re.search(pattern, text, re.DOTALL)

    # Check if a match was found
    if match:
        return match.group(1)
    else:
        return None

def get_document_content(doc):
    # If the document type is 'text', return the journal_text from metadata
    if doc['metadata'].get('type') == 'text':
        return doc['metadata'].get('journal_text', '')

    # If the document type is 'file', read the file content
    elif doc['metadata'].get('type') == 'file':
        file_path = doc['metadata'].get('file_path', '')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        else:
            return "File not found."

    # Return empty string if neither type is matched
    return ""

def generate_latex_resume_with_llm(job_description, relevant_documents,tex_format):
    prompt = """
        I want you to create a resume based on the following job description and user-specific document details.
        Please output the resume in LaTeX format.

        Job Description: {}

        User's Relevant Experience and Skills (from documents):
        """.format(job_description)

    for doc in relevant_documents:
        content = get_document_content(doc)
        prompt += f"\nTitle: {doc['metadata'].get('title', 'No Title')}\nContent: {content}\n\n"

    prompt += "Generate the resume in LaTeX code format that highlights the user's experience, skills, and projects relevant to the job description."
    prompt += f"\nUse the following LaTeX format to guide the structure: {tex_format}\n\n"

    # Use GPT to generate the resume based on the prompt
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": prompt}]
    )

    latex_code = response.choices[0].message.content
    return latex_code

def find_best_matching_documents(job_embedding, user_embeddings):
    matches = []
    for doc in user_embeddings:
        similarity = 1 - cosine(job_embedding, doc['values'])  # Cosine similarity
        doc['similarity'] = similarity
        matches.append(doc)

    # Sort matches based on similarity score
    sorted_matches = sorted(matches, key=lambda x: x['similarity'], reverse=True)
    return sorted_matches[:5]  # Return top 5 most relevant documents


def generate_resume_with_llm(job_description, relevant_documents,tex_format):
    prompt = """
    I want you to create a resume based on the following job description and user-specific document details.

    Job Description: {}

    User's Relevant Experience and Skills (from documents):
    """.format(job_description)

    for doc in relevant_documents:
        content = get_document_content(doc)
        prompt += f"\nTitle: {doc['metadata'].get('title', 'No Title')}\nContent: {content}\n\n"

    prompt += "Generate the resume in latex code format that highlights the user's experience, skills, and projects relevant to the job description. Make the formatting such that maximum content fits in a singe page. keep the borders minimum."
    prompt += f"\nUse the following LaTeX format to guide the structure {tex_format}\n\n"
    # Use GPT to generate the resume content in plain text
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": prompt}]
    )

    resume_content = response.choices[0].message.content
    return resume_content


def compile_latex_to_pdf(latex_code, output_dir, file_name):
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Define paths
    tex_file_path = os.path.join(output_dir, f"{file_name}.tex")
    pdf_file_path = os.path.join(output_dir, f"{file_name}.pdf")

    # Write LaTeX code to .tex file
    with open(tex_file_path, 'w') as tex_file:
        tex_file.write(latex_code)


    # Create a PyLaTeX document
    try:
        #subprocess.run(['pdflatex', tex_file_path], check=True)
        subprocess.run(
            ['pdflatex', '-output-directory', output_dir, tex_file_path],
            check=True
        )
        print(f"PDF has been generated successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error during PDF generation: {e}")

    # Generate PDF
#     pdf_path = os.path.join(output_dir, file_name)
#     doc.generate_pdf(pdf_path, clean_tex=False)

    # Check if PDF was generated
    if os.path.exists(pdf_file_path):
        return pdf_file_path
    else:
        raise Exception("PDF generation failed.")

def save_resume_as_word(resume_content, output_dir, file_name):
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Define file path
    docx_file_path = os.path.join(output_dir, f"{file_name}.docx")

    # Create a new Document
    doc = Document()

    # Add content to the document
    for paragraph in resume_content.split("\n\n"):  # Split by double newlines for paragraphs
        doc.add_paragraph(paragraph)

    # Save the document
    doc.save(docx_file_path)

    return docx_file_path
