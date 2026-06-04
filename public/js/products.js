shell(`
  <div class="toolbar products-toolbar products-filter-panel">
    <div class="products-toolbar-row products-toolbar-top">
      <input id="productSearch" class="products-search-filter" placeholder="Search product, SKU, category">
      <button class="btn primary products-add-btn" onclick="openProductForm()">Add Product</button>
    </div>

    <div class="products-toolbar-row products-toolbar-bottom">
      <select id="categoryFilter" class="products-category-filter">
        <option value="">All Categories</option>
        <option>Mother's Day</option>
        <option>Father's Day</option>
        <option>VDAY Collection</option>
        <option>FIB Pantry</option>
      </select>

      <select id="statusFilter" class="products-status-filter">
        <option value="">All Status</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </div>
  </div>

  <div class="card">
    <h3>Products from Firestore</h3>
    <p class="muted">Products are now loaded from Firebase Firestore.</p>

    <div id="productsStatus" class="muted" style="margin:12px 0">
      Loading products...
    </div>

    <div class="products-desktop-table table-wrap">
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

    <div id="productsMobileCards" class="products-mobile-cards">
      Loading...
    </div>
  </div>
`);

let allProducts = [];

/* Cloudinary unsigned upload config */
const CLOUDINARY_CLOUD_NAME = "dzgvkxi71";
const CLOUDINARY_UPLOAD_PRESET = "fib_products_unsigned";

async function loadProducts(){
  const status = document.getElementById("productsStatus");
  const body = document.getElementById("productsTableBody");
  const cards = document.getElementById("productsMobileCards");

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
    body.innerHTML = `<tr><td colspan="9">${error.message}</td></tr>`;
    cards.innerHTML = `<div class="card">${error.message}</div>`;
  }
}

function renderProducts(products){
  renderProductsTable(products);
  renderProductsCards(products);
}

function renderProductsTable(products){
  const body = document.getElementById("productsTableBody");

  if(!products.length){
    body.innerHTML = `<tr><td colspan="9">No products found.</td></tr>`;
    return;
  }

  body.innerHTML = products.map(product => {
    const recipeCount = Array.isArray(product.recipe) ? product.recipe.length : 0;

    return `
      <tr>
        <td>
          <div class="product-name-cell">
            <div class="product-thumb">
              ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name || 'Product'}">` : `<span>${(product.name || '?').slice(0,1)}</span>`}
            </div>
            <div>
              <strong>${product.name || ''}</strong>
              <br>
              <small>${product.id || ''}</small>
            </div>
          </div>
        </td>
        <td><div class="truncate">${product.details || ''}</div></td>
        <td>${badge(product.category || 'No Category')}</td>
        <td><strong>${money(product.price || 0)}</strong></td>
        <td>${product.stock ?? 0}</td>
        <td>${product.unit || ''}</td>
        <td>
          <div class="products-recipe-cell">
            <button class="btn small" onclick="showRecipe('${product.id}')">Recipe</button>
            <small>${recipeCount} ingredient${recipeCount === 1 ? '' : 's'}</small>
          </div>
        </td>
        <td>${badge(product.status || 'Active')}</td>
        <td>
          <div class="products-action-cell">
            <button class="btn small" onclick="showProduct('${product.id}')">View</button>
            <button class="btn small primary" onclick="openProductForm('${product.id}')">Edit</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderProductsCards(products){
  const cards = document.getElementById("productsMobileCards");

  if(!products.length){
    cards.innerHTML = `<div class="mini-card">No products found.</div>`;
    return;
  }

  cards.innerHTML = products.map(product => {
    const recipeCount = Array.isArray(product.recipe) ? product.recipe.length : 0;

    return `
      <div class="mini-card product-mobile-card">
        <div class="product-mobile-head">
          <div class="product-name-cell">
            <div class="product-thumb">
              ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name || 'Product'}">` : `<span>${(product.name || '?').slice(0,1)}</span>`}
            </div>
            <div>
              <h3>${product.name || ''}</h3>
              <p class="muted">${product.id || ''}</p>
            </div>
          </div>
          ${badge(product.status || 'Active')}
        </div>

        <p class="muted">${product.details || ''}</p>

        <div class="product-mobile-meta">
          ${badge(product.category || 'No Category')}
          ${badge(product.unit || '')}
          ${badge('Stock ' + (product.stock ?? 0))}
        </div>

        <div class="product-mobile-price">${money(product.price || 0)}</div>

        <div class="product-mobile-actions">
          <button class="btn small" onclick="showProduct('${product.id}')">View</button>
          <button class="btn small" onclick="showRecipe('${product.id}')">Recipe (${recipeCount})</button>
          <button class="btn small primary" onclick="openProductForm('${product.id}')">Edit</button>
        </div>
      </div>
    `;
  }).join('');
}

function showProduct(productId){
  const product = allProducts.find(p => p.id === productId);
  if(!product) return;

  const recipeCount = Array.isArray(product.recipe) ? product.recipe.length : 0;

  openModal(
    product.name,
    `
      <div class="product-view-full-preview">
        ${product.imageUrl
          ? `<img src="${product.imageUrl}" alt="${product.name || 'Product'}">`
          : `<div class="product-view-full-fallback">${(product.name || '?').slice(0,1)}</div>`
        }
      </div>

      <div class="product-view-summary">
        <h3>${product.name || ''}</h3>
        <p class="muted">${product.id || product.productId || ''}</p>
      </div>

      <div class="product-view-info-grid">
        <div>
          <span>Category</span>
          <strong>${product.category || 'No Category'}</strong>
        </div>
        <div>
          <span>Price</span>
          <strong>${money(product.price || 0)}</strong>
        </div>
        <div>
          <span>Stock</span>
          <strong>${product.stock ?? 0} ${product.unit || ''}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>${product.status || 'Active'}</strong>
        </div>
      </div>

      <h3>Details</h3>
      <p>${product.details || 'No product details saved.'}</p>

      <h3>Recipe Summary</h3>
      <p class="muted">${recipeCount} ingredient${recipeCount === 1 ? '' : 's'} saved.</p>
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

let productRecipeDraft = [];
let productIngredientOptions = [];

function cleanRecipeUnit(unit){
  const value = String(unit || "").trim();

  // Old recipe data sometimes saved quantity number into the unit field.
  // If unit is empty or only numeric, treat it as pcs.
  if(!value || !Number.isNaN(Number(value))){
    return "pcs";
  }

  return value;
}

function normalizeProductRecipe(recipe){
  return Array.isArray(recipe)
    ? recipe.map(item => ({
        ...item,
        qty: Number(item.qty ?? item.quantity ?? item.recipeQty ?? item.amount ?? item.ingredientQty ?? 0),
        unit: cleanRecipeUnit(item.unit || item.ingredientUnit || item.recipeUnit || item.uom)
      }))
    : [];
}


async function openProductForm(productId = ""){
  try{
    const product = productId
      ? allProducts.find(p => p.id === productId || p.productId === productId)
      : null;

    productIngredientOptions = await window.FIB.getIngredientStocks();
    productRecipeDraft = normalizeProductRecipe(product?.recipe);

    openModal(
      product ? "Edit Product" : "Add Product",
      `
        <label>
          Product Name
          <input id="productName" value="${product?.name || ""}" placeholder="Example: Mango Sago">
        </label>

        <label>
          Product Details
          <textarea id="productDetails" placeholder="Short product details">${product?.details || ""}</textarea>
        </label>

        <label>
          Product Image
          <input id="productImageFile" type="file" accept="image/*">
        </label>

        <div class="image-upload-preview">
          <div class="product-thumb product-image-preview">
            ${product?.imageUrl ? `<img id="productImagePreview" src="${product.imageUrl}" alt="${product.name || 'Product'}">` : `<span id="productImagePreviewText">${(product?.name || '?').slice(0,1)}</span>`}
          </div>
          <div>
            <input id="productImageUrl" value="${product?.imageUrl || ""}" placeholder="Cloudinary image URL" readonly>
            <small class="muted">Image will be compressed before upload.</small>
          </div>
        </div>

        <label>
          Category
          <select id="productCategory">
            ${[
              "Mother's Day","Father's Day","VDAY Collection","FIB Pantry","FIB Eats",
              "Chinese New Year","Anniversary","Happy Birthday","Congratulations",
              "I'm Sorry","Grandparent's Day","Get Well Soon","Thank You","Corporate",
              "Baby Shower","Edible Blooms","Christmas","Fruit Platter","Gift Basket","Others"
            ].map(cat => `
              <option value="${cat}" ${product?.category === cat ? "selected" : ""}>${cat}</option>
            `).join("")}
          </select>
        </label>

        <div class="form-grid-2">
          <label>
            Price
            <input id="productPrice" type="number" value="${product?.price ?? 0}">
          </label>

          <label>
            Cost
            <input id="productCost" type="number" value="${product?.cost ?? 0}">
          </label>
        </div>

        <div class="form-grid-2">
          <label>
            Opening / Current Stock
            <input id="productStock" type="number" value="${product?.stock ?? 0}">
          </label>

          <label>
            Unit
            <select id="productUnit">
              ${["pcs","box","pack","tray","cup","bottle","arrangement","jar","platter"].map(unit => `
                <option value="${unit}" ${product?.unit === unit ? "selected" : ""}>${unit}</option>
              `).join("")}
            </select>
          </label>
        </div>

        <label>
          Reorder Level
          <input id="productReorderLevel" type="number" value="${product?.reorderLevel ?? 0}">
        </label>

        <label>
          Status
          <select id="productStatus">
            ${["Active","Inactive"].map(status => `
              <option value="${status}" ${product?.status === status ? "selected" : ""}>${status}</option>
            `).join("")}
          </select>
        </label>

        <hr>

        <h3>Recipe Builder</h3>
        <p class="muted">Select ingredients from Ingredient Stocks and set quantity used per product.</p>

        <div class="form-grid-3">
          <label>
            Ingredient
            <select id="recipeIngredientSelect">
              <option value="">Select ingredient</option>
              ${productIngredientOptions.map(ing => `
                <option value="${ing.id || ing.ingredientId}">
                  ${ing.name} (${ing.unit || "unit"})
                </option>
              `).join("")}
            </select>
          </label>

          <label>
            Quantity
            <input id="recipeQty" type="number" value="1" min="0" step="0.01">
          </label>

          <label>
            Unit
            <input id="recipeUnit" placeholder="pcs/ml/g">
          </label>
        </div>

        <button class="btn" onclick="addRecipeIngredient()">Add Ingredient</button>

        <div id="recipeBuilderList" style="margin-top:12px"></div>
      `,
      `<button class="btn primary" onclick="saveProductForm('${product?.id || product?.productId || ""}')">Save Product</button>
       <button class="btn" onclick="closeModal()">Cancel</button>`
    );

    renderRecipeBuilderList();

    const imageInput = document.getElementById("productImageFile");
    if(imageInput){
      imageInput.addEventListener("change", handleProductImageUpload);
    }

    const recipeIngredientSelect = document.getElementById("recipeIngredientSelect");
    if(recipeIngredientSelect){
      recipeIngredientSelect.addEventListener("change", function(){
        const selectedId = this.value;
        const ingredient = productIngredientOptions.find(ing =>
          ing.id === selectedId || ing.ingredientId === selectedId
        );

        const unitInput = document.getElementById("recipeUnit");
        if(unitInput && ingredient){
          unitInput.value = cleanRecipeUnit(ingredient.unit || "pcs");
        }
      });
    }
  }catch(error){
    openModal("Product Form Failed", `<p>${error.message}</p>`);
  }
}

function addRecipeIngredient(){
  const ingredientId = document.getElementById("recipeIngredientSelect").value;
  const qty = Number(document.getElementById("recipeQty").value || 0);
  const customUnit = document.getElementById("recipeUnit").value.trim();

  if(!ingredientId){
    alert("Please select an ingredient.");
    return;
  }

  if(qty <= 0){
    alert("Quantity must be greater than 0.");
    return;
  }

  const ingredient = productIngredientOptions.find(ing =>
    ing.id === ingredientId || ing.ingredientId === ingredientId
  );

  if(!ingredient){
    alert("Ingredient not found.");
    return;
  }

  productRecipeDraft.push({
    ingredientId: ingredient.id || ingredient.ingredientId,
    ingredientName: ingredient.name,
    name: ingredient.name,
    qty,
    unit: customUnit || ingredient.unit || "pcs"
  });

  document.getElementById("recipeIngredientSelect").value = "";
  document.getElementById("recipeQty").value = 1;
  document.getElementById("recipeUnit").value = "";

  renderRecipeBuilderList();
}

function removeRecipeIngredient(index){
  productRecipeDraft.splice(index, 1);
  renderRecipeBuilderList();
}

function renderRecipeBuilderList(){
  const box = document.getElementById("recipeBuilderList");
  if(!box) return;

  if(!productRecipeDraft.length){
    box.innerHTML = `<p class="muted">No recipe ingredients added.</p>`;
    return;
  }

  box.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${productRecipeDraft.map((item, index) => `
            <tr>
              <td>${item.ingredientName || item.name || ""}</td>
              <td>${item.qty || 0}</td>
              <td>${item.unit || ""}</td>
              <td><button class="btn small danger" onclick="removeRecipeIngredient(${index})">Remove</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}


function loadImageFromFile(file){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function compressProductImage(file){
  const img = await loadImageFromFile(file);

  const maxSize = 900;
  let width = img.width;
  let height = img.height;

  if(width > height && width > maxSize){
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  }else if(height > maxSize){
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  return await new Promise(resolve => {
    canvas.toBlob(blob => {
      if(blob){
        resolve(new File([blob], "product-image.webp", { type: "image/webp" }));
      }else{
        resolve(file);
      }
    }, "image/webp", 0.72);
  });
}

async function uploadProductImageToCloudinary(file){
  const compressedFile = await compressProductImage(file);

  const formData = new FormData();
  formData.append("file", compressedFile);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "fruitsinbloomph/products");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if(!response.ok){
    throw new Error(data.error?.message || "Cloudinary upload failed.");
  }

  return {
    imageUrl: data.secure_url,
    cloudinaryPublicId: data.public_id
  };
}

async function handleProductImageUpload(){
  const input = document.getElementById("productImageFile");
  const urlInput = document.getElementById("productImageUrl");

  if(!input || !input.files || !input.files[0]){
    return;
  }

  try{
    const file = input.files[0];

    if(file.size > 8 * 1024 * 1024){
      alert("Image is too large. Please choose an image under 8MB.");
      input.value = "";
      return;
    }

    urlInput.value = "Uploading compressed image...";

    const result = await uploadProductImageToCloudinary(file);

    urlInput.value = result.imageUrl;
    urlInput.dataset.cloudinaryPublicId = result.cloudinaryPublicId || "";

    const preview = document.getElementById("productImagePreview");
    if(preview){
      preview.src = result.imageUrl;
    }

    const fallbackText = document.getElementById("productImagePreviewText");
    if(fallbackText){
      fallbackText.outerHTML = `<img id="productImagePreview" src="${result.imageUrl}" alt="Product image">`;
    }
  }catch(error){
    alert(error.message);
    urlInput.value = "";
  }
}

async function saveProductForm(existingId = ""){
  try{
    if(!window.FIB.saveProduct){
      throw new Error("Product save service is not ready.");
    }

    const product = {
      id: existingId,
      name: document.getElementById("productName").value.trim(),
      details: document.getElementById("productDetails").value.trim(),
      imageUrl: document.getElementById("productImageUrl").value.trim(),
      cloudinaryPublicId: document.getElementById("productImageUrl").dataset.cloudinaryPublicId || "",
      category: document.getElementById("productCategory").value,
      price: Number(document.getElementById("productPrice").value || 0),
      cost: Number(document.getElementById("productCost").value || 0),
      stock: Number(document.getElementById("productStock").value || 0),
      unit: document.getElementById("productUnit").value,
      reorderLevel: Number(document.getElementById("productReorderLevel").value || 0),
      status: document.getElementById("productStatus").value,
      recipe: normalizeProductRecipe(productRecipeDraft)
    };

    if(!product.name){
      alert("Product name is required.");
      return;
    }

    await window.FIB.saveProduct(product);

    closeModal();

    if(typeof loadProducts === "function"){
      await loadProducts();
    }else{
      location.reload();
    }
  }catch(error){
    openModal("Save Product Failed", `<p>${error.message}</p>`);
  }
}

window.openProductForm = openProductForm;
window.addRecipeIngredient = addRecipeIngredient;
window.removeRecipeIngredient = removeRecipeIngredient;
window.saveProductForm = saveProductForm;
