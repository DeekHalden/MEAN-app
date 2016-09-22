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

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  quantity: Number,
  upvotes: [UpvotesSchema],
  downvotes: [DownvotesSchema],
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, {
    timestamps: true
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes[0].value += 1;
  this.save(cb);
};

CommentSchema.methods.downvote = function(cb) {
  this.downvotes[0].value -= 1;
  this.save(cb);
};





module.exports = mongoose.model('Comment', CommentSchema);