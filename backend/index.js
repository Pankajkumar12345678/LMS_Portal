const express = require('express')
const cors= require('cors')
require('dotenv').config()
const connectDB =require('./db/connectDB')
const cookieParser = require('cookie-parser')
const path =require('path')
const authRoutes= require ('./routes/auth.route.js');
const courseRoute = require('./routes/course.route');
const mediaRoute = require('./routes/media.route');
const purchaseRoute = require('./routes/purchaseCourse.route')
const courseProgressRoute = require('./routes/courseProgress.route')

const app = express();
const PORT = process.env.PORT || 8084;
const dirname = path.resolve();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies


app.use("/api/media", mediaRoute);
app.use("/api/auth", authRoutes);
app.use("/api/course",courseRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/progress", courseProgressRoute);



// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(dirname, "frontend", "dist", "index.html"));
// 	});
// }

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});