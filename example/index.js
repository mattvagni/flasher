var express = require('express');
var flasher = require('../flasher');
var consolidate = require('consolidate');
var swig = require('swig');

var app = express();

app.engine('.html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', './');

swig.init({
    root: './',
    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
});

app.use(express.cookieParser('secret'));
app.use(express.session());


// -- Example Starts here: ----------------------------

// Set our options for flasher (this is optional)
flasher.init({
	namespace : 'flashMessages',
	types : ['error', 'message']
});

// Register the middleware for flasher
app.use(flasher.middleware);


// -- Sample Routes: ----------------------------------

app.get('/', function(req, res){
	// Show an error message on this very response
	res.flash.error("amazing");
	res.render('example.html');
});

app.get('/redirect-test', function(req, res){
	// Show an error message on the next response (the redirect)
	req.flash.error("This is an error from a redirect test.");
	res.redirect('/final-destination');
});

	app.get('/final-destination', function(req, res){
		res.render('example.html');
	});


app.get('/multiple-messages', function(req, res){
	// Show an error message on the next response (the redirect)
	res.flash.error(["Message 1", "Message 2", "The LAST Message."]);
	res.render('example.html');
});






app.listen(4646);

