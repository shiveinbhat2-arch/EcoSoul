/* ==============================================
   EcoSoul – script.js
   Features: Cart system, Filters, Smooth scroll,
             Navbar scroll effect, Toast, Hamburger
   ============================================== */

'use strict';

/* ─── State ──────────────────────────────────── */
let cart = [];   // Array of { id, name, price, qty, emoji }

/* ─── Product emoji map ──────────────────────── */
const productEmoji = {
  1: '🌸', 2: '🪵', 3: '🌹',
  4: '🌸', 5: '🌿', 6: '🍃', 7: '🌺',
  8: '🍂', 9: '🌼', 10: '✍️', 11: '🌾',
  12: '🌍', 13: '💐', 14: '☯️', 15: '📜'
};

/* ─── Cart: Add to Cart ──────────────────────── */
function addToCart(id, name, price) {
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1, emoji: productEmoji[id] || '🌿' });
  }

  updateCartUI();
  bumpCartCount();
  showToast(`✅ ${name} added to cart!`);
}

/* ─── Cart: Remove Item ──────────────────────── */
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
  showToast('🗑️ Item removed from cart.');
}

/* ─── Cart: Change Quantity ──────────────────── */
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  updateCartUI();
}

/* ─── Cart: Clear All ────────────────────────── */
function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  updateCartUI();
  showToast('🧹 Cart cleared.');
}

/* ─── Cart: Checkout ─────────────────────────── */
function checkout() {
  if (cart.length === 0) {
    showToast('🛒 Your cart is empty!');
    return;
  }

  const itemList = cart.map(i => `• ${i.name} ×${i.qty} — ₹${i.price * i.qty}`).join('\n');
  const total    = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  alert(
    `🌿 Proceeding to Checkout!\n\n` +
    `Order Summary:\n${itemList}\n\n` +
    `Total: ₹${total}\n\n` +
    `Thank you for shopping sustainably! 💚`
  );
}

/* ─── Buy Now ────────────────────────────────── */
function buyNow(name) {
  alert(`🛍️ Proceeding to checkout for:\n\n"${name}"\n\nThank you for choosing EcoSoul! 🌿`);
}

/* ─── Render Cart UI ─────────────────────────── */
function updateCartUI() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartSummary  = document.getElementById('cartSummary');
  const cartCountEl  = document.getElementById('cartCount');
  const cartTotalEl  = document.getElementById('cartTotal');

  /* Total item count (for badge) */
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = totalQty;

  /* Grand total */
  const grandTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotalEl.textContent = `₹${grandTotal}`;

  if (cart.length === 0) {
    cartEmptyEl.style.display = 'block';
    cartSummary.style.display = 'none';
    cartItemsEl.innerHTML = '';
    cartItemsEl.appendChild(cartEmptyEl);
    return;
  }

  /* Build item cards */
  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item" id="cart-item-${item.id}">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} each</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Decrease">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)" aria-label="Increase">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove">✕</button>
      </div>
    `;
  });

  cartItemsEl.innerHTML = html;
  cartEmptyEl.style.display = 'none';
  cartSummary.style.display = 'block';
}

/* ─── Cart Sidebar Toggle ────────────────────── */
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  const isOpen  = sidebar.classList.contains('open');

  if (isOpen) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* ─── Cart Count Bump Animation ─────────────── */
function bumpCartCount() {
  const el = document.getElementById('cartCount');
  el.classList.remove('bump');
  void el.offsetWidth;              // force reflow
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 300);
}

/* ─── Product Filtering ──────────────────────── */
function filterProducts(event, category) {
  /* Update active tab */
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.currentTarget.classList.add('active');

  /* Show/hide cards */
  document.querySelectorAll('.product-card').forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('hidden');
      card.style.animation = 'fadeIn 0.35s ease both';
    } else {
      card.classList.add('hidden');
    }
  });
}

/* ─── Smooth Scroll ──────────────────────────── */
function smoothScroll(event, targetId) {
  event.preventDefault();
  const target = document.getElementById(targetId);
  if (!target) return;

  /* Close mobile nav if open */
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');

  const navHeight = document.getElementById('navbar').offsetHeight;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

  window.scrollTo({ top, behavior: 'smooth' });
}

/* ─── Contact Form ───────────────────────────── */
function submitForm(event) {
  event.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('⚠️ Please fill in all fields.');
    return;
  }

  alert(
    `✅ Message Sent!\n\nThank you, ${name}! 🌿\nWe've received your message at ${email} and will reply within 24 hours.\n\nWith love,\nTeam EcoSoul 💚`
  );

  document.getElementById('contactForm').reset();
}

/* ─── Toast Notification ─────────────────────── */
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ─── Navbar Scroll Effect ───────────────────── */
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ─── Hamburger Toggle ───────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  /* Close when clicking a link */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ─── Scroll-Triggered Card Animations ───────── */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.product-card, .about-card, .contact-form, .trust-item').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  });
}

/* ─── Init ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initScrollAnimations();
  updateCartUI();               /* Set initial cart state */

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();         /* Run once on load */

  /* Keyboard: close cart with Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('cartSidebar');
      if (sidebar.classList.contains('open')) toggleCart();
    }
  });

  console.log('%c🌿 EcoSoul Website Loaded', 'color:#4a7c59;font-size:14px;font-weight:bold;');
});
