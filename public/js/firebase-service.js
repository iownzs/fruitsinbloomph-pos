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
