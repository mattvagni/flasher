var _ = require('underscore');


// Default settings. Use init() to override.
var options = {
	namespace : 'flashes',
	types : ['error', 'info']
}


/**
Sets custom settings (optional)

@param userOptions {object} All the options
@param [userOptions.namespace] {string} The namespace in which you would like to save your flash messages
@param [userOptions.types] {array} A list of the flash message types you would like.
*/
var init = function(userOptions){

	if (userOptions.types && !_.isArray(userOptions.types))
		throw Error('If specifying custom flash message types you must provide an Array.')

	if (userOptions.namespace && !_.isString(userOptions.namespace) )
		throw Error('If specifying a custom namespace to store your flash messages you must provide a string.')

	_.extend(options, userOptions)
}


/**
Middleware function

For each type of message you specified it will provide:

- For the next response:
req.flash.messageType('This is your message.')

- For the current response:
res.flash.messageType('This is your message.')
*/
var middleware = function(req, res, next){

	// If we don't support sessions then error out. We neeed sessions.
	if(!req.session) throw Error('Sessions must be enabled to use Flasher');

	res.locals[options.namespace] = {}; // This is where all flash messages will be stored.
	req.flash = {}; // Request function(s) will be added to this
	res.flash = {}; // Response function(s) will be added to this

	// This is were the messages will be saved to within the session
	req.session[options.namespace] = req.session[options.namespace] || [];

	// Create the response and re
	_.each(options.types, function(type){

		// The request method
		req.flash[type] = function(message){

			if(!_.isArray(message)){ // If the user has given us a string instead of an array of messages.
				var message = [message]; // Convert it to an array;
			};

			_.each(message, function(text, index, list){
				req.session[options.namespace].push({
					type : type,
					text : text
				});
			});
		};

		// The response method
		res.flash[type] = function(message){

			if(!_.isArray(message)){ // If the user has given us a string instead of an array.
				var message = [message]; // Convert it to an array;
			};

			_.each(message, function(text, index, list){
				// Create a space for each of our error types in res.locals
				res.locals[options.namespace][type] = res.locals[options.namespace][type] || [];
				res.locals[options.namespace][type].push(text);
			});


		};

	});

	// If there are flash messages in the session
	if (req.session[options.namespace].length) {

		// On every request we need to take all of the flash messages in the
		// session and add them to the res.locals.
		_.each(req.session[options.namespace], function(element, index, list){

			// Let's add all messages currently in the session to res locals
			res.locals[options.namespace][element.type] = res.locals[options.namespace][element.type] || [];
			res.locals[options.namespace][element.type].push(element.text);

		});

		// Delete the messages in the session so we can add new ones in this request response cycle.
		req.session[options.namespace] = [];
	}

	next(); // Enough. Move on.
};


module.exports = {
	init : init,
	middleware : middleware
}
