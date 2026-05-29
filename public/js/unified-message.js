
const conv = FIB_DATA.messages.map(m => `
  <div class="card conversation-card">
    <strong>${m.customer}</strong>
    <p class="muted">${m.platform} · ${m.last}</p>
    ${badge(m.sourceType)} ${badge(m.status)} ${m.linkedOrder ? badge(m.linkedOrder) : ''}
  </div>
`).join('');

shell(`
  <div class="unified-layout">
    <div class="card">
      <h3>Platform Tabs</h3>

      <div class="chips">
        ${['All','Facebook','Instagram','WhatsApp','TikTok','Viber'].map((x,i) => `
          <button class="chip ${i === 0 ? 'active' : ''}">${x}</button>
        `).join('')}
      </div>

      <br>
      ${conv}
    </div>

    <div class="card">
      <h3>Chat Panel</h3>

      ${badge('Pro Feature')} ${badge('Ads / Organic Tracking')}

      <div class="chat-message customer">
        Customer: I filled up the order form.
      </div>

      <div class="chat-message staff">
        Staff: Thank you! We will review and confirm your order.
      </div>

      <h3>Quick Replies</h3>

      <div class="chips">
        ${['Order Form: Arrangement','Pantry Order Form','Pantry Pricelist'].map(x => `
          <button class="chip" onclick="openModal('Quick Reply','<p>${x}</p><p class=muted>Plain text template will send here.</p>')">${x}</button>
        `).join('')}
      </div>

      <br>
      <textarea placeholder="Reply to customer"></textarea>
      <br><br>
      <button class="btn primary">Send</button>
    </div>

    <div class="card">
      <h3>Order Form Submission</h3>
      <p class="muted">Customer-filled form = draft only.</p>

      <div class="order-actions">
        <button class="btn">Copy Details</button>
        <button class="btn accent">Copy to Cart</button>
        <button class="btn primary">Create Order</button>
        <button class="btn">Link Existing Order</button>
      </div>
    </div>
  </div>
`);
