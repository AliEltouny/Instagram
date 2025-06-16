from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        with open('index.html', 'r') as file:
            html_content = file.read()
        
        self.wfile.write(html_content.encode())