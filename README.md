# flasher
Configurable flash messages for Express 3. Based on [flashify](https://github.com/bscarvell/flashify) by [@bscarvell](https://github.com/bscarvell/) but with a different interface and some configuration options.

	npm install flashify


### Setup
After setting up your express sessions, just register the flasher middleware.

	var express = require('express');

	var flasher = require('flasher'); // Get flasher

	var app = express();

	// Setup express sessions.
	app.use(express.cookieParser('topsecret'));
	app.use(express.session());

	app.use(flasher.middleware); // Register the middleware



### Usage
In your routes you can then just go:

	req.flash.error("This is an error."); // An error message
	req.flash.error("This is another error"); // and another
	req.flash.info("This is an info message."); // An info message, not an error

The above flash messages would be made available to your templates via res.locals like so:

	flashes : {
		error : ['This is an error', 'This is another error'],
		info : ['This is an info message']
	}

When using the req methods your messages will be show in the following response cycle. If you would like to show the error messages directly you can use the same methods on the response object instead. For example:

	res.flash.error("This is an error for this response cycle.");

You can also send multiple messages at once if you want. Just pass an array:

	req.flash.error(["Lots of errors.", "Error", "Another Error", "You get the point - Error"]);



### Configuration (Optional)
You can set up as many different type of flash messages as you'd like. Optionally you can also specify the namespace in which you would like to have save your flash messages (this applies to both the template and the session cookie)

	flasher.init({
		namespace : 'flashMessages', // The namespace where you want to have the flash messages (in your templates and the session cookie)
		types : ['error', 'info', 'customType'] // The types of messages you'd like.
	});

When using custom types the name of your custom type becomes the method name. For example, with the above setup:

	req.flash.customType("EHRMAHGAD.");
