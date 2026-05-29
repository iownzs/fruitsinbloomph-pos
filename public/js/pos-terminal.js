
const productCards = FIB_DATA.products.map(p => `
  <div class="card product-card">
    <h3>${p.name}</h3>
    <p class="muted">${p.details}</p>
    ${badge(p.category)} ${badge('Stock ' + p.stock)}
    <p><strong>${money(p.price)}</strong></p>
    <button class="btn primary" onclick="addCart('${p.name}', ${p.price})">Add</button>
  </div>
`).join('');

shell(`
  <div class="pos-layout">
    <div class="pos-products">
      <div class="toolbar">
        <input placeholder="Search product, SKU, barcode">
        <button class="btn">Barcode Scan</button>
      </div>

      <div class="chips pos-category-chips">
        ${['All','FIB Pantry',"Mother's Day","Father's Day",'Gift Basket'].map((c,i) => `
          <button class="chip ${i === 0 ? 'active' : ''}">${c}</button>
        `).join('')}
      </div>

      <div class="product-grid">
        ${productCards}
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

let cart = [];

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

    <button class="btn primary" onclick="openModal('Checkout Sample','<p>Order saved to sample Orders. Firebase connection comes in Phase 2.</p>')">
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

function addCart(name, price){
  cart.push({name, price});
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

setType('pickup');
renderCart();
