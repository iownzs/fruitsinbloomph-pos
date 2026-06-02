shell(`
  <div class="toolbar">
    <input id="ingredientSearch" placeholder="Search ingredient or category">
    <select id="categoryFilter">
      <option value="">All Categories</option>
      <option>Fruits</option>
      <option>Dairy</option>
      <option>Dry Goods</option>
      <option>Sweeteners</option>
      <option>Toppings</option>
      <option>Packaging</option>
    </select>
    <select id="stockStatusFilter">
      <option value="">All Stock Status</option>
      <option>In Stock</option>
      <option>Low Stock</option>
      <option>Out of Stock</option>
    </select>
    <button class="btn primary" onclick="openIngredientForm()">Add Ingredient</button>
  </div>

  <div class="card">
    <h3>Ingredient Stocks from Firestore</h3>
    <p class="muted">Raw ingredient and material stock quantities are loaded from Firebase Firestore.</p>

    <div id="ingredientStocksStatus" class="muted" style="margin:12px 0">
      Loading ingredient stocks...
    </div>

    <div class="ingredient-stocks-desktop-table table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Category</th>
            <th>Current</th>
            <th>Reserved</th>
            <th>Available</th>
            <th>Unit</th>
            <th>Reorder</th>
            <th>Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="ingredientStocksTableBody">
          <tr><td colspan="10">Loading...</td></tr>
        </tbody>
      </table>
    </div>

    <div id="ingredientStocksMobileCards" class="ingredient-stocks-mobile-cards">
      Loading...
    </div>
  </div>
`);

let allIngredientStocks = [];

async function loadIngredientStocks(){
  const status = document.getElementById("ingredientStocksStatus");
  const body = document.getElementById("ingredientStocksTableBody");
  const cards = document.getElementById("ingredientStocksMobileCards");

  try{
    if(!window.FIB_FIREBASE_READY){
      throw new Error(window.FIB_FIREBASE_ERROR || "Firebase is not ready.");
    }

    status.innerHTML = "Reading ingredient stocks from Firestore...";
    allIngredientStocks = await window.FIB.getIngredientStocks();

    renderIngredientStocks(allIngredientStocks);
    status.innerHTML = `${badge('Firestore Loaded')} ${allIngredientStocks.length} ingredient stocks found.`;
  }catch(error){
    status.innerHTML = `${badge('Load Failed')} ${error.message}`;
    body.innerHTML = `<tr><td colspan="10">${error.message}</td></tr>`;
    cards.innerHTML = `<div class="mini-card">${error.message}</div>`;
  }
}

function renderIngredientStocks(stocks){
  renderIngredientStocksTable(stocks);
  renderIngredientStocksCards(stocks);
}

function renderIngredientStocksTable(stocks){
  const body = document.getElementById("ingredientStocksTableBody");

  if(!stocks.length){
    body.innerHTML = `<tr><td colspan="10">No ingredient stocks found.</td></tr>`;
    return;
  }

  body.innerHTML = stocks.map(stock => `
    <tr>
      <td>
        <strong>${stock.name || ''}</strong>
        <br>
        <small>${stock.id || ''}</small>
      </td>
      <td>${badge(stock.category || 'No Category')}</td>
      <td><strong>${stock.currentStock ?? 0}</strong></td>
      <td>${stock.reservedStock ?? 0}</td>
      <td>${stock.availableStock ?? 0}</td>
      <td>${stock.unit || ''}</td>
      <td>${stock.reorderLevel ?? 0}</td>
      <td>${money(stock.cost || 0)}</td>
      <td>${badge(stock.status || 'In Stock')}</td>
      <td>
        <div class="ingredient-action-group">
          <div class="ingredient-action-row primary-actions">
            <button class="btn small primary" onclick="openIngredientMovement('${stock.id}', 'Stock In')">Stock In</button>
            <button class="btn small warning" onclick="openIngredientMovement('${stock.id}', 'Stock Out')">Stock Out</button>
            <button class="btn small" onclick="openIngredientMovement('${stock.id}', 'Adjustment')">Adjust</button>
          </div>
          <div class="ingredient-action-row secondary-actions">
            <button class="btn small" onclick="showIngredientStock('${stock.id}')">View</button>
            <button class="btn small" onclick="openIngredientForm('${stock.id}')">Edit</button>
          </div>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderIngredientStocksCards(stocks){
  const cards = document.getElementById("ingredientStocksMobileCards");

  if(!stocks.length){
    cards.innerHTML = `<div class="mini-card">No ingredient stocks found.</div>`;
    return;
  }

  cards.innerHTML = stocks.map(stock => `
    <div class="mini-card stock-mobile-card">
      <div class="product-mobile-head">
        <div>
          <h3>${stock.name || ''}</h3>
          <p class="muted">${stock.id || ''}</p>
        </div>
        ${badge(stock.status || 'In Stock')}
      </div>

      <div class="product-mobile-meta">
        ${badge(stock.category || 'No Category')}
        ${badge(stock.unit || '')}
        ${badge('Cost ' + money(stock.cost || 0))}
      </div>

      <div class="stock-grid">
        <div><span>Current</span><strong>${stock.currentStock ?? 0}</strong></div>
        <div><span>Reserved</span><strong>${stock.reservedStock ?? 0}</strong></div>
        <div><span>Available</span><strong>${stock.availableStock ?? 0}</strong></div>
        <div><span>Reorder</span><strong>${stock.reorderLevel ?? 0}</strong></div>
      </div>

      <div class="product-mobile-actions">
        <div class="product-mobile-actions ingredient-mobile-actions">
          <div class="ingredient-action-row primary-actions">
            <button class="btn small primary" onclick="openIngredientMovement('${stock.id}', 'Stock In')">Stock In</button>
            <button class="btn small warning" onclick="openIngredientMovement('${stock.id}', 'Stock Out')">Stock Out</button>
            <button class="btn small" onclick="openIngredientMovement('${stock.id}', 'Adjustment')">Adjust</button>
          </div>
          <div class="ingredient-action-row secondary-actions">
            <button class="btn small" onclick="showIngredientStock('${stock.id}')">View</button>
            <button class="btn small" onclick="openIngredientForm('${stock.id}')">Edit</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function showIngredientStock(stockId){
  const stock = allIngredientStocks.find(s => s.id === stockId);
  if(!stock) return;

  openModal(
    stock.name || 'Ingredient Stock',
    `
      <p><strong>Category:</strong> ${stock.category || ''}</p>
      <p><strong>Current Stock:</strong> ${stock.currentStock ?? 0}</p>
      <p><strong>Reserved Stock:</strong> ${stock.reservedStock ?? 0}</p>
      <p><strong>Available Stock:</strong> ${stock.availableStock ?? 0}</p>
      <p><strong>Unit:</strong> ${stock.unit || ''}</p>
      <p><strong>Reorder Level:</strong> ${stock.reorderLevel ?? 0}</p>
      <p><strong>Cost:</strong> ${money(stock.cost || 0)}</p>
      <p><strong>Status:</strong> ${stock.status || ''}</p>
    `,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function applyIngredientFilters(){
  const search = document.getElementById("ingredientSearch").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const stockStatus = document.getElementById("stockStatusFilter").value;

  const filtered = allIngredientStocks.filter(stock => {
    const searchText = [
      stock.name,
      stock.id,
      stock.category,
      stock.unit,
      stock.status
    ].join(" ").toLowerCase();

    const matchSearch = !search || searchText.includes(search);
    const matchCategory = !category || stock.category === category;
    const matchStatus = !stockStatus || stock.status === stockStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  renderIngredientStocks(filtered);
}

document.getElementById("ingredientSearch").addEventListener("input", applyIngredientFilters);
document.getElementById("categoryFilter").addEventListener("change", applyIngredientFilters);
document.getElementById("stockStatusFilter").addEventListener("change", applyIngredientFilters);

loadIngredientStocks();

/* Ingredient Add/Edit Form */
function openIngredientForm(ingredientId = ""){
  const ingredient = ingredientId
    ? allIngredientStocks.find(item => item.id === ingredientId || item.ingredientId === ingredientId)
    : null;

  openModal(
    ingredient ? "Edit Ingredient" : "Add Ingredient",
    `
      <label>
        Ingredient Name
        <input id="ingredientName" value="${ingredient?.name || ""}" placeholder="Example: Mango">
      </label>

      <label>
        Category
        <select id="ingredientCategory">
          ${["Fruits","Dairy","Dry Goods","Sweeteners","Toppings","Packaging","Others"].map(category => `
            <option value="${category}" ${ingredient?.category === category ? "selected" : ""}>${category}</option>
          `).join("")}
        </select>
      </label>

      <label>
        Unit
        <select id="ingredientUnit">
          ${["pcs","g","kg","ml","L","cup","tbsp","tsp","pack","box","bottle","jar","tray","bag"].map(unit => `
            <option value="${unit}" ${ingredient?.unit === unit ? "selected" : ""}>${unit}</option>
          `).join("")}
        </select>
      </label>

      <label>
        Current Stock
        <input id="ingredientCurrentStock" type="number" value="${ingredient?.currentStock ?? 0}">
      </label>

      <label>
        Reorder Level
        <input id="ingredientReorderLevel" type="number" value="${ingredient?.reorderLevel ?? 0}">
      </label>

      <label>
        Ingredient Cost
        <input id="ingredientCost" type="number" value="${ingredient?.cost ?? 0}">
      </label>
    `,
    `<button class="btn primary" onclick="saveIngredientForm('${ingredient?.id || ingredient?.ingredientId || ""}')">Save Ingredient</button>
     <button class="btn" onclick="closeModal()">Cancel</button>`
  );
}

async function saveIngredientForm(existingId = ""){
  try{
    if(!window.FIB || !window.FIB.saveIngredientStock){
      throw new Error("Ingredient save service is not ready.");
    }

    const ingredient = {
      id: existingId,
      name: document.getElementById("ingredientName").value.trim(),
      category: document.getElementById("ingredientCategory").value,
      unit: document.getElementById("ingredientUnit").value,
      currentStock: Number(document.getElementById("ingredientCurrentStock").value || 0),
      reorderLevel: Number(document.getElementById("ingredientReorderLevel").value || 0),
      cost: Number(document.getElementById("ingredientCost").value || 0)
    };

    if(!ingredient.name){
      alert("Ingredient name is required.");
      return;
    }

    await window.FIB.saveIngredientStock(ingredient);

    closeModal();
    await loadIngredientStocks();
  }catch(error){
    openModal("Save Failed", `<p>${error.message}</p>`);
  }
}

/* Expose for onclick buttons */
window.openIngredientForm = openIngredientForm;
window.saveIngredientForm = saveIngredientForm;

/* Ingredient Stock Movement UI */
function getCurrentPOSUser(){
  try{
    return JSON.parse(sessionStorage.getItem("posUser") || localStorage.getItem("posUser") || "{}");
  }catch(error){
    return {};
  }
}

function openIngredientMovement(ingredientId, movementType){
  const stock = allIngredientStocks.find(item => item.id === ingredientId);

  if(!stock){
    openModal("Ingredient Not Found", "<p>Ingredient stock was not found.</p>");
    return;
  }

  const quantityLabel = movementType === "Adjustment" ? "New Stock Quantity" : "Quantity";

  openModal(
    `${movementType}: ${stock.name || "Ingredient"}`,
    `
      <p class="muted">Current stock: <strong>${stock.currentStock ?? 0} ${stock.unit || ""}</strong></p>

      <label>
        ${quantityLabel}
        <input id="movementQuantity" type="number" min="0" step="0.01" placeholder="Enter quantity">
      </label>

      <label>
        Reason
        <select id="movementReason">
          <option value="">Select reason</option>
          <option value="New stock received">New stock received</option>
          <option value="Manual correction">Manual correction</option>
          <option value="Used in production">Used in production</option>
          <option value="Damaged">Damaged</option>
          <option value="Expired">Expired</option>
          <option value="Returned">Returned</option>
          <option value="Transfer">Transfer</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label>
        Notes
        <textarea id="movementNotes" placeholder="Optional notes"></textarea>
      </label>
    `,
    `
      <button class="btn primary" onclick="saveIngredientMovement('${ingredientId}', '${movementType}')">Save Movement</button>
      <button class="btn" onclick="closeModal()">Cancel</button>
    `
  );
}

async function saveIngredientMovement(ingredientId, movementType){
  try{
    if(!window.FIB || !window.FIB.adjustIngredientStock){
      throw new Error("Stock movement service is not ready.");
    }

    const quantity = Number(document.getElementById("movementQuantity").value || 0);
    const reason = document.getElementById("movementReason").value;
    const notes = document.getElementById("movementNotes").value;
    const user = getCurrentPOSUser();

    const result = await window.FIB.adjustIngredientStock({
      ingredientId,
      movementType,
      quantity,
      reason,
      notes,
      performedBy: user.name || user.username || "Admin",
      performedByRole: user.role || "Admin"
    });

    closeModal();
    await loadIngredientStocks();

    openModal(
      "Stock Movement Saved",
      `
        <p><strong>${movementType}</strong> saved successfully.</p>
        <p>Previous Stock: <strong>${result.previousStock}</strong></p>
        <p>New Stock: <strong>${result.newStock}</strong></p>
        <p>Status: <strong>${result.stockStatus}</strong></p>
        <p class="muted">Movement ID: ${result.movementId}</p>
      `,
      `<button class="btn primary" onclick="closeModal()">Done</button>`
    );
  }catch(error){
    openModal("Movement Failed", `<p>${error.message}</p>`, `<button class="btn" onclick="closeModal()">Close</button>`);
  }
}

window.openIngredientMovement = openIngredientMovement;
window.saveIngredientMovement = saveIngredientMovement;

/* Ingredient Stock Movement UI */
