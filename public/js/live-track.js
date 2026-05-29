
const id = new URLSearchParams(location.search).get('order') || 'ORD-1024';

const steps = [
  {
    title: 'Order Confirmed',
    message: 'Your order is confirmed.',
    done: true
  },
  {
    title: 'Preparing',
    message: 'We’re preparing your order.',
    done: true
  },
  {
    title: 'Out for Delivery',
    message: 'Your rider is on the way.',
    done: false
  },
  {
    title: 'Delivered',
    message: 'Your order has been delivered successfully.',
    done: false
  }
];

shell(`
  <div class="card" style="max-width:720px;margin:auto">
    <div class="brand">
      <div class="logo">FIB</div>
      <div>
        <h1>Order Tracking</h1>
        <p>${id}</p>
      </div>
    </div>

    ${steps.map(step => `
      <div class="card" style="margin:12px 0;border-color:${step.done ? 'var(--green)' : 'var(--border)'}">
        <h3>${step.done ? '✓' : '○'} ${step.title}</h3>
        <p class="muted">${step.message}</p>
      </div>
    `).join('')}
  </div>
`);
