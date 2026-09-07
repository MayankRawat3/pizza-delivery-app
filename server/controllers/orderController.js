import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";

// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (req, res) => {
  console.log("🔥 CREATE ORDER CONTROLLER HIT");
  console.log("🔥 REQUEST BODY:", req.body);
  console.log("🔥 REQUEST USER:", req.user);

  try {
    const {
      items,
      deliveryAddress,
      subtotal,
      deliveryFee,
      total,
      razorpayOrderId,
      razorpayPaymentId
    } = req.body;

    // ========================================
    // USER VALIDATION
    // ========================================

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "User authentication failed"
      });
    }

    // ========================================
    // ITEMS VALIDATION
    // ========================================

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product"
      });
    }

    // ========================================
    // DELIVERY ADDRESS VALIDATION
    // ========================================

    if (!deliveryAddress) {
      return res.status(400).json({
        message: "Delivery address is required"
      });
    }

    if (
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.address ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        message: "All delivery details are required"
      });
    }

    // ========================================
    // PRICE VALIDATION
    // ========================================

    if (
      subtotal === undefined ||
      deliveryFee === undefined ||
      total === undefined
    ) {
      return res.status(400).json({
        message: "Order price details are required"
      });
    }

    // ========================================
    // PAYMENT VALIDATION
    // ========================================

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        message: "Payment details are required"
      });
    }

    // ========================================
    // INVENTORY REQUIREMENTS
    // ========================================
    //
    // Each pizza requires:
    // 1 base
    // 1 sauce
    // 1 cheese
    // selected vegetables
    //
    // Example:
    // Pizza quantity = 2
    //
    // Base      → -2
    // Sauce     → -2
    // Cheese    → -2
    // Vegetable → -2
    //
    // ========================================

    const requiredInventory = {};

    for (const item of items) {
      const itemQuantity = Number(item.quantity);

      if (!itemQuantity || itemQuantity < 1) {
        return res.status(400).json({
          message: "Invalid item quantity"
        });
      }

      // ----------------------------------------
      // BASE
      // ----------------------------------------

      if (!item.base) {
        return res.status(400).json({
          message: "Pizza base is required"
        });
      }

      const baseKey = `base:${item.base}`;

      requiredInventory[baseKey] = {
        name: item.base,
        category: "base",
        quantity:
          (requiredInventory[baseKey]?.quantity || 0) +
          itemQuantity
      };

      // ----------------------------------------
      // SAUCE
      // ----------------------------------------

      if (!item.sauce) {
        return res.status(400).json({
          message: "Pizza sauce is required"
        });
      }

      const sauceKey = `sauce:${item.sauce}`;

      requiredInventory[sauceKey] = {
        name: item.sauce,
        category: "sauce",
        quantity:
          (requiredInventory[sauceKey]?.quantity || 0) +
          itemQuantity
      };

      // ----------------------------------------
      // CHEESE
      // ----------------------------------------

      if (!item.cheese) {
        return res.status(400).json({
          message: "Pizza cheese is required"
        });
      }

      const cheeseKey = `cheese:${item.cheese}`;

      requiredInventory[cheeseKey] = {
        name: item.cheese,
        category: "cheese",
        quantity:
          (requiredInventory[cheeseKey]?.quantity || 0) +
          itemQuantity
      };

      // ----------------------------------------
      // VEGETABLES
      // ----------------------------------------

      if (Array.isArray(item.vegetables)) {
        for (const vegetable of item.vegetables) {
          if (!vegetable) continue;

          const vegetableKey = `vegetable:${vegetable}`;

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

    // ========================================
    // CHECK INVENTORY
    // ========================================

    for (const key of Object.keys(requiredInventory)) {
      const required = requiredInventory[key];

      // const inventoryItem = await Inventory.findOne({
      //   name: required.name,
      //   category: required.category
      // });

      const normalizedName = required.name
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");

      const inventoryItems = await Inventory.find({
        category: required.category
      });

      const inventoryItem = inventoryItems.find((item) => {
        const normalizedInventoryName = item.name
          .trim()
          .toLowerCase()
          .replace(/-/g, " ")
          .replace(/\s+/g, " ");

        return normalizedInventoryName === normalizedName;
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

    // ========================================
    // DEDUCT INVENTORY
    // ========================================

    for (const key of Object.keys(requiredInventory)) {
      const required = requiredInventory[key];

      // const inventoryItem = await Inventory.findOne({
      //   name: required.name,
      //   category: required.category
      // });


      const normalizedName = required.name
        .trim()
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ");

      const inventoryItems = await Inventory.find({
        category: required.category
      });

      const inventoryItem = inventoryItems.find((item) => {
        const normalizedInventoryName = item.name
          .trim()
          .toLowerCase()
          .replace(/-/g, " ")
          .replace(/\s+/g, " ");

        return normalizedInventoryName === normalizedName;
      });


      inventoryItem.quantity -= required.quantity;

      await inventoryItem.save();

      console.log(
        `📦 STOCK DEDUCTED: ${required.name} -${required.quantity}`
      );
    }

    // ========================================
    // CREATE ORDER
    // ========================================

    const order = await Order.create({
      user: req.user.userId,

      items,

      deliveryAddress,

      subtotal,

      deliveryFee,

      total,

      razorpayOrderId,

      razorpayPaymentId,

      paymentStatus: "paid",

      status: "confirmed"
    });

    console.log(
      "✅ ORDER SAVED SUCCESSFULLY:",
      order._id
    );

    // ========================================
    // RESPONSE
    // ========================================

    res.status(201).json({
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error(
      "❌ CREATE ORDER ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ========================================
// GET ORDER BY ID
// ========================================

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order
    });

  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ========================================
// GET MY ORDERS
// ========================================

export const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "User authentication failed"
      });
    }

    const orders = await Order.find({
      user: req.user.userId
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      message: "Orders fetched successfully",
      orders
    });

  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ========================================
// CANCEL ORDER
// ========================================

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled now"
      });
    }

    order.status = "cancelled";

    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error(
      "CANCEL ORDER ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ========================================
// ADMIN - GET ALL ORDERS
// ========================================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      message: "All orders fetched successfully",
      orders
    });

  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};


// ========================================
// ADMIN - UPDATE ORDER STATUS
// ========================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled"
    ];

    if (!status) {
      return res.status(400).json({
        message: "Order status is required"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message
    });
  }
};