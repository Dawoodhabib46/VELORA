// Header Section Start
document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('closeHeader-button');
  const header = document.getElementById('header_start');
  closeBtn.addEventListener('click', function () {
    header.style.transition = 'all 0.2s ease';
    header.style.height = '0';
    header.style.padding = '0';
    header.style.overflow = 'hidden';
    setTimeout(() => {
      header.style.display = 'none';
    }, 200);
  });
});
// Header Section Close ///////////////////////////////////////////////////////////////

// Start Navigation Section 
// Desktop Screen Navigation (Hover dropdown on desktop only)
document.querySelectorAll('.navbar .dropdown').forEach(drop => {
  const link = drop.querySelector('.nav-link');
  const menu = drop.querySelector('.dropdown-menu');

  drop.addEventListener('mouseenter', () => {
    if (window.innerWidth >= 992) {
      drop.classList.add('show');
      menu.classList.add('show');
      link.setAttribute('aria-expanded', 'true');
    }
  });

  drop.addEventListener('mouseleave', () => {
    if (window.innerWidth >= 992) {
      drop.classList.remove('show');
      menu.classList.remove('show');
      link.setAttribute('aria-expanded', 'false');
    }
  });
});
// Mobile Screen Navigation
document.querySelectorAll('.navbar .dropdown').forEach(drop => {
  drop.addEventListener('mouseenter', () => { if (window.innerWidth >= 992) drop.classList.add('show'); });
  drop.addEventListener('mouseleave', () => { if (window.innerWidth >= 992) drop.classList.remove('show'); });
});

// OPEN search bar
document.querySelectorAll('#searchToggle').forEach(icon => {
  icon.addEventListener('click', function () {
    if (this.querySelector('.bi-search')) {
      document.getElementById("searchDropdown").style.display = "block";
    }
  });
});
// CLOSE search bar
document.getElementById("closeSearch-button").addEventListener("click", function () {
  document.getElementById("searchDropdown").style.display = "none";
});

// add to cart button 
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// add product to cart
function addToCart(title, price, img) {
  cart.push({ title, price, img });
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
function renderCart() {
  const cartContainer = document.getElementById('cartItems');
  const totalPriceEl = document.getElementById('totalPrice');
  const checkoutContainer = document.getElementById('checkoutCanvas');
  const cartCountEl = document.getElementById('cartCount');

  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    // calculate total for this item
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'd-flex align-items-center mb-2';
    div.innerHTML = `
            <img src="${item.img}" width="50" class="me-2 rounded">
            <div class="flex-grow-1">
                <div>${item.title}</div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                    <span id="qty-${index}">${item.quantity || 1}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <small>Rs <span id="price-${index}">${itemTotal}</span></small>
            </div>
            <button class="btn btn-sm btn-danger" onclick="removeCartItem(${index})">&times;</button>
        `;
    cartContainer.appendChild(div);
  });

  totalPriceEl.textContent = total;
  cartCountEl.textContent = cart.length;

  // Render checkout items dynamically
  let checkoutItems = checkoutContainer.querySelector('#checkoutItems');
  if (!checkoutItems) {
    checkoutItems = document.createElement('div');
    checkoutItems.id = 'checkoutItems';
    checkoutContainer.insertBefore(checkoutItems, checkoutContainer.querySelector('hr').nextSibling);
  }
  checkoutItems.innerHTML = '';
  cart.forEach((item, index) => {
    const itemTotal = item.price * (item.quantity || 1);
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center mb-2';
    div.innerHTML = `
            <img src="${item.img}" width="50" class="me-2 rounded">
            <div class="flex-grow-1">
                <div>${item.title}</div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                    <span id="checkout-qty-${index}">${item.quantity || 1}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <small>Rs <span id="checkout-price-${index}">${itemTotal}</span></small>
            </div>
        `;
    checkoutItems.appendChild(div);
  });
}
// Update quantity
function updateQuantity(index, delta) {
  if (!cart[index].quantity) cart[index].quantity = 1;
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1; // minimum 1

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// checkoutCanvas 
function removeCartItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  validateCheckoutForm();
});

// Checkout form validation
function validateCheckoutForm() {
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const checkoutCanvas = document.getElementById('checkoutCanvas');
  const inputs = checkoutCanvas.querySelectorAll('input[required]');
  const thankyou = document.getElementById('thankyou');

  // thank you 
  thankyou.style.display = 'none';
  placeOrderBtn.disabled = true;

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      let allFilled = true;
      inputs.forEach(i => { if (i.value.trim() === '') allFilled = false; });
      placeOrderBtn.disabled = !allFilled;
    });
  });

  placeOrderBtn.addEventListener('click', () => {
    // show thank you message
    thankyou.style.display = 'block';
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    inputs.forEach(i => i.value = '');
    placeOrderBtn.disabled = true;
  });
}


// End  Navigation

// Start Hero Section 
// jQuery Sorting Products
$(function () {
  window._originalOrder = $("#products .item").get();
  $("#sortMenu a").on("click", function (e) {
    e.preventDefault();
    const type = $(this).data("sort");
    const $container = $("#products");
    let items = $container.find(".item").get();
    const getName = el => {
      return String($(el).data("name") ?? $(el).attr("data-name") ?? "").trim().toLowerCase();
    };
    const getPrice = el => Number($(el).data("price") ?? $(el).attr("data-price") ?? 0);
    const getSold = el => Number($(el).data("sold") ?? $(el).attr("data-sold") ?? 0);
    if (type === "featured") {
      if (window._originalOrder && window._originalOrder.length) {
        $container.append(window._originalOrder);
      }
      return;
    }
    items.sort(function (a, b) {
      if (type === "az") return getName(a).localeCompare(getName(b));
      if (type === "za") return getName(b).localeCompare(getName(a));
      if (type === "low") return getPrice(a) - getPrice(b);
      if (type === "high") return getPrice(b) - getPrice(a);
      if (type === "best") return getSold(b) - getSold(a);
      return 0;
    });
    $container.append(items);
  });
});

// Product Model
(function () {
  // Set this to your login/account page path
  const ACCOUNT_PAGE = '/account.html';

  // Currently selected product (for compare / download)
  let currentProduct = null;

  // Helper: check login flag (localStorage)
  function isUserLoggedIn() {
    return localStorage.getItem('userLoggedIn') === '1';
  }

  // Universal modal filler
  function showProductModal() {
    let product = {};
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
      product = arguments[0];
    } else {
      const [name, img, price, color, description, pdf] = arguments;
      product = { name, img, price, color, description, pdf };
    }

    currentProduct = {
      name: product.name || '',
      img: product.img || '',
      price: product.price || 0,
      color: product.color || '',
      description: product.description || '',
      pdf: product.pdf || product.download || ''
    };

    const titleEl = document.getElementById('cardModalTitle');
    const imgEl = document.getElementById('cardModalImg');
    const priceEl = document.getElementById('cardModalPrice');
    const colorEl = document.getElementById('cardModalColor');
    const descEl = document.getElementById('cardModalDesc');
    const actionBtn = document.getElementById('modalActionBtn');

    if (titleEl) titleEl.textContent = currentProduct.name;
    if (imgEl) {
      imgEl.src = currentProduct.img || '';
      imgEl.alt = currentProduct.name || '';
    }
    if (priceEl) priceEl.textContent = currentProduct.price ? 'Rs. ' + currentProduct.price : '';
    if (colorEl) colorEl.textContent = currentProduct.color || '';
    if (descEl) descEl.textContent = currentProduct.description || '';

    if (actionBtn) {
      actionBtn.dataset.pdf = currentProduct.pdf || '';
      actionBtn.href = currentProduct.pdf || '#';
    }

    const modalEl = document.getElementById('cardModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // Expose for HTML inline compatibility
  window.openModal = showProductModal;
  window.showProductModal = showProductModal;

  // Compare button handler: add currentProduct to localStorage compare list, then reload
  document.addEventListener('click', function (e) {
    const compareBtn = e.target.closest('#modalCompareBtn');
    if (!compareBtn) return;

    if (!currentProduct) {
      compareBtn.textContent = 'No product';
      setTimeout(() => (compareBtn.textContent = 'Compare Product'), 1000);
      return;
    }

    try {
      const key = 'compareProducts';
      const list = JSON.parse(localStorage.getItem(key)) || [];
      const exists = list.some(p => p.name === currentProduct.name && p.img === currentProduct.img);

      if (!exists) {
        list.push({
          name: currentProduct.name,
          img: currentProduct.img,
          price: currentProduct.price,
          color: currentProduct.color,
          description: currentProduct.description
        });
        localStorage.setItem(key, JSON.stringify(list));
        compareBtn.textContent = 'Added ✓';
      } else {
        compareBtn.textContent = 'Already Added';
      }
    } catch (err) {
      console.error('Compare error', err);
      compareBtn.textContent = 'Error';
    }

    // show result briefly, then reload the page so UI updates everywhere
    setTimeout(() => {
      try { location.reload(); } catch (e) { window.location.href = window.location.href; }
    }, 600); // 600ms delay to allow user to see feedback
  });

  // modalActionBtn handler — triggers login redirect or file download, then reload after download starts
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('#modalActionBtn');
    if (!btn) return;

    const pdf = btn.dataset.pdf;
    if (!pdf) {
      return;
    }

    if (!isUserLoggedIn()) {
      e.preventDefault();

      const currentPage = window.location.pathname + window.location.search;
      const returnUrl = encodeURIComponent(currentPage);
      const downloadParam = encodeURIComponent(pdf);

      const accountUrl = `${ACCOUNT_PAGE}?return=${returnUrl}&download=${downloadParam}`;
      window.location.href = accountUrl;
      return;
    }

    // Logged in → perform download via temporary anchor, then reload
    e.preventDefault();
    try {
      const a = document.createElement('a');
      a.href = pdf;
      a.download = pdf.split('/').pop() || 'file';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download failed', err);
      window.open(pdf, '_blank');
    }

    // Allow a small delay so browser starts download, then reload page
    setTimeout(() => {
      try { location.reload(); } catch (e) { window.location.href = window.location.href; }
    }, 900); // 900ms for download to initiate
  });

  // On load: auto-fill compare table if exists
  window.addEventListener('load', function () {
    const compareTableEl = document.getElementById('compareTable');
    if (!compareTableEl) return;

    try {
      const compareProducts = JSON.parse(localStorage.getItem('compareProducts')) || [];
      if (!compareProducts.length) {
        compareTableEl.innerHTML = "<tr><td colspan='5'>No products to compare</td></tr>";
        return;
      }

      let tableContent = '';
      compareProducts.forEach((product) => {
        tableContent += `
          <tr>
            <td><img src="${product.img}" width="100" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>Rs. ${product.price}</td>
            <td>${product.color || ''}</td>
            <td>${product.description || ''}</td>
          </tr>`;
      });

      compareTableEl.innerHTML = tableContent;
    } catch (err) {
      console.error('Compare table build error', err);
      compareTableEl.innerHTML = "<tr><td colspan='5'>Error loading compare table</td></tr>";
    }
  });

  // Auto-download after successful login if ?download=... present and user is logged in.
  window.addEventListener('DOMContentLoaded', function () {
    try {
      const params = new URLSearchParams(window.location.search);
      const download = params.get('download');
      if (!download) return;
      if (!isUserLoggedIn()) return;

      const decoded = decodeURIComponent(download);
      const a = document.createElement('a');
      a.href = decoded;
      a.download = decoded.split('/').pop() || 'file';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // remove download param from URL without reloading
      const url = new URL(window.location);
      url.searchParams.delete('download');
      window.history.replaceState({}, document.title, url.pathname + url.search);

      // reload after short delay so page state becomes normal
      setTimeout(() => {
        try { location.reload(); } catch (e) { window.location.href = window.location.href; }
      }, 900);
    } catch (err) {
      console.error('Auto-download error', err);
    }
  });

  // onLoginSuccess helper: sets login flag and returns to page (with download param preserved)
  window.onLoginSuccess = function () {
    try {
      localStorage.setItem('userLoggedIn', '1');
      const params = new URLSearchParams(window.location.search);
      const returnParam = params.get('return') ? decodeURIComponent(params.get('return')) : '/';
      const download = params.get('download');

      if (download) {
        const sep = returnParam.includes('?') ? '&' : '?';
        window.location.href = `${returnParam}${sep}download=${encodeURIComponent(download)}`;
      } else {
        window.location.href = returnParam;
      }
    } catch (err) {
      console.error('onLoginSuccess error', err);
      window.location.href = '/';
    }
  };

})();

// Model Show Main Page 
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("signupModalShown")) {

    // Show modal after 1.5 seconds
    setTimeout(function () {
      let myModal = new bootstrap.Modal(document.getElementById('signupModal'));
      myModal.show();

      // Mark as shown
      localStorage.setItem("signupModalShown", "true");
    }, 1500);
  }
});
document.getElementById("signupModal").addEventListener("hidden.bs.modal", function () {
  localStorage.setItem("signupModalShown", "true");
});