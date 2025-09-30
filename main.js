 // ====== PRODUCT DATA (images from web) ======
const PRODUCTS = [
  {
    id: 'cr1',
    title: 'Optimum Nutrition Creatine',
    price: 29.99,
    category: 'creatine',
    img: 'https://tse3.mm.bing.net/th/id/OIP.mEMUnMxuoD_EDe9bjCd2yQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    rating: 4.6,
    desc: 'Micronized Creatine Monohydrate, 300g.'
  },
  {
    id: 'wp1',
    title: 'Gold Standard Whey',
    price: 49.99,
    category: 'protein',
    img: 'https://th.bing.com/th/id/OIP.O1xpRjBtE78GUt3wI-UQLgHaLH?w=133&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    rating: 4.7,
    desc: 'ON Gold Standard Whey Protein, 2lbs.'
  },
  {
    id: 'bc1',
    title: 'Scivation Xtend BCAA',
    price: 34.99,
    category: 'amino',
    img: 'https://th.bing.com/th/id/OIP.2AyKD-2-nAYNRIBQm-ZG8QHaLH?w=129&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    rating: 4.4,
    desc: 'BCAA Recovery Formula, 30 servings.'
  },
  {
    id: 'lc1',
    title: 'NOW L-Carnitine 1000mg',
    price: 24.99,
    category: 'fatburner',
    img: 'https://th.bing.com/th/id/OIP.cI9gIgkX_EAtWucSqRJD-gHaKg?w=139&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    rating: 4.2,
    desc: 'Supports Fat Metabolism, 60 caps.'
  },
  {
    id: 'pre1',
    title: 'C4 Pre-Workout',
    price: 39.99,
    category: 'stimulant',
    img: 'https://th.bing.com/th/id/OIP.izIRyTIrUNtpk8b_W_ZVsAHaHy?w=166&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    rating: 4.3,
    desc: 'Explosive Energy Blend, 30 servings.'
  },
  {
    id: 'mv1',
    title: 'Opti-Men Multivitamin',
    price: 19.99,
    category: 'multivitamin',
    img: 'https://th.bing.com/th/id/OIP.oWO5cPv2tuIfkhjNqtEEDAHaHa?w=199&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    rating: 4.0,
    desc: '90 tablets for men’s health.'
  }
];

// ====== CART LOGIC ======
let cart = JSON.parse(localStorage.getItem('wail_cart')||'[]');

// Update cart count in nav
function updateCartBadges(){
  const count = cart.reduce((s,i)=> s + (i.qty||1), 0);
  document.querySelectorAll('#navCartCount, #navCartCount2').forEach(el=>{ if(el) el.textContent = count; });
}
updateCartBadges();

document.addEventListener('DOMContentLoaded', ()=>{
  // populate year
  document.querySelectorAll('#year,#year2,#year3,#year4,#year5').forEach(el=>{ if(el) el.textContent = new Date().getFullYear();});

  // For shop page: render products grid
  const grid = document.getElementById('productsGrid');
  if(grid){
    renderProducts(PRODUCTS);
    // filter handling
    const filter = document.getElementById('filterSelect');
    filter && filter.addEventListener('change', (e)=>{
      const v = e.target.value;
      const list = v === 'all' ? PRODUCTS : PRODUCTS.filter(p=> p.category === v);
      renderProducts(list);
    });
  }

  // For cart page: render cart
  const cartListEl = document.getElementById('cartTableBody');
  if(cartListEl){
    renderCartTable();
  }

  // Theme toggle
  document.querySelectorAll('#themeToggle,#themeToggle2').forEach(btn=>{
    btn && btn.addEventListener('click', ()=> toggleTheme(btn));
  });

  // product modal add to cart action
  const modalAddBtn = document.getElementById('modalAddBtn');
  if(modalAddBtn) {
    modalAddBtn.addEventListener('click', ()=>{
      const id = modalAddBtn.dataset.productId;
      const qty = parseInt(document.getElementById('modalQty').value || 1,10);
      addToCartById(id, qty);
      bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    });
  }

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const titleEl = card.querySelector('.card-title');
      if (!titleEl) return;
      const title = titleEl.textContent.trim();
      const product = PRODUCTS.find(p => p.title === title);
      if (!product) return;
      addToCartById(product.id, 1);
    });
  });
});

function toggleTheme(button){
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
  const isDark = document.body.classList.contains('dark');
  document.querySelectorAll('#themeToggle,#themeToggle2').forEach(b=>{
    if(b) b.textContent = isDark ? '☀️' : '🌙';
  });
}

// ====== Render functions ======
function renderProducts(list){
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  list.forEach(p=>{
    const col = document.createElement('div'); col.className = 'col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card product-card h-100">
        <img src="${p.img}" class="card-img-top" alt="${escapeHtml(p.title)}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${escapeHtml(p.title)}</h6>
          <div class="mb-2 small text-muted">${renderStars(p.rating)} <span class="ms-1">${p.rating}</span></div>
          <div class="mt-auto d-flex justify-content-between align-items-center gap-2">
            <div class="fw-bold text-primary">$${p.price.toFixed(2)}</div>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-1" onclick="openProductModal('${p.id}')">Details</button>
              <button class="btn btn-sm btn-primary" onclick="addToCartById('${p.id}',1)">Add</button>
            </div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

function renderStars(r){
  const full = Math.floor(r);
  let s = '';
  for(let i=0;i<5;i++){
    s += i < full ? '★' : '☆';
  }
  return `<span class="text-warning">${s}</span>`;
}

// Product modal population
function openProductModal(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('modalImage').src = p.img;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalPrice').textContent = `$${p.price.toFixed(2)}`;
  document.getElementById('modalQty').value = 1;
  document.getElementById('modalAddBtn').dataset.productId = p.id;
  document.getElementById('modalRating').innerHTML = renderStars(p.rating)+' <small class="text-muted ms-2">'+p.rating+'</small>';
  new bootstrap.Modal(document.getElementById('productModal')).show();
}

// ====== CART manip ======
function addToCartById(id, qty=1){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const found = cart.find(i=> i.id === id);
  if(found) found.qty += qty;
  else cart.push({ id: p.id, title: p.title, price: p.price, qty: qty, img: p.img});
  saveCart();
  toast(`${p.title} added (${qty})`);
  updateCartBadges();
}

function saveCart(){
  localStorage.setItem('wail_cart', JSON.stringify(cart));
}

function loadCart(){
  cart = JSON.parse(localStorage.getItem('wail_cart') || '[]');
}

function renderCartTable(){
  loadCart();
  const body = document.getElementById('cartTableBody');
  const empty = document.getElementById('cartEmpty');
  const container = document.getElementById('cartContainer');
  body.innerHTML = '';
  if(cart.length === 0){
    empty.classList.remove('d-none');
    container.classList.add('d-none');
    updateCartBadges();
    return;
  }
  empty.classList.add('d-none');
  container.classList.remove('d-none');

  let total = 0;
  cart.forEach((item, idx)=>{
    const subtotal = item.price * item.qty;
    total += subtotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="min-width:230px;">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.img}" alt="${escapeHtml(item.title)}" style="width:80px;height:60px;object-fit:cover;border-radius:6px" />
          <div>
            <div class="fw-semibold">${escapeHtml(item.title)}</div>
            <div class="small text-muted">$${item.price.toFixed(2)}</div>
          </div>
        </div>
      </td>
      <td class="text-center">$${item.price.toFixed(2)}</td>
      <td class="text-center">
        <div class="d-flex justify-content-center align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${idx}, -1)">-</button>
          <input onchange="setQty(${idx}, this.value)" style="width:56px;text-align:center" class="form-control form-control-sm" value="${item.qty}" type="number" min="1">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${idx}, +1)">+</button>
        </div>
      </td>
      <td class="text-center">$${subtotal.toFixed(2)}</td>
      <td class="text-end"><button class="btn btn-sm btn-danger" onclick="removeCartItem(${idx})">Remove</button></td>
    `;
    body.appendChild(tr);
  });

  // shipping & total
  const shipping = 5.00;
  const totalWithShipping = total + shipping;
  document.getElementById('cartTotal').textContent = `$${totalWithShipping.toFixed(2)}`;
  updateCartBadges();
}

function changeQty(index, delta){
  if(!cart[index]) return;
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  saveCart();
  renderCartTable();
}

function setQty(index, value){
  const v = Math.max(1, parseInt(value||1,10));
  cart[index].qty = v;
  saveCart();
  renderCartTable();
}

 function removeCartItem(index){
  cart.splice(index,1);
  saveCart();
  renderCartTable();
  toast('Item removed');
}

document.getElementById('checkoutBtn')?.addEventListener('click', ()=>{
  if(cart.length === 0) return alert('Cart is empty');
  // simulate checkout
  localStorage.removeItem('wail_cart');
  cart = [];
  renderCartTable();
  toast('Order placed! Thank you 🙌');
});

// simple toast style
function toast(msg){
  // fallback alert + small non-intrusive floating element
  const el = document.createElement('div');
  el.className = 'toastify';
  el.style = 'position:fixed;right:20px;bottom:20px;background:#111;color:#fff;padding:12px 16px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:9999';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=> el.style.opacity = '0.0', 2400);
  setTimeout(()=> el.remove(), 3000);
}


function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

loadCart();
updateCartBadges();
