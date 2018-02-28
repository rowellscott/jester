var express = require('express');
var router = express.Router();
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login')

/* GET home page. */
router.get('/', ensureLoggedOut('/jokes'), function(req, res, next) {
  res.render('index', { layout: 'layouts/main-layout', message: req.flash('error')});
});

module.exports = router;
