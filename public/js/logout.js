(function () {
  async function logout() {
    try {
      if (window.firebase && firebase.auth) {
        await firebase.auth().signOut();
      }
    } catch (error) {
      console.warn("Logout warning:", error);
    }

    sessionStorage.removeItem("posUser");
    localStorage.removeItem("posUser");
    window.location.href = "login.html";
  }

  window.FIBLogout = logout;

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-logout], #logoutBtn");
    if (!btn) return;

    event.preventDefault();
    logout();
  });
})();
