(function () {
  const USERNAME_EMAIL_MAP = {
    admin: "iownzs@gmail.com"
  };

  const ROLE_REDIRECTS = {
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

  function normalizeUsername(value) {
    return String(value || "").trim().toLowerCase();
  }

  function usernameToEmail(username) {
    const cleanUsername = normalizeUsername(username);
    return USERNAME_EMAIL_MAP[cleanUsername] || `${cleanUsername}@fruitsinbloomph.local`;
  }

  function getDb() {
    if (window.db) return window.db;
    if (window.firebase && firebase.firestore) return firebase.firestore();
    throw new Error("Firestore is not ready.");
  }

  function setError(message) {
    const errorBox = document.querySelector("#loginError");
    if (!errorBox) return;

    errorBox.textContent = message || "";
    errorBox.style.display = message ? "block" : "none";
  }

  function setLoading(isLoading) {
    const btn = document.querySelector("#loginBtn");
    if (!btn) return;

    btn.disabled = isLoading;
    btn.textContent = isLoading ? "Logging in..." : "Login";
  }

  function renderLogin() {
    document.body.classList.add("login-page");

    const roleIcons = {
      Admin: "🛡️",
      Sales: "📊",
      Cashier: "💵",
      Kitchen: "👨‍🍳",
      Delivery: "🛵",
      Rider: "🏍️",
      Inventory: "📦"
    };

    shell(`
      <main class="login-layout">
        <section class="login-brand-card">
          <div class="login-brand-row">
            <div class="login-logo">FIB</div>
            <div>
              <h1 class="login-brand-title">fruitsinbloomph POS</h1>
              <p class="login-brand-subtitle">Dark web-based POS system</p>
            </div>
          </div>

          <div class="login-brand-extra">
            <div>
              <strong>Secure</strong>
              <span>Role-based access</span>
            </div>
            <div>
              <strong>Fast</strong>
              <span>Web-based POS</span>
            </div>
            <div>
              <strong>Ready</strong>
              <span>Inventory + orders</span>
            </div>
          </div>
        </section>

        <section class="login-card">
          <h3>Welcome</h3>
          <p class="muted">Please login to admin dashboard.</p>

          <form id="loginForm" class="login-form">
            <label>
              Username
              <div class="login-input-wrap">
                <span class="login-input-icon">👤</span>
                <input id="username" name="username" placeholder="admin" autocomplete="username" required>
              </div>
            </label>

            <label>
              Password
              <div class="login-input-wrap">
                <span class="login-input-icon">🔒</span>
                <input id="password" name="password" type="password" placeholder="password" autocomplete="current-password" required>
                <button id="togglePassword" class="login-eye-btn" type="button" aria-label="Show password">👁️</button>
              </div>
            </label>

            <p id="loginError" class="login-error" style="display:none"></p>

            <button id="loginBtn" class="btn primary login-btn" type="submit">Login</button>
          </form>

          <h3 class="quick-login-title">Quick Login</h3>
          <div class="login-quick-grid">
            ${["Admin", "Sales", "Cashier", "Kitchen", "Delivery", "Rider", "Inventory"].map(role => `
              <button class="chip login-role-chip" type="button" data-quick-role="${role}">
                <span>${roleIcons[role]}</span>
                <strong>${role}</strong>
              </button>
            `).join("")}
          </div>
        </section>
      </main>
    `);

    attachEvents();
  }

  function attachEvents() {
    const form = document.querySelector("#loginForm");

    if (form) {
      form.addEventListener("submit", handleLogin);
    }

    const togglePassword = document.querySelector("#togglePassword");
    const passwordInput = document.querySelector("#password");

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        togglePassword.textContent = isPassword ? "🙈" : "👁️";
        togglePassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      });
    }

    document.querySelectorAll("[data-quick-role]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const role = btn.dataset.quickRole;

        if (role === "Admin") {
          document.querySelector("#username").value = "admin";
          document.querySelector("#password").focus();
          setError("Admin username filled. Enter your password.");
          return;
        }

        setError(`${role} quick login will be added after staff accounts are created.`);
      });
    });
  }

  async function checkPosLock(staff) {
    try {
      const db = getDb();
      const snap = await db.collection("systemStatus").doc("posAccess").get();

      if (!snap.exists) return null;

      const data = snap.data() || {};
      const status = String(data.status || "").toLowerCase();
      const locked = data.locked === true || status === "locked";

      if (!locked) return null;

      const role = staff.role || "";
      const ownerAllowed = ["Owner", "Admin", "Owner / Admin"].includes(role);

      if (ownerAllowed) {
        return "pos-billing.html";
      }

      throw new Error("POS is locked. Please contact admin.");
    } catch (error) {
      if (String(error.message || "").includes("POS is locked")) {
        throw error;
      }

      return null;
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    const username = normalizeUsername(document.querySelector("#username")?.value);
    const password = document.querySelector("#password")?.value || "";

    setError("");

    if (!username) {
      setError("Username is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      if (!window.firebase || !firebase.auth) {
        throw new Error("Firebase Auth is not loaded.");
      }

      const email = usernameToEmail(username);
      const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const authUser = credential.user;

      const db = getDb();
      const userSnap = await db.collection("users").doc(authUser.uid).get();

      if (!userSnap.exists) {
        await firebase.auth().signOut();
        throw new Error("Staff profile not found.");
      }

      const staff = userSnap.data() || {};
      const status = String(staff.status || "").toLowerCase();

      if (status === "inactive") {
        await firebase.auth().signOut();
        throw new Error("Account inactive. Please contact admin.");
      }

      if (status === "suspended") {
        await firebase.auth().signOut();
        throw new Error("Account suspended. Please contact admin.");
      }

      if (status !== "active") {
        await firebase.auth().signOut();
        throw new Error("Account is not active.");
      }

      if (staff.username && normalizeUsername(staff.username) !== username) {
        await firebase.auth().signOut();
        throw new Error("Username does not match this account.");
      }

      const lockedRedirect = await checkPosLock(staff);

      const posUser = {
        uid: authUser.uid,
        name: staff.name || "Staff",
        username: staff.username || username,
        email: staff.email || email,
        role: staff.role || "Staff",
        status: staff.status || "Active",
        loginAt: new Date().toISOString()
      };

      sessionStorage.setItem("posUser", JSON.stringify(posUser));
      localStorage.setItem("posUser", JSON.stringify(posUser));

      const redirectPage =
        lockedRedirect ||
        staff.defaultPage ||
        ROLE_REDIRECTS[staff.role] ||
        "dashboard.html";

      window.location.href = redirectPage;
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid username or password.");
      } else {
        setError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  renderLogin();
})();
