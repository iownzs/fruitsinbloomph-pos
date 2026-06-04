shell(`
  <div class="toolbar stock-movements-toolbar stock-movement-filter-panel">
    <input id="movementSearch" class="movement-search-filter" placeholder="Search">

    <button class="btn movement-reset-filter" onclick="resetMovementFilters()">Reset Filters</button>

    <label class="movement-filter-box movement-stock-type-box">
      <span class="movement-filter-label">Stock Type</span>
      <select id="stockTypeFilter" class="movement-stock-type-filter">
        <option value="">All Stock Types</option>
        <option>Ingredient Stock</option>
        <option>Product Stock</option>
      </select>
    </label>

    <label class="movement-filter-box movement-type-box">
      <span class="movement-filter-label">Movement Type</span>
      <select id="movementTypeFilter" class="movement-type-filter">
        <option value="">All Movement Types</option>
        <option>Stock In</option>
        <option>Stock Out</option>
        <option>Adjustment</option>
        <option>Ingredient Deduction</option>
        <option>Damaged</option>
        <option>Expired</option>
        <option>Returned</option>
        <option>Transfer</option>
      </select>
    </label>

    <select id="categoryFilter" class="movement-category-filter">
      <option value="">All Categories</option>
      <option>Fruits</option>
      <option>Dairy</option>
      <option>Dry Goods</option>
      <option>Sweeteners</option>
      <option>Toppings</option>
      <option>Packaging</option>
      <option>Others</option>
    </select>

    <label class="movement-filter-box movement-date-from-box">
      <span class="movement-filter-label">Date From</span>
      <input id="dateFromFilter" class="movement-date-from-filter" type="text" placeholder="Pick a Date" aria-label="Date from" onclick="openMovementDatePicker(this)" onfocus="openMovementDatePicker(this)" onblur="closeMovementDatePicker(this)">
    </label>

    <label class="movement-filter-box movement-date-to-box">
      <span class="movement-filter-label">Date To</span>
      <input id="dateToFilter" class="movement-date-to-filter" type="text" placeholder="Pick a Date" aria-label="Date to" onclick="openMovementDatePicker(this)" onfocus="openMovementDatePicker(this)" onblur="closeMovementDatePicker(this)">
    </label>
  </div>

  <div class="card">
    <h3>Stock Movements</h3>
    <p class="muted">Audit trail for Product Stocks and Ingredient Stocks.</p>

    <div id="stockMovementsStatus" class="muted" style="margin:12px 0">
      Loading stock movements...
    </div>

    <div class="stock-movements-desktop-table table-wrap">
      <table>
        <thead>
          <tr>
            <th>Movement ID / Date</th>
            <th>Stock Type</th>
            <th>Item</th>
            <th>Category</th>
            <th>Movement Type</th>
            <th>Quantity</th>
            <th>Previous</th>
            <th>New</th>
            <th>Reason</th>
            <th>Performed By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="stockMovementsTableBody">
          <tr><td colspan="11">Loading...</td></tr>
        </tbody>
      </table>
    </div>

    <div id="stockMovementsMobileCards" class="stock-movements-mobile-cards">
      Loading...
    </div>
  </div>
`);

let allStockMovements = [];

function movementDate(value){
  const date = movementDateValue(value);

  if(!date) return "No date";

  try{
    return date.toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }catch(error){
    return "No date";
  }
}

function safeText(value, fallback = ""){
  return value === undefined || value === null || value === "" ? fallback : value;
}

function movementDateValue(value){
  if(!value) return null;

  try{
    return value.toDate ? value.toDate() : new Date(value);
  }catch(error){
    return null;
  }
}

function movementCategory(movement){
  return movement.category || movement.itemCategory || movement.productCategory || movement.ingredientCategory || "";
}

function movementBadge(type){
  const label = type || "Movement";
  const key = String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return `<span class="movement-pill movement-${key}">${label}</span>`;
}

async function loadStockMovements(){
  const status = document.getElementById("stockMovementsStatus");
  const body = document.getElementById("stockMovementsTableBody");
  const cards = document.getElementById("stockMovementsMobileCards");

  try{
    if(!window.FIB_FIREBASE_READY){
      throw new Error(window.FIB_FIREBASE_ERROR || "Firebase is not ready.");
    }

    if(!window.FIB.getStockMovements){
      throw new Error("Stock movements service is not ready.");
    }

    status.innerHTML = "Reading stock movements from Firestore...";
    allStockMovements = await window.FIB.getStockMovements();

    renderStockMovements(allStockMovements);
    status.innerHTML = `${badge("Firestore Loaded")} ${allStockMovements.length} stock movements found.`;
  }catch(error){
    status.innerHTML = `${badge("Load Failed")} ${error.message}`;
    body.innerHTML = `<tr><td colspan="11">${error.message}</td></tr>`;
    cards.innerHTML = `<div class="mini-card">${error.message}</div>`;
  }
}

function renderStockMovements(movements){
  const isMobileView = window.matchMedia("(max-width: 700px)").matches;
  const tableBody = document.getElementById("stockMovementsTableBody");
  const mobileCards = document.getElementById("stockMovementsMobileCards");

  if(isMobileView){
    if(tableBody) tableBody.innerHTML = "";
    renderStockMovementsCards(movements);
    return;
  }

  if(mobileCards) mobileCards.innerHTML = "";
  renderStockMovementsTable(movements);
}

function renderStockMovementsTable(movements){
  const body = document.getElementById("stockMovementsTableBody");

  if(!movements.length){
    body.innerHTML = `<tr><td colspan="11">No stock movements found.</td></tr>`;
    return;
  }

  body.innerHTML = movements.map(movement => `
    <tr>
      <td>
        <strong>${safeText(movement.id || movement.movementId, "Movement")}</strong>
        <br>
        <small>${movementDate(movement.createdAt)}</small>
      </td>
      <td>${badge(safeText(movement.stockType, "Stock"))}</td>
      <td>
        <strong>${safeText(movement.itemName, "No item")}</strong>
        <br>
        <small>${safeText(movement.itemId || movement.referenceId, "")}</small>
        ${movement.linkedOrderId || movement.orderId ? `<br><small>Order: ${safeText(movement.linkedOrderId || movement.orderId, "")}</small>` : ""}
      </td>
      <td>${badge(safeText(movementCategory(movement), "No Category"))}</td>
      <td>${movementBadge(movement.movementType)}</td>
      <td><strong>${safeText(movement.quantity, 0)}</strong> ${safeText(movement.unit, "")}</td>
      <td>${safeText(movement.previousStock, 0)}</td>
      <td>${safeText(movement.newStock, 0)}</td>
      <td>${safeText(movement.reason, "")}</td>
      <td>
        <strong>${safeText(movement.performedBy, "System")}</strong>
        <br>
        <small>${safeText(movement.performedByRole, "")}</small>
      </td>
      <td>
        <button class="btn small" onclick="showStockMovement('${movement.id}')">View</button>
      </td>
    </tr>
  `).join("");
}

function renderStockMovementsCards(movements){
  const cards = document.getElementById("stockMovementsMobileCards");

  if(!movements.length){
    cards.innerHTML = `<div class="mini-card">No stock movements found.</div>`;
    return;
  }

  cards.innerHTML = movements.map(movement => `
    <div class="mini-card stock-movement-mobile-card">
      <div class="product-mobile-head">
        <div>
          <h3>${safeText(movement.itemName, "Stock Movement")}</h3>
          <p class="muted">${movementDate(movement.createdAt)}</p>
        </div>
        ${movementBadge(movement.movementType)}
      </div>

      <div class="product-mobile-meta">
        ${badge(safeText(movement.stockType, "Stock"))}
        ${badge(safeText(movementCategory(movement), "No Category"))}
        ${badge(safeText(movement.unit, ""))}
        ${badge(safeText(movement.performedBy, "System"))}
        ${movement.linkedOrderId || movement.orderId ? badge("Order " + safeText(movement.linkedOrderId || movement.orderId, "")) : ""}
      </div>

      <div class="stock-grid">
        <div><span>Quantity</span><strong>${safeText(movement.quantity, 0)}</strong></div>
        <div><span>Previous</span><strong>${safeText(movement.previousStock, 0)}</strong></div>
        <div><span>New</span><strong>${safeText(movement.newStock, 0)}</strong></div>
        <div><span>Reason</span><strong>${safeText(movement.reason, "-")}</strong></div>
      </div>

      <div class="product-mobile-actions">
        <button class="btn small" onclick="showStockMovement('${movement.id}')">View Movement</button>
      </div>
    </div>
  `).join("");
}

function showStockMovement(movementId){
  const movement = allStockMovements.find(item => item.id === movementId);

  if(!movement){
    openModal("Movement Not Found", "<p>Stock movement was not found.</p>");
    return;
  }

  openModal(
    "Stock Movement Details",
    `
      <p><strong>Movement ID:</strong> ${safeText(movement.id || movement.movementId, "")}</p>
      <p><strong>Date / Time:</strong> ${movementDate(movement.createdAt)}</p>
      <p><strong>Stock Type:</strong> ${safeText(movement.stockType, "")}</p>
      <p><strong>Item:</strong> ${safeText(movement.itemName, "")}</p>
      <p><strong>Item ID:</strong> ${safeText(movement.itemId || movement.referenceId, "")}</p>
      <p><strong>Category:</strong> ${safeText(movementCategory(movement), "")}</p>
      <p><strong>Movement Type:</strong> ${safeText(movement.movementType, "")}</p>
      <p><strong>Linked Order ID:</strong> ${safeText(movement.linkedOrderId || movement.orderId, "—")}</p>
      <p><strong>Reference ID:</strong> ${safeText(movement.referenceId, "—")}</p>
      <p><strong>Quantity:</strong> ${safeText(movement.quantity, 0)} ${safeText(movement.unit, "")}</p>
      <p><strong>Previous Stock:</strong> ${safeText(movement.previousStock, 0)}</p>
      <p><strong>New Stock:</strong> ${safeText(movement.newStock, 0)}</p>
      <p><strong>Reason:</strong> ${safeText(movement.reason, "")}</p>
      <p><strong>Notes:</strong> ${safeText(movement.notes, "")}</p>
      <p><strong>Performed By:</strong> ${safeText(movement.performedBy, "System")} ${movement.performedByRole ? "(" + movement.performedByRole + ")" : ""}</p>
    `,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}


function openMovementDatePicker(input){
  if(!input) return;

  input.type = "date";

  setTimeout(() => {
    try{
      if(input.showPicker){
        input.showPicker();
      }
    }catch(error){
      // Some mobile browsers block showPicker unless triggered by direct tap.
    }
  }, 0);
}

function closeMovementDatePicker(input){
  if(!input) return;

  if(!input.value){
    input.type = "text";
  }
}

function applyMovementFilters(){
  const search = document.getElementById("movementSearch").value.toLowerCase();
  const stockType = document.getElementById("stockTypeFilter").value;
  const movementType = document.getElementById("movementTypeFilter").value;
  const category = document.getElementById("categoryFilter").value;
  const dateFrom = document.getElementById("dateFromFilter").value;
  const dateTo = document.getElementById("dateToFilter").value;

  const fromDate = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
  const toDate = dateTo ? new Date(dateTo + "T23:59:59") : null;

  const filtered = allStockMovements.filter(movement => {
    const movementDateObj = movementDateValue(movement.createdAt);

    const searchText = [
      movement.id,
      movement.movementId,
      movement.referenceId,
      movement.itemId,
      movement.itemName,
      movement.stockType,
      movement.movementType,
      movementCategory(movement),
      movement.reason,
      movement.notes,
      movement.performedBy,
      movement.performedByRole
    ].join(" ").toLowerCase();

    const matchSearch = !search || searchText.includes(search);
    const matchStockType = !stockType || movement.stockType === stockType;
    const matchMovementType = !movementType || movement.movementType === movementType;
    const matchCategory = !category || movementCategory(movement) === category;
    const matchDateFrom = !fromDate || (movementDateObj && movementDateObj >= fromDate);
    const matchDateTo = !toDate || (movementDateObj && movementDateObj <= toDate);

    return matchSearch
      && matchStockType
      && matchMovementType
      && matchCategory
      && matchDateFrom
      && matchDateTo;
  });

  renderStockMovements(filtered);
}

let movementResetFrame = null;

function resetMovementFilters(){
  document.getElementById("movementSearch").value = "";
  document.getElementById("stockTypeFilter").value = "";
  document.getElementById("movementTypeFilter").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("dateFromFilter").value = "";
  document.getElementById("dateToFilter").value = "";

  if(movementResetFrame){
    cancelAnimationFrame(movementResetFrame);
  }

  movementResetFrame = requestAnimationFrame(() => {
    renderStockMovements(allStockMovements);
    movementResetFrame = null;
  });
}

document.getElementById("movementSearch").addEventListener("input", applyMovementFilters);
document.getElementById("stockTypeFilter").addEventListener("change", applyMovementFilters);
document.getElementById("movementTypeFilter").addEventListener("change", applyMovementFilters);
document.getElementById("categoryFilter").addEventListener("change", applyMovementFilters);
document.getElementById("dateFromFilter").addEventListener("change", applyMovementFilters);
document.getElementById("dateToFilter").addEventListener("change", applyMovementFilters);

let movementResizeTimer = null;

window.addEventListener("resize", () => {
  clearTimeout(movementResizeTimer);
  movementResizeTimer = setTimeout(() => {
    applyMovementFilters();
  }, 120);
});


window.openMovementDatePicker = openMovementDatePicker;
window.closeMovementDatePicker = closeMovementDatePicker;

window.showStockMovement = showStockMovement;
window.resetMovementFilters = resetMovementFilters;

loadStockMovements();
