//handle like registering users, adding users
const express = require("express");
// to use express router
const router = express.Router();
const { check, validationResult } = require("express-validator/check")
// create route, (req, res) => res.send("User route") is the call back function
//@route   POST api/users
// @ does  register user
// @access Public, doesn't need a token
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        res.send("User route");
    });

module.exports = router;