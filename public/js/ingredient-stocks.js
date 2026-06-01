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
        <button class="btn small" onclick="showIngredientStock('${stock.id}')">View</button>
        <button class="btn small primary" onclick="openIngredientForm(\'${stock.id}\')">Edit</button>
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
        <button class="btn small" onclick="showIngredientStock('${stock.id}')">View</button>
        <button class="btn small primary" onclick="openIngredientForm(\'${stock.id}\')">Edit</button>
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
