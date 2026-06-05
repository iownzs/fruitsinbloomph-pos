const GROUP_CHAT_CHANNELS = [
  { id: "system", name: "System Message", icon: "🔔", count: 1, desc: "Read-only", readonly: true },
  { id: "general", name: "General", icon: "💬", count: 4, desc: "23 members, 4 online" },
  { id: "sales", name: "Sales", icon: "📊", count: 2, desc: "Sales and cashier updates" },
  { id: "kitchen", name: "Kitchen", icon: "👨‍🍳", count: 1, desc: "Kitchen preparation updates" },
  { id: "delivery", name: "Delivery", icon: "🚚", count: 3, desc: "Delivery coordination" },
  { id: "riders", name: "Riders", icon: "🛵", count: 2, desc: "Rider dispatch updates" },
  { id: "schedule", name: "Schedule", icon: "📅", count: 1, desc: "Weekly staff schedule", readonly: true },
  { id: "issues", name: "Issues", icon: "⚠️", count: 2, desc: "Problems and incidents" },
  { id: "chitchat", name: "Chitchat", icon: "😊", count: 3, desc: "Casual staff chat" }
];

const GROUP_CHAT_MESSAGES = {
  system: [
    { author: "System", role: "POS", avatar: "S", time: "9:00 AM", text: "Order ORD-1024 was sent to Delivery.", reactions: "✅ 12" },
    { author: "System", role: "Inventory", avatar: "S", time: "9:05 AM", text: "Ingredient deduction recorded for ORD-1023.", reactions: "👍 8" },
    { author: "System", role: "Kitchen", avatar: "S", time: "9:12 AM", text: "Order ORD-1022 marked Ready.", reactions: "✅ 10" }
  ],
  general: [
    { author: "Maria Santos", role: "Sales", avatar: "MS", time: "9:15 AM", text: "Good morning team! Let’s crush it today and make it a great day for our customers.", reactions: "👍 6  ❤️ 2" },
    { author: "Jake Thompson", role: "Kitchen", avatar: "JT", time: "9:17 AM", text: "Morning! The lunch rush looks busy—kitchen, let’s stay ahead!", reactions: "👍 4" },
    { author: "Leah Nguyen", role: "Kitchen", avatar: "LN", time: "9:24 AM", text: "On it! Prep list is done and team is all set. ✅", reactions: "💪 3" },
    { author: "Rohit Patel", role: "Delivery", avatar: "RP", time: "9:28 AM", text: "Delivery update: 2 new riders starting today. Welcome aboard!", reactions: "👏 5  🎉 2" },
    { author: "Alex Rivera", role: "Inventory", avatar: "AR", time: "9:32 AM", text: "Heads up: We’re low on cups. Ordering more now.", reactions: "" }
  ],
  sales: [
    { author: "Marlon", role: "Sales", avatar: "M", time: "9:15 AM", text: "Customer asked for delivery update on ORD-1024.", reactions: "👍 2" }
  ],
  kitchen: [
    { author: "Kitchen Staff", role: "Kitchen", avatar: "KS", time: "9:20 AM", text: "Preparing pantry orders first.", reactions: "✅ 3" }
  ],
  delivery: [
    { author: "Delivery Staff", role: "Delivery", avatar: "DS", time: "9:30 AM", text: "Waiting for rider assignment.", reactions: "👍 2" }
  ],
  riders: [
    { author: "Rider Team", role: "Rider", avatar: "RT", time: "9:35 AM", text: "Available riders: Juan, Carlo.", reactions: "🛵 2" }
  ],
  issues: [
    { author: "Admin", role: "Manager", avatar: "A", time: "Yesterday", text: "Log any delayed orders here with order ID.", reactions: "" }
  ],
  chitchat: [
    { author: "Team", role: "Staff", avatar: "T", time: "Yesterday", text: "Welcome to Chitchat.", reactions: "😊 3" }
  ]
};

const GROUP_CHAT_SCHEDULE = [
  { date: "Jun 1", day: "Mon", staff: "Admin, Sales, Kitchen" },
  { date: "Jun 2", day: "Tue", staff: "Admin, Sales, Delivery" },
  { date: "Jun 3", day: "Wed", staff: "Admin, Kitchen, Riders" },
  { date: "Jun 4", day: "Thu", staff: "Sales, Kitchen, Delivery" },
  { date: "Jun 5", day: "Fri", staff: "Admin, Sales, Riders" },
  { date: "Jun 6", day: "Sat", staff: "Sales, Kitchen" },
  { date: "Jun 7", day: "Sun", staff: "Admin, Delivery" }
];

let activeGroupChatChannel = "general";
let groupChatChannelsOpen = true;

shell(`
  <div class="group-chat-app">
    <aside id="groupChatChannelPanel" class="group-chat-channel-panel">
      <div class="group-chat-channel-head">
        <div>
          <h2>Group Chat</h2>
          <p class="muted">Team channels</p>
        </div>
        <button class="icon-btn" onclick="toggleGroupChatChannels()">×</button>
      </div>

      <button class="group-chat-minimize-line" onclick="toggleGroupChatChannels()">
        <span>≪</span>
        Minimize Channels
      </button>

      <p class="group-chat-label">Channels</p>

      <div id="groupChatChannels" class="group-chat-channel-list"></div>
    </aside>

    <main class="group-chat-chat-window">
      <header class="group-chat-mobile-header">
        <button class="icon-btn" onclick="toggleGroupChatChannels()">☰</button>
        <div>
          <h3 id="groupChatActiveTitle">General</h3>
          <p id="groupChatActiveSubtitle" class="muted">23 members, 4 online</p>
        </div>
        <button class="group-chat-open-btn" onclick="toggleGroupChatChannels()">Channels</button>
      </header>

      <section class="group-chat-announcement-compact">
        <div>
          <span class="badge">Pinned Announcement</span>
          <h3>Team Updates</h3>
          <p class="muted">Important announcements, incidents, and POS updates for staff.</p>
        </div>
      </section>

      <section id="groupChatBody" class="group-chat-body"></section>

      <footer id="groupChatComposer" class="group-chat-reference-composer"></footer>
    </main>
  </div>
`);

function renderGroupChatChannels(){
  const wrap = document.getElementById("groupChatChannels");

  wrap.innerHTML = GROUP_CHAT_CHANNELS.map(channel => `
    <button class="group-chat-channel-card ${channel.id === activeGroupChatChannel ? "active" : ""}" onclick="setGroupChatChannel('${channel.id}')">
      <span class="group-chat-channel-icon">${channel.icon}</span>
      <span class="group-chat-channel-name">
        <strong>${channel.name}</strong>
        ${channel.readonly ? `<small>🔒 ${channel.desc}</small>` : ""}
      </span>
      <span class="group-chat-channel-count">${channel.count}</span>
    </button>
  `).join("");
}

function setGroupChatChannel(channelId){
  activeGroupChatChannel = channelId;
  renderGroupChat();
}

function getActiveChannel(){
  return GROUP_CHAT_CHANNELS.find(channel => channel.id === activeGroupChatChannel) || GROUP_CHAT_CHANNELS[0];
}

function renderGroupChat(){
  const channel = getActiveChannel();

  document.getElementById("groupChatActiveTitle").textContent = channel.name;
  document.getElementById("groupChatActiveSubtitle").textContent = channel.desc;

  renderGroupChatChannels();

  if(channel.id === "schedule"){
    renderGroupChatSchedule();
  }else{
    renderGroupChatMessages(channel);
  }

  renderGroupChatComposer(channel);
}

function renderGroupChatMessages(channel){
  const messages = GROUP_CHAT_MESSAGES[channel.id] || [];

  document.getElementById("groupChatBody").innerHTML = `
    <div class="group-chat-date-pill">Today, June 1, 2025</div>
    <div class="group-chat-message-list">
      ${messages.map(message => `
        <article class="group-chat-bubble-row">
          <div class="group-chat-avatar">${message.avatar}</div>
          <div class="group-chat-bubble-content">
            <div class="group-chat-message-meta">
              <strong>${message.author}</strong>
              <span>${message.time}</span>
            </div>
            <div class="group-chat-message-bubble">
              ${message.text}
            </div>
            ${message.reactions ? `<div class="group-chat-reactions">${message.reactions}</div>` : ""}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderGroupChatSchedule(){
  document.getElementById("groupChatBody").innerHTML = `
    <div class="schedule-grid group-chat-reference-schedule">
      ${GROUP_CHAT_SCHEDULE.map(day => `
        <div class="schedule-day-card">
          <strong>${day.date}</strong>
          <span>${day.day}</span>
          <p>${day.staff}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderGroupChatComposer(channel){
  const composer = document.getElementById("groupChatComposer");

  if(channel.readonly){
    composer.innerHTML = `
      <div class="group-chat-readonly-note">You can’t send messages in this channel.</div>
    `;
    return;
  }

  composer.innerHTML = `
    <input placeholder="Type a message...">
    <button class="icon-btn">😊</button>
    <button class="icon-btn">@</button>
    <button class="group-chat-send-btn">➤</button>
  `;
}

function toggleGroupChatChannels(){
  groupChatChannelsOpen = !groupChatChannelsOpen;

  document.querySelector(".group-chat-app")?.classList.toggle("channels-closed", !groupChatChannelsOpen);
}

renderGroupChat();

window.setGroupChatChannel = setGroupChatChannel;
window.toggleGroupChatChannels = toggleGroupChatChannels;
