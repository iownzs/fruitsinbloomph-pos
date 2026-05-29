window.FIB_SEED = {
  products: [
    {
      id: "PROD-FOREVER-MOM-2025",
      name: "FOREVER MOM (2025)",
      category: "Mother's Day",
      price: 5000,
      unit: "arrangement",
      stock: 100,
      status: "Active",
      details: "A mother's love is forever and so is this FOREVER Fruits edible arrangement.",
      recipe: [
        { ingredientId: "ING-STRAWBERRY", name: "Strawberry", qty: 10, unit: "pcs" },
        { ingredientId: "ING-STICK", name: "Stick", qty: 2, unit: "pcs" },
        { ingredientId: "ING-CHOCOLATES", name: "Chocolates", qty: 1, unit: "portion" },
        { ingredientId: "ING-COOKIES", name: "Cookies", qty: 1, unit: "portion" },
        { ingredientId: "ING-BANANA-LEAVES", name: "Banana Leaves", qty: 1, unit: "pcs" }
      ],
      createdAt: null,
      updatedAt: null
    },
    {
      id: "PROD-PAPA-2026",
      name: "PAPA (2026)",
      category: "Father's Day",
      price: 2300,
      unit: "arrangement",
      stock: 100,
      status: "Active",
      details: "Here's to an amazing Papa! A fruit edible arrangement made of sweet orange rounds, tarty green apple wedges dipped in white Belgian chocolates with blue choco tip dip.",
      recipe: [
        { ingredientId: "ING-STICK", name: "Stick", qty: 2, unit: "pcs" },
        { ingredientId: "ING-APPLE", name: "Apple", qty: 2, unit: "pcs" },
        { ingredientId: "ING-HALF-ORANGE-SLICE", name: "Half Orange Slice", qty: 1, unit: "pcs" },
        { ingredientId: "ING-STRAWBERRY", name: "Strawberry", qty: 5, unit: "pcs" },
        { ingredientId: "ING-GRAPES", name: "Grapes", qty: 10, unit: "pcs" },
        { ingredientId: "ING-BANANA-LEAVES", name: "Banana Leaves", qty: 5, unit: "pcs" },
        { ingredientId: "ING-CHOCOLATES", name: "Chocolates", qty: 1, unit: "portion" }
      ],
      createdAt: null,
      updatedAt: null
    },
    {
      id: "PROD-MANGO-SAGO",
      name: "Mango Sago",
      category: "FIB Pantry",
      price: 400,
      unit: "bottle",
      stock: 100,
      status: "Active",
      details: "To all mango lovers, this is a treat for you! Made of real mango, chewy dewy tapioca and gelatin, milk and our flavorful juice.",
      recipe: [
        { ingredientId: "ING-MANGO", name: "Mango", qty: 1, unit: "pcs" },
        { ingredientId: "ING-SAGO", name: "Sago", qty: 0.25, unit: "cup" },
        { ingredientId: "ING-MILK", name: "Milk", qty: 20, unit: "ml" },
        { ingredientId: "ING-SUGAR", name: "Sugar", qty: 1, unit: "portion" },
        { ingredientId: "ING-GELATIN", name: "Gelatin", qty: 1, unit: "portion" },
        { ingredientId: "ING-JUICE", name: "Juice / Flavorful Juice", qty: 1, unit: "portion" }
      ],
      createdAt: null,
      updatedAt: null
    },
    {
      id: "PROD-MELON-MEDLEY",
      name: "Melon Medley",
      category: "FIB Pantry",
      price: 400,
      unit: "bottle",
      stock: 100,
      status: "Active",
      details: "Fresh melon, corn flakes, special milk mix, tapioca balls, and melon gelatin.",
      recipe: [
        { ingredientId: "ING-FRESH-MELON", name: "Fresh Melon", qty: 1, unit: "portion" },
        { ingredientId: "ING-CORN-FLAKES", name: "Corn Flakes", qty: 1, unit: "portion" },
        { ingredientId: "ING-SPECIAL-MILK-MIX", name: "Special Milk Mix", qty: 1, unit: "portion" },
        { ingredientId: "ING-TAPIOCA-BALLS", name: "Tapioca Balls", qty: 1, unit: "portion" },
        { ingredientId: "ING-MELON-GELATIN", name: "Melon Gelatin", qty: 1, unit: "portion" }
      ],
      createdAt: null,
      updatedAt: null
    },
    {
      id: "PROD-LOVE-UPGRADE-2026",
      name: "LOVE UPGRADE (2026)",
      category: "VDAY Collection",
      price: 3000,
      unit: "arrangement",
      stock: 100,
      status: "Active",
      details: "LOVEY fruit edible arrangement with (3) three Cadbury milk chocolate bars.",
      recipe: [
        { ingredientId: "ING-APPLE", name: "Apple", qty: 1, unit: "pcs" },
        { ingredientId: "ING-COOKIES", name: "Cookies", qty: 2, unit: "pcs" },
        { ingredientId: "ING-DAIRY-MILK", name: "Dairy Milk", qty: 3, unit: "pcs" },
        { ingredientId: "ING-STRAWBERRY", name: "Strawberry", qty: 4, unit: "pcs" },
        { ingredientId: "ING-STICK", name: "Stick", qty: 14, unit: "pcs" },
        { ingredientId: "ING-BANANA-LEAVES", name: "Banana Leaves", qty: 4, unit: "pcs" },
        { ingredientId: "ING-BANANA", name: "Banana", qty: 1, unit: "pcs" },
        { ingredientId: "ING-HEART-COOKIES", name: "Heart Cookies", qty: 1, unit: "pcs" }
      ],
      createdAt: null,
      updatedAt: null
    }
  ],

  ingredients: [
    { id: "ING-MANGO", name: "Mango", category: "Fruits", unit: "pcs", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-SAGO", name: "Sago", category: "Dry Goods", unit: "cup", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-MILK", name: "Milk", category: "Dairy", unit: "ml", currentStock: 5000, reorderLevel: 1000, cost: 0, status: "In Stock" },
    { id: "ING-SUGAR", name: "Sugar", category: "Sweeteners", unit: "g", currentStock: 5000, reorderLevel: 1000, cost: 0, status: "In Stock" },
    { id: "ING-GELATIN", name: "Gelatin", category: "Sweeteners", unit: "pack", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-JUICE", name: "Juice / Flavorful Juice", category: "Sweeteners", unit: "ml", currentStock: 5000, reorderLevel: 1000, cost: 0, status: "In Stock" },
    { id: "ING-APPLE", name: "Apple", category: "Fruits", unit: "pcs", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-STRAWBERRY", name: "Strawberry", category: "Fruits", unit: "pcs", currentStock: 200, reorderLevel: 40, cost: 0, status: "In Stock" },
    { id: "ING-GRAPES", name: "Grapes", category: "Fruits", unit: "pcs", currentStock: 500, reorderLevel: 100, cost: 0, status: "In Stock" },
    { id: "ING-BANANA", name: "Banana", category: "Fruits", unit: "pcs", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-HALF-ORANGE-SLICE", name: "Half Orange Slice", category: "Fruits", unit: "pcs", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-FRESH-MELON", name: "Fresh Melon", category: "Fruits", unit: "portion", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-CORN-FLAKES", name: "Corn Flakes", category: "Dry Goods", unit: "pack", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-TAPIOCA-BALLS", name: "Tapioca Balls", category: "Dry Goods", unit: "pack", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-SPECIAL-MILK-MIX", name: "Special Milk Mix", category: "Dairy", unit: "ml", currentStock: 5000, reorderLevel: 1000, cost: 0, status: "In Stock" },
    { id: "ING-MELON-GELATIN", name: "Melon Gelatin", category: "Sweeteners", unit: "pack", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-STICK", name: "Stick", category: "Packaging", unit: "pcs", currentStock: 1000, reorderLevel: 200, cost: 0, status: "In Stock" },
    { id: "ING-BANANA-LEAVES", name: "Banana Leaves", category: "Packaging", unit: "pcs", currentStock: 500, reorderLevel: 100, cost: 0, status: "In Stock" },
    { id: "ING-CHOCOLATES", name: "Chocolates", category: "Toppings", unit: "portion", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-COOKIES", name: "Cookies", category: "Sweeteners", unit: "pcs", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-DAIRY-MILK", name: "Dairy Milk", category: "Toppings", unit: "pcs", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" },
    { id: "ING-HEART-COOKIES", name: "Heart Cookies", category: "Sweeteners", unit: "pcs", currentStock: 100, reorderLevel: 20, cost: 0, status: "In Stock" }
  ]
};
