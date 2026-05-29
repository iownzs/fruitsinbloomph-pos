
function showCardMessage(orderId){
  const o = FIB_DATA.orders.find(x => x.id === orderId);
  if(!o) return;
  openModal(
    'Card Message',
    `<p>${o.card}</p>`,
    `<button class="btn primary" onclick="copyText(FIB_DATA.orders.find(x => x.id === '${orderId}').card)">Copy Card Message</button>
     <button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showItems(orderId){
  const o = FIB_DATA.orders.find(x => x.id === orderId);
  if(!o) return;
  openModal('Items', `<ul>${o.items.map(i => `<li>${i}</li>`).join('')}</ul>`);
}

function showAddress(orderId){
  const o = FIB_DATA.orders.find(x => x.id === orderId);
  if(!o) return;
  openModal('Full Address', `<p>${o.address}</p>`);
}

function showLinks(orderId){
  openModal(
    'Links',
    `<p>QR: qr-order-details.html?order=${orderId}</p>
     <p>Track: live-track.html?order=${orderId}</p>`
  );
}

const rows = FIB_DATA.orders.map(o => `
<tr>
  <td><strong>${o.id}</strong><br>${badge(o.priority)}</td>
  <td>${o.created}<br><small>Cashier</small></td>
  <td>${o.source}</td>
  <td>${badge(o.sourceType)}</td>
  <td>${o.customer}<br><small>${o.customerNo}</small></td>
  <td>${o.recipient}<br><small>${o.recipientNo}</small></td>
  <td>${o.date}</td>
  <td>
    <button class="btn small" onclick="showAddress('${o.id}')">Preview</button>
    <div class="truncate">${o.address}</div>
  </td>
  <td>${o.type}</td>
  <td><button class="icon-btn" onclick="showItems('${o.id}')">🧺</button></td>
  <td><button class="icon-btn" onclick="showCardMessage('${o.id}')">💌</button></td>
  <td>${money(o.total)}</td>
  <td>${o.payment}</td>
  <td>${badge(o.status)}</td>
  <td><button class="btn small" onclick="showLinks('${o.id}')">Links</button></td>
  <td><button class="btn small">View</button> <button class="btn small accent">Send</button></td>
</tr>
`).join('');

shell(
  `<div class="toolbar">
    <input placeholder="Search orders">
    <select><option>All Status</option></select>
    <select><option>All Source</option></select>
    <button class="btn primary">New Order</button>
  </div>` +
  table(rows, [
    'Order ID / Priority',
    'Order Created / Created By',
    'Source',
    'Source Type',
    'Customer',
    'Recipient',
    'Date & Time',
    'Address / City',
    'Order Type',
    'Items',
    'Card Message',
    'Total',
    'Payment',
    'Status',
    'QR / Tracking',
    'Actions'
  ])
);
