const express = require('express');
const router = express.Router(); 
const passport = require('passport')
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect: '/jokes',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/login', (req, res)=>{
   res.render('authentication/login', {layout: 'layouts/main-layout', message: req.flash('error')});
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect: "/jokes",
  failureRedirect: '/login',
  failureFlash: true, 
  passReqToCallback: true
}));

router.post('/logout', ensureLoggedIn(), (req, res)=>{
  req.logout();
  res.redirect('/login')
})


module.exports = router; 