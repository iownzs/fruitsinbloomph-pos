(function(){
  window.FIB_FIREBASE_READY = false;
  window.FIB_FIREBASE_ERROR = "";

  if(!window.firebaseConfig){
    window.FIB_FIREBASE_ERROR = "Firebase config missing.";
    console.warn(window.FIB_FIREBASE_ERROR);
    return;
  }

  if(typeof firebase === "undefined"){
    window.FIB_FIREBASE_ERROR = "Firebase SDK failed to load.";
    console.error(window.FIB_FIREBASE_ERROR);
    return;
  }

  try{
    if(!firebase.apps.length){
      firebase.initializeApp(window.firebaseConfig);
    }

    window.db = firebase.firestore();
    window.FIB_FIREBASE_READY = true;

    window.FIB = window.FIB || {};

    window.FIB.setSystemStatus = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      await window.db.collection("systemStatus").doc("app").set({
        phase: "Phase 2",
        firebaseConnected: true,
        message: "Firestore connected successfully",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      return true;
    };



    window.FIB.seedInitialData = async function(){
      if(!window.db) throw new Error("Firestore not ready.");
      if(!window.FIB_SEED) throw new Error("Seed data missing.");

      const batch = window.db.batch();
      const now = firebase.firestore.FieldValue.serverTimestamp();

      window.FIB_SEED.products.forEach(product => {
        const ref = window.db.collection("products").doc(product.id);
        batch.set(ref, {
          ...product,
          createdAt: now,
          updatedAt: now
        }, { merge: true });
      });

      window.FIB_SEED.products.forEach(product => {
        const ref = window.db.collection("productStocks").doc(product.id);
        batch.set(ref, {
          productId: product.id,
          productName: product.name,
          category: product.category,
          currentStock: product.stock || 0,
          reservedStock: 0,
          availableStock: product.stock || 0,
          unit: product.unit || "pcs",
          reorderLevel: 10,
          stockStatus: "In Stock",
          updatedAt: now
        }, { merge: true });
      });

      window.FIB_SEED.ingredients.forEach(ingredient => {
        const ref = window.db.collection("ingredientStocks").doc(ingredient.id);
        batch.set(ref, {
          ...ingredient,
          reservedStock: 0,
          availableStock: ingredient.currentStock || 0,
          updatedAt: now
        }, { merge: true });
      });

      await batch.commit();
      return {
        products: window.FIB_SEED.products.length,
        ingredients: window.FIB_SEED.ingredients.length
      };
    };

    window.FIB.getProducts = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const snapshot = await window.db.collection("products").orderBy("name").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };





    window.FIB.createOrder = async function(orderData){
      if(!window.db) throw new Error("Firestore not ready.");

      const counterRef = window.db.collection("counters").doc("orders");

      const orderId = await window.db.runTransaction(async transaction => {
        const counterDoc = await transaction.get(counterRef);

        let nextNumber = 1001;

        if(counterDoc.exists){
          nextNumber = (counterDoc.data().nextNumber || 1001);
        }

        const generatedOrderId = "ORD-" + nextNumber;

        transaction.set(counterRef, {
          nextNumber: nextNumber + 1,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        const orderRef = window.db.collection("orders").doc(generatedOrderId);

        transaction.set(orderRef, {
          ...orderData,
          orderId: generatedOrderId,
          status: "Kitchen",
          kitchenStatus: "new",
          deliveryStatus: orderData.orderType === "Delivery" ? "not_started" : "",
          pickupStatus: orderData.orderType === "Pickup" ? "not_started" : "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return generatedOrderId;
      });

      return orderId;
    };





    window.FIB.sendReadyOrderToNextStep = async function(orderId){
      if(!window.db) throw new Error("Firestore not ready.");

      const ref = window.db.collection("orders").doc(orderId);
      const doc = await ref.get();

      if(!doc.exists) throw new Error("Order not found.");

      const order = doc.data();
      const orderType = String(order.orderType || "").toLowerCase();

      if(orderType === "delivery"){
        await ref.set({
          orderType: "Delivery",
          status: "Waiting for Rider",
          kitchenStatus: "sent_to_delivery",
          deliveryStatus: "waiting_rider",
          pickupStatus: "",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return "Delivery";
      }

      if(orderType === "pickup"){
        await ref.set({
          orderType: "Pickup",
          status: "Waiting Pickup",
          kitchenStatus: "sent_to_pickup",
          pickupStatus: "waiting_pickup",
          deliveryStatus: "",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return "Pickup";
      }

      throw new Error("Unknown order type.");
    };

    

    window.FIB.assignDeliveryRider = async function(orderId, riderName){
      if(!window.db) throw new Error("Firestore not ready.");

      await window.db.collection("orders").doc(orderId).set({
        rider: {
          name: riderName || "Rider 1",
          assignedAt: firebase.firestore.FieldValue.serverTimestamp()
        },
        status: "Out for Delivery",
        deliveryStatus: "out_for_delivery",
        kitchenStatus: "sent_to_delivery",
        deliveryStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
        timerStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      return true;
    };

    window.FIB.markOrderDelivered = async function(orderId){
      if(!window.db) throw new Error("Firestore not ready.");

      const ref = window.db.collection("orders").doc(orderId);
      const doc = await ref.get();

      if(!doc.exists) throw new Error("Order not found.");

      const order = doc.data();
      let durationSeconds = 0;

      try{
        if(order.deliveryStartedAt && order.deliveryStartedAt.toDate){
          const startedAt = order.deliveryStartedAt.toDate();
          durationSeconds = Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000));
        }
      }catch(e){}

      await ref.set({
        status: "Delivered",
        deliveryStatus: "delivered",
        deliveredAt: firebase.firestore.FieldValue.serverTimestamp(),
        deliveryDurationSeconds: durationSeconds,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      return true;
    };

    window.FIB.getDeliveryOrders = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const snapshot = await window.db.collection("orders").orderBy("createdAt", "desc").get();

      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => {
          const orderType = String(order.orderType || "").toLowerCase();
          const deliveryStatus = String(order.deliveryStatus || "").toLowerCase();

          return orderType === "delivery" &&
            ["waiting_rider","out_for_delivery","delivered"].includes(deliveryStatus);
        });
    };

    window.FIB.getPickupOrders = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const snapshot = await window.db.collection("orders").orderBy("createdAt", "desc").get();

      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order =>
          order.orderType === "Pickup" &&
          (
            (order.kitchenStatus === "sent_to_pickup" && order.pickupStatus === "waiting_pickup") ||
            order.pickupStatus === "picked_up"
          )
        );
    };

    window.FIB.getKitchenOrders = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const snapshot = await window.db
        .collection("orders")
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => ["new","preparing","ready"].includes(order.kitchenStatus));
    };

    window.FIB.updateKitchenStatus = async function(orderId, kitchenStatus){
      if(!window.db) throw new Error("Firestore not ready.");

      const statusMap = {
        new: "Kitchen",
        preparing: "Preparing",
        ready: "Ready"
      };

      await window.db.collection("orders").doc(orderId).set({
        kitchenStatus,
        status: statusMap[kitchenStatus] || "Created",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      return true;
    };

    window.FIB.getOrders = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const snapshot = await window.db.collection("orders").orderBy("createdAt", "desc").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    window.FIB.getProductStocks = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const snapshot = await window.db.collection("productStocks").orderBy("productName").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    window.FIB.getIngredientStocks = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const snapshot = await window.db.collection("ingredientStocks").orderBy("name").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    window.FIB.getSystemStatus = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const doc = await window.db.collection("systemStatus").doc("app").get();

      if(!doc.exists){
        return null;
      }

      return doc.data();
    };

    console.log("Firebase connected:", window.firebaseConfig.projectId);
  }catch(error){
    window.FIB_FIREBASE_READY = false;
    window.FIB_FIREBASE_ERROR = error.message || String(error);
    console.error("Firebase init error:", error);
  }
})();

/* Ingredient create/edit helpers */
window.FIB.getIngredientStocks = async function(){
  if(!window.db) throw new Error("Firestore not ready.");

  const snap = await window.db.collection("ingredientStocks")
    .orderBy("name", "asc")
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

window.FIB.saveIngredientStock = async function(ingredient){
  if(!window.db) throw new Error("Firestore not ready.");

  const name = String(ingredient.name || "").trim();

  if(!name){
    throw new Error("Ingredient name is required.");
  }

  const ingredientId = ingredient.id || ingredient.ingredientId || (
    "ING-" + name.toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );

  const currentStock = Number(ingredient.currentStock || 0);
  const reserved = Number(ingredient.reservedStock ?? ingredient.reserved ?? 0);
  const available = Math.max(0, currentStock - reserved);
  const reorderLevel = Number(ingredient.reorderLevel || 0);
  const stockStatus = available <= 0 ? "Out of Stock" : available <= reorderLevel ? "Low Stock" : "In Stock";

  const data = {
    ingredientId,
    name,
    category: ingredient.category || "Others",
    unit: ingredient.unit || "pcs",
    currentStock,
    reserved,
    reservedStock: reserved,
    available,
    availableStock: available,
    reorderLevel,
    cost: Number(ingredient.cost || 0),
    ingredientCost: Number(ingredient.cost || ingredient.ingredientCost || 0),
    status: stockStatus,
    stockStatus,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  const ref = window.db.collection("ingredientStocks").doc(ingredientId);
  const doc = await ref.get();

  if(!doc.exists){
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  }

  await ref.set(data, { merge: true });

  return ingredientId;
};

/* Product create/edit helper with recipe */
window.FIB.saveProduct = async function(product){
  if(!window.db) throw new Error("Firestore not ready.");

  const name = String(product.name || "").trim();

  if(!name){
    throw new Error("Product name is required.");
  }

  const productId = product.id || product.productId || (
    "PROD-" + name.toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );

  const stock = Number(product.stock || 0);
  const reservedStock = Number(product.reservedStock || 0);
  const availableStock = stock - reservedStock;
  const reorderLevel = Number(product.reorderLevel || 0);

  const productData = {
    productId,
    name,
    details: product.details || "",
    description: product.description || "",
    category: product.category || "Others",
    price: Number(product.price || 0),
    cost: Number(product.cost || 0),
    stock,
    unit: product.unit || "pcs",
    imageUrl: product.imageUrl || "",
    cloudinaryPublicId: product.cloudinaryPublicId || "",
    status: product.status || "Active",
    recipe: Array.isArray(product.recipe) ? product.recipe : [],
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  const productRef = window.db.collection("products").doc(productId);
  const productDoc = await productRef.get();

  if(!productDoc.exists){
    productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  }

  await productRef.set(productData, { merge: true });

  await window.db.collection("productStocks").doc(productId).set({
    productId,
    productName: name,
    imageUrl: productData.imageUrl,
    cloudinaryPublicId: productData.cloudinaryPublicId,
    category: productData.category,
    currentStock: stock,
    reservedStock,
    availableStock,
    unit: productData.unit,
    reorderLevel,
    stockStatus: availableStock <= 0
      ? "Out of Stock"
      : availableStock <= reorderLevel
        ? "Low Stock"
        : "In Stock",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  if(!productDoc.exists && stock > 0){
    const movementRef = window.db.collection("stockMovements").doc();
    const now = firebase.firestore.FieldValue.serverTimestamp();

    await movementRef.set({
      movementId: movementRef.id,
      referenceId: productId,
      stockType: "Product Stock",
      itemId: productId,
      itemName: name,
      itemDetails: productData.details || productData.description || "",
      sku: productId,
      barcode: "",
      category: productData.category,
      imageUrl: productData.imageUrl,
      movementType: "Stock In",
      quantity: stock,
      unit: productData.unit,
      previousStock: 0,
      newStock: stock,
      reason: "Initial product stock",
      performedBy: "Admin",
      performedByRole: "Admin",
      notes: "Created from Add Product.",
      createdAt: now,
      updatedAt: now
    });
  }

  return productId;
};

/* Ingredient Stock Movement Helper */
window.FIB.adjustIngredientStock = async function(payload){
  if(!window.db) throw new Error("Firestore not ready.");

  const ingredientId = payload.ingredientId;
  const movementType = payload.movementType;
  const quantity = Number(payload.quantity || 0);
  const reason = String(payload.reason || "").trim();
  const notes = String(payload.notes || "").trim();

  if(!ingredientId) throw new Error("Ingredient ID is required.");
  if(!movementType) throw new Error("Movement type is required.");
  if(quantity <= 0) throw new Error("Quantity must be greater than 0.");
  if(!reason) throw new Error("Reason is required.");

  const ingredientRef = window.db.collection("ingredientStocks").doc(ingredientId);

  return await window.db.runTransaction(async transaction => {
    const ingredientDoc = await transaction.get(ingredientRef);

    if(!ingredientDoc.exists){
      throw new Error("Ingredient stock not found.");
    }

    const ingredient = ingredientDoc.data() || {};
    const previousStock = Number(ingredient.currentStock || 0);
    const reservedStock = Number(ingredient.reservedStock ?? ingredient.reserved ?? 0);
    const reorderLevel = Number(ingredient.reorderLevel || 0);

    let newStock = previousStock;

    if(movementType === "Stock In"){
      newStock = previousStock + quantity;
    }else if(movementType === "Stock Out"){
      newStock = previousStock - quantity;
    }else if(movementType === "Adjustment"){
      newStock = quantity;
    }else{
      throw new Error("Invalid movement type.");
    }

    if(newStock < 0){
      throw new Error("Stock cannot go below zero.");
    }

    const availableStock = Math.max(0, newStock - reservedStock);

    let stockStatus = "In Stock";
    if(availableStock <= 0){
      stockStatus = "Out of Stock";
    }else if(availableStock <= reorderLevel){
      stockStatus = "Low Stock";
    }

    const now = firebase.firestore.FieldValue.serverTimestamp();

    transaction.set(ingredientRef, {
      currentStock: newStock,
      reserved: reservedStock,
      reservedStock,
      available: availableStock,
      availableStock,
      status: stockStatus,
      stockStatus,
      updatedAt: now
    }, { merge: true });

    const movementRef = window.db.collection("stockMovements").doc();

    transaction.set(movementRef, {
      movementId: movementRef.id,
      referenceId: ingredientId,
      stockType: "Ingredient Stock",
      itemId: ingredientId,
      itemName: ingredient.name || ingredient.ingredientName || ingredientId,
      itemDetails: ingredient.details || ingredient.ingredientDetails || "",
      sku: ingredient.sku || ingredientId,
      barcode: ingredient.barcode || "",
      category: ingredient.category || "Others",
      movementType,
      quantity,
      unit: ingredient.unit || "pcs",
      previousStock,
      newStock,
      reason,
      performedBy: payload.performedBy || "Admin",
      performedByRole: payload.performedByRole || "Admin",
      notes,
      createdAt: now,
      updatedAt: now
    });

    return {
      ingredientId,
      previousStock,
      newStock,
      availableStock,
      stockStatus,
      movementId: movementRef.id
    };
  });
};









/* Validate Product Stock before POS Order */
window.FIB.validateProductStocksForCart = async function(cartItems){
  if(!window.db) throw new Error("Firestore not ready.");

  if(!Array.isArray(cartItems) || !cartItems.length){
    return { ok: true, issues: [] };
  }

  const requiredMap = new Map();

  for(const cartItem of cartItems){
    const productId = cartItem.productId || cartItem.id;
    const cartQty = Number(cartItem.qty || cartItem.quantity || 1);

    if(!productId || cartQty <= 0) continue;

    if(!requiredMap.has(productId)){
      requiredMap.set(productId, {
        productId,
        productName: cartItem.name || productId,
        requiredQty: 0
      });
    }

    const entry = requiredMap.get(productId);
    entry.requiredQty += cartQty;
  }

  const issues = [];
  const entries = [...requiredMap.values()];

  const stockDocs = await Promise.all(
    entries.map(entry =>
      window.db.collection("productStocks").doc(entry.productId).get()
    )
  );

  entries.forEach((entry, index) => {
    const stockDoc = stockDocs[index];

    if(!stockDoc.exists){
      issues.push({
        productId: entry.productId,
        productName: entry.productName,
        requiredQty: entry.requiredQty,
        availableStock: 0,
        unit: "pcs",
        reason: "Product stock not found"
      });
      return;
    }

    const stock = stockDoc.data() || {};
    const currentStock = Number(stock.currentStock || 0);
    const reservedStock = Number(stock.reservedStock ?? stock.reserved ?? 0);
    const availableStock = Math.max(0, currentStock - reservedStock);
    const unit = stock.unit || "pcs";

    if(availableStock < entry.requiredQty){
      issues.push({
        productId: entry.productId,
        productName: stock.productName || entry.productName,
        requiredQty: entry.requiredQty,
        availableStock,
        unit,
        reason: "Not enough product stock"
      });
    }
  });

  return {
    ok: issues.length === 0,
    issues
  };
};

/* Deduct Product Stocks from POS Order */
window.FIB.deductProductStocksForOrder = async function(orderId, cartItems){
  if(!window.db) throw new Error("Firestore not ready.");

  if(!orderId) throw new Error("Order ID is required for product stock deduction.");
  if(!Array.isArray(cartItems) || !cartItems.length){
    return { deducted: 0, skipped: true };
  }

  const requiredMap = new Map();

  for(const cartItem of cartItems){
    const productId = cartItem.productId || cartItem.id;
    const cartQty = Number(cartItem.qty || cartItem.quantity || 1);

    if(!productId || cartQty <= 0) continue;

    if(!requiredMap.has(productId)){
      requiredMap.set(productId, {
        productId,
        productName: cartItem.name || productId,
        quantity: 0
      });
    }

    const entry = requiredMap.get(productId);
    entry.quantity += cartQty;
  }

  const deductions = [...requiredMap.values()];

  if(!deductions.length){
    return { deducted: 0, skipped: true };
  }

  const now = firebase.firestore.FieldValue.serverTimestamp();

  return await window.db.runTransaction(async transaction => {
    const productSnapshots = await Promise.all(
      deductions.map(async deduction => {
        const stockRef = window.db.collection("productStocks").doc(deduction.productId);
        const stockDoc = await transaction.get(stockRef);

        if(!stockDoc.exists){
          throw new Error("Product stock not found: " + deduction.productName);
        }

        return {
          deduction,
          stockRef,
          stock: stockDoc.data() || {}
        };
      })
    );

    let movementCount = 0;

    for(const item of productSnapshots){
      const deduction = item.deduction;
      const stock = item.stock;

      const previousStock = Number(stock.currentStock || 0);
      const reservedStock = Number(stock.reservedStock ?? stock.reserved ?? 0);
      const reorderLevel = Number(stock.reorderLevel || 0);
      const newStock = previousStock - deduction.quantity;

      if(newStock < 0){
        throw new Error("Not enough product stock for " + (stock.productName || deduction.productName));
      }

      const availableStock = Math.max(0, newStock - reservedStock);

      let stockStatus = "In Stock";
      if(availableStock <= 0){
        stockStatus = "Out of Stock";
      }else if(availableStock <= reorderLevel){
        stockStatus = "Low Stock";
      }

      transaction.set(item.stockRef, {
        currentStock: newStock,
        reserved: reservedStock,
        reservedStock,
        available: availableStock,
        availableStock,
        stockStatus,
        status: stockStatus,
        updatedAt: now
      }, { merge: true });

      const productRef = window.db.collection("products").doc(deduction.productId);
      transaction.set(productRef, {
        stock: newStock,
        updatedAt: now
      }, { merge: true });

      const movementRef = window.db.collection("stockMovements").doc();

      transaction.set(movementRef, {
        movementId: movementRef.id,
        referenceId: orderId,
        linkedOrderId: orderId,
        stockType: "Product Stock",
        itemId: deduction.productId,
        itemName: stock.productName || deduction.productName,
        itemDetails: stock.details || stock.productDetails || "",
        sku: stock.sku || deduction.productId,
        barcode: stock.barcode || "",
        category: stock.category || "Others",
        imageUrl: stock.imageUrl || "",
        movementType: "Stock Out",
        quantity: deduction.quantity,
        unit: stock.unit || "pcs",
        previousStock,
        newStock,
        reason: "POS order product stock deduction",
        performedBy: "POS Terminal",
        performedByRole: "System",
        notes: `Order ${orderId} sold ${deduction.quantity} ${stock.unit || "pcs"}`,
        createdAt: now,
        updatedAt: now
      });

      movementCount++;
    }

    return {
      orderId,
      deducted: movementCount
    };
  });
};

/* Validate Ingredient Stock before POS Order */
window.FIB.validateIngredientsForCart = async function(cartItems){
  if(!window.db) throw new Error("Firestore not ready.");

  if(!Array.isArray(cartItems) || !cartItems.length){
    return { ok: true, issues: [] };
  }

  const requiredMap = new Map();

  for(const cartItem of cartItems){
    const productId = cartItem.productId || cartItem.id;
    const cartQty = Number(cartItem.qty || cartItem.quantity || 1);

    if(!productId || cartQty <= 0) continue;

    let product = {
      name: cartItem.name || productId,
      recipe: Array.isArray(cartItem.recipe) ? cartItem.recipe : []
    };

    let recipe = Array.isArray(cartItem.recipe) && cartItem.recipe.length
      ? cartItem.recipe
      : [];

    // Fallback for old cart items that do not have recipe snapshot.
    if(!recipe.length){
      const productDoc = await window.db.collection("products").doc(productId).get();
      if(!productDoc.exists) continue;

      product = productDoc.data() || {};
      recipe = Array.isArray(product.recipe) ? product.recipe : [];
    }

    for(const recipeItem of recipe){
      const ingredientId = recipeItem.ingredientId || recipeItem.id || recipeItem.itemId;
      const recipeQty = Number(
        recipeItem.qty ??
        recipeItem.quantity ??
        recipeItem.recipeQty ??
        recipeItem.amount ??
        recipeItem.ingredientQty ??
        0
      );

      if(!ingredientId || recipeQty <= 0) continue;

      const requiredQty = recipeQty * cartQty;

      if(!requiredMap.has(ingredientId)){
        requiredMap.set(ingredientId, {
          ingredientId,
          requiredQty: 0,
          products: []
        });
      }

      const entry = requiredMap.get(ingredientId);
      entry.requiredQty += requiredQty;
      entry.products.push({
        productName: product.name || cartItem.name || productId,
        cartQty,
        recipeQty,
        requiredQty
      });
    }
  }

  const issues = [];
  const entries = [...requiredMap.values()];

  const ingredientDocs = await Promise.all(
    entries.map(entry =>
      window.db.collection("ingredientStocks").doc(entry.ingredientId).get()
    )
  );

  entries.forEach((entry, index) => {
    const ingredientDoc = ingredientDocs[index];

    if(!ingredientDoc.exists){
      issues.push({
        ingredientId: entry.ingredientId,
        ingredientName: entry.ingredientId,
        requiredQty: entry.requiredQty,
        availableStock: 0,
        unit: "pcs",
        reason: "Ingredient stock not found",
        products: entry.products
      });
      return;
    }

    const ingredient = ingredientDoc.data() || {};
    const currentStock = Number(ingredient.currentStock || 0);
    const reservedStock = Number(ingredient.reservedStock ?? ingredient.reserved ?? 0);
    const availableStock = Math.max(0, currentStock - reservedStock);
    const unit = ingredient.unit || "pcs";

    if(availableStock < entry.requiredQty){
      issues.push({
        ingredientId: entry.ingredientId,
        ingredientName: ingredient.name || ingredient.ingredientName || entry.ingredientId,
        requiredQty: entry.requiredQty,
        availableStock,
        unit,
        reason: "Not enough ingredient stock",
        products: entry.products
      });
    }
  });

  return {
    ok: issues.length === 0,
    issues
  };
};

/* Ingredient Deduction from POS Order */
window.FIB.deductIngredientsForOrder = async function(orderId, cartItems){
  if(!window.db) throw new Error("Firestore not ready.");

  if(!orderId) throw new Error("Order ID is required for ingredient deduction.");
  if(!Array.isArray(cartItems) || !cartItems.length){
    return { deducted: 0, skipped: true };
  }

  const now = firebase.firestore.FieldValue.serverTimestamp();
  const deductionMap = new Map();

  for(const cartItem of cartItems){
    const productId = cartItem.productId || cartItem.id;
    const cartQty = Number(cartItem.qty || cartItem.quantity || 1);

    if(!productId || cartQty <= 0) continue;

    let product = {
      name: cartItem.name || productId,
      recipe: Array.isArray(cartItem.recipe) ? cartItem.recipe : []
    };

    let recipe = Array.isArray(cartItem.recipe) && cartItem.recipe.length
      ? cartItem.recipe
      : [];

    // Fallback for old cart items that do not have recipe snapshot.
    if(!recipe.length){
      const productDoc = await window.db.collection("products").doc(productId).get();

      if(!productDoc.exists) continue;

      product = productDoc.data() || {};
      recipe = Array.isArray(product.recipe) ? product.recipe : [];
    }

    for(const recipeItem of recipe){
      const ingredientId = recipeItem.ingredientId || recipeItem.id || recipeItem.itemId;
      const recipeQty = Number(
        recipeItem.qty ??
        recipeItem.quantity ??
        recipeItem.recipeQty ??
        recipeItem.amount ??
        recipeItem.ingredientQty ??
        0
      );

      if(!ingredientId || recipeQty <= 0) continue;

      const deductionQty = recipeQty * cartQty;
      const key = ingredientId;

      if(!deductionMap.has(key)){
        deductionMap.set(key, {
          ingredientId,
          quantity: 0,
          unit: recipeItem.unit || recipeItem.ingredientUnit || recipeItem.recipeUnit || "",
          products: []
        });
      }

      const entry = deductionMap.get(key);
      entry.quantity += deductionQty;
      entry.products.push({
        productId,
        productName: product.name || cartItem.name || productId,
        cartQty,
        recipeQty,
        deductedQty: deductionQty
      });
    }
  }

  const deductions = [...deductionMap.values()];

  if(!deductions.length){
    return { deducted: 0, skipped: true };
  }

  return await window.db.runTransaction(async transaction => {
    const ingredientSnapshots = await Promise.all(
      deductions.map(async deduction => {
        const ingredientRef = window.db.collection("ingredientStocks").doc(deduction.ingredientId);
        const ingredientDoc = await transaction.get(ingredientRef);

        if(!ingredientDoc.exists){
          throw new Error("Ingredient stock not found: " + deduction.ingredientId);
        }

        return {
          deduction,
          ingredientRef,
          ingredient: ingredientDoc.data() || {}
        };
      })
    );

    let movementCount = 0;

    for(const item of ingredientSnapshots){
      const deduction = item.deduction;
      const ingredient = item.ingredient;

      const previousStock = Number(ingredient.currentStock || 0);
      const reservedStock = Number(ingredient.reservedStock ?? ingredient.reserved ?? 0);
      const reorderLevel = Number(ingredient.reorderLevel || 0);
      const newStock = previousStock - deduction.quantity;

      if(newStock < 0){
        throw new Error(
          "Not enough ingredient stock for " +
          (ingredient.name || ingredient.ingredientName || deduction.ingredientId)
        );
      }

      const availableStock = Math.max(0, newStock - reservedStock);

      let stockStatus = "In Stock";
      if(availableStock <= 0){
        stockStatus = "Out of Stock";
      }else if(availableStock <= reorderLevel){
        stockStatus = "Low Stock";
      }

      transaction.set(item.ingredientRef, {
        currentStock: newStock,
        reserved: reservedStock,
        reservedStock,
        available: availableStock,
        availableStock,
        status: stockStatus,
        stockStatus,
        updatedAt: now
      }, { merge: true });

      const movementRef = window.db.collection("stockMovements").doc();

      transaction.set(movementRef, {
        movementId: movementRef.id,
        referenceId: orderId,
        linkedOrderId: orderId,
        stockType: "Ingredient Stock",
        itemId: deduction.ingredientId,
        itemName: ingredient.name || ingredient.ingredientName || deduction.ingredientId,
        itemDetails: ingredient.details || ingredient.ingredientDetails || "",
        sku: ingredient.sku || deduction.ingredientId,
        barcode: ingredient.barcode || "",
        category: ingredient.category || "Others",
        movementType: "Ingredient Deduction",
        quantity: deduction.quantity,
        unit: ingredient.unit || deduction.unit || "pcs",
        previousStock,
        newStock,
        reason: "POS order ingredient deduction",
        performedBy: "POS Terminal",
        performedByRole: "System",
        notes: deduction.products.map(product =>
          `${product.productName} x${product.cartQty} uses ${product.deductedQty}`
        ).join("; "),
        createdAt: now,
        updatedAt: now
      });

      movementCount++;
    }

    return {
      orderId,
      deducted: movementCount
    };
  });
};

/* Product Stock Movement Helper */
window.FIB.adjustProductStock = async function(payload){
  if(!window.db) throw new Error("Firestore not ready.");

  const productId = payload.productId;
  const movementType = payload.movementType;
  const quantity = Number(payload.quantity || 0);
  const reason = String(payload.reason || "").trim();
  const notes = String(payload.notes || "").trim();

  if(!productId) throw new Error("Product ID is required.");
  if(!movementType) throw new Error("Movement type is required.");
  if(quantity <= 0) throw new Error("Quantity must be greater than 0.");
  if(!reason) throw new Error("Reason is required.");

  const stockRef = window.db.collection("productStocks").doc(productId);
  const productRef = window.db.collection("products").doc(productId);

  return await window.db.runTransaction(async transaction => {
    const stockDoc = await transaction.get(stockRef);
    const productDoc = await transaction.get(productRef);

    if(!stockDoc.exists){
      throw new Error("Product stock not found.");
    }

    const stock = stockDoc.data() || {};
    const product = productDoc.exists ? (productDoc.data() || {}) : {};

    const previousStock = Number(stock.currentStock ?? product.stock ?? 0);
    const reservedStock = Number(stock.reservedStock || 0);
    const reorderLevel = Number(stock.reorderLevel || 0);

    let newStock = previousStock;

    if(movementType === "Stock In"){
      newStock = previousStock + quantity;
    }else if(movementType === "Stock Out"){
      newStock = previousStock - quantity;
    }else if(movementType === "Adjustment"){
      newStock = quantity;
    }else{
      throw new Error("Invalid movement type.");
    }

    if(newStock < 0){
      throw new Error("Stock cannot go below zero.");
    }

    const availableStock = Math.max(0, newStock - reservedStock);

    let stockStatus = "In Stock";
    if(availableStock <= 0){
      stockStatus = "Out of Stock";
    }else if(availableStock <= reorderLevel){
      stockStatus = "Low Stock";
    }

    const now = firebase.firestore.FieldValue.serverTimestamp();

    const productName = stock.productName || product.name || productId;
    const category = stock.category || product.category || "Others";
    const unit = stock.unit || product.unit || "pcs";
    const imageUrl = stock.imageUrl || product.imageUrl || "";

    transaction.set(stockRef, {
      productId,
      productName,
      imageUrl,
      category,
      currentStock: newStock,
      reservedStock,
      availableStock,
      unit,
      reorderLevel,
      stockStatus,
      updatedAt: now
    }, { merge: true });

    if(productDoc.exists){
      transaction.set(productRef, {
        stock: newStock,
        imageUrl,
        updatedAt: now
      }, { merge: true });
    }

    const movementRef = window.db.collection("stockMovements").doc();

    transaction.set(movementRef, {
      movementId: movementRef.id,
      referenceId: productId,
      stockType: "Product Stock",
      itemId: productId,
      itemName: productName,
      itemDetails: product.details || product.description || "",
      sku: stock.sku || product.sku || productId,
      barcode: stock.barcode || product.barcode || "",
      category,
      imageUrl,
      movementType,
      quantity,
      unit,
      previousStock,
      newStock,
      reason,
      performedBy: payload.performedBy || "Admin",
      performedByRole: payload.performedByRole || "Admin",
      notes,
      createdAt: now,
      updatedAt: now
    });

    return {
      productId,
      previousStock,
      newStock,
      availableStock,
      stockStatus,
      movementId: movementRef.id
    };
  });
};

/* Stock Movements Read Helper */
if(!window.FIB.getStockMovements){
  window.FIB.getStockMovements = async function(){
    if(!window.db) throw new Error("Firestore not ready.");

    const snapshot = await window.db.collection("stockMovements")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };
}

/* ==================================================
   Group Chat Firebase Services
================================================== */
window.FIB = window.FIB || {};

window.FIB.GROUP_CHAT_DEFAULT_CHANNELS = [
  {
    channelId: "system_message",
    channelName: "System Message",
    channelKey: "system",
    channelOrder: 1,
    description: "Automated POS system logs only.",
    readOnly: true,
    type: "system",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"],
    canSendRoles: [],
    canEditRoles: ["Owner", "Admin"]
  },
  {
    channelId: "general",
    channelName: "General",
    channelKey: "general",
    channelOrder: 2,
    description: "General team chat.",
    readOnly: false,
    type: "chat",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"],
    canSendRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"],
    canEditRoles: ["Owner", "Admin", "Manager"]
  },
  {
    channelId: "sales",
    channelName: "Sales",
    channelKey: "sales",
    channelOrder: 3,
    description: "Sales and cashier coordination.",
    readOnly: false,
    type: "chat",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier"],
    canSendRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier"],
    canEditRoles: ["Owner", "Admin", "Manager"]
  },
  {
    channelId: "kitchen",
    channelName: "Kitchen",
    channelKey: "kitchen",
    channelOrder: 4,
    description: "Kitchen preparation updates.",
    readOnly: false,
    type: "chat",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Kitchen", "Sales", "Cashier"],
    canSendRoles: ["Owner", "Admin", "Manager", "Kitchen"],
    canEditRoles: ["Owner", "Admin", "Manager"]
  },
  {
    channelId: "delivery",
    channelName: "Delivery",
    channelKey: "delivery",
    channelOrder: 5,
    description: "Delivery coordination.",
    readOnly: false,
    type: "chat",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Delivery", "Rider", "Sales", "Cashier"],
    canSendRoles: ["Owner", "Admin", "Manager", "Delivery", "Rider"],
    canEditRoles: ["Owner", "Admin", "Manager"]
  },
  {
    channelId: "riders",
    channelName: "Riders",
    channelKey: "riders",
    channelOrder: 6,
    description: "Rider updates and assignments.",
    readOnly: false,
    type: "chat",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Delivery", "Rider"],
    canSendRoles: ["Owner", "Admin", "Manager", "Delivery", "Rider"],
    canEditRoles: ["Owner", "Admin", "Manager"]
  },
  {
    channelId: "schedule",
    channelName: "Schedule",
    channelKey: "schedule",
    channelOrder: 7,
    description: "Weekly duty schedule.",
    readOnly: true,
    type: "schedule",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"],
    canSendRoles: [],
    canEditRoles: ["Owner", "Admin"],
    adminEditOnly: true
  },
  {
    channelId: "issues",
    channelName: "Issues",
    channelKey: "issues",
    channelOrder: 8,
    description: "Report issues and incidents.",
    readOnly: false,
    type: "chat",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"],
    canSendRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"],
    canEditRoles: ["Owner", "Admin", "Manager"]
  },
  {
    channelId: "chitchat",
    channelName: "Chitchat",
    channelKey: "chitchat",
    channelOrder: 9,
    description: "Casual team chat.",
    readOnly: false,
    type: "chat",
    isActive: true,
    allowedRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"],
    canSendRoles: ["Owner", "Admin", "Manager", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"],
    canEditRoles: ["Owner", "Admin", "Manager"]
  }
];

window.FIB.seedGroupChatChannels = async function(){
  if(!window.db) throw new Error("Firestore not ready.");

  const batch = window.db.batch();
  const now = firebase.firestore.FieldValue.serverTimestamp();

  window.FIB.GROUP_CHAT_DEFAULT_CHANNELS.forEach(channel => {
    const ref = window.db.collection("chatChannels").doc(channel.channelId);
    batch.set(ref, {
      ...channel,
      createdAt: now,
      updatedAt: now
    }, { merge: true });
  });

  await batch.commit();

  return {
    collection: "chatChannels",
    count: window.FIB.GROUP_CHAT_DEFAULT_CHANNELS.length
  };
};

window.FIB.getGroupChatChannels = async function(){
  if(!window.db) throw new Error("Firestore not ready.");

  const snapshot = await window.db
    .collection("chatChannels")
    .orderBy("channelOrder")
    .get();

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .filter(channel => channel.isActive !== false);
};

/* ==================================================
   Group Chat Message Firebase Services
================================================== */
window.FIB = window.FIB || {};

window.FIB.getGroupChatMessages = async function(channelId){
  if(!window.db) throw new Error("Firestore not ready.");
  if(!channelId) throw new Error("Missing channelId.");

  const snapshot = await window.db
    .collection("chatMessages")
    .where("channelId", "==", channelId)
    .get();

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return aTime - bTime;
    });
};

window.FIB.sendGroupChatMessage = async function(channelId, messageText, extraData = {}){
  if(!window.db) throw new Error("Firestore not ready.");
  if(!channelId) throw new Error("Missing channelId.");
  if(!messageText || !String(messageText).trim()) throw new Error("Message is empty.");

  const authUser = firebase.auth().currentUser;
  if(!authUser) throw new Error("You must be logged in.");

  let staffName = authUser.email || "Staff";
  let staffRole = "Staff";
  let staffAvatar = "S";

  try{
    const userSnap = await window.db.collection("users").doc(authUser.uid).get();
    if(userSnap.exists){
      const user = userSnap.data();
      staffName = user.name || user.displayName || user.fullName || staffName;
      staffRole = user.role || staffRole;
      staffAvatar = String(staffName).trim().charAt(0).toUpperCase() || "S";
    }
  }catch(error){
    console.warn("Could not load sender profile:", error);
  }

  const ref = window.db.collection("chatMessages").doc();

  await ref.set({
    messageId: ref.id,
    channelId,
    senderId: authUser.uid,
    senderName: staffName,
    senderRole: staffRole,
    senderAvatar: staffAvatar,
    messageText: String(messageText).trim(),
    mentionedStaff: extraData.mentionedStaff || [],
    mentionedOrderId: extraData.mentionedOrderId || "",
    mentionedOrderNumber: extraData.mentionedOrderNumber || "",
    reactions: [],
    isEdited: false,
    editedAt: null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  return ref.id;
};

/* ==================================================
   Group Chat Realtime Message Listener
================================================== */
window.FIB = window.FIB || {};

window.FIB.listenGroupChatMessages = function(channelId, callback){
  if(!window.db) throw new Error("Firestore not ready.");
  if(!channelId) throw new Error("Missing channelId.");
  if(typeof callback !== "function") throw new Error("Missing callback.");

  return window.db
    .collection("chatMessages")
    .where("channelId", "==", channelId)
    .onSnapshot(snapshot => {
      const messages = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return aTime - bTime;
        });

      callback(messages);
    }, error => {
      console.warn("Group Chat realtime listener failed:", error);
    });
};
