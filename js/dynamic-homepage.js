// =============================================================================
// ArtDrop - Dynamic Homepage (Marquee Showcase, Collection Gallery & Pricing)
// =============================================================================

import {
  db,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit
} from "./firebase-config.js";

// Initialize dynamic homepage sequentially without blocking dependencies
export async function initDynamicHomepage() {
  // 1. Sync hero marquee showcase immediately
  try {
    await syncHeroMarquee();
  } catch (err) {
    console.warn("[ArtDrop] Hero marquee notice:", err);
  }

  // 2. Sync collection gallery immediately
  try {
    await syncDynamicGallery();
  } catch (err) {
    console.warn("[ArtDrop] Dynamic gallery notice:", err);
  }

  // 3. Sync live pricing
  try {
    await syncLivePricing();
  } catch (err) {
    console.warn("[ArtDrop] Live pricing notice:", err);
  }
}

// 1. Live Pricing (Local API First, Firestore Fallback)
async function syncLivePricing() {
  let data = null;

  // Strategy 1: Fetch from local server API
  try {
    const res = await fetch(`/api/pricing?t=${Date.now()}`);
    if (res.ok) {
      data = await res.json();
    }
  } catch (e) {}

  // Strategy 1.5: Static file fallback (data/pricing.json) for static hosting
  if (!data) {
    try {
      const res = await fetch(`/data/pricing.json?t=${Date.now()}`);
      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {}
  }

  // Strategy 2: Fast timeout fallback to Firestore
  if (!data) {
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 500));
      const snap = await Promise.race([
        getDoc(doc(db, "settings", "pricing")),
        timeoutPromise
      ]);
      if (snap && snap.exists()) {
        data = snap.data();
      }
    } catch (err) {}
  }

  if (data) {
    const standardPrice = data.standardPrice ? `₹${data.standardPrice}` : "₹49";
    const vipPrice = data.vipPrice ? `₹${data.vipPrice}` : "₹149";
    const tagText = data.tagText || "40% OFF";

    // Update Pricing cards
    const priceCards = document.querySelectorAll("#oferta .text-4xl.font-semibold");
    if (priceCards.length >= 2) {
      priceCards[0].textContent = standardPrice;
      priceCards[1].textContent = vipPrice;
    }

    // Update discount tag
    if (tagText) {
      const discountBadges = document.querySelectorAll("#oferta span.rounded-full");
      discountBadges.forEach(b => {
        if (b.textContent.includes("%") || b.textContent.includes("OFF")) {
          b.textContent = tagText;
        }
      });
    }

    // Update Sticky bottom bar
    const stickySpan = document.querySelector(".fixed.inset-x-0.bottom-0 span");
    if (stickySpan && data.standardPrice) {
      stickySpan.textContent = `+50 exclusive 4K wallpapers • Now from ${standardPrice}`;
    }
  }
}

// Helper: Fetch live wallpapers from local server API with strict timeout fallback
async function getLiveWallpapers() {
  // Strategy 1: Local Server Database (/api/wallpapers)
  try {
    const res = await fetch(`/api/wallpapers?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {}

  // Strategy 1.5: Static file fallback (/data/wallpapers.json) for static hosting
  try {
    const res = await fetch(`/data/wallpapers.json?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {}

  // Strategy 2: Firestore query with 800ms race timeout
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 800));
    const snapshot = await Promise.race([
      getDocs(query(collection(db, "wallpapers"), orderBy("createdAt", "desc"), limit(30))),
      timeoutPromise
    ]);
    const items = [];
    snapshot.forEach(docSnap => items.push({ id: docSnap.id, ...docSnap.data() }));
    return items;
  } catch (e) {
    return [];
  }
}

// 2. Dynamic Gallery from Database
async function syncDynamicGallery() {
  try {
    const customWallpapers = await getLiveWallpapers();
    if (!customWallpapers || customWallpapers.length === 0) return;

    const galleryGrid = document.querySelector("#galeria [class*='grid']") || document.querySelector("#galeria .grid");
    if (!galleryGrid) return;

    // Render cards for every wallpaper in database (newest uploaded item is first)
    const cardsHtml = customWallpapers.map((wp) => {
      const imgSrc = wp.desktopUrl || wp.previewUrl || wp.mobileUrl;

      return `
        <div class="group relative overflow-hidden rounded-2xl border border-black/10 shadow-sm aspect-[16/10] bg-neutral-900 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
          <img loading="lazy" src="${imgSrc}" alt="${wp.title}" class="h-full w-full object-cover group-hover:scale-105 transition duration-700">
          <div class="watermark" aria-hidden="true">
            <div class="watermark-text watermark-text-sm"></div>
            <div class="watermark-text watermark-text-sm" style="top:30%"></div>
            <div class="watermark-text watermark-text-sm" style="top:-30%"></div>
          </div>
          <span class="absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-md border border-black/10" style="background-color: #ffffff !important; color: #000000 !important;">
            4K ULTRA HD
          </span>
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
            <div>
              <span class="rounded-full bg-white text-black px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                ${wp.category || "Impasto Art"}
              </span>
              <p class="text-white text-sm sm:text-base font-extrabold truncate mt-1.5">${wp.title}</p>
              <p class="text-white/70 text-[11px] font-mono mt-0.5">4K Ultra HD • Watermark-free in pack</p>
            </div>
          </div>
        </div>
      `;
    }).join("");

    galleryGrid.innerHTML = cardsHtml;
    console.log(`[ArtDrop] Synced ${customWallpapers.length} live wallpapers to Homepage Gallery!`);

  } catch (err) {
    console.warn("Dynamic gallery sync warning:", err);
  }
}

// 3. Dynamic Hero Scrolling Showcase (Marquee) from Database
async function syncHeroMarquee() {
  try {
    const marqueeTrack = document.getElementById("hero-marquee-track");
    if (!marqueeTrack) return;

    const allWallpapers = await getLiveWallpapers();
    if (!allWallpapers || allWallpapers.length === 0) return;

    // Filter only wallpapers enabled for the hero marquee
    let marqueeItems = allWallpapers.filter(wp => wp.showInMarquee === true || wp.showInMarquee === "true");

    // Fallback: If none flagged, feature first 8
    if (marqueeItems.length === 0) {
      marqueeItems = allWallpapers.slice(0, 8);
    }

    if (marqueeItems.length === 0) return;

    // Helper to render luxury dual-device mockup card
    function renderMarqueeCard(item) {
      const desktopImg = item.desktopUrl || item.previewUrl;
      const mobileImg = item.mobileUrl || item.desktopUrl;
      const title = item.title || "ArtDrop 4K Masterpiece";

      return `
        <div class="relative w-[240px] shrink-0 sm:w-[300px] md:w-[360px]">
          <div class="relative">
            <div class="rounded-[16px] bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-950 p-[7px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
              <div class="relative aspect-[16/10] overflow-hidden rounded-[9px] bg-black ring-1 ring-black/60">
                <img loading="lazy" src="${desktopImg}" alt="${title}" decoding="async" class="absolute inset-0 h-full w-full object-cover">
                <div class="watermark" aria-hidden="true">
                  <div class="watermark-text watermark-text-sm"></div>
                  <div class="watermark-text watermark-text-sm" style="top:30%"></div>
                  <div class="watermark-text watermark-text-sm" style="top:-30%"></div>
                </div>
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent" aria-hidden="true"></div>
              </div>
              <div class="absolute left-1/2 top-[2px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-neutral-600" aria-hidden="true"></div>
            </div>
            <div class="mx-auto h-[7px] w-[108%] -translate-x-[3.7%] rounded-b-[12px] bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-950 shadow-[0_14px_24px_-10px_rgba(0,0,0,0.7)]"></div>
            <div class="mx-auto h-[4px] w-[26%] rounded-b-full bg-gradient-to-b from-neutral-700 to-neutral-900"></div>
          </div>
          <div class="absolute bottom-2 -right-4 z-10 w-[36%] sm:bottom-3 sm:-right-6 sm:w-[37%]">
            <div class="relative rounded-[20px] bg-gradient-to-b from-neutral-500 via-neutral-800 to-neutral-950 p-[2.5px] shadow-[0_28px_50px_-16px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
              <div class="absolute -left-[2px] top-[22%] h-[7%] w-[2px] rounded-l-sm bg-neutral-600" aria-hidden="true"></div>
              <div class="absolute -left-[2px] top-[33%] h-[7%] w-[2px] rounded-l-sm bg-neutral-600" aria-hidden="true"></div>
              <div class="absolute -right-[2px] top-[28%] h-[11%] w-[2px] rounded-r-sm bg-neutral-600" aria-hidden="true"></div>
              <div class="relative overflow-hidden rounded-[18px] bg-black p-[2px]">
                <div class="relative aspect-[3/5] overflow-hidden rounded-[16px] bg-black">
                  <img loading="lazy" src="${mobileImg}" alt="${title}" aria-hidden="true" decoding="async" class="absolute inset-0 h-full w-full object-cover">
                  <div class="watermark" aria-hidden="true">
                    <div class="watermark-text watermark-text-sm"></div>
                    <div class="watermark-text watermark-text-sm" style="top:30%"></div>
                    <div class="watermark-text watermark-text-sm" style="top:-30%"></div>
                  </div>
                  <div class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15" aria-hidden="true"></div>
                  <div class="absolute left-1/2 top-[3%] h-[4.2%] w-[34%] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" aria-hidden="true"></div>
                  <div class="absolute bottom-[1.6%] left-1/2 h-[2px] w-[30%] -translate-x-1/2 rounded-full bg-white/70" aria-hidden="true"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Build continuous infinite loop (needs at least 8 items for -50% translation)
    let loopList = marqueeItems;
    while (loopList.length < 8) {
      loopList = loopList.concat(marqueeItems);
    }

    // Duplicated sets for seamless CSS marquee
    const fullHtml = loopList.map(renderMarqueeCard).join("") + loopList.map(renderMarqueeCard).join("");
    marqueeTrack.innerHTML = fullHtml;

    console.log(`[ArtDrop] Synced ${marqueeItems.length} wallpapers into dynamic hero marquee!`);

  } catch (err) {
    console.warn("Hero marquee sync warning:", err);
  }
}

// Auto start if DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDynamicHomepage);
} else {
  initDynamicHomepage();
}
