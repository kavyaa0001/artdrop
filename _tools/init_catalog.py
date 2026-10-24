import json
import time
import os

WALLPAPERS = [
    {
        "id": "wp-1",
        "title": "Tutto Passa - Naples Classic",
        "category": "Aesthetic & Landscape",
        "tags": ["naples", "italy", "vintage", "classic"],
        "desktopUrl": "/images/hero-01-QPnnDZkL.webp",
        "mobileUrl": "/images/hero-01-QPnnDZkL-mobile.webp",
        "previewUrl": "/images/hero-01-QPnnDZkL.webp",
        "showInMarquee": True,
        "downloads": 1420,
        "createdAt": int(time.time() * 1000) - 100000
    },
    {
        "id": "wp-2",
        "title": "Monk in Cosmic Meditation",
        "category": "Aesthetic & Landscape",
        "tags": ["monk", "zen", "cosmos", "serenity"],
        "desktopUrl": "/images/hero-02-B7gEFLxm.webp",
        "mobileUrl": "/images/hero-02-B7gEFLxm-mobile.webp",
        "previewUrl": "/images/hero-02-B7gEFLxm.webp",
        "showInMarquee": True,
        "downloads": 980,
        "createdAt": int(time.time() * 1000) - 95000
    },
    {
        "id": "wp-3",
        "title": "Ferrari Classic Red Horse",
        "category": "Cars & Supercars",
        "tags": ["ferrari", "red", "horse", "racing"],
        "desktopUrl": "/images/hero-03-DbrjlCTL.webp",
        "mobileUrl": "/images/hero-03-DbrjlCTL-mobile.webp",
        "previewUrl": "/images/hero-03-DbrjlCTL.webp",
        "showInMarquee": True,
        "downloads": 1840,
        "createdAt": int(time.time() * 1000) - 90000
    },
    {
        "id": "wp-4",
        "title": "Royal Polo Club",
        "category": "Luxury & Wealth",
        "tags": ["polo", "royal", "horse", "luxury"],
        "desktopUrl": "/images/hero-04-DqHc8FND.webp",
        "mobileUrl": "/images/hero-04-DqHc8FND-mobile.webp",
        "previewUrl": "/images/hero-04-DqHc8FND.webp",
        "showInMarquee": True,
        "downloads": 760,
        "createdAt": int(time.time() * 1000) - 85000
    },
    {
        "id": "wp-5",
        "title": "Lion Cubs & Supercar",
        "category": "Animals & Power",
        "tags": ["lion", "cubs", "supercar", "power"],
        "desktopUrl": "/images/hero-05-CZftGEZG.webp",
        "mobileUrl": "/images/hero-05-CZftGEZG-mobile.webp",
        "previewUrl": "/images/hero-05-CZftGEZG.webp",
        "showInMarquee": True,
        "downloads": 2100,
        "createdAt": int(time.time() * 1000) - 80000
    },
    {
        "id": "wp-6",
        "title": "Dollars on a Clothesline",
        "category": "Luxury & Wealth",
        "tags": ["dollars", "money", "cash", "wealth"],
        "desktopUrl": "/images/hero-06-D9ueXq-6.webp",
        "mobileUrl": "/images/hero-06-D9ueXq-6-mobile.webp",
        "previewUrl": "/images/hero-06-D9ueXq-6.webp",
        "showInMarquee": True,
        "downloads": 1650,
        "createdAt": int(time.time() * 1000) - 75000
    },
    {
        "id": "wp-7",
        "title": "Black Ferrari & Dark Stallion",
        "category": "Cars & Supercars",
        "tags": ["ferrari", "horse", "black", "stealth"],
        "desktopUrl": "/images/hero-07-BWi0J4NO.webp",
        "mobileUrl": "/images/hero-07-BWi0J4NO-mobile.webp",
        "previewUrl": "/images/hero-07-BWi0J4NO.webp",
        "showInMarquee": True,
        "downloads": 1920,
        "createdAt": int(time.time() * 1000) - 70000
    },
    {
        "id": "wp-8",
        "title": "Muhammad Ali in the Ring",
        "category": "Sports & Champions",
        "tags": ["ali", "boxing", "champion", "legend"],
        "desktopUrl": "/images/hero-08-B16majfz.webp",
        "mobileUrl": "/images/hero-08-B16majfz-mobile.webp",
        "previewUrl": "/images/hero-08-B16majfz.webp",
        "showInMarquee": True,
        "downloads": 2400,
        "createdAt": int(time.time() * 1000) - 65000
    },
    {
        "id": "wp-9",
        "title": "Monaco GP Ferrari 4K",
        "category": "Cars & Supercars",
        "tags": ["ferrari", "monaco", "racing", "f1"],
        "desktopUrl": "/images/monaco-gp-ferrari-B_kBVlhu.webp",
        "mobileUrl": "/images/monaco-gp-ferrari-B_kBVlhu-mobile.webp",
        "previewUrl": "/images/monaco-gp-ferrari-B_kBVlhu.webp",
        "showInMarquee": False,
        "downloads": 3100,
        "createdAt": int(time.time() * 1000) - 60000
    },
    {
        "id": "wp-10",
        "title": "Porsche 911 GT3 RS on Track",
        "category": "Cars & Supercars",
        "tags": ["porsche", "gt3rs", "track", "white"],
        "desktopUrl": "/images/911-branco-_gPLaf-l.webp",
        "mobileUrl": "/images/911-branco-_gPLaf-l-mobile.webp",
        "previewUrl": "/images/911-branco-_gPLaf-l.webp",
        "showInMarquee": False,
        "downloads": 2850,
        "createdAt": int(time.time() * 1000) - 55000
    },
    {
        "id": "wp-11",
        "title": "Lamborghini & Black Panther",
        "category": "Cars & Supercars",
        "tags": ["lamborghini", "panther", "black", "wild"],
        "desktopUrl": "/images/lamborghini-pantera-2EogObqL.webp",
        "mobileUrl": "/images/lamborghini-pantera-2EogObqL-mobile.webp",
        "previewUrl": "/images/lamborghini-pantera-2EogObqL.webp",
        "showInMarquee": False,
        "downloads": 2490,
        "createdAt": int(time.time() * 1000) - 50000
    },
    {
        "id": "wp-12",
        "title": "The Godfather Night Syndicate",
        "category": "Cinema & Characters",
        "tags": ["godfather", "mafia", "suit", "vintage"],
        "desktopUrl": "/images/godfather-DN4phphd.webp",
        "mobileUrl": "/images/godfather-DN4phphd-mobile.webp",
        "previewUrl": "/images/godfather-DN4phphd.webp",
        "showInMarquee": False,
        "downloads": 1980,
        "createdAt": int(time.time() * 1000) - 45000
    },
    {
        "id": "wp-13",
        "title": "Wolf of Wall Street Dollars",
        "category": "Luxury & Wealth",
        "tags": ["money", "dollars", "wallstreet", "gold"],
        "desktopUrl": "/images/wolf-of-wall-street-dolar-BiTLqQ0S.webp",
        "mobileUrl": "/images/wolf-of-wall-street-dolar-BiTLqQ0S-mobile.webp",
        "previewUrl": "/images/wolf-of-wall-street-dolar-BiTLqQ0S.webp",
        "showInMarquee": False,
        "downloads": 2240,
        "createdAt": int(time.time() * 1000) - 40000
    },
    {
        "id": "wp-14",
        "title": "Superyacht & Tennis Court",
        "category": "Luxury & Wealth",
        "tags": ["yacht", "tennis", "ocean", "mediterranean"],
        "desktopUrl": "/images/tenis-iate-BCYVVHW1.webp",
        "mobileUrl": "/images/tenis-iate-BCYVVHW1-mobile.webp",
        "previewUrl": "/images/tenis-iate-BCYVVHW1.webp",
        "showInMarquee": False,
        "downloads": 1560,
        "createdAt": int(time.time() * 1000) - 35000
    },
    {
        "id": "wp-15",
        "title": "Leopard & Porsche Vintage",
        "category": "Animals & Power",
        "tags": ["leopard", "porsche", "vintage", "retro"],
        "desktopUrl": "/images/leopardo-porsche-DuYwwV2p.webp",
        "mobileUrl": "/images/leopardo-porsche-DuYwwV2p-mobile.webp",
        "previewUrl": "/images/leopardo-porsche-DuYwwV2p.webp",
        "showInMarquee": False,
        "downloads": 1720,
        "createdAt": int(time.time() * 1000) - 30000
    },
    {
        "id": "wp-16",
        "title": "Dobermans & Ring of Fire",
        "category": "Animals & Power",
        "tags": ["dobermans", "fire", "dark", "guard"],
        "desktopUrl": "/images/dobermans-fogo-Ct3MpHXl.webp",
        "mobileUrl": "/images/dobermans-fogo-Ct3MpHXl-mobile.webp",
        "previewUrl": "/images/dobermans-fogo-Ct3MpHXl.webp",
        "showInMarquee": False,
        "downloads": 1890,
        "createdAt": int(time.time() * 1000) - 25000
    },
    {
        "id": "wp-17",
        "title": "Hercules & The Golden Lion",
        "category": "Animals & Power",
        "tags": ["hercules", "lion", "mythology", "gold"],
        "desktopUrl": "/images/hercules-leao-BCR6CcmM.webp",
        "mobileUrl": "/images/hercules-leao-BCR6CcmM-mobile.webp",
        "previewUrl": "/images/hercules-leao-BCR6CcmM.webp",
        "showInMarquee": False,
        "downloads": 1430,
        "createdAt": int(time.time() * 1000) - 20000
    },
    {
        "id": "wp-18",
        "title": "Mansion & Supercars Fleet",
        "category": "Luxury & Wealth",
        "tags": ["mansion", "supercars", "luxury", "estate"],
        "desktopUrl": "/images/mansao-supercarros-CPXbvVpy.webp",
        "mobileUrl": "/images/mansao-supercarros-CPXbvVpy-mobile.webp",
        "previewUrl": "/images/mansao-supercarros-CPXbvVpy.webp",
        "showInMarquee": False,
        "downloads": 2310,
        "createdAt": int(time.time() * 1000) - 15000
    },
    {
        "id": "wp-19",
        "title": "Monaco Superyacht Riviera",
        "category": "Luxury & Wealth",
        "tags": ["yacht", "monaco", "riviera", "ocean"],
        "desktopUrl": "/images/iate-bandeira-DNcxT63q.webp",
        "mobileUrl": "/images/iate-bandeira-DNcxT63q-mobile.webp",
        "previewUrl": "/images/iate-bandeira-DNcxT63q.webp",
        "showInMarquee": False,
        "downloads": 1280,
        "createdAt": int(time.time() * 1000) - 10000
    },
    {
        "id": "wp-20",
        "title": "Night Syndicate Mafia Boss",
        "category": "Cinema & Characters",
        "tags": ["mafia", "night", "suit", "syndicate"],
        "desktopUrl": "/images/mafia-noturna-CZ40ml0O.webp",
        "mobileUrl": "/images/mafia-noturna-CZ40ml0O-mobile.webp",
        "previewUrl": "/images/mafia-noturna-CZ40ml0O.webp",
        "showInMarquee": False,
        "downloads": 1640,
        "createdAt": int(time.time() * 1000) - 5000
    },
    {
        "id": "wp-21",
        "title": "Porsche & Private Golf Club",
        "category": "Luxury & Wealth",
        "tags": ["porsche", "golf", "luxury", "sport"],
        "desktopUrl": "/images/porsche-golfe-DCAlBJnk.webp",
        "mobileUrl": "/images/porsche-golfe-DCAlBJnk-mobile.webp",
        "previewUrl": "/images/porsche-golfe-DCAlBJnk.webp",
        "showInMarquee": False,
        "downloads": 1510,
        "createdAt": int(time.time() * 1000) - 4000
    },
    {
        "id": "wp-22",
        "title": "Porsche 911 in Palm Springs",
        "category": "Cars & Supercars",
        "tags": ["porsche", "palms", "california", "summer"],
        "desktopUrl": "/images/porsche-palmeiras-D4iWMw_q.webp",
        "mobileUrl": "/images/porsche-palmeiras-D4iWMw_q-mobile.webp",
        "previewUrl": "/images/porsche-palmeiras-D4iWMw_q.webp",
        "showInMarquee": False,
        "downloads": 1820,
        "createdAt": int(time.time() * 1000) - 3000
    },
    {
        "id": "wp-23",
        "title": "Portofino Italian Riviera",
        "category": "Aesthetic & Landscape",
        "tags": ["portofino", "italy", "sea", "riviera"],
        "desktopUrl": "/images/portofino-7PrNJhRU.webp",
        "mobileUrl": "/images/portofino-7PrNJhRU-mobile.webp",
        "previewUrl": "/images/portofino-7PrNJhRU.webp",
        "showInMarquee": False,
        "downloads": 1390,
        "createdAt": int(time.time() * 1000) - 2000
    },
    {
        "id": "wp-24",
        "title": "Silver Surfer Cosmic Voyage",
        "category": "Cinema & Characters",
        "tags": ["surfer", "cosmic", "galaxy", "silver"],
        "desktopUrl": "/images/surfista-prateado-espaco-novo-Dnt9le_I.webp",
        "mobileUrl": "/images/surfista-prateado-espaco-novo-Dnt9le_I-mobile.webp",
        "previewUrl": "/images/surfista-prateado-espaco-novo-Dnt9le_I.webp",
        "showInMarquee": False,
        "downloads": 1950,
        "createdAt": int(time.time() * 1000) - 1000
    }
]

os.makedirs('data', exist_ok=True)
with open('data/wallpapers.json', 'w', encoding='utf-8') as f:
    json.dump(WALLPAPERS, f, indent=2)

print(f"Generated data/wallpapers.json with {len(WALLPAPERS)} luxury website artworks!")
