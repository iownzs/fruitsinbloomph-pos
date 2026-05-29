let cart = [];
let posProducts = [];

shell(`
  <div class="pos-layout">
    <div class="pos-products">
      <div class="toolbar">
        <input id="posProductSearch" placeholder="Search product, SKU, barcode">
        <button class="btn">Barcode Scan</button>
      </div>

      <div class="chips pos-category-chips" id="posCategoryChips">
        <button class="chip active" onclick="filterPOSCategory('')">All</button>
      </div>

      <div id="posProductsStatus" class="muted" style="margin:12px 0">
        Loading products from Firestore...
      </div>

      <div class="product-grid" id="posProductGrid">
        <div class="card">Loading products...</div>
      </div>
    </div>

    <div class="card pos-cart-panel" id="cartPanel">
      ${cartPanelHtml()}
    </div>
  </div>

  <button class="mobile-cart-button" id="mobileCartButton" onclick="openCartSheet()">
    🛒 Cart • 0 items • ₱0
  </button>

  <div class="cart-sheet-overlay" id="cartSheetOverlay" onclick="closeCartSheet()"></div>

  <div class="cart-bottom-sheet" id="cartBottomSheet">
    <div class="cart-sheet-handle"></div>
    <div class="cart-sheet-head">
      <h3>Cart</h3>
      <button class="icon-btn" onclick="closeCartSheet()">✕</button>
    </div>
    <div id="cartSheetContent">
      ${cartPanelHtml()}
    </div>
  </div>
`);

async function loadPOSProducts(){
  const status = document.getElementById("posProductsStatus");

  try{
    if(window.FIB_FIREBASE_READY && window.FIB.getProducts){
      status.innerHTML = "Reading products from Firestore...";
      posProducts = await window.FIB.getProducts();
      status.innerHTML = `${badge('Firestore Loaded')} ${posProducts.length} products found.`;
    }else{
      posProducts = FIB_DATA.products || [];
      status.innerHTML = `${badge('Sample Data')} Firebase not ready. Showing sample products.`;
    }

    renderPOSCategories(posProducts);
    renderPOSProducts(posProducts);
  }catch(error){
    posProducts = FIB_DATA.products || [];
    status.innerHTML = `${badge('Load Failed')} ${error.message}. Showing sample products.`;
    renderPOSCategories(posProducts);
    renderPOSProducts(posProducts);
  }
}

function renderPOSCategories(products){
  const wrap = document.getElementById("posCategoryChips");
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  wrap.innerHTML = `
    <button class="chip active" onclick="filterPOSCategory('')">All</button>
    ${categories.map(category => `
      <button class="chip" onclick="filterPOSCategory('${category.replaceAll("'", "\\'")}')">${category}</button>
    `).join('')}
  `;
}

function renderPOSProducts(products){
  const grid = document.getElementById("posProductGrid");

  if(!products.length){
    grid.innerHTML = `<div class="card">No products found.</div>`;
    return;
  }

  grid.innerHTML = products.map(product => `
    <div class="card product-card">
      <h3>${product.name || ''}</h3>
      <p class="muted">${product.details || ''}</p>

      <div class="chips">
        ${badge(product.category || 'No Category')}
        ${badge('Stock ' + (product.stock ?? 0))}
      </div>

      <p><strong>${money(product.price || 0)}</strong></p>

      <button class="btn primary" onclick="addCart('${escapeText(product.id || product.name)}')">
        Add
      </button>
    </div>
  `).join('');
}

function filterPOSCategory(category){
  document.querySelectorAll("#posCategoryChips .chip").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === (category || "All"));
  });

  applyPOSFilters(category);
}

function applyPOSFilters(categoryOverride){
  const search = document.getElementById("posProductSearch").value.toLowerCase();
  const activeCategory = categoryOverride !== undefined
    ? categoryOverride
    : getActivePOSCategory();

  const filtered = posProducts.filter(product => {
    const searchText = [
      product.name,
      product.id,
      product.category,
      product.details
    ].join(" ").toLowerCase();

    const matchSearch = !search || searchText.includes(search);
    const matchCategory = !activeCategory || product.category === activeCategory;

    return matchSearch && matchCategory;
  });

  renderPOSProducts(filtered);
}

function getActivePOSCategory(){
  const active = document.querySelector("#posCategoryChips .chip.active");
  if(!active || active.textContent === "All") return "";
  return active.textContent;
}

function escapeText(text){
  return String(text).replace(/'/g, "\\'");
}

function cartPanelHtml(){
  return `
    <h3>Cart</h3>

    <div class="toggle">
      <button id="pickupBtn" class="active" onclick="setType('pickup')">Pickup</button>
      <button id="deliveryBtn" onclick="setType('delivery')">Delivery</button>
    </div>

    <h3>Order Info</h3>

    <div class="chips">
      ${['Facebook','Instagram','TikTok','Viber','WhatsApp','Website','Other'].map(x => `
        <button class="chip">${x}</button>
      `).join('')}
    </div>

    <br>

    <div class="chips">
      <button class="chip active">Organic</button>
      <button class="chip">Ads</button>
      <button class="chip active">Normal</button>
      <button class="chip">Rush</button>
    </div>

    <h3>Customer</h3>
    <label>Name<input></label>
    <br>
    <label>Contact<input></label>

    <div id="typeFields"></div>

    <h3>Cart Items</h3>
    <div id="cartList" class="muted">No items yet.</div>

    <h3>Total</h3>
    <p>Grand Total: <strong id="grand">${money(0)}</strong></p>

    <label>
      Payment Method
      <select>
        <option>Cash</option>
        <option>Card</option>
        <option>E-wallet</option>
        <option>QR</option>
        <option>PayPal</option>
      </select>
    </label>

    <br>

    <button class="btn primary" onclick="openModal('Checkout Sample','<p>Order save to Firestore comes next in Phase 2.</p>')">
      Checkout
    </button>
  `;
}

function renderCart(){
  const itemHtml = cart.length
    ? cart.map(i => `<div>${i.name} - ${money(i.price)}</div>`).join('')
    : 'No items yet.';

  const total = cart.reduce((a,b) => a + b.price, 0);

  document.querySelectorAll('#cartList').forEach(el => el.innerHTML = itemHtml);
  document.querySelectorAll('#grand').forEach(el => el.textContent = money(total));

  const mobileBtn = document.getElementById('mobileCartButton');
  if(mobileBtn){
    mobileBtn.textContent = `🛒 Cart • ${cart.length} item${cart.length === 1 ? '' : 's'} • ${money(total)}`;
  }
}

function addCart(productId){
  const product = posProducts.find(p => p.id === productId || p.name === productId);
  if(!product) return;

  cart.push({
    productId: product.id,
    name: product.name,
    price: product.price || 0,
    qty: 1
  });

  renderCart();
}

function setType(t){
  document.querySelectorAll('#pickupBtn').forEach(btn => btn.classList.toggle('active', t === 'pickup'));
  document.querySelectorAll('#deliveryBtn').forEach(btn => btn.classList.toggle('active', t === 'delivery'));

  const pickupFields = `
    <h3>Pickup Details</h3>
    <label>Pickup Person Name<input></label><br>
    <label>Pickup Person Contact<input></label><br>
    <label>Pickup Date<input type="date"></label><br>
    <label>Pickup Time<input type="time"></label><br>
    <label>Card Message<textarea></textarea></label><br>
    <label>Pickup Notes<textarea></textarea></label>
  `;

  const deliveryFields = `
    <h3>Delivery Details</h3>
    <label>Recipient Name<input></label><br>
    <label>Recipient Contact<input></label><br>
    <label>Delivery Address<textarea></textarea></label><br>
    <label>
      City / Area
      <select>
        <option>Quezon City</option>
        <option>Makati</option>
        <option>Manila</option>
      </select>
    </label><br>
    <label>Landmark<input></label><br>
    <label>Delivery Date<input type="date"></label><br>
    <label>Delivery Time<input type="time"></label><br>
    <label>
      Delivery Type
      <select>
        <option>BFC</option>
        <option>INH</option>
      </select>
    </label><br>
    <label>Card Message<textarea></textarea></label>
  `;

  document.querySelectorAll('#typeFields').forEach(el => {
    el.innerHTML = t === 'pickup' ? pickupFields : deliveryFields;
  });
}

function openCartSheet(){
  document.getElementById('cartBottomSheet')?.classList.add('open');
  document.getElementById('cartSheetOverlay')?.classList.add('open');
}

function closeCartSheet(){
  document.getElementById('cartBottomSheet')?.classList.remove('open');
  document.getElementById('cartSheetOverlay')?.classList.remove('open');
}

document.getElementById("posProductSearch").addEventListener("input", () => applyPOSFilters());

setType('pickup');
renderCart();
loadPOSProducts();
