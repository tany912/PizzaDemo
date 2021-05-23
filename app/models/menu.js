
const mongoose = require('mongoose');
const validator = require('validator');

const MenuSchema = new mongoose.Schema({

    name : {
        type : String,
        required: true,
    },
    image : {
        type : String,  //We dont store .png, we store url in DB so it will come in string
        required: true,
    },
    price : {
        type : Number,
        required: true,
    },

    size : {
        type : String,
        required: true,
    }

})

//Collection creation through model
const menu = new mongoose.model('menu', MenuSchema);

module.exports = menu;

