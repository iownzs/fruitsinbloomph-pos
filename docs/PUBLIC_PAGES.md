# PUBLIC_PAGES.md

# fruitsinbloomph POS Public Pages

## Main Rule

```text
Public pages are customer-facing pages.
They should have:
├── No POS sidebar
├── No admin controls
├── No staff-only buttons
├── No login requirement
└── Read-only customer view
```

## Public Pages

```text
/public/live-track.html
/public/qr-order-details.html
```

## Live Tracking Page

```text
Live Tracking
├── File Path: /public/live-track.html
├── URL Format: /public/live-track.html?order=ORD-1024
├── Purpose: customer delivery tracking
├── No POS sidebar
├── No admin controls
└── Reads order by order ID
```

## Live Tracking Status Steps

```text
Customer Tracking Flow
├── Order Confirmed
├── Preparing
├── Out for Delivery
└── Delivered
```

## Live Tracking Mapping

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

## Live Tracking Page Sections

```text
Live Tracking Page
├── fruitsinbloomph logo
├── Order ID
├── Customer-friendly status
├── Timeline
├── Active step highlight
├── Completed step check marks
├── Rider info if available
├── Delivered success banner
└── Error state if order not found
```

## QR Order Details Page

```text
QR Order Details
├── File Path: /public/qr-order-details.html
├── URL Format: /public/qr-order-details.html?order=ORD-1024
├── Purpose: public read-only full order details
├── No POS sidebar
├── No admin controls
├── No back button
└── No QR / Barcode preview inside the details card
```

## QR Order Details Card

```text
Order Details Card
├── Order Information
│   ├── Order #
│   ├── Order Created
│   ├── Source
│   ├── Priority
│   └── Status
├── Customer Information
│   ├── Customer Name
│   └── Customer Contact #
├── Recipient Information
│   ├── Recipient Name
│   └── Recipient Contact #
├── Delivery Information
│   ├── Address
│   ├── City
│   ├── Delivery Date
│   ├── Delivery Time
│   ├── Landmark
│   └── Delivery Type: BFC / INH
├── Pickup Information if pickup
├── Items
├── Notes
├── Card Message if available
└── Payment Information
    ├── Total
    ├── Payment Method
    └── Payment Status
```

## QR Order Details Actions

```text
QR Order Details Actions
├── Copy Order ID
└── Open Full Order Details
```

## Public Page Data Rules

Allowed to show publicly:
```text
Order ID
Customer/recipient names and contact if intended
Delivery/pickup details
Items
Card Message
Payment method/status
Public tracking status
Store branding
```

Do not show publicly:
```text
Staff internal notes
API data
Staff account data
Billing data
Profit/cost data
Ingredient cost
Admin actions
System logs
Hidden workflow controls
```

## Error States

```text
Public Page Error States
├── Order not found
├── Invalid order ID
├── Tracking unavailable
├── Order not public
└── Connection error
```

## Public Page UI Rules

```text
Public UI
├── Mobile-first
├── Clean card layout
├── Brand colors
├── Simple status labels
├── Large readable text
├── Clear error messages
└── No staff/admin layout
```

## Final Public Pages Rule

```text
Live Tracking = public delivery status page.
QR Order Details = public read-only order details page.
Both pages must stay customer-safe, read-only, and separate from admin POS.
```
