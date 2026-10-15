const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!customer.cart) {
      customer.cart = [];
    }

    const existingItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem) {
      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity exceeds available stock",
        });
      }

      customer.cart.push({
        product: productId,
        quantity: 1,
      });
    } else {
      const newQuantity = existingItem.quantity + 1;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Quantity exceeds available stock",
        });
      }

      existingItem.quantity = newQuantity;
    }

    await customer.save();
    await customer.populate({
      path: "cart.product",
      select: "name price image category stock",
    });

    const cart = customer.cart.filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image category stock",
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const cart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (
      typeof quantity !== "number" ||
      isNaN(quantity) ||
      quantity < 1 ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!customer.cart) {
      customer.cart = [];
    }

    const existingItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
      });
    }

    existingItem.quantity = quantity;

    await customer.save();
    await customer.populate({
      path: "cart.product",
      select: "name price image category stock",
    });

    const cart = customer.cart.filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!customer.cart) {
      customer.cart = [];
    }

    const existingItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await customer.save();
    await customer.populate({
      path: "cart.product",
      select: "name price image category stock",
    });

    const cart = customer.cart.filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
};
