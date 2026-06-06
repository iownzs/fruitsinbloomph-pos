# POS_STRUCTURE.md

# fruitsinbloomph POS System Structure

## Main Sidebar Groups

```text
fruitsinbloomph POS
│
├── Main
│   ├── Dashboard
│   ├── POS Terminal
│   └── Orders
│
├── Operations
│   ├── Kitchen
│   ├── Delivery
│   └── Pickup
│
├── Inventory
│   ├── Products
│   ├── Product Stocks
│   ├── Ingredient Stocks
│   └── Stock Movements
│
├── Team & Reports
│   ├── Group Chat
│   ├── Unified-Message
│   └── Reports
│
└── Business
    ├── Account
    ├── POS Billing
    └── Settings
```

## Separate HTML Pages

```text
/public
├── index.html
├── login.html
├── dashboard.html
├── pos-terminal.html
├── orders.html
├── kitchen.html
├── delivery.html
├── pickup.html
├── products.html
├── product-stocks.html
├── ingredient-stocks.html
├── stock-movements.html
├── group-chat.html
├── unified-message.html
├── reports.html
├── account.html
├── pos-billing.html
├── settings.html
├── superadmin.html
├── live-track.html
└── qr-order-details.html
```

## Main Modules

### Dashboard

```text
Dashboard
├── Quick overview
├── Sales summary
├── Orders today
├── Active orders
├── Low stock alert
└── Recent activity
```

### POS Terminal

```text
POS Terminal
├── Header
│   ├── Barcode Scan
│   └── Cashier Profile
├── Product Area
│   ├── Product Search Bar
│   ├── Category Filter Chips
│   └── Product Cards
└── Cart Panel
    ├── Cart Header
    ├── Order Information
    ├── Customer Information
    ├── Pickup Details
    ├── Delivery Details
    ├── Card Message
    ├── Cart Items
    ├── Discount Section
    ├── Total Summary
    ├── Payment Method
    └── Checkout Button
```

#### POS Terminal Order Information

```text
Order Information
├── Source: Facebook, Instagram, TikTok, Viber, WhatsApp, Website, Other
├── Source Type: Organic / Ads
├── Conversation ID if from Unified-Message
├── Ad Attribution if from ads
└── Priority: Rush / Normal
```

#### Pickup Details

```text
Pickup Details
├── Pickup Person Name
├── Pickup Person Contact Number
├── Pickup Date
├── Pickup Time
├── Card Message
├── Pickup Notes
└── Pickup Status after checkout: Waiting Pickup
```

#### Delivery Details

```text
Delivery Details
├── Recipient Name
├── Recipient Contact Number
├── Delivery Address
├── City / Area Searchable Dropdown
├── Landmark
├── Delivery Date
├── Delivery Time
├── Delivery Type: BFC / INH
├── Card Message
└── Delivery Notes
```

#### Card Message Rule

```text
Card Message can be used for Pickup or Delivery gift/arrangement orders.
Card Message can come from Unified-Message filled form.
Staff must review/edit Card Message before checkout.
```

### Orders

```text
Orders
├── Master order record page
├── Search / filters
├── Order source and source type
├── Customer / recipient details
├── Delivery / pickup details
├── Items preview
├── Card Message icon preview
├── Payment / payment status
├── Order status
├── QR / Barcode / Tracking Link
└── Actions
```

#### Orders Table

```text
Orders Table
├── Order ID / Priority
├── Order Created / Created By
├── Source
├── Source Type
├── Customer Name / Customer #
├── Recipient Name / Recipient #
├── Delivery / Pickup Date & Time
├── Address / City
│   └── If too long, show compact text and click preview for full address
├── Order Type
├── Items
│   ├── Show logo/icon only
│   └── Click logo/icon to show all items
├── Card Message
│   ├── Show icon/logo/indicator only
│   └── Click icon to show full message + Copy Card Message
├── Total
├── Payment / Payment Status
├── Order Status
├── QR / Barcode / Tracking Link
└── Actions
```

#### Orders Compact Table Rules

```text
Address / City = compact text + click preview full address
Items = icon/logo only + click preview all items
Card Message = icon/logo only + click preview full message
Full address, items, and card message should not expand the table directly.
Use preview, modal, drawer, or popover.
```

## Operations

### Kitchen

```text
Kitchen
├── File Path: /public/kitchen.html
├── Card / Kanban layout
├── New Orders
├── Preparing
├── Ready
└── Actions
    ├── Start Preparing
    ├── Mark Ready
    ├── Send to Delivery
    └── Send to Pickup
```

### Delivery

```text
Delivery
├── File Path: /public/delivery.html
├── Table layout
├── Header filters
│   ├── Search Delivery Orders
│   ├── Order Date Filter
│   ├── Delivery Date / Time Filter
│   ├── City / Area Filter
│   ├── Status Filter
│   ├── Priority Filter
│   ├── Delivery Type Filter
│   ├── Rider Filter
│   └── More Filters / Reset
├── Status tabs
│   ├── Waiting for Rider
│   ├── Out for Delivery
│   └── Delivered History
├── Delivery Table
│   ├── Order ID / Priority
│   ├── Order Created
│   ├── Delivery Date / Time
│   ├── Source
│   ├── Source Type
│   ├── Customer Name / Customer #
│   ├── Recipient Name / Recipient #
│   ├── Address / City
│   ├── Landmark
│   ├── Delivery Type
│   ├── Items
│   ├── Card Message icon only
│   ├── Total
│   ├── Payment / Payment Status
│   ├── Rider
│   ├── Delivery Status
│   ├── Timer
│   └── Actions
├── Assign Rider Modal / Bottom Sheet
├── Assign & Start
├── Timer
└── Mark Delivered
```

#### Delivery Card Message Preview

```text
Click Card Message Icon
↓
Card Message Preview
├── Full Card Message
└── Copy Card Message
```

### Pickup

```text
Pickup
├── File Path: /public/pickup.html
├── Table layout
├── Header filters
├── Status tabs
│   ├── Waiting Pickup
│   └── Picked Up History
├── Pickup Table
└── Mark Picked Up
```

## Inventory

```text
Inventory
├── Products = product information, pricing, recipe setup
├── Product Stocks = finished product quantity
├── Ingredient Stocks = raw ingredient/material quantity
└── Stock Movements = inventory audit trail
```

## Team & Reports

### Group Chat

```text
Group Chat
├── Internal staff chat
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

### Unified-Message

```text
Unified-Message
├── File Path: /public/unified-message.html
├── Pro-only customer multi-platform inbox
├── Facebook Page Messenger
├── Instagram Page Messages
├── WhatsApp Messages
├── TikTok Messages
├── Viber Messages
├── Organic / Ads source tracking
├── Ad attribution
├── Staff replies
├── Staff assignment
├── Link Existing Order
├── Create Order
├── Copy Details
├── Copy to Cart
├── Mark as Reviewed
└── Quick Replies
    ├── Order Form: Arrangement
    ├── Pantry Order Form
    └── Pantry Pricelist
```

### Reports

```text
Reports
├── Sales Reports
├── Order Reports
├── Inventory Reports
├── Stock Movement Reports
├── Operations Reports
├── Export CSV
├── Export Excel
├── Export PDF
└── Print
```

## Business

```text
Business
├── Account
│   ├── Business Profile
│   ├── Owner Account
│   ├── Staff Accounts
│   ├── Role Permissions
│   ├── Security Settings
│   └── Activity Logs
├── POS Billing
│   ├── Current Plan: Basic / Pro
│   ├── POS Access Status
│   ├── Next Due Date
│   ├── Before Lock
│   ├── Monthly Rate: ₱3,000
│   ├── Pay POS Access
│   ├── Recent Payments
│   └── Billing Rules
└── Settings
    ├── General Settings
    ├── POS Settings
    ├── Order Settings
    ├── Delivery / Pickup Settings
    ├── Inventory Settings
    ├── Notification Settings
    ├── API Integration
    └── System Actions
```

## Hidden / Special Pages

```text
Hidden / Special Pages
├── /public/superadmin.html
│   ├── Owner-only
│   ├── System control
│   ├── POS Billing override
│   ├── Lock / Unlock POS
│   └── Super Admin Logs
├── /public/live-track.html
│   ├── Public customer delivery tracking
│   ├── No POS sidebar
│   ├── No admin controls
│   └── URL: /public/live-track.html?order=ORD-1024
└── /public/qr-order-details.html
    ├── Public read-only order details
    ├── No POS sidebar
    ├── No admin controls
    └── URL: /public/qr-order-details.html?order=ORD-1024
```

## Main Workflow

```text
POS Terminal
↓
Orders
↓
Kitchen
↓
Delivery / Pickup
↓
Completed
```

## Unified-Message Order Flow

```text
Customer sends message
↓
Staff sends quick reply plain text order form
↓
Customer replies with filled form
↓
Unified-Message shows submission card
↓
Staff reviews
↓
Staff can:
├── Copy Details
├── Copy to Cart
├── Create Order
├── Link Existing Order
└── Mark as Reviewed
↓
Staff manually confirms:
├── Rush / Normal
├── Delivery Type: BFC / INH
├── Order Type: Delivery / Pickup
├── Card Message
├── Items
├── Total
└── Payment Status
↓
Final Order Saved
```

## Final Rules

```text
Orders = master order record
Kitchen / Delivery / Pickup = workflow records
POS Terminal = order creation page
Unified-Message = Pro-only customer inbox
Group Chat = internal staff communication
Reports = business reports and exports
Account = users and permissions
POS Billing = recurring POS access
Settings = POS behavior
Super Admin = owner-only system control

Customer-filled form from Unified-Message = draft only.
Staff must review, complete, and confirm before final order is saved.

Card Message can be used for Pickup or Delivery.
Full Card Message must not show directly in Orders/Delivery table.
Click Card Message icon to view and copy full message.

Orders table must stay compact:
Address preview for long address.
Items icon only + click preview all items.
Card Message icon only + click preview full message.
```

## Group Chat Schedule Channel Update

Schedule Channel:
- Current Week Auto View
- Previous Week button
- Next Week button
- This Week button
- Admin Edit Schedule
- Staff View-only

Schedule Behavior:
- Schedule automatically opens to the current Monday-Sunday week based on today's date.
- When the week is done, the Schedule Channel automatically changes to the next week.
- Admin / Owner can edit current week, previous week, and next week.
- Admin / Owner can edit the staff names assigned to duty schedule for each day/week.
- Staff can view schedule only.
- If no schedule exists for the current week, show a blank weekly schedule grid.

Recommended database rule:
- Collection: scheduleChannel
- Document ID = weekStartDate
- Example: 2026-06-08
