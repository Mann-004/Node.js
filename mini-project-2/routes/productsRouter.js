const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config.js")
const productModel = require("../models/products-model.js")

router.post("/create", upload.single("image"), async (req, res) => {
  try {
     let = {name,price,discount,bgcolor,panelcolor, textcolor} = req.body

    let product = await productModel.create({
        image: req.file.buffer,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    })
    req.flash("success","Product created successfully")
    // res.render("admin",{product})
    res.redirect("/shop")
}
catch(err){
    res.send(err.message)
}
})

module.exports = router;