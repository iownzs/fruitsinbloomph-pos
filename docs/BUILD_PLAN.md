# BUILD_PLAN.md

# fruitsinbloomph POS Build Plan

## Build Rules

```text
Build one module at a time.
Do not build all pages at once.
Finish database structure before UI actions.
Orders must be the master order record.
Kitchen / Delivery / Pickup must sync with Orders.
Live Tracking must sync with Delivery status.
QR Order Details must load from Orders.
Stock Movements must record every stock change.
Role permissions must control hidden tabs and actions.
API tokens/secrets must stay backend-only.
```

## Project Folder Setup

```text
/fruitsinbloomph-pos
├── public
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── pos-terminal.html
│   ├── orders.html
│   ├── kitchen.html
│   ├── delivery.html
│   ├── pickup.html
│   ├── products.html
│   ├── product-stocks.html
│   ├── ingredient-stocks.html
│   ├── stock-movements.html
│   ├── group-chat.html
│   ├── unified-message.html
│   ├── reports.html
│   ├── account.html
│   ├── pos-billing.html
│   ├── settings.html
│   ├── superadmin.html
│   ├── live-track.html
│   └── qr-order-details.html
├── public/assets
├── public/css
├── public/js
├── server
│   ├── webhooks
│   ├── integrations
│   └── api
└── docs
```

## Docs

```text
docs
├── POS_STRUCTURE.md
├── DATABASE_STRUCTURE.md
├── STATUS_FLOW.md
├── UI_RULES.md
├── BUILD_PLAN.md
├── TESTING_CHECKLIST.md
├── UNIFIED_MESSAGE.md
└── API_INTEGRATION.md
```

## Phase 1 — Foundation

```text
Goal: base project, shared dark theme, shared layout, login, and basic permissions.
```

Tasks:

```text
1. Create project folders.
2. Add all separate HTML files.
3. Create shared dark theme CSS.
4. Create shared sidebar/header layout.
5. Create reusable table styles.
6. Create reusable modal/drawer styles.
7. Create helper functions.
8. Create database connection file.
9. Create default settings data.
```

## Phase 2 — Authentication / Login

```text
1. Build login page.
2. Add username/password.
3. Add quick login.
4. Add inactive/suspended blocking.
5. Add role redirects.
6. Add session storage.
7. Add locked POS handling.
```

## Phase 3 — Database Foundation

```text
Build first:
├── users
├── roles
├── settings
├── products
├── productStocks
├── ingredients
├── ingredientStocks
├── recipes
├── orders
├── kitchenOrders
├── deliveryOrders
├── pickupOrders
├── stockMovements
└── posBilling
```

Add for Unified-Message:

```text
├── messageConversations
├── messageThreads
└── integrationSettings
```

## Phase 4 — Shared Layout / Sidebar / Permissions

```text
1. Create sidebar component.
2. Add dark sidebar styling.
3. Add active tab highlight.
4. Add role-based tab visibility.
5. Add mobile sidebar drawer/collapse.
6. Hide Super Admin from normal sidebar.
7. Hide public pages from sidebar.
```

## Phase 5 — Products / Ingredients / Recipes

```text
1. Build Products page.
2. Build Ingredient Stocks page.
3. Build Product Stocks page.
4. Build recipe editor.
5. Connect products to ingredients.
6. Create stock movement after stock changes.
```

## Phase 6 — POS Terminal

```text
1. Build Product Area.
2. Build Cart Panel.
3. Add Pickup / Delivery toggle.
4. Add source and source type.
5. Add Card Message.
6. Add payment methods.
7. Add checkout validation.
8. Generate ORD-####.
9. Save order to Orders.
10. Deduct ingredients if recipe enabled.
```

## Phase 7 — Orders

```text
1. Build Orders table.
2. Add compact table rules.
3. Add Address preview.
4. Add Items icon preview.
5. Add Card Message icon preview + copy.
6. Add View Order drawer.
7. Add Send to Kitchen.
8. Add links for QR Order Details and Live Tracking.
```

## Phase 8 — Kitchen

```text
1. Build Kanban/card layout.
2. Add New Orders / Preparing / Ready.
3. Add Start Preparing.
4. Add Mark Ready.
5. Add Send to Delivery.
6. Add Send to Pickup.
7. Sync with Orders.
```

## Phase 9 — Delivery

```text
1. Build Delivery table.
2. Add Waiting for Rider / Out for Delivery / Delivered History.
3. Add Assign Rider modal/bottom sheet.
4. Add Assign & Start.
5. Add timer.
6. Add Mark Delivered.
7. Sync Live Tracking.
```

## Phase 10 — Pickup

```text
1. Build Pickup table.
2. Add Waiting Pickup / Picked Up History.
3. Add timer.
4. Add Mark Picked Up.
5. Sync with Orders.
```

## Phase 11 — Public Pages

```text
1. Build /public/live-track.html.
2. Build /public/qr-order-details.html.
3. No sidebar.
4. No admin controls.
5. Load by order query parameter.
```

## Phase 12 — Unified-Message UI

```text
1. Build Pro lock screen.
2. Build Unified-Message layout.
3. Build platform tabs.
4. Build conversation list.
5. Build chat panel.
6. Build right customer/order info panel.
7. Add source type organic/ads.
8. Add ad attribution card.
9. Add quick replies.
10. Add order form submission card.
11. Add Copy Details / Copy to Cart / Create Order.
```

## Phase 13 — API Integration

```text
1. Build integrationSettings database.
2. Build backend webhook endpoints.
3. Connect Meta for Facebook + Instagram.
4. Connect WhatsApp Cloud API.
5. Connect Viber Bot API.
6. Add TikTok last.
7. Add reply sending.
8. Add webhook signature verification.
9. Add encrypted token storage.
```

## Phase 14 — Group Chat + Schedule

```text
1. Build Group Chat.
2. Add channels.
3. Make System Message read-only.
4. Add Schedule 1-week grid.
5. Admin can edit schedule.
6. Staff view only.
```

## Phase 15 — Reports

```text
1. Build reports page.
2. Generate from Orders and Stock Movements.
3. Add Unified-Message reports:
   ├── Sales by Platform
   ├── Sales from Ads
   ├── Sales from Organic Messages
   └── Campaign Sales Report
4. Add export buttons.
```

## Phase 16 — Account / Billing / Settings / Super Admin

```text
1. Build Account.
2. Build Role Permissions.
3. Build POS Billing.
4. Add Basic / Pro plan.
5. Lock Unified-Message for Basic.
6. Build Super Admin.
7. Build Settings + API Integration section.
```

## Testing Order

```text
1. Login and role redirects
2. Role hidden tabs
3. Products create/edit
4. Ingredient stocks create/edit
5. Recipes connect products to ingredients
6. POS checkout creates order
7. Orders table displays order
8. Orders send to Kitchen
9. Kitchen status flow
10. Kitchen send to Delivery
11. Delivery assign rider
12. Delivery mark delivered
13. Live Tracking status sync
14. Kitchen send to Pickup
15. Pickup mark picked up
16. QR Order Details page
17. Ingredient deduction
18. Stock movements
19. Unified-Message draft flow
20. API integrations
21. Reports generate
22. POS Billing payment
23. POS Lock / Unlock
24. Super Admin override
25. Mobile/tablet layout
```

## Final Build Rule

```text
Build order:
1. Foundation
2. Login / Roles
3. Database
4. Products / Ingredients
5. POS Terminal
6. Orders
7. Kitchen
8. Delivery / Pickup
9. Public Pages
10. Unified-Message
11. API Integration
12. Stock Movements
13. Group Chat
14. Reports
15. Account
16. POS Billing
17. Super Admin
18. Settings
19. Testing
20. Launch
```
