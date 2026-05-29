
const groups=[['Main',[['📊','Dashboard','dashboard.html'],['🛒','POS Terminal','pos-terminal.html'],['📦','Orders','orders.html']]],['Operations',[['👩‍🍳','Kitchen','kitchen.html'],['🛵','Delivery','delivery.html'],['🧾','Pickup','pickup.html']]],['Inventory',[['🍓','Products','products.html'],['📦','Product Stocks','product-stocks.html'],['🥭','Ingredient Stocks','ingredient-stocks.html'],['🔁','Stock Movements','stock-movements.html']]],['Team & Reports',[['💬','Group Chat','group-chat.html'],['📨','Unified-Message','unified-message.html'],['📈','Reports','reports.html']]],['Business',[['👤','Account','account.html'],['💳','POS Billing','pos-billing.html'],['⚙️','Settings','settings.html']]]];
const publicPages=['login','live-track','qr-order-details'];
function money(n){return new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(n)}
function badge(t){let s=String(t).toLowerCase(),c='gray';if(s.includes('rush')||s.includes('unpaid')||s.includes('cancel'))c='red';if(s.includes('ready')||s.includes('paid')||s.includes('delivered')||s.includes('picked'))c='green';if(s.includes('waiting')||s.includes('partial'))c='amber';if(s.includes('preparing'))c='orange';if(s.includes('out'))c='purple';if(s.includes('ads'))c='blue';return `<span class="badge ${c}">${t}</span>`}
function shell(content){
  let page=document.body.dataset.page,title=document.body.dataset.title;
  const appEl=document.getElementById('app');

  if(publicPages.includes(page)){
    appEl.innerHTML=`<main class="content">${content}</main>`;
    return;
  }

  let nav=groups.map(([g,items])=>`
    <div class="nav-group">${g}</div>
    ${items.map(([e,t,h])=>`
      <a class="nav-link ${h.includes(page)?'active':''}" href="${h}">
        <span>${e}</span>${t}
      </a>
    `).join('')}
  `).join('');

  appEl.innerHTML=`
    <div class="mobile-overlay" id="mobileOverlay" onclick="closeMobileMenu()"></div>

    <div class="mobile-header">
      <button class="icon-btn" onclick="openMobileMenu()">☰</button>
      <div class="brand mini">
        <div class="logo">FIB</div>
        <div>
          <h1>fruitsinbloomph</h1>
          <p>${title}</p>
        </div>
      </div>
      <span class="badge green">Active</span>
    </div>

    <div class="app">
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <div class="logo">FIB</div>
          <div>
            <h1>fruitsinbloomph</h1>
            <p>Phase 1 Static UI</p>
          </div>
        </div>
        ${nav}
      </aside>

      <main>
        <header class="topbar">
          <div>
            <h2>${title}</h2>
            <p>Small working checkpoint · sample data only</p>
          </div>
          <div class="actions">
            <span class="badge green">Active</span>
            <a class="btn small" href="login.html">Logout</a>
          </div>
        </header>

        <section class="content">${content}</section>
      </main>
    </div>
  `;
}

function openMobileMenu(){
  document.getElementById('sidebar')?.classList.add('open');
  document.getElementById('mobileOverlay')?.classList.add('open');
}

function closeMobileMenu(){
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('mobileOverlay')?.classList.remove('open');
}
function openModal(title,body,foot){const modalRoot=document.getElementById('modal-root');modalRoot.innerHTML=`<div class="modal"><div class="modal-head"><h3>${title}</h3><button class="icon-btn" onclick="closeModal()">✕</button></div><div class="modal-body">${body}</div><div class="modal-foot">${foot||'<button class="btn" onclick="closeModal()">Close</button>'}</div></div>`;modalRoot.classList.add('open')}
function closeModal(){document.getElementById('modal-root').classList.remove('open')}
function copyText(text){navigator.clipboard&&navigator.clipboard.writeText(text);openModal('Copied','<p class="muted">Copied to clipboard.</p>')}
function table(rows,heads){return `<div class="table-card"><div class="table-wrap"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><div class="pagination"><span>Sample data</span><span>Desktop 25 · Tablet 15 · Mobile 10</span></div></div>`}
