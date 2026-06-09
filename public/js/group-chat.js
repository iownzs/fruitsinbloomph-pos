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


let groupChatScheduleWeekOffset = 0;

function getGroupChatWeekDates(offsetWeeks = 0){
  const today = new Date();
  const day = today.getDay();
  const mondayDiff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + mondayDiff + (offsetWeeks * 7));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      key: date.toISOString().slice(0, 10),
      staff: ""
    };
  });
}

const GROUP_CHAT_SCHEDULE_STAFF = {
  0: ["Admin", "Sales", "Kitchen"],
  1: ["Admin", "Sales", "Delivery"],
  2: ["Admin", "Kitchen", "Riders"],
  3: ["Sales", "Kitchen", "Delivery"],
  4: ["Admin", "Sales", "Riders"],
  5: ["Sales", "Kitchen"],
  6: ["Admin", "Delivery"]
};

let GROUP_CHAT_SCHEDULE = buildGroupChatSchedule();

function buildGroupChatSchedule(){
  return getGroupChatWeekDates(groupChatScheduleWeekOffset).map((day, index) => {
    const staffRows = GROUP_CHAT_SCHEDULE_STAFF[index] || [];
    return {
      ...day,
      staff: staffRows.filter(Boolean).join("\n")
    };
  });
}

function refreshGroupChatSchedule(){
  GROUP_CHAT_SCHEDULE = buildGroupChatSchedule();
}

function changeGroupChatScheduleWeek(direction){
  groupChatScheduleWeekOffset += direction;
  refreshGroupChatSchedule();
  groupChatScheduleEditMode = false;
  renderGroupChatScheduleHeaderActions();
  renderGroupChatSchedule();
}

function resetGroupChatScheduleWeek(){
  groupChatScheduleWeekOffset = 0;
  refreshGroupChatSchedule();
  groupChatScheduleEditMode = false;
  renderGroupChatScheduleHeaderActions();
  renderGroupChatSchedule();
}


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
let activeGroupChatAdminChannel = "general";

/* Group Chat role permissions */
const GROUP_CHAT_ROLE_PERMISSIONS = {
  system: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"],
    canSendRoles: [],
    canEditRoles: ["Owner/Admin", "Admin"],
    readOnly: true,
    systemOnly: true
  },
  general: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"],
    canSendRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"],
    canEditRoles: ["Owner/Admin", "Admin", "Manager"],
    readOnly: false
  },
  sales: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier"],
    canSendRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier"],
    canEditRoles: ["Owner/Admin", "Admin", "Manager"],
    readOnly: false
  },
  kitchen: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Kitchen Staff"],
    canSendRoles: ["Owner/Admin", "Admin", "Manager", "Kitchen Staff"],
    canEditRoles: ["Owner/Admin", "Admin", "Manager"],
    readOnly: false
  },
  delivery: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Delivery Staff", "Rider"],
    canSendRoles: ["Owner/Admin", "Admin", "Manager", "Delivery Staff"],
    canEditRoles: ["Owner/Admin", "Admin", "Manager"],
    readOnly: false
  },
  riders: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Delivery Staff", "Rider"],
    canSendRoles: ["Owner/Admin", "Admin", "Manager", "Delivery Staff", "Rider"],
    canEditRoles: ["Owner/Admin", "Admin", "Manager"],
    readOnly: false
  },
  schedule: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"],
    canSendRoles: ["Owner/Admin", "Admin"],
    canEditRoles: ["Owner/Admin", "Admin"],
    readOnly: true,
    staffViewOnly: true
  },
  issues: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"],
    canSendRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"],
    canEditRoles: ["Owner/Admin", "Admin", "Manager"],
    readOnly: false
  },
  chitchat: {
    allowedRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"],
    canSendRoles: ["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"],
    canEditRoles: ["Owner/Admin", "Admin", "Manager"],
    readOnly: false
  }
};

function getCurrentGroupChatUserRole(){
  // Real login user from login.js should be the source of truth.
  const userStorageKeys = [
    "posUser",
    "currentUser",
    "fibCurrentUser",
    "fibUser",
    "user",
    "staffUser",
    "loggedInUser",
    "authUser"
  ];

  for(const key of userStorageKeys){
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);

    if(!raw){
      continue;
    }

    try{
      const user = JSON.parse(raw);
      const parsedRole =
        user.role ||
        user.userRole ||
        user.staffRole ||
        user.accountRole ||
        user.permissionRole;

      if(parsedRole){
        return parsedRole;
      }
    }catch(error){
      // Ignore non-JSON storage values.
    }
  }

  // Test role fallback only. This should not override real posUser login.
  const directRole =
    sessionStorage.getItem("userRole") ||
    sessionStorage.getItem("role") ||
    sessionStorage.getItem("currentUserRole") ||
    sessionStorage.getItem("fibUserRole") ||
    localStorage.getItem("userRole") ||
    localStorage.getItem("role") ||
    localStorage.getItem("currentUserRole") ||
    localStorage.getItem("fibUserRole");

  if(directRole){
    return directRole;
  }

  // Safe fallback: normal staff access, not admin.
  return "Sales";
}

function getCurrentGroupChatUserProfile(){
  const role = normalizeGroupChatRole(getCurrentGroupChatUserRole());

  const possibleUserKeys = [
    "currentUser",
    "fibCurrentUser",
    "fibUser",
    "user",
    "staffUser",
    "loggedInUser",
    "authUser"
  ];

  for(const key of possibleUserKeys){
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);

    if(!raw){
      continue;
    }

    try{
      const user = JSON.parse(raw);
      const name =
        user.name ||
        user.displayName ||
        user.fullName ||
        user.staffName ||
        user.username ||
        user.email ||
        role;

      return {
        name,
        role,
        avatar: String(name || role || "U").trim().slice(0, 1).toUpperCase()
      };
    }catch(error){
      // Ignore non-JSON values.
    }
  }

  const fallbackName = role === "Sales" ? "Sales" : role;

  return {
    name: fallbackName,
    role,
    avatar: String(fallbackName || "U").trim().slice(0, 1).toUpperCase()
  };
}

function normalizeGroupChatRole(role){
  const rawRole = String(role || "Owner/Admin").trim();
  const key = rawRole.toLowerCase().replace(/[_-]+/g, " ");

  const aliases = {
    "owner": "Owner/Admin",
    "owner/admin": "Owner/Admin",
    "owner / admin": "Owner/Admin",
    "owner admin": "Owner/Admin",
    "admin": "Admin",
    "manager": "Manager",
    "sales": "Sales",
    "sales staff": "Sales",
    "cashier": "Cashier",
    "kitchen": "Kitchen Staff",
    "kitchen staff": "Kitchen Staff",
    "delivery": "Delivery Staff",
    "delivery staff": "Delivery Staff",
    "rider": "Rider",
    "inventory": "Inventory Staff",
    "inventory staff": "Inventory Staff"
  };

  return aliases[key] || rawRole;
}

function getGroupChatChannelRules(channelId){
  return GROUP_CHAT_ROLE_PERMISSIONS[channelId] || GROUP_CHAT_ROLE_PERMISSIONS.general;
}

function canViewGroupChatChannel(channelId){
  const role = normalizeGroupChatRole(getCurrentGroupChatUserRole());
  const rules = getGroupChatChannelRules(channelId);
  return rules.allowedRoles.includes(role);
}

function canSendGroupChatChannel(channelId){
  const role = normalizeGroupChatRole(getCurrentGroupChatUserRole());
  const rules = getGroupChatChannelRules(channelId);
  return !rules.readOnly && rules.canSendRoles.includes(role);
}

function canEditGroupChatChannel(channelId){
  const role = normalizeGroupChatRole(getCurrentGroupChatUserRole());
  const rules = getGroupChatChannelRules(channelId);
  return rules.canEditRoles.includes(role);
}

function getVisibleGroupChatChannels(){
  const visibleChannels = GROUP_CHAT_CHANNELS.filter(channel => canViewGroupChatChannel(channel.id));

  if(visibleChannels.length){
    return visibleChannels;
  }

  // Safe fallback: show only System + General if role data is missing/mismatched.
  return GROUP_CHAT_CHANNELS.filter(channel => ["system", "system_message", "general"].includes(channel.id));
}



const GROUP_CHAT_ROLE_OPTIONS = [
  "Owner/Admin",
  "Admin",
  "Manager",
  "Sales",
  "Cashier",
  "Kitchen Staff",
  "Delivery Staff",
  "Rider",
  "Inventory Staff"
];

function renderGroupChatRoleCheckboxes(channelId, permissionKey){
  const rules = getGroupChatChannelRules(channelId);
  const selectedRoles = rules[permissionKey] || [];

  return GROUP_CHAT_ROLE_OPTIONS.map(role => `
    <label class="group-chat-admin-role-check">
      <input
        type="checkbox"
        data-channel-id="${channelId}"
        data-perm="${permissionKey}"
        value="${role}"
        ${selectedRoles.includes(role) ? "checked" : ""}
      >
      <span>${role}</span>
    </label>
  `).join("");
}

function getActiveGroupChatAdminChannel(){
  return GROUP_CHAT_CHANNELS.find(channel => channel.id === activeGroupChatAdminChannel) || GROUP_CHAT_CHANNELS[0];
}

function setGroupChatAdminChannel(channelId){
  activeGroupChatAdminChannel = channelId;
  renderGroupChatAdminChannelManagement();
}

function renderGroupChatAdminChannelManagement(){
  const wrap = document.getElementById("groupChatAdminChannelManagement");

  if(!wrap){
    return;
  }

  const selectedChannel = getActiveGroupChatAdminChannel();

  wrap.innerHTML = `
    <div class="group-chat-admin-channel-tabs">
      ${GROUP_CHAT_CHANNELS.map(channel => `
        <button
          class="group-chat-admin-channel-tab ${channel.id === selectedChannel.id ? "active" : ""}"
          onclick="setGroupChatAdminChannel('${channel.id}')"
        >
          <span>${channel.icon || "💬"}</span>
          <strong>${channel.name}</strong>
        </button>
      `).join("")}
    </div>

    ${renderGroupChatAdminChannelEditor(selectedChannel)}
  `;
}

function renderGroupChatAdminChannelEditor(channel){
  const rules = getGroupChatChannelRules(channel.id);
  const isScheduleChannel = channel.id === "schedule";
  const isSystemChannel = channel.id === "system";
  const lockedReadOnly = isScheduleChannel || isSystemChannel;
  const readOnly = lockedReadOnly ? true : Boolean(rules.readOnly);
  const editLabel = isScheduleChannel ? "Edit Schedule" : isSystemChannel ? "Manage" : "Edit Msg";
  const channelModeText = isScheduleChannel
    ? "Read Only is locked. Schedule Editing is Admin only."
    : isSystemChannel
      ? "Read Only is locked. System messages are automated only."
      : "Read Only disables sending for this channel.";

  const permissionRows = GROUP_CHAT_ROLE_OPTIONS.map(role => {
    const canView = rules.allowedRoles.includes(role);
    const canSend = lockedReadOnly ? false : rules.canSendRoles.includes(role);
    const canEdit = rules.canEditRoles.includes(role);

    return `
      <div class="group-chat-permission-row">
        <strong>${role}</strong>

        <label class="group-chat-permission-toggle ${canView ? "is-on" : "is-off"}" title="Can View">
          <input
            type="checkbox"
            data-channel-id="${channel.id}"
            data-perm="allowedRoles"
            value="${role}"
            ${canView ? "checked" : ""}
          >
          <span>${canView ? "ON" : "OFF"}</span>
        </label>

        <label class="group-chat-permission-toggle ${canSend ? "is-on" : "is-off"} ${(readOnly || lockedReadOnly) ? "is-disabled" : ""}" title="Can Send">
          <input
            type="checkbox"
            data-channel-id="${channel.id}"
            data-perm="canSendRoles"
            value="${role}"
            ${canSend ? "checked" : ""}
            ${(readOnly || lockedReadOnly) ? "disabled" : ""}
          >
          <span>${lockedReadOnly ? "OFF" : canSend ? "ON" : "OFF"}</span>
        </label>

        <label class="group-chat-permission-toggle ${canEdit ? "is-on" : "is-off"}" title="${editLabel}">
          <input
            type="checkbox"
            data-channel-id="${channel.id}"
            data-perm="canEditRoles"
            value="${role}"
            ${canEdit ? "checked" : ""}
          >
          <span>${canEdit ? "ON" : "OFF"}</span>
        </label>
      </div>
    `;
  }).join("");

  return `
    <div class="group-chat-admin-selected-channel-card group-chat-admin-channel-role-card" data-channel-id="${channel.id}">
      <div class="group-chat-admin-channel-top">
        <div>
          <strong>${channel.icon || "💬"} ${channel.name}</strong>
          <small>${channel.desc || "Channel permissions"}</small>
        </div>
      </div>

      <div class="group-chat-channel-mode-row">
        <div>
          <strong>Channel Mode</strong>
          <small>${channelModeText}</small>
        </div>

        <label class="group-chat-permission-toggle read-only ${readOnly ? "is-on" : "is-off"} ${lockedReadOnly ? "is-disabled" : ""}">
          <input
            type="checkbox"
            data-channel-id="${channel.id}"
            data-perm="readOnly"
            ${readOnly ? "checked" : ""}
            ${lockedReadOnly ? "disabled" : ""}
          >
          <span>${lockedReadOnly ? "LOCKED ON" : readOnly ? "ON" : "OFF"}</span>
        </label>
      </div>

      <div class="group-chat-permission-matrix">
        <div class="group-chat-permission-row head">
          <strong>Role</strong>
          <span>View</span>
          <span>Send</span>
          <span>${editLabel}</span>
        </div>

        ${permissionRows}
      </div>
    </div>
  `;
}

function saveGroupChatAdminSettings(){
  document.querySelectorAll(".group-chat-admin-channel-role-card").forEach(card => {
    const channelId = card.dataset.channelId;

    if(!channelId || !GROUP_CHAT_ROLE_PERMISSIONS[channelId]){
      return;
    }

    const rules = GROUP_CHAT_ROLE_PERMISSIONS[channelId];

    const readOnlyInput = card.querySelector('input[data-perm="readOnly"]');
    rules.readOnly = Boolean(readOnlyInput?.checked);

    ["allowedRoles", "canSendRoles", "canEditRoles"].forEach(permissionKey => {
      rules[permissionKey] = Array.from(
        card.querySelectorAll(`input[data-perm="${permissionKey}"]:checked`)
      ).map(input => input.value);
    });

    if(channelId === "system" || channelId === "schedule"){
      rules.readOnly = true;
      rules.canSendRoles = [];
    }else if(rules.readOnly){
      rules.canSendRoles = [];
    }
  });

  renderGroupChatChannels();
  renderGroupChatComposer(getActiveChannel());
  renderGroupChatAdminChannelManagement();
  applyGroupChatViewState();

  const saveButton = document.querySelector(".group-chat-admin-actions .btn-primary");
  if(saveButton){
    const originalText = saveButton.textContent;
    saveButton.textContent = "Saved";
    setTimeout(() => {
      saveButton.textContent = originalText;
    }, 1200);
  }
}


if(typeof shell !== "function"){
  window.shell = function(html){
    const app = document.getElementById("app");
    if(app){
      app.innerHTML = html;
    }
  };
}

shell(`
  <div class="group-chat-ref-app">
    <aside id="groupChatChannelsPanel" class="group-chat-ref-panel group-chat-ref-channels">
      <section class="group-chat-ref-announcement">
        <div class="group-chat-ref-icon">📣</div>
        <div>
          <strong id="groupChatSidebarAnnouncementTitle">Header Announcement</strong>
          <p id="groupChatSidebarAnnouncementText">Loading announcement...</p>
        </div>
        <button class="icon-btn group-chat-announcement-arrow" data-announcement-action="hide" onclick="toggleGroupChatAnnouncement(this)">⌃</button>
      </section>

      <div class="group-chat-ref-channel-head group-chat-ref-channel-head-clean">
        <span>Team Channels</span>
      </div>

      <div class="group-chat-channel-scroll-area">
        <div id="groupChatChannelList" class="group-chat-ref-channel-list"></div>

        <div class="group-chat-ref-profile">
          <div class="group-chat-ref-avatar">${getCurrentGroupChatUserProfile().avatar}</div>
          <div>
            <strong>${getCurrentGroupChatUserProfile().name}</strong>
            <small>${getCurrentGroupChatUserProfile().role}</small>
          </div>
          ${canEditGroupChatChannel("general") ? `<button class="icon-btn" onclick="toggleGroupChatAdminSettings()" title="Admin Profile Settings">⚙</button>` : ""}
        </div>
      </div>
    </aside>

    <main class="group-chat-ref-chat">
      <header class="group-chat-ref-chat-head group-chat-ref-chat-head-clean">
        <div class="group-chat-ref-chat-title-block">
          <h3 id="groupChatActiveName">General</h3>
          <p id="groupChatActiveDesc">23 members, 4 online</p>
        </div>
        <div class="group-chat-ref-chat-actions">
          <button class="group-chat-ref-members-btn" onclick="toggleGroupChatMembers()">👥</button>
          <span id="groupChatScheduleHeaderActions" class="group-chat-schedule-header-actions"></span>
          <button class="group-chat-ref-channels-btn" onclick="toggleGroupChatChannels()">Channels</button>
        </div>
      </header>

      <section id="groupChatSlimAnnouncement" class="group-chat-ref-slim-announcement">
        <span>📣</span>
        <div class="group-chat-announcement-copy">
          <strong id="groupChatSlimAnnouncementText">Announcement</strong>
          <p id="groupChatSlimAnnouncementMessage"></p>
        </div>
        <button class="group-chat-announcement-next" onclick="nextGroupChatAnnouncement()">Next</button>
        <button class="group-chat-announcement-arrow" data-announcement-action="hide" onclick="toggleGroupChatAnnouncement(this)">⌃</button>
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
        <h3>Admin Profile</h3>
        <div class="group-chat-admin-profile-grid">
          <div class="group-chat-admin-avatar">${getCurrentGroupChatUserProfile().avatar}</div>

          <label>Admin Name
            <input value="${getCurrentGroupChatUserProfile().name}">
          </label>

          <label>Role
            <select>
              <option>${getCurrentGroupChatUserProfile().role}</option>
              <option>Owner / Admin</option>
              <option>Admin</option>
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
        <h3>Announcement / Pin Message Controls</h3>
        <p class="group-chat-admin-note">Manage the active announcement and active pinned message for Group Chat.</p>

        <div class="group-chat-ann-pin-tabs group-chat-ann-pin-tabs-two">
          <button class="group-chat-ann-pin-tab active" type="button" data-ann-pin-tab="announcement" onclick="openGroupChatAnnPinTab('announcement')">📢 Announcement</button>
          <button class="group-chat-ann-pin-tab" type="button" data-ann-pin-tab="pin" onclick="openGroupChatAnnPinTab('pin')">📌 Pin Message</button>
        </div>

        <div class="group-chat-ann-pin-panel active" data-ann-pin-panel="announcement">
          <div class="group-chat-ann-pin-card">
            <p>Only 1 active announcement per channel or group chat.</p>

            <div class="group-chat-ann-pin-list">
              <div class="group-chat-ann-pin-item">
                <span>Create / Edit</span>
                <button class="group-chat-ann-pin-toggle active" type="button" onclick="toggleGroupChatAnnPinControl(this)">ON</button>
              </div>
              <div class="group-chat-ann-pin-item">
                <span>Show / Hide</span>
                <button class="group-chat-ann-pin-toggle active" type="button" onclick="toggleGroupChatAnnPinControl(this)">ON</button>
              </div>
            </div>

            <div class="group-chat-ann-pin-role-card group-chat-ann-role-card">
              <h4>Roles</h4>
              <div class="group-chat-ann-pin-role-head group-chat-ann-role-head">
                <span>ROLE</span>
                <span>CREATE ANN</span>
                <span>SHOW ANN</span>
              </div>

              ${["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"].map((role, index) => {
                const allowed = index <= 2;
                return `
                  <div class="group-chat-ann-pin-role-row group-chat-ann-role-row">
                    <strong>${role}</strong>
                    <button class="group-chat-ann-pin-toggle ${allowed ? "active" : ""}" type="button" onclick="toggleGroupChatAnnPinControl(this)">${allowed ? "ON" : "OFF"}</button>
                    <button class="group-chat-ann-pin-toggle ${allowed ? "active" : ""}" type="button" onclick="toggleGroupChatAnnPinControl(this)">${allowed ? "ON" : "OFF"}</button>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <div class="group-chat-ann-pin-panel" data-ann-pin-panel="pin">
          <div class="group-chat-ann-pin-card">
            <p>Only 1 active pinned message per channel.</p>

            <div class="group-chat-ann-pin-list">
              <div class="group-chat-ann-pin-item">
                <span>Pin New Message</span>
                <button class="group-chat-ann-pin-toggle active" type="button" onclick="toggleGroupChatAnnPinControl(this)">ON</button>
              </div>
              <div class="group-chat-ann-pin-item">
                <span>Unpin Message</span>
                <button class="group-chat-ann-pin-toggle active" type="button" onclick="toggleGroupChatAnnPinControl(this)">ON</button>
              </div>
            </div>

            <div class="group-chat-ann-pin-role-card group-chat-pin-role-card">
              <h4>Roles</h4>
              <div class="group-chat-ann-pin-role-head group-chat-pin-role-head">
                <span>ROLE</span>
                <span>PIN NEW</span>
                <span>UNPIN</span>
              </div>

              ${["Owner/Admin", "Admin", "Manager", "Sales", "Cashier", "Kitchen Staff", "Delivery Staff", "Rider", "Inventory Staff"].map((role, index) => {
                const allowed = index <= 2;
                return `
                  <div class="group-chat-ann-pin-role-row group-chat-pin-role-row">
                    <strong>${role}</strong>
                    <button class="group-chat-ann-pin-toggle ${allowed ? "active" : ""}" type="button" onclick="toggleGroupChatAnnPinControl(this)">${allowed ? "ON" : "OFF"}</button>
                    <button class="group-chat-ann-pin-toggle ${allowed ? "active" : ""}" type="button" onclick="toggleGroupChatAnnPinControl(this)">${allowed ? "ON" : "OFF"}</button>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </section>
      <section class="group-chat-admin-card">
        <h3>Channel Management</h3>
        <p class="muted">Choose one channel, then edit who can view, send, or manage it.</p>
        <div id="groupChatAdminChannelManagement" class="group-chat-admin-channel-management"></div>
      </section>

      <section class="group-chat-admin-card">
        <h3>System Message Controls</h3>

        <div class="group-chat-system-control-list">
          <div class="group-chat-system-control-row">
            <span>Order Updates</span>
            <button class="group-chat-system-toggle active" type="button" data-system-log="orders" onclick="toggleGroupChatSystemControl(this)">ON</button>
          </div>

          <div class="group-chat-system-control-row">
            <span>Kitchen Updates</span>
            <button class="group-chat-system-toggle active" type="button" data-system-log="kitchen" onclick="toggleGroupChatSystemControl(this)">ON</button>
          </div>

          <div class="group-chat-system-control-row">
            <span>Delivery Updates</span>
            <button class="group-chat-system-toggle active" type="button" data-system-log="delivery" onclick="toggleGroupChatSystemControl(this)">ON</button>
          </div>

          <div class="group-chat-system-control-row">
            <span>Stock Updates</span>
            <button class="group-chat-system-toggle active" type="button" data-system-log="stock" onclick="toggleGroupChatSystemControl(this)">ON</button>
          </div>
        </div>
      </section>

      <section class="group-chat-admin-card">
        <h3>Notification Controls</h3>

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
        <button class="btn btn-primary" onclick="saveGroupChatAdminSettings()">Save Settings</button>
        <button class="btn" onclick="toggleGroupChatAdminSettings()">Close</button>
      </div>
    </aside>
  </div>
`);



function toggleGroupChatAnnPinControl(button){
  const isActive = button.classList.toggle("active");
  button.textContent = isActive ? "ON" : "OFF";
}

function openGroupChatAnnPinTab(tab){
  document.querySelectorAll(".group-chat-ann-pin-tab").forEach(button => {
    button.classList.toggle("active", button.dataset.annPinTab === tab);
  });

  document.querySelectorAll(".group-chat-ann-pin-panel").forEach(panel => {
    panel.classList.toggle("active", panel.dataset.annPinPanel === tab);
  });
}

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
let groupChatMessageUnsubscribe = null;

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


function stopGroupChatMessageListener(){
  if(typeof groupChatMessageUnsubscribe === "function"){
    groupChatMessageUnsubscribe();
  }
  groupChatMessageUnsubscribe = null;
}

function startActiveGroupChatMessageListener(){
  const channel = getActiveChannel();

  stopGroupChatMessageListener();

  if(!channel || channel.id === "schedule"){
    return false;
  }

  if(!window.FIB_FIREBASE_READY || !window.FIB?.listenGroupChatMessages){
    return false;
  }

  const firestoreChannelId = getGroupChatFirestoreChannelId(channel);

  try{
    groupChatMessageUnsubscribe = window.FIB.listenGroupChatMessages(firestoreChannelId, firebaseMessages => {
      const currentChannel = getActiveChannel();

      if(!currentChannel || currentChannel.id !== channel.id){
        return;
      }

      GROUP_CHAT_MESSAGES[channel.id] = firebaseMessages.map(normalizeGroupChatFirebaseMessage);
      renderGroupChatMessages(channel);
      scrollGroupChatToBottom();
    });

    return true;
  }catch(error){
    console.warn("Could not start Group Chat realtime listener:", error);
    return false;
  }
}



function scrollGroupChatToBottom(){
  requestAnimationFrame(() => {
    const scrollBox = document.querySelector(".group-chat-channel-scroll");
    if(scrollBox){
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }
  });
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
    scrollGroupChatToBottom();
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
  document.getElementById("groupChatActiveDesc").textContent = `${channel.desc} • Role: ${normalizeGroupChatRole(getCurrentGroupChatUserRole())}`;
  renderGroupChatScheduleHeaderActions();

  renderGroupChatAnnouncement();
  renderGroupChatChannels();

  if(channel.id === "schedule"){
    renderGroupChatSchedule();
  }else{
    renderGroupChatMessages(channel);
  }

  renderGroupChatComposer(channel);
  renderGroupChatOrderPreview();
  renderGroupChatAdminChannelManagement();
  applyGroupChatViewState();

  if(!startActiveGroupChatMessageListener()){
    loadActiveGroupChatMessagesFromFirebase();
  }

  updateGroupChatAnnouncementArrow();
}

function renderGroupChatChannels(){
  const wrap = document.getElementById("groupChatChannelList");

  wrap.innerHTML = getVisibleGroupChatChannels().map(channel => `
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


function escapeGroupChatText(value){
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getGroupChatInput(){
  return document.getElementById("groupChatMessageInput");
}

function insertTextInGroupChatInput(text){
  const input = getGroupChatInput();
  if(!input){
    return;
  }
  const current = input.value || "";
  input.value = current ? `${current} ${text}` : text;
  input.focus();
}

function insertGroupChatEmoji(){
  insertTextInGroupChatInput("😊");
}

function closeGroupChatLiteModal(){
  document.getElementById("groupChatLiteModal")?.remove();
}

function openGroupChatMentionStaff(){
  closeGroupChatLiteModal();
  const modal = document.createElement("div");
  modal.id = "groupChatLiteModal";
  modal.className = "group-chat-modal-lite";
  modal.innerHTML = `
    <div class="group-chat-modal-card">
      <div class="group-chat-modal-head">
        <strong>Mention Staff</strong>
        <button class="group-chat-action-btn" type="button" onclick="closeGroupChatLiteModal()">Close</button>
      </div>
      <div class="group-chat-modal-body">
        <div class="group-chat-modal-list">
          ${GROUP_CHAT_MEMBERS.map(member => `
            <button class="group-chat-modal-choice" type="button" onclick="insertTextInGroupChatInput('@${String(member.name).replace(/'/g, "\'")}'); closeGroupChatLiteModal();">
              ${member.avatar || "👤"} ${member.name} — ${member.role}
            </button>
          `).join("")}
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function openGroupChatMentionOrder(){
  closeGroupChatLiteModal();
  const modal = document.createElement("div");
  modal.id = "groupChatLiteModal";
  modal.className = "group-chat-modal-lite";
  modal.innerHTML = `
    <div class="group-chat-modal-card">
      <div class="group-chat-modal-head">
        <strong>Mention Order</strong>
        <button class="group-chat-action-btn" type="button" onclick="closeGroupChatLiteModal()">Close</button>
      </div>
      <div class="group-chat-modal-body">
        <input id="groupChatOrderMentionInput" class="group-chat-order-input" placeholder="Example: ORD-1024">
        <button class="group-chat-send-btn" type="button" onclick="insertGroupChatOrderMention()">Insert Order Tag</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById("groupChatOrderMentionInput")?.focus(), 50);
}

function insertGroupChatOrderMention(){
  const raw = document.getElementById("groupChatOrderMentionInput")?.value || "";
  const cleaned = raw.trim().toUpperCase();
  if(!cleaned){
    return;
  }
  const orderId = cleaned.startsWith("ORD-") ? cleaned : `ORD-${cleaned.replace(/^ORD[-\s]?/i, "")}`;
  insertTextInGroupChatInput(`#${orderId}`);
  closeGroupChatLiteModal();
}

function replyGroupChatMessage(index){
  const channel = getActiveChannel();
  const message = (GROUP_CHAT_MESSAGES[channel.id] || [])[index];
  if(!message){
    return;
  }
  insertTextInGroupChatInput(`Replying to @${message.name}:`);
}

function reactGroupChatMessage(index){
  const channel = getActiveChannel();
  const message = (GROUP_CHAT_MESSAGES[channel.id] || [])[index];

  if(!message){
    return;
  }

  closeGroupChatLiteModal();

  const emojis = ["❤️", "👍", "😂", "🎉", "✅", "👏", "🙏", "😍", "🔥", "💯", "😮", "😢", "😡", "📌", "⚠️", "🚚", "🛵", "🍓", "🍍", "🥭", "🍫", "🎁", "🧾", "📝"];

  const modal = document.createElement("div");
  modal.id = "groupChatLiteModal";
  modal.className = "group-chat-modal-lite";
  modal.innerHTML = `
    <div class="group-chat-modal-card group-chat-react-modal-card">
      <div class="group-chat-modal-head">
        <strong>React</strong>
        <button class="group-chat-action-btn" type="button" onclick="closeGroupChatLiteModal()">Close</button>
      </div>
      <div class="group-chat-react-picker">
        ${emojis.map(emoji => `
          <button type="button" class="group-chat-react-choice" onclick="toggleGroupChatEmojiReaction(${index}, '${emoji}')">${emoji}</button>
        `).join("")}
      </div>
    </div>`;

  document.body.appendChild(modal);
}


function getGroupChatReactionUserId(){
  const user = (typeof getCurrentGroupChatUser === "function") ? getCurrentGroupChatUser() : null;
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("posUser") || "null");
    } catch(err) {
      return null;
    }
  })();

  return String(
    user?.uid ||
    user?.id ||
    user?.email ||
    user?.name ||
    storedUser?.uid ||
    storedUser?.id ||
    storedUser?.email ||
    storedUser?.username ||
    "current-user"
  );
}


function getGroupChatReactionUserName(){
  const user = (typeof getCurrentGroupChatUser === "function") ? getCurrentGroupChatUser() : null;
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("posUser") || "null");
    } catch(err) {
      return null;
    }
  })();

  return String(
    user?.name ||
    user?.displayName ||
    user?.username ||
    user?.email ||
    storedUser?.name ||
    storedUser?.displayName ||
    storedUser?.username ||
    storedUser?.email ||
    "Current User"
  );
}

function summarizeGroupChatReactionUsers(reactionUsers){
  const counts = {};

  Object.values(reactionUsers || {}).forEach(value => {
    const emoji = typeof value === "string" ? value : value?.emoji;

    if(!emoji){
      return;
    }

    counts[emoji] = (counts[emoji] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([emoji, count]) => `${emoji} ${count}`)
    .join(" ");
}

function toggleGroupChatEmojiReaction(index, emoji){
  const channel = getActiveChannel();
  const message = (GROUP_CHAT_MESSAGES[channel.id] || [])[index];

  if(!message){
    return;
  }

  const userId = getGroupChatReactionUserId();
  const userName = getGroupChatReactionUserName();
  const reactionUsers = message.reactionUsers && typeof message.reactionUsers === "object"
    ? { ...message.reactionUsers }
    : {};

  const currentValue = reactionUsers[userId];
  const currentEmoji = typeof currentValue === "string" ? currentValue : currentValue?.emoji;

  // One reaction per user:
  // same emoji = remove user's reaction
  // different emoji = replace user's old reaction
  if(currentEmoji === emoji){
    delete reactionUsers[userId];
  } else {
    reactionUsers[userId] = {
      emoji,
      name: userName
    };
  }

  message.reactionUsers = reactionUsers;
  message.reactions = summarizeGroupChatReactionUsers(reactionUsers);

  closeGroupChatLiteModal();
  renderGroupChatMessages(channel);
}


function showGroupChatReactionUsers(index){
  const channel = getActiveChannel();
  const message = (GROUP_CHAT_MESSAGES[channel.id] || [])[index];

  if(!message){
    return;
  }

  const reactionUsers = message.reactionUsers && typeof message.reactionUsers === "object"
    ? message.reactionUsers
    : {};

  const rows = Object.values(reactionUsers)
    .map(value => {
      const emoji = typeof value === "string" ? value : value?.emoji;
      const name = typeof value === "string" ? "User" : (value?.name || "User");

      if(!emoji){
        return "";
      }

      return `
        <div class="group-chat-reaction-user-row">
          <span class="group-chat-reaction-user-emoji">${emoji}</span>
          <span class="group-chat-reaction-user-name">${name}</span>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  closeGroupChatLiteModal();

  const modal = document.createElement("div");
  modal.id = "groupChatLiteModal";
  modal.className = "group-chat-modal-lite";
  modal.innerHTML = `
    <div class="group-chat-modal-card group-chat-reaction-users-card">
      <div class="group-chat-modal-head">
        <strong>Reactions</strong>
        <button class="group-chat-action-btn" type="button" onclick="closeGroupChatLiteModal()">Close</button>
      </div>
      <div class="group-chat-reaction-users-list">
        ${rows || `<div class="group-chat-reaction-empty">No reactions yet.</div>`}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function editGroupChatMessage(index){
  const channel = getActiveChannel();
  const message = (GROUP_CHAT_MESSAGES[channel.id] || [])[index];
  if(!message || !canEditGroupChatChannel(channel.id)){
    return;
  }

  closeGroupChatLiteModal();
  const modal = document.createElement("div");
  modal.id = "groupChatLiteModal";
  modal.className = "group-chat-modal-lite";
  modal.innerHTML = `
    <div class="group-chat-modal-card">
      <div class="group-chat-modal-head">
        <strong>Edit Message</strong>
        <button class="group-chat-action-btn" type="button" onclick="closeGroupChatLiteModal()">Close</button>
      </div>
      <div class="group-chat-modal-body">
        <textarea id="groupChatEditMessageInput" class="group-chat-schedule-input">${escapeGroupChatText(message.text)}</textarea>
        <button class="group-chat-send-btn" type="button" onclick="saveLocalGroupChatMessageEdit(${index})">Save Edit</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function saveLocalGroupChatMessageEdit(index){
  const channel = getActiveChannel();
  const message = (GROUP_CHAT_MESSAGES[channel.id] || [])[index];
  const text = document.getElementById("groupChatEditMessageInput")?.value?.trim();
  if(!message || !text){
    return;
  }
  message.text = `${text} (edited)`;
  closeGroupChatLiteModal();
  renderGroupChatMessages(channel);
}


function normalizeGroupChatReactions(reactions){
  if(!reactions){
    return "";
  }

  if(Array.isArray(reactions)){
    return reactions.join(" ");
  }

  return String(reactions);
}

function getGroupChatEmojiList(){
  return [
    "😀","😊","😂","😍","🥰","👍","👏","🙏","❤️","🎉","✅",
    "📌","⚠️","🔔","🕒","❌","📝","🧾","🛒","📦","🎁","💐",
    "🍓","🍍","🥭","🍌","🍎","🍫","🚚","🛵","📍","🏠"
  ];
}

function toggleGroupChatEmojiPanel(){
  const panel = document.getElementById("groupChatEmojiPanel");
  if(!panel){
    return;
  }

  const isOpen = panel.classList.contains("open");
  panel.classList.toggle("open", !isOpen);

  if(!isOpen){
    panel.innerHTML = getGroupChatEmojiList().map(emoji => `
      <button type="button" class="group-chat-emoji-choice" onclick="insertGroupChatEmojiValue('${emoji}')">${emoji}</button>
    `).join("");
  }
}

function insertGroupChatEmojiValue(emoji){
  insertTextInGroupChatInput(emoji);
  document.getElementById("groupChatEmojiPanel")?.classList.remove("open");
}

function insertGroupChatEmoji(){
  toggleGroupChatEmojiPanel();
}

function renderGroupChatMessages(channel){
  const messages = GROUP_CHAT_MESSAGES[channel.id] || [];
  const canEdit = canEditGroupChatChannel(channel.id);

  document.getElementById("groupChatBody").innerHTML = `
${messages.map((message, index) => {
  const avatar = escapeGroupChatText(message.avatar || getInitials(message.name || "User"));
  const name = escapeGroupChatText(message.name || "User");
  const role = escapeGroupChatText(message.role || "");
  const time = escapeGroupChatText(message.time || "");
  const text = escapeGroupChatText(message.text || "").replace(/\n/g, "<br>");
  const reactions = normalizeGroupChatReactions(message.reactions);

  return `
    <article class="group-chat-msg-row" data-message-index="${index}">
      <div class="group-chat-msg-avatar">${avatar}</div>

      <div class="group-chat-msg-main">
        <div class="group-chat-msg-meta">
          <strong>${name}</strong>
          ${role ? `<span>${role}</span>` : ""}
          ${time ? `<span>${time}</span>` : ""}
        </div>

        <div class="group-chat-msg-bubble">${text}</div>

        ${reactions ? `<button class="group-chat-msg-reactions" type="button" onclick="showGroupChatReactionUsers(${index})">${escapeGroupChatText(reactions)}</button>` : ""}

        <div class="group-chat-msg-actions">
          <button type="button" onclick="replyGroupChatMessage(${index})">Reply</button>
          <button type="button" onclick="reactGroupChatMessage(${index})">React</button>
          ${canEdit ? `<button type="button" onclick="editGroupChatMessage(${index})">Edit</button>` : ""}
        </div>
      </div>
    </article>
  `;
}).join("")}
`;
}

function renderGroupChatSchedule(){
  refreshGroupChatSchedule();

  document.getElementById("groupChatBody").innerHTML = `
<div class="group-chat-schedule-head">
  <div class="group-chat-schedule-mobile-controls">
    <div class="group-chat-schedule-edit-row">
      ${groupChatScheduleEditMode ? `
        <button class="group-chat-schedule-btn group-chat-schedule-save" type="button" onclick="saveGroupChatSchedule()">Save Schedule</button>
        <button class="group-chat-schedule-btn" type="button" onclick="cancelGroupChatScheduleEdit()">Cancel</button>
      ` : `${canEditGroupChatChannel("schedule") ? `<button class="group-chat-schedule-btn group-chat-schedule-edit" type="button" onclick="toggleGroupChatScheduleEdit()">Edit Schedule</button>` : ``}`}
    </div>
  </div>
</div>

${groupChatScheduleEditMode ? `
  <div class="group-chat-schedule-floating-actions">
    <button class="group-chat-schedule-floating-save" type="button" onclick="saveGroupChatSchedule()">Save Schedule</button>
    <button class="group-chat-schedule-floating-close" type="button" onclick="cancelGroupChatScheduleEdit()">Close</button>
  </div>
` : ""}

<div class="group-chat-schedule-grid">
  ${GROUP_CHAT_SCHEDULE.map((day, index) => `
    <div class="group-chat-schedule-day">
      <div class="group-chat-schedule-date">${day.date}</div>
      <div class="group-chat-schedule-dayname">${day.day}</div>
      ${groupChatScheduleEditMode ? `
        <textarea class="group-chat-schedule-input" data-schedule-index="${index}" placeholder="Staff name per line, up to 20 rows">${escapeGroupChatText(day.staff).replace(/\\\\n/g, "\\n")}</textarea>
      ` : `
        <div class="group-chat-schedule-staff">${escapeGroupChatText(String(day.staff || "—")).replace(/\\n/g, "<br>").replace(/\n/g, "<br>")}</div>
      `}
    </div>
  `).join("")}
</div>
`;
}


function getGroupChatMentionTrigger(value){
  const text = String(value || "");
  const lastAt = text.lastIndexOf("@");
  const lastHash = text.lastIndexOf("#");
  const triggerIndex = Math.max(lastAt, lastHash);

  if(triggerIndex < 0){
    return null;
  }

  const trigger = text[triggerIndex];
  const query = text.slice(triggerIndex + 1);

  // Stop suggestions if user already typed a space after @ or #
  if(/\s/.test(query)){
    return null;
  }

  return { trigger, query, triggerIndex };
}

function renderGroupChatInlineSuggest(){
  const input = document.getElementById("groupChatMessageInput");
  const panel = document.getElementById("groupChatInlineSuggest");
  if(!input || !panel){
    return;
  }

  const active = getGroupChatMentionTrigger(input.value);

  if(!active){
    panel.classList.remove("open");
    panel.innerHTML = "";
    return;
  }

  if(active.trigger === "@"){
    const q = active.query.toLowerCase();
    const members = GROUP_CHAT_MEMBERS
      .filter(member => !q || String(member.name).toLowerCase().includes(q) || String(member.role).toLowerCase().includes(q))
      .slice(0, 8);

    panel.innerHTML = `
      <div class="group-chat-inline-title">Mention Staff</div>
      ${members.map(member => `
        <button type="button" class="group-chat-inline-choice" onclick="selectGroupChatInlineMention('@${String(member.name).replace(/'/g, "\\'")}')">
          <span>${member.avatar || "👤"}</span>
          <strong>${member.name}</strong>
          <small>${member.role}</small>
        </button>
      `).join("")}
    `;
    panel.classList.add("open");
    return;
  }

  if(active.trigger === "#"){
    const q = active.query.toUpperCase();
    const samples = ["ORD-1024", "ORD-1025", "ORD-1026", "ORD-2026"];
    const orders = samples.filter(order => !q || order.includes(q.replace(/^ORD-?/, "")) || order.includes(q)).slice(0, 8);

    panel.innerHTML = `
      <div class="group-chat-inline-title">Mention Order</div>
      ${orders.map(order => `
        <button type="button" class="group-chat-inline-choice" onclick="selectGroupChatInlineMention('#${order}')">
          <span>🧾</span>
          <strong>${order}</strong>
          <small>Order mention</small>
        </button>
      `).join("")}
    `;
    panel.classList.add("open");
  }
}

function selectGroupChatInlineMention(value){
  const input = document.getElementById("groupChatMessageInput");
  const panel = document.getElementById("groupChatInlineSuggest");
  if(!input){
    return;
  }

  const active = getGroupChatMentionTrigger(input.value);
  if(!active){
    insertTextInGroupChatInput(value);
    return;
  }

  const before = input.value.slice(0, active.triggerIndex);
  const after = input.value.slice(active.triggerIndex + active.query.length + 1);
  input.value = `${before}${value} ${after}`.replace(/\s+$/, " ");
  input.focus();

  panel?.classList.remove("open");
  if(panel){
    panel.innerHTML = "";
  }
}

function handleGroupChatInputTyping(){
  renderGroupChatInlineSuggest();
}

function handleGroupChatInputBlur(){
  setTimeout(() => {
    const panel = document.getElementById("groupChatInlineSuggest");
    panel?.classList.remove("open");
  }, 180);
}

function renderGroupChatComposer(channel){
  const composer = document.getElementById("groupChatComposer");
  if(!composer){
    return;
  }

  if(channel.id === "schedule" || channel.id === "system"){
    composer.innerHTML = "";
    return;
  }

  if(!canSendGroupChatChannel(channel.id)){
    composer.innerHTML = `
<div class="group-chat-readonly-note">
  You can’t send messages in this channel.
</div>`;
    return;
  }

  composer.innerHTML = `
<div class="group-chat-emoji-panel" id="groupChatEmojiPanel"></div>
<div class="group-chat-inline-suggest" id="groupChatInlineSuggest"></div>

<div class="group-chat-composer-messenger">
  <button class="group-chat-mini-tool" type="button" onclick="toggleGroupChatEmojiPanel()" title="Emoji">😊</button>

  <input
    id="groupChatMessageInput"
    class="group-chat-messenger-input"
    type="text"
    placeholder="Message..."
    onkeydown="handleGroupChatComposerKeydown(event)" oninput="handleGroupChatInputTyping()" onblur="handleGroupChatInputBlur()"
  >

  <button class="group-chat-messenger-send" type="button" onclick="sendGroupChatMessageFromComposer()" title="Send">➤</button>
</div>`;
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


function renderGroupChatScheduleHeaderActions(){
  const wrap = document.getElementById("groupChatScheduleHeaderActions");
  if(!wrap){
    return;
  }

  const channel = getActiveChannel();
  const canEditSchedule = channel && channel.id === "schedule" && canEditGroupChatChannel("schedule");

  if(!canEditSchedule){
    wrap.innerHTML = "";
    return;
  }

  wrap.innerHTML = groupChatScheduleEditMode ? "" : `
    <button class="group-chat-schedule-header-icon" type="button" onclick="toggleGroupChatScheduleEdit()" title="Edit Schedule">✏️</button>
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
  const visibleChannels = getVisibleGroupChatChannels();
  const activeChannel = visibleChannels.find(channel => channel.id === activeGroupChatChannel);

  if(activeChannel){
    return activeChannel;
  }

  activeGroupChatChannel = visibleChannels[0]?.id || "general";
  return visibleChannels[0] || GROUP_CHAT_CHANNELS[0];
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
  renderGroupChatScheduleHeaderActions();
  renderGroupChatSchedule();
}

function cancelGroupChatScheduleEdit(){
  groupChatScheduleEditMode = false;
  renderGroupChatScheduleHeaderActions();
  renderGroupChatSchedule();
}

function saveGroupChatSchedule(){
  document.querySelectorAll("[data-schedule-index]").forEach(input => {
    const index = Number(input.dataset.scheduleIndex);
    const rows = input.value
      .split(/\n|,/)
      .map(item => item.trim())
      .filter(Boolean)
      .slice(0, 20);

    GROUP_CHAT_SCHEDULE_STAFF[index] = rows;
  });

  groupChatScheduleEditMode = false;
  refreshGroupChatSchedule();
  renderGroupChatScheduleHeaderActions();
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

window.saveGroupChatAdminSettings = saveGroupChatAdminSettings;

window.setGroupChatAdminChannel = setGroupChatAdminChannel;

document.addEventListener("change", event => {
  const toggle = event.target?.closest?.(".group-chat-permission-toggle");
  if(!toggle){
    return;
  }

  const input = toggle.querySelector("input");
  const label = toggle.querySelector("span");

  if(!input){
    return;
  }

  const channelId = input.dataset.channelId;
  const permissionKey = input.dataset.perm;

  if(channelId && GROUP_CHAT_ROLE_PERMISSIONS[channelId]){
    const rules = GROUP_CHAT_ROLE_PERMISSIONS[channelId];

    if(permissionKey === "readOnly"){
      rules.readOnly = Boolean(input.checked);

      if(rules.readOnly){
        rules.canSendRoles = [];
      }
    }

    if(["allowedRoles", "canSendRoles", "canEditRoles"].includes(permissionKey)){
      const role = input.value;
      const list = Array.isArray(rules[permissionKey]) ? rules[permissionKey] : [];

      if(input.checked && !list.includes(role)){
        list.push(role);
      }

      if(!input.checked){
        rules[permissionKey] = list.filter(item => item !== role);
      }else{
        rules[permissionKey] = list;
      }
    }
  }

  toggle.classList.toggle("is-on", Boolean(input.checked));
  toggle.classList.toggle("is-off", !input.checked);

  if(label){
    label.textContent = input.checked ? "ON" : "OFF";
  }

  if(permissionKey === "readOnly"){
    renderGroupChatAdminChannelManagement();
  }
});

function toggleGroupChatSystemControl(button){
  const isActive = button.classList.toggle("active");
  button.textContent = isActive ? "ON" : "OFF";
}

window.toggleGroupChatSystemControl = toggleGroupChatSystemControl;


window.changeGroupChatScheduleWeek = changeGroupChatScheduleWeek;
window.resetGroupChatScheduleWeek = resetGroupChatScheduleWeek;
window.insertGroupChatEmoji = insertGroupChatEmoji;
window.openGroupChatMentionStaff = openGroupChatMentionStaff;
window.openGroupChatMentionOrder = openGroupChatMentionOrder;
window.insertGroupChatOrderMention = insertGroupChatOrderMention;
window.closeGroupChatLiteModal = closeGroupChatLiteModal;
window.insertTextInGroupChatInput = insertTextInGroupChatInput;
window.replyGroupChatMessage = replyGroupChatMessage;
window.reactGroupChatMessage = reactGroupChatMessage;
window.editGroupChatMessage = editGroupChatMessage;
window.saveLocalGroupChatMessageEdit = saveLocalGroupChatMessageEdit;


window.toggleGroupChatEmojiPanel = toggleGroupChatEmojiPanel;
window.insertGroupChatEmojiValue = insertGroupChatEmojiValue;
window.handleGroupChatInputTyping = handleGroupChatInputTyping;
window.handleGroupChatInputBlur = handleGroupChatInputBlur;
window.selectGroupChatInlineMention = selectGroupChatInlineMention;
window.toggleGroupChatEmojiReaction = toggleGroupChatEmojiReaction;

window.showGroupChatReactionUsers = showGroupChatReactionUsers;

window.openGroupChatAnnPinTab = openGroupChatAnnPinTab;

window.toggleGroupChatAnnPinControl = toggleGroupChatAnnPinControl;
