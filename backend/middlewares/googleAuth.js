const passport = require('passport');
const { sequelize } = require('../config/db');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT,
  clientSecret: process.env.AUTH_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
  session : false

}, (accessToken, refreshToken, profile, cb) => {
  
  return cb(null, profile._json);

}));
