// =============================================================================
// ArtDrop - Direct Payment Gateway & Order Notification System
// Sends order details directly to: karanpw.live@gmail.com
// =============================================================================

import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

const NOTIFY_EMAIL = "karanpw.live@gmail.com";

export function initCheckout() {
  injectCheckoutModal();

  // Attach click listener to all purchase / CTA buttons on the page
  document.addEventListener("click", (e) => {
    const target = e.target.closest('a[href*="centerpag"], a[href="#oferta"], .btn-open-checkout');
    const href = target ? (target.getAttribute("href") || "") : "";
    if (!target || href.includes("essential.html") || href.includes("complete.html")) return;

    e.preventDefault();

    // Determine plan clicked
    const text = (target.textContent || "").toLowerCase();
    const href = target.getAttribute("href") || "";

    let plan = "vip";
    if (text.includes("essential") || text.includes("i want this") || href.includes("PPU38CQG2J1")) {
      plan = "essential";
    }

    openCheckoutModal(plan);
  });
}

export function openCheckoutModal(selectedPlan = "vip") {
  const modal = document.getElementById("checkout-modal");
  if (!modal) return;

  const essentialRadio = document.getElementById("plan-essential");
  const vipRadio = document.getElementById("plan-vip");

  if (selectedPlan === "essential" && essentialRadio) {
    essentialRadio.checked = true;
  } else if (vipRadio) {
    vipRadio.checked = true;
  }

  updateSelectedPlanUI();
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

export function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function updateSelectedPlanUI() {
  const essentialRadio = document.getElementById("plan-essential");
  const isVip = !essentialRadio || !essentialRadio.checked;

  const amountDisplay = document.getElementById("checkout-total-amount");
  const planNameDisplay = document.getElementById("checkout-plan-name");
  const upiIdDisplay = document.getElementById("checkout-upi-id");

  const amount = isVip ? 149 : 49;
  const planName = isVip ? "Complete Collection (22+ Artworks)" : "Essential Collection (10 Wallpapers)";
  const upiId = "karanpw.live@oksbi";

  if (amountDisplay) amountDisplay.textContent = `₹${amount}`;
  if (planNameDisplay) planNameDisplay.textContent = planName;
  if (upiIdDisplay) upiIdDisplay.textContent = upiId;
}

function injectCheckoutModal() {
  if (document.getElementById("checkout-modal")) return;

  const modalHtml = `
  <div id="checkout-modal" class="hidden fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
    <div class="relative w-full max-w-lg rounded-3xl border border-black/15 bg-white p-6 sm:p-8 shadow-2xl text-black my-8 max-h-[92vh] overflow-y-auto">
      
      <!-- Close Button -->
      <button id="close-checkout-modal" type="button" class="absolute right-5 top-5 rounded-full p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 transition cursor-pointer">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Content Container -->
      <div id="checkout-form-container">
        <!-- Brand Header -->
        <div class="text-center mb-6">
          <img src="images/artdrop-logo.webp?v=2" alt="ArtDrop" class="mx-auto h-12 w-auto mb-2">
          <h2 class="text-2xl font-extrabold tracking-tight text-black">Instant Secure Checkout</h2>
          <p class="text-xs text-neutral-500 mt-1">Direct 4K Vault Download & Lifetime Access</p>
        </div>

        <!-- Plan Selection Toggle -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <label class="cursor-pointer">
            <input type="radio" name="checkout-plan" id="plan-essential" value="essential" class="peer sr-only">
            <div class="rounded-2xl border-2 border-neutral-200 p-3.5 text-center peer-checked:border-black peer-checked:bg-neutral-50 transition">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Essential</span>
              <span class="block text-xl font-extrabold text-black mt-0.5">₹49</span>
              <span class="block text-[10px] text-neutral-500 mt-1">10 4K Wallpapers</span>
            </div>
          </label>

          <label class="cursor-pointer">
            <input type="radio" name="checkout-plan" id="plan-vip" value="vip" checked class="peer sr-only">
            <div class="rounded-2xl border-2 border-neutral-200 p-3.5 text-center peer-checked:border-black peer-checked:bg-neutral-50 transition relative">
              <span class="absolute -top-2.5 right-2 rounded-full bg-black px-2 py-0.5 text-[8px] font-bold text-white uppercase">Best Value</span>
              <span class="block text-[10px] font-bold uppercase tracking-wider text-black">Complete Collection</span>
              <span class="block text-xl font-extrabold text-black mt-0.5">₹149</span>
              <span class="block text-[10px] text-neutral-500 mt-1">50 Exclusive Impasto 4K</span>
            </div>
          </label>
        </div>

        <!-- Customer Details Form -->
        <form id="checkout-payment-form" novalidate class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-black mb-1">Full Name *</label>
            <input type="text" id="cust-name" required placeholder="e.g. Karan Sharma" class="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-black mb-1">Gmail / Email Address *</label>
              <input type="email" id="cust-email" required placeholder="your.name@gmail.com" class="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-black mb-1">Phone / WhatsApp</label>
              <input type="tel" id="cust-phone" placeholder="+91 9876543210 (Optional)" class="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
            </div>
          </div>

          <!-- Payment Instructions (Direct UPI, Scanner Barcode Removed) -->
          <div class="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mt-4 space-y-3">
            <div class="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-black">Pay via UPI</span>
              <span id="checkout-total-amount" class="text-lg font-extrabold text-black">₹149</span>
            </div>

            <div class="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Direct UPI ID:</span>
              <div class="flex items-center justify-between gap-2">
                <span id="checkout-upi-id" class="font-mono text-sm font-black text-black select-all">karanpw.live@oksbi</span>
                <button type="button" id="btn-modal-copy-upi" class="rounded-lg bg-black text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition cursor-pointer" style="background-color: #000000 !important; color: #ffffff !important;">
                  Copy
                </button>
              </div>
            </div>

            <p class="text-[11px] text-neutral-500">
              Supported Apps: Google Pay • PhonePe • Paytm • BHIM
            </p>

            <div class="pt-2 border-t border-neutral-200">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-black mb-1">UPI Transaction Reference / UTR Number <span class="text-neutral-400 font-normal">(Optional)</span></label>
              <input type="text" id="cust-utr" placeholder="12-digit UTR or Transaction ID (e.g. 428901234567)" class="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition font-mono">
            </div>
          </div>

          <div id="checkout-error-msg" class="hidden text-xs font-semibold p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200"></div>

          <!-- Submit Button -->
          <button type="submit" id="btn-submit-order" class="w-full rounded-2xl bg-black py-4 text-xs font-extrabold uppercase tracking-widest text-white shadow-xl hover:bg-neutral-800 transition cursor-pointer mt-4" style="background-color: #000000 !important; color: #ffffff !important;">
            <span style="color: #ffffff !important;">Confirm Booking &amp; Submit Order</span>
          </button>
        </form>
      </div>

      <!-- Success Screen (Shown after order placement) -->
      <div id="checkout-success-container" class="hidden text-center py-6 space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>

        <h3 class="text-2xl font-extrabold text-black">Your package has been booked!</h3>

        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <p class="text-sm font-black text-emerald-950 leading-relaxed">
            your packaged has been booked admin send you wallapers very soon on your email adress
          </p>
          <p class="mt-2 text-xs text-emerald-800">
            Admin will send wallpapers to: <br>
            <b id="success-cust-email-display" class="font-mono text-black underline text-sm"></b>
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs max-w-sm mx-auto space-y-1.5">
          <p><span class="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Customer:</span> <b id="success-cust-name" class="text-black"></b></p>
          <p><span class="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Plan:</span> <b id="success-plan-name" class="text-black"></b></p>
          <p><span class="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Amount Paid:</span> <b id="success-amount" class="text-black"></b></p>
          <p><span class="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Notification:</span> <b class="font-mono text-neutral-800">Sent to karanpw.live@gmail.com</b></p>
        </div>

        <div class="pt-2">
          <button type="button" onclick="window.location.href='/collection.html'" class="w-full rounded-2xl bg-black py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:bg-neutral-800 transition cursor-pointer" style="background-color: #000000 !important; color: #ffffff !important;">
            <span style="color: #ffffff !important;">Explore Wallpapers Collection</span>
          </button>
        </div>
      </div>

    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  // Wire events
  document.getElementById("close-checkout-modal").addEventListener("click", closeCheckoutModal);

  document.querySelectorAll('input[name="checkout-plan"]').forEach(radio => {
    radio.addEventListener("change", updateSelectedPlanUI);
  });

  const btnModalCopy = document.getElementById("btn-modal-copy-upi");
  if (btnModalCopy) {
    btnModalCopy.addEventListener("click", () => {
      navigator.clipboard.writeText("karanpw.live@oksbi").then(() => {
        btnModalCopy.textContent = "COPIED!";
        setTimeout(() => { btnModalCopy.textContent = "COPY"; }, 1800);
      });
    });
  }

  const form = document.getElementById("checkout-payment-form");
  const submitBtn = document.getElementById("btn-submit-order");
  const errorMsg = document.getElementById("checkout-error-msg");
  const formContainer = document.getElementById("checkout-form-container");
  const successContainer = document.getElementById("checkout-success-container");

  function processModalBooking(e) {
    if (e) e.preventDefault();
    errorMsg.classList.add("hidden");

    const inputName = document.getElementById("cust-name");
    const inputEmail = document.getElementById("cust-email");
    const inputPhone = document.getElementById("cust-phone");
    const inputUtr = document.getElementById("cust-utr");

    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const utr = inputUtr.value.trim();

    if (!name) {
      errorMsg.textContent = "Kripya apna Full Name zaroor bharein.";
      errorMsg.classList.remove("hidden");
      inputName.focus();
      return;
    }

    if (!email || !email.includes("@")) {
      errorMsg.textContent = "Kripya apna valid Gmail ya Email address bharein.";
      errorMsg.classList.remove("hidden");
      inputEmail.focus();
      return;
    }

    const isVip = document.getElementById("plan-vip").checked;
    const amount = isVip ? 149 : 49;
    const planName = isVip ? "Complete Collection (22+ Artworks)" : "Essential Collection (10 Wallpapers)";
    const orderTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // 1. INSTANT SUCCESS DISPLAY (No blocking)
    formContainer.classList.add("hidden");
    successContainer.classList.remove("hidden");

    const elName = document.getElementById("success-cust-name");
    const elPlan = document.getElementById("success-plan-name");
    const elAmt = document.getElementById("success-amount");
    const elEmail = document.getElementById("success-cust-email-display");

    if (elName) elName.textContent = name;
    if (elPlan) elPlan.textContent = planName;
    if (elAmt) elAmt.textContent = `₹${amount}`;
    if (elEmail) elEmail.textContent = email;

    // 2. Save in localStorage
    localStorage.setItem("artdrop_guest_user", "true");
    localStorage.setItem("artdrop_customer_email", email);
    localStorage.setItem("artdrop_customer_name", name);

    // 3. Send Email to karanpw.live@gmail.com in Background (Non-blocking)
    const emailPayload = {
      _subject: `🔥 New ArtDrop Package Booking: ₹${amount} from ${name}`,
      Customer_Name: name,
      Customer_Gmail: email,
      Customer_Email: email,
      Customer_Phone: phone || "Not provided",
      Selected_Bundle: planName,
      Amount_Paid: `₹${amount}`,
      Transaction_UTR: utr || "Direct Booking",
      Timestamp: orderTime
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(emailPayload),
      signal: controller.signal
    }).catch(err => console.warn("[ArtDrop] Email notice:", err.message))
      .finally(() => clearTimeout(timeoutId));

    // 4. Save to Local DB in Background
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        packType: planName,
        packPrice: amount,
        transactionUtr: utr || "Direct Booking",
        timestamp: Date.now()
      })
    }).catch(err => console.warn("[ArtDrop] Local DB notice:", err.message));

    try {
      addDoc(collection(db, "orders"), {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        packType: planName,
        amount: amount,
        currency: "INR",
        transactionUtr: utr || "Direct Booking",
        status: "booked",
        createdAt: serverTimestamp()
      }).catch(err => console.warn("Firestore notice:", err.message));
    } catch (fErr) {
      console.warn("Firestore init warning:", fErr.message);
    }
  }

  form.addEventListener("submit", processModalBooking);
  submitBtn.addEventListener("click", (e) => {
    if (!formContainer.classList.contains("hidden")) {
      processModalBooking(e);
    }
  });
}
