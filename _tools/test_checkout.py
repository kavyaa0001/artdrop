import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

urls = [
    "http://127.0.0.1:8000/checkout/",
    "http://127.0.0.1:8000/checkout/index.html",
    "http://127.0.0.1:8000/checkout/essential.html",
    "http://127.0.0.1:8000/checkout/complete.html",
    "http://127.0.0.1:8000/index.html",
    "http://127.0.0.1:8000/collection.html",
]

print("=== CHECKING HTTP GET RESPONSES ===")
for u in urls:
    try:
        req = urllib.request.Request(u)
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8')
            print(f"OK [Status {resp.status}]: {u} ({len(content)} bytes)")
    except Exception as e:
        print(f"FAILED: {u} -> {e}")

print("\n=== TESTING POST /api/orders ===")
try:
    test_order = {
        "customerName": "Test Karan",
        "customerEmail": "karan.test@gmail.com",
        "customerPhone": "+91 9999999999",
        "packType": "Complete Vault Collection (22+ Artworks)",
        "packPrice": 149,
        "transactionUtr": "TEST-UTR-12345",
        "status": "Booked"
    }
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/orders",
        data=json.dumps(test_order).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))
        print(f"POST /api/orders SUCCESS: {res_data}")
except Exception as e:
    print(f"POST /api/orders FAILED -> {e}")

print("\n=== VERIFYING ORDER RECORD IN /api/orders GET ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/api/orders") as resp:
        orders = json.loads(resp.read().decode('utf-8'))
        print(f"Total orders in DB: {len(orders)}")
        if orders:
            print("Latest order:", orders[0])
except Exception as e:
    print(f"GET /api/orders FAILED -> {e}")
