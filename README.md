# 🍔 BURGER&BITE — Fast Food Kafe Veb-Dasturi

Ushbu loyiha **BURGER&BITE** fast-food kafesi uchun maxsus yaratilgan bo'lib, **GitHub** va **Netlify** platformalariga hech qanday qo'shimcha server sozlamalarisiz (Static Hosting) to'g'ridan-to'g'ri joylash uchun tayyor.

## 📁 Fayllar Tuzilmasi
- `index.html` — Mijozlar uchun asosiy veb-sayt (Navbar, 5 sekundda almashuvchi Hero slayder, 20 ta taom menyusi, Savat, Yoqtirganlar, Ro'yxatdan o'tish, Biz haqimizda, Aloqa).
- `style.css` — Qora rangli neon effektli zamonaviy dizayn (Kompyuter, Planshet, Telefon va Apple Watch ekranlariga moslashgan).
- `data.js` — 20 ta fast-food taomi (har biri 3 xil variantda), rasmlar va O'zbekistonning 12 ta viloyati hamda tumanlari bazasi.
- `app.js` — Saytning barcha interaktiv funksiyalari.
- `admin.html`, `admin.css`, `admin.js` — Alohida himoyalangan Admin boshqaruv paneli.

## 🔐 Admin Panelga Kirish
- Saytning yuqori menyusidagi **🛡️ Admin** tugmasini bosing yoki `admin.html` sahifasini oching.
- **Login:** `admin`
- **Parol:** `Burger2026!`
- **Xavfsizlik:** SHA-256 parol tekshiruvi, XSS skriptlardan tozalash (`escapeHTML` va `sanitizeUrl`) hamda 3 marta xato urinishda 30 soniyalik avtomatik bloklash tizimi o'rnatilgan.

## 🚀 GitHub va Netlify'ga Joylash Bo'yicha Qo'llanma
1. **GitHub:**
   - GitHub.com saytida yangi repository yarating (masalan: `burger-and-bite`).
   - Ushbu papkadagi barcha fayllarni (`index.html`, `style.css`, `app.js`, `data.js`, `admin.html`, `admin.css`, `admin.js`) repository ichiga yuklang (`Upload files` yoki `git push`).
2. **Netlify:**
   - Netlify.com saytiga GitHub orqali kiring.
   - **Add new site -> Import an existing project -> GitHub** ni tanlang.
   - `burger-and-bite` loyihasini tanlab **Deploy site** tugmasini bosing. 10 soniyada saytingiz tayyor bo'ladi!
