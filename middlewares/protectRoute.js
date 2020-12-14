const verifyToken = require("../helpers/jwtAuthentication.js");
const fs = require("fs");
const path = require("path");
const sendErrorMessage = require("../helpers/sendErrorMessage.js");
const AppError = require("../helpers/appError.js");

const filePath = path.join(__dirname, "..", "data", "users.json");
let userData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const protectRoute = async (req, res, next) => {
	// IF HEADERS ARE NOT PRESENT ----
	if (!req.headers.authorization) {
		return sendErrorMessage(
			new AppError(401, "unsuccesssful", "please login or signup"),
			req,
			res
		);
	}

	// IF HEADERS ARE PRESENT ----
	// EXTRACT TOKEN
	let jwtToken = req.headers.authorization.split(" ")[1];
	let decoded;

   console.log(jwtToken);
	try {
		// VERIFICATION
		decoded = await verifyToken(jwtToken, process.env.JWT_SECRET);
		console.log("decoded", decoded);
	} catch (err) {
		return sendErrorMessage(
			new AppError(401, "Unsuccesssul", "Invalid Token"),
			req,
			res
		);
	}

	// CHECK IF USER IS AVAILABLE
	let { email: currentUser } = userData.find((user) => {
		return user.email === decoded.email;
	});

	if (!currentUser) {
		return sendErrorMessage(
			new AppError(401, "Unsuccesssul", "user not registered"),
			req,
			res
		);
	}
	req.currentUser = currentUser;

	// GIVE ACCESS
	next();
};

module.exports = protectRoute;
