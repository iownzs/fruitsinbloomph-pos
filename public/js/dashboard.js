const firebaseStatus = window.FIB_FIREBASE_READY
  ? badge('Firebase Connected')
  : badge('Firebase Offline');

shell(`
<div class="grid cols-4">
  <div class="card kpi"><span>Orders Today</span><strong>24</strong>${badge('+12%')}</div>
  <div class="card kpi"><span>Active Delivery</span><strong>8</strong>${badge('Out')}</div>
  <div class="card kpi"><span>Low Stock</span><strong>5</strong>${badge('Check')}</div>
  <div class="card kpi"><span>Sales Today</span><strong>${money(48500)}</strong>${badge('Paid')}</div>
</div>

<div class="grid cols-2" style="margin-top:16px">
  <div class="card">
    <h3>Core Workflow</h3>
    <p class="muted">POS Terminal → Orders → Kitchen → Delivery / Pickup → Completed</p>
  </div>

  <div class="card">
    <h3>Phase 2 Firebase</h3>
    <p class="muted">Firestore connection status:</p>
    ${firebaseStatus}
  </div>
</div>
`);
