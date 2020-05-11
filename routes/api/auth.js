//handle getting adjacent webtoken for authentication 
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator")
const config = require("config");
const express = require("express");
const auth = require("../../middleware/auth")
// to use express router
const bcrypt = require("bcryptjs");
const User = require("../../models/User")

const router = express.Router();

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

//@route   POST api/auth
// @ does  authenticate user & get token
// @access Public, doesn't need a token

router.post(
    "/",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            // check if the user is exist
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            // create new user object and pass the in an object with the fields that we want, the user has not been save, and encrypt the 
            // password before save it

            //bcrypt compare method
            // check if the password is wrong
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, config.get("jwtSecret"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                });

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    });

module.exports = router;