with open('admin/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '<form id="wallpaper-upload-form" class="space-y-6">'

replacement = '''<div class="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 border border-black/10">
          <div>
            <p class="text-xs font-bold text-black">Initial Database Sync</p>
            <p class="text-[11px] text-neutral-500">Populate your Firestore database with 12+ built-in ArtDrop 4K Masterpieces</p>
          </div>
          <button type="button" id="btn-seed-catalog" class="rounded-xl border border-black bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition shadow-sm cursor-pointer">
            ⚡ Sync 12+ Masterpieces to Firestore
          </button>
        </div>

        <form id="wallpaper-upload-form" class="space-y-6">'''

if target in html and 'btn-seed-catalog' not in html:
    html = html.replace(target, replacement)
    with open('admin/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("[OK] admin/index.html updated with sync button")
else:
    print("[INFO] Already contains sync button or target not matched")
