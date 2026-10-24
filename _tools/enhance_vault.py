with open('vault/vault.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Enhance check logic in vault.js
old_check = '''// 1. Auth Listener
onAuthStateChanged(auth, async (user) => {'''

new_check = '''// Check guest or admin session first
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
  if (checkGuestOrAdminSession()) return;'''

code = code.replace(old_check, new_check)

with open('vault/vault.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("[OK] vault.js enhanced")
