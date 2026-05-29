
function showDeliveryCardMessage(orderId){
  const o = FIB_DATA.orders.find(x => x.id === orderId);
  if(!o) return;
  openModal(
    'Card Message',
    `<p>${o.card}</p>`,
    `<button class="btn primary" onclick="copyText(FIB_DATA.orders.find(x => x.id === '${orderId}').card)">Copy Card Message</button>
     <button class="btn" onclick="closeModal()">Close</button>`
  );
}

function showDeliveryItems(orderId){
  const o = FIB_DATA.orders.find(x => x.id === orderId);
  if(!o) return;
  openModal('Items', `<ul>${o.items.map(i => `<li>${i}</li>`).join('')}</ul>`);
}

const rows = FIB_DATA.orders.filter(o => o.type === 'Delivery').map(o => `
<tr>
  <td>${o.id}<br>${badge(o.priority)}</td>
  <td>${o.created}</td>
  <td>${o.date}</td>
  <td>${o.source}</td>
  <td>${o.customer}<br><small>${o.customerNo}</small></td>
  <td>${o.recipient}<br><small>${o.recipientNo}</small></td>
  <td><div class="truncate">${o.address}</div></td>
  <td>BFC</td>
  <td><button class="icon-btn" onclick="showDeliveryItems('${o.id}')">🧺</button></td>
  <td><button class="icon-btn" onclick="showDeliveryCardMessage('${o.id}')">💌</button></td>
  <td>${money(o.total)}</td>
  <td>${o.payment}</td>
  <td>Unassigned</td>
  <td>${badge(o.status)}</td>
  <td>00:42:10</td>
  <td><button class="btn small primary">Assign</button></td>
</tr>
`).join('');

shell(
  `<div class="toolbar">
    <button class="chip active">Waiting for Rider</button>
    <button class="chip">Out for Delivery</button>
    <button class="chip">Delivered History</button>
  </div>` +
  table(rows, [
    'Order ID',
    'Created',
    'Delivery Date',
    'Source',
    'Customer',
    'Recipient',
    'Address',
    'Type',
    'Items',
    'Card',
    'Total',
    'Payment',
    'Rider',
    'Status',
    'Timer',
    'Actions'
  ])
);
