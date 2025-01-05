const User = require("../models/user.model");
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');

const {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,

} = require('../mailtrap/emails');

const { uploadMedia, deleteMediaFromCloudinary } = require("../utils/cloudinary");

const signup = async (req, res) => {
	const { email, password, name } = req?.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
				error: true
			});
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
			error: true
		});
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		if (!user.isVerified) {
			return res.status(400).json({ success: false, message: "User not Verified please Verify Account" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};


const verifyEmail = async (req, res) => {
	const { code } = req?.body;
	// Validate the code input
	if (!code) {
		return res.status(400).json({
			success: false,
			message: "Verification code is required"
		});
	}
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired verification code"
			});
		}
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		// Send welcome email, and handle possible errors
		try {
			await sendWelcomeEmail(user.email, user.name);
		} catch (emailError) {
			console.error("Failed to send welcome email:", emailError);
		}
		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

	} catch (error) {
		console.error("Error in verifyEmail:", error);
		res.status(500).json({
			success: false,
			message: "Server error"
		});
	}
};


const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found"
			});
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

		res.status(200).json({
			success: true,
			message: "Password reset link sent to your email"
		});

	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired reset token"
			});
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({
			success: true,
			message: "Password reset successful"
		});

	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password")  // '-' means password not include
		//addtional add this populate for data finding
		.populate({
			path: "enrolledCourses",
			select: "courseTitle coursePrice courseLevel courseThumbnail",
			populate: {
				path: "creator",
				select: "name photoUrl -_id"
			  }
		  });  

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({
			success: true,
			user
		});

	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({
			success: false,
			message: error.message || error
		});
	}
};

const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");  // '-' means password not include
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({
			success: true,
			message: "User Load is successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

	}
	catch (error) {
		console.log("Failed to load user", error);
		return res.status(400).json({
			success: false,
			message: error.message || "Failed to load user" || error
		});
	}
}


const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete old photo from Cloudinary if it exists
        if (user.photoUrl) {
            try {
                const publicId = user.photoUrl.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            } catch (error) {
                console.error("Failed to delete old photo from Cloudinary:", error);
            }
        }

        // Upload new photo if provided
        let photoUrl = user.photoUrl;
        if (profilePhoto) {
            const cloudResponse = await uploadMedia(profilePhoto.path);
            photoUrl = cloudResponse.secure_url;
        }

        const updatedData = { name, photoUrl };
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully.",
        });
    } catch (error) {
        console.error("Failed to update profile:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

module.exports = {
	signup,
	login,
	logout,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	getUserProfile,
	updateProfile,
};
