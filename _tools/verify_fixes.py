import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("checkout/index.html", "r", encoding="utf-8") as f:
    html = f.read()

assert "karanpw.live@oksbi" not in html, "ERROR: UPI ID still in checkout/index.html!"
assert "Pay via UPI" not in html, "ERROR: Pay via UPI still in checkout/index.html!"
assert "upi-qr" not in html, "ERROR: QR still in checkout/index.html!"
assert "karanpw.live@gmail.com" in html, "ERROR: Recipient mail missing!"
assert "your packaged has been booked admin send you wallapers very soon on your email adress" in html, "ERROR: Confirmation text missing!"
assert "cust-name" in html, "ERROR: Name field missing!"
assert "cust-email" in html, "ERROR: Email field missing!"
assert "Book Package Now" in html, "ERROR: Book button missing!"

print("✓ checkout/index.html passed all assertions!")

with open("js/checkout.js", "r", encoding="utf-8") as f:
    js = f.read()

assert "karanpw.live@oksbi" not in js, "ERROR: UPI ID still in js/checkout.js!"
assert "Pay via UPI" not in js, "ERROR: Pay via UPI still in js/checkout.js!"
assert "karanpw.live@gmail.com" in js, "ERROR: Recipient mail missing in js/checkout.js!"
assert "your packaged has been booked admin send you wallapers very soon on your email adress" in js, "ERROR: Confirmation text missing in js/checkout.js!"

print("✓ js/checkout.js passed all assertions!")

# Check server HTTP response
urls = [
    "http://127.0.0.1:8000/checkout/",
    "http://127.0.0.1:8000/checkout/index.html",
    "http://127.0.0.1:8000/checkout/essential.html",
    "http://127.0.0.1:8000/checkout/complete.html",
]

for u in urls:
    req = urllib.request.Request(u)
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200
        print(f"✓ HTTP 200 OK: {u}")

print("\nALL VERIFICATIONS PASSED!")
