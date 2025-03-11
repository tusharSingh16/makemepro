const express = require("express");
const router = express.Router();
const { Orders } = require("../models/orders");
const { User } = require("../models/user");
const { authMiddleware } = require("../middleware/authMiddleware");
const axios = require("axios");

// POST /checkout: create a new order.
// Expected req.body should include members (array of ObjectIds),
// listings (array of ObjectIds), and a price object {subtotal, tax, shipping, totalPrice}.
router.post("/checkout", authMiddleware, async function (req, res) {
  const userId = req.userId;
  try {
    const newOrderData = {
      ...req.body,
      user: userId,
    };
    const newOrder = new Orders(newOrderData);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /getAllOrders: return all orders with populated references.
router.get("/getAllOrders", async function(req, res) {
  try {
    const orders = await Orders.find()
      .populate("user")
      .populate("members")
      .populate("listings");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Orders not found" });
    }
    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message || error,
    });
  }
});

// GET /getOrdersByUserId/:userId: return orders for a specific user.
router.get("/getOrdersByUserId/:userId", async function (req, res) {
  const { userId } = req.params;
  try {
    const orders = await Orders.find({ user: userId })
      .populate("members")
      .populate("listings");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Orders not found for this user" });
    }
    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message || error,
    });
  }
});

// GET /getOrdersDetailsByUserId/:userId: return detailed orders for a specific user.
router.get("/getOrdersDetailsByUserId/:userId", async function (req, res) {
  const { userId } = req.params;
  try {
    const orders = await Orders.find({ user: userId })
      .populate("members")
      .populate("listings");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for the given user ID" });
    }
    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message || error,
    });
  }
});

// GET /getOrderById/:orderId: return a single order by its ID.
router.get("/getOrderById/:orderId", async function (req, res) {
  const { orderId } = req.params;
  try {
    const order = await Orders.findById(orderId)
      .populate("members")
      .populate("listings")
      .populate("user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order",
      error: error.message || error,
    });
  }
});

// GET /getOrderDetailsByOrderId/:orderId: return detailed order information by order ID.
router.get("/getOrderDetailsByOrderId/:orderId", async function (req, res) {
  const { orderId } = req.params;
  try {
    const order = await Orders.findById(orderId)
      .populate("members")
      .populate("listings")
      .populate("user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order details",
      error: error.message || error,
    });
  }
});

module.exports = router;
