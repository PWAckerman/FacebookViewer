'use strict';
let express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook'),
    bodyParser = require('body-parser'),
    secrets = require('./secrets'),
    app = express(),
    port = 9001

app
  .use(bodyParser.json(), session({secret: 'appSecret'}), passport.initialize(), passport.session())
  .get('/auth/facebook', passport.authenticate('facebook'))
  .get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }))
  .get('/me', (req, res) => res.json(req.user))
  .listen(9001)

passport.use(new FacebookStrategy({
  clientID: secrets.fb.clientID,
  clientSecret: secrets.fb.clientSecret,
  callbackURL: 'http://localhost:9001/auth/facebook/callback'
}, (token, refreshToken, profile, done) => {
  return done(null, profile)
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))
