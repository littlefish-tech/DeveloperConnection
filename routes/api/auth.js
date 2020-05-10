//handle getting adjacent webtoken for authentication 

const express = require("express");
const auth = require("../../middleware/auth")
// to use express router
const router = express.Router();
const User = require("../../models/User")

// create route, (req, res) => res.send("User route") is the call back function
//@route   GET api/Auth
// @ does  test route
// @access Public, doesn't need a token
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        // console.error(), output an error message to the webconsole
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;