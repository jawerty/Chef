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
	createRecipe = $("#createRecipe")
	recipes = $("#recipes")
	plusSign = true;

	$("#dropDownForm").on("click", function(){
		if (plusSign == true) {
			$("#dropDownForm img").attr("src", "images/minus_sign.png")
			plusSign = false
		} else {
			$("#dropDownForm img").attr("src", "images/plus_sign.png")
			plusSign = true
		}
		
		createRecipe.slideToggle(250)

		console.log("this")
	})
	$("#dropDownList").on("click", function(){
		if (plusSign == true) {
			$("#dropDownList img").attr("src", "images/minus_sign.png")
			plusSign = false
		} else {
			$("#dropDownList img").attr("src", "images/plus_sign.png")
			plusSign = true
		}
		recipes.slideToggle(250)
		console.log("that")
	})
	Chef.init()
});