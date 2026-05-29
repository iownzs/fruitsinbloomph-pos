
function showPickupItems(orderId){
  const o = FIB_DATA.orders.find(x => x.id === orderId);
  if(!o) return;
  openModal('Items', `<ul>${o.items.map(i => `<li>${i}</li>`).join('')}</ul>`);
}

function showPickupCardMessage(orderId){
  const o = FIB_DATA.orders.find(x => x.id === orderId);
  if(!o) return;
  openModal(
    'Card Message',
    `<p>${o.card}</p>`,
    `<button class="btn primary" onclick="copyText(FIB_DATA.orders.find(x => x.id === '${orderId}').card)">Copy Card Message</button>
     <button class="btn" onclick="closeModal()">Close</button>`
  );
}

const rows = FIB_DATA.orders.filter(o => o.type === 'Pickup').map(o => `
<tr>
  <td>${o.id}<br>${badge(o.priority)}</td>
  <td>${o.created}</td>
  <td>${o.date}</td>
  <td>${o.source}</td>
  <td>${o.customer}<br><small>${o.customerNo}</small></td>
  <td>${o.recipient}<br><small>${o.recipientNo}</small></td>
  <td><button class="icon-btn" onclick="showPickupItems('${o.id}')">🧺</button></td>
  <td><button class="icon-btn" onclick="showPickupCardMessage('${o.id}')">💌</button></td>
  <td>${money(o.total)}</td>
  <td>${o.payment}</td>
  <td>${badge(o.status)}</td>
  <td>00:20:04</td>
  <td><button class="btn small primary">Mark Picked Up</button></td>
</tr>
`).join('');

shell(
  `<div class="toolbar">
    <button class="chip active">Waiting Pickup</button>
    <button class="chip">Picked Up History</button>
  </div>` +
  table(rows, [
    'Order ID',
    'Created',
    'Pickup Date',
    'Source',
    'Customer',
    'Pickup Person',
    'Items',
    'Card Message',
    'Total',
    'Payment',
    'Status',
    'Timer',
    'Actions'
  ])
);
