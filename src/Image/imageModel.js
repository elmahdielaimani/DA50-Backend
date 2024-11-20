const mongoose = require('mongoose');

var schema = mongoose.Schema;

const imageSchema = new schema({
    nom: {
        type: String
    },
    image:{
        type: String
    }
})
module.exports = mongoose.model('Image' , imageSchema);