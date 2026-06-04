shell(`
  <div class="toolbar orders-filter-panel">
    <div class="orders-filter-top">
      <input id="orderSearch" class="orders-search-filter" placeholder="Search order, customer, recipient">
      <button class="btn orders-reset-filter" onclick="resetOrderFilters()">Reset Filter</button>
    </div>

    <div class="orders-filter-bottom">
      <select id="statusFilter" class="orders-status-filter">
        <option value="">All Status</option>
        <option>Created</option>
        <option>Sent to Kitchen</option>
        <option>Preparing</option>
        <option>Ready</option>
        <option>Completed</option>
      </select>

      <select id="typeFilter" class="orders-type-filter">
        <option value="">All Type</option>
        <option>Delivery</option>
        <option>Pickup</option>
      </select>

      <select id="priorityFilter" class="orders-priority-filter">
        <option value="">All Priority</option>
        <option>Rush</option>
        <option>Normal</option>
      </select>
    </div>

    <div class="orders-filter-dates">
      <label>
        Order Date
        <input id="orderDateFilter" class="orders-order-date-filter" type="date">
      </label>

      <label>
        Delivery / Pickup Date
        <input id="scheduleDateFilter" class="orders-schedule-date-filter" type="date">
      </label>

      <label>
        City / Area
        <select id="cityFilter" class="orders-city-filter">
          <option value="">All City / Area</option>
          <option>Quezon City</option>
          <option>Makati</option>
          <option>Manila</option>
          <option>Pasig</option>
          <option>Taguig</option>
          <option>Pasay</option>
          <option>Parañaque</option>
          <option>Las Piñas</option>
          <option>Muntinlupa</option>
          <option>Mandaluyong</option>
          <option>San Juan</option>
          <option>Marikina</option>
          <option>Caloocan</option>
          <option>Malabon</option>
          <option>Navotas</option>
          <option>Valenzuela</option>
          <option>Rizal</option>
          <option>Cavite</option>
          <option>Laguna</option>
          <option>Batangas</option>
          <option>Bulacan</option>
          <option>Pampanga</option>
          <option>Bataan</option>
        </select>
      </label>
    </div>
  </div>

  <div class="card">
    <h3>Orders from Firestore</h3>
    <p class="muted">Orders are loaded from Firebase Firestore.</p>

    <div id="ordersStatus" class="muted" style="margin:12px 0">
      Loading orders...
    </div>

    <div class="orders-desktop-table table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order ID / Priority</th>
            <th>Order Created / Created By</th>
            <th>Source</th>
            <th>Source Type</th>
            <th>Customer</th>
            <th>Recipient / Pickup</th>
            <th>Date & Time</th>
            <th>Address / City</th>
            <th>Order Type</th>
            <th>Items</th>
            <th>Item Notes</th>
            <th>Card Message</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>QR / Tracking</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="ordersTableBody">
          <tr><td colspan="17">Loading...</td></tr>
        </tbody>
      </table>
    </div>

    <div id="ordersMobileCards" class="orders-mobile-cards">
      Loading...
    </div>
  </div>
`);

let allOrders = [];

async function loadOrders(){
  const status = document.getElementById("ordersStatus");
  const body = document.getElementById("ordersTableBody");
  const cards = document.getElementById("ordersMobileCards");

  try{
    if(!window.FIB_FIREBASE_READY || !window.FIB.getOrders){
      throw new Error(window.FIB_FIREBASE_ERROR || "Firebase orders service is not ready.");
    }

    status.innerHTML = "Reading orders from Firestore...";
    allOrders = await window.FIB.getOrders();

    renderOrders(allOrders);
    status.innerHTML = `${badge('Firestore Loaded')} ${allOrders.length} orders found.`;
  }catch(error){
    status.innerHTML = `${badge('Load Failed')} ${error.message}`;
    body.innerHTML = `<tr><td colspan="17">${error.message}</td></tr>`;
    cards.innerHTML = `<div class="mini-card">${error.message}</div>`;
  }
}

function renderOrders(orders){
  renderOrdersTable(orders);
  // Mobile uses compact horizontal table, not cards.
}

function formatCreatedAt(order){
  try{
    if(order.createdAt && order.createdAt.toDate){
      return order.createdAt.toDate().toLocaleString();
    }
  }catch(e){}
  return "Just now";
}

function getRecipientText(order){
  if(order.orderType === "Delivery"){
    return `
      <strong>${order.delivery?.recipientName || ''}</strong>
      <br>
      <small>${order.delivery?.recipientContact || ''}</small>
    `;
  }

  return `
    <strong>${order.customer?.name || ''}</strong>
    <br>
    <small>${order.customer?.contact || ''}</small>
  `;
}

function getScheduleText(order){
  if(order.orderType === "Delivery"){
    return `${order.delivery?.deliveryDate || ''}<br><small>${order.delivery?.deliveryTime || ''}</small>`;
  }

  return `${order.pickup?.pickupDate || ''}<br><small>${order.pickup?.pickupTime || ''}</small>`;
}

function getAddressText(order){
  if(order.orderType === "Delivery"){
    return `${order.delivery?.deliveryAddress || ''} ${order.delivery?.cityArea || ''}`;
  }

  return "Pickup order";
}


function sourceLogo(source){
  const key = String(source || "Other").toLowerCase();

  const map = {
    facebook: { label: "FB", name: "Facebook", cls: "source-facebook" },
    instagram: { label: "IG", name: "Instagram", cls: "source-instagram" },
    tiktok: { label: "TT", name: "TikTok", cls: "source-tiktok" },
    viber: { label: "VB", name: "Viber", cls: "source-viber" },
    whatsapp: { label: "WA", name: "WhatsApp", cls: "source-whatsapp" },
    website: { label: "WEB", name: "Website", cls: "source-website" },
    other: { label: "OT", name: "Other", cls: "source-other" }
  };

  const item = map[key] || map.other;

  return `
    <span class="source-logo ${item.cls}">
      <span>${item.label}</span>
    </span>
    <small>${item.name}</small>
  `;
}

function renderOrdersTable(orders){
  const body = document.getElementById("ordersTableBody");

  if(!orders.length){
    body.innerHTML = `<tr><td colspan="17">No orders found. Create an order from POS Terminal.</td></tr>`;
    return;
  }

  body.innerHTML = orders.map(order => `
    <tr>
      <td>
        <strong>${order.orderId || order.id}</strong>
        <br>
        ${badge(order.priority || 'Normal')}
      </td>

      <td>
        ${formatCreatedAt(order)}
        <br>
        <small>${order.createdBy?.name || 'Admin'} (${order.createdBy?.role || 'Owner/Admin'})</small>
      </td>

      <td class="source-cell">${sourceLogo(order.orderSource)}</td>
      <td>${badge(order.sourceType || 'Organic')}</td>

      <td>
        <strong>${order.customer?.name || ''}</strong>
        <br>
        <small>${order.customer?.contact || ''}</small>
      </td>

      <td>${getRecipientText(order)}</td>

      <td>${getScheduleText(order)}</td>

      <td>
        <button class="icon-btn" onclick="showAddress('${order.id}')">📍</button>
      </td>

      <td>${order.orderType || ''}</td>

      <td>
        <button class="icon-btn" onclick="showItems('${order.id}')">🧺</button>
      </td>

      <td>
        <button class="icon-btn" onclick="showItemNotes('${order.id}')">📝</button>
      </td>

      <td>
        <button class="icon-btn" onclick="showCardMessage('${order.id}')">💌</button>
      </td>

      <td><strong>${money(order.total || 0)}</strong></td>

      <td>
        ${order.payment?.method || ''}
        <br>
        ${badge(order.payment?.status || '')}
      </td>

      <td>${badge(order.status || 'Created')}</td>

      <td>
        <button class="btn small" onclick="openQr('${order.id}')">QR</button>
        ${order.orderType === 'Delivery' ? `<button class="btn small" onclick="openTrack('${order.id}')">Track</button>` : ''}
      </td>

      <td>
        <button class="btn small" onclick="showOrder('${order.id}')">View</button>
      </td>
    </tr>
  `).join('');
}

function renderOrdersCards(orders){
  const cards = document.getElementById("ordersMobileCards");

  if(!orders.length){
    cards.innerHTML = `<div class="mini-card">No orders found.</div>`;
    return;
  }

  cards.innerHTML = orders.map(order => `
    <div class="mini-card order-mobile-card">
      <div class="product-mobile-head">
        <div>
          <h3>${order.orderId || order.id}</h3>
          <p class="muted">${formatCreatedAt(order)}</p>
        </div>
        ${badge(order.status || 'Created')}
      </div>

      <div class="product-mobile-meta">
        ${badge(order.priority || 'Normal')}
        ${badge(order.orderType || '')}
        ${badge(order.sourceType || 'Organic')}
      </div>

      <p>
        <strong>Customer:</strong> ${order.customer?.name || ''}<br>
        <span class="muted">${order.customer?.contact || ''}</span>
      </p>

      <p>
        <strong>${order.orderType === 'Delivery' ? 'Recipient' : 'Pickup'}:</strong>
        ${order.orderType === 'Delivery' ? (order.delivery?.recipientName || '') : (order.customer?.name || '')}
      </p>

      <div class="stock-grid">
        <div><span>Total</span><strong>${money(order.total || 0)}</strong></div>
        <div><span>Payment</span><strong>${order.payment?.status || ''}</strong></div>
        <div><span>Items</span><strong>${Array.isArray(order.items) ? order.items.length : 0}</strong></div>
        <div><span>Source</span><strong>${order.orderSource || ''}</strong></div>
      </div>

      <div class="product-mobile-actions">
        <button class="btn small" onclick="showOrder('${order.id}')">View</button>
        <button class="btn small" onclick="showItems('${order.id}')">Items</button>
        <button class="btn small" onclick="showItemNotes('${order.id}')">Notes</button>
        <button class="btn small" onclick="showCardMessage('${order.id}')">Card</button>
      </div>

      <div class="product-mobile-actions" style="margin-top:8px">
        <button class="btn small" onclick="openQr('${order.id}')">QR Details</button>
        ${order.orderType === 'Delivery' ? `<button class="btn small primary" onclick="openTrack('${order.id}')">Live Track</button>` : ''}
      </div>
    </div>
  `).join('');
}

function findOrder(orderId){
  return allOrders.find(order => order.id === orderId || order.orderId === orderId);
}

function showAddress(orderId){
  const order = findOrder(orderId);
  if(!order) return;

  openModal(
    "Address / City",
    `<p>${getAddressText(order)}</p>`,
    `<button class="btn" onclick="copyText('${escapeModalText(getAddressText(order))}')">Copy Address</button>
     <button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showItems(orderId){
  const order = findOrder(orderId);
  if(!order) return;

  const items = Array.isArray(order.items) ? order.items : [];

  openModal(
    `${order.orderId || order.id} Items`,
    items.length
      ? `<ul>${items.map(item => `<li>${item.name} x${item.qty || 1} — ${money(item.subtotal || item.price || 0)}</li>`).join('')}</ul>`
      : `<p class="muted">No items saved.</p>`,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}


function showItemNotes(orderId){
  const order = findOrder(orderId);
  if(!order) return;

  const notes = order.itemNotes || "No item notes.";

  openModal(
    "Item Notes",
    `<p>${notes}</p>`,
    `<button class="btn" onclick="copyText('${escapeModalText(notes)}')">Copy Item Notes</button>
     <button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showCardMessage(orderId){
  const order = findOrder(orderId);
  if(!order) return;

  const message = order.cardMessage || "No card message.";

  openModal(
    "Card Message",
    `<p>${message}</p>`,
    `<button class="btn" onclick="copyText('${escapeModalText(message)}')">Copy Card Message</button>
     <button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showOrder(orderId){
  const order = findOrder(orderId);
  if(!order) return;

  openModal(
    order.orderId || order.id,
    `
      <p><strong>Status:</strong> ${order.status || ''}</p>
      <p><strong>Type:</strong> ${order.orderType || ''}</p>
      <p><strong>Customer:</strong> ${order.customer?.name || ''} / ${order.customer?.contact || ''}</p>
      <p><strong>Total:</strong> ${money(order.total || 0)}</p>
      <p><strong>Payment:</strong> ${order.payment?.method || ''} / ${order.payment?.status || ''}</p>
      <p><strong>Item Notes:</strong> ${order.itemNotes || 'No item notes.'}</p>
    `,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function openQr(orderId){
  location.href = `./qr-order-details.html?order=${encodeURIComponent(orderId)}`;
}

function openTrack(orderId){
  location.href = `./live-track.html?order=${encodeURIComponent(orderId)}`;
}

function escapeModalText(text){
  return String(text || '').replace(/'/g, "\\'").replace(/\n/g, " ");
}

function copyText(text){
  navigator.clipboard?.writeText(text);
  closeModal();
}

function orderDateValue(value){
  if(!value) return "";

  try{
    if(value.toDate){
      return value.toDate().toISOString().slice(0, 10);
    }

    const date = new Date(value);
    if(!Number.isNaN(date.getTime())){
      return date.toISOString().slice(0, 10);
    }
  }catch(error){}

  return "";
}

function resetOrderFilters(){
  const search = document.getElementById("orderSearch");
  const status = document.getElementById("statusFilter");
  const type = document.getElementById("typeFilter");
  const priority = document.getElementById("priorityFilter");
  const orderDate = document.getElementById("orderDateFilter");
  const scheduleDate = document.getElementById("scheduleDateFilter");
  const city = document.getElementById("cityFilter");

  if(search) search.value = "";
  if(status) status.value = "";
  if(type) type.value = "";
  if(priority) priority.value = "";
  if(orderDate) orderDate.value = "";
  if(scheduleDate) scheduleDate.value = "";
  if(city) city.value = "";

  applyOrderFilters();
}

function applyOrderFilters(){
  const search = document.getElementById("orderSearch").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const type = document.getElementById("typeFilter").value;
  const priority = document.getElementById("priorityFilter")?.value || "";
  const orderDate = document.getElementById("orderDateFilter")?.value || "";
  const scheduleDate = document.getElementById("scheduleDateFilter")?.value || "";
  const city = document.getElementById("cityFilter")?.value || "";

  const filtered = allOrders.filter(order => {
    const itemText = Array.isArray(order.items)
      ? order.items.map(item => item.name).join(" ")
      : "";

    const searchText = [
      order.orderId,
      order.id,
      order.customer?.name,
      order.customer?.contact,
      order.delivery?.recipientName,
      order.delivery?.recipientContact,
      order.pickup?.pickupPersonName,
      order.pickup?.pickupPersonContact,
      order.status,
      order.orderType,
      order.priority,
      itemText
    ].join(" ").toLowerCase();

    const orderPriority = order.priority || "Normal";
    const orderCity = order.delivery?.cityArea || "";
    const createdDate = orderDateValue(order.createdAt || order.createdDate || order.orderCreatedAt);
    const orderScheduleDate = order.orderType === "Delivery"
      ? (order.delivery?.deliveryDate || "")
      : (order.pickup?.pickupDate || "");

    const matchSearch = !search || searchText.includes(search);
    const matchStatus = !status || order.status === status;
    const matchType = !type || order.orderType === type;
    const matchPriority = !priority || orderPriority === priority;
    const matchOrderDate = !orderDate || createdDate === orderDate;
    const matchScheduleDate = !scheduleDate || orderScheduleDate === scheduleDate;
    const matchCity = !city || orderCity === city;

    return matchSearch && matchStatus && matchType && matchPriority && matchOrderDate && matchScheduleDate && matchCity;
  });

  renderOrders(filtered);
}

document.getElementById("orderSearch").addEventListener("input", applyOrderFilters);
document.getElementById("statusFilter").addEventListener("change", applyOrderFilters);
document.getElementById("typeFilter").addEventListener("change", applyOrderFilters);
document.getElementById("priorityFilter")?.addEventListener("change", applyOrderFilters);
document.getElementById("orderDateFilter")?.addEventListener("change", applyOrderFilters);
document.getElementById("scheduleDateFilter")?.addEventListener("change", applyOrderFilters);
document.getElementById("cityFilter")?.addEventListener("change", applyOrderFilters);

loadOrders();
