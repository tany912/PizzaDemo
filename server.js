require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;
const expressLayouts = require('express-ejs-layouts');
const { strict } = require('assert');
const routes = require('./routes/web');
const dbconfig = require("./app/models/conn.js");
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events');

// const connection = mongoose.connection; //without it will not work
const sessionStorage = new MongoStore({ mongooseConnection: mongoose.connection , collection: 'sessions'})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  


// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

//Setting the session in Server
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store : sessionStorage,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } //24hours
}))

//Passport config
const passportInit = require('./app/config/passport');
const initRoutes = require('./routes/web');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Global middleware for using session
app.use((req, res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})


//Setting Template engine
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views',path.join(__dirname,'/resources/views'));

app.use(flash())

//Defining Path of Public Assets
app.use(express.static('public'))

//Calling route function
initRoutes(app);



  const server = app.listen(PORT, () => {
    console.log(`This app listening at http://localhost:${PORT}`)
  });


  const io = require('socket.io')(server)
  io.on('connection', (socket) => {
        // Join
        socket.on('join', (orderId) => {
          socket.join(orderId)
        })
  })

  eventEmitter.on('orderUpdated', (data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data);
  })

  eventEmitter.on('orderPlaced', (data)=>{
    io.to('adminRoom').emit('orderPlaced',data);
  })

  
  