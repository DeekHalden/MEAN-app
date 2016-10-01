const express = require('express'),
    postsRouter = express.Router(),
    Post = require('../models/posts'),
    blogCtrl = require('../controllers/blog.ctrl'),
    bodyParser = require('body-parser'),
    Verify = require('./verify'),
    assert = require('assert');

postsRouter.use(bodyParser.json());


postsRouter
    .get('/', blogCtrl.getPosts)
    .post('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, blogCtrl.postPost)

    .get('/:postId', blogCtrl.getPost)
    .delete('/:postId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, blogCtrl.deletePost)

    .put('/:postId/upvote', Verify.verifyOrdinaryUser, blogCtrl.upvotePost)
    .put('/:postId/downvote', Verify.verifyOrdinaryUser, blogCtrl.downvotePost)

    .get('/:postId/comments', Verify.verifyOrdinaryUser, Verify.verifyAdmin, blogCtrl.getComments)
    .post('/:postId/comments', Verify.verifyOrdinaryUser, blogCtrl.postComment)

    .delete('/:postId/comments/:commentId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, blogCtrl.deleteComment)
    // .post('/:postId/comments/:commentId/upvote', Verify.verifyOrdinaryUser, blogCtrl.upvoteComment)
    // .post('/:postId/comments/:commentId/downvote', Verify.verifyOrdinaryUser, blogCtrl.downvoteComment);

module.exports = postsRouter;
