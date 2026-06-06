# DATABASE_STRUCTURE.md

# fruitsinbloomph POS Database Structure

## Collections / Tables

```text
Database
├── users
├── roles
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
├── chatChannels
├── chatMessages
├── systemMessages
├── scheduleChannel
├── messageConversations
├── messageThreads
├── integrationSettings
├── savedReports
├── posBilling
├── billingPayments
├── superAdminLogs
├── liveTracking
├── qrOrderDetails
└── settings
```

## Core Rule

```text
orders = master order record
kitchenOrders / deliveryOrders / pickupOrders = workflow records connected by orderId
products / ingredients = item information
productStocks / ingredientStocks = quantity records
recipes = connects products to ingredients
stockMovements = inventory audit trail
messageConversations / messageThreads = Unified-Message customer inbox
integrationSettings = platform API connection settings
```

## users

```text
users
├── userId
├── name
├── username
├── passwordHash
├── role
├── contactNumber
├── email
├── status: Active / Inactive / Suspended
├── quickLoginEnabled
├── lastLogin
├── createdAt
└── updatedAt
```

## roles

```text
roles
├── roleId
├── roleName
├── moduleVisibility
├── moduleAccess
│   ├── fullAccess
│   ├── viewOnly
│   ├── limitedAccess
│   └── noAccess
├── actionPermissions
└── updatedAt
```

## products

```text
products
├── productId
├── productName
├── productDetails
├── description
├── sku
├── barcode
├── category
├── price
├── cost
├── unit
├── imageUrl
├── status
├── recipeEnabled
├── createdAt
├── updatedAt
└── updatedBy
```

## productStocks

```text
productStocks
├── stockId
├── productId
├── productName
├── category
├── currentStock
├── reservedStock
├── availableStock
├── unit
├── reorderLevel
├── stockStatus
├── lastUpdated
└── updatedBy
```

## ingredients

```text
ingredients
├── ingredientId
├── ingredientName
├── ingredientDetails
├── sku
├── barcode
├── category
├── defaultUnit
├── ingredientCost
├── imageUrl
├── status
├── createdAt
└── updatedAt
```

## ingredientStocks

```text
ingredientStocks
├── stockId
├── ingredientId
├── ingredientName
├── category
├── currentStock
├── reservedStock
├── availableStock
├── unit
├── reorderLevel
├── ingredientCost
├── stockStatus
├── lastUpdated
└── updatedBy
```

## recipes

```text
recipes
├── recipeId
├── productId
├── productName
├── ingredients
│   ├── ingredientId
│   ├── ingredientName
│   ├── quantityUsed
│   ├── unit
│   └── cost
├── totalRecipeCost
├── createdAt
└── updatedAt
```

## orders

```text
orders
├── orderId
├── orderNumber: ORD-####
├── priority: Rush / Normal
├── source: Facebook / Instagram / TikTok / Viber / WhatsApp / Website / Other
├── sourceType: Organic / Ads
├── platform
├── conversationId
├── adAttribution
│   ├── campaignName
│   ├── adName
│   ├── adId
│   ├── clickId
│   └── originalMessage
├── orderType: Pickup / Delivery
├── status
├── createdAt
├── createdBy
├── customer
│   ├── name
│   ├── contactNumber
│   └── notes
├── recipient
│   ├── name
│   └── contactNumber
├── delivery
│   ├── address
│   ├── city
│   ├── landmark
│   ├── deliveryDate
│   ├── deliveryTime
│   ├── deliveryType: BFC / INH
│   ├── cardMessage
│   └── notes
├── pickup
│   ├── pickupDate
│   ├── pickupTime
│   ├── pickupPersonName
│   ├── pickupPersonContact
│   ├── cardMessage
│   └── notes
├── items
│   ├── productId
│   ├── productName
│   ├── productDetails
│   ├── variant
│   ├── addOns
│   ├── quantity
│   ├── unitPrice
│   └── subtotal
├── payment
│   ├── method
│   ├── status
│   ├── subtotal
│   ├── discount
│   ├── tax
│   └── total
├── qrOrderDetailsLink
├── barcodeValue
├── trackingLink
├── timeline
└── updatedAt
```

## kitchenOrders

```text
kitchenOrders
├── kitchenId
├── orderId
├── orderNumber
├── priority
├── source
├── customerName
├── orderType
├── kitchenStatus: New Orders / Preparing / Ready
├── sentAt
├── startedAt
├── readyAt
├── preparedBy
└── updatedAt
```

## deliveryOrders

```text
deliveryOrders
├── deliveryId
├── orderId
├── orderNumber
├── priority
├── source
├── sourceType
├── customerName
├── customerContact
├── recipientName
├── recipientContact
├── address
├── city
├── landmark
├── deliveryDate
├── deliveryTime
├── deliveryType: BFC / INH
├── cardMessage
├── paymentMethod
├── paymentStatus
├── total
├── rider
│   ├── riderId
│   ├── name
│   └── contactNumber
├── deliveryStatus: Waiting for Rider / Out for Delivery / Delivered
├── waitingStartedAt
├── outForDeliveryAt
├── deliveredAt
├── timerSeconds
├── trackingLink
└── updatedAt
```

## pickupOrders

```text
pickupOrders
├── pickupId
├── orderId
├── orderNumber
├── priority
├── source
├── customerName
├── customerContact
├── pickupPersonName
├── pickupPersonContact
├── pickupDate
├── pickupTime
├── cardMessage
├── paymentMethod
├── paymentStatus
├── total
├── pickupStatus: Waiting Pickup / Picked Up
├── waitingStartedAt
├── pickedUpAt
├── timerSeconds
└── updatedAt
```

## stockMovements

```text
stockMovements
├── movementId
├── referenceId
├── movementDateTime
├── stockType: Product Stock / Ingredient Stock
├── itemId
├── itemName
├── itemDetails
├── sku
├── barcode
├── category
├── movementType
│   ├── Stock In
│   ├── Stock Out
│   ├── Adjustment
│   ├── Ingredient Deduction
│   ├── Damaged
│   ├── Expired
│   ├── Returned
│   └── Transfer
├── quantity
├── unit
├── previousStock
├── newStock
├── reason
├── performedBy
├── notes
└── createdAt
```

## Unified-Message Collections

### messageConversations

```text
messageConversations
├── conversationId
├── platform
├── platformConversationId
├── customerName
├── customerProfileId
├── customerContact
├── lastMessage
├── lastMessageAt
├── unreadCount
├── assignedStaff
├── linkedOrderId
├── status: Unread / Read / Replied / Assigned / Done
├── sourceType: organic / ads
├── adAttribution
│   ├── campaignName
│   ├── adName
│   ├── adId
│   ├── clickId
│   └── originalMessage
├── createdAt
└── updatedAt
```

### messageThreads

```text
messageThreads
├── messageId
├── conversationId
├── platform
├── platformMessageId
├── senderType: customer / staff
├── senderName
├── messageText
├── attachments
├── readStatus
├── createdAt
└── updatedAt
```

### integrationSettings

```text
integrationSettings
├── integrationId
├── platform: facebook / instagram / whatsapp / viber / tiktok
├── enabled
├── status: connected / disconnected / error / pending_review
├── accessTokenEncrypted
├── refreshTokenEncrypted
├── pageId
├── phoneNumberId
├── businessAccountId
├── webhookUrl
├── lastSyncAt
├── connectedBy
└── updatedAt
```

## chatChannels

```text
chatChannels
├── channelId
├── channelName
├── channelKey
├── channelOrder
├── description
├── readOnly
├── isActive
├── allowedRoles
├── canSendRoles
├── canEditRoles
├── createdAt
└── updatedAt
```

Final channels:

```text
System Message
General
Sales
Kitchen
Delivery
Riders
Schedule
Issues
Chitchat
```

## chatMessages

```text
chatMessages
├── messageId
├── channelId
├── senderId
├── senderName
├── senderRole
├── messageText
├── mentionedStaff
├── mentionedOrderId
├── mentionedOrderNumber
├── createdAt
├── editedAt
├── isEdited
└── reactions
```

## systemMessages

```text
systemMessages
├── messageId
├── channelId: system_message
├── type
├── referenceId
├── messageText
├── createdAt
└── createdBy: System
```

## scheduleChannel

```text
scheduleChannel
├── scheduleId
├── weekStartDate
├── weekEndDate
├── days
│   ├── monday
│   ├── tuesday
│   ├── wednesday
│   ├── thursday
│   ├── friday
│   ├── saturday
│   └── sunday
├── updatedBy
└── updatedAt
```

## Billing

```text
posBilling
├── billingId
├── plan: Basic / Pro
├── status: Active / Due Soon / Past Due / Locked
├── monthlyRate: 3000
├── nextDueDate
├── graceUntil
├── beforeLockDays
├── posEnabled
├── lastPaymentId
├── updatedAt
└── updatedBy
```

```text
billingPayments
├── paymentId
├── datePaid
├── monthsAdded: 1 / 3 / 6 / 9 / 12
├── amount
├── paymentMethod: GCash / Maya / Bank Transfer / Other
├── referenceNumber
├── notes
├── status
├── confirmedBy
└── createdAt
```

## Public Pages

```text
liveTracking
├── trackingId
├── orderId
├── orderNumber
├── currentStatus: confirmed / preparing / out_for_delivery / delivered
├── publicVisible
├── trackingLink
├── updatedAt
└── updatedBy
```

```text
qrOrderDetails
├── qrId
├── orderId
├── orderNumber
├── publicVisible
├── qrLink
├── generatedAt
└── updatedAt
```

## settings

```text
settings
├── general
├── pos
├── orders
├── deliveryPickup
├── inventory
├── notifications
├── apiIntegration
├── updatedAt
└── updatedBy
```

## Final Database Rule

```text
Do not duplicate full order data everywhere.
Use orders as the master record.
Use orderId to connect kitchenOrders, deliveryOrders, pickupOrders, liveTracking, and qrOrderDetails.
Use stockMovements as the final inventory audit trail.
Keep API tokens encrypted and backend-only.
```
