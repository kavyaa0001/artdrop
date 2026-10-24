with open('admin/admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

seed_code = '''
// =============================================================================
// Database Seeder (Sync Initial Catalog to Firestore)
// =============================================================================

const SEED_WALLPAPERS = [
  { title: "Monaco GP Ferrari 4K", category: "Cars & Supercars", tags: ["ferrari", "monaco", "racing", "f1"], desktopUrl: "/images/monaco-gp-ferrari-B_kBVlhu.webp", mobileUrl: "/images/monaco-gp-ferrari-B_kBVlhu-mobile.webp" },
  { title: "Porsche 911 GT3 RS on Track", category: "Cars & Supercars", tags: ["porsche", "gt3rs", "track", "white"], desktopUrl: "/images/911-branco-_gPLaf-l.webp", mobileUrl: "/images/911-branco-_gPLaf-l-mobile.webp" },
  { title: "Lamborghini & Black Panther", category: "Cars & Supercars", tags: ["lamborghini", "panther", "black", "wild"], desktopUrl: "/images/lamborghini-pantera-2EogObqL.webp", mobileUrl: "/images/lamborghini-pantera-2EogObqL-mobile.webp" },
  { title: "The Godfather Night Syndicate", category: "Cinema & Characters", tags: ["godfather", "mafia", "suit", "vintage"], desktopUrl: "/images/godfather-DN4phphd.webp", mobileUrl: "/images/godfather-DN4phphd-mobile.webp" },
  { title: "Wolf of Wall Street Dollars", category: "Luxury & Wealth", tags: ["money", "dollars", "wallstreet", "gold"], desktopUrl: "/images/wolf-of-wall-street-dolar-BiTLqQ0S.webp", mobileUrl: "/images/wolf-of-wall-street-dolar-BiTLqQ0S-mobile.webp" },
  { title: "Superyacht & Tennis Court", category: "Luxury & Wealth", tags: ["yacht", "tennis", "ocean", "mediterranean"], desktopUrl: "/images/tenis-iate-BCYVVHW1.webp", mobileUrl: "/images/tenis-iate-BCYVVHW1-mobile.webp" },
  { title: "Monk in Cosmic Meditation", category: "Aesthetic & Landscape", tags: ["monk", "cosmos", "zen", "peace"], desktopUrl: "/images/hero-02-B7gEFLxm.webp", mobileUrl: "/images/hero-02-B7gEFLxm-mobile.webp" },
  { title: "Leopard & Porsche Vintage", category: "Animals & Power", tags: ["leopard", "porsche", "vintage", "retro"], desktopUrl: "/images/leopardo-porsche-DuYwwV2p.webp", mobileUrl: "/images/leopardo-porsche-DuYwwV2p-mobile.webp" },
  { title: "Dobermans & Ring of Fire", category: "Animals & Power", tags: ["dobermans", "fire", "dark", "guard"], desktopUrl: "/images/dobermans-fogo-Ct3MpHXl.webp", mobileUrl: "/images/dobermans-fogo-Ct3MpHXl-mobile.webp" },
  { title: "Muhammad Ali in the Ring", category: "Sports & Champions", tags: ["ali", "boxing", "champion", "legend"], desktopUrl: "/images/hero-08-B16majfz.webp", mobileUrl: "/images/hero-08-B16majfz-mobile.webp" },
  { title: "Hercules & The Golden Lion", category: "Animals & Power", tags: ["hercules", "lion", "mythology", "gold"], desktopUrl: "/images/hercules-leao-BCR6CcmM.webp", mobileUrl: "/images/hercules-leao-BCR6CcmM-mobile.webp" },
  { title: "Ferrari Classic Red Horse", category: "Cars & Supercars", tags: ["ferrari", "horse", "classic", "red"], desktopUrl: "/images/hero-03-DbrjlCTL.webp", mobileUrl: "/images/hero-03-DbrjlCTL-mobile.webp" }
];

const seedBtn = document.getElementById("btn-seed-catalog");
if (seedBtn) {
  seedBtn.addEventListener("click", async () => {
    seedBtn.disabled = true;
    seedBtn.textContent = "Syncing with Firestore...";

    try {
      let count = 0;
      for (const item of SEED_WALLPAPERS) {
        await addDoc(collection(db, "wallpapers"), {
          ...item,
          previewUrl: item.desktopUrl,
          downloads: Math.floor(Math.random() * 200) + 40,
          createdAt: serverTimestamp()
        });
        count++;
      }
      alert(`Success! ${count} Masterpieces have been synced to your Firestore Database!`);
      seedBtn.textContent = "✓ Synced to Firestore";
      loadStatsAndWallpapers();
    } catch (e) {
      console.error("Seeding error:", e);
      alert("Sync error: " + e.message);
      seedBtn.disabled = false;
      seedBtn.textContent = "⚡ Sync 12+ Masterpieces to Firestore";
    }
  });
}
'''

if 'btn-seed-catalog' not in js:
    js += seed_code
    with open('admin/admin.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("[OK] admin.js updated with seeder logic")
else:
    print("[INFO] Already contains seeder logic")
