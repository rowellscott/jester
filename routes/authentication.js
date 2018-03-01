const express = require('express');
const router = express.Router(); 
const passport = require('passport')
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')

router.post('/signup', ensureLoggedOut('/'), passport.authenticate('local-signup', {
  successRedirect: '/jokes',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/login', ensureLoggedOut('/jokes'), (req, res)=>{
   res.render('authentication/login', {layout: 'layouts/main-layout', message: req.flash('error')});
   console.log(req)
});

router.post('/login', ensureLoggedOut('/login'), passport.authenticate('local-login', {
  successRedirect: "/jokes",
  failureRedirect: '/login',
  failureFlash: true, 
  passReqToCallback: true
}));

router.post('/logout', ensureLoggedIn(), (req, res)=>{
  req.logout();
  res.redirect('/login')
})

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/jokes",
  failureRedirect: "/login",
  failureFlash: true, 
  passReqToCallback: true
}));

module.exports = router; 