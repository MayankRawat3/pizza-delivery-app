import Inventory from "../models/Inventory.js";

// ==========================================
// GET ALL INVENTORY ITEMS
// ==========================================

export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .sort({ category: 1, name: 1 });

    res.status(200).json({
      message: "Inventory fetched successfully",
      inventory
    });

  } catch (error) {
    console.error("GET INVENTORY ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// GET SINGLE INVENTORY ITEM
// ==========================================

export const getInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found"
      });
    }

    res.status(200).json({
      message: "Inventory item fetched successfully",
      item
    });

  } catch (error) {
    console.error("GET INVENTORY ITEM ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// CREATE INVENTORY ITEM
// ==========================================

export const createInventoryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      threshold,
      unit
    } = req.body;

    // Required fields
    if (
      !name ||
      !category ||
      quantity === undefined ||
      threshold === undefined ||
      !unit
    ) {
      return res.status(400).json({
        message: "All inventory fields are required"
      });
    }

    // Prevent negative values
    if (quantity < 0 || threshold < 0) {
      return res.status(400).json({
        message: "Quantity and threshold cannot be negative"
      });
    }

    const item = await Inventory.create({
      name,
      category,
      quantity,
      threshold,
      unit
    });

    res.status(201).json({
      message: "Inventory item created successfully",
      item
    });

  } catch (error) {
    console.error("CREATE INVENTORY ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// UPDATE INVENTORY STOCK
// ==========================================

export const updateInventoryStock = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      quantity,
      threshold,
      unit
    } = req.body;

    const item = await Inventory.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found"
      });
    }

    // Update only provided fields
    if (name !== undefined) {
      item.name = name;
    }

    if (category !== undefined) {
      item.category = category;
    }

    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({
          message: "Quantity cannot be negative"
        });
      }

      item.quantity = quantity;
    }

    if (threshold !== undefined) {
      if (threshold < 0) {
        return res.status(400).json({
          message: "Threshold cannot be negative"
        });
      }

      item.threshold = threshold;
    }

    if (unit !== undefined) {
      item.unit = unit;
    }

    await item.save();

    res.status(200).json({
      message: "Inventory updated successfully",
      item
    });

  } catch (error) {
    console.error("UPDATE INVENTORY ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// DELETE INVENTORY ITEM
// ==========================================

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Inventory item not found"
      });
    }

    await Inventory.findByIdAndDelete(id);

    res.status(200).json({
      message: "Inventory item deleted successfully"
    });

  } catch (error) {
    console.error("DELETE INVENTORY ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

// ========================================
// CHECK INVENTORY BEFORE PAYMENT
// ========================================

export const checkInventoryBeforePayment = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    const requiredInventory = {};

    for (const item of items) {
      const itemQuantity = Number(item.quantity);

      if (!itemQuantity || itemQuantity < 1) {
        return res.status(400).json({
          message: "Invalid item quantity"
        });
      }

      // BASE
      if (!item.base) {
        return res.status(400).json({
          message: "Pizza base is required"
        });
      }

      const baseKey = `base:${item.base
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")}`;

      requiredInventory[baseKey] = {
        name: item.base,
        category: "base",
        quantity:
          (requiredInventory[baseKey]?.quantity || 0) +
          itemQuantity
      };

      // SAUCE
      if (!item.sauce) {
        return res.status(400).json({
          message: "Pizza sauce is required"
        });
      }

      const sauceKey = `sauce:${item.sauce
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")}`;

      requiredInventory[sauceKey] = {
        name: item.sauce,
        category: "sauce",
        quantity:
          (requiredInventory[sauceKey]?.quantity || 0) +
          itemQuantity
      };

      // CHEESE
      if (!item.cheese) {
        return res.status(400).json({
          message: "Pizza cheese is required"
        });
      }

      const cheeseKey = `cheese:${item.cheese
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")}`;

      requiredInventory[cheeseKey] = {
        name: item.cheese,
        category: "cheese",
        quantity:
          (requiredInventory[cheeseKey]?.quantity || 0) +
          itemQuantity
      };

      // VEGETABLES
      if (Array.isArray(item.vegetables)) {
        for (const vegetable of item.vegetables) {
          if (!vegetable) continue;

          const vegetableKey = `vegetable:${vegetable
            .trim()
            .toLowerCase()
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")}`;

          requiredInventory[vegetableKey] = {
            name: vegetable,
            category: "vegetable",
            quantity:
              (requiredInventory[vegetableKey]?.quantity || 0) +
              itemQuantity
          };
        }
      }
    }

    // CHECK STOCK
    for (const key of Object.keys(requiredInventory)) {
      const required = requiredInventory[key];

      const inventoryItems = await Inventory.find({
        category: required.category
      });

      const inventoryItem = inventoryItems.find((item) => {
        const normalizedInventoryName = item.name
          .trim()
          .toLowerCase()
          .replace(/-/g, " ")
          .replace(/\s+/g, " ");

        const normalizedRequiredName = required.name
          .trim()
          .toLowerCase()
          .replace(/-/g, " ")
          .replace(/\s+/g, " ");

        return normalizedInventoryName === normalizedRequiredName;
      });

      if (!inventoryItem) {
        return res.status(400).json({
          message: `Inventory item not found: ${required.name}`
        });
      }

      if (inventoryItem.quantity < required.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${required.name}. Available: ${inventoryItem.quantity}, Required: ${required.quantity}`
        });
      }
    }

    return res.status(200).json({
      message: "Inventory available",
      available: true
    });

  } catch (error) {
    console.error(
      "CHECK INVENTORY ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message
    });
  }
};