const express = require('express')
const app = express()
const path = require('path')
const port = 8000;

const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
//static assets
app.use(express.static('public'))


app.use('/user', userRouter)
app.use('/admin', adminRouter)

app.listen(port, ()=>{
  console.log(`server is on Port : ${port}`);
})