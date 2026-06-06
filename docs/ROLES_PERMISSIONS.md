# ROLES_PERMISSIONS.md

# fruitsinbloomph POS Roles & Permissions

## Main Rule

Role permissions control:
- Which sidebar tabs are visible
- Which pages can be opened
- Which actions can be used
- Which records can be edited
- Which modules are view-only or locked

## Permission Levels

```text
Full Access
├── View
├── Create
├── Edit
├── Delete / Cancel if allowed
└── Manage

View Only
├── Can open page
├── Can view records
└── Cannot save changes

Limited Access
├── Can use selected actions only
└── Other actions are hidden/disabled

No Access
├── Tab hidden
└── Page blocked
```

## Staff Roles

```text
Owner / Admin
Manager
Sales
Cashier
Kitchen Staff
Delivery Staff
Rider
Inventory Staff
```

## Sidebar Groups

```text
Main
├── Dashboard
├── POS Terminal
└── Orders

Operations
├── Kitchen
├── Delivery
└── Pickup

Inventory
├── Products
├── Product Stocks
├── Ingredient Stocks
└── Stock Movements

Team & Reports
├── Group Chat
├── Unified-Message
└── Reports

Business
├── Account
├── POS Billing
└── Settings
```

## Owner / Admin Access

```text
Owner / Admin
├── Dashboard: Full Access
├── POS Terminal: Full Access
├── Orders: Full Access
├── Kitchen: Full Access
├── Delivery: Full Access
├── Pickup: Full Access
├── Products: Full Access
├── Product Stocks: Full Access
├── Ingredient Stocks: Full Access
├── Stock Movements: Full Access
├── Group Chat: Full Access
├── Unified-Message: Full Access if Pro Plan
├── Reports: Full Access
├── Account: Full Access
├── POS Billing: Full Access
├── Settings: Full Access
└── Super Admin: Owner-only / Super Admin only
```

## Manager Access

```text
Manager
├── Dashboard: Full Access
├── POS Terminal: Full Access
├── Orders: Full Access
├── Kitchen: Full Access
├── Delivery: Full Access
├── Pickup: Full Access
├── Products: View Only or Limited Access
├── Product Stocks: View Only
├── Ingredient Stocks: View Only
├── Stock Movements: View Only
├── Group Chat: Full Access
├── Unified-Message: Full Access if Pro Plan and allowed
├── Reports: Full Access
├── Account: Limited Access
├── POS Billing: View Only
├── Settings: View Only / Limited Access
└── Super Admin: No Access
```

## Sales Access

```text
Sales
├── Dashboard: View Only
├── POS Terminal: Full Access
├── Orders: Full Access or Limited Access
├── Kitchen: View Only
├── Delivery: View Only
├── Pickup: View Only
├── Products: View Only
├── Product Stocks: View Only
├── Ingredient Stocks: No Access
├── Stock Movements: No Access
├── Group Chat: Full Access
├── Unified-Message: Full Access if Pro Plan and allowed
├── Reports: View Only or No Access
├── Account: No Access
├── POS Billing: No Access
├── Settings: No Access
└── Super Admin: No Access
```

## Cashier Access

```text
Cashier
├── Dashboard: View Only or No Access
├── POS Terminal: Full Access
├── Orders: Limited Access
├── Kitchen: No Access
├── Delivery: No Access
├── Pickup: No Access
├── Products: View Only
├── Product Stocks: View Only
├── Ingredient Stocks: No Access
├── Stock Movements: No Access
├── Group Chat: Full Access
├── Unified-Message: No Access or Limited Access if allowed
├── Reports: No Access
├── Account: No Access
├── POS Billing: No Access
├── Settings: No Access
└── Super Admin: No Access
```

## Kitchen Staff Access

```text
Kitchen Staff
├── Orders: View Only
├── Kitchen: Full Access
├── Group Chat: Limited Access
└── Other modules: No Access
```

Allowed Kitchen actions:
```text
Start Preparing
Mark Ready
Send to Delivery
Send to Pickup
View Items
View Card Message if needed
View Order Details needed for preparation
```

## Delivery Staff Access

```text
Delivery Staff
├── Orders: View Only
├── Delivery: Full Access
├── Group Chat: Limited Access
└── Other modules: No Access
```

Allowed Delivery actions:
```text
View Delivery
View Order
Assign Rider
Assign & Start
Mark Delivered
Copy Tracking Link
Open Tracking Page
View Items Preview
View Address Preview
View Card Message Preview
```

## Rider Access

```text
Rider
├── Delivery: Assigned Delivery Orders Only
├── Group Chat: Riders channel only if allowed
└── Other modules: No Access
```

## Inventory Staff Access

```text
Inventory Staff
├── Dashboard: View Only
├── Orders: View Only
├── Products: Full Access or Limited Access
├── Product Stocks: Full Access
├── Ingredient Stocks: Full Access
├── Stock Movements: Full Access
├── Reports: Inventory Reports only
├── Settings: Inventory Settings only if allowed
└── Other modules: No Access
```

## Unified-Message Permissions

```text
Unified-Message
├── Basic Plan = locked for all staff
├── Pro Plan = can be enabled by role
├── Owner/Admin = Full Access
├── Manager = Full Access if allowed
├── Sales = Full or Limited Access if allowed
├── Cashier = No Access or Limited Access
└── Kitchen / Delivery / Rider / Inventory = No Access
```

Actions:
```text
View Conversations
Reply to Customer
Assign Conversation
Mark Read / Done
Send Quick Reply
Copy Details
Copy to Cart
Create Order
Link Existing Order
View Ads Attribution
```

## POS Billing Permissions

```text
Owner/Admin = Full Access
Manager = View Only
Other roles = No Access
```

## Super Admin Permissions

```text
Super Admin
├── Owner-only
├── Hidden from normal staff sidebar
├── Handles billing override
├── Handles lock/unlock POS
├── Handles maintenance mode
└── Every action must create Super Admin Log
```

## Final Rule

Frontend hiding is not enough. Always validate role permission in backend/database rules too.
