// form area where to add posts, like comment and so on
const express = require("express");
// to use express router
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");


// create route, (req, res) => res.send("User route") is the call back function
//@route   POST api/posts
// @ does  create a post
// @access private
router.post("/", [auth,
    [
        check("text", "Text is required").not().isEmpty()
    ]

],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            const user = await User.findById(req.user.id).select("-password");
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();
            res.json(post);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error")

        }
    });

//@route get api/posts
//@description get all posts
//@access Private

router.get("/", auth, async (req, res) => {
    try {

        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route get api/posts/:id
//@description get posts by id
// @ access private

router.get("/:id", auth, async (req, res) => {

    try {

        // req.params.id can get the id from the url
        const post = await Post.findById(req.params.id)

        if (!post) {
            // 404 is not found
            return res.status(404).json({ msg: "post not found" });
        }

        res.json(post)

    } catch (err) {
        console.error(err.message);
        res.status(404).json({ msg: "Post not found" })
    }

});

// route delete api/posts/:id;
// @desc delete post by id;
// @access private

router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        // check user, check if the user is the user post the post
        if (post.user.toString() !== req.user.id) {
            // 401 is not authorized
            return res.status(401).json({ msg: "user not authorized" })
        }
        await post.remove();
        res.json({ msg: "Post removed" })
    } catch (err) {
        console.error(err.message);
        res.status(404).json({ msg: "post not found" })
    }
});

// @route put api/posts/like/:id;
// @desc like post
// @access private

router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post already liked" })
        }
        post.likes.unshift({ user: req.user.id })
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

// @route  api/post/unlike/:id;
// @desc unlike a post
// @access private

router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post has not been unliked " });
        }
        // get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1)
        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status.send("Server Error")
    }
});



module.exports = router;