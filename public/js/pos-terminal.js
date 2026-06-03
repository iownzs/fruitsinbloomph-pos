let cart = [];
let posProducts = [];

shell(`
  <div class="pos-layout">
    <div class="pos-products">
      <div class="toolbar">
        <input id="posProductSearch" placeholder="Search product, SKU, barcode">
        <button class="btn barcode-scan" onclick="openSmartScan()">Smart Scan</button>
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

  grid.innerHTML = products.map((product, index) => `
    <div class="card product-card pos-product-compact-card">
      <div class="pos-product-main">
        <div class="pos-product-thumb">
          ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name || 'Product'}">` : `<span>${(product.name || '?').slice(0,1)}</span>`}
        </div>

        <div class="pos-product-text">
          <div class="pos-product-title-row">
            <h3>${product.name || ''}</h3>
            <strong class="pos-product-price">${money(product.price || 0)}</strong>
          </div>

          <div class="pos-product-badges">
            ${badge(product.category || 'No Category')}
            ${badge('Stock ' + (product.stock ?? 0))}
          </div>

          <p class="muted pos-product-desc">${product.details || ''}</p>
        </div>

        <div class="pos-product-actions">
          <button type="button" class="btn primary pos-product-view" data-pos-product-index="${index}">
            View
          </button>

          <button class="btn primary pos-product-add" onclick="addCart('${escapeText(product.id || product.name)}')">
            Add
          </button>
        </div>
      </div>
    </div>
  `).join('');

  attachPOSProductViewButtons(products);
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
    <div class="cart-title-row">
      <h3>Cart</h3>
      <button class="btn small danger" onclick="resetCart()">Clear Cart</button>
    </div>

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



function openSmartScan(){
  openModal(
    "Smart Scan",
    `
      <p class="muted">Upload an order form screenshot or paste order text. Scan result is draft only; unmatched products will not be added to cart.</p>

      <label>
        Upload Image
        <input id="smartScanImage" type="file" accept="image/*">
      </label>

      <label>
        Paste Order Text
        <textarea id="smartScanText" placeholder="Paste customer order form or message here..."></textarea>
      </label>

      <div id="smartScanResult" class="card" style="margin-top:12px;background:#0b1220">
        Extracted details will show here.
      </div>
    `,
    `<button class="btn primary" onclick="runSmartScan()">Scan</button>
     <button class="btn" onclick="closeModal()">Cancel</button>`
  );
}

function fileToBase64(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1] || "";
      resolve({
        mimeType: file.type || "image/jpeg",
        base64
      });
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function runSmartScan(){
  const resultBox = document.getElementById("smartScanResult");
  const textInput = document.getElementById("smartScanText");
  const imageInput = document.getElementById("smartScanImage");

  try{
    resultBox.innerHTML = "Scanning...";

    const pastedText = textInput?.value?.trim() || "";
    const file = imageInput?.files?.[0] || null;

    let image = null;

    if(file){
      image = await fileToBase64(file);
    }

    if(!pastedText && !image){
      resultBox.innerHTML = `${badge("Missing Input")} <p class="muted">Please upload an image or paste order text.</p>`;
      return;
    }

    const response = await fetch("/api/scan-order-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: pastedText,
        image
      })
    });

    const data = await response.json();

    if(!response.ok){
      throw new Error(data.error || "Smart Scan failed.");
    }

    window.smartScanDraft = data.result;

    resultBox.innerHTML = smartScanPreview(data.result);
  }catch(error){
    resultBox.innerHTML = `${badge("Scan Failed")} <p class="muted">${error.message}</p>`;
  }
}

function smartScanPreview(data){
  const items = Array.isArray(data.items) ? data.items : [];

  return `
    ${badge("Draft Extracted")}
    <p><strong>Order Type:</strong> ${data.orderType || ""}</p>
    <p><strong>Customer:</strong> ${data.customerName || ""} / ${data.customerContact || ""}</p>
    <p><strong>Recipient:</strong> ${data.recipientName || ""} / ${data.recipientContact || ""}</p>
    <p><strong>Address:</strong> ${data.deliveryAddress || ""}</p>
    <p><strong>Delivery Date/Time:</strong> ${data.deliveryDate || ""} ${data.deliveryTime || ""}</p>
    <p><strong>Pickup Date/Time:</strong> ${data.pickupDate || ""} ${data.pickupTime || ""}</p>
    <p><strong>Items:</strong></p>
    <ul>
      ${items.length ? items.map(item => `<li>${item.productName || ""} x${item.quantity || 1}</li>`).join("") : "<li>No items detected</li>"}
    </ul>
    <p><strong>Item Notes:</strong> ${data.itemNotes || ""}</p>
    <p><strong>Card Message:</strong> ${data.cardMessage || ""}</p>
    <p><strong>Payment:</strong> ${data.paymentMethod || ""}</p>

    <button class="btn primary" onclick="quickFillCartFromSmartScan()">Quick Fill Draft</button>
  `;
}

function setFieldValue(selector, value){
  document.querySelectorAll(selector).forEach(el => {
    if(value !== undefined && value !== null && String(value).trim() !== ""){
      el.value = value;
    }
  });
}

function quickFillCartFromSmartScan(){
  const data = window.smartScanDraft;

  if(!data){
    alert("No scan draft available.");
    return;
  }

  const orderType = String(data.orderType || "").toLowerCase();

  if(orderType === "delivery"){
    setType("delivery");
  }else{
    setType("pickup");
  }

  setTimeout(() => {
    setFieldValue(".customer-name", data.customerName || "");
    setFieldValue(".customer-contact", data.customerContact || "");
    setFieldValue(".item-notes", data.itemNotes || "");
    setFieldValue(".card-message", data.cardMessage || "");

    if(orderType === "delivery"){
      setFieldValue(".recipient-name", data.recipientName || "");
      setFieldValue(".recipient-contact", data.recipientContact || "");
      setFieldValue(".delivery-address", data.deliveryAddress || "");
      setFieldValue(".city-area", data.cityArea || "");
      setFieldValue(".landmark", data.landmark || "");
      setFieldValue(".delivery-date", data.deliveryDate || "");
      setFieldValue(".delivery-time", data.deliveryTime || "");
      setFieldValue(".delivery-type", data.deliveryType || "");
    }else{
      setFieldValue(".pickup-date", data.pickupDate || "");
      setFieldValue(".pickup-time", data.pickupTime || "");
    }

    quickFillItemsFromSmartScan(data.items || []);
    closeModal();
  }, 150);
}

function quickFillItemsFromSmartScan(items){
  if(!Array.isArray(items)) return;

  const matchedItems = [];
  const unmatchedItems = [];

  items.forEach(scanItem => {
    const scanName = String(scanItem.productName || "").trim();
    const name = scanName.toLowerCase();
    const qty = Number(scanItem.quantity || 1);

    if(!name){
      return;
    }

    const product = posProducts.find(p => {
      const productName = String(p.name || "").toLowerCase();
      return productName.includes(name) || name.includes(productName);
    });

    if(product){
      matchedItems.push({
        scanName,
        productName: product.name,
        qty
      });

      for(let i = 0; i < qty; i++){
        addCart(product.id || product.name);
      }
    }else{
      unmatchedItems.push({
        productName: scanName,
        quantity: qty
      });
    }
  });

  window.smartScanUnmatchedItems = unmatchedItems;

  if(unmatchedItems.length){
    openModal(
      "Smart Scan Review Draft",
      `
        ${badge("Review Needed")}
        <p class="muted">Some scanned products did not match existing products. Cart was left empty for unmatched items. Please review and manually add the correct products.</p>

        <h4>Unmatched Items</h4>
        <ul>
          ${unmatchedItems.map(item => `<li>${item.productName} x${item.quantity || 1}</li>`).join("")}
        </ul>

        ${matchedItems.length ? `
          <h4>Matched Items Added</h4>
          <ul>
            ${matchedItems.map(item => `<li>${item.productName} x${item.qty}</li>`).join("")}
          </ul>
        ` : `<p><strong>No products were added to cart.</strong></p>`}
      `,
      `<button class="btn primary" onclick="closeModal()">Review POS</button>`
    );
  }
}

function resetCart(){
  const confirmReset = confirm("Clear cart and reset all order details?");

  if(!confirmReset){
    return;
  }

  cart = [];

  document.querySelectorAll(".pos-cart-panel input, .pos-cart-panel textarea, .pos-cart-panel select, #cartSheetContent input, #cartSheetContent textarea, #cartSheetContent select").forEach(field => {
    if(field.tagName === "SELECT"){
      field.selectedIndex = 0;
    }else{
      field.value = "";
    }
  });

  document.querySelectorAll("[data-source]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.source === "Facebook");
  });

  document.querySelectorAll("[data-source-type]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.sourceType === "Organic");
  });

  document.querySelectorAll("[data-priority]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.priority === "Normal");
  });

  setType("pickup");
  setupCartChipSelection();
  renderCart();
  closeCartSheet();
}


function posProductRecipeHtml(product){
  const recipe = Array.isArray(product.recipe) ? product.recipe : [];

  if(!recipe.length){
    return `<p class="muted">No recipe ingredients saved.</p>`;
  }

  function cleanRecipeUnit(unit){
    const value = String(unit || "").trim();

    // Old recipe data sometimes saved quantity number into the unit field.
    // If unit is empty or only numeric, treat it as pcs.
    if(!value || !Number.isNaN(Number(value))){
      return "pcs";
    }

    return value;
  }

  return `
    <div class="pos-product-recipe-list">
      ${recipe.map(item => {
        const name = item.ingredientName || item.name || item.itemName || "Ingredient";
        const id = item.ingredientId || item.id || item.itemId || "";
        const qty = item.qty ?? item.quantity ?? item.recipeQty ?? item.amount ?? item.ingredientQty ?? "";
        const unit = cleanRecipeUnit(item.unit || item.ingredientUnit || item.recipeUnit || item.uom);

        return `
          <div class="pos-product-recipe-item">
            <div>
              <strong>${name}</strong>
              <span>${id}</span>
            </div>
            <p>${qty}${unit ? " " + unit : ""}</p>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function showPOSProduct(productId){
  const key = String(productId || "");

  const product = allProducts.find(item =>
    String(item.id || "") === key ||
    String(item.productId || "") === key ||
    String(item.name || "") === key
  );

  if(!product){
    alert("Product not found: " + key);
    openModal("Product Not Found", `<p>Product was not found: ${key}</p>`);
    return;
  }

  const recipe = Array.isArray(product.recipe) ? product.recipe : [];
  const recipeCount = recipe.length;

  openModal(
    product.name || "Product Details",
    `
      <div class="product-view-full-preview">
        ${product.imageUrl
          ? `<img src="${product.imageUrl}" alt="${product.name || 'Product'}">`
          : `<div class="product-view-full-fallback">${(product.name || '?').slice(0,1)}</div>`
        }
      </div>

      <div class="product-view-summary">
        <h3>${product.name || ''}</h3>
        <p class="muted">${product.id || product.productId || ''}</p>
      </div>

      <div class="product-view-info-grid">
        <div>
          <span>Category</span>
          <strong>${product.category || 'No Category'}</strong>
        </div>
        <div>
          <span>Price</span>
          <strong>${money(product.price || 0)}</strong>
        </div>
        <div>
          <span>Stock</span>
          <strong>${product.stock ?? 0} ${product.unit || ''}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>${product.status || 'Active'}</strong>
        </div>
      </div>

      <h3>Details</h3>
      <p>${product.details || product.description || 'No product details saved.'}</p>

      <h3>Recipe Summary</h3>
      <p class="muted">${recipeCount} ingredient${recipeCount === 1 ? '' : 's'} saved.</p>
      ${posProductRecipeHtml(product)}
    `,
    `<button class="btn primary" onclick="addToCartFromPOSView('${product.id || product.productId || product.name}')">Add to Cart</button>
     <button class="btn" onclick="closeModal()">Close</button>`
  );
}

function addToCartFromPOSView(productId){
  closeModal();

  if(typeof addCart === "function"){
    addCart(productId);
    return;
  }

  if(typeof addToCart === "function"){
    addToCart(productId);
    return;
  }

  if(typeof addProductToCart === "function"){
    addProductToCart(productId);
    return;
  }

  alert("Cart function is not ready.");
}

window.showPOSProduct = showPOSProduct;
window.addToCartFromPOSView = addToCartFromPOSView;


/* Final POS product view global export */
window.showPOSProduct = showPOSProduct;
window.addToCartFromPOSView = addToCartFromPOSView;

/* Final POS product View delegated click handler */
if(!window.POS_PRODUCT_VIEW_CLICK_READY){
  window.POS_PRODUCT_VIEW_CLICK_READY = true;

  document.addEventListener("click", function(event){
    const button = event.target.closest("[data-pos-product-view]");
    if(!button) return;

    event.preventDefault();
    event.stopPropagation();

    const productId = button.getAttribute("data-pos-product-view");
    window.showPOSProduct(productId);
  });
}

/* POS product View direct button binding */
function attachPOSProductViewButtons(renderedProducts){
  document.querySelectorAll("[data-pos-product-index]").forEach(button => {
    button.onclick = function(event){
      event.preventDefault();
      event.stopPropagation();

      const index = Number(button.getAttribute("data-pos-product-index"));
      const product = renderedProducts[index];

      if(!product){
        alert("Product view failed. Product index not found.");
        return;
      }

      showPOSProductDirect(product);
    };
  });
}

function showPOSProductDirect(product){
  if(!product){
    alert("Product not found.");
    return;
  }

  const recipe = Array.isArray(product.recipe) ? product.recipe : [];
  const recipeCount = recipe.length;

  openModal(
    product.name || "Product Details",
    `
      <div class="product-view-full-preview">
        ${product.imageUrl
          ? `<img src="${product.imageUrl}" alt="${product.name || 'Product'}">`
          : `<div class="product-view-full-fallback">${(product.name || '?').slice(0,1)}</div>`
        }
      </div>

      <div class="product-view-summary">
        <h3>${product.name || ''}</h3>
        <p class="muted">${product.id || product.productId || ''}</p>
      </div>

      <div class="product-view-info-grid">
        <div>
          <span>Category</span>
          <strong>${product.category || 'No Category'}</strong>
        </div>
        <div>
          <span>Price</span>
          <strong>${money(product.price || 0)}</strong>
        </div>
        <div>
          <span>Stock</span>
          <strong>${product.stock ?? 0} ${product.unit || ''}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>${product.status || 'Active'}</strong>
        </div>
      </div>

      <h3>Details</h3>
      <p>${product.details || product.description || 'No product details saved.'}</p>

      <h3>Recipe Summary</h3>
      <p class="muted">${recipeCount} ingredient${recipeCount === 1 ? '' : 's'} saved.</p>
      ${posProductRecipeHtml(product)}
    `,
    `<button class="btn primary" onclick="addToCartFromPOSView('${product.id || product.productId || product.name}')">Add to Cart</button>
     <button class="btn" onclick="closeModal()">Close</button>`
  );
}

window.attachPOSProductViewButtons = attachPOSProductViewButtons;
window.showPOSProductDirect = showPOSProductDirect;
