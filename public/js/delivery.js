shell(`
  <div class="delivery-tabs">
    <button class="delivery-tab active" onclick="setDeliveryTab('waiting_rider')">Waiting for Rider</button>
    <button class="delivery-tab" onclick="setDeliveryTab('out_for_delivery')">Out for Delivery</button>
    <button class="delivery-tab" onclick="setDeliveryTab('delivered')">Delivered History</button>
  </div>

  <div class="toolbar">
    <input id="deliverySearch" placeholder="Search delivery order, customer, recipient, address">
    <select id="riderFilter">
      <option value="">All Riders</option>
      <option>Unassigned</option>
      <option>Rider 1</option>
      <option>Rider 2</option>
    </select>
    <button class="btn" onclick="loadDeliveryOrders()">Refresh</button>
  </div>

  <div class="card">
    <h3>Delivery Orders from Firestore</h3>
    <p class="muted">Delivery orders are loaded from Firebase Firestore.</p>

    <div id="deliveryStatusText" class="muted" style="margin:12px 0">
      Loading delivery orders...
    </div>

    <div class="table-wrap delivery-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Created</th>
            <th>Delivery Date</th>
            <th>Source</th>
            <th>Customer</th>
            <th>Recipient</th>
            <th>Address</th>
            <th>Type</th>
            <th>Items</th>
            <th>Card</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Rider</th>
            <th>Status</th>
            <th>Timer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="deliveryTableBody">
          <tr><td colspan="16">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  </div>
`);

let allDeliveryOrders = [];
let activeDeliveryTab = "waiting_rider";

async function loadDeliveryOrders(){
  const status = document.getElementById("deliveryStatusText");
  const body = document.getElementById("deliveryTableBody");

  try{
    if(!window.FIB_FIREBASE_READY || !window.FIB.getDeliveryOrders){
      throw new Error(window.FIB_FIREBASE_ERROR || "Delivery service is not ready.");
    }

    status.innerHTML = "Reading delivery orders from Firestore...";
    allDeliveryOrders = await window.FIB.getDeliveryOrders();

    renderDeliveryOrders();
    status.innerHTML = `${badge("Firestore Loaded")} ${allDeliveryOrders.length} delivery orders found.`;
  }catch(error){
    status.innerHTML = `${badge("Load Failed")} ${error.message}`;
    body.innerHTML = `<tr><td colspan="16">${error.message}</td></tr>`;
  }
}

function setDeliveryTab(status){
  activeDeliveryTab = status;

  document.querySelectorAll(".delivery-tab").forEach(btn => {
    const label = btn.textContent.toLowerCase();

    btn.classList.toggle(
      "active",
      (status === "waiting_rider" && label.includes("waiting")) ||
      (status === "out_for_delivery" && label.includes("out")) ||
      (status === "delivered" && label.includes("delivered"))
    );
  });

  renderDeliveryOrders();
}

function formatDateTime(value){
  try{
    if(value && value.toDate){
      return value.toDate().toLocaleString();
    }
  }catch(e){}

  return value || "";
}

function statusLabel(order){
  const s = String(order.deliveryStatus || "").toLowerCase();

  if(s === "waiting_rider") return "Waiting for Rider";
  if(s === "out_for_delivery") return "Out for Delivery";
  if(s === "delivered") return "Delivered";

  return order.status || "Waiting for Rider";
}


function getDeliveryTimer(order){
  if(String(order.deliveryStatus || "").toLowerCase() !== "out_for_delivery"){
    return "00:00:00";
  }

  let startedAt = null;

  try{
    if(order.deliveryStartedAt?.toDate){
      startedAt = order.deliveryStartedAt.toDate();
    }else if(order.deliveryStartedAt){
      startedAt = new Date(order.deliveryStartedAt);
    }
  }catch(e){}

  if(!startedAt || isNaN(startedAt.getTime())){
    return "00:00:00";
  }

  const diff = Math.max(0, Date.now() - startedAt.getTime());
  const totalSeconds = Math.floor(diff / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function renderDeliveryOrders(){
  const body = document.getElementById("deliveryTableBody");
  const search = document.getElementById("deliverySearch").value.toLowerCase();
  const rider = document.getElementById("riderFilter").value;

  let orders = allDeliveryOrders.filter(order => {
    const status = String(order.deliveryStatus || "").toLowerCase();
    return status === activeDeliveryTab;
  });

  orders = orders.filter(order => {
    const searchText = [
      order.orderId,
      order.customer?.name,
      order.customer?.contact,
      order.delivery?.recipientName,
      order.delivery?.recipientContact,
      order.delivery?.deliveryAddress,
      order.delivery?.cityArea,
      order.rider?.name,
      order.status
    ].join(" ").toLowerCase();

    const matchSearch = !search || searchText.includes(search);
    const riderName = order.rider?.name || "Unassigned";
    const matchRider = !rider || riderName === rider;

    return matchSearch && matchRider;
  });

  if(!orders.length){
    body.innerHTML = `<tr><td colspan="16">No delivery orders in this section.</td></tr>`;
    return;
  }

  body.innerHTML = orders.map(order => `
    <tr>
      <td>
        <strong>${order.orderId || order.id}</strong><br>
        ${badge(order.priority || "Normal")}
      </td>

      <td>${formatDateTime(order.createdAt)}</td>

      <td>
        ${order.delivery?.deliveryDate || ""}<br>
        <small>${order.delivery?.deliveryTime || ""}</small>
      </td>

      <td>${order.orderSource || ""}</td>

      <td>
        <strong>${order.customer?.name || ""}</strong><br>
        <small>${order.customer?.contact || ""}</small>
      </td>

      <td>
        <strong>${order.delivery?.recipientName || ""}</strong><br>
        <small>${order.delivery?.recipientContact || ""}</small>
      </td>

      <td>
        <button class="btn small" onclick="showDeliveryAddress('${order.id}')">Preview</button>
      </td>

      <td>${order.delivery?.deliveryType || ""}</td>

      <td>
        <button class="icon-btn" onclick="showDeliveryItems('${order.id}')">🧺</button>
      </td>

      <td>
        <button class="icon-btn" onclick="showDeliveryCard('${order.id}')">💌</button>
      </td>

      <td><strong>${money(order.total || 0)}</strong></td>

      <td>
        ${order.payment?.method || ""}<br>
        ${badge(order.payment?.status || "")}
      </td>

      <td>${order.rider?.name || "Unassigned"}</td>

      <td>${badge(statusLabel(order))}</td>

      <td>${getDeliveryTimer(order)}</td>

      <td>${deliveryActions(order)}</td>
    </tr>
  `).join("");
}

function deliveryActions(order){
  const status = String(order.deliveryStatus || "").toLowerCase();

  if(status === "waiting_rider"){
    return `<button class="btn small primary" onclick="openAssignRider('${order.id}')">Assign Rider</button>`;
  }

  if(status === "out_for_delivery"){
    return `<button class="btn small primary" onclick="markDelivered('${order.id}')">Mark Delivered</button>`;
  }

  return `<button class="btn small" onclick="showDeliveryOrder('${order.id}')">View</button>`;
}

function findDeliveryOrder(orderId){
  return allDeliveryOrders.find(order => order.id === orderId || order.orderId === orderId);
}

function showDeliveryAddress(orderId){
  const order = findDeliveryOrder(orderId);
  if(!order) return;

  const address = `${order.delivery?.deliveryAddress || ""} ${order.delivery?.cityArea || ""}`;
  const landmark = order.delivery?.landmark || "";

  openModal(
    "Delivery Address",
    `
      <p>${address}</p>
      <p><strong>Landmark:</strong> ${landmark || "None"}</p>
    `,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showDeliveryItems(orderId){
  const order = findDeliveryOrder(orderId);
  if(!order) return;

  const items = Array.isArray(order.items) ? order.items : [];

  openModal(
    `${order.orderId || order.id} Items`,
    items.length
      ? `<ul>${items.map(item => `<li>${item.name} x${item.qty || 1} — ${money(item.subtotal || item.price || 0)}</li>`).join("")}</ul>`
      : `<p class="muted">No items.</p>`,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showDeliveryCard(orderId){
  const order = findDeliveryOrder(orderId);
  if(!order) return;

  openModal(
    "Card Message",
    `<p>${order.cardMessage || "No card message."}</p>`,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showDeliveryOrder(orderId){
  const order = findDeliveryOrder(orderId);
  if(!order) return;

  openModal(
    order.orderId || order.id,
    `
      <p><strong>Status:</strong> ${statusLabel(order)}</p>
      <p><strong>Customer:</strong> ${order.customer?.name || ""}</p>
      <p><strong>Recipient:</strong> ${order.delivery?.recipientName || ""}</p>
      <p><strong>Total:</strong> ${money(order.total || 0)}</p>
    `,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function openAssignRider(orderId){
  openModal(
    "Assign Rider",
    `
      <label>
        Rider Name
        <input id="assignRiderName" placeholder="Enter rider name, Grab, or Lalamove">
      </label>
    `,
    `<button class="btn primary" onclick="assignRider('${orderId}')">Assign & Start</button>
     <button class="btn" onclick="closeModal()">Cancel</button>`
  );

  setTimeout(() => {
    document.getElementById("assignRiderName")?.focus();
  }, 100);
}

async function assignRider(orderId){
  try{
    const riderName = document.getElementById("assignRiderName")?.value?.trim();

    if(!riderName){
      alert("Please enter rider name.");
      return;
    }

    await window.FIB.assignDeliveryRider(orderId, riderName);

    closeModal();
    await loadDeliveryOrders();

let deliveryTimerInterval = setInterval(() => {
  if(activeDeliveryTab === "out_for_delivery" && allDeliveryOrders.length){
    renderDeliveryOrders();
  }
}, 1000);
    setDeliveryTab("out_for_delivery");
  }catch(error){
    openModal("Assign Failed", `<p>${error.message}</p>`);
  }
}

async function markDelivered(orderId){
  try{
    await window.FIB.markOrderDelivered(orderId);
    await loadDeliveryOrders();

let deliveryTimerInterval = setInterval(() => {
  if(activeDeliveryTab === "out_for_delivery" && allDeliveryOrders.length){
    renderDeliveryOrders();
  }
}, 1000);
    setDeliveryTab("delivered");
  }catch(error){
    openModal("Delivery Failed", `<p>${error.message}</p>`);
  }
}

document.getElementById("deliverySearch").addEventListener("input", renderDeliveryOrders);
document.getElementById("riderFilter").addEventListener("change", renderDeliveryOrders);

loadDeliveryOrders();

let deliveryTimerInterval = setInterval(() => {
  if(activeDeliveryTab === "out_for_delivery" && allDeliveryOrders.length){
    renderDeliveryOrders();
  }
}, 1000);
