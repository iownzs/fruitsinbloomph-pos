# Group Chat Structure

Group Chat is the internal team communication module for POS staff.

## Main Sections

```txt
Group Chat
├── Header Announcement
├── Team Channels
├── Chat Message Area
├── Message Composer
├── Mention Order Preview
├── Pinned Messages
├── Members Panel
├── Chat Settings
└── Schedule Channel
```

## Header Announcement

Header Announcement includes:

- Announcement Title
- Announcement Message
- Posted By
- Date / Time
- Pin / Unpin Announcement
- Minimize / Maximize Announcement with chevron

Announcement can be compact or expanded.

## Team Channels

Final channel order:

```txt
System Message
General
Sales
Kitchen
Delivery
Riders
Schedule
Issues
Chitchat
```

### System Message

System Message is first, read-only, and for automated system logs only.

Users cannot send messages in System Message.

System Message includes:

- Order Updates
- Kitchen Alerts
- Delivery Updates
- Pickup Updates
- Rider Updates
- Stock Updates
- Staff Activity

### Regular Channels

Users can send messages in allowed regular channels:

- General
- Sales
- Kitchen
- Delivery
- Riders
- Issues
- Chitchat

Channel visibility depends on role permissions.

## Schedule Channel

Schedule stays inside Group Chat.

Schedule shows a 1-week date grid from Monday to Sunday.

Schedule includes:

- Current Week auto view
- Previous Week
- Next Week
- This Week
- Admin / Owner edit mode
- Staff view-only mode
- Up to 20 staff rows
- Blank cells allowed

## Chat Message Area

Message Bubble includes:

- Sender Name
- Role Badge
- Message Text
- Mentioned Staff
- Mentioned Order Tag
- Timestamp
- Read Status
- Message Actions

Final Message Actions:

```txt
Reply
React
Edit
```

Delete and Pin message actions are removed.

## Message Composer

Message Composer includes:

- Text Input
- Emoji Button
- Mention Staff
- Mention Order
- Send Button

Removed from composer:

- Quick Message Templates
- Attachment Button
- Attachment Preview
- Attachments Section

## Mention Staff

Mention Staff allows staff to select a team member and insert an @mention into the message.

## Mention Order

Mention Order allows staff to insert an order tag like:

```txt
#ORD-1024
```

Clicking an order tag should open Mention Order Preview.

## Mention Order Preview

Mention Order Preview includes:

- Basic Order Info
- Customer Information
- Recipient / Pickup Information
- Items Summary
- Payment Summary
- QR / Barcode
- Live Tracking Link for delivery orders
- Quick Actions

Quick Actions:

- View Full Order
- Copy Order ID
- Copy QR Code
- Copy Barcode
- Copy Live Tracking Link if Delivery

## Pinned Messages

Pinned Messages can show:

- Important Announcements
- Shift Notes
- Delivery Instructions
- Rider Reminders
- Inventory Reminders

Message pin actions are removed from regular messages.

## Members Panel

Members Panel includes:

- Staff Name
- Role
- Online / Offline Status
- Away Status
- Last Seen
- Direct Message Button

## Chat Settings

Chat Settings includes:

- Notification Settings
- Channel Permissions
- Mute Channel
- Clear Chat History
- Export Chat Logs

## Admin Settings / Channel Permissions

Admin can manage:

- Who can view each channel
- Who can send messages
- Who can edit own messages
- Read-only channels
- Channel visibility rules by role

Example roles:

- Owner / Admin
- Admin
- Manager
- Sales
- Cashier
- Kitchen Staff
- Delivery Staff
- Rider
- Inventory Staff

## Role Rules

Channel Rules include:

- Can View
- Can Send Message
- Can Edit Own Message
- Read Only

## Notes

- System Message is automated and read-only.
- Schedule is view-only for staff.
- Schedule editing is Admin / Owner only.
- Group Chat should support mobile and desktop layouts.
- Mobile channel list can minimize to full-screen chat.
