var mongoose= require('mongoose');
var schema=mongoose.Schema;

var userSchema= new schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    
    role: {
        type: String,
        enum: ['user', 'administrator'], // Only allow 'user' or 'administrator'
        default: 'user' // Default to 'user' for new users
    },

});
module.exports=mongoose.model('user',userSchema)