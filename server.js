const express = require('express')
const app = express()
const path = require('path')
const port = 8000;


const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin');
const connectDB = require('./db/connectDB');
const session = require('express-session')
const nocache = require('nocache')

app.use(nocache());
app.use(session({
  secret:'mysecretkey',
  resave: false,
  saveUninitialized:true,
  cookie:{
    maxAge: 1000*60*60*24
  }
}))


app.use( express.urlencoded({extended:true}) )
app.use( express.json() )



const hbs = require('hbs');
hbs.registerHelper('inc', function(value) {
    return parseInt(value) + 1;
});

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
//static assets
app.use(express.static('public'))



app.use('/user', userRouter)
app.use('/admin', adminRouter)



connectDB()

app.listen(port, ()=>{
  console.log(`server is on Port : ${port}`);
})