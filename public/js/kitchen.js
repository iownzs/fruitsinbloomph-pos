shell(`
  <div class="toolbar">
    <input id="kitchenSearch" placeholder="Search order, customer, item">
    <select id="kitchenStatusFilter">
      <option value="">All Kitchen Status</option>
      <option value="new">New Orders</option>
      <option value="sent">Sent to Kitchen</option>
      <option value="preparing">Preparing</option>
      <option value="ready">Ready</option>
    </select>
    <button class="btn" onclick="loadKitchenOrders()">Refresh</button>
  </div>

  <div class="card">
    <h3>Kitchen Board from Firestore</h3>
    <p class="muted">Orders are loaded from Firebase Firestore.</p>

    <div id="kitchenStatusText" class="muted" style="margin:12px 0">
      Loading kitchen orders...
    </div>

    <div class="kitchen-board">
      <div class="kitchen-column">
        <h3>New Orders</h3>
        <div id="newOrders" class="kitchen-list"></div>
      </div>

      <div class="kitchen-column">
        <h3>Sent to Kitchen</h3>
        <div id="sentOrders" class="kitchen-list"></div>
      </div>

      <div class="kitchen-column">
        <h3>Preparing</h3>
        <div id="preparingOrders" class="kitchen-list"></div>
      </div>

      <div class="kitchen-column">
        <h3>Ready</h3>
        <div id="readyOrders" class="kitchen-list"></div>
      </div>
    </div>
  </div>
`);

let allKitchenOrders = [];

async function loadKitchenOrders(){
  const status = document.getElementById("kitchenStatusText");

  try{
    if(!window.FIB_FIREBASE_READY || !window.FIB.getKitchenOrders){
      throw new Error(window.FIB_FIREBASE_ERROR || "Kitchen service is not ready.");
    }

    status.innerHTML = "Reading kitchen orders from Firestore...";
    allKitchenOrders = await window.FIB.getKitchenOrders();

    renderKitchenOrders(allKitchenOrders);
    status.innerHTML = `${badge('Firestore Loaded')} ${allKitchenOrders.length} kitchen orders found.`;
  }catch(error){
    status.innerHTML = `${badge('Load Failed')} ${error.message}`;
  }
}

function renderKitchenOrders(orders){
  const groups = {
    new: document.getElementById("newOrders"),
    sent: document.getElementById("sentOrders"),
    preparing: document.getElementById("preparingOrders"),
    ready: document.getElementById("readyOrders")
  };

  Object.values(groups).forEach(el => el.innerHTML = "");

  const filter = document.getElementById("kitchenStatusFilter").value;
  const search = document.getElementById("kitchenSearch").value.toLowerCase();

  const filtered = orders.filter(order => {
    const itemText = Array.isArray(order.items)
      ? order.items.map(item => item.name).join(" ")
      : "";

    const searchText = [
      order.orderId,
      order.customer?.name,
      order.delivery?.recipientName,
      order.pickup?.pickupPersonName,
      itemText
    ].join(" ").toLowerCase();

    const matchStatus = !filter || order.kitchenStatus === filter;
    const matchSearch = !search || searchText.includes(search);

    return matchStatus && matchSearch;
  });

  filtered.forEach(order => {
    const status = order.kitchenStatus || "new";
    const target = groups[status] || groups.new;
    target.innerHTML += kitchenCard(order);
  });

  Object.entries(groups).forEach(([key, el]) => {
    if(!el.innerHTML.trim()){
      el.innerHTML = `<p class="muted">No orders.</p>`;
    }
  });
}

function kitchenCard(order){
  const items = Array.isArray(order.items) ? order.items : [];
  const itemsHtml = items.length
    ? `<ul>${items.map(item => `<li>${item.name} x${item.qty || 1}</li>`).join("")}</ul>`
    : `<p class="muted">No items.</p>`;

  return `
    <div class="mini-card kitchen-order-card">
      <div class="product-mobile-head">
        <div>
          <h3>${order.orderId || order.id}</h3>
          <p class="muted">${order.customer?.name || ""}</p>
        </div>
        ${badge(order.priority || "Normal")}
      </div>

      <div class="product-mobile-meta">
        ${badge(order.orderType || "")}
        ${badge(order.status || "Created")}
      </div>

      <h4>Items</h4>
      ${itemsHtml}

      ${order.cardMessage ? `
        <p><strong>Card:</strong> ${order.cardMessage}</p>
      ` : ""}

      <div class="product-mobile-actions">
        ${kitchenActionButtons(order)}
      </div>
    </div>
  `;
}

function kitchenActionButtons(order){
  if(order.kitchenStatus === "new"){
    return `<button class="btn primary" onclick="updateKitchen('${order.id}','sent')">Send to Kitchen</button>`;
  }

  if(order.kitchenStatus === "sent"){
    return `<button class="btn primary" onclick="updateKitchen('${order.id}','preparing')">Start Preparing</button>`;
  }

  if(order.kitchenStatus === "preparing"){
    return `<button class="btn primary" onclick="updateKitchen('${order.id}','ready')">Mark Ready</button>`;
  }

  if(order.kitchenStatus === "ready"){
    return `
      <button class="btn small" onclick="openModal('Ready','<p>This order is ready. Delivery/Pickup send flow comes next.</p>')">Ready</button>
    `;
  }

  return "";
}

async function updateKitchen(orderId, kitchenStatus){
  try{
    await window.FIB.updateKitchenStatus(orderId, kitchenStatus);
    await loadKitchenOrders();
  }catch(error){
    openModal("Kitchen Update Failed", `<p>${error.message}</p>`);
  }
}

function applyKitchenFilters(){
  renderKitchenOrders(allKitchenOrders);
}

document.getElementById("kitchenSearch").addEventListener("input", applyKitchenFilters);
document.getElementById("kitchenStatusFilter").addEventListener("change", applyKitchenFilters);

loadKitchenOrders();
