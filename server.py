import http.server
import socketserver
import os
import json
import base64
import time
import re
import urllib.parse

PORT = int(os.environ.get("PORT", 8000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "images", "uploads")
DATA_DIR = os.path.join(BASE_DIR, "data")
WALLPAPERS_FILE = os.path.join(DATA_DIR, "wallpapers.json")
ORDERS_FILE = os.path.join(DATA_DIR, "orders.json")
PRICING_FILE = os.path.join(DATA_DIR, "pricing.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

def load_json(filepath, default=None):
    if default is None:
        default = []
    if not os.path.exists(filepath):
        return default
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return default

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

class ArtDropHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        # Prevent aggressive caching of APIs, dynamic modules, and HTML
        clean_path = urllib.parse.urlparse(self.path).path
        if clean_path.startswith('/api/') or clean_path.endswith('.js') or clean_path.endswith('.html') or clean_path in ('', '/'):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        clean_path = urllib.parse.urlparse(self.path).path

        if clean_path == '/api/wallpapers':
            wallpapers = load_json(WALLPAPERS_FILE, [])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(wallpapers).encode('utf-8'))
            return
            
        if clean_path == '/api/orders':
            orders = load_json(ORDERS_FILE, [])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(orders).encode('utf-8'))
            return

        if clean_path == '/api/pricing':
            pricing = load_json(PRICING_FILE, {
                "standardPrice": "49",
                "vipPrice": "149",
                "tagText": "40% OFF"
            })
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(pricing).encode('utf-8'))
            return

        super().do_GET()

    def do_POST(self):
        clean_path = urllib.parse.urlparse(self.path).path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            req_data = json.loads(body.decode('utf-8')) if body else {}
        except Exception:
            req_data = {}

        if clean_path == '/api/upload':
            try:
                raw_filename = req_data.get('filename', 'wallpaper.png')
                clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', raw_filename)
                timestamp = int(time.time() * 1000)
                final_filename = f"{timestamp}_{clean_name}"
                
                data_uri = req_data.get('data', '')
                if ',' in data_uri:
                    _, base64_str = data_uri.split(',', 1)
                else:
                    base64_str = data_uri
                    
                file_bytes = base64.b64decode(base64_str)
                target_path = os.path.join(UPLOAD_DIR, final_filename)
                with open(target_path, 'wb') as f:
                    f.write(file_bytes)
                    
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                resp = {
                    "success": True,
                    "url": f"/images/uploads/{final_filename}",
                    "filename": final_filename,
                    "size": len(file_bytes)
                }
                self.wfile.write(json.dumps(resp).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        if clean_path == '/api/wallpapers':
            try:
                wallpapers = load_json(WALLPAPERS_FILE, [])
                new_wp = {
                    "id": f"wp-{int(time.time()*1000)}",
                    "title": req_data.get("title", "4K Wallpaper"),
                    "category": req_data.get("category", "Luxury & Wealth"),
                    "tags": req_data.get("tags", []),
                    "desktopUrl": req_data.get("desktopUrl", ""),
                    "mobileUrl": req_data.get("mobileUrl", req_data.get("desktopUrl", "")),
                    "previewUrl": req_data.get("desktopUrl", ""),
                    "showInMarquee": bool(req_data.get("showInMarquee", True)),
                    "downloads": 0,
                    "createdAt": int(time.time() * 1000)
                }
                wallpapers.insert(0, new_wp)
                save_json(WALLPAPERS_FILE, wallpapers)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "wallpaper": new_wp}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        if clean_path == '/api/wallpapers/toggle-marquee':
            try:
                wp_id = req_data.get("id")
                new_state = req_data.get("showInMarquee")
                wallpapers = load_json(WALLPAPERS_FILE, [])
                found = False
                for w in wallpapers:
                    if w.get("id") == wp_id:
                        w["showInMarquee"] = bool(new_state)
                        found = True
                        break
                if found:
                    save_json(WALLPAPERS_FILE, wallpapers)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "found": found}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        if clean_path == '/api/wallpapers/delete':
            try:
                wp_id = req_data.get("id")
                wallpapers = load_json(WALLPAPERS_FILE, [])
                wallpapers = [w for w in wallpapers if w.get("id") != wp_id]
                save_json(WALLPAPERS_FILE, wallpapers)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        if clean_path == '/api/pricing':
            try:
                pricing = {
                    "standardPrice": str(req_data.get("standardPrice", "49")),
                    "vipPrice": str(req_data.get("vipPrice", "149")),
                    "tagText": str(req_data.get("tagText", "40% OFF"))
                }
                save_json(PRICING_FILE, pricing)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "pricing": pricing}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        if clean_path == '/api/orders':
            try:
                orders = load_json(ORDERS_FILE, [])
                new_order = {
                    "id": f"ord-{int(time.time()*1000)}",
                    "customerName": req_data.get("customerName", "Customer"),
                    "customerEmail": req_data.get("customerEmail", ""),
                    "customerPhone": req_data.get("customerPhone", ""),
                    "packType": req_data.get("packType", "VIP Pack"),
                    "packPrice": req_data.get("packPrice", 1499),
                    "transactionUtr": req_data.get("transactionUtr", ""),
                    "timestamp": req_data.get("timestamp", int(time.time() * 1000))
                }
                orders.insert(0, new_order)
                save_json(ORDERS_FILE, orders)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "order": new_order}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ArtDropHandler) as httpd:
        print(f"ArtDrop Server running on http://localhost:{PORT}")
        httpd.serve_forever()
