import Product from "../models/Product.js";


// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isAvailable: true
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      message: "Products fetched successfully",
      products
    });

  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product
    });

  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !image ||
      !category
    ) {
      return res.status(400).json({
        message: "All product fields are required"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      isAvailable
    } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.image = image ?? product.image;
    product.category = category ?? product.category;
    product.isAvailable =
      isAvailable ?? product.isAvailable;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};


// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};