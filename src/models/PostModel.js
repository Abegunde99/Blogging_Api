const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    body: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    read_count: {
        type: Number,
        default: 0,
    },
    read_time: {
        type: String,
    },
    tag: String,
    
}, { timestamps: true });

postSchema.pre('save', function (next) {
    const words = this.body.split(' ');
    const readTime = Math.ceil(words.length / 200);
    this.read_time = `${readTime} min read`;
    next();
})

module.exports = mongoose.model('Post', postSchema);
     