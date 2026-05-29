// Firebase service helpers for fruitsinbloomph POS

firebase.initializeApp(window.firebaseConfig);

const db = firebase.firestore();

window.FIB_FIREBASE = {
  db,

  async getOrders(){
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => ({
      firebaseId: doc.id,
      ...doc.data()
    }));
  },

  async createOrder(order){
    const now = firebase.firestore.FieldValue.serverTimestamp();

    const payload = {
      ...order,
      createdAt: now,
      updatedAt: now
    };

    const ref = await db.collection("orders").doc(order.id).set(payload);
    return ref;
  },

  async getProducts(){
    const snapshot = await db.collection("products").orderBy("name", "asc").get();
    return snapshot.docs.map(doc => ({
      firebaseId: doc.id,
      ...doc.data()
    }));
  },

  async createProduct(product){
    const now = firebase.firestore.FieldValue.serverTimestamp();

    const payload = {
      ...product,
      createdAt: now,
      updatedAt: now
    };

    await db.collection("products").doc(product.id).set(payload);
  }
};

console.log("Firebase connected:", window.firebaseConfig.projectId);
