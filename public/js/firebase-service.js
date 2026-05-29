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
