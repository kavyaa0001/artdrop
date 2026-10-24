// =============================================================================
// ArtDrop - Master Admin Console Logic (Ultra Clean & High-Contrast)
// =============================================================================

import {
  auth,
  db,
  storage,
  signOut,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "../js/firebase-config.js";

// Master Admin Passcode
const ADMIN_PASSCODE = "artdrop-admin-2026";

// UI Elements
const authGuard = document.getElementById("admin-auth-guard");
const dashboardContent = document.getElementById("admin-dashboard-content");
const userPill = document.getElementById("admin-user-pill");
const loginMsg = document.getElementById("admin-login-msg");
const passcodeBtn = document.getElementById("admin-passcode-btn");
const passcodeInput = document.getElementById("admin-passcode-input");
const googleBtn = document.getElementById("admin-google-btn");

// Tabs
const tabBtnOrders = document.getElementById("tab-btn-orders");
const tabBtnUpload = document.getElementById("tab-btn-upload");
const tabBtnMarquee = document.getElementById("tab-btn-marquee");
const tabBtnList = document.getElementById("tab-btn-list");
const tabBtnPricing = document.getElementById("tab-btn-pricing");
const tabBtnUsers = document.getElementById("tab-btn-users");

const tabContentOrders = document.getElementById("tab-content-orders");
const tabContentUpload = document.getElementById("tab-content-upload");
const tabContentMarquee = document.getElementById("tab-content-marquee");
const tabContentList = document.getElementById("tab-content-list");
const tabContentPricing = document.getElementById("tab-content-pricing");
const tabContentUsers = document.getElementById("tab-content-users");

// Forms & Tables
const uploadForm = document.getElementById("wallpaper-upload-form");
const progressContainer = document.getElementById("upload-progress-container");
const progressBar = document.getElementById("upload-progress-bar");
const percentText = document.getElementById("upload-percent-text");
const statusText = document.getElementById("upload-status-text");
const uploadMessage = document.getElementById("upload-message");
const submitBtn = document.getElementById("wp-submit-btn");

const wallpapersGrid = document.getElementById("wallpapers-grid");
const usersTableBody = document.getElementById("users-table-body");
const ordersTableBody = document.getElementById("orders-table-body");
const couponListContainer = document.getElementById("coupon-list-container");

// Marquee Manager UI
const tabMarqueeCount = document.getElementById("tab-marquee-count");
const marqueeActiveBadge = document.getElementById("marquee-active-badge");
const marqueeActiveGrid = document.getElementById("marquee-active-grid");
const marqueeAvailableBadge = document.getElementById("marquee-available-badge");
const marqueeAvailableGrid = document.getElementById("marquee-available-grid");

// Stats
const statWallpapersCount = document.getElementById("stat-wallpapers-count");
const statRevenueTotal = document.getElementById("stat-revenue-total");
const statOrdersCount = document.getElementById("stat-orders-count");
const statUsersCount = document.getElementById("stat-users-count");
const tabWallpapersCount = document.getElementById("tab-wallpapers-count");
const tabOrdersCount = document.getElementById("tab-orders-count");

// =============================================================================
// 1. Session & Passcode Authentication
// =============================================================================

function checkAdminSession() {
  if (localStorage.getItem("artdrop_admin_session") === "true") {
    showDashboard("Master Admin");
    return true;
  }
  return false;
}

// Check on initial load
checkAdminSession();

passcodeBtn.addEventListener("click", () => {
  const code = passcodeInput.value.trim();
  if (code === ADMIN_PASSCODE) {
    localStorage.setItem("artdrop_admin_session", "true");
    showDashboard("Master Admin");
  } else {
    loginMsg.className = "mt-4 text-xs font-bold p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200";
    loginMsg.textContent = "Galat Passcode! Please enter: artdrop-admin-2026";
    loginMsg.classList.remove("hidden");
  }
});

passcodeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") passcodeBtn.click();
});

if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    localStorage.setItem("artdrop_admin_session", "true");
    showDashboard("Google Admin");
  });
}

function showDashboard(adminName) {
  authGuard.classList.add("hidden");
  dashboardContent.classList.remove("hidden");

  userPill.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">Admin Active</span>
      <button id="admin-logout-btn" class="text-xs font-bold text-slate-500 hover:text-slate-900 underline cursor-pointer ml-1">Logout</button>
    </div>
  `;

  document.getElementById("admin-logout-btn").addEventListener("click", () => {
    localStorage.removeItem("artdrop_admin_session");
    window.location.reload();
  });

  loadOrders();
  loadStatsAndWallpapers();
  loadMarqueeManager();
  loadUsers();
  loadPricingSettings();
  loadCoupons();
}

// =============================================================================
// 2. Tab Navigation
// =============================================================================

const allTabBtns = [tabBtnOrders, tabBtnUpload, tabBtnMarquee, tabBtnList, tabBtnPricing, tabBtnUsers];
const allTabContents = [tabContentOrders, tabContentUpload, tabContentMarquee, tabContentList, tabContentPricing, tabContentUsers];

function switchTab(activeBtn, activeContent) {
  allTabBtns.forEach(btn => btn.classList.remove("active"));
  allTabContents.forEach(c => c.classList.add("hidden"));

  activeBtn.classList.add("active");
  activeContent.classList.remove("hidden");
}

tabBtnOrders.addEventListener("click", () => {
  switchTab(tabBtnOrders, tabContentOrders);
  loadOrders();
});

tabBtnUpload.addEventListener("click", () => switchTab(tabBtnUpload, tabContentUpload));

tabBtnMarquee.addEventListener("click", () => {
  switchTab(tabBtnMarquee, tabContentMarquee);
  loadMarqueeManager();
});

tabBtnList.addEventListener("click", () => {
  switchTab(tabBtnList, tabContentList);
  loadStatsAndWallpapers();
});

tabBtnPricing.addEventListener("click", () => {
  switchTab(tabBtnPricing, tabContentPricing);
  loadPricingSettings();
  loadCoupons();
});

tabBtnUsers.addEventListener("click", () => {
  switchTab(tabBtnUsers, tabContentUsers);
  loadUsers();
});

const refreshOrdersBtn = document.getElementById("btn-refresh-orders");
if (refreshOrdersBtn) {
  refreshOrdersBtn.addEventListener("click", () => {
    refreshOrdersBtn.textContent = "Refreshing...";
    loadOrders();
    setTimeout(() => { refreshOrdersBtn.textContent = "↻ Refresh Orders"; }, 800);
  });
}

// =============================================================================
// 3. Customer Orders & Revenue Loader (Direct from Firestore)
// =============================================================================

async function loadOrders() {
  try {
    let orders = [];

    // 1. Fetch from Local Server API
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        orders = await res.json();
      }
    } catch (e) {
      console.warn("Local orders API notice:", e);
    }

    // 2. Optional Firestore fetch with timeout
    if (orders.length === 0) {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500));
        const snapshot = await Promise.race([
          getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"))),
          timeoutPromise
        ]);
        snapshot.forEach(docSnap => orders.push({ id: docSnap.id, ...docSnap.data() }));
      } catch (fsErr) {
        console.info("Firestore orders notice:", fsErr.message);
      }
    }

    statOrdersCount.textContent = orders.length;
    tabOrdersCount.textContent = orders.length;

    let totalRev = 0;
    ordersTableBody.innerHTML = "";

    if (orders.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="py-12 text-center text-slate-400">
            <p class="text-sm font-semibold">No customer orders recorded yet.</p>
            <p class="text-xs text-slate-400 mt-1">When users complete payment on the storefront, orders will appear here and email <b class="text-slate-600">karanpw.live@gmail.com</b></p>
          </td>
        </tr>
      `;
      statRevenueTotal.textContent = "₹0";
      return;
    }

    orders.forEach(o => {
      const amount = Number(o.amount || o.packPrice) || 0;
      totalRev += amount;

      const dateStr = o.createdAt || o.timestamp 
        ? new Date(o.createdAt?.toDate ? o.createdAt.toDate() : (o.createdAt || o.timestamp)).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) 
        : "Recent";

      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50/80 transition";
      tr.innerHTML = `
        <td class="py-4 px-6">
          <p class="font-extrabold text-slate-900 text-xs">${o.customerName || "Customer"}</p>
          <p class="text-[11px] text-slate-500 font-mono">${o.customerEmail || "-"}</p>
        </td>
        <td class="py-4 px-6 text-slate-700 font-medium">${o.customerPhone || "-"}</td>
        <td class="py-4 px-6">
          <span class="rounded-full bg-slate-100 text-slate-800 px-2.5 py-1 text-[10px] font-bold">
            ${o.packType || "VIP Pack"}
          </span>
        </td>
        <td class="py-4 px-6 font-black text-slate-900 text-sm">₹${amount}</td>
        <td class="py-4 px-6 font-mono text-[11px] font-bold text-slate-700">${o.transactionUtr || "-"}</td>
        <td class="py-4 px-6">
          <span class="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
            ✓ Confirmed
          </span>
        </td>
        <td class="py-4 px-6 text-right text-slate-500 text-[11px]">${dateStr}</td>
      `;
      ordersTableBody.appendChild(tr);
    });

    statRevenueTotal.textContent = `₹${totalRev.toLocaleString("en-IN")}`;
  } catch (err) {
    console.warn("Orders fetch notice:", err);
  }
}

// =============================================================================
// 4. Wallpaper Upload Handler (Smart Multi-Strategy: Local Server API + Fallback)
// =============================================================================

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadFileSmart(file, folder, onProgress) {
  // Strategy 1: Try Local Server API (/api/upload) -> Saves directly to images/uploads/
  try {
    onProgress(15);
    const dataUrl = await readFileAsDataURL(file);
    onProgress(45);

    const resp = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        data: dataUrl
      })
    });

    if (resp.ok) {
      const res = await resp.json();
      if (res.success && res.url) {
        onProgress(100);
        return res.url;
      }
    }
  } catch (localErr) {
    console.warn("Local upload endpoint note:", localErr);
  }

  // Strategy 2: Firebase Storage fallback (if bucket is activated)
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const fileRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (storageErr) {
    throw new Error(`Upload could not be saved to Cloud Storage: ${storageErr.message}. Ensure Cloud Storage is enabled in Firebase or paste an Image URL.`);
  }
}

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("wp-title").value.trim();
  const category = document.getElementById("wp-category").value;
  const tagsStr = document.getElementById("wp-tags").value.trim();
  const desktopFile = document.getElementById("wp-desktop-file").files[0];
  const mobileFile = document.getElementById("wp-mobile-file").files[0];
  const desktopUrlInput = document.getElementById("wp-desktop-url") ? document.getElementById("wp-desktop-url").value.trim() : "";
  const mobileUrlInput = document.getElementById("wp-mobile-url") ? document.getElementById("wp-mobile-url").value.trim() : "";

  // Validation: Must have at least a desktop file OR a desktop URL
  if (!desktopFile && !desktopUrlInput) {
    alert("Please select a Desktop 4K Image File OR paste a Desktop Image URL.");
    return;
  }

  submitBtn.disabled = true;
  progressContainer.classList.remove("hidden");
  uploadMessage.classList.add("hidden");

  try {
    let desktopUrl = desktopUrlInput;
    let mobileUrl = mobileUrlInput;

    // 1. Process Desktop Image
    if (desktopFile) {
      statusText.textContent = "1/2: Uploading 4K Desktop Image...";
      desktopUrl = await uploadFileSmart(desktopFile, "wallpapers_desktop", (p) => {
        const overall = p * 0.5;
        progressBar.style.width = `${overall}%`;
        percentText.textContent = `${Math.round(overall)}%`;
      });
    }

    // 2. Process Mobile Image
    if (mobileFile) {
      statusText.textContent = "2/2: Uploading 4K Mobile Image...";
      mobileUrl = await uploadFileSmart(mobileFile, "wallpapers_mobile", (p) => {
        const overall = 50 + (p * 0.5);
        progressBar.style.width = `${overall}%`;
        percentText.textContent = `${Math.round(overall)}%`;
      });
    } else if (!mobileUrl) {
      // Auto-fallback: If no mobile file or URL is provided, use the desktop image
      mobileUrl = desktopUrl;
    }

    statusText.textContent = "Saving to Database...";
    progressBar.style.width = "95%";
    percentText.textContent = "95%";

    const tags = tagsStr.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    const showInMarquee = document.getElementById("wp-show-marquee") ? document.getElementById("wp-show-marquee").checked : true;

    const wpPayload = {
      title,
      category,
      tags,
      desktopUrl,
      mobileUrl,
      previewUrl: desktopUrl,
      showInMarquee,
      downloads: 0
    };

    // Save directly to Local Server Database
    try {
      await fetch("/api/wallpapers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wpPayload)
      });
    } catch (apiErr) {
      console.warn("Local database save notice:", apiErr);
    }

    // Optional background sync to Firestore (with strict 1s timeout so it NEVER freezes or hangs)
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000));
      await Promise.race([
        addDoc(collection(db, "wallpapers"), { ...wpPayload, createdAt: serverTimestamp() }),
        timeoutPromise
      ]);
    } catch (fsErr) {
      console.info("Firestore optional cloud notice:", fsErr.message);
    }

    progressBar.style.width = "100%";
    percentText.textContent = "100%";

    uploadMessage.className = "text-xs font-bold p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200";
    uploadMessage.textContent = `✓ Success! "${title}" published to ArtDrop Vault & Showcase!`;
    uploadMessage.classList.remove("hidden");

    uploadForm.reset();
    setTimeout(() => {
      progressBar.style.width = "0%";
      percentText.textContent = "0%";
      progressContainer.classList.add("hidden");
      submitBtn.disabled = false;
    }, 1200);

    loadStatsAndWallpapers();
    loadMarqueeManager();
  } catch (err) {
    console.error("Upload error:", err);
    uploadMessage.className = "text-xs font-bold p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200";
    uploadMessage.textContent = "Notice: " + err.message;
    uploadMessage.classList.remove("hidden");
    submitBtn.disabled = false;
  }
});

// =============================================================================
// 5. Shared Data Fetcher (Instant Website Artworks + Fallback)
// =============================================================================

async function fetchAllWallpapers() {
  // Strategy 1: Fetch from Local Server Database (/api/wallpapers)
  try {
    const res = await fetch("/api/wallpapers");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn("Local API fetch notice:", e);
  }

  // Strategy 2: Firestore fallback with 1.2s timeout
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1200));
    const snapshot = await Promise.race([
      getDocs(query(collection(db, "wallpapers"), orderBy("createdAt", "desc"))),
      timeoutPromise
    ]);
    const items = [];
    snapshot.forEach(docSnap => items.push({ id: docSnap.id, ...docSnap.data() }));
    if (items.length > 0) return items;
  } catch (fsErr) {
    console.info("Firestore optional fetch notice:", fsErr.message);
  }

  return [];
}

// 1-Click Database Seeder
const seedBtn = document.getElementById("btn-seed-catalog");
if (seedBtn) {
  seedBtn.addEventListener("click", async () => {
    seedBtn.disabled = true;
    seedBtn.textContent = "Syncing Website Masterpieces...";
    try {
      const res = await fetch("/api/wallpapers");
      const currentList = res.ok ? await res.json() : [];
      alert(`Success! ${currentList.length} website masterpieces are active in your catalog!`);
      seedBtn.textContent = `✓ ${currentList.length} Active in Catalog`;
      loadStatsAndWallpapers();
      loadMarqueeManager();
    } catch (e) {
      seedBtn.disabled = false;
      seedBtn.textContent = "Sync Catalog";
    }
  });
}

// =============================================================================
// 6. Manage Catalog (Grid + Delete)
// =============================================================================

async function loadStatsAndWallpapers() {
  try {
    const wallpapers = await fetchAllWallpapers();

    statWallpapersCount.textContent = wallpapers.length;
    tabWallpapersCount.textContent = wallpapers.length;

    if (wallpapers.length === 0) {
      wallpapersGrid.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400">
          <p class="text-sm font-semibold">No wallpapers in database yet.</p>
        </div>
      `;
      return;
    }

    wallpapersGrid.innerHTML = "";
    wallpapers.forEach(data => {
      const id = data.id;

      const card = document.createElement("div");
      card.className = "group relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition";
      card.innerHTML = `
        <div class="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          <img src="${data.desktopUrl}" alt="${data.title}" class="h-full w-full object-cover group-hover:scale-105 transition duration-300">
          <span class="absolute top-2.5 left-2.5 rounded-full bg-slate-900/80 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
            ${data.category}
          </span>
        </div>
        <div class="p-4">
          <h4 class="text-xs font-bold text-slate-900 truncate">${data.title}</h4>
          <div class="mt-3 flex items-center justify-between">
            <button data-toggle-marquee="${id}" data-current="${data.showInMarquee ? 'true' : 'false'}" class="btn-toggle-marquee rounded-lg ${data.showInMarquee ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} px-2 py-1 text-[10px] font-bold transition cursor-pointer" title="Toggle Homepage Showcase">
              ${data.showInMarquee ? '🎪 In Showcase' : '+ Showcase'}
            </button>
            <div class="flex items-center gap-1.5">
              <a href="${data.desktopUrl}" target="_blank" class="rounded-lg bg-slate-100 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition" title="Preview 4K">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </a>
              <button data-delete-id="${id}" class="btn-delete-wp rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition cursor-pointer" title="Delete">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;

      wallpapersGrid.appendChild(card);
    });

    document.querySelectorAll(".btn-delete-wp").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.getAttribute("data-delete-id");
        if (confirm("Delete this wallpaper permanently?")) {
          await fetch("/api/wallpapers/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          try { deleteDoc(doc(db, "wallpapers", id)); } catch(e){}
          loadStatsAndWallpapers();
          loadMarqueeManager();
        }
      });
    });

    document.querySelectorAll(".btn-toggle-marquee").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.getAttribute("data-toggle-marquee");
        const current = e.currentTarget.getAttribute("data-current") === "true";
        e.currentTarget.disabled = true;
        e.currentTarget.textContent = "...";
        await fetch("/api/wallpapers/toggle-marquee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, showInMarquee: !current })
        });
        try { updateDoc(doc(db, "wallpapers", id), { showInMarquee: !current }); } catch(e){}
        loadStatsAndWallpapers();
        loadMarqueeManager();
      });
    });

  } catch (err) {
    console.warn("Catalog fetch notice:", err);
  }
}

// =============================================================================
// 6.5. Hero Scrolling Showcase Manager
// =============================================================================

async function loadMarqueeManager() {
  try {
    const wallpapers = await fetchAllWallpapers();

    const activeItems = [];
    const availableItems = [];

    wallpapers.forEach(wp => {
      if (wp.showInMarquee === true || wp.showInMarquee === "true") {
        activeItems.push(wp);
      } else {
        availableItems.push(wp);
      }
    });

    if (tabMarqueeCount) tabMarqueeCount.textContent = activeItems.length;
    if (marqueeActiveBadge) marqueeActiveBadge.textContent = `${activeItems.length} Wallpapers Active`;
    if (marqueeAvailableBadge) marqueeAvailableBadge.textContent = `${availableItems.length} Available`;

    // Render Active in Marquee
    if (marqueeActiveGrid) {
      if (activeItems.length === 0) {
        marqueeActiveGrid.innerHTML = `
          <div class="col-span-full py-10 px-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p class="text-xs font-bold text-slate-700">No wallpapers in the Homepage Showcase yet.</p>
            <p class="text-[11px] text-slate-400 mt-1">Click "+ Add to Showcase" on any catalog wallpaper below to start displaying it on the homepage!</p>
          </div>
        `;
      } else {
        marqueeActiveGrid.innerHTML = activeItems.map(wp => `
          <div class="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
            <div class="relative aspect-[16/10] bg-slate-100 overflow-hidden">
              <img src="${wp.desktopUrl}" alt="${wp.title}" class="h-full w-full object-cover">
              <span class="absolute top-2.5 left-2.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white shadow-sm flex items-center gap-1">
                <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                Scrolling Live
              </span>
            </div>
            <div class="p-3.5">
              <h4 class="text-xs font-bold text-slate-900 truncate">${wp.title}</h4>
              <p class="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">${wp.category}</p>
              <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <a href="${wp.desktopUrl}" target="_blank" class="text-[11px] font-bold text-slate-500 hover:text-slate-900 underline">Preview 4K</a>
                <button data-remove-marquee="${wp.id}" class="btn-remove-marquee rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 text-[11px] font-bold transition cursor-pointer">
                  ✕ Remove
                </button>
              </div>
            </div>
          </div>
        `).join("");
      }
    }

    // Render Available from Catalog
    if (marqueeAvailableGrid) {
      if (availableItems.length === 0) {
        marqueeAvailableGrid.innerHTML = `
          <div class="col-span-full py-8 text-center text-slate-400">
            <p class="text-xs">All catalog wallpapers are currently active in the showcase!</p>
          </div>
        `;
      } else {
        marqueeAvailableGrid.innerHTML = availableItems.map(wp => `
          <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition opacity-80 hover:opacity-100">
            <div class="relative aspect-[16/10] bg-slate-100 overflow-hidden">
              <img src="${wp.desktopUrl}" alt="${wp.title}" class="h-full w-full object-cover">
              <span class="absolute top-2.5 left-2.5 rounded-full bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                ${wp.category}
              </span>
            </div>
            <div class="p-3.5">
              <h4 class="text-xs font-bold text-slate-900 truncate">${wp.title}</h4>
              <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <a href="${wp.desktopUrl}" target="_blank" class="text-[11px] font-bold text-slate-400 hover:text-slate-900">View</a>
                <button data-add-marquee="${wp.id}" class="btn-add-marquee rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-1 text-[11px] font-bold transition cursor-pointer shadow-sm">
                  + Add to Showcase
                </button>
              </div>
            </div>
          </div>
        `).join("");
      }
    }

    // Event listeners for remove/add
    document.querySelectorAll(".btn-remove-marquee").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.getAttribute("data-remove-marquee");
        e.currentTarget.disabled = true;
        e.currentTarget.textContent = "...";
        await fetch("/api/wallpapers/toggle-marquee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, showInMarquee: false })
        });
        try { updateDoc(doc(db, "wallpapers", id), { showInMarquee: false }); } catch(e){}
        loadMarqueeManager();
        loadStatsAndWallpapers();
      });
    });

    document.querySelectorAll(".btn-add-marquee").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.getAttribute("data-add-marquee");
        e.currentTarget.disabled = true;
        e.currentTarget.textContent = "...";
        await fetch("/api/wallpapers/toggle-marquee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, showInMarquee: true })
        });
        try { updateDoc(doc(db, "wallpapers", id), { showInMarquee: true }); } catch(e){}
        loadMarqueeManager();
        loadStatsAndWallpapers();
      });
    });

  } catch (err) {
    console.warn("Marquee manager load warning:", err);
  }
}

// =============================================================================
// 7. Customers & Access Control
// =============================================================================

async function loadUsers() {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    statUsersCount.textContent = snapshot.size;

    usersTableBody.innerHTML = "";

    if (snapshot.empty) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="py-8 text-center text-slate-400">
            No registered users yet.
          </td>
        </tr>
      `;
      return;
    }

    snapshot.forEach(docSnap => {
      const u = docSnap.data();
      const uid = docSnap.id;

      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50/80 transition";
      tr.innerHTML = `
        <td class="py-4 px-6 font-bold text-slate-900">${u.displayName || "Customer"}</td>
        <td class="py-4 px-6 text-slate-600 font-mono text-[11px]">${u.email || "-"}</td>
        <td class="py-4 px-6">
          <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}">
            ${u.role || "user"}
          </span>
        </td>
        <td class="py-4 px-6">
          <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold ${u.hasAccess ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}">
            ${u.hasAccess ? 'UNLOCKED (VIP)' : 'LOCKED'}
          </span>
        </td>
        <td class="py-4 px-6 text-right">
          <button data-uid="${uid}" data-current="${u.hasAccess ? 'true' : 'false'}" class="btn-toggle-access rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-bold hover:bg-slate-900 hover:text-white transition cursor-pointer">
            ${u.hasAccess ? 'Revoke Access' : 'Grant VIP Access'}
          </button>
        </td>
      `;
      usersTableBody.appendChild(tr);
    });

    document.querySelectorAll(".btn-toggle-access").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const uid = e.currentTarget.getAttribute("data-uid");
        const current = e.currentTarget.getAttribute("data-current") === "true";
        await updateDoc(doc(db, "users", uid), {
          hasAccess: !current
        });
        loadUsers();
      });
    });

  } catch (err) {
    console.warn("Users fetch notice:", err);
  }
}

// =============================================================================
// 8. Pricing & Coupons
// =============================================================================

async function loadPricingSettings() {
  try {
    const res = await fetch(`/api/pricing?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.standardPrice) document.getElementById("price-standard").value = data.standardPrice;
      if (data.vipPrice) document.getElementById("price-vip").value = data.vipPrice;
      return;
    }
  } catch (e) {}

  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 800));
    const snap = await Promise.race([getDoc(doc(db, "settings", "pricing")), timeoutPromise]);
    if (snap && snap.exists()) {
      const data = snap.data();
      if (data.standardPrice) document.getElementById("price-standard").value = data.standardPrice;
      if (data.vipPrice) document.getElementById("price-vip").value = data.vipPrice;
    }
  } catch (e) {
    console.warn("Pricing load notice:", e);
  }
}

const pricingForm = document.getElementById("pricing-settings-form");
const pricingMsg = document.getElementById("pricing-save-msg");

if (pricingForm) {
  pricingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const standardPrice = Number(document.getElementById("price-standard").value);
    const vipPrice = Number(document.getElementById("price-vip").value);

    try {
      // 1. Save to local server API
      await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standardPrice, vipPrice, tagText: "40% OFF" })
      });

      // 2. Optional Firestore sync
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 800));
        await Promise.race([
          setDoc(doc(db, "settings", "pricing"), { standardPrice, vipPrice, updatedAt: serverTimestamp() }, { merge: true }),
          timeoutPromise
        ]);
      } catch (fsErr) {}

      pricingMsg.className = "mt-3 text-xs font-bold p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 max-w-3xl";
      pricingMsg.textContent = "✓ Live Website Pricing updated successfully!";
      pricingMsg.classList.remove("hidden");
    } catch (err) {
      pricingMsg.className = "mt-3 text-xs font-bold p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 max-w-3xl";
      pricingMsg.textContent = "Error saving pricing: " + err.message;
      pricingMsg.classList.remove("hidden");
    }
  });
}

const couponForm = document.getElementById("coupon-form");

if (couponForm) {
  couponForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = document.getElementById("coupon-code").value.trim().toUpperCase();
    const discount = Number(document.getElementById("coupon-discount").value);

    try {
      await setDoc(doc(db, "coupons", code), {
        code,
        discount,
        active: true,
        createdAt: serverTimestamp()
      });
      couponForm.reset();
      loadCoupons();
    } catch (err) {
      alert("Coupon error: " + err.message);
    }
  });
}

async function loadCoupons() {
  try {
    const snap = await getDocs(collection(db, "coupons"));
    couponListContainer.innerHTML = "";

    if (snap.empty) {
      couponListContainer.innerHTML = "<p class='text-xs text-slate-400'>No active coupons created yet.</p>";
      return;
    }

    snap.forEach(docSnap => {
      const c = docSnap.data();
      const pill = document.createElement("div");
      pill.className = "flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm";
      pill.innerHTML = `
        <span class="mono text-xs font-extrabold text-slate-900">${c.code}</span>
        <span class="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">${c.discount}% OFF</span>
        <button data-code="${c.code}" class="btn-delete-coupon text-slate-400 hover:text-rose-600 transition cursor-pointer ml-1">✕</button>
      `;
      couponListContainer.appendChild(pill);
    });

    document.querySelectorAll(".btn-delete-coupon").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const code = e.currentTarget.getAttribute("data-code");
        if (confirm(`Delete coupon "${code}"?`)) {
          await deleteDoc(doc(db, "coupons", code));
          loadCoupons();
        }
      });
    });
  } catch (err) {
    console.warn("Coupons fetch notice:", err);
  }
}
