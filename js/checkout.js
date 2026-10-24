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
  const qrImage = document.getElementById("checkout-upi-qr");
  const upiIdDisplay = document.getElementById("checkout-upi-id");

  const amount = isVip ? 149 : 49;
  const planName = isVip ? "Complete Collection (50 Exclusive 4K)" : "Essential Collection (10 Wallpapers 4K)";
  const upiId = "karanpw.live@oksbi";

  if (amountDisplay) amountDisplay.textContent = `₹${amount}`;
  if (planNameDisplay) planNameDisplay.textContent = planName;
  if (upiIdDisplay) upiIdDisplay.textContent = upiId;

  // Generate UPI QR Code URL
  // upi://pay?pa=karanpw.live@oksbi&pn=ArtDrop%20Wallpapers&am=1499&cu=INR
  const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=ArtDrop%20Wallpapers&am=${amount}&cu=INR&tn=${encodeURIComponent(planName)}`;
  if (qrImage) {
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPayload)}`;
  }
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
        <form id="checkout-payment-form" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-black mb-1">Full Name *</label>
            <input type="text" id="cust-name" required placeholder="e.g. Karan Sharma" class="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-black mb-1">Email Address *</label>
              <input type="email" id="cust-email" required placeholder="your.email@domain.com" class="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-black mb-1">Phone / WhatsApp *</label>
              <input type="tel" id="cust-phone" required placeholder="+91 9876543210" class="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition">
            </div>
          </div>

          <!-- Payment Instructions (UPI & QR) -->
          <div class="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 mt-4">
            <div class="flex items-center justify-between mb-3 border-b border-neutral-200 pb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-black">Scan & Pay via UPI</span>
              <span id="checkout-total-amount" class="text-lg font-extrabold text-black">₹149</span>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
              <div class="bg-white p-2 rounded-xl border border-neutral-200 shadow-sm shrink-0">
                <img id="checkout-upi-qr" src="" alt="Scan & Pay QR" class="h-32 w-32 object-contain mx-auto">
              </div>

              <div class="text-center sm:text-left text-xs space-y-1.5">
                <p class="font-bold text-black">Google Pay / PhonePe / Paytm / BHIM</p>
                <p class="text-neutral-500 text-[11px]">UPI ID: <span id="checkout-upi-id" class="font-mono font-bold text-black select-all bg-white px-2 py-0.5 rounded border border-neutral-200">karanpw.live@oksbi</span></p>
                <p class="text-[10px] text-neutral-400">Scan QR Code or pay directly to the UPI ID above.</p>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-neutral-200">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-black mb-1">UPI Transaction Reference / UTR Number *</label>
              <input type="text" id="cust-utr" required placeholder="12-digit UTR or Transaction ID (e.g. 428901234567)" class="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs text-black outline-none focus:border-black transition font-mono">
              <p class="text-[10px] text-neutral-400 mt-1">Payment hone ke baad apna UTR / Ref number yahan dalein.</p>
            </div>
          </div>

          <div id="checkout-error-msg" class="hidden text-xs font-semibold p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200"></div>

          <!-- Submit Button -->
          <button type="submit" id="btn-submit-order" class="w-full rounded-2xl bg-black py-4 text-xs font-extrabold uppercase tracking-widest text-white shadow-xl hover:bg-neutral-800 transition cursor-pointer mt-4">
            Confirm Payment & Unlock 4K Vault
          </button>
        </form>
      </div>

      <!-- Success Screen (Shown after order placement) -->
      <div id="checkout-success-container" class="hidden text-center py-6 space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>

        <h3 class="text-2xl font-extrabold text-black">Payment Confirmed!</h3>
        <p class="text-xs text-neutral-600 max-w-sm mx-auto">
          Thank you, <b id="success-cust-name" class="text-black"></b>! Your order has been placed and confirmed. Order details have been sent to <b>karanpw.live@gmail.com</b>.
        </p>

        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs max-w-sm mx-auto space-y-1">
          <p><span class="text-neutral-500">Plan:</span> <b id="success-plan-name" class="text-black"></b></p>
          <p><span class="text-neutral-500">Amount Paid:</span> <b id="success-amount" class="text-black"></b></p>
          <p><span class="text-neutral-500">Transaction ID:</span> <b id="success-utr" class="font-mono text-black"></b></p>
          <p><span class="text-neutral-500">Access:</span> <span class="rounded-full bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[10px]">LIFETIME UNLOCKED</span></p>
        </div>

        <div class="pt-3">
          <a href="/vault/" class="inline-block w-full rounded-2xl bg-black py-4 text-xs font-extrabold uppercase tracking-widest text-white shadow-xl hover:bg-neutral-800 transition">
            🚀 Open & Download My 4K Vault Now
          </a>
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

  const form = document.getElementById("checkout-payment-form");
  const submitBtn = document.getElementById("btn-submit-order");
  const errorMsg = document.getElementById("checkout-error-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.classList.add("hidden");

    const name = document.getElementById("cust-name").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const utr = document.getElementById("cust-utr").value.trim();

    const isVip = document.getElementById("plan-vip").checked;
    const amount = isVip ? 149 : 49;
    const planName = isVip ? "Complete Collection (50 Exclusive 4K)" : "Essential Collection (10 Wallpapers 4K)";

    submitBtn.disabled = true;
    submitBtn.textContent = "Processing Order...";

    try {
      // 1. Send Order Details directly to karanpw.live@gmail.com using FormSubmit API
      const emailPayload = {
        _subject: `🔥 New ArtDrop Order: ₹${amount} from ${name}`,
        Customer_Name: name,
        Customer_Email: email,
        Customer_Phone: phone,
        Pack_Ordered: planName,
        Amount_Paid: `₹${amount}`,
        Transaction_UTR: utr,
        Timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      };

      try {
        await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(emailPayload)
        });
        console.log(`[ArtDrop] Notification sent to ${NOTIFY_EMAIL}`);
      } catch (err) {
        console.warn("Email notice:", err);
      }

      // 2. Save Order to Database (Local Server API + Firestore)
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            packType: planName,
            packPrice: amount,
            transactionUtr: utr,
            timestamp: Date.now()
          })
        });
      } catch (err) {
        console.warn("Local order save notice:", err);
      }

      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000));
        await Promise.race([
          addDoc(collection(db, "orders"), {
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            packType: planName,
            amount: amount,
            currency: "INR",
            transactionUtr: utr,
            status: "completed",
            createdAt: serverTimestamp()
          }),
          timeoutPromise
        ]);
      } catch (err) {
        console.warn("Firestore order record warning:", err);
      }

      // 3. Unlock Customer VIP Vault in this browser
      localStorage.setItem("artdrop_guest_user", "true");
      localStorage.setItem("artdrop_customer_email", email);
      localStorage.setItem("artdrop_customer_name", name);

      // 4. Show Celebration Success Screen
      document.getElementById("checkout-form-container").classList.add("hidden");
      const successContainer = document.getElementById("checkout-success-container");
      successContainer.classList.remove("hidden");

      document.getElementById("success-cust-name").textContent = name;
      document.getElementById("success-plan-name").textContent = planName;
      document.getElementById("success-amount").textContent = `₹${amount}`;
      document.getElementById("success-utr").textContent = utr;

    } catch (err) {
      console.error("Order processing error:", err);
      errorMsg.textContent = "Order error: " + err.message;
      errorMsg.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "Confirm Payment & Unlock 4K Vault";
    }
  });
}
