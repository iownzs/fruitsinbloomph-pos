
const cards=FIB_DATA.orders.map(o=>`<div class="card"><h3>${o.id}</h3>${badge(o.priority)} ${badge(o.status)}<p class="muted">${o.items.join(', ')}</p><button class="btn primary">Start Preparing</button> <button class="btn accent">Mark Ready</button></div>`).join('');
shell(`<div class="grid cols-3"><div><h3>New Orders</h3>${cards}</div><div><h3>Preparing</h3><div class="card muted">Sample preparing order</div></div><div><h3>Ready</h3><div class="card muted">Ready orders show here</div></div></div>`);
