const jwt = require("jsonwebtoken");
const config = require("config");
const debug = require("debug")("app:auth.middleware");

const checkAuth = (req, res, next) => {
    try {
        // Auth token string consists Bearer
        const token = req.headers.authorization.split(" ")[1];
        debug(token);
        const decodedToken = jwt.verify(token, config.get("JWT_KEY"));
        debug(decodedToken);
        debug(`Token created at: ${new Date(decodedToken.iat*1000).toString()}`);
        debug(`Token valid till: ${new Date(decodedToken.exp*1000).toString()}`);
        req.userData = decodedToken;
        next();
    } catch (err) {
        res.status(401).json({message: "Please login first!"});
    }
};

module.exports = checkAuth;