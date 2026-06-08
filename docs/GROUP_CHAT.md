# Group Chat Structure

## Purpose

Group Chat is the internal staff communication page for the POS system.

Group Chat is different from Unified-Message:

- Group Chat = internal staff chat.
- Unified-Message = customer chat inbox.

---

## Main Group Chat Structure

```txt
Group Chat
├── Header Announcement
├── Team Channels
├── Chat Message Area
├── Pinned Messages
├── Message Composer
├── Mention Order Preview
├── Members Panel
└── Admin Profile Settings
```

---

## Header Announcement

```txt
Header Announcement
├── Current Announcement Title
├── Current Announcement Message
├── Announcement Type optional
│   ├── General
│   ├── Operations
│   ├── Inventory
│   └── Orders
├── Posted By
├── Date / Time
├── + Announcement button
└── View All Announcements
```

### Announcement Rules

```txt
Announcement = quick top header notice.
Pinned Message = important saved chat message.
No Pin Announcement needed because messages already support Pin / Unpin.
```

### Staff Announcement Flow

```txt
Staff opens Group Chat
→ taps + Announcement
→ enters Title
→ enters Message
→ optional Type
→ posts announcement
→ announcement appears in Header Announcement
```

---

## Team Channels

```txt
Team Channels
├── System Message
├── General
├── Sales
├── Kitchen
├── Delivery
├── Riders
├── Schedule
├── Issues
└── Chitchat
```

### Channel Notes

```txt
System Message = automatic POS logs only.
General = all staff general communication.
Sales = sales/cashier communication.
Kitchen = kitchen preparation communication.
Delivery = delivery staff communication.
Riders = rider dispatch communication.
Schedule = weekly staff duty schedule.
Issues = problems, incidents, delayed orders.
Chitchat = casual staff chat.
```

---

## Chat Message Area

```txt
Chat Message Area
├── Messages
├── Reply
├── React
├── Edit Msg
└── Pin / Unpin Message
```

### Message Action Rules

```txt
Reply = reply to a message.
React = emoji reaction.
Edit Msg = edit own sent message if role allows.
Pin / Unpin Message = pin important chat message if role allows.
Delete = removed / not included.
```

---

## Pinned Messages

```txt
Pinned Messages
├── Important pinned chat messages
├── Order reminders
├── Delivery reminders
├── Kitchen reminders
└── Team notes
```

### Pin Flow

```txt
Staff/admin sends normal chat message
→ uses Pin / Unpin Message
→ message appears in Pinned Messages
```

---

## Message Composer

```txt
Message Composer
├── Text input
├── Emoji
├── Mention Staff
├── Mention Order
└── Send
```

### Composer Rules

```txt
Composer is hidden or read-only when role cannot send.
System Message has no composer because it is automated logs only.
Schedule channel uses schedule editing tools, not normal chat sending.
```

---

## Mention Order Preview

```txt
Mention Order Preview
├── Order ID
├── Customer Info
├── Recipient Info
├── Delivery / Pickup Info
├── Items
├── Payment Status
└── Tracking Link
```

---

## Members Panel

```txt
Members Panel
├── Online Members
└── Offline Members
```

---

# Admin Profile Settings

```txt
Admin Profile Settings
├── Admin Profile
├── Announcement & Pin Controls
├── Channel Management
├── System Message Controls
└── Notification Controls
```

---

## Admin Profile

```txt
Admin Profile
├── Admin Name
├── Role
├── Status
└── Status Message
```

---

## Announcement & Pin Controls

```txt
Announcement & Pin Controls
├── Announcement Settings
│   ├── Default Announcement Title
│   ├── Default Announcement Message
│   └── Show Announcement ON/OFF
│
└── Role Permissions
    ├── Role
    ├── Create Announcement ON/OFF
    └── Pin / Unpin Message ON/OFF
```

### Suggested Role Permissions

```txt
Role              Create Announcement   Pin / Unpin Msg
Owner/Admin       ON                    ON
Admin             ON                    ON
Manager           ON                    ON
Sales             ON                    ON
Kitchen Staff     ON                    ON
Delivery Staff    ON                    ON
Inventory Staff   ON                    ON
Cashier           OFF                   OFF
Rider             OFF                   OFF
```

### Meaning

```txt
Create Announcement = can create top header announcement.
Pin / Unpin Msg = can pin or unpin important chat messages.
```

---

## Channel Management

```txt
Channel Management
├── Channel Tabs
│   ├── System Message
│   ├── General
│   ├── Sales
│   ├── Kitchen
│   ├── Delivery
│   ├── Riders
│   ├── Schedule
│   ├── Issues
│   └── Chitchat
│
├── Channel Mode
│   ├── Read Only ON/OFF
│   └── Locked rules for special channels
│
└── Role Permission Matrix
    ├── Role
    ├── View ON/OFF
    ├── Send ON/OFF
    └── Edit label depends on channel type
```

### Channel Permission Labels

```txt
System Message → View | Send | Manage
Schedule       → View | Send | Edit Schedule
Normal Chat    → View | Send | Edit Msg
```

### Permission Meaning

```txt
View = role can see/open the channel.
Send = role can send messages in the channel.
Edit Msg = role can edit own sent message.
Manage = role can manage System Message settings.
Edit Schedule = role can edit the weekly schedule.
```

### Special Channel Rules

```txt
System Message
├── Read Only = LOCKED ON
├── Send = OFF / disabled
├── Manage = who can manage System Message settings
└── Staff cannot manually send system messages

Schedule
├── Read Only = LOCKED ON
├── Send = OFF / disabled
├── Edit Schedule = who can edit schedule
└── Staff can view only unless role has Edit Schedule ON

Normal Channels
├── View = can see channel
├── Send = can send message
└── Edit Msg = can edit own message
```

---

## System Message Controls

```txt
System Message Controls
├── Order Updates ON/OFF
├── Kitchen Updates ON/OFF
├── Delivery Updates ON/OFF
└── Stock Updates ON/OFF
```

### Meaning

```txt
System Message Controls = choose which automatic POS logs appear in System Message.
```

### Examples

```txt
Order Updates ON
→ "Order ORD-1025 was created."

Kitchen Updates ON
→ "Kitchen marked ORD-1027 Ready."

Delivery Updates ON
→ "Order ORD-1024 assigned to Rider Juan."

Stock Updates ON
→ "Low stock warning: Paper Cups below reorder level."
```

---

## Notification Controls

```txt
Notification Controls
├── Mute Notifications ON/OFF
└── Show Read Receipts ON/OFF
```

---

# Database Suggestions

## chatChannels

```txt
chatChannels
├── channelId
├── channelName
├── description
├── icon
├── order
├── readOnly
├── isSystem
├── isSchedule
├── allowedRoles
├── canSendRoles
├── canEditRoles
├── createdAt
└── updatedAt
```

## chatMessages

```txt
chatMessages
├── messageId
├── channelId
├── senderId
├── senderName
├── senderRole
├── messageText
├── mentions
├── mentionedOrderId
├── reactions
├── isPinned
├── pinnedBy
├── pinnedAt
├── editedAt
├── createdAt
└── updatedAt
```

## announcements

```txt
announcements
├── announcementId
├── title
├── message
├── type
├── postedById
├── postedByName
├── postedByRole
├── isActive
├── createdAt
└── updatedAt
```

## groupChatSettings

```txt
groupChatSettings
├── showAnnouncement
├── announcementCreateRoles
├── pinMessageRoles
├── systemMessageControls
│   ├── orderUpdates
│   ├── kitchenUpdates
│   ├── deliveryUpdates
│   └── stockUpdates
├── muteNotifications
├── showReadReceipts
├── updatedBy
└── updatedAt
```

---

# Final Rules

```txt
Announcement = quick top header notice.
Pinned Message = important saved chat message.
System Message = automatic POS logs only.
Schedule = weekly staff duty schedule.
No separate Pin Announcement because Pin / Unpin Message already exists.
```

Final staff flows:

```txt
Create Announcement:
Group Chat Header → + Announcement → Title → Message → Post

Pin Message:
Chat Message → Pin / Unpin Message → appears in Pinned Messages

Edit Schedule:
Schedule Channel → Edit Schedule, only allowed roles

System Message:
Automatic logs only, no staff composer
```
