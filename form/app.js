const express=require('express')
const cookieparser=require('cookie-parser')
const jwt =require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const path=require('path')
const userModel=require('./models/user.js')
const port=3000

const app=express()
app.use(cookieparser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(('public')))
app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/signIn',(req,res)=>{
    const {email, password} = req.body;
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(password,salt, async function(err,hash){
            let user=await userModel.create({
                email:email,
                password:hash
            })
        })
    })

   let token= jwt.sign({email:email},'secret')
   res.cookie("token",token)
   res.send('profile')
   

})
app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async(req,res)=>{
    let user= await userModel.findOne({email:req.body.email})
    console.log(user.email)
    if(!user){
        res.send("email or password wrong")
    }
    else{
        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            if(result){
                let token=jwt.sign({email:user.email},'scretKey')
                res.cookie("token",token)
                res.send('profile')
            }
            else{
                res.send("email or password wrong")
            }
        })
    }

})

app.get('/logout',(req,res)=>{
    res.clearCookie("token")
    res.redirect('/')
})


app.listen(port,()=>{
    console.log(`server running at ${port}`)
})