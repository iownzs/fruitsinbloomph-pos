(function () {
  const PUBLIC_PAGES = [
    "login.html",
    "live-track.html",
    "qr-order-details.html"
  ];

  const ROLE_DEFAULT_PAGES = {
    "Owner": "dashboard.html",
    "Admin": "dashboard.html",
    "Owner / Admin": "dashboard.html",
    "Manager": "dashboard.html",
    "Sales": "pos-terminal.html",
    "Cashier": "pos-terminal.html",
    "Kitchen Staff": "kitchen.html",
    "Delivery Staff": "delivery.html",
    "Rider": "delivery.html",
    "Inventory Staff": "product-stocks.html"
  };

  const ROLE_ALLOWED_PAGES = {
    "Owner": ["*"],
    "Admin": ["*"],
    "Owner / Admin": ["*"],

    "Manager": [
      "dashboard.html",
      "pos-terminal.html",
      "orders.html",
      "kitchen.html",
      "delivery.html",
      "pickup.html",
      "products.html",
      "product-stocks.html",
      "ingredient-stocks.html",
      "stock-movements.html",
      "group-chat.html",
      "unified-message.html",
      "reports.html",
      "account.html",
      "pos-billing.html",
      "settings.html"
    ],

    "Sales": [
      "dashboard.html",
      "pos-terminal.html",
      "orders.html",
      "kitchen.html",
      "delivery.html",
      "pickup.html",
      "products.html",
      "product-stocks.html",
      "group-chat.html",
      "unified-message.html"
    ],

    "Cashier": [
      "pos-terminal.html",
      "orders.html",
      "products.html",
      "product-stocks.html",
      "group-chat.html"
    ],

    "Kitchen Staff": [
      "kitchen.html",
      "orders.html",
      "group-chat.html"
    ],

    "Delivery Staff": [
      "delivery.html",
      "orders.html",
      "group-chat.html"
    ],

    "Rider": [
      "delivery.html",
      "group-chat.html"
    ],

    "Inventory Staff": [
      "dashboard.html",
      "orders.html",
      "products.html",
      "product-stocks.html",
      "ingredient-stocks.html",
      "stock-movements.html",
      "reports.html",
      "settings.html",
      "group-chat.html"
    ]
  };

  function currentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1) || "index.html";
  }

  function isPublicPage(page) {
    return PUBLIC_PAGES.includes(page);
  }

  function getDb() {
    if (window.db) return window.db;
    if (window.firebase && firebase.firestore) return firebase.firestore();
    throw new Error("Firestore is not ready.");
  }

  function saveUser(authUser, staff) {
    const posUser = {
      uid: authUser.uid,
      name: staff.name || staff.fullName || "Staff",
      username: staff.username || "",
      email: staff.email || authUser.email || "",
      role: staff.role || "Staff",
      status: staff.status || "Active",
      loginAt: new Date().toISOString()
    };

    sessionStorage.setItem("posUser", JSON.stringify(posUser));
    localStorage.setItem("posUser", JSON.stringify(posUser));

    return posUser;
  }

  function redirectToLogin() {
    const page = currentPage();

    if (page !== "login.html") {
      window.location.href = "login.html";
    }
  }

  function roleCanOpen(role, page) {
    const allowed = ROLE_ALLOWED_PAGES[role] || [];
    return allowed.includes("*") || allowed.includes(page);
  }

  function redirectToRoleHome(role) {
    const target = ROLE_DEFAULT_PAGES[role] || "dashboard.html";
    window.location.href = target;
  }

  async function checkPosLock(staff, page) {
    try {
      const db = getDb();
      const snap = await db.collection("systemStatus").doc("posAccess").get();

      if (!snap.exists) return;

      const data = snap.data() || {};
      const status = String(data.status || "").toLowerCase();
      const locked = data.locked === true || status === "locked";

      if (!locked) return;

      const role = staff.role || "";
      const ownerAllowed = ["Owner", "Admin", "Owner / Admin"].includes(role);

      if (ownerAllowed) {
        const allowedWhileLocked = [
          "account.html",
          "pos-billing.html",
          "superadmin.html",
          "settings.html"
        ];

        if (!allowedWhileLocked.includes(page)) {
          window.location.href = "pos-billing.html";
        }

        return;
      }

      await firebase.auth().signOut();
      sessionStorage.removeItem("posUser");
      localStorage.removeItem("posUser");
      alert("POS is locked. Please contact admin.");
      redirectToLogin();
    } catch (error) {
      console.warn("POS lock check skipped:", error);
    }
  }

  async function guard() {
    const page = currentPage();

    if (isPublicPage(page)) return;

    if (!window.firebase || !firebase.auth) {
      console.error("Firebase Auth is not loaded.");
      redirectToLogin();
      return;
    }

    firebase.auth().onAuthStateChanged(async (authUser) => {
      try {
        if (!authUser) {
          redirectToLogin();
          return;
        }

        const db = getDb();
        const userSnap = await db.collection("users").doc(authUser.uid).get();

        if (!userSnap.exists) {
          await firebase.auth().signOut();
          redirectToLogin();
          return;
        }

        const staff = userSnap.data() || {};
        const status = String(staff.status || "").toLowerCase();

        if (status !== "active") {
          await firebase.auth().signOut();
          sessionStorage.removeItem("posUser");
          localStorage.removeItem("posUser");
          alert("Account is not active. Please contact admin.");
          redirectToLogin();
          return;
        }

        saveUser(authUser, staff);

        const role = staff.role || "";

        if (!roleCanOpen(role, page)) {
          redirectToRoleHome(role);
          return;
        }

        await checkPosLock(staff, page);
      } catch (error) {
        console.error("Auth guard error:", error);
        redirectToLogin();
      }
    });
  }

  guard();
})();
