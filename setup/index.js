const express=require("express");
const app=express();
const path=require('path');
const port = 3000;
const fs=require("fs");

// parsers for handle form data in backend
app.use(express.json());
app.use(express.urlencoded(({extended:true})));
// for to serve a static files

// app.use(express.static('public'));
// app.use(express.static('images'));


// for ejs
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));

// res.render for rendering a html file 
app.get('/',(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
        res.render('index',{files:files});
    })
})


app.post('/create',(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
        res.redirect('/')

    });
   
})

app.get('/files/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,'utf-8',(err,filedata)=>{
        res.render('show',{filename:req.params.filename,filedata:filedata})

    })
   
})


app.post('/edit',(req,res)=>{
  fs.rename(`./files/${req.body.previous}`,`./files/${req.body.newName}`,(err)=>{
    res.redirect('/')
   
  })
  
})

app.get('/edit/:filename',(req,res)=>{
    res.render('edit',{filename:req.params.filename})
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})