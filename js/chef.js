var Services = {
	"dropbox": dropbox,
	"drive": drive,
	"email": email,
	"evernote": evernote,
	"facebook": facebook,
	"reddit": reddit,
	"sms": sms,
	"tumblr": tumblr,
	"twitter": twitter
}


var Chef = {
	init: function() {
		$("#dropDownForm").click();
		console.log("initializing")
	},
	addAction: function() {

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
	function Alert(message) {
		alert(message)
		return false;
	}

	createRecipe = $("#createRecipe")
	recipes = $("#recipes")
	inserted = 0
	plusSign1 = true;
	plusSign2 = true;

	$("#dropDownForm").on("click", function(){
		if (plusSign1 == true) {
			$("#dropDownForm img").attr("src", "images/minus_sign.png")
			plusSign1 = false
		} else {
			$("#dropDownForm img").attr("src", "images/plus_sign.png")
			plusSign1 = true
		}
		
		createRecipe.slideToggle(250);

	})
	$("#dropDownList").on("click", function(){
		if (plusSign2 == true) {
			$("#dropDownList img").attr("src", "images/minus_sign.png")
			plusSign2 = false
		} else {
			$("#dropDownList img").attr("src", "images/plus_sign.png")
			plusSign2 = true
		}
		recipes.slideToggle(250)
	})
	$("#addService").on("click", function(){		
		$("#servicesList").slideToggle(250)
	})
	$(".service").on("click", function(){
		if (inserted >= 5){
			$( "#dialog" ).dialog({width: "200px", resizable: false});
		} else {
			actions = $("<select>")

			actions.attr("class", Services[$(this).attr('id')])

			actions_text = []
			for (var key in Services[$(this).attr('id')]) {
				console.log(key);
				actions_text.push(key)
			}

			actions_text.pop()
			for (i=0;i<actions_text.length;i++) {
				actions.append("<option>"+actions_text[i]+"</option>")
			}

			title = $("<span>")
			title.attr("class", "serviceInserted");
			title.text(Services[$(this).attr('id')].name);

			title.insertBefore("#servicesList");
			$("<br>").insertBefore(title)
			actions.insertAfter(title)

			inserted++;
		}

		
	})


	Chef.init()
});