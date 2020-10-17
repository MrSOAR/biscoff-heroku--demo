//Install Mongoose as our app dependency: npm install --save mongoose
//Import Mongoose into our app in server.js
const mongoose = require('mongoose')

//create a new product schema
const usermodelSchema = new mongoose.Schema({ 
    /* definition here */
    first_name: {
        type: String,
        required: true,
        max: 100
    },
    last_name: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 100
    },
    pwsalt: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    addresses: [{
        addr_line_1: {
            type: String,
            required: true,
        },
        addr_line_2: String,
        unit: String,
        postal: {
        type: String,
        required: true,
        },
        city: String,
        state: String,
        country: {
            type: String,
            required: true,
        }
    }],
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
const UserModel = mongoose.model('User_Model', usermodelSchema)

//to export the model so that we can use at other places.
module.exports = UserModel