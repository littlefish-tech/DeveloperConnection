// form area where to add posts, like comment and so on
const express = require("express");
// to use express router
const router = express.Router();

// create route, (req, res) => res.send("User route") is the call back function
//@route   GET api/posts
// @ does  test route
// @access Public, doesn't need a token
router.get("/", (req, res) => res.send("Posts route"));

module.exports = router;