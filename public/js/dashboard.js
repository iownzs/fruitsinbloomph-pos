const firebaseStatus = window.FIB_FIREBASE_READY
  ? badge('Firebase Connected')
  : badge('Firebase Offline');

const firebaseMessage = window.FIB_FIREBASE_READY
  ? 'Firestore is initialized and ready.'
  : (window.FIB_FIREBASE_ERROR || 'Firebase did not initialize.');

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
    <p class="muted" style="margin-top:10px">${firebaseMessage}</p>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
      <button class="btn primary" onclick="writeFirebaseStatus()">Write Test</button>
      <button class="btn" onclick="readFirebaseStatus()">Read Test</button>
    </div>

    <div id="firebaseStatusResult" class="card" style="margin-top:14px;background:#0b1220">
      Firestore test result will show here.
    </div>
  </div>
</div>
`);

async function writeFirebaseStatus(){
  const result = document.getElementById("firebaseStatusResult");

  try{
    result.innerHTML = "Writing to Firestore...";
    await window.FIB.setSystemStatus();
    result.innerHTML = `${badge('Write Success')}<p class="muted">systemStatus/app saved to Firestore.</p>`;
  }catch(error){
    result.innerHTML = `${badge('Write Failed')}<p class="muted">${error.message}</p>`;
  }
}

async function readFirebaseStatus(){
  const result = document.getElementById("firebaseStatusResult");

  try{
    result.innerHTML = "Reading from Firestore...";
    const data = await window.FIB.getSystemStatus();

    if(!data){
      result.innerHTML = `${badge('No Data')}<p class="muted">Click Write Test first.</p>`;
      return;
    }

    result.innerHTML = `
      ${badge('Read Success')}
      <p><strong>Phase:</strong> ${data.phase || ''}</p>
      <p><strong>Connected:</strong> ${data.firebaseConnected ? 'Yes' : 'No'}</p>
      <p><strong>Message:</strong> ${data.message || ''}</p>
    `;
  }catch(error){
    result.innerHTML = `${badge('Read Failed')}<p class="muted">${error.message}</p>`;
  }
}
