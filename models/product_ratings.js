//Install Mongoose as our app dependency: npm install --save mongoose
//Import Mongoose into our app in server.js
const mongoose = require('mongoose')

//create a new product schema
const productRatingSchema = new mongoose.Schema({ 
    /* definition here */
    product_id: {
        type: String,
        required: true
    },
    product_slug: { 
        type: String,
        required: true,
    },
    rating: {
        type: mongoose.Types.Decimal128, //only for mongoose that it is able to read decimal
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        max: 300,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})
// separate Product Rating with an "_" so that your mongoDB library will split it with a space.
const ProductRatingModel = mongoose.model('Product_Rating', productRatingSchema)

//to export the model so that we can use at other places.
module.exports = ProductRatingModel