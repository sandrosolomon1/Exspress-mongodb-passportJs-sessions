const { Router } = require('express')
const express = require('express')
const passport = require('passport') 
const User = require('../models/User')

const router = express.Router()

router.get('/test', async (req,res,next) => {
    console.log(req.session)
    const user = await User.findOne({username: 'a_koiava2'})

    if(!user) {console.log('Not Found'); return;}

    console.log(
        user.validPassword('123456')
    )
})
 
router.post('/register', async (req, res, next) => {
    const {username,password} = req.body
    console.log(req.body)
    const {hash,salt} = User.genpassword(password)

    const user = new User({
        username,
        hash,
        salt
    })

    try {
        await user.save()    
    } catch (error) {
        console.log(error) 
    }

    res.redirect('/login')
});

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/login-success',
        failureRedirect: '/login-failure',
        failureFlash: false
    }),
    (req,res,next) => {
        console.log(req)
    }
)

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get(
    '/login', (req, res, next) => {
   
        const form = '<h1>Login Page</h1><form method="POST" action="/login">\
        Enter Username:<br><input type="text" name="username">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form>';

        res.send(form);

});

router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

router.get('/protected-route', (req, res, next) => {
    
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router