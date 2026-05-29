shell(`
  <div class="toolbar">
    <input id="productSearch" placeholder="Search product, SKU, category">
    <select id="categoryFilter">
      <option value="">All Categories</option>
      <option>Mother's Day</option>
      <option>Father's Day</option>
      <option>VDAY Collection</option>
      <option>FIB Pantry</option>
    </select>
    <select id="statusFilter">
      <option value="">All Status</option>
      <option>Active</option>
      <option>Inactive</option>
    </select>
    <button class="btn primary">Add Product</button>
  </div>

  <div class="card">
    <h3>Products from Firestore</h3>
    <p class="muted">Products are now loaded from Firebase Firestore.</p>

    <div id="productsStatus" class="muted" style="margin:12px 0">
      Loading products...
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Details</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Unit</th>
            <th>Recipe</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="productsTableBody">
          <tr>
            <td colspan="9">Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`);

let allProducts = [];

async function loadProducts(){
  const status = document.getElementById("productsStatus");
  const body = document.getElementById("productsTableBody");

  try{
    if(!window.FIB_FIREBASE_READY){
      throw new Error(window.FIB_FIREBASE_ERROR || "Firebase is not ready.");
    }

    status.innerHTML = "Reading products from Firestore...";
    allProducts = await window.FIB.getProducts();

    renderProducts(allProducts);

    status.innerHTML = `${badge('Firestore Loaded')} ${allProducts.length} products found.`;
  }catch(error){
    status.innerHTML = `${badge('Load Failed')} ${error.message}`;
    body.innerHTML = `
      <tr>
        <td colspan="9">${error.message}</td>
      </tr>
    `;
  }
}

function renderProducts(products){
  const body = document.getElementById("productsTableBody");

  if(!products.length){
    body.innerHTML = `
      <tr>
        <td colspan="9">No products found. Go to Dashboard and tap Seed Products.</td>
      </tr>
    `;
    return;
  }

  body.innerHTML = products.map(product => {
    const recipeCount = Array.isArray(product.recipe) ? product.recipe.length : 0;

    return `
      <tr>
        <td>
          <strong>${product.name || ''}</strong>
          <br>
          <small>${product.id || ''}</small>
        </td>

        <td>
          <div class="truncate">${product.details || ''}</div>
        </td>

        <td>${badge(product.category || 'No Category')}</td>

        <td><strong>${money(product.price || 0)}</strong></td>

        <td>${product.stock ?? 0}</td>

        <td>${product.unit || ''}</td>

        <td>
          <button class="icon-btn" onclick="showRecipe('${product.id}')">🧾</button>
          <small>${recipeCount} ingredients</small>
        </td>

        <td>${badge(product.status || 'Active')}</td>

        <td>
          <button class="btn small" onclick="showProduct('${product.id}')">View</button>
          <button class="btn small primary">Edit</button>
        </td>
      </tr>
    `;
  }).join('');
}

function showProduct(productId){
  const product = allProducts.find(p => p.id === productId);
  if(!product) return;

  openModal(
    product.name,
    `
      <p><strong>Category:</strong> ${product.category || ''}</p>
      <p><strong>Price:</strong> ${money(product.price || 0)}</p>
      <p><strong>Stock:</strong> ${product.stock ?? 0} ${product.unit || ''}</p>
      <p><strong>Status:</strong> ${product.status || ''}</p>
      <h3>Details</h3>
      <p>${product.details || ''}</p>
    `,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showRecipe(productId){
  const product = allProducts.find(p => p.id === productId);
  if(!product) return;

  const recipe = Array.isArray(product.recipe) ? product.recipe : [];

  openModal(
    `${product.name} Recipe`,
    recipe.length
      ? `<ul>${recipe.map(item => `<li>${item.name} — ${item.qty} ${item.unit}</li>`).join('')}</ul>`
      : `<p class="muted">No recipe ingredients saved.</p>`,
    `<button class="btn" onclick="closeModal()">Close</button>`
  );
}

function applyProductFilters(){
  const search = document.getElementById("productSearch").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const status = document.getElementById("statusFilter").value;

  const filtered = allProducts.filter(product => {
    const searchText = [
      product.name,
      product.category,
      product.details,
      product.id
    ].join(" ").toLowerCase();

    const matchSearch = !search || searchText.includes(search);
    const matchCategory = !category || product.category === category;
    const matchStatus = !status || product.status === status;

    return matchSearch && matchCategory && matchStatus;
  });

  renderProducts(filtered);
}

document.getElementById("productSearch").addEventListener("input", applyProductFilters);
document.getElementById("categoryFilter").addEventListener("change", applyProductFilters);
document.getElementById("statusFilter").addEventListener("change", applyProductFilters);

loadProducts();
