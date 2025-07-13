const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('./models/user.js')
const postModel = require('./models/posts.js')
const cookieParser = require('cookie-parser')
const user = require('./models/user.js')
const upload=require('./ulties/multer.js')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded(({ extended: true })))
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/profile',isLoggedIn, async(req, res) => {  
    let user=await userModel.findOne({email:req.user.email}).populate('posts')
    res.render('profile',{user})
})

app.get('/profile/upload',isLoggedIn, (req, res) => {
    res.render('profilepic')
})

app.post('/upload',isLoggedIn,upload.single('image'), async(req, res) => {
    let user= await userModel.findOne({email:req.user.email })
    user.profile=req.file.filename
    await user.save()
    res.redirect('/profile')
    

})

app.get('/like/:id',isLoggedIn, async(req, res) => {  
    let post=await postModel.findOne({_id:req.params.id}).populate('user')
    if(post.likes.indexOf(req.user.userid)== -1){
        post.likes.push(req.user.userid)
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid),1)
    }

    await post.save()
    res.redirect('/profile')
   
})

app.get('/edit/:id',isLoggedIn, async(req, res) => {  
    let post=await postModel.findOne({_id:req.params.id})
    res.render('updatepost',{post})  
})

app.get('/delete/:id',isLoggedIn, async(req, res) => {  
    let post=await postModel.findOneAndDelete({_id:req.params.id})
    let user=await userModel.findOne({email:req.user.email})
    user.posts.pop(post._id)
    await user.save()
    res.redirect('/profile')
})

app.post('/update/:id',isLoggedIn,async(req,res)=>{
    let post=await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content})
    res.redirect('/profile')

})

app.post('/register', async (req, res) => {
    const { username, email, age, password } = req.body
    let user = await userModel.findOne({ email })
    if (user) {
        res.send("User already registed")
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await userModel.create({
                    username,
                    email,
                    age,
                    password: hash
                })
                let token = jwt.sign({ email:user.email, userid: user._id },'secretKey')
                res.cookie('token', token)
                res.redirect('/profile')
            })
        })
    }
})

app.post('/login',async(req,res)=>{
    const{email,password}=req.body
    let user=await userModel.findOne({email})
    if(!user){
        res.send("email or password wrong")
    }
    else{
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                let token=jwt.sign({email:user.email,userid:user._id},'secretKey')
                res.cookie('token',token)
                res.redirect('/profile')
            }
            else{
                res.send("email or password wrong")
            }
        })
    }
})

app.post('/post',isLoggedIn,async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email})
    const{content}=req.body
    let posts=await postModel.create({
        content,
        user:user._id,
    })
    user.posts.push(posts._id)
    await user.save();
    res.redirect('/profile')
})

app.get('/logout',(req,res)=>{
    res.cookie('token',"")
    res.redirect('/login')

})

function isLoggedIn(req,res,next){
    if(req.cookies.token === ""){
        res.redirect('/login')
    }
    else{
        let data=jwt.verify(req.cookies.token,'secretKey')
        req.user=data
        next()
    }
   
}


app.listen(port, () => {
    console.log(`server running at ${port}`)
})