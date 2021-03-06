const express = require('express');
const router = express.Router();
const authentication = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//#region GET ALL POSTS
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
//#endregion

//#region ADD POST
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
//#endregion

//#region GET POST BY ID
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
//#endregion

//#region DELETE POST
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
//#endregion

//#region LIKE A POST
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
//#endregion

//#region UNLIKE A POST
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

//#endregion

//#region ADD A COMMENT TO A POST
router.post(
    '/comment/:id',
    [
        authentication,
        check('text', 'Text is required')
    ],

    async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(401).json({
                errors: errors.array()
            })
        }

        const { text } = request.body;

        try {
            const post = await Post.findById(request.params.id).sort({ date: -1 });
            const user = await User.findById(request.user.id).select('-password');
            if (!post) return response.status(400).json({ msg: 'Post not found' });

            post.comments.unshift({
                user: request.user.id,
                text,
                name: user.name,
                avatar: user.avatar,
            });

            await post.save();

            response.json(post.comments);

        } catch (error) {
            console.log(error.message);
            if (error.kind === 'ObjectId') {
                return response.status(400).json({ msg: 'Post not found' });
            } else {
                return response.status(500).send('Server error');
            }
        }
    })

//#endregion

//#region UNCOMMENT TO A POST
router.delete(
    '/comment/:id/:comment_id',
    authentication,
    async (request, response) => {
        try {
            const post = await Post.findById(request.params.id).sort({ date: -1 });
            const comment = post.comments.find(comment => comment._id == request.params.comment_id);

            if (!post)
                return response.status(400).json({ msg: 'Post not found' });

            if (comment.user.toString() !== request.user.id)
                return response.status(401).json({ msg: 'User not authorized' });

            const removeComment = post.comments.map(comment => comment.id).indexOf(request.params.comment_id);

            post.comments.splice(removeComment, 1)
            await post.save();

            response.json(post);
        } catch (error) {
            console.log(error.message);
            if (error.kind === 'ObjectId') {
                return response.status(400).json({ msg: 'Post not found' });
            } else {
                return response.status(500).send('Server error');
            }
        }
    }
);
//#endregion



module.exports = router;

