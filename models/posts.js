var mongoose = require('mongoose');

var UpvotesSchema = new mongoose.Schema({
    value: {
        type: Number,
        default: 0
    },
    upvotedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var DownvotesSchema = new mongoose.Schema({
    value: {
        type: Number,
        default: 0

    },
    downvotedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var PostSchema = new mongoose.Schema({

    title: String,
    content: Array,
    author: String,
    upvotes: [UpvotesSchema],
    downvotes: [DownvotesSchema],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]


}, {
    timestamps: true
});

PostSchema.methods.upvote = function(cb) {
    this.upvotes[0].value += 1;
    this.save(cb);
};

PostSchema.methods.downvote = function(cb) {
    this.downvotes[0].value -= 1;
    this.save(cb);
};


module.exports = mongoose.model('Post', PostSchema);
