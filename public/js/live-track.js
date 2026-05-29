
const id=new URLSearchParams(location.search).get('order')||'ORD-1024';
shell(`<div class="card" style="max-width:720px;margin:auto"><div class="brand"><div class="logo">FIB</div><div><h1>Order Tracking</h1><p>${id}</p></div></div>${['Order Confirmed','Preparing','Out for Delivery','Delivered'].map((s,i)=>`<div class="card" style="margin:12px 0;border-color:${i<2?'var(--green)':'var(--border)'}"><h3>${i<2?'✓':'○'} ${s}</h3><p class="muted">${i===1?'We are preparing your order.':'Tracking step'}</p></div>`).join('')}</div>`);
