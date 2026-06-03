shell(`
  <div class="toolbar">
    <input id="stockSearch" placeholder="Search product or category">
    <select id="stockStatusFilter">
      <option value="">All Stock Status</option>
      <option>In Stock</option>
      <option>Low Stock</option>
      <option>Out of Stock</option>
      <option>Reserved</option>
      <option>Overstock</option>
    </select>
    <select id="unitFilter">
      <option value="">All Units</option>
      <option>pcs</option>
      <option>bottle</option>
      <option>arrangement</option>
    </select>
    <button class="btn primary" onclick="openProductStockMovement(null, 'Stock In')">Stock In</button>
  </div>

  <div class="card">
    <h3>Product Stocks from Firestore</h3>
    <p class="muted">Finished product stock quantities are loaded from Firebase Firestore.</p>

    <div id="productStocksStatus" class="muted" style="margin:12px 0">
      Loading product stocks...
    </div>

    <div class="stocks-desktop-table table-wrap">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Current</th>
            <th>Reserved</th>
            <th>Available</th>
            <th>Unit</th>
            <th>Reorder</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="productStocksTableBody">
          <tr><td colspan="9">Loading...</td></tr>
        </tbody>
      </table>
    </div>

    <div id="productStocksMobileCards" class="stocks-mobile-cards">
      Loading...
    </div>
  </div>
`);

let allProductStocks = [];

async function loadProductStocks(){
  const status = document.getElementById("productStocksStatus");
  const body = document.getElementById("productStocksTableBody");
  const cards = document.getElementById("productStocksMobileCards");

  try{
    if(!window.FIB_FIREBASE_READY){
      throw new Error(window.FIB_FIREBASE_ERROR || "Firebase is not ready.");
    }

    status.innerHTML = "Reading product stocks from Firestore...";
    allProductStocks = await window.FIB.getProductStocks();

    renderProductStocks(allProductStocks);
    status.innerHTML = `${badge('Firestore Loaded')} ${allProductStocks.length} product stocks found.`;
  }catch(error){
    status.innerHTML = `${badge('Load Failed')} ${error.message}`;
    body.innerHTML = `<tr><td colspan="9">${error.message}</td></tr>`;
    cards.innerHTML = `<div class="mini-card">${error.message}</div>`;
  }
}

function renderProductStocks(stocks){
  renderProductStocksTable(stocks);
  renderProductStocksCards(stocks);
}

function renderProductStocksTable(stocks){
  const body = document.getElementById("productStocksTableBody");

  if(!stocks.length){
    body.innerHTML = `<tr><td colspan="9">No product stocks found.</td></tr>`;
    return;
  }

  body.innerHTML = stocks.map(stock => `
    <tr>
      <td>
        <div class="product-name-cell">
          <div class="product-thumb">
            ${stock.imageUrl ? `<img src="${stock.imageUrl}" alt="${stock.productName || 'Product'}">` : `<span>${(stock.productName || '?').slice(0,1)}</span>`}
          </div>
          <div>
            <strong>${stock.productName || ''}</strong>
            <br>
            <small>${stock.productId || stock.id || ''}</small>
          </div>
        </div>
      </td>
      <td>${badge(stock.category || 'No Category')}</td>
      <td><strong>${stock.currentStock ?? 0}</strong></td>
      <td>${stock.reservedStock ?? 0}</td>
      <td>${stock.availableStock ?? 0}</td>
      <td>${stock.unit || ''}</td>
      <td>${stock.reorderLevel ?? 0}</td>
      <td>${badge(stock.stockStatus || 'In Stock')}</td>
      <td>
        <div class="table-actions">
          <button class="btn small primary" onclick="openProductStockMovement('${stock.id}', 'Stock In')">Stock In</button>
          <button class="btn small warning" onclick="openProductStockMovement('${stock.id}', 'Stock Out')">Stock Out</button>
          <button class="btn small" onclick="openProductStockMovement('${stock.id}', 'Adjustment')">Adjust</button>
          <button class="btn small" onclick="showProductStock('${stock.id}')">View</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderProductStocksCards(stocks){
  const cards = document.getElementById("productStocksMobileCards");

  if(!stocks.length){
    cards.innerHTML = `<div class="mini-card">No product stocks found.</div>`;
    return;
  }

  cards.innerHTML = stocks.map(stock => `
    <div class="mini-card stock-mobile-card">
      <div class="product-mobile-head">
        <div class="product-name-cell">
          <div class="product-thumb">
            ${stock.imageUrl ? `<img src="${stock.imageUrl}" alt="${stock.productName || 'Product'}">` : `<span>${(stock.productName || '?').slice(0,1)}</span>`}
          </div>
          <div>
            <h3>${stock.productName || ''}</h3>
            <p class="muted">${stock.productId || stock.id || ''}</p>
          </div>
        </div>
        ${badge(stock.stockStatus || 'In Stock')}
      </div>

      <div class="product-mobile-meta">
        ${badge(stock.category || 'No Category')}
        ${badge(stock.unit || '')}
      </div>

      <div class="stock-grid">
        <div><span>Current</span><strong>${stock.currentStock ?? 0}</strong></div>
        <div><span>Reserved</span><strong>${stock.reservedStock ?? 0}</strong></div>
        <div><span>Available</span><strong>${stock.availableStock ?? 0}</strong></div>
        <div><span>Reorder</span><strong>${stock.reorderLevel ?? 0}</strong></div>
      </div>

      <div class="product-mobile-actions">
        <button class="btn small primary" onclick="openProductStockMovement('${stock.id}', 'Stock In')">Stock In</button>
        <button class="btn small warning" onclick="openProductStockMovement('${stock.id}', 'Stock Out')">Stock Out</button>
        <button class="btn small" onclick="openProductStockMovement('${stock.id}', 'Adjustment')">Adjust</button>
        <button class="btn small" onclick="showProductStock('${stock.id}')">View</button>
      </div>
    </div>
  `).join('');
}

function showProductStock(stockId){
  const stock = allProductStocks.find(s => s.id === stockId);
  if(!stock) return;

  openModal(
    stock.productName || 'Product Stock',
    `
      <p><strong>Category:</strong> ${stock.category || ''}</p>
      <p><strong>Current Stock:</strong> ${stock.currentStock ?? 0}</p>
      <p><strong>Reserved Stock:</strong> ${stock.reservedStock ?? 0}</p>
      <p><strong>Available Stock:</strong> ${stock.availableStock ?? 0}</p>
      <p><strong>Unit:</strong> ${stock.unit || ''}</p>
      <p><strong>Reorder Level:</strong> ${stock.reorderLevel ?? 0}</p>
      <p><strong>Status:</strong> ${stock.stockStatus || ''}</p>
    `,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function applyStockFilters(){
  const search = document.getElementById("stockSearch").value.toLowerCase();
  const stockStatus = document.getElementById("stockStatusFilter").value;
  const unit = document.getElementById("unitFilter").value;

  const filtered = allProductStocks.filter(stock => {
    const searchText = [
      stock.productName,
      stock.productId,
      stock.category,
      stock.unit,
      stock.stockStatus
    ].join(" ").toLowerCase();

    const matchSearch = !search || searchText.includes(search);
    const matchStatus = !stockStatus || stock.stockStatus === stockStatus;
    const matchUnit = !unit || stock.unit === unit;

    return matchSearch && matchStatus && matchUnit;
  });

  renderProductStocks(filtered);
}


function productStockOptions(){
  return allProductStocks.map(stock => `
    <option value="${stock.id || stock.productId}">
      ${stock.productName || stock.id || stock.productId}
    </option>
  `).join("");
}

function openProductStockMovement(stockId, movementType){
  const stock = stockId
    ? allProductStocks.find(item => item.id === stockId || item.productId === stockId)
    : null;

  const title = movementType === "Adjustment"
    ? "Adjust Product Stock"
    : movementType;

  const quantityLabel = movementType === "Adjustment"
    ? "New Stock Quantity"
    : "Quantity";

  openModal(
    title,
    `
      <label>
        Product
        <select id="productMovementProduct" ${stock ? "disabled" : ""}>
          ${stock ? `<option value="${stock.id || stock.productId}">${stock.productName || stock.id}</option>` : productStockOptions()}
        </select>
      </label>

      <label>
        Movement Type
        <input id="productMovementType" value="${movementType}" disabled>
      </label>

      <label>
        ${quantityLabel}
        <input id="productMovementQuantity" type="number" min="0" step="1" placeholder="Enter quantity">
      </label>

      <label>
        Reason
        <select id="productMovementReason">
          <option value="">Select Reason</option>
          <option>New stock received</option>
          <option>Manual correction</option>
          <option>Damaged</option>
          <option>Expired</option>
          <option>Returned</option>
          <option>Transfer</option>
          <option>Other</option>
        </select>
      </label>

      <label>
        Notes
        <textarea id="productMovementNotes" placeholder="Optional notes"></textarea>
      </label>
    `,
    `<button class="btn primary" onclick="saveProductStockMovement()">Save Movement</button>
     <button class="btn" onclick="closeModal()">Cancel</button>`
  );
}

async function saveProductStockMovement(){
  try{
    if(!window.FIB.adjustProductStock){
      throw new Error("Product stock movement service is not ready.");
    }

    const productId = document.getElementById("productMovementProduct").value;
    const movementType = document.getElementById("productMovementType").value;
    const quantity = Number(document.getElementById("productMovementQuantity").value || 0);
    const reason = document.getElementById("productMovementReason").value;
    const notes = document.getElementById("productMovementNotes").value.trim();

    await window.FIB.adjustProductStock({
      productId,
      movementType,
      quantity,
      reason,
      notes,
      performedBy: "Admin",
      performedByRole: "Admin"
    });

    closeModal();
    await loadProductStocks();
  }catch(error){
    openModal("Product Stock Movement Failed", `<p>${error.message}</p>`);
  }
}

window.openProductStockMovement = openProductStockMovement;
window.saveProductStockMovement = saveProductStockMovement;

document.getElementById("stockSearch").addEventListener("input", applyStockFilters);
document.getElementById("stockStatusFilter").addEventListener("change", applyStockFilters);
document.getElementById("unitFilter").addEventListener("change", applyStockFilters);

loadProductStocks();
