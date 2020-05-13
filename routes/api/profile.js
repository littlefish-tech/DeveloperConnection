// anything to do with profiles fetching them
// adding them
// updating them
const express = require("express");
// to use express router
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// create route, (req, res) => res.send("User route") is the call back function
//@route   GET api/profile/me
// @ does  get current users profile
// @access  private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route   post api/profile
// @ does  create/update user profile
// @access  private

router.post("/", [auth,
    [
        check("status", "status is required").not().isEmpty(),
        check("skills", "skills is required").not().isEmpty()
    ]
],
    async (req, res) => {
        // the req is the express request object;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //build profile object
        const profileFields = {};
        profileFields.user = req.user.id;

        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(",").map(skill => skill.trim());
        }

        //build social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                // update the profile
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }
            // create profile if there isn't one
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }


    }
);
//@route   Get api/profile
// @ does  get all profiles
// @access  public

router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"])
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   Get api/profile/user/:user_id
// @ does  get profile by user id
// @access  public

router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"])
        res.json(profile);

        if (!profile) return res.status(400).json({ msg: "Profile not found" });

        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Profile not found');
    }
});

//@route   Delete api/profile
// @ does  delete profile, user & posts
// @access  public

router.delete("/", auth, async (req, res) => {
    try {

        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "user deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route   PUT api/profile/experience
// @ description  add profile experience
// @access  private

router.put("/experience", [auth, [
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", " From date is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile)
    } catch (err) {
        console.err(err.message);
        res.status(500).send("Server Error");
    }

});

//@route   DELETE api/profile/experience/:exp_id
// @ description  delete experience from profile
// @access  private

router.delete("/experience/:exp_id", auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.user.id });

        // get the remove index

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});

//@route   PUT api/profile/experience
// @ description  add profile experience
// @access  private

router.put("/education", [auth, [
    check("school", "School is required").not().isEmpty(),
    check("degree", "Degree is required").not().isEmpty(),
    check("fieldofstudy", " Field of study is required").not().isEmpty(),
    check("from", " From date is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();

        res.json(profile)
    } catch (err) {
        console.err(err.message);
        res.status(500).send("Server Error");
    }

});

//@route   DELETE api/profile/education/:edu_id
// @ description  delete education from profile
// @access  private

router.delete("/education/:edu_id", auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.user.id });

        // get the remove index

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});



module.exports = router;