# CHANGELOG.md

# fruitsinbloomph POS Changelog

Use this file to record important updates, structure changes, and stable checkpoints.

## Changelog Format

```text
Date:
Version / Checkpoint:
Module:
Change:
Reason:
Status:
```

## Current Stable Structure Checkpoint

```text
Checkpoint: Current POS Structure
Status: Saved

Sidebar Groups:
├── Main
├── Operations
├── Inventory
├── Team & Reports
└── Business

Main:
├── Dashboard
├── POS Terminal
└── Orders

Operations:
├── Kitchen
├── Delivery
└── Pickup

Inventory:
├── Products
├── Product Stocks
├── Ingredient Stocks
└── Stock Movements

Team & Reports:
├── Group Chat
├── Unified-Message
└── Reports

Business:
├── Account
├── POS Billing
└── Settings
```

## Public Pages Checkpoint

```text
Public Pages:
├── /public/live-track.html
└── /public/qr-order-details.html

Rules:
├── No POS sidebar
├── No admin controls
└── Read-only customer view
```

## Unified-Message Checkpoint

```text
Unified-Message:
├── File Path: /public/unified-message.html
├── Pro-only customer inbox
├── Supports Facebook, Instagram, WhatsApp, TikTok, Viber
├── Tracks Organic vs Ads messages
├── Saves ad attribution if available
├── Allows quick replies
├── Allows Copy to Cart
└── Allows Create Order from message
```

## Unified-Message Quick Replies Checkpoint

```text
Quick Replies:
├── Order Form: Arrangement
├── Pantry Order Form
└── Pantry Pricelist
```

## Unified-Message Final Rule

```text
Customer-filled form = draft only.
Staff must review, complete, and confirm before final order is saved.
No public form link.
Plain text order forms only.
```

## Orders Compact Table Checkpoint

```text
Orders Compact Rules:
├── Address / City = compact text + click preview full address
├── Items = icon/logo only + click preview all items
└── Card Message = icon/logo only + click preview full message
```

## POS Terminal Checkpoint

```text
POS Terminal:
├── Product Area
├── Cart Panel
├── Pickup / Delivery toggle
├── Source and source type
├── Rush / Normal priority
├── Card Message for Pickup or Delivery
├── Payment methods
└── Checkout saves to Orders
```

## API Integration Checkpoint

```text
Unified-Message Architecture:
├── Frontend: /public/unified-message.html
├── Backend API:
│   ├── /webhooks/meta
│   ├── /webhooks/whatsapp
│   ├── /webhooks/viber
│   └── /webhooks/tiktok
├── Database:
│   ├── messageConversations
│   ├── messageThreads
│   └── integrationSettings
└── Platform APIs:
    ├── Facebook Messenger API
    ├── Instagram Messaging API
    ├── WhatsApp Cloud API
    ├── Viber Bot API
    └── TikTok Business Messaging API
```

## Security Checkpoint

```text
Security Rules:
├── API tokens/secrets must not be exposed in frontend
├── Tokens should be encrypted
├── Webhooks should be verified
├── Public pages are read-only
├── Super Admin is owner-only
└── Role permissions must protect pages and actions
```

## Future Changelog Entries

```text
Date:
Version / Checkpoint:
Module:
Change:
Reason:
Status:
```
