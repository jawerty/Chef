chrome.contextMenus.removeAll()
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.getContent) {
    	contentLink = request.getContent
        sendResponse({back: "back"});
    } else if (request.another) {
    	console.log(request)
    }
});

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
	indexedDB: {},
	init: function() {
		$("#dropDownForm").click();
		console.log("initializing")
		Chef.indexedDB.open();
	},
	addAction: function() {

	},
	authorize: function(service) {
		console.log(service)
	},
	getContent: function() {
		x = contentLink;
		delete contentLink;
		return x;
	},
	saveRecipe: function() {	
		input = getValues();
		if (typeof input[2][0] == "undefined") {
			$( "#dialog1" ).dialog({width: "200px", resizable: false});
		} else {	
			Chef.indexedDB.addRecipe(input[0], input[1], input[2], [])
			console.log(input[2][0])
		}
	},
	runRecipe: function(recipeName, timeStamp, actions, data) {
		console.log("Running..."+recipeName+" <-"+timeStamp)
		rightClickData = Chef.getContent()
		console.log(rightClickData)
		
	}
}

function getValues(){
	actions = []
	for (i = 0; i<$("#createRecipeForm select option:selected").length; i++){
		text = $("#createRecipeForm select option:selected")[i].innerText
		actions.push(text)
	}

	console.log(actions)
	recipeName = $("#name").val();
	recipeMessage = $("#layout").val();

	return [recipeName, recipeMessage, actions];
}


$(document).ready(function(){
	function Alert(message) {
		alert(message)
		return false;
	}

	function renderRecipe(row) {
	  chrome.contextMenus.create({contexts: ["all"], title: row.name, onclick: function(){Chef.runRecipe(row.name, row.timeStamp, row.actions, row.data)}})

	  var recipes = $("#recipes");
	  var li = $("<li>");
	  var div = $("<div>");
	  var wrapper = $("<div>")

	  li.text(row.name);

	  li.on("click", function(e) {
	  	div.slideToggle(250)
	  });

	  console.log(row)

	  if (row.message) div.append("<p style='margin-left: 1%;color: #333; font-size: 14px;'>\""+row.message+"\"</p>");

	  if (row.actions instanceof Array) {
	  	  for (i=0; i<row.actions.length; i++) {
	  	  	  for (var s in Services) {
	  	  	  	if (Services[s][row.actions[i]]) {
	  	  	  		console.log(Services[s][row.actions[i]])
	  	  	  		service = s;
	  	  	  		div.append("<label style='color: #333; font-size: 14px;'>"+service+" - "+row.actions[i] + "</label><br>");
	  	  	  	}
	  	  	  	
	  	  	  }
		   	  
		  } 
	  }

	  deleteBtn = $("<button>")
	  deleteBtn.text("Delete")
	  deleteBtn.attr("id", "deleteButton")
	  deleteBtn.on("click", function(e) {
	  	Chef.indexedDB.deleteRecipe(row.timeStamp)
	  })

	  div.append(deleteBtn)
	  div.css("display", "none");
	  div.css("margin", "2%")

	  wrapper.append(li)
	  wrapper.append(div)
	  recipes.append(wrapper);
	}

	Chef.indexedDB.db = null;

	Chef.indexedDB.open = function() {
	  var version = 1;
	  var request = indexedDB.open("chef", version);

	  // We can only create Object stores in a versionchange transaction.
	  request.onupgradeneeded = function(e) {
	    var db = e.target.result;

	    // A versionchange transaction is started automatically.
	    e.target.transaction.onerror = Chef.indexedDB.onerror;

	    if(db.objectStoreNames.contains("chef")) {
	      db.deleteObjectStore("chef");
	    }

	    var store = db.createObjectStore("chef", {keyPath: "timeStamp"});
	  };

	  request.onsuccess = function(e) {
	    Chef.indexedDB.db = e.target.result;
	    Chef.indexedDB.getAllRecipeItems();
	  };

	  request.onerror = Chef.indexedDB.onerror;
	};

	Chef.indexedDB.addRecipe = function(recipeName, recipeMessage, actions, data) {
	  var db = Chef.indexedDB.db;
	  var trans = db.transaction(["chef"], "readwrite");
	  var store = trans.objectStore("chef");
	  var request = store.put({
	    "name": recipeName,
	    "message": recipeMessage,
	    "actions": actions,
	    "data": data,
	    "timeStamp" : new Date().getTime()
	  });

	  request.onsuccess = function(e) {
	    Chef.indexedDB.getAllRecipeItems();
	  };

	  request.onerror = function(e) {
	    console.log(e.value);
	  };
	};

	Chef.indexedDB.getAllRecipeItems = function() {
		chrome.contextMenus.removeAll()
	  var recipes = $("#recipes");
	  recipes.html("");

	  var db = Chef.indexedDB.db;
	  var trans = db.transaction(["chef"], "readwrite");
	  var store = trans.objectStore("chef");

	  // Get everything in the store;
	  var keyRange = IDBKeyRange.lowerBound(0);
	  var cursorRequest = store.openCursor(keyRange);

	  cursorRequest.onsuccess = function(e) {
	    var result = e.target.result;
	    if(!!result == false)
	      return;

	    renderRecipe(result.value);
	    result.continue();
	  };

	  cursorRequest.onerror = Chef.indexedDB.onerror;
	};

	Chef.indexedDB.deleteRecipe = function(id) {
	  var db = Chef.indexedDB.db;
	  var trans = db.transaction(["chef"], "readwrite");
	  var store = trans.objectStore("chef");

	  var request = store.delete(id);

	  request.onsuccess = function(e) {
	    Chef.indexedDB.getAllRecipeItems();  // Refresh the screen
	  };

	  request.onerror = function(e) {
	    console.log(e);
	  };
	};

	createRecipe = $("#createRecipe")
	recipes = $("#recipes")
	inserted = 0
	plusSign1 = true;
	plusSign2 = true;

	$("#createButton").on("click", function(){
		Chef.saveRecipe()
	});
	$("#dropDownForm").on("click", function(){
		if (plusSign1 === true) {
			$("#dropDownForm img").attr("src", "images/minus_sign.png")
			plusSign1 = false
		} else {
			$("#dropDownForm img").attr("src", "images/plus_sign.png")
			plusSign1 = true
		}
		
		createRecipe.slideToggle(250);

	})
	$("#dropDownList").on("click", function(){
		if (plusSign2 === true) {
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
			$("#addService").click();
		} else {
			wrapper = $("<div>")
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

			title = $("<span>");
			title.attr("class", "serviceInserted");
			title.on("click", function(){
				$(this).parent().remove()
				inserted--
			});

			title.text(Services[$(this).attr('id')].name);
			title.attr("data", Services[$(this).attr('id')])
			wrapper.append(title)
			wrapper.append(actions)
			wrapper.append("<br>")
			$("#servicesList").before(wrapper)
			inserted++;
		}	
	})
	Chef.init()
});