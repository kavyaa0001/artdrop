import urllib.request

content = urllib.request.urlopen('http://localhost:8000/').read().decode('utf-8')
assert 'id="hero-marquee-track"' in content, "Missing hero-marquee-track in homepage"
assert 'js/dynamic-homepage.js' in content, "Missing dynamic-homepage.js in homepage"
print("HOMEPAGE HTTP 200 OK & Verified!")

admin_content = urllib.request.urlopen('http://localhost:8000/admin/').read().decode('utf-8')
assert 'tab-btn-marquee' in admin_content, "Missing tab-btn-marquee in admin"
assert 'tab-content-marquee' in admin_content, "Missing tab-content-marquee in admin"
print("ADMIN PANEL HTTP 200 OK & Verified!")
