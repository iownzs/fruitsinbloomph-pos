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
