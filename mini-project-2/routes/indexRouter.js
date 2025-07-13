const express=require("express")
const router=express.Router()
const isLoggedIn=require("../middlewares/isLoggedIn.js")
const productModel=require("../models/products-model.js")
const usersModel = require("../models/users-model.js")


router.get("/",(req,res)=>{
    let error=req.flash("error")
    res.render("index",{error , loggedIn:false})
    
})

router.get("/shop",isLoggedIn,async(req,res)=>{
    let products= await productModel.find();
    let success =req.flash("success")
    res.render("shop",{products,success})
})

router.get("/cart",isLoggedIn,async(req,res)=>{
    let user=await usersModel.findOne({email:req.user.email}).populate("cart");
    res.render("cart",{user});
})

router.get("/addtocart/:id",isLoggedIn,async(req,res)=>{
   let user= await usersModel.findOne({email:req.user.email});
   user.cart.push(req.params.id);
   await user.save();
   req.flash("success","Added to cart");
   res.redirect("/shop")

})


router.get("/logout",isLoggedIn,(req,res)=>{
    res.render("shop")
})



module.exports=router


