const express=require('express')
const app=express()
const userModel=require('./models/user.js')
const postModel=require('./models/post.js')
const port=3000

app.get('/',(req,res)=>{
    res.send("Hello World!")
   
})
app.get('/create',async(req,res)=>{
    let user= await userModel.create({
        username:"Manpreet Singh Randhawa",
        email:"randhwamanpreet37@gmail.com",
        age:20,
    })
    res.send(user)
})

app.get('/post/create',async(req,res)=>{
    let post=await postModel.create({
        post:'MY NAME IS MANPREET SINGH RANDHAWA',
        user:'66e44fa93f7b68b94f77b24f'
    })

    let user=await userModel.findOne({_id:"66e44fa93f7b68b94f77b24f"})
    user.posts.push(post._id)
    await user.save()
    res.send({user,post})
})



app.listen(port,()=>{
    console.log(`Server running at ${port}`)
})