const GROUP_CHAT_CHANNELS = [
  { id: "system", name: "System Message", icon: "🔔", count: 1, desc: "Read-only", readonly: true },
  { id: "general", name: "General", icon: "👥", count: 4, desc: "23 members, 4 online" },
  { id: "sales", name: "Sales", icon: "📈", count: 2, desc: "Sales and cashier updates" },
  { id: "kitchen", name: "Kitchen", icon: "🍳", count: 1, desc: "Kitchen preparation updates" },
  { id: "delivery", name: "Delivery", icon: "🚚", count: 3, desc: "Delivery coordination" },
  { id: "riders", name: "Riders", icon: "🛵", count: 2, desc: "Rider dispatch updates" },
  { id: "schedule", name: "Schedule", icon: "📅", count: 1, desc: "Weekly staff schedule", readonly: true },
  { id: "issues", name: "Issues", icon: "⚠️", count: 2, desc: "Problems and incidents" },
  { id: "chitchat", name: "Chitchat", icon: "#", count: 3, desc: "Casual staff chat" }
];

const GROUP_CHAT_MESSAGES = {
  system: [
    { name: "System", role: "POS", avatar: "S", time: "9:00 AM", text: "Order ORD-1024 was sent to Delivery.", reactions: "✅ 12" },
    { name: "System", role: "Inventory", avatar: "S", time: "9:05 AM", text: "Ingredient deduction recorded for ORD-1023.", reactions: "👍 8" },
    { name: "System", role: "Kitchen", avatar: "S", time: "9:12 AM", text: "Order ORD-1022 marked Ready.", reactions: "✅ 10" }
  ],
  general: [
    { name: "Maria Santos", role: "Manager", avatar: "MS", time: "9:15 AM", text: "Good morning team! Let’s crush it today and make it a great day for our customers.", reactions: "❤️ 7 🎉 2" },
    { name: "Jake Thompson", role: "Shift Supervisor", avatar: "JT", time: "9:17 AM", text: "Morning! The lunch rush looks busy—kitchen, let’s stay ahead! 💪", reactions: "👍 2" },
    { name: "Leah Nguyen", role: "Kitchen Lead", avatar: "LN", time: "9:24 AM", text: "On it! Prep list is done and team is all set. ✅", reactions: "🙌 3" },
    { name: "Rohit Patel", role: "Delivery Coordinator", avatar: "RP", time: "9:28 AM", text: "Delivery update: 2 new riders starting today. Welcome aboard!", reactions: "🎉 2" },
    { name: "Alex Rivera", role: "Ops Manager", avatar: "AR", time: "9:32 AM", text: "Heads up: We’re low on cups. Ordering more now.", reactions: "" }
  ],
  sales: [
    { name: "Marlon", role: "Sales", avatar: "M", time: "9:15 AM", text: "Customer asked for delivery update on ORD-1024.", reactions: "👍 2" }
  ],
  kitchen: [
    { name: "Kitchen Staff", role: "Kitchen", avatar: "KS", time: "9:20 AM", text: "Preparing pantry orders first.", reactions: "✅ 3" }
  ],
  delivery: [
    { name: "Delivery Staff", role: "Delivery", avatar: "DS", time: "9:30 AM", text: "Waiting for rider assignment.", reactions: "👍 2" }
  ],
  riders: [
    { name: "Rider Team", role: "Rider", avatar: "RT", time: "9:35 AM", text: "Available riders: Juan, Carlo.", reactions: "🛵 2" }
  ],
  issues: [
    { name: "Admin", role: "Manager", avatar: "A", time: "Yesterday", text: "Log any delayed orders here with order ID.", reactions: "" }
  ],
  chitchat: [
    { name: "Team", role: "Staff", avatar: "T", time: "Yesterday", text: "Welcome to Chitchat.", reactions: "😊 3" }
  ]
};


function addGroupChatScrollTestMessages(){
  const extra = {
    system: [
      { name: "System", role: "Orders", avatar: "S", time: "9:18 AM", text: "Order ORD-1025 was created from POS Terminal.", reactions: "✅ 4" },
      { name: "System", role: "Delivery", avatar: "S", time: "9:22 AM", text: "Order ORD-1024 assigned to Rider Juan.", reactions: "🛵 3" },
      { name: "System", role: "Pickup", avatar: "S", time: "9:28 AM", text: "Pickup order ORD-1026 is waiting pickup.", reactions: "📦 2" },
      { name: "System", role: "Stock", avatar: "S", time: "9:34 AM", text: "Low stock warning: Paper Cups below reorder level.", reactions: "⚠️ 5" },
      { name: "System", role: "Kitchen", avatar: "S", time: "9:40 AM", text: "Kitchen marked ORD-1027 Ready.", reactions: "✅ 6" }
    ],
    general: [
      { name: "Maria Santos", role: "Manager", avatar: "MS", time: "9:36 AM", text: "Please keep customer updates clear and include order IDs when asking for help.", reactions: "👍 4" },
      { name: "Jake Thompson", role: "Shift Supervisor", avatar: "JT", time: "9:39 AM", text: "Sales team, please double-check payment status before sending orders to kitchen.", reactions: "✅ 3" },
      { name: "Leah Nguyen", role: "Kitchen Lead", avatar: "LN", time: "9:43 AM", text: "Kitchen prep is on track. Rush orders will be prioritized.", reactions: "🔥 2" },
      { name: "Rohit Patel", role: "Delivery Coordinator", avatar: "RP", time: "9:46 AM", text: "Delivery riders should confirm pickup before leaving the store.", reactions: "🛵 2" },
      { name: "Alex Rivera", role: "Ops Manager", avatar: "AR", time: "9:50 AM", text: "Inventory check after lunch. Please report missing packaging items.", reactions: "📦 3" }
    ],
    sales: [
      { name: "Marlon", role: "Sales", avatar: "M", time: "9:22 AM", text: "Customer confirmed payment for ORD-1028.", reactions: "✅ 2" },
      { name: "Ana", role: "Cashier", avatar: "A", time: "9:27 AM", text: "GCash reference received for pantry order.", reactions: "💸 2" },
      { name: "Marlon", role: "Sales", avatar: "M", time: "9:33 AM", text: "Need item availability check for Mango Sago 1L.", reactions: "👀 1" },
      { name: "Ana", role: "Cashier", avatar: "A", time: "9:38 AM", text: "Customer requested rush delivery for today.", reactions: "⚡ 3" },
      { name: "Marlon", role: "Sales", avatar: "M", time: "9:44 AM", text: "Follow-up sent to customer for missing recipient contact number.", reactions: "📞 2" }
    ],
    kitchen: [
      { name: "Kitchen Staff", role: "Kitchen", avatar: "KS", time: "9:25 AM", text: "Mango Sago batch is ready for packing.", reactions: "✅ 3" },
      { name: "Leah", role: "Kitchen Lead", avatar: "L", time: "9:30 AM", text: "Start preparing ORD-1029 after current batch.", reactions: "🍽️ 2" },
      { name: "Kitchen Staff", role: "Kitchen", avatar: "KS", time: "9:36 AM", text: "Need more paper cups from inventory.", reactions: "🥤 2" },
      { name: "Leah", role: "Kitchen Lead", avatar: "L", time: "9:42 AM", text: "ORD-1030 is ready for delivery handoff.", reactions: "✅ 4" },
      { name: "Kitchen Staff", role: "Kitchen", avatar: "KS", time: "9:49 AM", text: "Rush order prep started.", reactions: "🔥 3" }
    ],
    delivery: [
      { name: "Rohit", role: "Delivery", avatar: "R", time: "9:31 AM", text: "Rider Juan accepted ORD-1024.", reactions: "🛵 2" },
      { name: "Delivery Staff", role: "Delivery", avatar: "DS", time: "9:35 AM", text: "Waiting for rider assignment for ORD-1031.", reactions: "⏳ 1" },
      { name: "Rohit", role: "Delivery", avatar: "R", time: "9:41 AM", text: "Please confirm address landmark before dispatch.", reactions: "📍 2" },
      { name: "Delivery Staff", role: "Delivery", avatar: "DS", time: "9:47 AM", text: "ORD-1024 is now out for delivery.", reactions: "✅ 3" },
      { name: "Rohit", role: "Delivery", avatar: "R", time: "9:55 AM", text: "Delivered orders should be marked immediately after confirmation.", reactions: "👍 2" }
    ],
    riders: [
      { name: "Juan", role: "Rider", avatar: "J", time: "9:32 AM", text: "Accepted ORD-1024. Heading to pickup.", reactions: "🛵 2" },
      { name: "Carlo", role: "Rider", avatar: "C", time: "9:37 AM", text: "Available for next delivery.", reactions: "✅ 1" },
      { name: "Juan", role: "Rider", avatar: "J", time: "9:45 AM", text: "Package received. Leaving store now.", reactions: "📦 2" },
      { name: "Carlo", role: "Rider", avatar: "C", time: "9:52 AM", text: "Traffic near Makati, expect slight delay.", reactions: "⚠️ 2" },
      { name: "Juan", role: "Rider", avatar: "J", time: "10:01 AM", text: "Customer contacted, delivery address confirmed.", reactions: "📞 1" }
    ],
    issues: [
      { name: "Admin", role: "Manager", avatar: "A", time: "9:20 AM", text: "Report any delayed order here with reason and order ID.", reactions: "📌 2" },
      { name: "Marlon", role: "Sales", avatar: "M", time: "9:26 AM", text: "Customer for ORD-1032 is not responding.", reactions: "📞 1" },
      { name: "Delivery Staff", role: "Delivery", avatar: "DS", time: "9:33 AM", text: "Address for ORD-1033 needs landmark confirmation.", reactions: "📍 2" },
      { name: "Inventory", role: "Stock", avatar: "I", time: "9:45 AM", text: "Cup lid stock count mismatch found.", reactions: "⚠️ 3" },
      { name: "Admin", role: "Manager", avatar: "A", time: "9:58 AM", text: "Issue noted. Please update once resolved.", reactions: "✅ 1" }
    ],
    chitchat: [
      { name: "Team", role: "Staff", avatar: "T", time: "9:10 AM", text: "Good morning everyone!", reactions: "😊 4" },
      { name: "Maria", role: "Manager", avatar: "MS", time: "9:18 AM", text: "Coffee is ready in the pantry.", reactions: "☕ 3" },
      { name: "Jake", role: "Shift Supervisor", avatar: "JT", time: "9:24 AM", text: "Let’s have a smooth day.", reactions: "💪 2" },
      { name: "Leah", role: "Kitchen", avatar: "LN", time: "9:31 AM", text: "Lunch break schedule posted later.", reactions: "🍽️ 2" },
      { name: "Alex", role: "Ops", avatar: "AR", time: "9:40 AM", text: "Thanks team, keep it up!", reactions: "🎉 3" }
    ]
  };

  Object.keys(extra).forEach(channelId => {
    GROUP_CHAT_MESSAGES[channelId] = [
      ...(GROUP_CHAT_MESSAGES[channelId] || []),
      ...extra[channelId]
    ];
  });
}

addGroupChatScrollTestMessages();

const GROUP_CHAT_MEMBERS = [
  { name: "Maria Santos", role: "Manager", status: "Online", tag: "Admin", avatar: "MS" },
  { name: "Jake Thompson", role: "Shift Supervisor", status: "Online", tag: "Admin", avatar: "JT" },
  { name: "Leah Nguyen", role: "Kitchen Lead", status: "Online", tag: "", avatar: "LN" },
  { name: "Rohit Patel", role: "Delivery Coordinator", status: "Online", tag: "", avatar: "RP" },
  { name: "Alex Rivera", role: "Ops Manager", status: "Offline", tag: "", avatar: "AR" }
];

const GROUP_CHAT_SCHEDULE = [
  { date: "Jun 1", day: "Mon", staff: "Admin, Sales, Kitchen" },
  { date: "Jun 2", day: "Tue", staff: "Admin, Sales, Delivery" },
  { date: "Jun 3", day: "Wed", staff: "Admin, Kitchen, Riders" },
  { date: "Jun 4", day: "Thu", staff: "Sales, Kitchen, Delivery" },
  { date: "Jun 5", day: "Fri", staff: "Admin, Sales, Riders" },
  { date: "Jun 6", day: "Sat", staff: "Sales, Kitchen" },
  { date: "Jun 7", day: "Sun", staff: "Admin, Delivery" }
];

const GROUP_CHAT_ANNOUNCEMENTS = [
  {
    title: "Delivery meeting at 3:00 PM",
    message: "Please update rider status before noon. Delivery team should check pending dispatch orders.",
    tag: "Operations"
  },
  {
    title: "Low stock reminder",
    message: "Cups and banana leaves are running low. Inventory staff should confirm remaining stock today.",
    tag: "Inventory"
  },
  {
    title: "Rush order reminder",
    message: "Mark urgent customer requests as Rush before sending to Kitchen or Delivery.",
    tag: "Orders"
  },
  {
    title: "Long announcement test for delivery, kitchen, sales, riders, pickup, and inventory coordination today",
    message: "This is a long announcement sample. Please check all pending orders, update delivery rider assignment, confirm kitchen preparation status, verify pickup schedules, review low-stock ingredients, and make sure every team member checks the correct channel before starting their shift.",
    tag: "Long Test"
  }
];

let activeGroupChatAnnouncementIndex = 0;

let activeGroupChatChannel = "general";
let groupChatChannelsOpen = true;
let groupChatAnnouncementOpen = true;
let groupChatMembersOpen = false;
let groupChatOrderPreviewOpen = false;
let groupChatAdminSettingsOpen = false;
let groupChatScheduleEditMode = false;

shell(`
  <div class="group-chat-ref-app">
    <aside id="groupChatChannelsPanel" class="group-chat-ref-panel group-chat-ref-channels">
      <section class="group-chat-ref-announcement">
        <div class="group-chat-ref-icon">📣</div>
        <div>
          <strong id="groupChatSidebarAnnouncementTitle">Header Announcement</strong>
          <p id="groupChatSidebarAnnouncementText">Loading announcement...</p>
        </div>
        <button class="icon-btn group-chat-announcement-arrow" data-announcement-action="hide" onclick="toggleGroupChatAnnouncement(this)" title="Minimize announcement">⌃</button>
      </section>

      <div class="group-chat-ref-channel-head group-chat-ref-channel-head-clean">
        <span>Team Channels</span>
      </div>

      <div class="group-chat-channel-scroll-area">
        <div id="groupChatChannelList" class="group-chat-ref-channel-list"></div>

        <div class="group-chat-ref-profile">
          <div class="group-chat-ref-avatar">MS</div>
          <div>
            <strong>Maria Santos</strong>
            <small>Manager</small>
          </div>
          <button class="icon-btn" onclick="toggleGroupChatAdminSettings()" title="Admin Profile Settings">⚙</button>
        </div>
      </div>
    </aside>

    <main class="group-chat-ref-chat">
      <header class="group-chat-ref-chat-head group-chat-ref-chat-head-clean">
        <div>
          <h3 id="groupChatActiveName">General</h3>
          <p id="groupChatActiveDesc">23 members, 4 online</p>
        </div>
        <button class="group-chat-ref-members-btn" onclick="toggleGroupChatMembers()">👥</button>
        <button class="group-chat-ref-channels-btn" onclick="toggleGroupChatChannels()">Channels</button>
      </header>

      <section id="groupChatSlimAnnouncement" class="group-chat-ref-slim-announcement">
        <span>📣</span>
        <div class="group-chat-announcement-copy">
          <strong id="groupChatSlimAnnouncementText">Announcement</strong>
          <p id="groupChatSlimAnnouncementMessage"></p>
        </div>
        <button class="group-chat-announcement-next" onclick="nextGroupChatAnnouncement()" title="Next sample announcement">Next</button>
        <button class="group-chat-announcement-arrow" data-announcement-action="hide" onclick="toggleGroupChatAnnouncement(this)" title="Minimize announcement">⌃</button>
      </section>

      <button class="group-chat-ref-pinned-row" onclick="toggleGroupChatOrderPreview()">
        📌 Pinned <strong>3</strong> <span>›</span>
      </button>

      <section id="groupChatBody" class="group-chat-ref-body"></section>

      <footer id="groupChatComposer" class="group-chat-ref-composer"></footer>
    </main>

    <aside id="groupChatRightPanel" class="group-chat-ref-panel group-chat-ref-right">
      <div id="groupChatOrderPreview" class="group-chat-order-preview"></div>
      <div class="group-chat-ref-pinned">
        <h3>📌 Pinned Messages</h3>
        <div class="group-chat-ref-mini-row">Ops Update: New POS update live. <small>May 19</small></div>
        <div class="group-chat-ref-mini-row">Inventory check every Monday 8 AM. <small>May 18</small></div>
        <div class="group-chat-ref-mini-row">Delivery meeting at 3:00 PM daily. <small>May 17</small></div>
      </div>
    </aside>

    <aside id="groupChatMembersPanel" class="group-chat-ref-panel group-chat-ref-members-panel">
      <div class="group-chat-ref-members-head">
        <h2>Members</h2>
        
      </div>

      <div class="group-chat-ref-members-list">
        <section class="group-chat-members-section">
          <h3>Online Members</h3>
          ${GROUP_CHAT_MEMBERS.filter(member => String(member.status).toLowerCase() === "online").map(member => `
            <div class="group-chat-ref-member">
              <div class="group-chat-ref-avatar">${member.avatar}</div>
              <div>
                <strong>${member.name}</strong>
                <small>${member.role}</small>
              </div>
              <span class="group-chat-ref-status online">Online</span>
            </div>
          `).join("")}
        </section>

        <section class="group-chat-members-section">
          <h3>Offline Members</h3>
          ${GROUP_CHAT_MEMBERS.filter(member => String(member.status).toLowerCase() !== "online").map(member => `
            <div class="group-chat-ref-member offline">
              <div class="group-chat-ref-avatar">${member.avatar}</div>
              <div>
                <strong>${member.name}</strong>
                <small>${member.role}</small>
              </div>
              <span class="group-chat-ref-status offline">Offline</span>
            </div>
          `).join("")}
        </section>
      </div>

      <button class="group-chat-ref-leave" onclick="toggleGroupChatMembers()">Close Members</button>
    </aside>

    <aside id="groupChatAdminSettingsPanel" class="group-chat-admin-settings-panel">
      <div class="group-chat-admin-settings-head">
        <div>
          <h2>Admin Profile Settings</h2>
          <p class="muted">Owner/Admin controls for Group Chat</p>
        </div>
        <button class="icon-btn" onclick="toggleGroupChatAdminSettings()">×</button>
      </div>

      <section class="group-chat-admin-card">
        <h3>1. Admin Profile</h3>
        <div class="group-chat-admin-profile-grid">
          <div class="group-chat-admin-avatar">MS</div>

          <label>Admin Name
            <input value="Maria Santos">
          </label>

          <label>Role
            <select>
              <option>Owner / Admin</option>
              <option>Manager</option>
            </select>
          </label>

          <label>Status
            <select>
              <option>Online</option>
              <option>Busy</option>
              <option>Away</option>
            </select>
          </label>

          <label class="wide">Status Message
            <input value="Managing the shop">
          </label>
        </div>
      </section>

      <section class="group-chat-admin-card">
        <h3>2. Announcement Controls</h3>

        <label>Announcement Title
          <input value="Operations: Delivery meeting at 3:00 PM">
        </label>

        <label>Announcement Message
          <textarea rows="3">Please update rider status before noon. Delivery team should check pending dispatch orders.</textarea>
        </label>

        <div class="group-chat-admin-toggle-row">
          <span>Pin Announcement</span>
          <button class="group-chat-admin-toggle active">On</button>
        </div>

        <div class="group-chat-admin-toggle-row">
          <span>Show Announcement</span>
          <button class="group-chat-admin-toggle active">On</button>
        </div>
      </section>

      <section class="group-chat-admin-card">
        <h3>3. Channel Management</h3>

        <div class="group-chat-admin-channel-table">
          ${GROUP_CHAT_CHANNELS.map(channel => {
            const roleMap = {
              system: {
                allowed: "Admin, Manager, Sales, Cashier, Kitchen, Delivery, Rider, Inventory",
                send: "System only",
                edit: "Admin only",
                mode: "Read-only"
              },
              general: {
                allowed: "Admin, Manager, Sales, Cashier, Kitchen, Delivery, Inventory",
                send: "Allowed staff",
                edit: "Admin, Manager",
                mode: "Can Send"
              },
              sales: {
                allowed: "Admin, Manager, Sales, Cashier",
                send: "Admin, Manager, Sales, Cashier",
                edit: "Admin, Manager",
                mode: "Can Send"
              },
              kitchen: {
                allowed: "Admin, Manager, Kitchen Staff",
                send: "Admin, Manager, Kitchen Staff",
                edit: "Admin, Manager",
                mode: "Can Send"
              },
              delivery: {
                allowed: "Admin, Manager, Delivery Staff",
                send: "Admin, Manager, Delivery Staff",
                edit: "Admin, Manager",
                mode: "Can Send"
              },
              riders: {
                allowed: "Admin, Manager, Delivery Staff, Rider",
                send: "Admin, Manager, Delivery Staff, Rider",
                edit: "Admin, Manager",
                mode: "Can Send"
              },
              schedule: {
                allowed: "Admin, Manager, Staff",
                send: "Admin edit only",
                edit: "Admin only",
                mode: "Staff View-only"
              },
              issues: {
                allowed: "Admin, Manager, Sales, Kitchen, Delivery, Inventory",
                send: "Allowed staff",
                edit: "Admin, Manager",
                mode: "Can Send"
              },
              chitchat: {
                allowed: "Admin, Manager, Sales, Cashier, Kitchen, Delivery, Inventory",
                send: "Allowed staff",
                edit: "Admin, Manager",
                mode: "Can Send"
              }
            };

            const rules = roleMap[channel.id] || {
              allowed: "Admin, Manager",
              send: "Allowed staff",
              edit: "Admin, Manager",
              mode: channel.readOnly ? "Read-only" : "Can Send"
            };

            return `
              <div class="group-chat-admin-channel-role-card">
                <div class="group-chat-admin-channel-top">
                  <strong>${channel.icon || "💬"} ${channel.name}</strong>
                  <div>
                    <button class="group-chat-admin-mini active">Show</button>
                    <button class="group-chat-admin-mini ${channel.readOnly ? "active" : ""}">${rules.mode}</button>
                  </div>
                </div>

                <div class="group-chat-admin-role-lines">
                  <p><b>Allowed:</b> ${rules.allowed}</p>
                  <p><b>Can Send:</b> ${rules.send}</p>
                  <p><b>Can Edit:</b> ${rules.edit}</p>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </section>

      <section class="group-chat-admin-card group-chat-admin-two">
        <div>
          <h3>4. Schedule Permission</h3>
          <p>🔒 Admin can edit schedule</p>
          <p>👥 Staff view-only</p>
        </div>

        <div>
          <h3>5. System Message Controls</h3>
          <p>✅ Order Updates</p>
          <p>✅ Kitchen Updates</p>
          <p>✅ Delivery Updates</p>
          <p>✅ Stock Updates</p>
        </div>
      </section>

      <section class="group-chat-admin-card">
        <h3>6. Notification Controls</h3>

        <div class="group-chat-admin-toggle-row">
          <span>Mute Notifications</span>
          <button class="group-chat-admin-toggle">Off</button>
        </div>

        <div class="group-chat-admin-toggle-row">
          <span>Show Read Receipts</span>
          <button class="group-chat-admin-toggle active">On</button>
        </div>
      </section>

      <div class="group-chat-admin-actions">
        <button class="btn btn-primary">Save Settings</button>
        <button class="btn" onclick="toggleGroupChatAdminSettings()">Close</button>
      </div>
    </aside>
  </div>
`);

function renderGroupChatAnnouncement(){
  const announcement = GROUP_CHAT_ANNOUNCEMENTS[activeGroupChatAnnouncementIndex] || GROUP_CHAT_ANNOUNCEMENTS[0];

  const sidebarTitle = document.getElementById("groupChatSidebarAnnouncementTitle");
  const sidebarText = document.getElementById("groupChatSidebarAnnouncementText");
  const slimText = document.getElementById("groupChatSlimAnnouncementText");
  const slimMessage = document.getElementById("groupChatSlimAnnouncementMessage");

  if(sidebarTitle){
    sidebarTitle.textContent = groupChatAnnouncementOpen
      ? `${announcement.tag}: ${announcement.title}`
      : "Announcement";
  }

  if(sidebarText){
    sidebarText.textContent = groupChatAnnouncementOpen ? announcement.message : "";
  }

  if(slimText){
    slimText.textContent = groupChatAnnouncementOpen
      ? `${announcement.tag}: ${announcement.title}`
      : "Announcement";
  }

  if(slimMessage){
    slimMessage.textContent = groupChatAnnouncementOpen ? announcement.message : "";
  }
}

function nextGroupChatAnnouncement(){
  activeGroupChatAnnouncementIndex = (activeGroupChatAnnouncementIndex + 1) % GROUP_CHAT_ANNOUNCEMENTS.length;
  renderGroupChatAnnouncement();
}


const GROUP_CHAT_CHANNEL_ICONS = {
  system: "🔔",
  system_message: "🔔",
  general: "👥",
  sales: "📈",
  kitchen: "🍳",
  delivery: "🚚",
  riders: "🏃",
  schedule: "📅",
  issues: "⚠️",
  chitchat: "#"
};

function normalizeGroupChatFirebaseChannel(channel){
  const rawId = channel.channelId || channel.id || channel.channelKey || "";
  const frontendId = rawId === "system_message" ? "system" : rawId;

  return {
    ...channel,
    id: frontendId,
    firestoreId: rawId,
    name: channel.channelName || channel.name || frontendId,
    icon: channel.icon || GROUP_CHAT_CHANNEL_ICONS[frontendId] || "💬",
    desc: channel.description || channel.desc || "",
    count: channel.count || 0,
    readonly: Boolean(channel.readOnly || channel.readonly)
  };
}

async function loadGroupChatChannelsFromFirebase(){
  if(!window.FIB_FIREBASE_READY || !window.FIB?.getGroupChatChannels){
    console.warn("Group Chat Firebase channels not ready. Using sample channels.");
    return false;
  }

  const channels = await window.FIB.getGroupChatChannels();

  if(!Array.isArray(channels) || !channels.length){
    console.warn("No Firebase chatChannels found. Using sample channels.");
    return false;
  }

  const normalized = channels.map(normalizeGroupChatFirebaseChannel);

  GROUP_CHAT_CHANNELS.splice(0, GROUP_CHAT_CHANNELS.length, ...normalized);

  if(!GROUP_CHAT_CHANNELS.some(channel => channel.id === activeGroupChatChannel)){
    activeGroupChatChannel = GROUP_CHAT_CHANNELS[0]?.id || "general";
  }

  return true;
}

async function initGroupChat(){
  renderGroupChat();

  try{
    const loaded = await loadGroupChatChannelsFromFirebase();
    if(loaded){
      renderGroupChat();
      console.log("Group Chat channels loaded from Firebase.");
    }
  }catch(error){
    console.warn("Group Chat Firebase channel load failed:", error);
  }
}



let groupChatMessageLoadToken = 0;

function getGroupChatFirestoreChannelId(channel){
  if(!channel) return "general";
  if(channel.firestoreId) return channel.firestoreId;
  if(channel.id === "system") return "system_message";
  return channel.id;
}

function formatGroupChatMessageTime(value){
  try{
    const date = value?.toDate ? value.toDate() : null;
    if(!date) return "";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }catch(error){
    return "";
  }
}

function normalizeGroupChatFirebaseMessage(message){
  return {
    id: message.id || message.messageId || "",
    avatar: message.senderAvatar || String(message.senderName || "S").charAt(0).toUpperCase(),
    name: message.senderName || "Staff",
    role: message.senderRole || "",
    time: formatGroupChatMessageTime(message.createdAt),
    text: message.messageText || "",
    reactions: Array.isArray(message.reactions) && message.reactions.length
      ? message.reactions.join(" ")
      : ""
  };
}

async function loadActiveGroupChatMessagesFromFirebase(){
  const channel = getActiveChannel();

  if(!channel || channel.id === "schedule"){
    return false;
  }

  if(!window.FIB_FIREBASE_READY || !window.FIB?.getGroupChatMessages){
    return false;
  }

  const loadToken = ++groupChatMessageLoadToken;
  const firestoreChannelId = getGroupChatFirestoreChannelId(channel);

  try{
    const firebaseMessages = await window.FIB.getGroupChatMessages(firestoreChannelId);

    if(loadToken !== groupChatMessageLoadToken){
      return false;
    }

    if(getActiveChannel().id !== channel.id){
      return false;
    }

    if(Array.isArray(firebaseMessages)){
      GROUP_CHAT_MESSAGES[channel.id] = firebaseMessages.map(normalizeGroupChatFirebaseMessage);
      renderGroupChatMessages(channel);
      return true;
    }
  }catch(error){
    console.warn("Group Chat message load failed:", error);
  }

  return false;
}

async function sendGroupChatMessageFromComposer(){
  const channel = getActiveChannel();

  if(!channel || channel.readonly){
    alert("You can’t send messages in this channel.");
    return;
  }

  const input = document.getElementById("groupChatMessageInput");
  const messageText = input?.value?.trim();

  if(!messageText){
    return;
  }

  try{
    input.disabled = true;

    if(!window.FIB_FIREBASE_READY || !window.FIB?.sendGroupChatMessage){
      throw new Error("Firebase chat message service is not ready.");
    }

    await window.FIB.sendGroupChatMessage(
      getGroupChatFirestoreChannelId(channel),
      messageText
    );

    input.value = "";
    await loadActiveGroupChatMessagesFromFirebase();
  }catch(error){
    alert("Send failed: " + (error.message || error));
  }finally{
    input.disabled = false;
    input.focus();
  }
}

function handleGroupChatComposerKeydown(event){
  if(event.key === "Enter"){
    event.preventDefault();
    sendGroupChatMessageFromComposer();
  }
}

window.sendGroupChatMessageFromComposer = sendGroupChatMessageFromComposer;
window.handleGroupChatComposerKeydown = handleGroupChatComposerKeydown;


function renderGroupChat(){
  const channel = getActiveChannel();

  document.getElementById("groupChatActiveName").textContent = channel.name;
  document.getElementById("groupChatActiveDesc").textContent = channel.desc;

  renderGroupChatAnnouncement();
  renderGroupChatChannels();

  if(channel.id === "schedule"){
    renderGroupChatSchedule();
  }else{
    renderGroupChatMessages(channel);
  }

  renderGroupChatComposer(channel);
  renderGroupChatOrderPreview();
  applyGroupChatViewState();
  loadActiveGroupChatMessagesFromFirebase();
  updateGroupChatAnnouncementArrow();
}

function renderGroupChatChannels(){
  const wrap = document.getElementById("groupChatChannelList");

  wrap.innerHTML = GROUP_CHAT_CHANNELS.map(channel => `
    <button class="group-chat-ref-channel ${channel.id === activeGroupChatChannel ? "active" : ""}" onclick="openGroupChatChannel('${channel.id}')">
      <span class="group-chat-ref-channel-icon">${channel.icon}</span>
      <span>
        <strong>${channel.name}</strong>
        ${channel.readonly ? `<small>🔒 ${channel.desc}</small>` : ""}
      </span>
      <em>${channel.count}</em>
    </button>
  `).join("");
}

function renderGroupChatMessages(channel){
  const messages = GROUP_CHAT_MESSAGES[channel.id] || [];

  document.getElementById("groupChatBody").innerHTML = `
    <section class="group-chat-channel-chatbox" data-channel="${channel.id}">
      <div class="group-chat-channel-scroll">
        <div class="group-chat-ref-message-list">
          ${messages.map(message => `
            <article class="group-chat-ref-message">
              <div class="group-chat-ref-avatar">${message.avatar}</div>
              <div>
                <div class="group-chat-ref-message-meta">
                  <strong>${message.name}</strong>
                  <span>${message.time}</span>
                </div>
                <p>${message.text}</p>
                ${message.reactions ? `<div class="group-chat-ref-reactions">${message.reactions}</div>` : ""}
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderGroupChatSchedule(){
  document.getElementById("groupChatBody").innerHTML = `
    <section class="group-chat-channel-chatbox" data-channel="schedule">
      <div class="group-chat-channel-scroll">
        <div class="group-chat-schedule-toolbar">
          <div>
            <strong>Weekly Staff Schedule</strong>
            <small>Admin can edit. Staff view-only.</small>
          </div>

          <div class="group-chat-schedule-actions">
            ${
              groupChatScheduleEditMode
                ? `
                  <button class="group-chat-schedule-btn save" onclick="saveGroupChatSchedule()">Save</button>
                  <button class="group-chat-schedule-btn" onclick="cancelGroupChatScheduleEdit()">Cancel</button>
                `
                : `<button class="group-chat-schedule-btn edit" onclick="toggleGroupChatScheduleEdit()">Edit Schedule</button>`
            }
          </div>
        </div>

        <div class="group-chat-ref-schedule ${groupChatScheduleEditMode ? "editing" : ""}">
          ${GROUP_CHAT_SCHEDULE.map((day, index) => `
            <div class="group-chat-schedule-day-card">
              <strong>${day.date}</strong>
              <small>${day.day}</small>

              ${
                groupChatScheduleEditMode
                  ? `<textarea data-schedule-index="${index}" rows="3">${day.staff}</textarea>`
                  : `<p>${day.staff}</p>`
              }
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderGroupChatComposer(channel){
  const composer = document.getElementById("groupChatComposer");

  if(channel.readonly){
    composer.innerHTML = `<div class="group-chat-ref-readonly">You can’t send messages in this channel.</div>`;
    return;
  }

  composer.innerHTML = `
    <input id="groupChatMessageInput" placeholder="Type a message..." onkeydown="handleGroupChatComposerKeydown(event)">
    <button class="icon-btn">😊</button>
    <button class="icon-btn" onclick="toggleGroupChatOrderPreview()">@</button>
    <button class="group-chat-ref-send" onclick="sendGroupChatMessageFromComposer()">➤</button>
  `;
}

function renderGroupChatOrderPreview(){
  const wrap = document.getElementById("groupChatOrderPreview");

  wrap.innerHTML = `
    <div class="group-chat-ref-preview-head">
      <h3>Mention Order Preview</h3>
      <button class="icon-btn" onclick="toggleGroupChatOrderPreview()">×</button>
    </div>

    <div class="group-chat-ref-order-card">
      <div class="group-chat-ref-order-top">
        <strong>ORD-2048</strong>
        <span class="badge">Ready for Delivery</span>
      </div>

      <p><span>Customer</span><strong>Emily Johnson</strong></p>
      <p><span>Recipient</span><strong>Emily Johnson</strong></p>
      <p><span>Delivery</span><strong>May 21, 2025 • 12:30 PM</strong></p>
      <p><span>Type</span><strong>Delivery</strong></p>

      <div class="group-chat-ref-order-items">
        <p><strong>1x Chicken Teriyaki Bowl</strong><span>₱699</span></p>
        <p><strong>1x Iced Thai Tea</strong><span>₱190</span></p>
      </div>

      <button class="btn primary">Insert in Chat</button>
    </div>
  `;
}

function openGroupChatChannel(channelId){
  activeGroupChatChannel = channelId;

  const isTrueDesktop = window.innerWidth >= 1101;

  // Mobile/tablet/desktop-mobile: open selected chat screen.
  // True desktop: keep channel list visible and update center chat.
  groupChatChannelsOpen = isTrueDesktop;

  groupChatMembersOpen = false;
  groupChatOrderPreviewOpen = false;

  // If not true desktop, close admin settings so chat can open.
  if(!isTrueDesktop){
    groupChatAdminSettingsOpen = false;
  }

  renderGroupChat();

  requestAnimationFrame(() => {
    groupChatChannelsOpen = window.innerWidth >= 1101;
    applyGroupChatViewState();
  });
}

function setGroupChatChannel(channelId){
  openGroupChatChannel(channelId);
}

function getActiveChannel(){
  return GROUP_CHAT_CHANNELS.find(channel => channel.id === activeGroupChatChannel) || GROUP_CHAT_CHANNELS[0];
}

function toggleGroupChatChannels(){
  const isTrueDesktop = window.innerWidth >= 1101;

  if(isTrueDesktop){
    groupChatChannelsOpen = true;
  }else{
    groupChatChannelsOpen = !groupChatChannelsOpen;
    groupChatAdminSettingsOpen = false;
    groupChatMembersOpen = false;
    groupChatOrderPreviewOpen = false;
  }

  applyGroupChatViewState();
}

function toggleGroupChatMembers(){
  groupChatMembersOpen = !groupChatMembersOpen;

  const isTrueDesktop = window.innerWidth >= 1101;

  if(groupChatMembersOpen){
    groupChatAdminSettingsOpen = false;
    groupChatOrderPreviewOpen = false;

    // Mobile + desktop-mobile should show Members as focused panel.
    // True desktop can keep channels/chat visible.
    if(!isTrueDesktop){
      groupChatChannelsOpen = false;
    }
  }

  applyGroupChatViewState();
}

function toggleGroupChatOrderPreview(){
  groupChatOrderPreviewOpen = !groupChatOrderPreviewOpen;
  applyGroupChatViewState();
}

function toggleGroupChatAnnouncement(button){
  const action = button?.dataset?.announcementAction || "";

  if(action === "expand"){
    groupChatAnnouncementOpen = true;
  }else if(action === "compact"){
    groupChatAnnouncementOpen = false;
  }else{
    groupChatAnnouncementOpen = !groupChatAnnouncementOpen;
  }

  applyGroupChatViewState();
  updateGroupChatAnnouncementArrow();
}

function updateGroupChatAnnouncementArrow(){
  renderGroupChatAnnouncement();

  document.querySelectorAll(".group-chat-announcement-arrow").forEach(button => {
    button.textContent = groupChatAnnouncementOpen ? "⌃" : "⌄";
    button.title = groupChatAnnouncementOpen ? "Compact announcement" : "Show full announcement";
    button.dataset.announcementAction = groupChatAnnouncementOpen ? "compact" : "expand";
  });
}

function toggleGroupChatAdminSettings(){
  groupChatAdminSettingsOpen = !groupChatAdminSettingsOpen;
  groupChatMembersOpen = false;
  groupChatOrderPreviewOpen = false;
  applyGroupChatViewState();
}

function toggleGroupChatScheduleEdit(){
  groupChatScheduleEditMode = true;
  renderGroupChatSchedule();
}

function cancelGroupChatScheduleEdit(){
  groupChatScheduleEditMode = false;
  renderGroupChatSchedule();
}

function saveGroupChatSchedule(){
  document.querySelectorAll("[data-schedule-index]").forEach(input => {
    const index = Number(input.dataset.scheduleIndex);
    if(GROUP_CHAT_SCHEDULE[index]){
      GROUP_CHAT_SCHEDULE[index].staff = input.value.trim() || "No schedule";
    }
  });

  groupChatScheduleEditMode = false;
  renderGroupChatSchedule();
}

function applyGroupChatViewState(){
  document.querySelector(".group-chat-ref-app")?.classList.toggle("channels-open", groupChatChannelsOpen);
  document.querySelector(".group-chat-ref-app")?.classList.toggle("members-open", groupChatMembersOpen);
  document.querySelector(".group-chat-ref-app")?.classList.toggle("order-preview-open", groupChatOrderPreviewOpen);
  document.querySelector(".group-chat-ref-app")?.classList.toggle("admin-settings-open", groupChatAdminSettingsOpen);
  document.querySelector(".group-chat-ref-app")?.classList.toggle("announcement-hidden", !groupChatAnnouncementOpen);
}

initGroupChat();

window.setGroupChatChannel = setGroupChatChannel;
window.openGroupChatChannel = openGroupChatChannel;
window.toggleGroupChatChannels = toggleGroupChatChannels;
window.toggleGroupChatMembers = toggleGroupChatMembers;
window.toggleGroupChatAdminSettings = toggleGroupChatAdminSettings;
window.toggleGroupChatOrderPreview = toggleGroupChatOrderPreview;
window.toggleGroupChatAnnouncement = toggleGroupChatAnnouncement;
window.nextGroupChatAnnouncement = nextGroupChatAnnouncement;
window.toggleGroupChatScheduleEdit = toggleGroupChatScheduleEdit;
window.cancelGroupChatScheduleEdit = cancelGroupChatScheduleEdit;
window.saveGroupChatSchedule = saveGroupChatSchedule;

/* TEMP DEBUG: Group Chat admin settings size checker */
function showGroupChatAdminDebug(){
  const panel = document.querySelector(".group-chat-admin-settings-panel");
  const actions = document.querySelector(".group-chat-admin-actions");
  const app = document.querySelector(".group-chat-ref-app");

  const data = {
    width: window.innerWidth,
    height: window.innerHeight,
    appClass: app?.className || "missing",
    panelDisplay: panel ? getComputedStyle(panel).display : "missing",
    panelHeight: panel ? getComputedStyle(panel).height : "missing",
    panelOverflowY: panel ? getComputedStyle(panel).overflowY : "missing",
    panelScrollHeight: panel?.scrollHeight || 0,
    panelClientHeight: panel?.clientHeight || 0,
    canScroll: panel ? panel.scrollHeight > panel.clientHeight : false,
    actionsPosition: actions ? getComputedStyle(actions).position : "missing"
  };

  let box = document.getElementById("groupChatDebugBox");
  if(!box){
    box = document.createElement("pre");
    box.id = "groupChatDebugBox";
    box.style.cssText = `
      position:fixed;
      left:10px;
      right:10px;
      bottom:10px;
      z-index:999999;
      max-height:45vh;
      overflow:auto;
      background:#020617;
      color:#22c55e;
      border:1px solid #22c55e;
      border-radius:12px;
      padding:10px;
      font-size:11px;
      white-space:pre-wrap;
    `;
    document.body.appendChild(box);
  }

  box.textContent = JSON.stringify(data, null, 2);
}

window.showGroupChatAdminDebug = showGroupChatAdminDebug;
