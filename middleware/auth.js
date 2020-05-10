const jwt = require("jsonwebtoken");
const config = ("config");

module.exports = function (req, res, next) {
    // get token from header, "x-auth-token" the header key we want to send along 
    const token = req.header("x-auth-token");
    // check if not token
    if (!token) {
        return res.status(401).json({ msg: " No Token, authorization denied" })
    }

    // verify the token if there is one
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        req.user = decoded.user;
        next();
    } catch {
        res.status(401).json({ msg: "Token is not valid" });
    }
}