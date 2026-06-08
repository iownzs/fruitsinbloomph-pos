# fruitsinbloomph POS

A web-based POS and operations system for Fruits in Bloom PH.

Production site:

https://fruitsinbloomph-pos-phase1-fixed.vercel.app

## Current Status

This project is no longer only a static UI. It now includes Firebase / Firestore integration, role-based login, product image upload, inventory tracking, recipe-based ingredient deduction, group chat permissions, and public order pages.

## Main Modules

### Main
- Dashboard
- POS Terminal
- Orders

### Operations
- Kitchen
- Delivery
- Pickup

### Inventory
- Products
- Product Stocks
- Ingredient Stocks
- Stock Movements

### Team & Reports
- Group Chat
- Reports

### Business
- Account
- POS Billing
- Settings

## Key Features

- POS checkout for Pickup and Delivery orders
- Order workflow: POS → Orders → Kitchen → Delivery / Pickup
- Kitchen preparation flow
- Delivery and Pickup operations tables
- Product management with Cloudinary image thumbnails
- Product recipe builder connected to ingredient stocks
- Product Stocks for finished product quantities
- Ingredient Stocks for raw ingredients and materials
- Automatic ingredient deduction after checkout
- Stock Movements audit trail
- Group Chat with role-based channel visibility
- Schedule channel with Admin / Owner editing
- Public Live Tracking page
- Public QR Order Details page
- Firebase Authentication and Firestore
- Firestore security rules
- Vercel deployment

## Public Pages

- `/public/live-track.html`
- `/public/qr-order-details.html`

## Documentation

Project documentation is inside the `/docs` folder.

Recommended reading order:

1. `docs/00_PROJECT_OVERVIEW.md`
2. `docs/POS_STRUCTURE.md`
3. `docs/STATUS_FLOW.md`
4. `docs/DATABASE_STRUCTURE.md`
5. `docs/PRODUCTS_RECIPES.md`
6. `docs/GROUP_CHAT.md`
7. `docs/ROLES_PERMISSIONS.md`
8. `docs/PUBLIC_PAGES.md`
9. `docs/SECURITY_RULES.md`
10. `docs/TESTING_CHECKLIST.md`

## Firebase

Firebase project:

```txt
fruitsinbloomph-pos
```

Common Firebase commands:

```bash
firebase use fruitsinbloomph-pos
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only firestore
```

## Deployment

The frontend is deployed using Vercel.

Production URL:

```txt
https://fruitsinbloomph-pos-phase1-fixed.vercel.app
```

## Tech Stack

- HTML
- CSS
- JavaScript
- Firebase Authentication
- Firestore Database
- Cloudinary image upload
- Vercel deployment
