const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    voting = require('mongoose-voting');

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    postedBy: String,
    quantity: Number,

}, {
    timestamps: true
});

const PostSchema = new Schema({
    title: String,
    content: Array,
    postedBy: String,
    comments: [CommentSchema]
}, {
    timestamps: true
});

CommentSchema.plugin(voting);
PostSchema.plugin(voting);


const Posts = mongoose.model('Posts', PostSchema);

module.exports = Posts;
