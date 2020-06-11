const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (request, response) => {
        const errors = validationResult(request);

        //IF HAS ERRORS, THIS WILL RETURN
        if (!errors.isEmpty()) {
            return response.status(401).json({
                errors: errors.array()
            })
        }

        //IF HAS NO VALIDATIONS
        const { email, password } = request.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return response.status(401).json({
                    msg: 'Invalid credentials'
                });
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return response.status(401).json({
                    msg: 'Invalid credentials'
                });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtToken'),
                { expiresIn: 36000 },
                (error, token) => {
                    if(error) throw error;
                    response.json({token});
                }
            )
        } catch (error) {
            console.log(error.message);
            response.status(500).send('Server error')
        }
    }
);

module.exports = router;