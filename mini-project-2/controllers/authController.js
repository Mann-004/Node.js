const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require("../utils/genrateToken.js")
const usersModel = require("../models/users-model");


module.exports.registerUser = async function (req, res) {
    try {
        let { email, fullname, password } = req.body;

        let user = await usersModel.findOne({ email: email })
        if (user) {
            // res.status(401).flash("You already have an account,please login ") 
            req.flash("error", "You already have an account, please login");
            res.status(401).redirect("/");
        }
        else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async function (err, hash) {
                    if (err) {
                        return res.send(err.message)
                    }
                    else {
                        let user = await usersModel.create({
                            email,
                            fullname,
                            password: hash
                        })
                        let token = generateToken(user)
                        res.cookie("token", token)
                        //  res.render("shop")
                        res.redirect("/shop")
                    }
                })

            })
        }
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body
    let user = await usersModel.findOne({ email: email })
    if (!user) {
        return res.send("email or password incorrect")
        // req.flash("error", "You already have an account, please login");
        // res.status(401).redirect("/");
    }


    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user)
            res.cookie("token", token)
            // res.render("shop")
            res.redirect("/shop")

        }
        else {
            // return res.send("email or password incorrect")
            req.flash("error", "email or password wrong");
        res.status(401).redirect("/");
        }

    })
}

module.exports.logout = function (req, res) {
    res.cookie("token", "");
    res.redirect("/")
}
