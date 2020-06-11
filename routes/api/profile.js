const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

router.get('/me', auth, async (request, response) => {
    try {
        const { id, name, email, status } = request.body;
        const profile = await Profile.findOne({ user: id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return response.status(400).json({
                msg: 'There is no profile for this user'
            })
        };

        response.json(profile);

    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server error');
    }
});

router.post(
    '/',
    auth,
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ],
    async (request, response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array()
            });
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
            linkedIn
        } = request.body;

        //BUILD PROFILE OBJECT
        const profileFields = {};
        profileFields.user = request.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        //BUILD SOCIAL OBJECT
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedIn) profileFields.social.linkedIn = linkedIn;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: request.user.id });

            //If there is existing user
            if (profile) {
                //Update profile
                profile = await Profile.findOneAndUpdate(
                    { user: request.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return response.json(profile);
            }

            //Create Profile
            profile = new Profile(profileFields);
            await profile.save();

            return response.json(profile);

        } catch (error) {
            console.error(error.message);
            response.status(500).send('Server error');
        }   
    }
);

module.exports = router;