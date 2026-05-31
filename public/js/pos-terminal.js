let cart = [];
let posProducts = [];

shell(`
  <div class="pos-layout">
    <div class="pos-products">
      <div class="toolbar">
        <input id="posProductSearch" placeholder="Search product, SKU, barcode">
        <button class="btn barcode-scan" class="barcode-scan">Barcode Scan</button>
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

    <p class="muted">Source</p>
    <div class="chips">
      ${['Facebook','Instagram','TikTok','Viber','WhatsApp','Website','Other'].map(x => `
        <button class="chip ${x === 'Facebook' ? 'active' : ''}" data-source="${x}">${x}</button>
      `).join('')}
    </div>

    <br>

    <p class="muted">Source Type</p>
    <div class="chips">
      <button class="chip active" data-source-type="Organic">Organic</button>
      <button class="chip" data-source-type="Ads">Ads</button>
    </div>

    <br>

    <p class="muted">Priority</p>
    <div class="chips">
      <button class="chip active" data-priority="Normal">Normal</button>
      <button class="chip" data-priority="Rush">Rush</button>
    </div>

    <h3>Customer</h3>
    <label>Customer Name<input class="customer-name"></label>
    <br>
    <label>Customer Contact<input class="customer-contact"></label>

    <div id="typeFields"></div>

    <h3>Cart Items</h3>
    <div id="cartList" class="muted">No items yet.</div>

    <label>
      Item Notes for Kitchen
      <textarea class="item-notes" placeholder="Example: Change logo from Happy Birthday to Congratulations"></textarea>
    </label>

    <label>
      Card Message
      <textarea class="card-message" placeholder="Message for recipient card"></textarea>
    </label>

    <h3>Total</h3>
    <p>Grand Total: <strong id="grand">${money(0)}</strong></p>

    <label>
      Payment Method
      <select class="payment-method">
        <option>Cash</option>
        <option>Card</option>
        <option>E-wallet</option>
        <option>QR</option>
        <option>PayPal</option>
      </select>
    </label>

    <br>

    <button class="btn primary" onclick="checkoutOrder()">
      Checkout
    </button>
  `;
}

function renderCart(){
  const itemHtml = cart.length
    ? cart.map((item, index) => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span>${money(item.price)} x ${item.qty} = ${money((item.price || 0) * (item.qty || 1))}</span>
        </div>

        <div class="cart-item-actions">
          <button class="btn small" onclick="decreaseCartQty(${index})">−</button>
          <span class="cart-qty">${item.qty}</span>
          <button class="btn small" onclick="increaseCartQty(${index})">+</button>
          <button class="btn small danger" onclick="removeCartItem(${index})">Remove</button>
        </div>
      </div>
    `).join('')
    : 'No items yet.';

  const total = cart.reduce((a,b) => a + ((b.price || 0) * (b.qty || 1)), 0);

  document.querySelectorAll('#cartList').forEach(el => el.innerHTML = itemHtml);
  document.querySelectorAll('#grand').forEach(el => el.textContent = money(total));

  const mobileBtn = document.getElementById('mobileCartButton');
  if(mobileBtn){
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    mobileBtn.textContent = `🛒 Cart • ${totalQty} item${totalQty === 1 ? '' : 's'} • ${money(total)}`;
    mobileBtn.style.display = totalQty > 0 ? "flex" : "none";
  }
}

function addCart(productId){
  const product = posProducts.find(p => p.id === productId || p.name === productId);
  if(!product) return;

  const existing = cart.find(item => item.productId === product.id);

  if(existing){
    existing.qty += 1;
  }else{
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price || 0,
      qty: 1
    });
  }

  setupCartChipSelection();
  renderCart();
}

function increaseCartQty(index){
  if(!cart[index]) return;
  cart[index].qty += 1;
  renderCart();
}

function decreaseCartQty(index){
  if(!cart[index]) return;

  cart[index].qty -= 1;

  if(cart[index].qty <= 0){
    cart.splice(index, 1);
  }

  renderCart();
}

function removeCartItem(index){
  if(!cart[index]) return;
  cart.splice(index, 1);
  renderCart();
}

function setType(t){
  document.querySelectorAll('#pickupBtn').forEach(btn => btn.classList.toggle('active', t === 'pickup'));
  document.querySelectorAll('#deliveryBtn').forEach(btn => btn.classList.toggle('active', t === 'delivery'));

  const pickupFields = `
    <h3>Pickup Details</h3>
    <label>Pickup Date<input class="pickup-date" type="date"></label><br>
    <label>Pickup Time<input class="pickup-time" type="time"></label>
  `;

  const deliveryFields = `
    <h3>Delivery Details</h3>
    <label>Recipient Name<input class="recipient-name"></label><br>
    <label>Recipient Contact<input class="recipient-contact"></label><br>
    <label>Delivery Address<textarea class="delivery-address"></textarea></label><br>
    <label>
      City / Area
      <select class="city-area">
        <option>Quezon City</option>
        <option>Makati</option>
        <option>Manila</option>
      </select>
    </label><br>
    <label>Landmark<input class="landmark"></label><br>
    <label>Delivery Date<input class="delivery-date" type="date"></label><br>
    <label>Delivery Time<input class="delivery-time" type="time"></label><br>
    <label>
      Delivery Type
      <select class="delivery-type">
        <option>BFC</option>
        <option>INH</option>
      </select>
    </label>
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

function getActiveChipText(chipTexts, fallback){
  for(const text of chipTexts){
    const buttons = [...document.querySelectorAll(".chip")];
    const active = buttons.find(btn => btn.textContent.trim() === text && btn.classList.contains("active"));
    if(active) return text;
  }
  return fallback;
}


function setupCartChipSelection(){
  document.querySelectorAll(".pos-cart-panel, #cartSheetContent").forEach(panel => {
    panel.querySelectorAll("[data-source]").forEach(btn => {
      btn.onclick = () => {
        panel.querySelectorAll("[data-source]").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
      };
    });

    panel.querySelectorAll("[data-source-type]").forEach(btn => {
      btn.onclick = () => {
        panel.querySelectorAll("[data-source-type]").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
      };
    });

    panel.querySelectorAll("[data-priority]").forEach(btn => {
      btn.onclick = () => {
        panel.querySelectorAll("[data-priority]").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
      };
    });
  });
}

function getCartFormData(){
  const isDelivery = [...document.querySelectorAll("#deliveryBtn")].some(btn => btn.classList.contains("active"));
  const orderType = isDelivery ? "Delivery" : "Pickup";

  const panels = [...document.querySelectorAll(".pos-cart-panel, #cartSheetContent")];
  const visiblePanel = panels.find(panel => {
    const rect = panel.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }) || panels[0];

  const getValue = selector => visiblePanel?.querySelector(selector)?.value?.trim() || "";
  const isChecked = selector => !!visiblePanel?.querySelector(selector)?.checked;

  const customerName = getValue(".customer-name");
  const customerContact = getValue(".customer-contact");

  const itemNotes = getValue(".item-notes");
  const cardMessage = getValue(".card-message");
  const paymentMethod = getValue(".payment-method") || "Cash";

  const orderSource = visiblePanel?.querySelector("[data-source].active")?.dataset.source || "Facebook";
  const sourceType = visiblePanel?.querySelector("[data-source-type].active")?.dataset.sourceType || "Organic";
  const priority = visiblePanel?.querySelector("[data-priority].active")?.dataset.priority || "Normal";

  let details = {};

  if(orderType === "Pickup"){
    details = {
      pickupDate: getValue(".pickup-date"),
      pickupTime: getValue(".pickup-time"),
      itemNotes,
      cardMessage,
      paymentMethod
    };
  }else{
    details = {
      recipientName: getValue(".recipient-name"),
      recipientContact: getValue(".recipient-contact"),
      deliveryAddress: getValue(".delivery-address"),
      cityArea: getValue(".city-area"),
      landmark: getValue(".landmark"),
      deliveryDate: getValue(".delivery-date"),
      deliveryTime: getValue(".delivery-time"),
      deliveryType: getValue(".delivery-type") || "BFC",
      itemNotes,
      cardMessage,
      paymentMethod
    };
  }

  return {
    orderType,
    customerName,
    customerContact,
    orderSource,
    sourceType,
    priority,
    ...details
  };
}

async function checkoutOrder(){
  try{
    if(!window.FIB_FIREBASE_READY || !window.FIB.createOrder){
      throw new Error("Firebase order service is not ready.");
    }

    if(!cart.length){
      openModal("Cart Empty", "<p>Please add at least one product before checkout.</p>");
      return;
    }

    const form = getCartFormData();
    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);

    const orderData = {
      orderType: form.orderType,
      orderSource: form.orderSource || "Facebook",
      sourceType: form.sourceType || "Organic",
      priority: form.priority || "Normal",

      customer: {
        name: form.customerName || "Walk-in Customer",
        contact: form.customerContact || ""
      },

      pickup: form.orderType === "Pickup" ? {
        pickupDate: form.pickupDate || "",
        pickupTime: form.pickupTime || ""
      } : null,

      delivery: form.orderType === "Delivery" ? {
        recipientName: form.recipientName || "",
        recipientContact: form.recipientContact || "",
        deliveryAddress: form.deliveryAddress || "",
        cityArea: form.cityArea || "",
        landmark: form.landmark || "",
        deliveryDate: form.deliveryDate || "",
        deliveryTime: form.deliveryTime || "",
        deliveryType: form.deliveryType || "BFC"
      } : null,

      cardMessage: form.cardMessage || "",
      itemNotes: form.itemNotes || "",

      items: cart.map(item => ({
        productId: item.productId || "",
        name: item.name || "",
        price: item.price || 0,
        qty: item.qty || 1,
        subtotal: (item.price || 0) * (item.qty || 1)
      })),

      subtotal: total,
      discount: 0,
      total: total,

      payment: {
        method: form.paymentMethod || "Cash",
        status: "Paid"
      },

      createdBy: {
        name: "Admin",
        role: "Owner/Admin"
      }
    };

    const orderId = await window.FIB.createOrder(orderData);

    cart = [];
    renderCart();
    closeCartSheet();

    openModal(
      "Order Created",
      `
        <p><strong>${orderId}</strong> saved to Firestore.</p>
        <p class="muted">Next: Orders page will read this order from Firestore.</p>
      `,
      `<button class="btn primary" onclick="location.href='./orders.html'">Open Orders</button>
       <button class="btn" onclick="closeModal()">Close</button>`
    );
  }catch(error){
    openModal("Checkout Failed", `<p>${error.message}</p>`);
  }
}

/* POS mobile compact class helper */
function applyPosMobileCompactClasses(){
  document.body.classList.add("pos-terminal-page");

  document.querySelectorAll("button").forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();

    if(text === "barcode scan"){
      btn.classList.add("pos-barcode-scan");
    }

    if(text === "add"){
      let card = btn.parentElement;

      for(let i = 0; i < 8 && card; i++){
        const hasTitle = !!card.querySelector("h3, h2, strong");
        const hasStock = card.textContent.includes("Stock");
        const hasPrice = card.textContent.includes("₱");

        if(hasTitle && hasPrice && hasStock){
          card.classList.add("pos-compact-product-card");
          card.parentElement?.classList.add("pos-compact-product-list");
          break;
        }

        card = card.parentElement;
      }
    }
  });
}

setInterval(applyPosMobileCompactClasses, 700);
setTimeout(applyPosMobileCompactClasses, 100);
setTimeout(applyPosMobileCompactClasses, 1000);

/* POS barcode class helper */
function applyBarcodeScanClass(){
  document.querySelectorAll("button").forEach(btn => {
    if(btn.textContent.trim().toLowerCase() === "barcode scan"){
      btn.classList.add("pos-barcode-scan");
    }
  });
}

setTimeout(applyBarcodeScanClass, 100);
setTimeout(applyBarcodeScanClass, 800);
setInterval(applyBarcodeScanClass, 1200);
