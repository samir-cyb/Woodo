/* ============================================
   WOODO - Nordic Wood Atelier
   Main JavaScript Application
   ============================================ */

// ============================================
// DEBUG LOGGER
// ============================================
function debugLog(area, message, data) {
  const t = new Date().toLocaleTimeString();
  console.log(`[${t}] [WOODO:${area}]`, message, data !== undefined ? data : '');
}

// ============================================
// DEMO PRODUCTS (shown when DB is empty)
// ============================================
const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    name: 'Premium Oak Wall Shelf',
    category: 'shelves',
    price: 3200,
    old_price: 4500,
    stock: 15,
    description: 'Handcrafted solid oak wall shelf with natural finish. Perfect for displaying your art collection and small plants.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
    rating: 4.9,
    badge: 'Best Seller',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    name: 'Professional Stretched Canvas (Set of 3)',
    category: 'canvas',
    price: 1800,
    old_price: 2400,
    stock: 25,
    description: 'Triple-primed 100% cotton canvas on sturdy wooden frame. Ideal for oil and acrylic painting.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
    rating: 4.8,
    badge: 'Popular',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-3',
    name: 'Bamboo Studio Easel',
    category: 'easel',
    price: 4500,
    old_price: 5800,
    stock: 8,
    description: 'Adjustable bamboo easel with storage tray. Lightweight yet sturdy for studio and outdoor use.',
    image: 'https://images.unsplash.com/photo-1596548438137-d51ea5c0ba1f?w=400&h=400&fit=crop',
    rating: 4.7,
    badge: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-4',
    name: 'Artist Brush Collection (12 pcs)',
    category: 'tools',
    price: 1200,
    old_price: 1600,
    stock: 30,
    description: 'Premium nylon and hog bristle brushes in various shapes and sizes for all painting techniques.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    rating: 4.6,
    badge: 'Sale',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-5',
    name: 'Walnut Floating Shelf',
    category: 'shelves',
    price: 2800,
    old_price: null,
    stock: 12,
    description: 'Minimalist floating shelf made from dark walnut. Adds warmth and elegance to any creative space.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    rating: 4.9,
    badge: 'New',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-6',
    name: 'Acrylic Paint Set (24 Colors)',
    category: 'tools',
    price: 3500,
    old_price: 4200,
    stock: 20,
    description: 'Vibrant, high-pigment acrylic paints in 24 essential colors. Smooth consistency and excellent coverage.',
    image: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=400&h=400&fit=crop',
    rating: 4.8,
    badge: 'Best Seller',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-7',
    name: 'Large Linen Canvas 30x40"',
    category: 'canvas',
    price: 2200,
    old_price: null,
    stock: 10,
    description: 'Premium Belgian linen canvas for professional artists. Superior texture and durability.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop',
    rating: 4.9,
    badge: 'Premium',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-8',
    name: 'Tabletop Display Easel',
    category: 'easel',
    price: 1500,
    old_price: 1900,
    stock: 18,
    description: 'Compact beech wood easel perfect for table-top painting and displaying finished artwork.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
    rating: 4.5,
    badge: null,
    created_at: new Date().toISOString()
  }
];

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = 'https://gusaitopbrzmsonzjsdp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1c2FpdG9wYnJ6bXNvbnpqc2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzQ4MTEsImV4cCI6MjA5Mjk1MDgxMX0.4JiapIH-FY9OPDKei6_ZQsJR18pY9Y37X5mJGsDTshQ';

// Initialize Supabase Client
let supabaseClient;
try {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  debugLog('SUPABASE', 'Client initialized');
} catch (e) {
  console.error('Supabase init failed:', e);
  debugLog('SUPABASE', 'Client init failed', e.message);
}

// ============================================
// HARDCODED ADMIN CREDENTIALS
// ============================================
const HARDCODED_ADMIN = {
  username: 'hamza',
  password: 'hamza7232',
  name: 'Hamza',
  email: 'admin@woodo.com'
};

// ============================================
// GLOBAL STATE
// ============================================
let currentUser = null;
let currentProfile = null;
let isAdmin = false;
let adminSession = null;
let cart = JSON.parse(localStorage.getItem('woodo_cart')) || [];
let currentProducts = [];
let currentOrders = [];

// ============================================
// UTILITY FUNCTIONS
// ============================================
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function formatPrice(price) {
  return '\u09F3' + parseFloat(price).toLocaleString('en-BD');
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' });
}

function showToast(message, type = 'success') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size:1.2rem;">${type === 'success' ? '\u2713' : type === 'error' ? '\u2715' : '\u26A0'}</span>
    <span style="font-weight:500;">${message}</span>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function showLoading(element, text = 'Loading...') {
  element.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:40px;"><div class="spinner"></div><span style="color:var(--text-secondary);">${text}</span></div>`;
}

// ============================================
// AUTH FUNCTIONS
// ============================================
async function initAuth() {
  debugLog('AUTH', 'initAuth started');
  const storedAdmin = localStorage.getItem('woodo_admin_session');
  if (storedAdmin) {
    try {
      adminSession = JSON.parse(storedAdmin);
      isAdmin = true;
      currentUser = { email: adminSession.email, id: 'admin-' + adminSession.username };
      debugLog('AUTH', 'Admin session restored', { user: currentUser.id });
      updateNavForAuth();
      return;
    } catch (e) { localStorage.removeItem('woodo_admin_session'); }
  }

  if (!supabaseClient) {
    debugLog('AUTH', 'No supabaseClient');
    updateNavForAuth();
    return;
  }

  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    debugLog('AUTH', 'Supabase session check', { hasSession: !!session });
    if (session) {
      currentUser = session.user;
      await loadUserProfile();
    }
  } catch (e) {
    console.error('Auth init error:', e);
    debugLog('AUTH', 'Auth init error', e.message);
  }

  updateNavForAuth();
}

async function loadUserProfile() {
  if (!currentUser || !supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();
    if (data) {
      currentProfile = data;
      if (data.role === 'admin') isAdmin = true;
      debugLog('AUTH', 'Profile loaded', { username: data.username, role: data.role });
    }
    if (error) debugLog('AUTH', 'Profile load error', error.message);
  } catch (e) {
    console.error('Profile load error:', e);
    debugLog('AUTH', 'Profile load exception', e.message);
  }
}

async function signUp(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>';
  btn.disabled = true;

  const username = form.username.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const address = form.address.value.trim();
  const phone = form.phone.value.trim();
  const whatsapp = form.whatsapp.value.trim();

  debugLog('AUTH', 'Signup attempt', { username, email });

  // VALIDATION
  const errors = [];
  if (!username || username.length < 2) errors.push('Full name must be at least 2 characters');
  if (!email || !email.includes('@') || !email.includes('.')) errors.push('Please enter a valid email address');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  if (!address || address.length < 5) errors.push('Please enter a complete delivery address (min 5 characters)');
  
  const phoneRegex = /^01[3-9][0-9]{8}$/;
  if (!phoneRegex.test(phone)) errors.push('Phone number must be a valid Bangladesh number (01XXXXXXXXX)');
  if (!phoneRegex.test(whatsapp)) errors.push('WhatsApp number must be a valid Bangladesh number (01XXXXXXXXX)');

  if (errors.length > 0) {
    showToast(errors[0], 'error');
    btn.innerHTML = originalText;
    btn.disabled = false;
    return;
  }

  try {
    // STEP 1: Create auth user
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { 
        data: { username },
        emailRedirectTo: window.location.origin + '/login.html'
      }
    });

    // Handle already registered
    if (authError && (authError.message.includes('already registered') || authError.message.includes('already exists'))) {
      throw new Error('This email is already registered. Please sign in or use a different email.');
    }

    if (authError) {
      if (authError.message.includes('password')) {
        throw new Error('Password is too weak. Please use at least 6 characters with mixed case.');
      }
      throw new Error(authError.message);
    }

    if (!authData.user || !authData.user.id) {
      throw new Error('Account creation failed. Please try again.');
    }

    const userId = authData.user.id;
    debugLog('AUTH', 'Auth user created', { userId });

    // STEP 2: Check if profile was auto-created by trigger
    const { data: existingProfile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (existingProfile) {
      debugLog('AUTH', 'Profile auto-created by trigger, updating');
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          username, email, address, phone, whatsapp
        })
        .eq('id', userId);

      if (updateError) throw new Error('Failed to update profile: ' + updateError.message);
      showToast('Account created! Profile updated.');
    } else {
      // STEP 3: Insert profile manually
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert([{
          id: userId,
          username: username,
          email: email,
          address: address,
          phone: phone,
          whatsapp: whatsapp,
          role: 'user',
          created_at: new Date().toISOString()
        }]);

      if (profileError) {
        debugLog('AUTH', 'Profile insert failed', profileError);
        throw new Error('Account created but profile setup failed: ' + profileError.message);
      }
      showToast('Account created! Please check your email to verify.');
    }

    setTimeout(() => window.location.href = 'login.html', 2000);

  } catch (err) {
    debugLog('AUTH', 'Signup error caught', { message: err.message });
    showToast(err.message || 'Signup failed. Please try again.', 'error');
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function login(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>';
  btn.disabled = true;

  const email = form.email.value.trim();
  const password = form.password.value;

  if (email === HARDCODED_ADMIN.username && password === HARDCODED_ADMIN.password) {
    adminSession = { ...HARDCODED_ADMIN, isAdmin: true };
    localStorage.setItem('woodo_admin_session', JSON.stringify(adminSession));
    isAdmin = true;
    currentUser = { email: HARDCODED_ADMIN.email, id: 'admin-hamza' };
    showToast('Welcome back, Admin!');
    setTimeout(() => window.location.href = 'admin.html', 800);
    return;
  }

  try {
    const { data: adminData, error: adminErr } = await supabaseClient
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (adminData) {
      adminSession = { ...adminData, isAdmin: true };
      localStorage.setItem('woodo_admin_session', JSON.stringify(adminSession));
      isAdmin = true;
      currentUser = { email: adminData.email, id: 'admin-' + adminData.id };
      showToast('Welcome back, Admin!');
      setTimeout(() => window.location.href = 'admin.html', 800);
      return;
    }
  } catch (e) {}

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    currentUser = data.user;
    await loadUserProfile();
    showToast('Welcome back!');
    setTimeout(() => window.location.href = 'dashboard.html', 800);
  } catch (err) {
    showToast(err.message || 'Invalid credentials', 'error');
    btn.innerHTML = originalText; btn.disabled = false;
  }
}

function logout() {
  if (adminSession) {
    localStorage.removeItem('woodo_admin_session');
    adminSession = null;
    isAdmin = false;
    currentUser = null;
    currentProfile = null;
    window.location.href = 'index.html';
    return;
  }
  if (supabaseClient) {
    supabaseClient.auth.signOut().then(() => {
      currentUser = null;
      currentProfile = null;
      isAdmin = false;
      window.location.href = 'index.html';
    });
  } else {
    currentUser = null;
    currentProfile = null;
    isAdmin = false;
    window.location.href = 'index.html';
  }
}

function updateNavForAuth() {
  const authLinks = $('.nav-auth-links');
  const userDisplay = $('.nav-user');
  const userNameEl = $('.nav-user-name');
  const userAvatarEl = $('.nav-user-avatar');

  if (!authLinks) return;

  if (currentUser) {
    const name = adminSession?.name || currentProfile?.username || currentUser.email?.split('@')[0] || 'User';
    const initial = name.charAt(0).toUpperCase();

    if (userNameEl) userNameEl.textContent = name;
    if (userAvatarEl) userAvatarEl.textContent = initial;
    if (userDisplay) userDisplay.style.display = 'flex';

    authLinks.innerHTML = `
      <a href="${isAdmin ? 'admin.html' : 'dashboard.html'}" class="nav-icon" title="${isAdmin ? 'Admin Panel' : 'My Dashboard'}">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </a>
      <button onclick="logout()" class="nav-icon" title="Logout">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      </button>
    `;
  } else {
    if (userDisplay) userDisplay.style.display = 'none';
    authLinks.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm">Sign In</a>
      <a href="signup.html" class="btn btn-primary btn-sm">Get Started</a>
    `;
  }

  updateCartCount();
}

function updateCartCount() {
  const countEl = $('.cart-count');
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = total;
    countEl.style.display = total > 0 ? 'flex' : 'none';
  }
}

// ============================================
// PRODUCT FUNCTIONS
// ============================================
function filterProducts(products, filters) {
  let result = [...products];
  if (filters.category && filters.category !== 'all') {
    result = result.filter(p => p.category === filters.category);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q));
  }
  return result;
}

async function loadProducts(filters = {}) {
  if (!supabaseClient) {
    currentProducts = DEMO_PRODUCTS;
    return filterProducts(DEMO_PRODUCTS, filters);
  }

  let query = supabaseClient.from('products').select('*').order('created_at', { ascending: false });

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  try {
    const { data, error } = await query;
    if (error) { 
      console.error(error); 
      currentProducts = DEMO_PRODUCTS;
      return filterProducts(DEMO_PRODUCTS, filters);
    }

    if (!data || data.length === 0) {
      currentProducts = DEMO_PRODUCTS;
      return filterProducts(DEMO_PRODUCTS, filters);
    }

    currentProducts = data;
    return data;
  } catch (e) {
    console.error('Load products error:', e);
    currentProducts = DEMO_PRODUCTS;
    return filterProducts(DEMO_PRODUCTS, filters);
  }
}

async function addProduct(productData) {
  if (!supabaseClient) return false;
  const { error } = await supabaseClient.from('products').insert([{
    ...productData,
    id: generateId(),
    created_at: new Date().toISOString()
  }]);
  if (error) { showToast(error.message, 'error'); return false; }
  showToast('Product added successfully');
  return true;
}

async function updateProduct(id, updates) {
  if (!supabaseClient) return false;
  const { error } = await supabaseClient.from('products').update(updates).eq('id', id);
  if (error) { showToast(error.message, 'error'); return false; }
  showToast('Product updated successfully');
  return true;
}

async function deleteProduct(id) {
  if (!supabaseClient) return false;
  if (!confirm('Are you sure you want to delete this product?')) return false;
  const { error } = await supabaseClient.from('products').delete().eq('id', id);
  if (error) { showToast(error.message, 'error'); return false; }
  showToast('Product deleted successfully');
  return true;
}

function renderProducts(products, container, isAdmin = false) {
  debugLog('PRODUCTS', 'renderProducts called', { count: products?.length, containerExists: !!container });
  if (!container) return;
  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state-icon">📦</div>
        <h3>No products found</h3>
        <p>Check back later for new arrivals</p>
      </div>`;
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card fade-up" data-id="${p.id}">
      <div class="product-image-wrap">
        <img src="${p.image || 'https://placehold.co/400x400/f5f0e8/5c4033?text=Woodo'}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="product-action-btn" onclick="addToCart('${p.id}')" title="Add to Cart">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>
          <a href="product.html?id=${p.id}" class="product-action-btn" title="View Details">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </a>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category || 'General'}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price-row">
          <div class="product-price">${formatPrice(p.price)} ${p.old_price ? `<span>${formatPrice(p.old_price)}</span>` : ''}</div>
          <div class="product-rating">★ ${p.rating || '4.8'}</div>
        </div>
      </div>
    </div>
  `).join('');

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray(container.querySelectorAll('.fade-up')).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
        }
      );
    });
  }
}

// ============================================
// CART FUNCTIONS
// ============================================
function addToCart(productId, qty = 1) {
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }

  localStorage.setItem('woodo_cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('woodo_cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateCartQty(productId, qty) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, qty);
    localStorage.setItem('woodo_cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }
}

function renderCart() {
  const container = $('.cart-items');
  const summary = $('.cart-summary-body');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Discover our handcrafted wooden art pieces</p>
        <a href="shop.html" class="btn btn-primary" style="margin-top:16px;">Browse Shop</a>
      </div>`;
    if (summary) summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image || 'https://placehold.co/200x200/f5f0e8/5c4033?text=Woodo'}" alt="${item.name}">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>${item.category || 'Artisan Product'}</p>
        <div class="product-price">${formatPrice(item.price)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-selector">
          <button onclick="updateCartQty('${item.id}', ${item.quantity - 1})">−</button>
          <input type="text" value="${item.quantity}" readonly>
          <button onclick="updateCartQty('${item.id}', ${item.quantity + 1})">+</button>
        </div>
        <button class="table-btn table-btn-delete" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + shipping;

  if (summary) {
    summary.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
      <button class="btn btn-primary btn-full" style="margin-top:24px;" onclick="checkoutCart()">Proceed to Checkout</button>
    `;
  }
}

async function checkoutCart() {
  debugLog('CHECKOUT', 'checkoutCart called', { userId: currentUser?.id, cartItems: cart.length });
  if (!currentUser) {
    showToast('Please login first', 'warning');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let itemsText = cart.map(item => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('%0A');

  const message = `🛒 *New Order - Woodo*%0A%0A*Items:*%0A${itemsText}%0A%0A*Subtotal:* ${formatPrice(subtotal)}%0A*Customer:* ${currentProfile?.username || currentUser.email}%0A*Phone:* ${currentProfile?.phone || 'N/A'}%0A*Address:* ${currentProfile?.address || 'N/A'}%0A%0APlease confirm this order.`;

  const saved = await saveOrder({
    items: cart,
    total: subtotal,
    status: 'pending'
  });

  if (!saved) {
    showToast('Failed to save order. Please try again.', 'error');
    return;
  }

  window.open(`https://wa.me/8801857549191?text=${message}`, '_blank');

  cart = [];
  localStorage.removeItem('woodo_cart');
  updateCartCount();
  showToast('Order placed! Check WhatsApp.');
  renderCart();
}

// ============================================
// ORDER FUNCTIONS
// ============================================
async function saveOrder(orderData) {
  debugLog('ORDERS', 'saveOrder called', { userId: currentUser?.id, itemCount: orderData?.items?.length });
  if (!supabaseClient || !currentUser) {
    debugLog('ORDERS', 'saveOrder aborted - no client or user');
    return false;
  }

  const orderId = generateId();
  try {
    const orderRecord = {
      id: orderId,
      user_id: currentUser.id,
      status: orderData.status || 'pending',
      total_amount: orderData.total,
      customer_name: currentProfile?.username || currentUser.email,
      customer_phone: currentProfile?.phone || '',
      customer_address: currentProfile?.address || '',
      created_at: new Date().toISOString()
    };

    debugLog('ORDERS', 'Inserting order record', orderRecord);

    const { error } = await supabaseClient.from('orders').insert([orderRecord]);
    if (error) {
      debugLog('ORDERS', 'Error inserting order', error);
      console.error('Order save error:', error);
      return false;
    }

    const orderItems = orderData.items.map(item => ({
      id: generateId(),
      order_id: orderId,
      product_id: isValidUUID(item.id) ? item.id : null,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      created_at: new Date().toISOString()
    }));

    debugLog('ORDERS', `Inserting ${orderItems.length} order items`);
    const { error: itemsError } = await supabaseClient.from('order_items').insert(orderItems);

    if (itemsError) {
      debugLog('ORDERS', 'Error inserting order items', itemsError);
      console.error('Order items save error:', itemsError);
      return false;
    }

    debugLog('ORDERS', 'Order saved successfully', { orderId });
    return true;
  } catch (e) {
    debugLog('ORDERS', 'Exception in saveOrder', e.message);
    console.error('Save order error:', e);
    return false;
  }
}

function isValidUUID(str) {
  if (!str || typeof str !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

async function getUserOrders() {
  debugLog('ORDERS', 'getUserOrders called', { userId: currentUser?.id, hasClient: !!supabaseClient });
  if (!supabaseClient || !currentUser) {
    debugLog('ORDERS', 'Missing supabaseClient or currentUser');
    return [];
  }
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      debugLog('ORDERS', 'Supabase error fetching user orders', error);
      console.error(error);
      return [];
    }

    debugLog('ORDERS', `Successfully fetched ${data?.length || 0} orders`, data?.map(o => ({ id: o.id.slice(0,8), status: o.status, total: o.total_amount })));
    return data || [];
  } catch (e) {
    debugLog('ORDERS', 'Exception in getUserOrders', e.message);
    return [];
  }
}

async function getAllOrders() {
  debugLog('ORDERS', 'getAllOrders called', { hasClient: !!supabaseClient });
  if (!supabaseClient) return [];
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (error) {
      debugLog('ORDERS', 'Supabase error fetching all orders', error);
      console.error(error);
      return [];
    }
    debugLog('ORDERS', `Fetched ${data?.length || 0} total orders`);
    return data || [];
  } catch (e) {
    debugLog('ORDERS', 'Exception in getAllOrders', e.message);
    return [];
  }
}

async function updateOrderStatus(orderId, status) {
  if (!supabaseClient) return false;
  const { error } = await supabaseClient.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
  if (error) { showToast(error.message, 'error'); return false; }
  showToast('Order status updated');
  return true;
}

function getProgressPercent(status) {
  const stages = { 'pending': 15, 'processing': 45, 'shipped': 75, 'delivered': 100, 'cancelled': 0 };
  return stages[status] || 15;
}

function renderOrders(orders, container) {
  debugLog('RENDER', 'renderOrders called', { count: orders?.length, hasContainer: !!container });
  if (!container) return;
  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h3>No orders yet</h3>
        <p>Your order history will appear here</p>
        <a href="shop.html" class="btn btn-primary" style="margin-top:16px;">Start Shopping</a>
      </div>`;
    return;
  }

  container.innerHTML = orders.map(order => {
    const progress = getProgressPercent(order.status);
    const items = order.order_items || [];
    const statusClass = `status-${order.status}`;
    const statusLabels = ['pending', 'processing', 'shipped', 'delivered'];

    return `
      <div class="order-card fade-up">
        <div class="order-header">
          <div>
            <div class="order-id">Order #${order.id.slice(0, 8).toUpperCase()}</div>
            <div class="order-date">${formatDate(order.created_at)}</div>
          </div>
          <span class="order-status-badge ${statusClass}">${order.status}</span>
        </div>
        <div class="order-items-preview">
          ${items.slice(0, 3).map(item => `
            <div class="order-item-preview">
              <span>${item.product_name} x${item.quantity}</span>
            </div>
          `).join('')}
          ${items.length > 3 ? `<div class="order-item-preview"><span>+${items.length - 3} more</span></div>` : ''}
        </div>
        <div class="order-progress">
          <div class="progress-labels">
            ${statusLabels.map((s, i) => `
              <div class="progress-label ${statusLabels.indexOf(order.status) >= i ? 'active' : ''}">${s}</div>
            `).join('')}
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>
        <div class="order-total">Total: ${formatPrice(order.total_amount)}</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.fade-up').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}

function renderAdminOrders(orders, container, panelName = 'dashboard') {
  if (!container) return;
  if (!orders || orders.length === 0) {
    container.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;">No orders found</td></tr>';
    return;
  }

  container.innerHTML = orders.map(order => {
    const items = order.order_items || [];
    return `
      <tr>
        <td>#${order.id.slice(0, 8).toUpperCase()}</td>
        <td>${order.customer_name || 'N/A'}</td>
        <td>${items.map(i => i.product_name).join(', ')}</td>
        <td>${formatPrice(order.total_amount)}</td>
        <td>
          <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value).then(() => loadAdminOrders('${panelName}'))">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>${formatDate(order.created_at)}</td>
      </tr>
    `;
  }).join('');
}

// ============================================
// WHATSAPP ORDER (Buy Now)
// ============================================
async function buyNow(productId) {
  debugLog('CHECKOUT', 'buyNow called', { productId, userId: currentUser?.id });
  if (!currentUser) {
    showToast('Please login to place an order', 'warning');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }

  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  const qtyInput = $('.qty-input');
  const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
  const total = product.price * qty;

  const message = `🛒 *New Order - Woodo*%0A%0A` +
    `*Product:* ${product.name}%0A` +
    `*Price:* ${formatPrice(product.price)}%0A` +
    `*Quantity:* ${qty}%0A` +
    `*Total:* ${formatPrice(total)}%0A%0A` +
    `*Customer:* ${currentProfile?.username || currentUser.email}%0A` +
    `*Phone:* ${currentProfile?.phone || 'N/A'}%0A` +
    `*Address:* ${currentProfile?.address || 'N/A'}%0A` +
    `*WhatsApp:* ${currentProfile?.whatsapp || 'N/A'}%0A%0A` +
    `Please confirm this order.`;

  const saved = await saveOrder({
    items: [{ ...product, quantity: qty }],
    total: total,
    status: 'pending'
  });

  if (!saved) {
    showToast('Failed to save order. Please try again.', 'error');
    return;
  }

  window.open(`https://wa.me/8801857549191?text=${message}`, '_blank');
  showToast('Order sent! Check WhatsApp.');
}

// ============================================
// ADMIN FUNCTIONS
// ============================================
async function addAdmin(name, email, password) {
  if (!supabaseClient) return false;
  const { error } = await supabaseClient.from('admins').insert([{
    id: generateId(),
    name,
    email,
    password,
    created_at: new Date().toISOString()
  }]);
  if (error) { showToast(error.message, 'error'); return false; }
  showToast('Admin added successfully');
  return true;
}

async function loadAdminStats() {
  debugLog('ADMIN', 'loadAdminStats called', { hasClient: !!supabaseClient });
  if (!supabaseClient) return;

  try {
    const [{ count: productCount, error: pErr }, { count: orderCount, error: oErr }, { count: userCount, error: uErr }, { data: recentOrders, error: rErr }] = await Promise.all([
      supabaseClient.from('products').select('*', { count: 'exact', head: true }),
      supabaseClient.from('orders').select('*', { count: 'exact', head: true }),
      supabaseClient.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseClient.from('orders').select('total_amount')
    ]);

    if (pErr) debugLog('ADMIN', 'Product count error', pErr);
    if (oErr) debugLog('ADMIN', 'Order count error', oErr);
    if (uErr) debugLog('ADMIN', 'User count error', uErr);
    if (rErr) debugLog('ADMIN', 'Revenue fetch error', rErr);

    const revenue = recentOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
    debugLog('ADMIN', 'Stats calculated', { productCount, orderCount, userCount, revenue });

    const statsEls = {
      products: $('.stat-products'),
      orders: $('.stat-orders'),
      users: $('.stat-users'),
      revenue: $('.stat-revenue')
    };

    if (statsEls.products) statsEls.products.textContent = productCount ?? 0;
    if (statsEls.orders) statsEls.orders.textContent = orderCount ?? 0;
    if (statsEls.users) statsEls.users.textContent = userCount ?? 0;
    if (statsEls.revenue) statsEls.revenue.textContent = formatPrice(revenue);
  } catch (e) {
    debugLog('ADMIN', 'Exception in loadAdminStats', e.message);
    console.error('Admin stats error:', e);
  }
}

async function loadAdminProducts() {
  debugLog('ADMIN', 'loadAdminProducts called');
  
  const table = $('.admin-products-table');
  debugLog('ADMIN', 'admin-products-table found', !!table);
  
  const tbody = $('.admin-products-table tbody');
  debugLog('ADMIN', 'admin-products-table tbody found', !!tbody);
  
  if (!tbody) {
    debugLog('ADMIN', 'ABORT: tbody is null. Products table not in DOM. Tab not active?');
    return;
  }
  
  const wrapper = tbody.closest('.admin-table-wrap');
  if (wrapper) {
    showLoading(wrapper, 'Loading products...');
  }

  const products = await loadProducts();
  debugLog('ADMIN', `Loaded ${products.length} products for admin table`);

  const newTableHTML = `
    <table class="data-table admin-products-table">
      <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td><img src="${p.image || 'https://placehold.co/100x100/f5f0e8/5c4033?text=W'}" alt="${p.name}"></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.category || '-'}</td>
            <td>${formatPrice(p.price)}</td>
            <td>${p.stock || '-'}</td>
            <td>
              <div class="table-actions">
                <button class="table-btn table-btn-edit" onclick="editProduct('${p.id}')">Edit</button>
                <button class="table-btn table-btn-delete" onclick="deleteProduct('${p.id}').then(() => loadAdminProducts())">Delete</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  if (wrapper) {
    wrapper.innerHTML = `
      <div class="admin-table-header">
        <h3>All Products</h3>
        <button class="btn btn-primary btn-sm modal-open-btn">+ Add Product</button>
      </div>
      ${newTableHTML}
    `;
    
    const modalOpenBtn = wrapper.querySelector('.modal-open-btn');
    const modalOverlay = $('.modal-overlay');
    modalOpenBtn?.addEventListener('click', () => {
      const form = $('#productForm');
      if (form) form.dataset.editId = '';
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  } else {
    const parent = table.parentElement;
    if (parent) {
      parent.innerHTML = newTableHTML;
    }
  }
  
  debugLog('ADMIN', 'loadAdminProducts completed');
}

async function loadAdminOrders(panelName = 'dashboard') {
  debugLog('ADMIN', 'loadAdminOrders called', { panelName });
  
  const panelEl = document.querySelector(`.admin-tab-panel[data-panel="${panelName}"]`);
  const table = panelEl?.querySelector('.admin-orders-table');
  const tbody = panelEl?.querySelector('.admin-orders-table tbody');
  
  debugLog('ADMIN', `admin-orders-table found in ${panelName}`, !!table);
  debugLog('ADMIN', `admin-orders-table tbody found in ${panelName}`, !!tbody);
  
  if (!tbody) {
    debugLog('ADMIN', `ABORT: orders tbody is null in ${panelName}`);
    return;
  }
  
  const orders = await getAllOrders();
  renderAdminOrders(orders, tbody, panelName);
  debugLog('ADMIN', 'loadAdminOrders completed');
}

async function loadAdminAdmins() {
  debugLog('ADMIN', 'loadAdminAdmins called');
  
  const table = $('.admin-admins-table');
  debugLog('ADMIN', 'admin-admins-table found', !!table);
  
  const tbody = $('.admin-admins-table tbody');
  debugLog('ADMIN', 'admin-admins-table tbody found', !!tbody);
  
  if (!tbody || !supabaseClient) {
    debugLog('ADMIN', 'ABORT: admins tbody is null or no supabase client');
    return;
  }
  
  try {
    const { data } = await supabaseClient.from('admins').select('*').order('created_at', { ascending: false });

    const allAdmins = [
      { id: 'hardcoded', name: HARDCODED_ADMIN.name, email: HARDCODED_ADMIN.email, created_at: 'System' },
      ...(data || [])
    ];

    tbody.innerHTML = allAdmins.map(a => `
      <tr>
        <td>${a.name}</td>
        <td>${a.email}</td>
        <td>${a.created_at === 'System' ? '<span style="color:var(--gold);font-weight:600;">Super Admin</span>' : formatDate(a.created_at)}</td>
        <td>${a.id === 'hardcoded' ? '-' : `<button class="table-btn table-btn-delete" onclick="removeAdmin('${a.id}')">Remove</button>`}</td>
      </tr>
    `).join('');
    
    debugLog('ADMIN', 'loadAdminAdmins completed');
  } catch (e) {
    debugLog('ADMIN', 'Exception in loadAdminAdmins', e.message);
    console.error('Load admins error:', e);
  }
}

async function removeAdmin(id) {
  if (!supabaseClient) return;
  if (!confirm('Remove this admin?')) return;
  const { error } = await supabaseClient.from('admins').delete().eq('id', id);
  if (error) { showToast(error.message, 'error'); return; }
  showToast('Admin removed');
  loadAdminAdmins();
}

function editProduct(id) {
  const product = currentProducts.find(p => p.id === id);
  if (!product) return;

  const modal = $('.modal-overlay');
  const form = $('#productForm');
  if (!modal || !form) return;

  form.dataset.editId = id;
  form.productName.value = product.name;
  form.productCategory.value = product.category || '';
  form.productPrice.value = product.price;
  form.productOldPrice.value = product.old_price || '';
  form.productStock.value = product.stock || '';
  form.productDescription.value = product.description || '';

  // Pre-fill image: switch to URL tab and show preview
  const urlInput = $('#productImageUrl');
  if (urlInput) urlInput.value = product.image || '';

  // Switch to URL tab since existing products have a URL
  const urlTab = document.querySelector('.img-tab[data-tab="url"]');
  if (urlTab) switchImgTab(urlTab, 'url');

  // Show image preview if there's an existing image
  if (product.image) {
    const preview = $('#imgPreview');
    const previewWrap = $('#imgPreviewWrap');
    if (preview) preview.src = product.image;
    if (previewWrap) previewWrap.style.display = 'block';
  }

  modal.classList.add('active');
}

// ============================================
// IMAGE PICKER HELPERS
// ============================================

/** Switch between "file" and "url" tabs in the product modal */
function switchImgTab(clickedBtn, tab) {
  // Update tab button states
  document.querySelectorAll('.img-tab').forEach(b => b.classList.remove('active'));
  clickedBtn.classList.add('active');

  // Show/hide panels
  const filePanel = $('#imgPanelFile');
  const urlPanel  = $('#imgPanelUrl');
  if (filePanel) filePanel.style.display = tab === 'file' ? 'block' : 'none';
  if (urlPanel)  urlPanel.style.display  = tab === 'url'  ? 'block' : 'none';

  // When switching to URL tab and a URL is already typed, show preview
  if (tab === 'url') {
    const urlVal = ($('#productImageUrl') || {}).value || '';
    if (urlVal) showImgPreview(urlVal);
  }
}

/** Show image preview */
function showImgPreview(src) {
  const preview = $('#imgPreview');
  const wrap    = $('#imgPreviewWrap');
  if (!preview || !wrap) return;
  preview.src = src;
  wrap.style.display = 'block';
}

/** Clear the image preview and reset file input */
function clearImgPreview() {
  const preview  = $('#imgPreview');
  const wrap     = $('#imgPreviewWrap');
  const fileInput= $('#productImageFile');
  const urlInput = $('#productImageUrl');
  if (preview)   preview.src = '';
  if (wrap)      wrap.style.display = 'none';
  if (fileInput) fileInput.value = '';
  if (urlInput)  urlInput.value = '';
}

/** Reset entire image picker to default state */
function resetImagePicker() {
  clearImgPreview();
  // Switch back to file tab
  const fileTab = document.querySelector('.img-tab[data-tab="file"]');
  if (fileTab) switchImgTab(fileTab, 'file');
}

/** Wire up all image picker events (file change + drag-drop + URL live preview) */
function setupImagePicker() {
  const fileInput  = $('#productImageFile');
  const dropZone   = $('#imgDropZone');
  const urlInput   = $('#productImageUrl');

  // --- File input change ---
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => showImgPreview(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  // --- Drag & drop on drop zone ---
  if (dropZone) {
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) {
        showToast('Please drop an image file', 'warning');
        return;
      }
      if (fileInput) {
        // Assign file to input
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
      }
      const reader = new FileReader();
      reader.onload = ev => showImgPreview(ev.target.result);
      reader.readAsDataURL(file);
    });
  }

  // --- URL input live preview on blur ---
  if (urlInput) {
    urlInput.addEventListener('blur', () => {
      const val = urlInput.value.trim();
      if (val) showImgPreview(val);
      else clearImgPreview();
    });
  }
}

/** Convert a File to a base64 data-URL string */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file to Supabase Storage bucket 'product-images'.
 * Returns the public URL on success, or null if unavailable.
 */
async function uploadImageToSupabase(file) {
  if (!supabaseClient) return null;
  try {
    const ext      = file.name.split('.').pop();
    const fileName = `${generateId()}.${ext}`;
    const { data, error } = await supabaseClient
      .storage
      .from('product-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      debugLog('IMAGE', 'Supabase storage upload failed', error.message);
      return null;
    }

    const { data: urlData } = supabaseClient
      .storage
      .from('product-images')
      .getPublicUrl(fileName);

    return urlData?.publicUrl || null;
  } catch (e) {
    debugLog('IMAGE', 'Exception during image upload', e.message);
    return null;
  }
}

// Expose image picker helpers for inline onclick handlers
window.switchImgTab    = switchImgTab;
window.clearImgPreview = clearImgPreview;

// ============================================
// GSAP ANIMATIONS
// ============================================
function initGSAP() {
  debugLog('GSAP', 'initGSAP called', { hasGSAP: typeof gsap !== 'undefined', hasST: typeof ScrollTrigger !== 'undefined' });

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[WOODO] GSAP or ScrollTrigger not available. Forcing .fade-up elements visible.');
    document.querySelectorAll('.fade-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.fade-up').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out'
        }
      );
    });

    if ($('.hero-section')) {
      gsap.to('.hero-bg-pattern', {
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
        y: 150, opacity: 0.3
      });
    }

    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: { trigger: header, start: 'top 85%' },
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
        }
      );
    });
  } catch (e) {
    console.error('[WOODO] GSAP initialization error:', e);
    document.querySelectorAll('.fade-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
}

// ============================================
// CURSOR GLOW
// ============================================
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - 150;
    mouseY = e.clientY - 150;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================
function initNavScroll() {
  const nav = $('.nav-glass');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const btn = $('.mobile-menu-btn');
  const links = $('.nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    links.style.position = 'absolute';
    links.style.top = '80px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.flexDirection = 'column';
    links.style.background = 'rgba(250,248,245,0.98)';
    links.style.padding = '24px';
    links.style.boxShadow = '0 8px 24px var(--shadow-soft)';
    links.style.backdropFilter = 'blur(20px)';
  });
}

// ============================================
// PAGE INITIALIZERS
// ============================================
function initHome() {
  const featuredContainer = $('.featured-products-grid');
  if (featuredContainer) {
    loadProducts({ limit: 4 }).then(products => {
      renderProducts(products.slice(0, 4), featuredContainer);
    });
  }

  const bestSellerContainer = $('.bestseller-products-grid');
  if (bestSellerContainer) {
    loadProducts().then(products => {
      renderProducts(products.slice(0, 4), bestSellerContainer);
    });
  }
}

function initShop() {
  const grid = $('.products-grid');
  const searchInput = $('.search-input');
  const categorySelect = $('.category-select');

  if (grid) {
    showLoading(grid, 'Loading products...');
    loadProducts().then(products => renderProducts(products, grid));
  }

  function applyFilters() {
    const filters = {
      search: searchInput?.value || '',
      category: categorySelect?.value || 'all'
    };
    showLoading(grid, 'Filtering...');
    loadProducts(filters).then(products => renderProducts(products, grid));
  }

  searchInput?.addEventListener('input', debounce(applyFilters, 400));
  categorySelect?.addEventListener('change', applyFilters);
}

function initProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) return;

  loadProducts().then(() => {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;

    const mainImg = $('.product-gallery-main img');
    const title = $('.product-detail-title');
    const price = $('.product-detail-price');
    const desc = $('.product-detail-description p');
    const category = $('.product-detail-category');

    if (mainImg) mainImg.src = product.image || 'https://placehold.co/600x600/f5f0e8/5c4033?text=Woodo';
    if (title) title.textContent = product.name;
    if (price) price.textContent = formatPrice(product.price);
    if (desc) desc.textContent = product.description || 'Handcrafted with premium materials for your creative space.';
    if (category) category.textContent = product.category || 'Artisan Product';

    const buyBtn = $('.btn-buy-now');
    if (buyBtn) buyBtn.onclick = () => buyNow(productId);

    const addBtn = $('.btn-add-cart');
    if (addBtn) addBtn.onclick = () => {
      const qtyEl = $('.qty-input');
      const qty = qtyEl ? parseInt(qtyEl.value) || 1 : 1;
      addToCart(productId, qty);
    };
  });
}

function initCart() {
  renderCart();
}

async function initDashboard() {
  debugLog('DASHBOARD', 'initDashboard started', { currentUser: currentUser?.id });
  if (!currentUser) {
    showToast('Please login first', 'warning');
    setTimeout(() => window.location.href = 'login.html', 1000);
    return;
  }

  const container = $('.orders-list');
  debugLog('DASHBOARD', 'Orders container found', !!container);
  
  if (container) {
    showLoading(container, 'Loading your orders...');
    const orders = await getUserOrders();
    debugLog('DASHBOARD', `Rendering ${orders?.length || 0} orders`);
    renderOrders(orders, container);
  }

  const nameEl = $('.dashboard-name');
  const emailEl = $('.dashboard-email');
  if (nameEl) nameEl.textContent = currentProfile?.username || currentUser.email?.split('@')[0] || 'Creator';
  if (emailEl) emailEl.textContent = currentUser.email;
}

async function initAdmin() {
  debugLog('ADMIN', '========== initAdmin START ==========');
  
  // Mobile sidebar toggle setup
  const sidebar = $('.admin-sidebar');
  const adminPage = $('.admin-page');
  let overlay = $('.admin-sidebar-overlay');
  if (!overlay && adminPage) {
    overlay = document.createElement('div');
    overlay.className = 'admin-sidebar-overlay';
    overlay.onclick = () => toggleAdminSidebar();
    adminPage.appendChild(overlay);
  }
  window.toggleAdminSidebar = function() {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('active');
  };

  const storedAdmin = localStorage.getItem('woodo_admin_session');
  if (!storedAdmin) {
    showToast('Admin access required', 'error');
    window.location.href = 'login.html';
    return;
  }

  const adminNameEl = $('.admin-name');
  if (adminNameEl) {
    try {
      const session = JSON.parse(storedAdmin);
      adminNameEl.textContent = session.name || session.username || 'Admin';
    } catch (e) {}
  }

  const tabBtns = $$('.admin-nav-link');
  const tabPanels = $$('.admin-tab-panel');
  
  debugLog('ADMIN', `Found ${tabBtns.length} tab buttons, ${tabPanels.length} tab panels`);

  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      debugLog('ADMIN', `Tab clicked: ${tab}`);
      
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(p => p.style.display = p.dataset.panel === tab ? 'block' : 'none');

      if (tab === 'products') loadAdminProducts();
      if (tab === 'orders') loadAdminOrders('orders');
      if (tab === 'admins') loadAdminAdmins();
      if (tab === 'dashboard') loadAdminStats();
    });
  });

  debugLog('ADMIN', 'Loading initial dashboard data (stats + orders only)');
  loadAdminStats();
  
  const ordersTbody = document.querySelector('.admin-tab-panel[data-panel="dashboard"] .admin-orders-table tbody');
  debugLog('ADMIN', 'Dashboard orders tbody exists?', !!ordersTbody);
  if (ordersTbody) {
    loadAdminOrders('dashboard');
  }

  const productForm = $('#productForm');
  if (productForm) {
    // Setup image picker interactions
    setupImagePicker();

    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = productForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div> Saving...';
      btn.disabled = true;

      const editId = productForm.dataset.editId;

      // --- Resolve final image URL ---
      let imageUrl = 'https://placehold.co/400x400/f5f0e8/5c4033?text=Woodo';
      const fileInput = $('#productImageFile');
      const urlInput = $('#productImageUrl');
      const activeTab = $('.img-tab.active');
      const isFileTab = activeTab && activeTab.dataset.tab === 'file';

      if (isFileTab && fileInput && fileInput.files && fileInput.files[0]) {
        // Try Supabase Storage first, fallback to base64
        const file = fileInput.files[0];
        if (file.size > 5 * 1024 * 1024) {
          showToast('Image must be under 5MB', 'error');
          btn.innerHTML = originalText;
          btn.disabled = false;
          return;
        }
        const uploadedUrl = await uploadImageToSupabase(file);
        imageUrl = uploadedUrl || await fileToBase64(file);
      } else if (urlInput && urlInput.value.trim()) {
        imageUrl = urlInput.value.trim();
      }

      const productData = {
        name: productForm.productName.value,
        category: productForm.productCategory.value,
        price: parseFloat(productForm.productPrice.value),
        old_price: productForm.productOldPrice.value ? parseFloat(productForm.productOldPrice.value) : null,
        stock: parseInt(productForm.productStock.value) || 0,
        description: productForm.productDescription.value,
        image: imageUrl,
        rating: 4.8
      };

      if (editId) {
        await updateProduct(editId, productData);
        productForm.dataset.editId = '';
      } else {
        await addProduct(productData);
      }

      productForm.reset();
      resetImagePicker();
      btn.innerHTML = originalText;
      btn.disabled = false;
      const modal = $('.modal-overlay');
      if (modal) modal.classList.remove('active');
      loadAdminProducts();
    });
  }

  const adminForm = $('#addAdminForm');
  if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const success = await addAdmin(
        adminForm.adminName.value,
        adminForm.adminEmail.value,
        adminForm.adminPassword.value
      );
      if (success) {
        adminForm.reset();
        loadAdminAdmins();
      }
    });
  }

  const modalOpenBtn = $('.modal-open-btn');
  const modalCloseBtn = $('.modal-close');
  const modalOverlay = $('.modal-overlay');

  modalOpenBtn?.addEventListener('click', () => {
    const form = $('#productForm');
    if (form) {
      form.dataset.editId = '';
      form.reset();
    }
    resetImagePicker();
    if (modalOverlay) modalOverlay.classList.add('active');
  });

  modalCloseBtn?.addEventListener('click', () => {
    if (modalOverlay) modalOverlay.classList.remove('active');
    resetImagePicker();
    const form = $('#productForm');
    if (form) form.reset();
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
      resetImagePicker();
      const form = $('#productForm');
      if (form) form.reset();
    }
  });
  
  debugLog('ADMIN', '========== initAdmin END ==========');
}

// ============================================
// DEBOUNCE HELPER
// ============================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================
// ACTIVE NAVIGATION HIGHLIGHT
// ============================================
function initActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;

  const navMap = {
    'home': 'home',
    'shop': 'shop',
    'product': 'shop',      // product page highlights "Shop"
    'cart': 'shop',         // cart page highlights "Shop"
    'dashboard': 'dashboard',
    'login': '',            // no highlight
    'signup': ''            // no highlight
  };

  const activeKey = navMap[page];
  if (!activeKey) return;

  document.querySelectorAll('.nav-links a[data-nav]').forEach(link => {
    if (link.dataset.nav === activeKey) {
      link.classList.add('active-nav');
    } else {
      link.classList.remove('active-nav');
    }
  });
}

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  await initAuth();
  initActiveNav();
  initGSAP();
  initNavScroll();
  initCursorGlow();
  initMobileMenu();

  const page = document.body.dataset.page;
  switch (page) {
    case 'home': initHome(); break;
    case 'shop': initShop(); break;
    case 'product': initProductDetail(); break;
    case 'cart': initCart(); break;
    case 'dashboard': await initDashboard(); break;
    case 'admin': await initAdmin(); break;
  }

  $('.signup-form')?.addEventListener('submit', signUp);
  $('.login-form')?.addEventListener('submit', login);
});

// Expose functions to window for inline onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQty = updateCartQty;
window.checkoutCart = checkoutCart;
window.buyNow = buyNow;
window.logout = logout;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateOrderStatus = updateOrderStatus;
window.removeAdmin = removeAdmin;
window.loadAdminOrders = loadAdminOrders;
window.loadAdminProducts = loadAdminProducts;
window.loadAdminAdmins = loadAdminAdmins;