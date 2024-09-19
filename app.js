const express = require('express')
const app = express()
const session = require('express-session')
const port = 5000;
const loginRouter = require('./Router/loginRouter')
app.set('view engine','ejs')
app.set('views','Views')
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(express.static('Public'))
app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false
}))


app.use('/',loginRouter)


app.listen(port, () => console.log(`Server running at http://localhost:${port}`))