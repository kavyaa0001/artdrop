import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("checkout/index.html", "r", encoding="utf-8") as f:
    html = f.read()

assert "upi-qr-image" not in html, "ERROR: upi-qr-image still found in checkout/index.html!"
assert "create-qr-code" not in html, "ERROR: QR API url still found in checkout/index.html!"
assert "karanpw.live@oksbi" in html, "ERROR: UPI ID missing in checkout/index.html!"
assert "your packaged has been booked admin send you wallapers very soon on your email adress" in html, "ERROR: confirmation text missing!"
assert "processBooking" in html, "ERROR: processBooking missing!"

print("✓ checkout/index.html passed all checks! (No barcode scanner, instant submit logic confirmed)")

with open("js/checkout.js", "r", encoding="utf-8") as f:
    js = f.read()

assert "checkout-upi-qr" not in js, "ERROR: checkout-upi-qr still in js/checkout.js!"
assert "create-qr-code" not in js, "ERROR: QR API still in js/checkout.js!"
assert "karanpw.live@oksbi" in js, "ERROR: UPI ID missing in js/checkout.js!"
assert "your packaged has been booked admin send you wallapers very soon on your email adress" in js, "ERROR: confirmation text missing in js/checkout.js!"

print("✓ js/checkout.js passed all checks! (No barcode scanner, instant submit logic confirmed)")
