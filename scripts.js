// =========================
// CART BADGE (număr coș)
// =========================
let cartCount = 0;
const cartBadge = document.querySelector('.cart-badge');

function updateCartBadge() {
  if (!cartBadge) return;
  cartBadge.textContent = cartCount;
  cartBadge.style.display = cartCount > 0 ? 'inline-block' : 'none';
}

// orice buton "Add to cart" (carduri produse)
document.querySelectorAll('.button.button-dark.align-end').forEach(btn => {
  btn.addEventListener('click', () => {
    cartCount++;
    updateCartBadge();
  });
});

// =========================
// DOMContentLoaded – NAV, TRENDING, PREVIEW, SEARCH
// =========================
document.addEventListener('DOMContentLoaded', function () {
  // -------------------------
  // BURGER NAV
  // -------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navInner = document.querySelector('.nav-inner');

  if (navToggle && navInner) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // -------------------------
  // TRENDING CATEGORIES + ROWS
  // -------------------------
  const trendingSection = document.querySelector('.trending');
  if (trendingSection) {
    const categories = trendingSection.querySelectorAll('.categories .category');
    const defaultState = document.getElementById('defaultState');

    const airForceRow = document.getElementById('air-force-row');
    const airJordan1Row = document.getElementById('air-jordan-1-row');
    const airJordan4Row = document.getElementById('air-jordan-4-row');
    const dunksRow = document.getElementById('dunks-row');

    const rows = {
      'air-force': airForceRow,
      'air-jordan': airJordan1Row,
      'air-jordan-4': airJordan4Row,
      'dunks': dunksRow
    };

    function hideAllRows() {
      Object.values(rows).forEach(row => {
        if (row) row.style.display = 'none';
      });
    }

    function showRow(key) {
      if (!defaultState) return;
      defaultState.style.display = 'none';
      hideAllRows();
      const row = rows[key];
      if (row) row.style.display = 'grid';
    }

    function showDefaultState() {
      hideAllRows();
      if (defaultState) defaultState.style.display = 'grid';
    }

    categories.forEach(cat => {
      cat.addEventListener('click', () => {
        const model = cat.dataset.model;

        // stil vizual pentru categoria activă (opțional, dacă ai o clasă în CSS)
        categories.forEach(c => c.classList.remove('is-active-category'));
        cat.classList.add('is-active-category');

        if (model === 'others') {
          showDefaultState();
        } else {
          showRow(model);
        }
      });
    });

    // -------------------------
    // PREVIEW CARDS CLICK (caruselul vizual)
    // -------------------------
    const previewCards = trendingSection.querySelectorAll('#preview .card');

    previewCards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('air-force')) {
          showRow('air-force');
        } else if (card.classList.contains('air-jordan-4')) {
          showRow('air-jordan-4');
        } else if (card.classList.contains('air-jordan')) {
          showRow('air-jordan');
        } else if (card.classList.contains('dunks')) {
          showRow('dunks');
        }
      });
    });
  }

  // -------------------------
  // SEARCH – filtrează cardurile după text
  // -------------------------
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');

  function applySearch() {
    if (!searchInput) return;
    const term = searchInput.value.trim().toLowerCase();

    // toate cardurile de produse din grid-uri
    const cards = document.querySelectorAll('.card-grid article.card');
    if (!cards.length) return;

    if (!term) {
      // dacă nu e niciun text – arată toate cardurile
      cards.forEach(card => {
        card.style.display = 'flex';
      });
      return;
    }

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(term) ? 'flex' : 'none';
    });
  }

  if (searchInput && searchButton) {
    searchButton.addEventListener('click', applySearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        applySearch();
      }
    });
  }
});

// =========================
// IMAGE CHANGE – fallback (dacă mai folosești onclick în HTML)
// =========================
function changeImage(imageSrc) {
  const mainImage = document.getElementById('mainImg');
  if (mainImage) {
    mainImage.src = imageSrc;
  }
}

// =========================
// USER DROPDOWN (LOG IN / SIGN UP)
// =========================
document.addEventListener('DOMContentLoaded', function () {
  const userBtn = document.querySelector('.user-button');
  const userDropdown = document.querySelector('.user-dropdown');

  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.style.display =
        userDropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', () => {
      userDropdown.style.display = 'none';
    });
  }
});

// =========================
// PRODUCT PAGE – DATE DIN JSON
// =========================
function getProductId() {
  return new URLSearchParams(window.location.search).get('id');
}

async function loadProduct() {
  // rulează doar dacă există elementele de product page
  const mainImg = document.getElementById('mainImg');
  const titleEl = document.getElementById('productTitle');
  const colorEl = document.getElementById('productColor');
  const priceEl = document.getElementById('productPrice');
  const descEl = document.getElementById('productDescription');
  const thumbsContainer = document.getElementById('thumbnailsContainer');

  if (!mainImg || !titleEl || !colorEl || !priceEl || !descEl || !thumbsContainer) {
    return; // nu suntem pe product.html
  }

  const id = getProductId();
  if (!id) return;

  try {
    const res = await fetch('products.json');
    const products = await res.json();
    const product = products.find(p => p.id === id);
    if (!product) return;

    // setăm datele din JSON
    mainImg.src = product.mainImage;
    mainImg.alt = product.name;

    titleEl.textContent = product.name;
    colorEl.textContent = product.color;
    priceEl.textContent = product.price;
    descEl.textContent = product.description;

    thumbsContainer.innerHTML = '';
    if (Array.isArray(product.thumbnails)) {
      product.thumbnails.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = product.name;
        img.className = 'thumbnail';
        img.addEventListener('click', () => {
          mainImg.src = src;
        });
        thumbsContainer.appendChild(img);
      });
    }
  } catch (err) {
    console.error('Eroare la încărcarea produsului din JSON:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadProduct);



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

// 3. Actualizăm badge-ul de coș
function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    badge.textContent = cart.length;
    badge.style.display = cart.length > 0 ? "flex" : "none";
  }
}

// rulează inițial
updateCartBadge();

// 4. Adaugă un produs în coș
function addToCart(productId) {
  // dacă produsul există deja în coș, doar îi creștem cantitatea
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty++;
  } else {
    // altfel îl adăugăm
    cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  updateCartBadge();
}

// 5. Activăm toate butoanele Add to cart
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-product-id]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();   // prevenim click-ul pe card
      const id = btn.getAttribute("data-product-id");
      addToCart(id);
    });
  });
});
