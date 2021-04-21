const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport-setup');

const app = express();

app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'OAuthSession',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/failed');
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get('/', (req, res) => res.render('home.html'))

app.get('/failed', (req, res) => res.render('failed.html'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.render('authorized.html'))

// Auth Routes
app.get('/api', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/api/logout', (req, res) => {
    req.session.OAuthSession = null;
    req.session.token = null;
    //req.logout();
    res.redirect('/');
})

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))