const express = require('express');
const router = express.Router();
const authentication = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//GET ALL POSTS
router.get(
    '/',
    authentication,
    async (request, response) => {
        const posts = await Post.find().sort({ date: -1 });
        try {
            response.json(posts);
        } catch (error) {
            console.log(error.message);
            response.status(500).send('Server error');
        }
    }
);

//ADD POST
router.post(
    '/',
    [
        authentication,
        check('text', 'Text is required').not().isEmpty()
    ],
    async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(401).json({
                errors: errors.array()
            })
        }

        try {
            const user = await User.findById(request.user.id).select('-password');

            const newPost = new Post({
                text: request.body.text,
                name: user.name,
                avatar: user.avatar,
                user: request.user.id
            })

            const post = await newPost.save();

            response.json(post);
        } catch (error) {
            console.log(error.message);
            response.status(500).send('Server error');
        }

    }
);

//GET POST BY ID
router.get('/:id', authentication, async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) return response.status(404).json({ msg: 'Post not found' });

        response.json(post);
    } catch (error) {
        console.log(error.message);

        if (error.kind === 'ObjectId') {
            response.status(404).json({ msg: 'Post not found' });
        } else {
            response.status(500).send('Server error');
        }
    }
});

//DELETE POST
router.delete('/:id', authentication, async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) return response.status(404).json({ msg: 'Post not found' });

        if (post.user.toString() !== request.user.id) {
            response.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();

        response.json({ msg: 'Post removed' });
    } catch (error) {
        console.log(error.message);

        if (error.kind === 'ObjectId') {
            response.status(404).json({ msg: 'Post not found' });
        } else {
            response.status(500).send('Server error');
        }
    }
});

//LIKE A POST
router.put('/like/:id', authentication, async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) return response.status(404).json({ msg: 'Post not found' });

        if (post.user.toString() !== request.user.id) {
            response.status(401).json({ msg: 'User not authorized' });
        }

        if (post.likes.filter(like => like.user.toString() === request.user.id).length > 0) {
            return response.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: request.user.id });

        await post.save();

        response.json(post);

    } catch (error) {
        console.log(error.message);
        response.status(500).send('Server error');
    }
});

router.put('/unlike/:id', authentication, async (request, response) => {

    try {
        const post = await Post.findById(request.params.id);

        if (!post)
            return response.status(404).json({ msg: 'Post not found' });

        if (post.user.toString() !== request.user.id)
            return response.status(401).json({ msg: 'User not authorized' });


        if (post.likes.filter(like => like.user.toString() === request.user.id).length === 0)
            return response.status(400).json({ msg: 'Post already unliked' });


        const removeUserFromLikedPost = post.likes.map(like => like.id).indexOf({ user: request.user.id });
        post.likes.splice(removeUserFromLikedPost, 1);

        await post.save();
        response.json(post);
    } catch (error) {
        console.log(error.message);
        response.status(500).send('Server error');
    }


});
module.exports = router;