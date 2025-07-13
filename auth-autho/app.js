const cookieParser = require("cookie-parser")
const express = require("express")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const app = express()
const port = 3000

app.use(cookieParser())


// cookie is used to store some data in browser which is sended from the server
// when we set a cookie it goes to all routes
app.get('/', (req, res) => {
    // res.cookie("name", "Mann")
    res.send('cookie-parser')
    console.log(req.cookies)

})
// $2a$10$RUOBhGl134CxuOpyX5bVCu23JmBep7xgEJJKIE36s2Q/EF/kiSZb2
app.get('/encode', (req, res) => {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash("mannpreet2004", salt, function (err, hash) {
            // Store hash in your password DB.
            console.log(hash)
            res.send("bcrypt")
        });

    });

})

app.get('/decode', (req, res) => {
    bcrypt.compare("mannpreet2004", "$2a$10$RUOBhGl134CxuOpyX5bVCu23JmBep7xgEJJKIE36s2Q/EF/kiSZb2", function (err, res) {
        // res === true
        console.log(res)
    });
    res.send("decode")

})

app.get('/token', (req, res) => {
    const token = jwt.sign({ name: "manpreet" }, 'secretkey', {
        expiresIn:
            "1h"
    })
    res.cookie("token",token)
    res.send("jsonwebtoken")
    console.log(token)
})

app.get('/decodeToken', (req, res) => {
    const token = req.cookies.token
    let data=jwt.verify(token, 'secretkey')
    console.log(data)
    res.send("decodeToken")
})


app.listen(port, () => {
    console.log(`server is listening at ${port}`)

})