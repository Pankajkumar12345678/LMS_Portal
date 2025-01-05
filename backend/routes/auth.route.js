const express = require("express");
const {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	getUserProfile,
	updateProfile,
	
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../utils/multer.js");

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/profile", verifyToken, getUserProfile)
router.post("/profile/update",verifyToken, upload.single("profilePhoto"), updateProfile)

module.exports= router;