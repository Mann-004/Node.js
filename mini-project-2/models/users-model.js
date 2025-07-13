const mongoose=require('mongoose');

let userSchema=mongoose.Schema({
    fullname:String,
    email:String,
    password:String,
    contact:Number,
    picture:String,
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],
    orders:{
        type:Array,
        default:0
    },
    products:{
        type:Array,
    }
});

module.exports=mongoose.model('user',userSchema)

