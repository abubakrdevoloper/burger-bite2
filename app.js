// BURGER&BITE - Asosiy Mijoz Ilovasi Logikasi

// XSS himoyasi uchun matn tozalash funksiyasi
function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

// LocalStorage'dan mahsulotlarni olish (Admin panel o'zgarishlari bilan sinxron)
function getProducts() {
  const saved = localStorage.getItem("bb_products");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  localStorage.setItem("bb_products", JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

let products = getProducts();
let wishlist = JSON.parse(localStorage.getItem("bb_wishlist") || "[]");
let cart = JSON.parse(localStorage.getItem("bb_cart") || "[]");
let currentCategory = "Barchasi";
let selectedProduct = null;
let selectedVariantIdx = 0;

// Boshqa tabda Admin panel o'zgartirish kiritsa, darhol yangilash
window.addEventListener("storage", (e) => {
  if (e.key === "bb_products") {
    products = getProducts();
    renderCategories();
    renderProducts();
  }
});

// Toast xabarnoma
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// 1. HERO SLAYDER (HAR 5 SEKUNDDA O'ZGARADI)
let slideIndex = 0;
function initHeroSlider() {
  const dotsContainer = document.getElementById("heroDots");
  dotsContainer.innerHTML = HERO_SLIDES.map((_, i) =>
    `<button class="hero-dot ${i === 0 ? "active" : ""}" data-idx="${i}" aria-label="Slayd ${i + 1}"></button>`
  ).join("");

  dotsContainer.querySelectorAll(".hero-dot").forEach(btn => {
    btn.addEventListener("click", () => {
      slideIndex = Number(btn.dataset.idx);
      updateHeroSlide();
    });
  });

  updateHeroSlide();
  setInterval(() => {
    slideIndex = (slideIndex + 1) % HERO_SLIDES.length;
    updateHeroSlide();
  }, 5000);
}

function updateHeroSlide() {
  const slide = HERO_SLIDES[slideIndex];
  const img = document.getElementById("heroImg");
  const progress = document.getElementById("timerProgress");

  img.style.opacity = "0.2";
  setTimeout(() => {
    document.getElementById("heroBadge").textContent = slide.badge;
    document.getElementById("heroTitle").textContent = slide.title;
    document.getElementById("heroDesc").textContent = slide.desc;
    document.getElementById("heroPrice").textContent = slide.price;
    img.src = slide.img;
    img.onerror = () => { img.src = FALLBACK_SVG; };
    img.style.opacity = "1";
  }, 200);

  document.querySelectorAll(".hero-dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === slideIndex);
  });

  // 5 sekundlik progress animatsiyasi
  progress.style.transition = "none";
  progress.style.width = "0%";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progress.style.transition = "width 5s linear";
      progress.style.width = "100%";
    });
  });
}

// 2. KATEGORIYALAR VA 20 TA TAOMNI CHIZISH
function renderCategories() {
  const categories = ["Barchasi", ...new Set(products.map(p => p.category))];
  const container = document.getElementById("categoryFilters");
  container.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === currentCategory ? "active" : ""}" data-cat="${escapeHTML(cat)}">
      ${escapeHTML(cat)}
    </button>
  `).join("");

  container.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.cat;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const filtered = currentCategory === "Barchasi"
    ? products
    : products.filter(p => p.category === currentCategory);

  grid.innerHTML = filtered.map(item => {
    const isFav = wishlist.includes(item.id);
    const minPrice = item.variants && item.variants.length
      ? Math.min(...item.variants.map(v => v.price))
      : 0;

    return `
      <article class="product-card">
        <div class="card-img-box" onclick="openVariantModal('${escapeHTML(item.id)}')">
          <img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.name)}" onerror="this.onerror=null;this.src=FALLBACK_SVG;" />
          <span class="variant-pill">3 xil variant</span>
          <button class="fav-btn ${isFav ? "active" : ""}" onclick="event.stopPropagation(); toggleWishlist('${escapeHTML(item.id)}')" title="Yoqtirganlarga qo'shish">
            ${isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div class="card-body">
          <span class="card-category">${escapeHTML(item.category)}</span>
          <h3 class="card-title" onclick="openVariantModal('${escapeHTML(item.id)}')">${escapeHTML(item.name)}</h3>
          <p class="card-desc">${escapeHTML(item.desc)}</p>
          <div class="card-footer">
            <span class="card-price">${minPrice.toLocaleString("uz-UZ")} so'mdan</span>
            <button class="btn-select-variant" onclick="openVariantModal('${escapeHTML(item.id)}')">
              Tanlash (3)
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// 3. TAOMNING 3 XIL VARIANTI MODALI
window.openVariantModal = function(productId) {
  selectedProduct = products.find(p => p.id === productId);
  if (!selectedProduct) return;
  selectedVariantIdx = 0;
  renderVariantModalContent();
  document.getElementById("variantModal").classList.add("open");
};

function renderVariantModalContent() {
  const body = document.getElementById("variantModalBody");
  const variantsHtml = selectedProduct.variants.map((v, idx) => `
    <div class="variant-option ${idx === selectedVariantIdx ? "selected" : ""}" onclick="selectVariant(${idx})">
      <div>
        <strong>${idx + 1}-variant: ${escapeHTML(v.name)}</strong>
        <div style="font-size:0.82rem;color:#9ca3af;">Og'irligi / Hajmi: ${escapeHTML(v.weight || "Standart")}</div>
      </div>
      <strong style="color:#ffb800;">${Number(v.price).toLocaleString("uz-UZ")} so'm</strong>
    </div>
  `).join("");

  body.innerHTML = `
    <div class="variant-header">
      <img src="${escapeHTML(selectedProduct.img)}" alt="${escapeHTML(selectedProduct.name)}" onerror="this.onerror=null;this.src=FALLBACK_SVG;" />
      <div>
        <span class="card-category">${escapeHTML(selectedProduct.category)}</span>
        <h3>${escapeHTML(selectedProduct.name)}</h3>
        <p style="font-size:0.88rem;color:#9ca3af;">${escapeHTML(selectedProduct.desc)}</p>
      </div>
    </div>
    <h4 style="margin-bottom:10px;">3 xil variantdan birini tanlang:</h4>
    <div class="variant-options">${variantsHtml}</div>
    <button class="btn-primary full-width" onclick="addSelectedToCart()">
      🛒 Savatga qo'shish — ${Number(selectedProduct.variants[selectedVariantIdx].price).toLocaleString("uz-UZ")} so'm
    </button>
  `;
}

window.selectVariant = function(idx) {
  selectedVariantIdx = idx;
  renderVariantModalContent();
};

window.addSelectedToCart = function() {
  if (!selectedProduct) return;
  const variant = selectedProduct.variants[selectedVariantIdx];
  const cartKey = `${selectedProduct.id}__${selectedVariantIdx}`;
  const existing = cart.find(c => c.key === cartKey);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key: cartKey,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      variantName: variant.name,
      price: Number(variant.price),
      img: selectedProduct.img,
      qty: 1
    });
  }

  saveCart();
  document.getElementById("variantModal").classList.remove("open");
  showToast(`✅ "${selectedProduct.name} (${variant.name})" savatga qo'shildi!`);
};

// 4. YOQTIRGANLAR (YURAKCHA)
window.toggleWishlist = function(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast("💔 Yoqtirganlardan olib tashlandi");
  } else {
    wishlist.push(productId);
    showToast("❤️ Yoqtirganlarga saqlandi!");
  }
  localStorage.setItem("bb_wishlist", JSON.stringify(wishlist));
  updateBadges();
  renderProducts();
};

function renderWishlistModal() {
  const box = document.getElementById("wishlistItems");
  const favProducts = products.filter(p => wishlist.includes(p.id));
  if (!favProducts.length) {
    box.innerHTML = `<p style="color:#9ca3af;text-align:center;padding:20px;">Hozircha yoqtirgan taomlar yo'q.</p>`;
    return;
  }
  box.innerHTML = favProducts.map(p => `
    <div class="drawer-item">
      <img src="${escapeHTML(p.img)}" alt="${escapeHTML(p.name)}" onerror="this.onerror=null;this.src=FALLBACK_SVG;" />
      <div style="flex:1;">
        <strong>${escapeHTML(p.name)}</strong>
        <div style="font-size:0.82rem;color:#ffb800;">${p.variants[0].price.toLocaleString("uz-UZ")} so'mdan</div>
      </div>
      <button class="btn-select-variant" onclick="document.getElementById('wishlistModal').classList.remove('open'); openVariantModal('${escapeHTML(p.id)}')">Tanlash</button>
      <button class="qty-btn" onclick="toggleWishlist('${escapeHTML(p.id)}'); renderWishlistModal();">✕</button>
    </div>
  `).join("");
}

// 5. SAVAT VA BUYURTMA BERISH
function saveCart() {
  localStorage.setItem("bb_cart", JSON.stringify(cart));
  updateBadges();
}

function updateBadges() {
  document.getElementById("wishlistCount").textContent = wishlist.length;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = totalItems;
}

function renderCartModal() {
  const box = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotalPrice");

  if (!cart.length) {
    box.innerHTML = `<p style="color:#9ca3af;text-align:center;padding:20px;">Savatingiz bo'sh. Menyudan mazali taom tanlang!</p>`;
    totalEl.textContent = "0 so'm";
    return;
  }

  let total = 0;
  box.innerHTML = cart.map((item, idx) => {
    total += item.price * item.qty;
    return `
      <div class="drawer-item">
        <img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.name)}" onerror="this.onerror=null;this.src=FALLBACK_SVG;" />
        <div style="flex:1;">
          <strong>${escapeHTML(item.name)}</strong>
          <div style="font-size:0.8rem;color:#9ca3af;">Variant: ${escapeHTML(item.variantName)}</div>
          <div style="font-size:0.88rem;color:#ffb800;">${(item.price * item.qty).toLocaleString("uz-UZ")} so'm</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeCartQty(${idx}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeCartQty(${idx}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  totalEl.textContent = `${total.toLocaleString("uz-UZ")} so'm`;
}

window.changeCartQty = function(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  renderCartModal();
};

// 6. 12 TA VILOYAT VA TUMANLAR KASKADI + 2 XIL MANZIL USULI
function initRegionsAndAddress() {
  const regionSelect = document.getElementById("regionSelect");
  const districtSelect = document.getElementById("districtSelect");

  Object.keys(UZBEKISTAN_REGIONS).forEach(region => {
    const opt = document.createElement("option");
    opt.value = region;
    opt.textContent = region;
    regionSelect.appendChild(opt);
  });

  regionSelect.addEventListener("change", () => {
    const selectedRegion = regionSelect.value;
    districtSelect.innerHTML = `<option value="">-- Tumanni tanlang --</option>`;
    if (!selectedRegion) {
      districtSelect.disabled = true;
      return;
    }
    districtSelect.disabled = false;
    UZBEKISTAN_REGIONS[selectedRegion].forEach(dist => {
      const opt = document.createElement("option");
      opt.value = dist;
      opt.textContent = dist;
      districtSelect.appendChild(opt);
    });
  });

  // 2 xil manzil rejimi: Qo'lda yoki Google Map
  const btnManual = document.getElementById("btnManualAddr");
  const btnMap = document.getElementById("btnMapAddr");
  const manualBox = document.getElementById("manualAddressBox");
  const mapBox = document.getElementById("mapAddressBox");

  btnManual.addEventListener("click", () => {
    btnManual.classList.add("active");
    btnMap.classList.remove("active");
    manualBox.classList.remove("hidden");
    mapBox.classList.add("hidden");
  });

  btnMap.addEventListener("click", () => {
    btnMap.classList.add("active");
    btnManual.classList.remove("active");
    mapBox.classList.remove("hidden");
    manualBox.classList.add("hidden");
  });

  // GPS orqali Google Map koordinatasini aniqlash
  document.getElementById("detectGpsBtn").addEventListener("click", () => {
    const coordsInput = document.getElementById("mapCoordsInput");
    const mapFrame = document.getElementById("googleMapFrame");
    coordsInput.value = "Joylashuv aniqlanmoqda...";

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          coordsInput.value = `GPS: ${lat}, ${lng}`;
          mapFrame.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
          showToast("📍 Google Map joylashuvingiz aniqlandi!");
        },
        () => {
          coordsInput.value = "40.782100, 72.344200 (Andijon markazi)";
          showToast("⚠️ GPS ruxsati berilmadi, standart xarita nuqtasi tanlandi.");
        }
      );
    } else {
      coordsInput.value = "40.782100, 72.344200";
    }
  });

  // Buyurtmani yuborish (Admin panelda ko'rinadi)
  document.getElementById("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cart.length) {
      showToast("⚠️ Avval savatga taom qo'shing!");
      return;
    }

    const isMapMode = btnMap.classList.contains("active");
    const addressValue = isMapMode
      ? (document.getElementById("mapCoordsInput").value || "Google Map orqali belgilangan")
      : document.getElementById("manualAddressInput").value.trim();

    if (!addressValue) {
      showToast("⚠️ Iltimos, yetkazib berish manzilini kiriting!");
      return;
    }

    const newOrder = {
      id: "ORD-" + Date.now().toString().slice(-6),
      customerName: document.getElementById("custName").value.trim(),
      phone: document.getElementById("custPhone").value.trim(),
      region: regionSelect.value,
      district: districtSelect.value,
      address: addressValue,
      items: [...cart],
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      createdAt: new Date().toLocaleString("uz-UZ"),
      status: "Yangi buyurtma"
    };

    const existingOrders = JSON.parse(localStorage.getItem("bb_orders") || "[]");
    existingOrders.unshift(newOrder);
    localStorage.setItem("bb_orders", JSON.stringify(existingOrders));

    cart = [];
    saveCart();
    document.getElementById("cartModal").classList.remove("open");
    e.target.reset();
    showToast(`🎉 Buyurtmangiz (${newOrder.id}) qabul qilindi! Tez orada bog'lanamiz.`);
  });
}

// 7. RO'YXATDAN O'TISH
function initAuth() {
  const savedUser = JSON.parse(localStorage.getItem("bb_user") || "null");
  if (savedUser && savedUser.name) {
    document.getElementById("userDisplayName").textContent = `👤 ${savedUser.name}`;
    document.getElementById("custName").value = savedUser.name;
    document.getElementById("custPhone").value = savedUser.phone;
  }

  document.getElementById("authForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = {
      name: document.getElementById("regName").value.trim(),
      phone: document.getElementById("regPhone").value.trim()
    };
    localStorage.setItem("bb_user", JSON.stringify(user));
    document.getElementById("userDisplayName").textContent = `👤 ${user.name}`;
    document.getElementById("custName").value = user.name;
    document.getElementById("custPhone").value = user.phone;
    document.getElementById("authModal").classList.remove("open");
    showToast(`👋 Xush kelibsiz, ${user.name}!`);
  });
}

// 8. UMUMIY MODAL VA MOBIL MENYU BOSHQARUVI
document.addEventListener("DOMContentLoaded", () => {
  initHeroSlider();
  renderCategories();
  renderProducts();
  updateBadges();
  initRegionsAndAddress();
  initAuth();

  document.getElementById("openWishlistBtn").addEventListener("click", () => {
    renderWishlistModal();
    document.getElementById("wishlistModal").classList.add("open");
  });

  document.getElementById("openCartBtn").addEventListener("click", () => {
    renderCartModal();
    document.getElementById("cartModal").classList.add("open");
  });

  document.getElementById("openAuthBtn").addEventListener("click", () => {
    document.getElementById("authModal").classList.add("open");
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.close).classList.remove("open");
    });
  });

  document.getElementById("mobileMenuBtn").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });
});
