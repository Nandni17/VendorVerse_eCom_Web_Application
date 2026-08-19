const Product = require("../models/Product");

// ADD PRODUCT (SELLER ONLY)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SELLER PRODUCTS
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Not found" });

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your product" });
    }

    // Only update allowed fields
    const {
      name,
      price,
      description,
      image,
      category,
      brand,
      stock,
    } = req.body;

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description =
      description ?? product.description;
    product.image = image ?? product.image;
    product.category =
      category ?? product.category;
    product.brand =
      brand ?? product.brand;
    product.stock =
      stock ?? product.stock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Not found" });

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your product" });
    }

    await product.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PRODUCTS (PUBLIC)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE PRODUCT (PUBLIC)
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};