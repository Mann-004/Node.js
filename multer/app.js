const express = require('express')
const multer = require('multer')
const path = require('path')
const crypto = require('node:crypto')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded(({ extended: true })))
app.set('view engine', 'ejs')
app.use(express.static('public'))



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/upload')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, bytes) => {
            const fn=bytes.toString('hex')+path.extname(file.originalname)
            cb(null,fn)

        })
    }
})

const upload = multer({ storage: storage })


app.get('/', (req, res) => {
    res.render('index')
})
app.post('/upload',upload.single('image'), (req, res) => {
    console.log(req.file)

})



app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})