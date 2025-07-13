const express = require('express')
const app = express()
const port = 3000
const userModel = require('./usermodel.js')

// all mongodb operationa are asyncronous in nature so we use async await to solve this problem

app.get('/', (req, res) => {
    res.send('Hello World')
})
app.get('/create', async (req, res) => {
    let user = await userModel.create({
        name: "manpreet singh",
        age: 20,
        email: "manpreetsinghrandhawa@gmail.com",
        },
        {
            name: "Manisha",
            age: 19,
            email: "manisha@gmail.com"
        },
        {
            name: "Manisha",
            age: 19,
            email: "manisha@gmail.com",
            stream:"BCA"


        },
        {
            name:"Sumandeep kaur",
            age:20,
            email:"sumandeep@gmail.com"


        })
    res.send(user)
})


app.get('/update', async (req, res) => {

    // findOneAndUpdate(findOne,updateOne,new)
    let updatedUser = await userModel.findOneAndUpdate({ name: "manpreet singh" }, { name: "Manisha" }, { new: true })
    res.send(updatedUser)
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})