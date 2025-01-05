const express = require("express");

const {
    createCheckoutSession,
    getAllPurchasedCourse,
    getCourseDetailWithPurchaseStatus,
    stripeWebhook,
} = require("../controllers/coursePurchase.controller");

const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/checkout/create-checkout-session", verifyToken, createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
router.get("/course/:courseId/detail-with-status", verifyToken, getCourseDetailWithPurchaseStatus);
router.get("/", verifyToken, getAllPurchasedCourse);

module.exports = router;