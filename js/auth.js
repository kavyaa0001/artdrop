// =============================================================================
// ArtDrop - Complete Authentication System (Step 2)
// =============================================================================

import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "./firebase-config.js";

// Global current user state
export let currentUser = null;
export let userProfile = null;

// Initialize Auth State Listener
export function initAuth(onStateChangeCallback) {
  // Check if guest/demo mode is active
  if (localStorage.getItem("artdrop_guest_user") === "true") {
    currentUser = {
      uid: "guest_vip_user",
      email: "vip.customer@artdrop.pro",
      displayName: "VIP Customer",
      photoURL: ""
    };
    userProfile = {
      uid: "guest_vip_user",
      email: "vip.customer@artdrop.pro",
      displayName: "VIP Customer",
      role: "user",
      hasAccess: true
    };
    updateHeaderUI();
    if (onStateChangeCallback) onStateChangeCallback(currentUser, userProfile);
  } else {
    // Render signed out UI immediately so button is visible right away!
    updateHeaderUI();
  }

  // Listen to Firebase Auth
  onAuthStateChanged(auth, async (user) => {
    if (localStorage.getItem("artdrop_guest_user") === "true") return;

    currentUser = user;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          userProfile = userSnap.data();
          // Update last login
          await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
        } else {
          userProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split("@")[0],
            photoURL: user.photoURL || "",
            role: "user",
            hasAccess: false,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
          };
          await setDoc(userRef, userProfile);
        }
      } catch (err) {
        console.warn("Firestore user sync warning:", err);
        userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0],
          photoURL: user.photoURL || "",
          role: "user",
          hasAccess: false
        };
      }
    } else {
      userProfile = null;
    }

    updateHeaderUI();
    if (onStateChangeCallback) {
      onStateChangeCallback(currentUser, userProfile);
    }
  });
}

// Google Sign-In
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    closeAuthModal();
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return { success: false, error: formatAuthError(error) };
  }
}

// Email/Password Login
export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    closeAuthModal();
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Email Login Error:", error);
    return { success: false, error: formatAuthError(error) };
  }
}

// Email/Password Registration
export async function signupWithEmail(email, password, name) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: name || email.split("@")[0],
        photoURL: "",
        role: "user",
        hasAccess: false,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
    } catch (e) {
      console.warn("Could not save initial user document:", e);
    }
    
    closeAuthModal();
    return { success: true, user };
  } catch (error) {
    console.error("Signup Error:", error);
    return { success: false, error: formatAuthError(error) };
  }
}

// Password Reset Email
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: formatAuthError(error) };
  }
}

// Friendly error translations
function formatAuthError(err) {
  const code = err.code || "";
  const msg = err.message || "";

  if (code.includes("operation-not-allowed") || msg.includes("operation-not-allowed")) {
    return "Firebase Console mein Sign-In method enable nahi hai. Console > Build > Authentication > Sign-in method mein jakar Enable karein, ya '⚡ Quick Demo Login' use karein.";
  }
  if (code.includes("user-not-found")) {
    return "Is email se account nahi mila. Pehle 'Create Account' par click karke register karein.";
  }
  if (code.includes("wrong-password") || code.includes("invalid-credential")) {
    return "Galat email ya password! Please check karein.";
  }
  if (code.includes("email-already-in-use")) {
    return "Yeh email already registered hai. Please 'Sign In' karein.";
  }
  if (code.includes("weak-password")) {
    return "Password kam se kam 6 characters ka hona chahiye.";
  }
  if (code.includes("popup-blocked")) {
    return "Browser popup block ho gaya. Please popups allow karein.";
  }
  return msg.replace("Firebase: ", "");
}

// Logout
export async function logoutUser() {
  localStorage.removeItem("artdrop_guest_user");
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("Logout notice:", error);
  }
  window.location.reload();
}

// =============================================================================
// UI: Header & Auth Modal
// =============================================================================

export function updateHeaderUI() {
  const authContainer = document.getElementById("header-auth-container");
  if (!authContainer) return;

  if (currentUser) {
    const name = (userProfile && userProfile.displayName) || currentUser.displayName || currentUser.email.split("@")[0];
    const initial = name.charAt(0).toUpperCase();
    const isAdmin = (userProfile && userProfile.role === "admin") || localStorage.getItem("artdrop_admin_session") === "true";
    const hasAccess = (userProfile && userProfile.hasAccess) || isAdmin;

    authContainer.innerHTML = `
      <div class="relative inline-block text-left" id="user-menu-wrapper">
        <button id="user-menu-btn" type="button" class="flex items-center gap-2.5 rounded-full border border-black/20 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-black shadow-sm transition hover:bg-neutral-100 cursor-pointer">
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">${initial}</span>
          <span class="max-w-[100px] truncate sm:max-w-[140px]">${name}</span>
          <svg class="h-3.5 w-3.5 text-black" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div id="user-menu-dropdown" class="hidden absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-black/15 bg-white p-2 shadow-2xl z-50">
          <div class="border-b border-black/10 px-3 py-2">
            <p class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Signed in as</p>
            <p class="truncate text-xs font-bold text-black">${currentUser.email}</p>
            <span class="mt-1.5 inline-block rounded-full ${hasAccess ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'} px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
              ${hasAccess ? '✓ VIP VAULT UNLOCKED' : 'FREE ACCOUNT'}
            </span>
          </div>

          <div class="py-1">
            <a href="/vault/" class="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-black hover:bg-neutral-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              My 4K Vault
            </a>
            <a href="/admin/" class="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Admin Dashboard
            </a>
            <button id="logout-btn" type="button" class="w-full text-left flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Log Out
            </button>
          </div>
        </div>
      </div>
    `;

    // Dropdown toggle
    const menuBtn = document.getElementById("user-menu-btn");
    const dropdown = document.getElementById("user-menu-dropdown");
    const logoutBtn = document.getElementById("logout-btn");

    if (menuBtn && dropdown) {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
      });
      document.addEventListener("click", () => dropdown.classList.add("hidden"));
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", logoutUser);
    }
  } else {
    authContainer.innerHTML = `
      <button id="open-auth-btn" type="button" class="flex items-center gap-2 rounded-full border border-black bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-neutral-800 shadow-sm cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Sign In
      </button>
    `;

    const openBtn = document.getElementById("open-auth-btn");
    if (openBtn) {
      openBtn.addEventListener("click", openAuthModal);
    }
  }
}

// Open / Close Auth Modal
export function openAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.remove("hidden");
}

export function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.add("hidden");
}

// Inject Modal HTML into page
export function injectAuthModal() {
  if (document.getElementById("auth-modal")) return;

  const modalHtml = `
  <div id="auth-modal" class="hidden fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div class="relative w-full max-w-md rounded-3xl border border-black/15 bg-white p-6 sm:p-8 shadow-2xl transition-all">
      <!-- Close Button -->
      <button id="close-auth-modal" type="button" class="absolute right-5 top-5 rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-black cursor-pointer">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Logo / Title -->
      <div class="text-center mb-6">
        <img src="images/artdrop-logo.webp?v=2" alt="ArtDrop" class="mx-auto h-16 w-auto mb-2">
        <h3 id="auth-modal-title" class="text-2xl font-bold tracking-tight text-black">Welcome to ArtDrop</h3>
        <p id="auth-modal-subtitle" class="text-xs text-neutral-500 mt-1">Sign in to access your purchased 4K wallpapers vault</p>
      </div>

      <!-- Google Button -->
      <button id="btn-google-login" type="button" class="w-full flex items-center justify-center gap-3 rounded-2xl border border-black/15 bg-white py-3 px-4 text-xs font-bold uppercase tracking-wider text-black shadow-sm transition hover:bg-neutral-50 hover:border-black cursor-pointer">
        <svg class="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        Continue with Google
      </button>

      <!-- Instant Demo Login Button (Instant Test without blockers) -->
      <button id="btn-demo-login" type="button" class="mt-2.5 w-full flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-sm transition hover:bg-emerald-100 cursor-pointer">
        ⚡ 1-Click Instant VIP Access (Instant Test)
      </button>

      <!-- Divider -->
      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-black/10"></div></div>
        <div class="relative flex justify-center text-[10px] uppercase tracking-widest"><span class="bg-white px-2 text-neutral-400">or with email</span></div>
      </div>

      <!-- Email / Pass Form -->
      <form id="auth-email-form" class="space-y-3.5">
        <div id="auth-name-field" class="hidden">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-black mb-1">Your Full Name</label>
          <input type="text" id="auth-name-input" placeholder="e.g. Alex Hunter" class="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
        </div>

        <div>
          <label class="block text-[11px] font-bold uppercase tracking-wider text-black mb-1">Email Address</label>
          <input type="email" id="auth-email-input" required placeholder="alex@domain.com" class="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
        </div>

        <div id="auth-password-group">
          <div class="flex items-center justify-between mb-1">
            <label class="block text-[11px] font-bold uppercase tracking-wider text-black">Password</label>
            <button type="button" id="btn-forgot-password" class="text-[10px] text-neutral-500 hover:text-black font-semibold cursor-pointer">Forgot?</button>
          </div>
          <input type="password" id="auth-password-input" required placeholder="••••••••" class="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
        </div>

        <div id="auth-error-msg" class="hidden text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200"></div>
        <div id="auth-success-msg" class="hidden text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200"></div>

        <button type="submit" id="auth-submit-btn" class="w-full rounded-xl bg-black py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-neutral-800 cursor-pointer">
          Sign In
        </button>
      </form>

      <!-- Toggle Signup / Signin -->
      <div class="mt-4 text-center">
        <button id="toggle-auth-mode-btn" type="button" class="text-xs text-neutral-600 hover:text-black font-semibold transition cursor-pointer">
          Don't have an account? <span class="underline">Create one</span>
        </button>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Wire up events
  const closeBtn = document.getElementById("close-auth-modal");
  const googleBtn = document.getElementById("btn-google-login");
  const demoBtn = document.getElementById("btn-demo-login");
  const form = document.getElementById("auth-email-form");
  const toggleBtn = document.getElementById("toggle-auth-mode-btn");
  const nameField = document.getElementById("auth-name-field");
  const submitBtn = document.getElementById("auth-submit-btn");
  const title = document.getElementById("auth-modal-title");
  const errorMsg = document.getElementById("auth-error-msg");
  const successMsg = document.getElementById("auth-success-msg");
  const forgotBtn = document.getElementById("btn-forgot-password");

  let isSignUpMode = false;

  closeBtn.addEventListener("click", closeAuthModal);
  
  // Instant Demo Login
  demoBtn.addEventListener("click", () => {
    localStorage.setItem("artdrop_guest_user", "true");
    currentUser = {
      uid: "guest_vip_user",
      email: "vip.customer@artdrop.pro",
      displayName: "VIP Customer",
      photoURL: ""
    };
    userProfile = {
      uid: "guest_vip_user",
      email: "vip.customer@artdrop.pro",
      displayName: "VIP Customer",
      role: "user",
      hasAccess: true
    };
    updateHeaderUI();
    closeAuthModal();
  });

  googleBtn.addEventListener("click", async () => {
    errorMsg.classList.add("hidden");
    successMsg.classList.add("hidden");
    const res = await loginWithGoogle();
    if (!res.success) {
      errorMsg.innerHTML = res.error;
      errorMsg.classList.remove("hidden");
    }
  });

  // Forgot Password
  forgotBtn.addEventListener("click", async () => {
    const email = document.getElementById("auth-email-input").value.trim();
    if (!email) {
      errorMsg.textContent = "Please pehle apna email address upar enter karein.";
      errorMsg.classList.remove("hidden");
      return;
    }
    errorMsg.classList.add("hidden");
    successMsg.textContent = "Sending reset link...";
    successMsg.classList.remove("hidden");

    const res = await resetPassword(email);
    if (res.success) {
      successMsg.textContent = `Password reset email bhej diya gaya hai (${email}). Check your inbox!`;
    } else {
      successMsg.classList.add("hidden");
      errorMsg.innerHTML = res.error;
      errorMsg.classList.remove("hidden");
    }
  });

  toggleBtn.addEventListener("click", () => {
    isSignUpMode = !isSignUpMode;
    errorMsg.classList.add("hidden");
    successMsg.classList.add("hidden");
    if (isSignUpMode) {
      nameField.classList.remove("hidden");
      title.textContent = "Create an Account";
      submitBtn.textContent = "Sign Up";
      toggleBtn.innerHTML = `Already have an account? <span class="underline">Sign in</span>`;
    } else {
      nameField.classList.add("hidden");
      title.textContent = "Welcome to ArtDrop";
      submitBtn.textContent = "Sign In";
      toggleBtn.innerHTML = `Don't have an account? <span class="underline">Create one</span>`;
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.classList.add("hidden");
    successMsg.classList.add("hidden");
    const email = document.getElementById("auth-email-input").value.trim();
    const pass = document.getElementById("auth-password-input").value;
    const name = document.getElementById("auth-name-input").value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = "Please wait...";

    let res;
    if (isSignUpMode) {
      res = await signupWithEmail(email, pass, name);
    } else {
      res = await loginWithEmail(email, pass);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = isSignUpMode ? "Sign Up" : "Sign In";

    if (!res.success) {
      errorMsg.innerHTML = res.error;
      errorMsg.classList.remove("hidden");
    }
  });
}
