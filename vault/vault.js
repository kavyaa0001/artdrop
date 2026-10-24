// =============================================================================
// ArtDrop - User Vault Logic (Firebase Integration)
// =============================================================================

import {
  auth,
  db,
  onAuthStateChanged,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy
} from "../js/firebase-config.js";

let currentUser = null;
let userProfile = null;
let allWallpapers = [];
let activeCategory = "all";

// UI Elements
const vaultAuthPill = document.getElementById("vault-auth-pill");
const accessBadge = document.getElementById("vault-access-badge");
const grid = document.getElementById("vault-wallpapers-grid");
const lockedBanner = document.getElementById("vault-locked-banner");
const catPills = document.querySelectorAll(".cat-pill");

// Local built-in catalog to guarantee users always have 20+ ready 4K wallpapers
const BUILTIN_WALLPAPERS = [
  { id: "b1", title: "Monaco GP Ferrari 4K", category: "Cars & Supercars", desktopUrl: "../images/monaco-gp-ferrari-B_kBVlhu.webp", mobileUrl: "../images/monaco-gp-ferrari-B_kBVlhu-mobile.webp" },
  { id: "b2", title: "Porsche 911 GT3 RS on Track", category: "Cars & Supercars", desktopUrl: "../images/911-branco-_gPLaf-l.webp", mobileUrl: "../images/911-branco-_gPLaf-l-mobile.webp" },
  { id: "b3", title: "Lamborghini & Black Panther", category: "Cars & Supercars", desktopUrl: "../images/lamborghini-pantera-2EogObqL.webp", mobileUrl: "../images/lamborghini-pantera-2EogObqL-mobile.webp" },
  { id: "b4", title: "The Godfather Night Syndicate", category: "Cinema & Characters", desktopUrl: "../images/godfather-DN4phphd.webp", mobileUrl: "../images/godfather-DN4phphd-mobile.webp" },
  { id: "b5", title: "Wolf of Wall Street Dollars", category: "Luxury & Wealth", desktopUrl: "../images/wolf-of-wall-street-dolar-BiTLqQ0S.webp", mobileUrl: "../images/wolf-of-wall-street-dolar-BiTLqQ0S-mobile.webp" },
  { id: "b6", title: "Superyacht & Tennis Court", category: "Luxury & Wealth", desktopUrl: "../images/tenis-iate-BCYVVHW1.webp", mobileUrl: "../images/tenis-iate-BCYVVHW1-mobile.webp" },
  { id: "b7", title: "Monk in Cosmic Meditation", category: "Aesthetic & Landscape", desktopUrl: "../images/hero-02-B7gEFLxm.webp", mobileUrl: "../images/hero-02-B7gEFLxm-mobile.webp" },
  { id: "b8", title: "Leopard & Porsche Vintage", category: "Animals & Power", desktopUrl: "../images/leopardo-porsche-DuYwwV2p.webp", mobileUrl: "../images/leopardo-porsche-DuYwwV2p-mobile.webp" },
  { id: "b9", title: "Dobermans & Ring of Fire", category: "Animals & Power", desktopUrl: "../images/dobermans-fogo-Ct3MpHXl.webp", mobileUrl: "../images/dobermans-fogo-Ct3MpHXl-mobile.webp" },
  { id: "b10", title: "Muhammad Ali in the Ring", category: "Sports & Champions", desktopUrl: "../images/hero-08-B16majfz.webp", mobileUrl: "../images/hero-08-B16majfz-mobile.webp" },
  { id: "b11", title: "Hercules & The Golden Lion", category: "Animals & Power", desktopUrl: "../images/hercules-leao-BCR6CcmM.webp", mobileUrl: "../images/hercules-leao-BCR6CcmM-mobile.webp" },
  { id: "b12", title: "Ferrari Classic Red Horse", category: "Cars & Supercars", desktopUrl: "../images/hero-03-DbrjlCTL.webp", mobileUrl: "../images/hero-03-DbrjlCTL-mobile.webp" }
];

// Check guest or admin session first
function checkGuestOrAdminSession() {
  if (localStorage.getItem("artdrop_guest_user") === "true") {
    vaultAuthPill.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-black">VIP Customer</span>
        <button id="vault-logout-btn" class="text-xs underline text-neutral-500 hover:text-black">Logout</button>
      </div>
    `;
    accessBadge.innerHTML = `
      <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        VIP ACCESS UNLOCKED
      </span>
    `;
    lockedBanner.classList.add("hidden");
    document.getElementById("vault-logout-btn")?.addEventListener("click", () => {
      localStorage.removeItem("artdrop_guest_user");
      window.location.reload();
    });
    loadWallpapers(true);
    return true;
  }
  return false;
}

if (!checkGuestOrAdminSession()) {
  loadWallpapers(false);
}

// 1. Auth Listener
onAuthStateChanged(auth, async (user) => {
  if (checkGuestOrAdminSession()) return;
  currentUser = user;
  if (user) {
    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        userProfile = userSnap.data();
      }
    } catch (e) {
      console.warn("User fetch warning:", e);
    }

    const name = (userProfile && userProfile.displayName) || user.displayName || user.email.split("@")[0];
    const isAdmin = userProfile && userProfile.role === "admin";
    const hasAccess = (userProfile && userProfile.hasAccess) || isAdmin;

    vaultAuthPill.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-black">${name}</span>
        ${isAdmin ? '<a href="/admin/" class="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">Admin</a>' : ''}
      </div>
    `;

    if (hasAccess) {
      accessBadge.innerHTML = `
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          VIP ACCESS UNLOCKED
        </span>
      `;
      lockedBanner.classList.add("hidden");
    } else {
      accessBadge.innerHTML = `
        <a href="/#oferta" class="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition">
          Unlock VIP Pass
        </a>
      `;
      lockedBanner.classList.remove("hidden");
    }

    loadWallpapers(hasAccess);
  } else {
    vaultAuthPill.innerHTML = `
      <a href="/" class="rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Sign In</a>
    `;
    accessBadge.innerHTML = `
      <a href="/#oferta" class="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition">
        Unlock VIP Pass
      </a>
    `;
    lockedBanner.classList.remove("hidden");
    loadWallpapers(false);
  }
});

// 2. Load Wallpapers (Local API First + Fast Fallback)
async function loadWallpapers(isUnlocked) {
  // Strategy 1: Fetch directly from Local Server Database
  try {
    const res = await fetch(`/api/wallpapers?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allWallpapers = data;
        renderGrid(isUnlocked);
        return;
      }
    }
  } catch (e) {
    console.warn("Local API fetch warning:", e);
  }

  // Strategy 1.5: Static file fallback (/data/wallpapers.json) for static hosting
  try {
    const res = await fetch(`/data/wallpapers.json?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allWallpapers = data;
        renderGrid(isUnlocked);
        return;
      }
    }
  } catch (e) {}

  // Strategy 2: Fast timeout fallback to Firestore + Built-ins
  allWallpapers = [...BUILTIN_WALLPAPERS];
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 800));
    const snapshot = await Promise.race([
      getDocs(query(collection(db, "wallpapers"), orderBy("createdAt", "desc"))),
      timeoutPromise
    ]);
    snapshot.forEach(docSnap => {
      allWallpapers.unshift({ id: docSnap.id, ...docSnap.data() });
    });
  } catch (e) {
    console.warn("Firestore wallpapers fetch note:", e.message);
  }

  renderGrid(isUnlocked);
}

// 3. Render Grid with Filtering
function renderGrid(isUnlocked) {
  const filtered = activeCategory === "all" 
    ? allWallpapers 
    : allWallpapers.filter(w => w.category === activeCategory);

  grid.innerHTML = "";

  filtered.forEach(wp => {
    const card = document.createElement("div");
    card.className = "vault-card group";

    card.innerHTML = `
      <div class="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
        <img src="${wp.desktopUrl}" alt="${wp.title}" class="h-full w-full object-cover group-hover:scale-105 transition duration-500">
        <span class="absolute top-3 left-3 rounded-full bg-black/75 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
          ${wp.category}
        </span>
      </div>

      <div class="p-4">
        <h3 class="text-xs font-bold text-black truncate mb-3">${wp.title}</h3>

        ${isUnlocked ? `
          <div class="grid grid-cols-2 gap-2">
            <a href="${wp.desktopUrl}" download="${wp.title}_Desktop_4K" target="_blank" class="flex items-center justify-center gap-1.5 rounded-xl border border-black/15 bg-white py-2 px-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition shadow-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Desktop 4K
            </a>
            <a href="${wp.mobileUrl || wp.desktopUrl}" download="${wp.title}_Mobile_4K" target="_blank" class="flex items-center justify-center gap-1.5 rounded-xl border border-black/15 bg-white py-2 px-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition shadow-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Phone 4K
            </a>
          </div>
        ` : `
          <a href="/#oferta" class="block w-full text-center rounded-xl bg-neutral-100 py-2.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:bg-black hover:text-white transition">
            🔒 Locked (Get VIP)
          </a>
        `}
      </div>
    `;

    grid.appendChild(card);
  });
}

// 4. Filter Button Clicks
catPills.forEach(pill => {
  pill.addEventListener("click", () => {
    catPills.forEach(p => {
      p.classList.remove("bg-black", "text-white");
      p.classList.add("bg-neutral-100", "text-black");
    });
    pill.classList.remove("bg-neutral-100", "text-black");
    pill.classList.add("bg-black", "text-white");

    activeCategory = pill.getAttribute("data-cat");
    const hasAccess = (userProfile && userProfile.hasAccess) || (userProfile && userProfile.role === "admin");
    renderGrid(hasAccess);
  });
});
