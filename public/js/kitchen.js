shell(`
  <div class="toolbar kitchen-filter-panel">
    <div class="kitchen-filter-top">
      <input id="kitchenSearch" placeholder="Search order, customer, item">
      <button class="btn kitchen-refresh-btn" onclick="loadKitchenOrders()">Refresh</button>
    </div>

    <select id="kitchenStatusFilter" class="kitchen-status-hidden" aria-label="Kitchen status filter">
      <option value="">All Kitchen Status</option>
      <option value="new">Kitchen</option>
      <option value="preparing">Preparing</option>
      <option value="ready">Ready</option>
    </select>

    <div class="kitchen-filter-tabs" role="group" aria-label="Kitchen filter tabs">
      <button type="button" class="chip active" data-kitchen-filter="">All</button>
      <button type="button" class="chip" data-kitchen-filter="new">Kitchen</button>
      <button type="button" class="chip" data-kitchen-filter="preparing">Preparing</button>
      <button type="button" class="chip" data-kitchen-filter="ready">Ready</button>
    </div>
  </div>

  <div class="card">
    <h3>Kitchen Board from Firestore</h3>
    <p class="muted">Orders are loaded from Firebase Firestore.</p>

    <div id="kitchenStatusText" class="muted" style="margin:12px 0">
      Loading kitchen orders...
    </div>

    <div class="kitchen-board">
      <div class="kitchen-column">
        <h3>Kitchen</h3>
        <div id="newOrders" class="kitchen-list"></div>
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


function kitchenStatusLabel(status){
  const labels = {
    new: "Kitchen",
    preparing: "Preparing",
    ready: "Ready"
  };

  return labels[status] || "New Order";
}

function formatKitchenDate(value){
  if(!value) return "";

  try{
    if(value.toDate){
      return value.toDate().toLocaleString();
    }
  }catch(e){}

  return String(value);
}

function getKitchenSchedule(order){
  if(order.orderType === "Delivery"){
    const date = order.delivery?.deliveryDate || "";
    const time = order.delivery?.deliveryTime || "";
    return `${date}${time ? " / " + time : ""}`;
  }

  const date = order.pickup?.pickupDate || "";
  const time = order.pickup?.pickupTime || "";
  return `${date}${time ? " / " + time : ""}`;
}

function getKitchenNotes(order){
  const notes = [];

  if(order.itemNotes) notes.push(order.itemNotes);
  if(order.customer?.notes) notes.push(order.customer.notes);
  if(order.delivery?.deliveryNotes) notes.push(order.delivery.deliveryNotes);
  if(order.notes) notes.push(order.notes);

  return notes.filter(Boolean);
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
        ${badge(kitchenStatusLabel(order.kitchenStatus || "new"))}
      </div>

      <div class="kitchen-info-grid">
        <div>
          <span>Order Created</span>
          <strong>${formatKitchenDate(order.createdAt)}</strong>
        </div>
        <div>
          <span>${order.orderType === "Delivery" ? "Delivery Date" : "Pickup Date"}</span>
          <strong>${getKitchenSchedule(order) || "No schedule"}</strong>
        </div>
      </div>

      <h4>Items</h4>
      ${itemsHtml}

      <h4>Notes</h4>
      ${
        getKitchenNotes(order).length
          ? `<ul>${getKitchenNotes(order).map(note => `<li>${note}</li>`).join("")}</ul>`
          : `<p class="muted">No notes.</p>`
      }

      <div class="product-mobile-actions">
        ${kitchenActionButtons(order)}
      </div>
    </div>
  `;
}

function kitchenActionButtons(order){
  if(order.kitchenStatus === "new"){
    return `<button class="btn primary" onclick="updateKitchen('${order.id}','preparing')">Start Preparing</button>`;
  }

  if(order.kitchenStatus === "preparing"){
    return `<button class="btn primary" onclick="updateKitchen('${order.id}','ready')">Mark Ready</button>`;
  }

  if(order.kitchenStatus === "ready"){
    const sendButton = order.orderType === "Delivery"
      ? `<button class="btn primary" onclick="sendReadyOrder('${order.id}')">Send to Delivery</button>`
      : `<button class="btn primary" onclick="sendReadyOrder('${order.id}')">Send to Pickup</button>`;

    return `
      ${sendButton}
      <button class="btn small" onclick="updateKitchen('${order.id}','preparing')">Re-prep</button>
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

document.querySelectorAll(".kitchen-filter-tabs .chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".kitchen-filter-tabs .chip").forEach(chip => {
      chip.classList.remove("active");
    });

    button.classList.add("active");

    const filter = button.dataset.kitchenFilter || "";
    const select = document.getElementById("kitchenStatusFilter");
    select.value = filter;

    applyKitchenFilters();
  });
});

loadKitchenOrders();


async function sendReadyOrder(orderId){
  try{
    const nextStep = await window.FIB.sendReadyOrderToNextStep(orderId);

    openModal(
      "Order Sent",
      `<p>Order sent to ${nextStep} successfully.</p>`,
      `<button class="btn primary" onclick="location.href='./${nextStep.toLowerCase()}.html'">Open ${nextStep}</button>
       <button class="btn" onclick="closeModal(); loadKitchenOrders();">Stay</button>`
    );

    await loadKitchenOrders();
  }catch(error){
    openModal("Send Failed", `<p>${error.message}</p>`);
  }
}
