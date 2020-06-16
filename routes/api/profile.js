const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const requestGit = require('request');
const config = require('config');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

//GET SPECIFIC PROFILE
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

//CREATE AND UPDATE PROFILE
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

//GET ALL PROFILE
router.get('/', async (request, response) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        response.json(profiles);

    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server');
    }
});

//GET A PROFILE BY USER ID
router.get('/user/:user_id', async (request, response) => {
    try {
        const profile = await Profile.findOne({ user: request.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return response.status(401).json({
                msg: 'There is no profile with this id'
            });
        }

        return response.json(profile);

    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            response.status(401).json({
                msg: 'There is no profile with this id'
            })
        } else {
            response.status(500).send('Server error');
        }
    }
});

//DELETE A PROFILE AND USER
router.delete('/', auth, async (request, response) => {
    try {
        await Profile.findOneAndRemove({ user: request.user.id });

        await User.findOneAndRemove({ _id: request.user.id });

        response.send('User deleted');
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server error');
    }
});

//CREATE AND UPDATE PROFILE EXPREIENCE
router.put(
    '/experience',
    [
        auth,
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ],
    async (request, response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            response.status(401).json({
                errors: errors.array()
            })
        }

        const {
            title,
            company,
            location,
            from, to,
            current,
            description
        } = request.body;

        const newExperience = {
            title, company, location, from, to, current, description
        };

        try {
            const profile = await Profile.findOne({ user: request.user.id });
            profile.experience.unshift(newExperience);
            await profile.save();
            response.json(profile);
        } catch (error) {
            console.error(error.message);
            response.status(500).send('Server error');
        }

    });

//DELETE PROFILE EXPRIENCE
router.delete('/experience/:exp_id', auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({ user: request.user.id });

        const removeExperience = profile.experience.map(item => item.id).indexOf(request.params.exp_id);
        profile.experience.splice(removeExperience, 1);

        await profile.save();

        response.json(profile);
    } catch (error) {
        console.log(error.message);
        response.status(500).send('Server error');
    }
})

router.get('/github/:username', (request, response) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${request.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        requestGit(options, (error, res, body) => {
            if(error) console.log(error)

            if(res.statusCode !== 200) {
                return response.status(404).json({ msg: 'No Github profile found '});
            }

            response.json(JSON.parse(body));
        })
    } catch (error) {
        console.log(error.message);
        response.status(500).send('Server error');
    }
});

module.exports = router;