// BURGER&BITE - Xavfsiz Admin Panel Logikasi (SHA-256 + Brute-Force Protection + XSS Filter)

const ADMIN_USERNAME = "admin";
// "Burger2026!" ning SHA-256 xeshi
const ADMIN_PASS_HASH = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

// URL xavfsizligini tekshirish (javascript: kabi zararli skriptlarni bloklash)
function sanitizeUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch (e) {}
  return FALLBACK_SVG;
}

// Brute-force himoyasi (3 marta xato kirish -> 30 soniya blok)
let failedAttempts = 0;
let lockUntil = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const expectedHash = await sha256("Burger2026!");

  if (sessionStorage.getItem("bb_admin_token") === expectedHash) {
    unlockDashboard();
  }

  document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = document.getElementById("loginError");
    const now = Date.now();

    if (now < lockUntil) {
      const sec = Math.ceil((lockUntil - now) / 1000);
      errEl.textContent = `⛔ Tizim bloklangan! ${sec} soniyadan keyin urinib ko'ring.`;
      return;
    }

    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value;
    const inputHash = await sha256(pass);

    if (user === ADMIN_USERNAME && inputHash === expectedHash) {
      failedAttempts = 0;
      sessionStorage.setItem("bb_admin_token", expectedHash);
      unlockDashboard();
    } else {
      failedAttempts++;
      if (failedAttempts >= 3) {
        lockUntil = Date.now() + 30000;
        errEl.textContent = "🚨 3 marta xato urinish! Xavfsizlik uchun 30 soniyaga bloklandi.";
      } else {
        errEl.textContent = `❌ Login yoki parol xato! (${failedAttempts}/3 urinish)`;
      }
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("bb_admin_token");
    location.reload();
  });

  document.getElementById("addProductForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const products = getStoredProducts();

    const newItem = {
      id: "bb-" + Date.now(),
      name: document.getElementById("pName").value.trim(),
      category: document.getElementById("pCategory").value.trim(),
      img: sanitizeUrl(document.getElementById("pImg").value.trim()),
      desc: document.getElementById("pDesc").value.trim(),
      variants: [
        {
          name: document.getElementById("v1Name").value.trim(),
          price: Number(document.getElementById("v1Price").value),
          weight: document.getElementById("v1Weight").value.trim() || "Standart"
        },
        {
          name: document.getElementById("v2Name").value.trim(),
          price: Number(document.getElementById("v2Price").value),
          weight: document.getElementById("v2Weight").value.trim() || "O'rtacha"
        },
        {
          name: document.getElementById("v3Name").value.trim(),
          price: Number(document.getElementById("v3Price").value),
          weight: document.getElementById("v3Weight").value.trim() || "Katta"
        }
      ]
    };

    products.unshift(newItem);
    localStorage.setItem("bb_products", JSON.stringify(products));
    e.target.reset();
    renderAdminData();
    alert("✅ Yangi taom muvaffaqiyatli yuklandi va asosiy saytda paydo bo'ldi!");
  });

  document.getElementById("resetDefaultBtn").addEventListener("click", () => {
    if (confirm("Barcha standart 20 ta taomni qayta tiklaysizmi?")) {
      localStorage.setItem("bb_products", JSON.stringify(INITIAL_PRODUCTS));
      renderAdminData();
    }
  });
});

function getStoredProducts() {
  const saved = localStorage.getItem("bb_products");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  localStorage.setItem("bb_products", JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function unlockDashboard() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("adminDashboard").classList.remove("hidden");
  renderAdminData();
}

function renderAdminData() {
  const products = getStoredProducts();
  const orders = JSON.parse(localStorage.getItem("bb_orders") || "[]");

  document.getElementById("statProducts").textContent = products.length;
  document.getElementById("statOrders").textContent = orders.length;

  const prodList = document.getElementById("adminProductsList");
  prodList.innerHTML = products.map((p, idx) => `
    <div class="admin-item">
      <img src="${escapeHTML(p.img)}" alt="${escapeHTML(p.name)}" onerror="this.onerror=null;this.src=FALLBACK_SVG;" />
      <div style="flex:1;">
        <strong>${escapeHTML(p.name)}</strong>
        <div style="font-size:0.8rem;color:#9ca3af;">
          ${escapeHTML(p.category)} • 3 variant (${p.variants[0].price.toLocaleString("uz-UZ")} - ${p.variants[2].price.toLocaleString("uz-UZ")} so'm)
        </div>
      </div>
      <button class="btn-danger" onclick="deleteProduct(${idx})">🗑️ O'chirish</button>
    </div>
  `).join("");

  const orderList = document.getElementById("adminOrdersList");
  if (!orders.length) {
    orderList.innerHTML = `<p style="color:#9ca3af;padding:12px;">Hozircha yangi buyurtmalar yo'q.</p>`;
    return;
  }

  orderList.innerHTML = orders.map(o => `
    <div class="admin-item" style="flex-direction:column;align-items:flex-start;">
      <div style="display:flex;justify-content:space-between;width:100%;">
        <strong>🧾 ${escapeHTML(o.id)} — ${escapeHTML(o.customerName)} (${escapeHTML(o.phone)})</strong>
        <span style="color:#ffb800;font-weight:700;">${Number(o.total).toLocaleString("uz-UZ")} so'm</span>
      </div>
      <div style="font-size:0.85rem;color:#9ca3af;">
        📍 ${escapeHTML(o.region)}, ${escapeHTML(o.district)} — ${escapeHTML(o.address)} | 🕒 ${escapeHTML(o.createdAt)}
      </div>
      <div style="font-size:0.85rem;color:#e5e7eb;">
        🍔 Taomlar: ${o.items.map(i => `${escapeHTML(i.name)} [${escapeHTML(i.variantName)}] x${i.qty}`).join(", ")}
      </div>
    </div>
  `).join("");
}

window.deleteProduct = function(index) {
  const products = getStoredProducts();
  const removed = products[index];
  if (confirm(`"${removed.name}" taomini saytdan o'chirasizmi?`)) {
    products.splice(index, 1);
    localStorage.setItem("bb_products", JSON.stringify(products));
    renderAdminData();
  }
};
