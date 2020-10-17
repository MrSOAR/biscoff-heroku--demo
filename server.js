// =======================================
//              DEPENDENCIES
// =======================================
//to make it clean, we shall put our imports at the top.
require('dotenv').config()
const express = require('express');
const methodOverride = require('method-override')
const mongoose = require('mongoose') //you are importing the mongoose library
const session = require('express-session') //import the library
const productsController = require('./controllers/ProductsController') //For CRUD application to work properly, the database must be available and connection must be made before our application starts. //I.e. our MongoDB is properly connected before our express application
const productsRatingsController = require('./controllers/ProductRatingsController')
const usersController = require ('./controllers/UsersController')
const app = express();
const port = 5000;

//we are doing this to check
console.log(process.env)
console.log(process.env.DB_USER) 
console.log(process.env.DB_HOST)
// =======================================
//              MONGOOSE
// =======================================
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}` //pass the connection stream
mongoose.set('useFindAndModify', false) //option for the deprecation warning. //to resolve the deprecation warning

// =======================================
//              EXPRESS SETUP
// =======================================
// set template engine to use //the views folder is using ejs. so that everytime you call for it, it will know that you are referring to the views folder.
app.set('view engine', 'ejs')

// tell Express app where to find our static assets
app.use(express.static('public'))

// tell Express app to make use of the imported method-override library
app.use(methodOverride('_method')) //you will need ot add on to line 7 of edit.

//tell Express app to parse incoming form requests,
// and make it available in req.body
app.use(express.urlencoded({
  extended: true
}))

//how to use the npm express-session
app.use(session({
  secret: process.env.SESSION_SECRET, //we need to encrypt the user data
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } // 3600000ms = 3600s = 60mins, cookie expires in an hour.
})) //for now we put the secure as false because we did not set up an SSL in our server. We will do this later.
app.use(setUserVarMiddleware)

//Whenever I use app.use, it will be executed first before the routes are being run.
//It is being executed at the global level.
// app.use(someMiddleware) 
// =======================================
//              ROUTES
// =======================================

//              PRODUCTS ROUTE
// =======================================
// index route
app.get('/products', productsController.listProducts)

// new route
app.get('/products/new', productsController.newProduct)

// show route //change the :id to slug
app.get('/products/:slug', productsController.showProduct)

// create route
app.post('/products', productsController.createProduct)

// edit route
app.get('/products/:slug/edit', productsController.showEditForm)

// update route
app.patch('/products/:slug', productsController.updateProduct)

// delete route
app.delete('/products/:slug', productsController.deleteProduct)

//              PRODUCTS RATINGS ROUTE
// =======================================

// create product rating new route
app.get('/products/:slug/ratings/new', productsRatingsController.newProductRatingForm)

// create product rating create route
app.post('/products/:slug/ratings', productsRatingsController.createProductRating)

//              USER ONBOARDING ROUTE
// =======================================
// create user registration form route (defining the second parameter as guestOnlyMiddleware)
//the third parameter will be the controller.
//there will be only this four that will be restricted to guests.
app.get('/users/register', guestOnlyMiddleware, usersController.showRegistrationForm)

// user registration // http://localhost:5000/users/register
app.post('/users/register', guestOnlyMiddleware, usersController.register)

// create login form new route
app.get('/users/login', guestOnlyMiddleware, usersController.showLoginForm)

// user login route //at login.ejs ---> action="/users/login"
app.post('/users/login', guestOnlyMiddleware, usersController.login)

//              User-only route
// =======================================
//user dashboard
app.get('/users/dashboard', authenticatedOnlyMiddleware, usersController.dashboard)

//user logout
app.post('/users/logout', authenticatedOnlyMiddleware, usersController.logout)


// =======================================
//              LISTENER
// =======================================
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } ) //it is returning a promise
  .then(response => { //if connection is successful to DB, it will connect to the express
    console.log('DB connection successful')
    app.listen(process.env.PORT || port, () => { //process.env.port will help the heroku app to inject PORT to the variable
      console.log(`Biscoff Bakery app listening on port: ${port}`)
    })
  })
  .catch(err => { //if there is an error it will catch the error. 
    //you can stop the services: brew services stop mongodb-community@4.4
  })
//middleware is a layer between a route and a controller
function guestOnlyMiddleware(req,res, next) {
  console.log('middleware hit before hitting controller')
  //you want to check user is log in. So that if i refresh, 
  //i am still at the log in page and i don't need to re-register again
  //check if user is logged in,
  //if logged in, redirect back to dashboard
  if (req.session && req.session.user) {
    res.redirect('/users/dashboard')
    return
  }
  next() //you must have next() to allow the request to carry on.
}

//this 
function authenticatedOnlyMiddleware(req, res, next) {
  if ( ! req.session || ! req.session.user ) {
    res.redirect('/users/login')
    return
  }

  next() //if not pass it to the controller
}

function setUserVarMiddleware(req,res, next) {
  //default user template var set to null
  res.locals.user = null

  //check if request.session.user is set,
  //if set, template user var will be set as well

  if (req.session && req.session.user) {
    res.locals.user = req.session.user
  }

  next()
}


//remember to start again if you have stopped services in the terminal: brew services start mongodb-community@4.4
// http://localhost:5000/products/biscoff-pumpkin-mooncake
// http://localhost:5000/products/
