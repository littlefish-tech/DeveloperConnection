// anything to do with profiles fetching them
// adding them
// updating them
const express = require("express");
// to use express router
const router = express.Router();

// create route, (req, res) => res.send("User route") is the call back function
//@route   GET api/profile
// @ does  test route
// @access Public, doesn't need a token
router.get("/", (req, res) => res.send("Profile route"));

module.exports = router;