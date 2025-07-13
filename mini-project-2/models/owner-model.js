const mongoose=require('mongoose');

let ownerSchema=mongoose.Schema({
    fullname:{
        type:String,
        minLength:3,
        trim:true
    },
    email:String,
    password:String,
    profilepic:String,
    gstin:String,
    products:{
        type:Array,
        default:[],
    }
    
});

module.exports=mongoose.model('owner',ownerSchema)
