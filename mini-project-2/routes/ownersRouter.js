const express=require("express");
const router=express.Router();
const ownerModel=require("../models/owner-model.js");
const {isAdmin}=require("../controllers/adminController.js")
const isAdminLogin=require("../middlewares/isAdmin.js")


if(process.env.NODE_ENV ==="development"){
    router.post("/create",async(req,res)=>{
        let owners= await ownerModel.find();
        if(owners.length>0){
            return res
            .status(500)
            .send("You don't have the primission to create a new owner")
        }

        let{fullname,email,password}=req.body;
        let createdOwner=await ownerModel.create({
            fullname,
            email,
            password,
        })
        res.status(201).send(createdOwner)
    })
}

router.get("/adminlogin",(req,res)=>{
    res.render("owner-login")
})

router.post("/ownerslogin",isAdmin)

router.get("/adminpanel",isAdminLogin,(req,res)=>{
    let success=req.flash("success")
    res.render("createproducts",{success})
})




module.exports=router;