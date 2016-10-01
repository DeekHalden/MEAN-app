Post = require('../models/posts'),
    
    module.exports = {
        getPosts: (req, res, next) => {
            Post.find((err, posts) => {
                if (err) {
                    return next(err);
                }

                res.json(posts);
            });
        },
        postPost: (req, res, next) => {

            req.body.postedBy = req.decoded._id;
            req.body.username = req.decoded.username;

            var post = new Post(req.body);
            post.save((err, post) => {
                if (err) return next(err);
                res.json(post);
            })
        },
        getPost: (req, res, next) => {
            Post.findById(req.params.postId, (err, post) => {
                if (err) {
                    return next(err);
                }

                res.json(post);
            });
        },
        deletePost: (req, res, next) => {
            Post.findByIdAndRemove(req.params.postId, (err, post) => {
                if (err) return next(err);
                res.json(post);
            });
        },
        upvotePost: (req, res, next) => {
            Post.findById(req.params.postId)
                .populate('comments.postedBy')
                .exec((err, post) => {

                    if (err) return next(err);
                    const user = req.decoded._id;
                    if (post.downvoted === true) {
                        post.unvote(user, () => {

                            res.json(post.votes());
                        })
                    } else {
                        post.upvote(user, () => {

                            res.json(post.votes());
                        })
                    }
                })
        },
        downvotePost: (req, res, next) => {
            Post.findById(req.params.postId)
                .populate('comments.postedBy')
                .exec((err, post) => {

                    if (err) return next(err);
                    const user = req.decoded._id;

                    if (post.upvoted === true) {
                        post.unvote(user, () => {

                            res.json(post.votes());
                        })
                    } else {
                        post.downvote(user, () => {
                            res.json(post.votes());

                        });

                    }

                })
        },
        getComments: (req, res, next) => {
            Post.findById(req.params.postId)
                .populate('comments.postedBy')
                .exec((err, comments) => {
                    if (err) return next(err);
                    res.json(post.comments);
                })
        },
        postComment: (req, res, next) => {
            Post.findById(req.params.postId, (err, post) => {
                if (err) return next(err);
                req.body.postedBy = req.decoded._id;
                req.body.username = req.decoded.username;
                post.comments.push(req.body);
                post.save(function(err, post) {
                    if (err) return next(err);
                    res.json(post);
                });
            });
        },
        deleteComment: (req, res, next) => {
            Post.findById(req.params.postId, (err, post) => {
                comment = post.comments.id(req.params.comment);
                post.comments.splice(comment, 1);
                res.json(post.save());
            })
        }

        // upvoteComment: (req, res, next) => {
        //     Post.findById(req.params.postId)
        //         .populate('comments.postedBy')
        //         .exec((err, post) => {
        //             if (err) return next(err);

        //             var comment = post.comments.id(req.params.commentId);

        //             comment.upvote(user, () => {
        //                 res.json(comment.votes());
        //             })

        //         })

        // },
        // downvoteComment: (req, res, next) => {
        //     Post.findById(req.params.postId)
        //         .populate('comments.postedBy')
        //         .exec((err, post) => {
        //             if (err) return next(err);
        //             var user = req.decoded._id;
        //             var comment = post.comments.id(req.params.commentId);
        //             console.log(comment);
        //             comment.downvote(user, () => {
        //                 post.save((err) => {
        //                     if (err) return next(err)
        //                     res.json(comment.votes());
        //                 })

        //             });


        //         })

        // }
    }
