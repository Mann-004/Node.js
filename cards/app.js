const express=require('express');
const app=express();
const port=3000;
const path=require('path');
const userModel=require('./models/user.js')


app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname+'public')));


app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/create',async(req,res)=>{
    let{name,email,image}=req.body;
    let createdUser = await userModel.create({
        name,
        email,
        image
    })
    res.redirect('/read')
})

app.get('/read',async(req,res)=>{
    let users = await userModel.find();
    res.render('read',{users})
})

app.get('/delete/:id',async(req,res)=>{
    let users = await userModel.findOneAndDelete({_id:req.params.id});
    res.redirect('/read')
    // console.log(req.params.id)
})


app.get('/edit/:id',async(req,res)=>{ 
    let userData=await userModel.findOne({_id:req.params.id})
    res.render('update',{userData})
    
})
app.post('/update/:userid',async(req,res)=>{
    let{name,email,image}=req.body;
    let userDataUpdate=await userModel.findOneAndUpdate({_id:req.params.userid},{name,email,image},{new:true});
    res.redirect('/read')
    
})





app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})