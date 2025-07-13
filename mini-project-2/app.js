const express= require('express');
const app=express();
const port=3000;
const path=require('path');
const cookieparser=require("cookie-parser");
const db=require("./config/mongoose-connection.js");
const ownersRouter=require("./routes/ownersRouter.js")
const usersRouter=require("./routes/usersRouter.js");
const productsRouter=require("./routes/productsRouter.js");
const indexRouter=require("./routes/indexRouter.js")
const expressSession=require("express-session");
const flash=require("connect-flash");


require("dotenv").config();


app.use(express.urlencoded(({extended:true})))
app.use(express.json());
app.use(
    expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.EXPRESS_SESSION_SECRET,
}))
app.use(flash())
app.use(express.static(path.join(__dirname+"public")));
app.use(cookieparser());
app.set('view engine','ejs');


app.use('/',indexRouter);
app.use('/owners',ownersRouter);
app.use('/users',usersRouter);
app.use('/products',productsRouter);




app.listen(port,()=>{
    console.log(`server running at ${port}`)
})


