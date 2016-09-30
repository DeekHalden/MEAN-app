const express = require('express'),
    postsRouter = express.Router(),
    Post = require('../models/posts'),
    bodyParser = require('body-parser'),
    Verify = require('./verify'),
    assert = require('assert');

postsRouter.use(bodyParser.json());
/* GET home page. */



postsRouter.get('/', function(req, res, next) {
    Post.find(function(err, posts) {
        if (err) {
            return next(err);
        }

        res.json(posts);
    });
})

.post('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    console.log(req.decoded);
    req.body.postedBy = req.decoded.username;
    var post = new Post(req.body);
    post.save(function(err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});

postsRouter.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error('can\'t find post'));
        }

        req.post = post;
        return next();
    });
});

postsRouter.get('/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});
postsRouter.delete('/:postId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Post.findByIdAndRemove(req.params.postId, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

postsRouter.put('/:post/upvote', Verify.verifyOrdinaryUser, function(req, res, next) {
    Post.findById(req.params.postId, function(err, post) {
        console.log(req.post);
        if (err) return next(err);
        const user = req.decoded._id;
        if (req.post.downvoted === true) {
            req.post.unvote(user, () => {

                res.json(req.post.votes());
            })
        } else {
            req.post.upvote(user, () => {

                res.json(req.post.votes());
            })
        }
    })
});


postsRouter.put('/:post/downvote', Verify.verifyOrdinaryUser, function(req, res, next) {
    Post.findById(req.params.postId, function(err, post) {

        if (err) return next(err);
        const user = req.decoded._id;
        console.log(req.post);
        if (req.post.upvoted === true) {
            req.post.unvote(user, () => {
                console.log(req.post.votes());
                res.json(req.post.votes());
            })
        } else {
            req.post.downvote(user, () => {
                console.log(req.post.votes());
                res.json(req.post.votes());

            });

        }

    })
});
postsRouter.get('/:post/comments', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Post.findById(req.params.postId)
        .populate('comments.postedBy')
        .exec((err, comments) => {
            if (err) return next(err);

            res.json(comments);
        })

});


postsRouter.post('/:post/comments', Verify.verifyOrdinaryUser, function(req, res, next) {
    Post.findById(req.params.postId, (err, post) => {
        if (err) return next(err);

        req.body.postedBy = req.decoded.username;

        req.post.comments.push(req.body);
        req.post.save(function(err, post) {
            if (err) {
                return next(err);
            }

            res.json(post);
        });
    });
})


postsRouter.post('/:post/comments/:comment/upvote', Verify.verifyOrdinaryUser, function(req, res, next) {
    Post.findById(req.params.postId, (err, post) => {
        
        var user = req.decoded._id;
        post = req.post;
        comment = post.comments.id(req.params.comment);
        console.log(comment);
        comment.upvote(user,()=>{
            res.json(comment.votes());
        })
        // comment.upvote(user);
        // console.log(comment);
        // console.log(comment);
        // req.comment.upvote(user, () => {
        //     post.save(req.comment.votes());
        //     res.json(req.comment.votes());
        // });
    });
});

postsRouter.put('/:post/comments/:comment/downvote', Verify.verifyOrdinaryUser, function(req, res, next) {
    Comment.findById(req.params.commentId, (err, comment) => {
        if (err) return next(err);
        console.log(req.params.comment);
        console.log(req.post.comments[0]._idreq.params.comment);
        var comment = req.params.comment;
        const user = req.decoded._id;
        comment.downvote(user, () => {
            res.json(req.comment.votes());
        });


    })
});



module.exports = postsRouter;
