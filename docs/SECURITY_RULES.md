# SECURITY_RULES.md

# fruitsinbloomph POS Security Rules

## Main Security Rule

```text
Never expose private data, API keys, tokens, passwords, or secrets in frontend HTML, CSS, or JS.

Frontend = display only
Backend = secure actions, tokens, webhooks, API calls
Database = protected by rules and permissions
```

## Login Security

```text
Login Security
├── Username required
├── Password required
├── Passwords must be hashed
├── Wrong password shows error
├── Too many wrong attempts can temporarily lock login
├── Inactive account cannot login
├── Suspended account cannot login
├── Session timeout required
├── Remember device optional
├── Logout all devices option
└── Quick Login must follow role permissions
```

## Role Permission Security

```text
Role Permission Security
├── Owner/Admin = full access
├── Manager = most access except Super Admin controls
├── Sales = POS Terminal / Orders / Unified-Message if allowed
├── Cashier = POS Terminal
├── Kitchen Staff = Kitchen only
├── Delivery Staff = Delivery only
├── Rider = assigned delivery orders only
└── Inventory Staff = inventory pages only
```

## POS Billing Lock Security

```text
POS Billing Lock
├── Active = POS enabled
├── Due Soon = warning only
├── Past Due = grace period
└── Locked = normal POS checkout disabled
```

When POS is locked:
```text
Locked POS
├── Disable checkout
├── Disable new sale
├── Allow Owner/Admin to access Account
├── Allow Owner/Admin to access POS Billing
├── Allow Owner/Admin to access Super Admin
└── Show clear locked message
```

## Super Admin Security

```text
Super Admin
├── File Path: /public/superadmin.html
├── Hidden from normal sidebar
├── Owner-only access
├── Controls POS lock/unlock
├── Controls billing override
├── Controls due date changes
├── Controls maintenance mode
└── Every action creates Super Admin Log
```

## Unified-Message Security

```text
Unified-Message
├── Pro-only feature
├── Basic Plan = locked
├── Pro Plan = unlocked
├── Staff can only reply if role allows
├── Staff can only create orders if role allows
├── Staff can only link orders if role allows
└── Customer-filled forms are draft only
```

Final Unified-Message rule:
```text
Customer-filled form = draft only.
Staff must review, complete, and confirm before final order is saved.
```

## API Token / Secret Security

```text
API Token Security
├── Never save API tokens in frontend HTML/JS
├── Never expose app secret in browser
├── Store tokens encrypted
├── Use backend only for API calls
├── Use environment variables for secrets
├── Restrict API Integration settings to Admin/Owner
└── Rotate/reset tokens if exposed
```

Platform API tokens:
```text
Facebook Page Token = backend only
Instagram Token = backend only
WhatsApp Token = backend only
Viber Bot Token = backend only
TikTok Token = backend only
```

## Webhook Security

```text
Webhook Security
├── Use HTTPS only
├── Verify webhook tokens
├── Verify signatures if platform supports it
├── Ignore duplicate message IDs
├── Log webhook errors
├── Rate limit webhook endpoints
└── Do not trust raw webhook data without validation
```

Webhook endpoints:
```text
/webhooks/meta
/webhooks/whatsapp
/webhooks/viber
/webhooks/tiktok
```

## Database Security

```text
Database Security
├── Users can only access allowed modules
├── Staff cannot edit restricted records
├── Riders only see assigned delivery orders
├── Kitchen staff only sees kitchen orders
├── Public pages only read safe order data
├── API tokens must be encrypted
└── Activity logs should not be editable by normal staff
```

Strict collections:
```text
users
roles
integrationSettings
posBilling
billingPayments
superAdminLogs
settings
```

## Public Page Security

Public pages:
```text
/public/live-track.html
/public/qr-order-details.html
```

Rules:
```text
No POS sidebar
No admin controls
No edit buttons
No staff-only data
Read-only only
Load only by valid order ID
Show clear error if order not found
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
```

## Order Security

```text
Order Security
├── Only allowed roles can create orders
├── Only allowed roles can edit orders
├── Cancel/refund requires permission
├── Order status changes must create logs
├── Card Message must not show full text in table
├── Full Card Message only in preview/drawer/modal/popover
└── Unified-Message created orders must be reviewed by staff
```

Compact table privacy:
```text
Address = compact, full preview on click
Items = icon only, full preview on click
Card Message = icon only, full preview on click
```

## Inventory Security

```text
Inventory Security
├── Only Inventory/Admin can adjust stock
├── Every stock change creates Stock Movement
├── Stock Movements should not be deleted casually
├── Ingredient deduction must be recorded
├── Manual adjustment requires reason
└── Staff name/role must be recorded
```

## Staff Activity Logs

```text
Activity Logs
├── Login
├── Logout
├── Create Order
├── Edit Order
├── Cancel Order
├── Refund Order
├── Send to Kitchen
├── Mark Ready
├── Assign Rider
├── Mark Delivered
├── Mark Picked Up
├── Adjust Stock
├── Confirm Payment
├── Change Settings
└── Super Admin action
```

## Final Security Rules

```text
Never expose API secrets in frontend
Passwords must be hashed
Tokens must be encrypted
Webhooks must be verified
Role permissions must protect pages and actions
Public pages must be read-only
Super Admin must be owner-only
Locked POS must block checkout
Stock changes must create audit trail
Customer-filled forms are draft only
Staff must confirm before final order save
```
