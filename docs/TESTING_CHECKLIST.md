# TESTING_CHECKLIST.md

# fruitsinbloomph POS Testing Checklist

## Testing Rule

```text
A module is not done until:
├── Data saves correctly
├── Data displays correctly
├── Status updates correctly
├── Related module syncs correctly
├── Errors show clearly
├── Mobile view works
└── Role permissions work
```

## Login / Role Tests

```md
- [ ] Username is required
- [ ] Password is required
- [ ] Wrong login shows error
- [ ] Inactive account cannot login
- [ ] Suspended account cannot login
- [ ] Quick Login works
- [ ] Quick Login follows role permissions
- [ ] Admin redirects to Dashboard
- [ ] Cashier redirects to POS Terminal
- [ ] Kitchen Staff redirects to Kitchen
- [ ] Delivery Staff redirects to Delivery
- [ ] Inventory Staff redirects to Product Stocks / Inventory
- [ ] Logout works
- [ ] Session timeout works
```

## Sidebar / Page Access Tests

```md
- [ ] Sidebar shows correct group labels
- [ ] Sidebar uses final order
- [ ] Hidden tabs are hidden by role
- [ ] View Only role cannot edit
- [ ] Limited Access role can only use allowed actions
- [ ] Super Admin hidden from normal sidebar
- [ ] Public pages not shown in sidebar
- [ ] Mobile sidebar works
```

## Dark Theme Tests

```md
- [ ] Main background uses dark theme
- [ ] Sidebar uses dark green / near black
- [ ] Cards use dark background
- [ ] Tables use dark background
- [ ] Text is readable
- [ ] Primary buttons are green
- [ ] Accent buttons are orange
- [ ] Danger buttons are red
- [ ] Status badges are clear
```

## Products / Inventory Tests

```md
- [ ] Products page loads
- [ ] Add Product works
- [ ] Edit Product works
- [ ] Product recipe ingredients save
- [ ] Product Stocks page loads
- [ ] Product stock adjustment works
- [ ] Ingredient Stocks page loads
- [ ] Ingredient stock adjustment works
- [ ] Stock movement record is created after adjustment
- [ ] Pagination works
```

## Recipe / Ingredient Deduction Tests

```md
- [ ] Product can enable recipe tracking
- [ ] Ingredient search/select works in recipe
- [ ] Quantity used saves correctly
- [ ] Checkout reads recipe ingredients
- [ ] Ingredient Stocks deduct after checkout
- [ ] Ingredient deduction creates stock movement
- [ ] Ingredient stock status recalculates after deduction
```

## POS Terminal Tests

```md
- [ ] POS Terminal loads
- [ ] Product search works
- [ ] Category chips filter products
- [ ] Add product to cart works
- [ ] Quantity increase/decrease works
- [ ] Remove cart item works
- [ ] Order Type Pickup works
- [ ] Order Type Delivery works
- [ ] Source logo chips work
- [ ] Source Type Organic/Ads works
- [ ] Priority Rush/Normal works
- [ ] Customer fields save
- [ ] Pickup fields show only for Pickup
- [ ] Delivery fields show only for Delivery
- [ ] Card Message saves for pickup
- [ ] Card Message saves for delivery
- [ ] Discount works
- [ ] Total Summary calculates correctly
- [ ] Payment Method saves
- [ ] Checkout creates order
- [ ] Order ID format ORD-#### works
- [ ] Tracking link is generated
- [ ] QR order details link is generated
```

## Orders Tests

```md
- [ ] Orders page loads
- [ ] Search Orders works
- [ ] Filters work
- [ ] Orders table displays correct columns
- [ ] Long Address stays compact
- [ ] Address preview shows full address
- [ ] Items column shows icon/logo only
- [ ] Items preview shows all items
- [ ] Card Message column shows icon/logo only
- [ ] Card Message preview shows full message
- [ ] Copy Card Message works
- [ ] View Order drawer opens
- [ ] Send to Kitchen creates kitchen order
- [ ] Open Tracking Page works
- [ ] Open QR Order Details works
- [ ] Cancel Order works
- [ ] Refund Order works
```

## Kitchen Tests

```md
- [ ] Kitchen page loads
- [ ] Kitchen uses card / Kanban layout
- [ ] New Orders displays sent orders
- [ ] Start Preparing moves order to Preparing
- [ ] Mark Ready moves order to Ready
- [ ] Send to Delivery works
- [ ] Send to Pickup works
- [ ] Kitchen status syncs with Orders
```

## Delivery Tests

```md
- [ ] Delivery page loads
- [ ] Delivery uses table layout
- [ ] Waiting for Rider tab works
- [ ] Out for Delivery tab works
- [ ] Delivered History collapsed by default
- [ ] Assign Rider modal/bottom sheet opens
- [ ] Assign & Start moves order to Out for Delivery
- [ ] Delivery timer starts
- [ ] Mark Delivered works
- [ ] Delivery timer stops
- [ ] Live Tracking changes to Delivered
- [ ] Card Message icon preview works
- [ ] Copy Card Message works
```

## Pickup Tests

```md
- [ ] Pickup page loads
- [ ] Pickup uses table layout
- [ ] Waiting Pickup tab works
- [ ] Picked Up History works
- [ ] Mark Picked Up works
- [ ] Pickup timer stops when picked up
- [ ] Order status changes to Picked Up
```

## Public Page Tests

```md
- [ ] /public/live-track.html loads without login
- [ ] No POS sidebar on live tracking
- [ ] Live tracking status mapping works
- [ ] /public/qr-order-details.html loads without login
- [ ] No POS sidebar on QR details
- [ ] QR details shows order info
- [ ] Invalid order shows clear error
```

## Unified-Message Tests

```md
- [ ] Unified-Message is locked for Basic Plan
- [ ] Unified-Message unlocks for Pro Plan
- [ ] Platform tabs show correctly
- [ ] Conversation list loads
- [ ] Organic/Ads badge displays
- [ ] Ad attribution card displays if from ads
- [ ] Staff can reply
- [ ] Staff can assign conversation
- [ ] Staff can mark read/done
- [ ] Quick Reply: Order Form Arrangement works
- [ ] Quick Reply: Pantry Order Form works
- [ ] Quick Reply: Pantry Pricelist works
- [ ] Filled form appears as submission card
- [ ] Copy Details works
- [ ] Copy to Cart works
- [ ] Create Order opens POS draft
- [ ] Staff manually confirms required fields
- [ ] Customer-filled form is draft only
- [ ] Order saves source/platform/conversation/ad attribution
```

## API Integration Tests

```md
- [ ] API tokens are not exposed in frontend
- [ ] integrationSettings saves encrypted tokens
- [ ] /webhooks/meta receives verification
- [ ] Facebook message webhook saves message
- [ ] Instagram message webhook saves message
- [ ] /webhooks/whatsapp receives message
- [ ] /webhooks/viber receives message
- [ ] /webhooks/tiktok planned/disabled if no access
- [ ] Staff reply sends through backend API
- [ ] Duplicate webhook messages are ignored
- [ ] Webhook errors are logged
```

## Reports Tests

```md
- [ ] Sales reports generate
- [ ] Order reports generate
- [ ] Inventory reports generate
- [ ] Stock Movement reports generate
- [ ] Sales by Platform works
- [ ] Sales from Ads works
- [ ] Sales from Organic Messages works
- [ ] Campaign Sales Report works
- [ ] Export CSV works
- [ ] Export Excel works
- [ ] Export PDF works
```

## POS Billing Tests

```md
- [ ] Basic plan locks Unified-Message
- [ ] Pro plan unlocks Unified-Message
- [ ] 1 Month = ₱3,000
- [ ] 3 Months = ₱9,000
- [ ] 6 Months = ₱18,000
- [ ] 9 Months = ₱27,000
- [ ] 12 Months = ₱36,000
- [ ] Payment confirmation extends due date
- [ ] Locked POS blocks checkout
- [ ] Owner/Admin can still access Account and POS Billing
```

## Final Launch Checklist

```md
- [ ] All pages load without errors
- [ ] Dark theme is consistent
- [ ] Sidebar permissions work
- [ ] Login and Quick Login work
- [ ] Products and recipes work
- [ ] Orders create correctly
- [ ] Kitchen flow works
- [ ] Delivery flow works
- [ ] Pickup flow works
- [ ] Live Tracking works
- [ ] QR Order Details works
- [ ] Unified-Message works
- [ ] API integrations are backend-only
- [ ] Ingredient deduction works
- [ ] Stock Movements records all changes
- [ ] Reports export works
- [ ] POS Billing works
- [ ] Mobile view is usable
```
