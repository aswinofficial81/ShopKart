const express = require("express");

const {
  createPaymentOrder,
  getOrders,
    getOrderById
} = require("../controllers/order.controller");

const protect = require("../middlewares/auth.middleware");
const { verifyPayment } = require("../controllers/order.controller");
const router = express.Router();

router.post("/create-payment-order", protect, createPaymentOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;