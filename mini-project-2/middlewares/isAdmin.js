const jwt=require("jsonwebtoken")
const ownersModel=require("../models/owner-model.js")


module.exports=async function (req,res,next){
    if(!req.cookies.token){
        req.flash("error","you need to login first")
        return res.redirect("/owners/adminlogin")
    }

    try{
        let decode=jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let admin=await ownersModel.findOne({email:decode.email})
        // req.user=user
        next()
    }
    catch(err){
        req.flash("error","something went wrong")
        return res.redirect("/owners/adminlogin")
    }
}