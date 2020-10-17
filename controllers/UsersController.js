const uuid = require('uuid')
// const bcrypt = require('bcrypt')
const SHA256 = require("crypto-js/sha256")
const UserModel = require('../models/users')

const controllers = {
    showRegistrationForm: (req, res) => {
        //if user is not logged in, it will render the log in page.
        res.render('users/register', {
            pageTitle: 'Register as a User'
        })
    },

    showLoginForm: (req, res) => {
        res.render('users/login', {
            pageTitle: 'User Login'
        })
    },

    register: (req, res) => {
        // validate the users input.not implemented here yet, try that on your own.
        // res.send(req.body) //why req.body? whenever we submit, it will be inside req.body
        UserModel.findOne({
            email: req.body.email //find the email that the user gave us and check with what we have.
        })
            .then(result => { //if we do find a result, it will be an error. 
                //because the new input will be a duplicate of what we have in the database
                //therefore, it will redirect to registration page.
                if (result) {
                    res.redirect('/users/register')
                    return
                }
                //no document found in DB, user can proceed with registration
                //after you have npm i --save uuid bcrypt, 
                //make sure you have typed imported the library: const uuid OR bcyrpt....
                
                //to generate uuid as salt
                //go to http://localhost:5000/users/register 
                //and register for it, it will show the  salt.
                const salt =uuid.v4() //you don't need this step cos bcrypt will hash it for you.

                // hash combination using bcrypt
                const combination = salt + req.body.password

                // hash the combination using SHA256. You need to use toString() cos SHA256 is an object.
                const hash = SHA256(combination).toString()

                // res.send(hash) //just to show after you submit so that you know that it is working.

                //create user in DB
                UserModel.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        res.redirect('/products')
                    })
                    .catch(err => {
                        res.redirect('/users/register')
                    })


                //combine salt with password
                // const combinedPw = salt + req.body.password

                //hash combination using bcrypt. 
                // bcrypt.hash(req.body.password, 5) //the "5" refers to the number of times you will be rehashing. 
                // //The higher the number, the longer it will take. So do remember about speed and user experience.
                //     .then(hash => {
                //         //hashing successful, create user in DB
                //         UserModel.create({
                //             first_name: req.body.first_name,
                //             last_name: req.body.last_name,
                //             email: req.body.email,
                //             pwsalt: salt,
                //             hash: hash
                //         })
                //             .then(createResult => { //if it is successful, we will redirect user to the products page
                //                 res.redirect('/products')
                //             })
                //             .catch(err => {
                //                 res.redirect('/users/register')
                //             })
                //     })
                //     .catch(err => {
                //         console.log(err)
                //         res.redirect('/users/register')
                //     })


                // res.send(salt)
                // res.send(combinedPw)
            })
            .catch(err => {
                console.log(err)
                res.redirect('/users/register')
            })
    },
    login: (req, res) => {
        //validate input
    
        //gets user with the given email
        UserModel.findOne({ //the condition is that the email must match
            email: req.body.email
        })
            .then(result => {

                //check if result is empty, if it is, no user, so login fail, redirect to login page
                if(!result) {
                    console.log('err: no result lor')
                    redirect('/users/login')
                    return
                }

                // combine DB user salt with given password, and apply hash algo
                //this hash has just been generated (not from DB)
                //we need to have pwsalt because in our schema we used "pwsalt"
                const hash = SHA256(result.pwsalt + req.body.password).toString()
                
                //check if password is correct by comparing hashes
                if (hash !== result.hash) {
                    res.redirect('/users/login')
                    return
                }

                //once login is successful, we set session user.
                req.session.user = result
                console.log(req.session) //we are printing out the session to the terminal
                res.redirect('/users/dashboard') //we we login, we will be directed to the user dashboard
                
                
            })
            .catch(err => {
                console.log(err)
                res.redirect('/user/login')
            })
    },

    dashboard: (req,res) => {
        /*In the dashboard controller, 
        use an if statement to check req.session and req.session.user. 
        If either is undefined, means user is not logged in, 
        so redirect user back to login page*/
        if( ! req.session || ! req.session.user) {
            res.redirect('/users/login')
            return
        }
        res.render('users/dashboard', {
            pageTitle: 'User Dashboard'
        }) //localhost:
    },

    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/users/login')
    }

}

module.exports = controllers
