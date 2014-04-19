var Services = {
	dropbox: dropbox,
	drive: drive,
	email: email,
	evernote: evernote,
	facebook: facebook,
	reddit: reddit,
	sms: sms,
	tumblr: tumblr,
	twitter: twitter
}

var Chef = {
	init: function() {
		console.log("initializing")
	},
	authorize: function(service) {
		console.log(service)
	},
	getContent: function() {

	},
	saveRecipe: function() {

	}
}

$(document).ready(function(){
	Chef.init()
});