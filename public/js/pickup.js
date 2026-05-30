shell(`
  <div class="pickup-tabs">
    <button class="pickup-tab active" onclick="setPickupTab('waiting_pickup')">Waiting Pickup</button>
    <button class="pickup-tab" onclick="setPickupTab('picked_up')">Picked Up History</button>
  </div>

  <div class="toolbar">
    <input id="pickupSearch" placeholder="Search pickup order, customer, contact">
    <select id="pickupStatusFilter">
      <option value="">All Status</option>
      <option value="waiting_pickup">Waiting Pickup</option>
      <option value="picked_up">Picked Up</option>
    </select>
    <button class="btn" onclick="loadPickupOrders()">Refresh</button>
  </div>

  <div class="card">
    <h3>Pickup Orders from Firestore</h3>
    <p class="muted">Pickup orders are loaded from Firebase Firestore.</p>

    <div id="pickupStatusText" class="muted" style="margin:12px 0">
      Loading pickup orders...
    </div>

    <div class="table-wrap pickup-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Created</th>
            <th>Pickup Date</th>
            <th>Source</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Item Notes</th>
            <th>Card</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="pickupTableBody">
          <tr><td colspan="12">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  </div>
`);

let allPickupOrders = [];
let activePickupTab = "waiting_pickup";

async function loadPickupOrders(){
  const status = document.getElementById("pickupStatusText");
  const body = document.getElementById("pickupTableBody");

  try{
    if(!window.FIB_FIREBASE_READY || !window.FIB.getPickupOrders){
      throw new Error(window.FIB_FIREBASE_ERROR || "Pickup service is not ready.");
    }

    status.innerHTML = "Reading pickup orders from Firestore...";
    allPickupOrders = await window.FIB.getPickupOrders();

    renderPickupOrders();
    status.innerHTML = `${badge('Firestore Loaded')} ${allPickupOrders.length} pickup orders found.`;
  }catch(error){
    status.innerHTML = `${badge('Load Failed')} ${error.message}`;
    body.innerHTML = `<tr><td colspan="12">${error.message}</td></tr>`;
  }
}

function setPickupTab(status){
  activePickupTab = status;

  document.querySelectorAll(".pickup-tab").forEach(btn => {
    const label = btn.textContent.toLowerCase();
    btn.classList.toggle(
      "active",
      (status === "waiting_pickup" && label.includes("waiting")) ||
      (status === "picked_up" && label.includes("picked"))
    );
  });

  renderPickupOrders();
}

function formatDateTime(value){
  try{
    if(value && value.toDate){
      return value.toDate().toLocaleString();
    }
  }catch(e){}
  return value || "";
}

function renderPickupOrders(){
  const body = document.getElementById("pickupTableBody");
  const search = document.getElementById("pickupSearch").value.toLowerCase();
  const statusFilter = document.getElementById("pickupStatusFilter").value;

  let orders = allPickupOrders.filter(order => order.pickupStatus === activePickupTab);

  orders = orders.filter(order => {
    const searchText = [
      order.orderId,
      order.customer?.name,
      order.customer?.contact,
      order.orderSource,
      order.status
    ].join(" ").toLowerCase();

    const matchSearch = !search || searchText.includes(search);
    const matchStatus = !statusFilter || order.pickupStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  if(!orders.length){
    body.innerHTML = `<tr><td colspan="12">No pickup orders in this section.</td></tr>`;
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
        ${order.pickup?.pickupDate || ""}<br>
        <small>${order.pickup?.pickupTime || ""}</small>
      </td>

      <td>${order.orderSource || ""}</td>

      <td>
        <strong>${order.customer?.name || ""}</strong><br>
        <small>${order.customer?.contact || ""}</small>
      </td>

      <td>
        <button class="icon-btn" onclick="showPickupItems('${order.id}')">🧺</button>
      </td>

      <td>
        <button class="icon-btn" onclick="showPickupItemNotes('${order.id}')">📝</button>
      </td>

      <td>
        <button class="icon-btn" onclick="showPickupCard('${order.id}')">💌</button>
      </td>

      <td><strong>${money(order.total || 0)}</strong></td>

      <td>
        ${order.payment?.method || ""}<br>
        ${badge(order.payment?.status || "")}
      </td>

      <td>${badge(order.status || "Waiting Pickup")}</td>

      <td>${pickupActions(order)}</td>
    </tr>
  `).join("");
}

function pickupActions(order){
  if(order.pickupStatus === "waiting_pickup"){
    return `<button class="btn small primary" onclick="markPickedUp('${order.id}')">Mark Picked Up</button>`;
  }

  return `<button class="btn small" onclick="showPickupOrder('${order.id}')">View</button>`;
}

function findPickupOrder(orderId){
  return allPickupOrders.find(order => order.id === orderId || order.orderId === orderId);
}

function showPickupItems(orderId){
  const order = findPickupOrder(orderId);
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

function showPickupItemNotes(orderId){
  const order = findPickupOrder(orderId);
  if(!order) return;

  openModal(
    "Item Notes for Kitchen",
    `<p>${order.itemNotes || "No item notes."}</p>`,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showPickupCard(orderId){
  const order = findPickupOrder(orderId);
  if(!order) return;

  openModal(
    "Card Message",
    `<p>${order.cardMessage || "No card message."}</p>`,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showPickupOrder(orderId){
  const order = findPickupOrder(orderId);
  if(!order) return;

  openModal(
    order.orderId || order.id,
    `
      <p><strong>Status:</strong> ${order.status || ""}</p>
      <p><strong>Customer:</strong> ${order.customer?.name || ""}</p>
      <p><strong>Contact:</strong> ${order.customer?.contact || ""}</p>
      <p><strong>Pickup Date:</strong> ${order.pickup?.pickupDate || ""}</p>
      <p><strong>Pickup Time:</strong> ${order.pickup?.pickupTime || ""}</p>
      <p><strong>Total:</strong> ${money(order.total || 0)}</p>
    `,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

async function markPickedUp(orderId){
  try{
    await window.FIB.markOrderPickedUp(orderId);
    await loadPickupOrders();
    setPickupTab("picked_up");
  }catch(error){
    openModal("Pickup Failed", `<p>${error.message}</p>`);
  }
}

document.getElementById("pickupSearch").addEventListener("input", renderPickupOrders);
document.getElementById("pickupStatusFilter").addEventListener("change", renderPickupOrders);

loadPickupOrders();
