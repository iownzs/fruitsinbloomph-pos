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
          status: "Created",
          kitchenStatus: "new",
          deliveryStatus: orderData.orderType === "Delivery" ? "not_started" : "",
          pickupStatus: orderData.orderType === "Pickup" ? "waiting_pickup" : "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return generatedOrderId;
      });

      return orderId;
    };



    window.FIB.getKitchenOrders = async function(){
      if(!window.db) throw new Error("Firestore not ready.");

      const snapshot = await window.db
        .collection("orders")
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => ["new","sent","preparing","ready"].includes(order.kitchenStatus));
    };

    window.FIB.updateKitchenStatus = async function(orderId, kitchenStatus){
      if(!window.db) throw new Error("Firestore not ready.");

      const statusMap = {
        new: "Created",
        sent: "Sent to Kitchen",
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
