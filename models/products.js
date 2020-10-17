//Install Mongoose as our app dependency: npm install --save mongoose
//Import Mongoose into our app in server.js
const mongoose = require('mongoose')

//create a new product schema
const productSchema = new mongoose.Schema({ 
    /* definition here */
    name: {
        type: String,
        required: true
    },
    slug: { //it is written on the bakedgoods.js. it is mainly used to make a URL-friendly experience.
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: mongoose.Types.Decimal128, //only for mongoose that it is able to read decimal
        required: true
    },
    image: String
})

const ProductModel = mongoose.model('Product', productSchema)

//to export the model so that we can use at other places.
module.exports = ProductModel