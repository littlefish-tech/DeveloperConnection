//handle getting adjacent webtoken for authentication 

const express = require("express");
// to use express router
const router = express.Router();

// create route, (req, res) => res.send("User route") is the call back function
//@route   GET api/Auth
// @ does  test route
// @access Public, doesn't need a token
router.get("/", (req, res) => res.send("Auth route"));

module.exports = router;