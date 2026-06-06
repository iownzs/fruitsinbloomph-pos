# UNIFIED_MESSAGE.md

# fruitsinbloomph Unified-Message Structure

## Main Rule

```text
Unified-Message = customer multi-platform inbox
Group Chat = internal staff chat
Orders = confirmed transactions
```

## File Path

```text
/public/unified-message.html
```

## Sidebar Placement

```text
Team & Reports
├── Group Chat
├── Unified-Message
└── Reports
```

## Subscription Rule

```text
Basic Plan = Unified-Message locked
Pro Plan = Unified-Message unlocked
```

## Supported Platforms

```text
Unified-Message Platforms
├── Facebook Page Messenger
├── Instagram Page Messages
├── WhatsApp Messages
├── TikTok Messages
└── Viber Messages
```

## Purpose

```text
Unified-Message Purpose
├── Handle customer messages from different platforms in one inbox
├── Track platform/source
├── Show Organic Message vs Ads Message
├── Show ad attribution if available
├── Let staff reply to customers
├── Let staff assign conversations
├── Let staff mark conversations read/done
├── Let staff create orders from message conversations
└── Let staff link conversations to existing orders
```

## Header

```text
Unified-Message Header
├── Page Title: Unified-Message
├── Pro Badge
├── Search Messages
├── Platform Filter: All Platforms, Facebook, Instagram, WhatsApp, TikTok, Viber
├── Message Status Filter: All Status, Unread, Read, Replied, Assigned, Done
├── Source Type Filter: All Source, Organic Message, Ads Message
├── Assigned Staff Filter
└── Upgrade to Pro button if locked
```

## Platform Tabs

```text
Platform Tabs
├── All Messages
├── Facebook Messenger
├── Instagram Messages
├── WhatsApp Messages
├── TikTok Messages
└── Viber Messages
```

## Conversation List

```text
Conversation List
├── Customer Name / Profile
├── Platform Icon
├── Last Message Preview
├── Message Time
├── Unread Badge
├── Assigned Staff
├── Linked Order ID
├── Message Status: Unread, Read, Replied, Assigned, Done
└── Source Type Badge: Organic Message or Ads Message
```

## Ads Source / Ad Attribution

```text
Ads Source / Ad Attribution
├── Source Type: Organic or Ads
├── Ads Source Label
│   ├── From Facebook Ads
│   ├── From Instagram Ads
│   ├── From TikTok Ads
│   ├── From WhatsApp Ads
│   └── From Viber Ads
├── Campaign Name if available
├── Ad Name if available
├── Ad ID if available
├── Click ID if available
├── First Message Time
└── Original Message
```

## Chat Panel

```text
Chat Panel
├── Customer Header
│   ├── Customer Name
│   ├── Platform Icon
│   ├── Source Badge Organic/Ads
│   ├── Assigned Staff
│   └── Conversation Actions
├── Message Thread
│   ├── Customer Messages
│   ├── Staff Replies
│   ├── Date Separators
│   ├── Read Status
│   └── Message Time
├── Ad Details Card if from ads
│   ├── Platform
│   ├── Campaign Name
│   ├── Ad Name
│   ├── Ad ID
│   └── Click ID
└── Message Composer
    ├── Reply Input
    ├── Send Button
    ├── Quick Replies
    └── Product Link optional
```

## Right Panel

```text
Right Panel
├── Customer Details
│   ├── Customer Name
│   ├── Profile Link
│   ├── Phone Number if available
│   ├── Email if available
│   ├── Location if available
│   ├── Platform
│   ├── First Message Date
│   ├── Last Message Date
│   └── View Full Profile
└── Conversation Info
    ├── Platform
    ├── Source Type: Organic or Ads
    ├── Campaign Name if ads
    ├── Ad Name if ads
    ├── Ad ID if ads
    ├── Click ID if ads
    ├── Assigned Staff
    └── Conversation Status
```

## Order Integration

```text
Order Integration
├── Create Order from Message
├── Link Existing Order
├── Open Linked Order
├── Copy Order ID
├── Unlink Order
└── Linked Order Card
    ├── Order ID
    ├── Order Status
    ├── Order Type
    ├── Delivery/Pickup Date
    ├── Total
    ├── Payment Status
    ├── Open Order
    └── Copy Tracking Link if delivery
```

## Order Creation Rule

```text
Unified-Message auto-carries:
├── platform/source
├── conversation ID
├── source type Organic/Ads
└── ad attribution if available

Staff manually inputs or confirms:
├── Customer Name
├── Customer Contact
├── Recipient Name
├── Recipient Contact
├── Delivery/Pickup details
├── Items
├── Notes/Card Message
├── Payment Method
├── Total/Payment Status
├── Priority: Rush / Normal
└── Delivery Type: BFC / INH if delivery
```

## Plain Text Quick Replies

### 1. Order Form: Arrangement

```text
ORDER FORM: ARRANGEMENT

Order Arrangement:
Logo:
(Max of 3 words, example: Happy Birthday, Get Well Soon)

Customer Name:
Customer Contact No.:

Delivery Date:
Delivery Address:
Landmark:

Recipient Name:
Recipient Contact No.:

Card Message:
(Please type the exact card message.)

Payment Method:

---

Reminders:
• We deliver within Metro Manila.
• Once this form is filled up and submitted, the order is confirmed.
• We have our own delivery service.
• You can also order through our website at www.fib.com.ph for credit card payments.
• Once the item is shipped and received by the recipient, FIB is not liable for damages incurred. Please check the item upon receipt.
• The client may book their own delivery service, but FIB will not be liable for damages incurred during delivery. We will brief them on proper handling.
• Please request a thermal bag to transport the item.
• Pots are subject to availability.
```

### 2. Pantry Order Form

```text
PLEASE FILL UP ORDER FORM

PANTRY ORDER FORM:

Order Pantry:
Customer Name:
Customer Number:

Recipient Name:
Recipient Number:

Address:
Landmarks:
Phone Number:

Delivery Date:
Mode of Payment - GCash or Chinabank:

---

Reminders:
• Once this form is filled up, the order is confirmed.
• We will book for you via 3rd party contractor (Grab or Lalamove). Please pay the delivery fee to the rider directly.
• Changes made in less than 24 hours / 1 day from the initial delivery date are subject for approval.
• If for a gift, please indicate recipient name, contact number, delivery address, and card message, if any.
• Once your order is confirmed, you will receive an ORD# as your order reference.
```

### 3. Pantry Pricelist

```text
Have a fruity treat!

Price List:
1L Mango Sago - ₱400
1L Melon Medley - ₱400
1L Buko Lychee - ₱400
1L Coffee Delight - ₱400
1L Fruit Cocktail - ₱500
1L Avocado Paradise - ₱500

All flavors are good for 2-3 pax.

Reminders:
• Freshly made and available daily.
• Shelf life: 4-5 days upon opening.
• Do not freeze; refrigerate only.

Cup Size:
₱150 / 9oz per cup - Mango, Melon, Buko, Coffee
₱170 / 9oz per cup - Fruit Cocktail

Thank you!
We’re glad to assist you today!
```

## Order Form Submission Card

```text
Order Form Submission Card
├── Filled form text preview
├── Copy Details
├── Copy to Cart
├── Create Order
├── Link Existing Order
└── Mark as Reviewed
```

## Copy to Cart

```text
Copy to Cart
├── Copies available customer/order details and items into POS cart/order draft where possible
└── Staff still reviews before checkout/save
```

## Create Order

```text
Create Order
├── Opens manual order form/cart
├── Carries source/platform/conversation/ad attribution automatically
└── Staff manually completes required fields and confirms final order
```

## No Public Form Link

```text
Do not create /public/customer-order-form.html unless requested later.
Unified-Message sends plain text forms only.
Customer replies with filled text.
Customer-filled form = draft only.
Staff must review, complete, and confirm before final order is saved.
```

## Database

```text
messageConversations
├── conversationId
├── platform
├── customerName
├── customerProfileId
├── customerContact
├── lastMessage
├── lastMessageAt
├── unreadCount
├── assignedStaff
├── linkedOrderId
├── status
├── sourceType organic/ads
├── adAttribution
├── createdAt
└── updatedAt
```

```text
messageThreads
├── messageId
├── conversationId
├── platform
├── senderType customer/staff
├── senderName
├── messageText
├── attachments
├── readStatus
├── createdAt
└── updatedAt
```

## Reports Connection

```text
Reports
├── Sales by Order Source
├── Sales by Platform
├── Sales from Ads
├── Sales from Organic Messages
├── Campaign Sales Report
└── Conversation to Order Conversion
```

## Final Rule

```text
Unified-Message = separate Pro-only customer inbox page.
Group Chat = internal staff chat.
Orders created from Unified-Message must save orderSource, sourceType Organic/Ads, platform, conversationId, and adAttribution if available.
```
