//handle like registering users, adding users
const express = require("express");
// to use express router
const router = express.Router();
const { check, validationResult } = require("express-validator")
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs")
const User = require("../../models/User")

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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: "User Already exists" }] });
            }
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm"
            })
            // create new user object and pass the in an object with the fields that we want, the user has not been save, and encrypt the 
            // password before save it
            user = new User({
                name,
                email,
                avatar,
                password
            });
            // see if the user exists
            // get users gravatar
            // encrypt pasword

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();
            // return jsonwebtoken



            res.send("User registered");

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }




    });

module.exports = router;