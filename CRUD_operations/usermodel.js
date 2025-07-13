const mongoose=require('mongoose')
// mongodb connection string
mongoose.connect(`mongodb://localhost:27017/student`);

// mongoose model 
const userSchema=mongoose.Schema({
    name: String,
    age: Number,
    email:String,
    stream:String,

    
})

// exports userSchema model
module.exports=mongoose.model('user',userSchema);