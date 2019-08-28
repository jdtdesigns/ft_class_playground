const express = require('express');
const passport = require('passport');
const session = require('express-session');
const PORT = process.env.PORT || 5000;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const app = express();

app.use(session({
  secret: 'adfkasdfljlkjadslfkjasdf',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: '920588151237-brvf8ks5lrld6i3jofa51kal4e8jkrqu.apps.googleusercontent.com',
  clientSecret: 'rF_BZfYJUY4swcXJqx4r4utr',
  callbackURL: "/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get('/', (req, res) => {
  if (req.user) {
    res.send(`Welcome ${req.user.displayName}!`);
  } else res.redirect('/login');
});

app.get('/login', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    console.log(req.user.displayName);
    res.redirect('/');
  });

app.listen(PORT, () => console.log('Listening on port %s', PORT));