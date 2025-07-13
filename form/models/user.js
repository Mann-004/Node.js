const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/form');
const userSchrema=mongoose.Schema({
    email:String,
    password:String
})

module.exports=mongoose.model('user',userSchrema)