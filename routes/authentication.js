const express = require('express');
const router = express.Router(); 
const passport = require('passport')

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true
}));

module.exports = router; 

