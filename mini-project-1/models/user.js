const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mini-project1')
let userSchema=mongoose.Schema({
    username:String,
    email:String,
    age:Number,
    password:String,
    profile:{
        type:String,
        default:"default.png"
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts'
    }]
    
})

module.exports=mongoose.model('user',userSchema)