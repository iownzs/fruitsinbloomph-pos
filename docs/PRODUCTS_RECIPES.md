# PRODUCTS_RECIPES.md

# fruitsinbloomph Products & Recipes Structure

## Main Rule

```text
Products = product information, pricing, and recipe setup
Product Stocks = finished product quantity
Ingredient Stocks = raw ingredient/material quantity
Recipes = connection between products and ingredients
Stock Movements = inventory audit trail
```

## Product Structure

```text
Product
├── Product Image
├── Product Name
├── Product Details
├── SKU / Barcode
├── Category
├── Price
├── Cost
├── Current Stock
├── Recipe Ingredients
├── Variants / Add-ons
├── Status
├── Last Updated
└── Actions
```

## Product Categories

```text
Mother's Day
Father's Day
VDAY Collection
FIB Pantry
FIB Eats
Chinese New Year
Anniversary
Happy Birthday
Congratulations
I'm Sorry
Grandparent's Day
Get Well Soon
Thank You
Corporate
Baby Shower
Kiddie Party
Edible Blooms
Christmas
Fruit Platter
Fruit Donut
Doray
Bring and Share
Dipped Fruits
Gourmet Collection
I Love You
Gift Basket
```

## Product Examples

### FOREVER MOM (2025)

```text
Product Name: FOREVER MOM (2025)
Category: Mother's Day
Details: A mother's love is forever and so is this FOREVER Fruits edible arrangement.
Price: ₱5,000
Current Stock: 100
Recipe Ingredients:
├── Strawberry: 10
├── Chocolates
├── Banana Leaves
├── Cookies
└── Stick: 2
```

### PAPA (2026)

```text
Product Name: PAPA (2026)
Category: Father's Day
Details: Here's to an amazing Papa! A fruit edible arrangement made of sweet orange rounds, tarty green apple wedges dipped in white Belgian chocolates with blue choco tip dip.
Price: ₱2,300
Current Stock: 100
Recipe Ingredients:
├── Stick: 2
├── Apple: 2
├── Half Orange Slice: 1
├── Strawberry: 5
├── Grapes: 10
├── Chocolates
├── Cookies
└── Banana Leaves: 5
```

## Ingredient Categories

```text
Fruits
Dairy
Dry Goods
Sweeteners
Toppings
Packaging
Others
```

## Ingredient Examples

```text
Fruits
├── Mango
├── Kiwi
├── Strawberry
├── Banana
├── Grapes
├── Apple
├── Orange / Half Orange Slice
└── Fresh Melon

Dairy
├── Milk
├── Cream
├── Condensed Milk
├── Whipping Cream
└── Special Milk Mix

Dry Goods
├── Sago
├── Flour
├── Oats
├── Rice Crispies
├── Corn Flakes
└── Tapioca Balls

Sweeteners
├── Sugar
├── Honey
├── Syrup
├── Gelatin
├── Melon Gelatin
├── Juice / Flavorful Juice
├── Cookies
└── Heart Cookies

Toppings
├── Sprinkles
├── Jelly Cups
├── Chocolate Chips
├── Marshmallows
├── Chocolates
└── Dairy Milk

Packaging
├── Cup Lids
├── Paper Cups
├── Boxes
├── Trays
├── Stickers
├── Banana Leaves
└── Stick / Sticks
```

## Ingredient Stock Structure

```text
Ingredient Stocks Table
├── Ingredient Image / Ingredient Name
├── Ingredient Details
├── SKU / Barcode
├── Category
├── Current Stock
├── Reserved Stock
├── Available Stock
├── Unit
├── Reorder Level
├── Ingredient Cost
├── Stock Status
├── Last Updated
└── Actions
```

## Product Stock Structure

```text
Product Stocks Table
├── Product Image / Product Name
├── Product Details
├── SKU / Barcode
├── Category
├── Current Stock
├── Reserved Stock
├── Available Stock
├── Unit
├── Reorder Level
├── Stock Status
├── Last Updated
└── Actions
```

## Unit Options

```text
Product Units:
pcs, box, pack, tray, cup, bottle, arrangement, jar, platter

Ingredient Units:
pcs, g, kg, ml, L, cup, tbsp, tsp, pack, box, bottle, jar, tray, bag
```

## Recipe Structure

```text
Recipe
├── Product
├── Ingredients
│   ├── Ingredient Name
│   ├── Quantity Used
│   ├── Unit
│   └── Cost
├── Total Recipe Cost
└── Deduction Rule
```

Example:
```text
Product: Mango Sago
Recipe Ingredients:
├── Mango: 1 pcs
├── Sago: 1/4 cup
├── Milk: 20ml
└── Sugar: 1 tbsp
```

## Ingredient Deduction Flow

```text
Customer buys product
↓
POS checkout completed
↓
System checks product recipe
↓
Ingredient Stocks deduct automatically
↓
Stock Movements records deduction
↓
Ingredient stock status recalculates
```

## Stock Status Rules

```text
In Stock = above reorder level
Low Stock = at or below reorder level
Out of Stock = zero stock
Reserved = reserved for orders
Overstock = above normal expected level
```

## Stock Movement Rule

Every stock change must create a Stock Movement record.

```text
Stock changes include:
├── Product Stock In
├── Product Stock Out
├── Ingredient Stock In
├── Ingredient Stock Out
├── Manual Adjustment
├── Ingredient Deduction
├── Damaged
├── Expired
├── Returned
└── Transfer
```

## Checkout Deduction Rule

```text
During checkout:
├── Validate product has enough stock if stock rule enabled
├── Validate ingredients if recipe deduction enabled
├── Deduct ingredient stocks after order is saved
├── Create stock movement for every ingredient deducted
└── Never deduct ingredients without movement record
```

## Final Products & Recipes Rule

```text
Products are what customers buy.
Ingredients are what products use.
Recipes connect products to ingredients.
Checkout deducts ingredients through recipe.
Stock Movements prove every stock change.
```
