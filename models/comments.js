var mongoose = require('mongoose'),
 voting = require('mongoose-voting');


var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  quantity: Number,
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, {
    timestamps: true
});

CommentSchema.plugin(voting);




const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;