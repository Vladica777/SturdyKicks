// =========================
// CART SYSTEM (LOCALSTORAGE)
// =========================

// 1. Încărcăm coșul la pornire
function loadCart() {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
}

let cart = loadCart();

// 2. Salvăm coșul în localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 3. Cantitatea totală din coș
function getCartTotalQty() {
  return cart.reduce((sum, item) => sum + (item.qty || 0), 0);
}

// 4. Actualizăm badge-ul de coș
function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;

  const totalQty = getCartTotalQty();
  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? "inline-block" : "none";
}

// 5. Adaugă un produs în coș
function addToCart(productId) {
  if (!productId) return;

  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  updateCartBadge();
}

// 6. Leagă toate butoanele [data-product-id] de coș
function attachAddToCartButtons() {
  const buttons = document.querySelectorAll("[data-product-id]");
  buttons.forEach((btn) => {
    // ca să nu legăm de mai multe ori același buton
    if (btn.dataset.cartBound === "1") return;
    btn.dataset.cartBound = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();     // nu mai folosește href
      e.stopPropagation();    // nu mai propagă click-ul la <article> (card)
      const id = btn.getAttribute("data-product-id");
      addToCart(id);
    });
  });
}

// =========================
// PRODUCT PAGE – DATE DIN JSON
// =========================

function getProductId() {
  return new URLSearchParams(window.location.search).get("id");
}

async function loadProductPageFromJSON() {
  // rulează doar dacă suntem pe pagina de produs
  const mainImg = document.getElementById("mainImg");
  const titleEl = document.getElementById("productTitle");
  const colorEl = document.getElementById("productColor");
  const priceEl = document.getElementById("productPrice");
  const descEl = document.getElementById("productDescription");
  const thumbsContainer = document.getElementById("thumbnailsContainer");

  if (!mainImg || !titleEl || !colorEl || !priceEl || !descEl || !thumbsContainer) {
    return; // nu suntem pe product.html / Product buying.html
  }

  const id = getProductId();
  if (!id) return;

  try {
    const res = await fetch("products.json");
    const products = await res.json();
    const product = products.find((p) => p.id === id);
    if (!product) return;

    // setăm datele din JSON
    mainImg.src = product.mainImage;
    mainImg.alt = product.name;

    titleEl.textContent = product.name;
    colorEl.textContent = product.color;
    priceEl.textContent = product.price;
    descEl.textContent = product.description;

    // thumbnails
    thumbsContainer.innerHTML = "";
    if (Array.isArray(product.thumbnails)) {
      product.thumbnails.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = product.name;
        img.className = "thumbnail";
        img.addEventListener("click", () => {
          mainImg.src = src;
        });
        thumbsContainer.appendChild(img);
      });
    }

    // adăugăm productId pe butonul "Add to cart" de pe pagina produsului (dacă există)
    const addBtn = document.querySelector(".product-info .button-light");
    if (addBtn) {
      addBtn.setAttribute("data-product-id", product.id);
      // atașăm direct aici handler-ul pentru siguranță
      if (addBtn.dataset.cartBound !== "1") {
        addBtn.dataset.cartBound = "1";
        addBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart(product.id);
        });
      }
    }
  } catch (err) {
    console.error("Eroare la încărcarea produsului din JSON:", err);
  }
}

// =========================
// CHECKOUT PAGE – Order summary din coș
// =========================

async function loadCheckoutPage() {
  const cartContainer = document.getElementById("cartItems");
  if (!cartContainer) return; // nu suntem pe pagina de checkout

  const currentCart = loadCart();
  if (!currentCart.length) {
    cartContainer.innerHTML = `<p style="padding:20px;">Your cart is empty.</p>`;
    const subtotalEl = document.getElementById("subtotalValue");
    const totalEl = document.getElementById("totalValue");
    if (subtotalEl) subtotalEl.textContent = "0€";
    if (totalEl) totalEl.textContent = "0€";
    return;
  }

  try {
    const res = await fetch("products.json");
    const products = await res.json();

    let subtotal = 0;
    cartContainer.innerHTML = "";

    currentCart.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return;

      const priceNum = parseFloat(
        product.price.replace("€", "").replace(",", ".")
      );
      const qty = item.qty || 1;
      const itemTotal = priceNum * qty;
      subtotal += itemTotal;

      cartContainer.innerHTML += `
        <article class="product-summary">
          <div class="product-main">
            <img src="${product.mainImage}" class="product-image" alt="${product.name}">
            <div class="product-description">
              <h5>${product.name}</h5>
              <p>${product.color}</p>
              <p>Qty: ${qty}</p>
            </div>
          </div>
          <div class="product-price">
            <h5>${itemTotal.toFixed(2)}€</h5>
          </div>
        </article>
      `;
    });

    const subtotalEl = document.getElementById("subtotalValue");
    const totalEl = document.getElementById("totalValue");
    const shippingEl = document.getElementById("shippingValue");

    const shipping = shippingEl
      ? parseFloat(shippingEl.textContent.replace("€", "").replace(",", "."))
      : 7.24;

    const total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + "€";
    if (totalEl) totalEl.textContent = total.toFixed(2) + "€";
    const payBtn = document.getElementById("payButton");
    if (payBtn) {
      payBtn.textContent = `Pay ${total.toFixed(2)}€`;
    }

  } catch (err) {
    console.error("Eroare la încărcarea paginii de checkout:", err);
  }
}

// =========================
// FALLBACK pentru schimbare imagine (dacă mai ai onclick în HTML)
// =========================
function changeImage(imageSrc) {
  const mainImage = document.getElementById("mainImg");
  if (mainImage) {
    mainImage.src = imageSrc;
  }
}

// =========================
// DOMContentLoaded – NAV, TRENDING, PREVIEW, SEARCH, USER, CART
// =========================
document.addEventListener("DOMContentLoaded", function () {
  // -------------------------
  // BURGER NAV
  // -------------------------
  const navToggle = document.querySelector(".nav-toggle");
  const navInner = document.querySelector(".nav-inner");

  if (navToggle && navInner) {
    navToggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
    });
  }

  // -------------------------
  // TRENDING CATEGORIES + ROWS
  // -------------------------
  const trendingSection = document.querySelector(".trending");
  if (trendingSection) {
    const categories = trendingSection.querySelectorAll(".categories .category");
    const defaultState = document.getElementById("defaultState");

    const airForceRow = document.getElementById("air-force-row");
    const airJordan1Row = document.getElementById("air-jordan-1-row");
    const airJordan4Row = document.getElementById("air-jordan-4-row");
    const dunksRow = document.getElementById("dunks-row");

    const rows = {
      "air-force": airForceRow,
      "air-jordan": airJordan1Row,
      "air-jordan-4": airJordan4Row,
      dunks: dunksRow,
    };

    function hideAllRows() {
      Object.values(rows).forEach((row) => {
        if (row) row.style.display = "none";
      });
    }

    function showRow(key) {
      if (defaultState) defaultState.style.display = "none";
      hideAllRows();
      const row = rows[key];
      if (row) row.style.display = "grid";
    }

    function showDefaultState() {
      hideAllRows();
      if (defaultState) defaultState.style.display = "grid";
    }

    categories.forEach((cat) => {
      cat.addEventListener("click", () => {
        const model = cat.dataset.model;

        categories.forEach((c) => c.classList.remove("is-active-category"));
        cat.classList.add("is-active-category");

        if (model === "others") {
          showDefaultState();
        } else {
          showRow(model);
        }
      });
    });

    // PREVIEW CARDS CLICK
    const previewCards = trendingSection.querySelectorAll("#preview .card");

    previewCards.forEach((card) => {
      card.addEventListener("click", () => {
        if (card.classList.contains("air-force")) {
          showRow("air-force");
        } else if (card.classList.contains("air-jordan-4")) {
          showRow("air-jordan-4");
        } else if (card.classList.contains("air-jordan")) {
          showRow("air-jordan");
        } else if (card.classList.contains("dunks")) {
          showRow("dunks");
        }
      });
    });
  }

  // -------------------------
  // SEARCH – filtrează cardurile după text
  // -------------------------
  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-button");

  function applySearch() {
    if (!searchInput) return;
    const term = searchInput.value.trim().toLowerCase();

    const cards = document.querySelectorAll(".card-grid article.card");
    if (!cards.length) return;

    if (!term) {
      cards.forEach((card) => {
        card.style.display = "flex";
      });
      return;
    }

    cards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(term) ? "flex" : "none";
    });
  }

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", applySearch);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        applySearch();
      }
    });
  }

  // -------------------------
  // USER DROPDOWN (LOG IN / SIGN UP)
  // -------------------------
  const userBtn = document.querySelector(".user-button");
  const userDropdown = document.querySelector(".user-dropdown");

  if (userBtn && userDropdown) {
    userBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.style.display =
        userDropdown.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", () => {
      userDropdown.style.display = "none";
    });
  }

  // -------------------------
  // PORNIM FUNCȚIILE GLOBALE
  // -------------------------
  attachAddToCartButtons();   // pentru butoanele de pe index
  updateCartBadge();          // badge-ul coșului
  loadProductPageFromJSON();  // dacă suntem pe pagina produsului
  loadCheckoutPage();         // dacă suntem pe pagina de checkout
});
