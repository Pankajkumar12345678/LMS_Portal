const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		
		role:{
			type:String,
			enum:["instructor","student"],
			default:'student'
		},

		enrolledCourses:[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:'Course'
			}
		],

		photoUrl:{
			type:String,
			default:""
		},

		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports=User