var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const passport= require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const FbStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

var app = express();

app.use(flash())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);

// uncomment after placing your favicon in /public

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'jester',
    resave: false, 
    saveUninitialized: true, 
    store: new MongoStore( {mongooseConnection: mongoose.connection})
}));




passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Signing Up
passport.use('local-signup', new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, next) => {
    process.nextTick(() => {
        User.findOne({
            'username': username}, (err, user) => {
            if (err){ return next(err); }
              
            if (user) {
                return next(null, false, {message: "Username already exists"});
            }
            else {
                const { username, password, email, firstName, lastName, dob} = req.body;
                const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                const newUser = new User({
                  username,
                  password: hashPass,
                  email,
                  firstName,
                  lastName,
                  dob
                });

                newUser.save((err) => {
                    if (err){ next(err); }
                    return next(null, newUser);
                });
            }
        });
    });
}));

passport.use('local-login', new LocalStrategy((username, password, next)=>{
      User.findOne({username}, (err, user) =>{
        if (err) {
          return next(err);
        }
        if(!user){
          return next(null, false, {message: "Incorrect username"})
        }
        if (!bcrypt.compareSync(password, user.password)){
          return next(null, false, {message: "Incorrect password"});
        }

        return next(null, user);
      });
  }));

  passport.use(new FbStrategy({
    clientID: "375844716215268",
    clientSecret: '012c2abc0ba4cec0b4ccb35aeefe0396',
    callbackURL: "/auth/facebook/callback",
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookID: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        console.log(profile)
        return done(null, user);
      }
      
      const newUser = new User({
        facebookID: profile.id,
        username: profile.displayName,
      });
      console.log(profile)
      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        done(null, newUser);
      });
    });
  
  }));

  passport.use(new GoogleStrategy({
    clientID: "259985195411-5bjbqtg66jm96hcs04un0f41i4k72cas.apps.googleusercontent.com",
    clientSecret: "KXiUUTK3UZkIeE3L4nsE_OM8",
    callbackURL: "/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }
  
      const newUser = new User({
        googleID: profile.id
      });
  
      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        done(null, newUser);
      });
    });
  
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use( (req, res, next)=> {
  if (typeof(req.user) !== "undefined"){
    res.locals.userSignedIn=true;
  } else {
      res.locals.userSignedIn = false;
  }
  next();
});

const index = require('./routes/index');
app.use('/', index);
const authRoutes = require('./routes/authentication');
app.use('/', authRoutes)
const jokeRoutes = require('./routes/jokes');
app.use('/jokes', jokeRoutes)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
