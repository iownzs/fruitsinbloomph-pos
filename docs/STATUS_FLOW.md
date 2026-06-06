# STATUS_FLOW.md

# fruitsinbloomph POS Status Flow

## Main POS Flow

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

## Master Order Status

```text
Order Status
├── Created
├── Sent to Kitchen
├── Preparing
├── Ready
├── Waiting Rider
├── Out for Delivery
├── Delivered
├── Waiting Pickup
├── Picked Up
├── Completed
└── Cancelled
```

## Delivery Order Flow

```text
Created
↓
Sent to Kitchen
↓
Preparing
↓
Ready
↓
Waiting Rider
↓
Out for Delivery
↓
Delivered
↓
Completed
```

## Pickup Order Flow

```text
Created
↓
Sent to Kitchen
↓
Preparing
↓
Ready
↓
Waiting Pickup
↓
Picked Up
↓
Completed
```

## Kitchen Status Flow

```text
Kitchen Status
├── New Orders
├── Preparing
└── Ready
```

```text
Kitchen Action              Order Status
Send to Kitchen             Sent to Kitchen
Start Preparing             Preparing
Mark Ready                  Ready
Send to Delivery            Waiting Rider
Send to Pickup              Waiting Pickup
```

## Delivery Status Flow

```text
Delivery Status
├── Waiting for Rider
├── Out for Delivery
└── Delivered
```

```text
Delivery Action             Delivery Status          Order Status
Send to Delivery            Waiting for Rider        Waiting Rider
Assign & Start              Out for Delivery         Out for Delivery
Mark Delivered              Delivered                Delivered
```

## Pickup Status Flow

```text
Pickup Status
├── Waiting Pickup
└── Picked Up
```

```text
Pickup Action               Pickup Status            Order Status
Send to Pickup              Waiting Pickup           Waiting Pickup
Mark Picked Up              Picked Up                Picked Up
```

## Live Tracking Status Mapping

```text
Internal Status             Customer Tracking Status
Created                     Order Confirmed
Sent to Kitchen             Preparing
Preparing                   Preparing
Ready                       Preparing
Waiting Rider               Preparing
Out for Delivery            Out for Delivery
Delivered                   Delivered
```

## Payment Status Flow

```text
Payment Status
├── Unpaid
├── Partial
├── Paid
└── Refunded
```

## Stock Status Flow

```text
Product / Ingredient Stock Status
├── In Stock
├── Low Stock
├── Out of Stock
├── Reserved
└── Overstock
```

## Ingredient Deduction Flow

```text
POS Checkout Completed
↓
System checks product recipe
↓
Ingredient Stocks deducted
↓
Stock Movement created
↓
Ingredient stock status recalculated
```

## Stock Movement Types

```text
Stock Movement Types
├── Stock In
├── Stock Out
├── Adjustment
├── Ingredient Deduction
├── Damaged
├── Expired
├── Returned
└── Transfer
```

## POS Billing Status Flow

```text
Billing Status
├── Active
├── Due Soon
├── Past Due
└── Locked
```

```text
Active = POS enabled
Due Soon = warning only
Past Due = grace period started
After Grace = POS locked
Payment Confirmed = extend due date + unlock POS
```

## Unified-Message Status Flow

```text
Message Status
├── Unread
├── Read
├── Replied
├── Assigned
└── Done
```

## Unified-Message Order Form Flow

```text
Customer sends message
↓
Staff sends plain text quick reply order form
↓
Customer replies with filled form
↓
Order Form Submission Card appears
↓
Staff reviews
↓
Staff chooses Copy Details / Copy to Cart / Create Order
↓
Staff manually confirms required fields
↓
Final Order Saved
```

## System Message Triggers

```text
System Message Triggers
├── Order created
├── Order sent to kitchen
├── Kitchen started preparing
├── Kitchen marked ready
├── Order sent to delivery
├── Rider assigned
├── Order out for delivery
├── Order delivered
├── Order sent to pickup
├── Order picked up
├── Ingredient stock deducted
├── Product stock adjusted
├── Payment confirmed
├── POS locked
└── POS unlocked
```

## Final Status Sync Rule

```text
When status changes:
1. Update orders.status first.
2. Update related workflow record.
3. Create systemMessages record.
4. Update liveTracking if delivery order.
5. Keep reports sourced from orders/stockMovements.
```

## Final Rules

```text
Never update workflow status without updating master order status.
Never deduct ingredients without creating stock movement.
Never mark Delivered without updating Live Tracking.
Never allow staff to send messages in System Message channel.
Never let locked POS continue normal checkout.
Customer-filled Unified-Message form is draft only until staff confirms.
```
