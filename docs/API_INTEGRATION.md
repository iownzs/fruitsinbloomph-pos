# API_INTEGRATION.md

# fruitsinbloomph Unified-Message API Integration

## Main Architecture

```text
Unified-Message
│
├── Frontend
│   └── /public/unified-message.html
│
├── Backend API
│   ├── /webhooks/meta
│   ├── /webhooks/whatsapp
│   ├── /webhooks/viber
│   └── /webhooks/tiktok
│
├── Database
│   ├── messageConversations
│   ├── messageThreads
│   └── integrationSettings
│
└── Platform APIs
    ├── Facebook Messenger API
    ├── Instagram Messaging API
    ├── WhatsApp Cloud API
    ├── Viber Bot API
    └── TikTok Business Messaging API
```

## Important Rule

```text
Do not put API tokens/secrets in frontend HTML/JS.
Backend API handles:
├── webhooks
├── tokens
├── platform API calls
├── sending replies
├── message ingestion
└── signature verification

Frontend only:
├── displays conversations
├── displays messages
├── sends staff actions to backend/database
└── never exposes secrets
```

## Message Flow

```text
Customer sends message on platform
↓
Platform sends webhook to backend
↓
Backend validates webhook
↓
Backend saves/updates messageConversations
↓
Backend saves messageThreads
↓
Unified-Message frontend reads database
↓
Staff replies from Unified-Message
↓
Backend sends reply through platform API
```

## Backend Endpoints

```text
Backend API
├── GET  /webhooks/meta
│   └── Meta webhook verification
├── POST /webhooks/meta
│   └── Facebook Messenger + Instagram message events
│
├── GET  /webhooks/whatsapp
│   └── WhatsApp webhook verification
├── POST /webhooks/whatsapp
│   └── WhatsApp message events
│
├── POST /webhooks/viber
│   └── Viber message events
│
├── POST /webhooks/tiktok
│   └── TikTok message events if available
│
├── POST /api/messages/reply
│   └── Send staff reply through correct platform
│
├── POST /api/integrations/connect
│   └── Connect platform account
│
├── POST /api/integrations/disconnect
│   └── Disconnect platform account
│
└── GET /api/integrations/status
    └── Check connection status
```

## Database: integrationSettings

```text
integrationSettings
├── integrationId
├── platform
│   ├── facebook
│   ├── instagram
│   ├── whatsapp
│   ├── viber
│   └── tiktok
├── enabled
├── status
│   ├── connected
│   ├── disconnected
│   ├── error
│   └── pending_review
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

## Facebook Page Messenger + Instagram Page Messages

```text
Meta Integration
├── Meta Developer App
├── Facebook Page
├── Instagram Professional Account
├── Page Access Token
├── App Secret
├── Verify Token
├── Webhook URL: /webhooks/meta
├── Subscribed fields for messages
└── Permissions review if required
```

### Meta Message Flow

```text
Facebook / Instagram message
↓
Meta webhook
↓
/webhooks/meta
↓
Normalize platform event
↓
Save messageConversations
↓
Save messageThreads
↓
Show in Unified-Message
```

## WhatsApp Cloud API

```text
WhatsApp Cloud API
├── Meta Developer App
├── WhatsApp Business Account
├── Phone Number ID
├── Access Token
├── Verify Token
├── Webhook URL: /webhooks/whatsapp
└── Message templates if needed
```

### WhatsApp Flow

```text
Customer WhatsApp message
↓
WhatsApp webhook
↓
/webhooks/whatsapp
↓
Normalize event
↓
Save conversation/thread
↓
Show in Unified-Message
```

## Viber Bot API

```text
Viber Bot API
├── Viber Bot Token
├── Webhook URL: /webhooks/viber
├── Bot Name
├── Bot Avatar
└── HTTPS required
```

### Viber Flow

```text
Customer Viber message
↓
Viber webhook
↓
/webhooks/viber
↓
Normalize event
↓
Save conversation/thread
↓
Show in Unified-Message
```

## TikTok Business Messaging API

```text
TikTok Business Messaging
├── TikTok Business / Developer account
├── Approved app access
├── Business Messaging permissions
├── Webhook / callback setup
└── Access token
```

### TikTok Recommendation

```text
Phase 1: Manual TikTok source tagging
Phase 2: Official TikTok Business Messaging API integration
```

Reason:

```text
TikTok messaging API access may require approval, account eligibility, region support, or partner access.
```

## Staff Reply Flow

```text
Staff types reply in Unified-Message
↓
Frontend sends reply request to backend
↓
Backend checks conversation platform
↓
Backend sends reply using platform API
↓
Backend saves staff reply in messageThreads
↓
Conversation updates in Unified-Message
```

## Ads Attribution

```text
Ads Attribution
├── sourceType: organic / ads
├── platform
├── campaignName
├── adName
├── adId
├── clickId
├── originalMessage
└── firstMessageTime
```

When order is created from ads message:

```text
Ads Message
↓
Create Order
↓
orderSource = platform
sourceType = Ads
adAttribution saved
Reports can track sales from ads
```

## Settings → API Integration UI

```text
Settings
└── API Integration
    └── Unified-Message Integrations
        ├── Facebook Page Messenger
        │   ├── Connect Page
        │   ├── Page ID
        │   ├── Status
        │   ├── Test Connection
        │   └── Disconnect
        ├── Instagram Page Messages
        │   ├── Connect Instagram
        │   ├── Instagram Account ID
        │   ├── Status
        │   ├── Test Connection
        │   └── Disconnect
        ├── WhatsApp Messages
        │   ├── Connect WhatsApp
        │   ├── Phone Number ID
        │   ├── Status
        │   ├── Test Connection
        │   └── Disconnect
        ├── Viber Messages
        │   ├── Bot Token
        │   ├── Webhook URL
        │   ├── Status
        │   ├── Test Connection
        │   └── Disconnect
        └── TikTok Messages
            ├── Connect TikTok
            ├── Business Account ID
            ├── Status
            ├── Test Connection
            └── Disconnect
```

## Pro Lock Rule

```text
If plan = Basic:
├── Unified-Message locked
├── Disable connect buttons
├── Disable message fetching in UI
├── Show upgrade screen
└── Backend may still receive webhooks but should not show/use inbox features unless plan is Pro

If plan = Pro:
├── Enable connect buttons
├── Enable webhooks
├── Show Unified-Message inbox
├── Allow replies
├── Allow Copy to Cart
└── Allow Create Order
```

## Security Rules

```text
Security
├── Store tokens encrypted
├── Never expose access tokens in frontend
├── Verify webhook signatures when available
├── Validate platform message IDs to prevent duplicates
├── Log webhook errors
├── Rate limit reply endpoint
├── Use HTTPS for all webhooks
├── Restrict API Integration settings to Admin/Owner
└── Restrict Super Admin controls to Owner only
```

## Build Order

```text
1. Build Unified-Message UI with sample messages
2. Build database collections
3. Build integrationSettings
4. Build backend webhook receiver
5. Connect Meta: Facebook + Instagram
6. Connect WhatsApp Cloud API
7. Connect Viber Bot API
8. Add TikTok later after checking access
9. Add reply sending
10. Add ads attribution
11. Add Create Order / Copy to Cart
12. Add reports
```

## Final Recommendation

```text
Start with Meta first:
Facebook Page Messenger + Instagram + WhatsApp

Then add:
Viber

Add TikTok last because access can be more limited.
```
