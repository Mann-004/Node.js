const bcrypt = require('bcryptjs');
const ownerModel = require('../models/owner-model.js');
const {adminToken}=require("../utils/adminToken.js")

module.exports.isAdmin=async function(req,res){
    let {email,password}=req.body
    let admin= await ownerModel.findOne({email:email})
    if(!admin){
        return res.send("email or password incorrect")     
    } 
    else{
         let token=adminToken(admin)
         res.cookie("token",token)
         res.redirect("/owners/adminpanel")
    }  
}