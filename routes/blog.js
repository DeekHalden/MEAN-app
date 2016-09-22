const express = require('express'),
      postsRouter = express.Router(),
      Post = require('../models/posts'),
      Comment = require('../models/comments'),
      Verify = require('./verify');


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
postsRouter.delete('/:postId',Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Post.findByIdAndRemove(req.params.postId, function(err, post) {
            if (err) return next(err);
            res.json(post);
        });
    });

postsRouter.put('/:post/upvote', Verify.verifyOrdinaryUser, function(req, res, next) {
    // req.post.upvote(function(err, post){
    //   if (err) { return next(err); }

    //   res.json(post);
    // });
    Post.findById(req.params.postId, function(err, post) {
        if (err) return next(err);
        req.body.upvotedBy = req.decoded._id;
        var found = false;
        for (var i = 0; i < req.post.upvotes.length; i++) {
            if (req.post.upvotes[i]._id == req.body.upvotedBy) {
                found = true;
                return false;
            }
        }
        req.post.upvotes.push(req.body.upvotedBy);

        req.post.upvote(function(err, post) {
            if (err) return next(err);
            console.log('Post upvoted')
            res.json(post);
        })
    })
});


postsRouter.put('/:post/downvote', Verify.verifyOrdinaryUser, function(req, res, next) {
    Post.findById(req.params.postId, function(err, post) {
        if (err) return next(err);
        req.body.downvotedBy = req.decoded._id;
        var found = false;
        for (var i = 0; i < req.post.downvotes.length; i++) {
            if (req.post.downvotes[i]._id == req.body.downvotedBy) {
                found = true;
                return false;
            }
        }
        req.post.downvotes.push(req.body.downvotedBy);

        req.post.downvote(function(err, post) {
            if (err) return next(err);
            console.log('Post downvoted')
            res.json(post);
        })
    })
});

postsRouter.post('/:post/comments', Verify.verifyOrdinaryUser, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;


    comment.save(function(err, comment) {
        if (err) {
            return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if (err) {
                return next(err);
            }

            res.json(comment);
        });
    });
});

postsRouter.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error("can't find comment"));
        }

        req.comment = comment;
        return next();
    });
});

postsRouter.put('/:post/comments/:comment/upvote', Verify.verifyOrdinaryUser, function(req, res, next) {
    Comment.findById(req.params.commentId, function(err, comment) {
        if (err) return next(err);
        req.body.upvotedBy = req.decoded._id;
        var found = false;
        for (var i = 0; i < req.comment.upvotes.length; i++) {
            if (req.comment.upvotes[i]._id == req.body.upvotedBy) {
                found = true;
                return false;
            }
        }
        req.comment.upvotes.push(req.body.upvotedBy);

        req.comment.upvote(function(err, comment) {
            if (err) return next(err);
            console.log('Comment upvoted')
            res.json(comment);
        })
    })
});

postsRouter.put('/:post/comments/:comment/downvote', Verify.verifyOrdinaryUser, function(req, res, next) {
    Comment.findById(req.params.commentId, function(err, comment) {
        if (err) return next(err);
        req.body.downvotedBy = req.decoded._id;
        var found = false;
        for (var i = 0; i < req.comment.downvotes.length; i++) {
            if (req.comment.downvotes[i]._id == req.body.downvotedBy) {
                found = true;
                return false;
            }
        }
        req.comment.downvotes.push(req.body.downvotedBy);

        req.comment.downvote(function(err, comment) {
            if (err) return next(err);
            console.log('Comment downvoted')
            res.json(comment);
        })
    })
});



module.exports = postsRouter;
