# Project Overview

This document is the main source-of-truth overview for the fruitsinbloomph POS system.

## System Purpose

fruitsinbloomph POS is a web-based point-of-sale and operations system for managing orders, kitchen preparation, delivery, pickup, inventory, team chat, staff roles, reports, account settings, and POS billing.

## Main Sidebar Structure

### Main
1. Dashboard
2. POS Terminal
3. Orders

### Operations
4. Kitchen
5. Delivery
6. Pickup

### Inventory
7. Products
8. Product Stocks
9. Ingredient Stocks
10. Stock Movements

### Team & Reports
11. Group Chat
12. Reports

### Business
13. Account
14. POS Billing
15. Settings

## Core Order Flow

```txt
POS Terminal
→ Orders
→ Kitchen
→ Delivery or Pickup
→ Completed
```

## Kitchen Flow

```txt
Orders Created
→ Sent to Kitchen
→ New Orders
→ Start Preparing
→ Preparing
→ Mark Ready
→ Send to Delivery or Send to Pickup
```

## Delivery Flow

```txt
Ready from Kitchen
→ Send to Delivery
→ Waiting for Rider
→ Assign Rider
→ Assign & Start
→ Out for Delivery
→ Mark Delivered
→ Delivered
```

## Pickup Flow

```txt
Ready from Kitchen
→ Send to Pickup
→ Waiting Pickup
→ Mark Picked Up
→ Picked Up
```

## Inventory Relationship

```txt
Products = product information, pricing, image, recipe setup
Product Stocks = finished product quantity
Ingredient Stocks = raw ingredient/material quantity
Stock Movements = stock history and audit trail
```

## Product Recipe Flow

```txt
Create Product
→ Select ingredients from Ingredient Stocks
→ Add quantity used per product
→ Save product.recipe
→ POS checkout validates ingredient stock
→ POS checkout deducts ingredients
→ Stock Movements records Ingredient Deduction
```

## Group Chat

Group Chat includes:

- Header Announcement
- Team Channels
- Chat Message Area
- Message Composer
- Mention Order Preview
- Pinned Messages
- Members Panel
- Chat Settings
- Schedule Channel

Final channel order:

```txt
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

System Message is read-only and used for automated logs only.

## Public Pages

### Live Tracking

Path:

```txt
/public/live-track.html
```

Purpose:

Customer-facing delivery tracking page.

### QR Order Details

Path:

```txt
/public/qr-order-details.html
```

Purpose:

Public read-only full order details page shown when scanning an order QR code.

## Login and Roles

Main roles:

- Owner / Admin
- Manager
- Sales
- Cashier
- Kitchen Staff
- Delivery Staff
- Rider
- Inventory Staff

Role permissions control:

- Sidebar tab visibility
- Module access
- Channel visibility
- Admin settings access
- Schedule editing
- Action permissions

## Firebase Collections

Important Firestore collections:

```txt
users
orders
products
productStocks
ingredientStocks
stockMovements
chatMessages
channelSettings
groupChatSettings
```

## Current Working Checkpoints

- Firebase project connected
- Firestore database exists
- Firestore rules file exists
- Product image upload using Cloudinary works
- Product thumbnails display in Products, POS Terminal, and Product Stocks
- Product recipe builder saves recipe ingredients
- POS checkout validates ingredient stocks before order creation
- POS checkout deducts ingredients after order creation
- Ingredient Deduction stock movements are created
- Group Chat role-based channel filtering works
- Admin / Owner can see all Group Chat channels
- Sales role sees only allowed channels
- Schedule Edit is Admin / Owner only
- Public live tracking and QR order details pages are part of the project
