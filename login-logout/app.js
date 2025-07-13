/* importing all the modules thay are require

1.cookie-parser for sending cookie in frontend
2.bcrypt for password  encryption and decryption
3.jsonwebtoken for creating a token and serving them as cookie
3.ejs for render ejs templates
*/

const cookieParser = require('cookie-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const userModel = require('./models/user.js')

const app = express();
const port = 3000;

app.use(cookieParser())
// setting view engine as ejs
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// serving a form ejs page at /form route
app.get('/form', (req, res) => {
    res.render('form')
})
// post method for sign in
app.post('/signIn', (req, res) => {
    const { username, email, password } = req.body;
    // encrypting password
    bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username: username,
                email: email,
                password: hash
            })
        })
    })
    // token for sending cookie
    let token = jwt.sign({ email: email }, 'secretKey')
    res.cookie("token", token)
    res.render('profile')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email })
    // checking user in our database
    if (!user) {
        res.send("email or password wrong")
    }
    else {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (result) {
                let token = jwt.sign({email: user.email }, 'secret')
                res.cookie("token", token)
                res.render('profile')
            }
            else res.send("email or password wrong")
        })
    }

})

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/form')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})