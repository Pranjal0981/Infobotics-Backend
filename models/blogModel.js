const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for the author
    },
    category: {
        type: String,
        enum: ['sports', 'entertainment', 'breaking-news', 'technology', 'other'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    blogImage: {
        type: Object,
        default: {
            fieldId: "",
            url: ""
        }
    },
    // You can add more fields as needed
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
