const { model, Schema, Schema: { Types: { ObjectId } } } = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 1000
    },
    amount: {
        type: Number,
        default: 100
    },
    imageUrl: {
        type: String,
        default: ''
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
});

module.exports = model('Product', schema);