const GROUP_CHAT_CHANNELS = [
  {
    id: "system",
    name: "System Message",
    description: "Read-only automated POS logs.",
    readonly: true,
    badge: "Read Only"
  },
  {
    id: "general",
    name: "General",
    description: "General team updates.",
    readonly: false
  },
  {
    id: "sales",
    name: "Sales",
    description: "Sales and cashier coordination.",
    readonly: false
  },
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Kitchen preparation updates.",
    readonly: false
  },
  {
    id: "delivery",
    name: "Delivery",
    description: "Delivery team coordination.",
    readonly: false
  },
  {
    id: "riders",
    name: "Riders",
    description: "Rider dispatch and route updates.",
    readonly: false
  },
  {
    id: "schedule",
    name: "Schedule",
    description: "Weekly staff schedule.",
    readonly: true,
    badge: "View Only"
  },
  {
    id: "issues",
    name: "Issues",
    description: "Report problems, delays, and concerns.",
    readonly: false
  },
  {
    id: "chitchat",
    name: "Chitchat",
    description: "Casual staff chat.",
    readonly: false
  }
];

const GROUP_CHAT_MESSAGES = {
  system: [
    {
      author: "System",
      role: "POS",
      time: "Just now",
      text: "Order ORD-1024 was sent to Delivery.",
      type: "system"
    },
    {
      author: "System",
      role: "Inventory",
      time: "5 min ago",
      text: "Ingredient deduction recorded for ORD-1023.",
      type: "system"
    },
    {
      author: "System",
      role: "Kitchen",
      time: "12 min ago",
      text: "Order ORD-1022 marked Ready.",
      type: "system"
    }
  ],
  general: [
    {
      author: "Admin",
      role: "Owner",
      time: "9:00 AM",
      text: "Good morning team. Please check pending orders and inventory alerts.",
      type: "staff"
    }
  ],
  sales: [
    {
      author: "Marlon",
      role: "Sales",
      time: "9:15 AM",
      text: "Customer asked for delivery update on ORD-1024.",
      type: "staff"
    }
  ],
  kitchen: [
    {
      author: "Kitchen Staff",
      role: "Kitchen",
      time: "9:20 AM",
      text: "Preparing pantry orders first.",
      type: "staff"
    }
  ],
  delivery: [
    {
      author: "Delivery Staff",
      role: "Delivery",
      time: "9:30 AM",
      text: "Waiting for rider assignment.",
      type: "staff"
    }
  ],
  riders: [
    {
      author: "Rider Team",
      role: "Rider",
      time: "9:35 AM",
      text: "Available riders: Juan, Carlo.",
      type: "staff"
    }
  ],
  issues: [
    {
      author: "Admin",
      role: "Manager",
      time: "Yesterday",
      text: "Log any delayed orders here with order ID.",
      type: "staff"
    }
  ],
  chitchat: [
    {
      author: "Team",
      role: "Staff",
      time: "Yesterday",
      text: "Welcome to Chitchat.",
      type: "staff"
    }
  ]
};

const GROUP_CHAT_MEMBERS = [
  { name: "Admin", role: "Owner", status: "Online" },
  { name: "Marlon", role: "Sales", status: "Online" },
  { name: "Kitchen Staff", role: "Kitchen", status: "Busy" },
  { name: "Delivery Staff", role: "Delivery", status: "Online" },
  { name: "Rider Team", role: "Rider", status: "Away" }
];

const GROUP_CHAT_SCHEDULE = [
  { day: "Mon", date: "Jun 1", staff: "Admin, Sales, Kitchen" },
  { day: "Tue", date: "Jun 2", staff: "Admin, Sales, Delivery" },
  { day: "Wed", date: "Jun 3", staff: "Admin, Kitchen, Riders" },
  { day: "Thu", date: "Jun 4", staff: "Sales, Kitchen, Delivery" },
  { day: "Fri", date: "Jun 5", staff: "Admin, Sales, Riders" },
  { day: "Sat", date: "Jun 6", staff: "Sales, Kitchen" },
  { day: "Sun", date: "Jun 7", staff: "Admin, Delivery" }
];

let activeGroupChatChannel = "system";
let groupChatChannelsMinimized = false;

shell(`
  <div class="group-chat-page">
    <section class="group-chat-announcement card">
      <div>
        <span class="badge">Pinned Announcement</span>
        <h3>Team Updates</h3>
        <p class="muted">Important announcements, incidents, and POS updates for staff.</p>
      </div>
      <button id="groupChatAnnouncementMinimizeBtn" class="icon-btn group-chat-announcement-minimize-btn" onclick="toggleGroupChatAnnouncement()" title="Minimize announcement">
        −
      </button>
    </section>

    <div class="group-chat-channel-control-row">
      <button id="groupChatChannelMinimizeBtn" class="btn small group-chat-channel-minimize-btn" onclick="toggleGroupChatChannels()" title="Minimize channels">
        Hide Channels
      </button>
    </div>

    <section class="group-chat-layout">
      <aside class="group-chat-sidebar card">
        <div class="group-chat-section-head">
          <h3>Channels</h3>
          <button class="icon-btn" onclick="toggleGroupChatChannels()">—</button>
        </div>

        <div id="groupChatChannels" class="group-chat-channels">
          ${GROUP_CHAT_CHANNELS.map(channel => channelButton(channel)).join("")}
        </div>
      </aside>

      <main class="group-chat-main card">
        <div id="groupChatHeader" class="group-chat-header"></div>
        <div id="groupChatMessages" class="group-chat-messages"></div>
        <div id="groupChatComposer" class="group-chat-composer"></div>
      </main>

      <aside class="group-chat-right card">
        <div class="group-chat-panel">
          <h3>Pinned Messages</h3>
          <div class="mini-card">
            <strong>Reminder</strong>
            <p class="muted">Always include ORD# when reporting order concerns.</p>
          </div>
        </div>

        <div class="group-chat-panel">
          <h3>Members</h3>
          <div class="group-chat-members">
            ${GROUP_CHAT_MEMBERS.map(member => `
              <div class="group-chat-member">
                <div>
                  <strong>${member.name}</strong>
                  <small>${member.role}</small>
                </div>
                <span class="badge">${member.status}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="group-chat-panel">
          <h3>Chat Settings</h3>
          <p class="muted">Admin can manage channel visibility by role later.</p>
        </div>
      </aside>
    </section>
  </div>
`);

function channelButton(channel){
  return `
    <button class="group-chat-channel ${channel.id === activeGroupChatChannel ? "active" : ""}" onclick="setGroupChatChannel('${channel.id}')">
      <span>${channel.name}</span>
      ${channel.badge ? `<small>${channel.badge}</small>` : ""}
    </button>
  `;
}

function setGroupChatChannel(channelId){
  activeGroupChatChannel = channelId;

  document.querySelectorAll(".group-chat-channel").forEach(button => {
    button.classList.toggle(
      "active",
      button.textContent.trim().toLowerCase().startsWith(getActiveChannel().name.toLowerCase())
    );
  });

  renderGroupChat();
}

function getActiveChannel(){
  return GROUP_CHAT_CHANNELS.find(channel => channel.id === activeGroupChatChannel) || GROUP_CHAT_CHANNELS[0];
}

function renderGroupChat(){
  const channel = getActiveChannel();

  document.getElementById("groupChatHeader").innerHTML = `
    <div>
      <h3>${channel.name}</h3>
      <p class="muted">${channel.description}</p>
    </div>
    <div class="group-chat-header-actions">
      ${channel.readonly ? `<span class="badge">Read Only</span>` : `<span class="badge">Team Chat</span>`}
      <button class="btn small">Search</button>
    </div>
  `;

  if(channel.id === "schedule"){
    renderGroupSchedule();
  }else{
    renderGroupMessages(channel);
  }

  renderGroupComposer(channel);
}

function renderGroupMessages(channel){
  const messages = GROUP_CHAT_MESSAGES[channel.id] || [];

  document.getElementById("groupChatMessages").innerHTML = messages.length
    ? messages.map(message => `
      <div class="chat-message ${message.type === "system" ? "system-log" : ""}">
        <div class="chat-message-top">
          <div>
            <strong>${message.author}</strong>
            <small>${message.role}</small>
          </div>
          <span class="muted">${message.time}</span>
        </div>
        <p>${message.text}</p>
        <div class="chat-message-actions">
          <button class="btn small">Reply</button>
          <button class="btn small">React</button>
          ${message.type === "staff" ? `<button class="btn small">Edit</button>` : ""}
        </div>
      </div>
    `).join("")
    : `<div class="mini-card">No messages yet.</div>`;
}

function renderGroupSchedule(){
  document.getElementById("groupChatMessages").innerHTML = `
    <div class="schedule-grid">
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

function renderGroupComposer(channel){
  const composer = document.getElementById("groupChatComposer");

  if(channel.readonly){
    composer.innerHTML = `
      <div class="group-chat-readonly">
        <span class="badge">Read Only</span>
        <p class="muted">This channel is view-only. Messages are created by system logs or admin schedule updates.</p>
      </div>
    `;
    return;
  }

  composer.innerHTML = `
    <div class="composer-actions">
      <button class="btn small">Emoji</button>
      <button class="btn small">Mention Staff</button>
      <button class="btn small">Mention Order</button>
    </div>
    <div class="composer-row">
      <input id="groupChatInput" placeholder="Type a message">
      <button class="btn primary">Send</button>
    </div>
  `;
}

function toggleGroupChatAnnouncement(){
  const announcement = document.querySelector(".group-chat-announcement");
  const button = document.getElementById("groupChatAnnouncementMinimizeBtn");

  announcement?.classList.toggle("is-minimized");

  if(button){
    const minimized = announcement?.classList.contains("is-minimized");
    button.textContent = minimized ? "+" : "−";
    button.title = minimized ? "Show announcement" : "Minimize announcement";
  }
}

function toggleGroupChatChannels(){
  groupChatChannelsMinimized = !groupChatChannelsMinimized;

  const layout = document.querySelector(".group-chat-layout");
  const button = document.getElementById("groupChatChannelMinimizeBtn");

  layout?.classList.toggle("channels-minimized", groupChatChannelsMinimized);

  if(button){
    button.textContent = groupChatChannelsMinimized ? "Open Channels" : "Hide Channels";
    button.title = groupChatChannelsMinimized ? "Show channels" : "Minimize channels";
  }
}

renderGroupChat();
