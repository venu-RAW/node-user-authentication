const express = require("express");
// const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter.js");
const protectRoute = require("./middlewares/protectRoute.js");

dotenv.config({
	path: "./config.env",
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRouter);

// protected route
app.get("/dashboard", protectRoute, (req, res) => {
	res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.listen(process.env.PORT, () => {
	console.log(`server is listening on port ${process.env.PORT}`);
});
