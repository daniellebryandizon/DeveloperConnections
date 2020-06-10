const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
//IMPORT VALIDATION 
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

router.post(
    '/',
    //USER VALIDATIONS
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please incude a valid email')
            .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
            .isLength({
                min: 6
            })
    ],
    async (request, response) => {
        const errors = validationResult(request);

        //IF HAS ERRORS, THIS WILL RETURN
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array()
            });
        }

        //IF NO VLAIDATIONS
        const { name, email, password } = request.body;

        try {
            //FIND IF USER EXISTS
            let user = await User.findOne({ email });

            if (user) {
                return response.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                });
            }

            //GET USER AVATAR
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //ENCRYPT PASSWORD
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //SAVE USER
            await user.save();

            //RETURN JSON WEB TOKEN
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtToken'),
                { expiresIn: 36000 },
                (error, token) => {
                    if (error) throw error;
                    response.json({ token });
                }
            );

        } catch (error) {
            console.error(error.message);
            response.status(500).send('Server Error');
        }
    }
);

module.exports = router;