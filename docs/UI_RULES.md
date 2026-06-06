# UI_RULES.md

# fruitsinbloomph POS UI Rules

## Theme Rule

```text
fruitsinbloomph POS = dark theme dashboard
```

## Dark Theme Colors

```text
Theme
├── Main Background: #0F172A
├── Sidebar: #052E24
├── Card Background: #111827
├── Table Background: #111827
├── Table Header: #0B1220
├── Border: #1F2937
├── Primary Green: #16A34A
├── Accent Orange: #F97316
├── Danger Red: #DC2626
├── Warning Amber: #F59E0B
├── Info Blue: #2563EB
├── Purple: #7C3AED
├── Text White: #F9FAFB
└── Muted Text: #9CA3AF
```

## Global Layout

```text
Global Layout
├── Use dark background
├── Use dark cards and tables
├── Use green as primary action color
├── Use orange as accent color
├── Use red only for danger actions
├── Use clear status badges
├── Keep spacing consistent
├── Use rounded corners
├── Use soft shadows
└── Keep admin pages simple and readable
```

## Sidebar Rules

```text
Sidebar
├── Dark green / near black background
├── Group labels: Main, Operations, Inventory, Team & Reports, Business
├── Active tab = green highlight
├── Hover tab = slightly lighter dark highlight
├── Hidden tabs depend on role permissions
└── Super Admin hidden from normal staff sidebar
```

## Final Sidebar Order

```text
Dashboard
POS Terminal
Orders
Kitchen
Delivery
Pickup
Products
Product Stocks
Ingredient Stocks
Stock Movements
Group Chat
Unified-Message
Reports
Account
POS Billing
Settings
```

## Header Rules

```text
Page Header
├── Page title on left
├── Main actions on right
├── Search / filters below or beside title
├── Use dark card/header background
├── Keep actions compact
└── Mobile stacks header vertically
```

## Table Rules

Use tables for:

```text
Orders
Delivery
Pickup
Products
Product Stocks
Ingredient Stocks
Stock Movements
Reports
Account Staff Accounts
Recent Payments
```

```text
Table Rules
├── Dark table background
├── Sticky table header
├── Horizontal scroll on small screens
├── Compact row height
├── Compact action buttons
├── Use status badges
├── No infinite scroll
└── Use pagination
```

## Compact Table Rules

```text
Orders Table
├── Address / City = compact text + click preview full address
├── Items = icon/logo only + click preview all items
└── Card Message = icon/logo only + click preview full message
```

```text
Delivery Table
├── Items = click preview
├── Card Message = icon only + click preview
└── Timer updates should not reset horizontal scroll
```

## Card Rules

Use cards for:

```text
Dashboard summary cards
Kitchen order cards
POS product cards
POS Billing summary cards
Super Admin overview cards
Live Tracking timeline cards
QR Order Details card
Unified-Message order form submission cards
```

## Drawer / Modal Rules

```text
Drawer = full details
Modal = quick action
Preview = small read-only popup/card
```

Use drawers for:

```text
View Order Drawer
View Delivery Drawer
View Pickup Drawer
Add / Edit Product Drawer
Product View Drawer
Report Details Drawer
Account Staff Drawer
```

Use modals for:

```text
Assign Rider Modal
Pay POS Access Modal
Items Preview Modal
Card Message Preview
Address Preview
Mention Order Preview
Stock Adjustment Modal
Cancel Order Modal
Refund Modal
```

## Button Rules

```text
Primary Button = green
Accent Button = orange
Danger Button = red
Warning Button = amber
Secondary Button = dark gray / border
Icon Button = compact table action
```

## Badge / Status Colors

```text
Order Status Colors
├── Created = Neutral Gray
├── Sent to Kitchen = Blue
├── Preparing = Orange
├── Ready = Green
├── Waiting Rider = Amber
├── Out for Delivery = Purple
├── Waiting Pickup = Amber
├── Picked Up = Green
├── Delivered = Green
├── Completed = Gray
└── Cancelled = Red
```

```text
Payment Status Colors
├── Paid = Green
├── Unpaid = Red
├── Partial = Amber
└── Refunded = Gray
```

```text
Stock Status Colors
├── In Stock = Green
├── Low Stock = Amber
├── Out of Stock = Red
├── Reserved = Blue
└── Overstock = Purple
```

```text
Billing Status Colors
├── Active = Green
├── Due Soon = Amber
├── Past Due = Orange
└── Locked = Red
```

```text
Priority Badge
├── Rush = Red badge
└── Normal = Neutral badge
```

## Pagination Rules

```text
Desktop = 25 rows per page
Tablet = 15 rows per page
Mobile = 10 rows per page
```

## Search / Filter Rules

```text
Search / Filter Rules
├── Reset clears all filters
├── Search should not reset scroll
├── Filters should not flicker
├── Use searchable dropdown for City / Area
├── Keep filters in header area
└── Mobile filters can become collapsible
```

## Public Page Rules

```text
Public Pages
├── /public/live-track.html
└── /public/qr-order-details.html
```

```text
Public Page Rules
├── No POS sidebar
├── No admin controls
├── No staff-only buttons
├── Mobile-first design
├── Read-only customer view
├── Use fruitsinbloomph branding
└── Keep page simple
```

## Module-Specific Rules

```text
Dashboard = quick cards
POS Terminal = product cards + cart panel
Orders = master table, compact preview rules
Kitchen = visual cards / Kanban
Delivery = table
Pickup = table
Inventory = tables
Group Chat = channels + messages
Unified-Message = Pro-only customer inbox
Reports = tables + export
Account = staff and permissions
POS Billing = simple cards + payment table
Settings = simple system options
Super Admin = owner-only control page
```

## Final UI Rules

```text
Use dark UI consistently.
Keep workflows simple.
Use tables for large records.
Use cards for quick visual status.
Use drawers for full details.
Use modals/previews for quick details.
Use role permissions to hide tabs and actions.
Public pages must never show POS admin UI.
```
