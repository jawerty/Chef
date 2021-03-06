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
	"google drive": drive,
	"evernote": evernote,
	"facebook": facebook,
	"reddit": reddit,
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
		var _input = getValues();
		if (Object.keys(_input[2]).length === 0) {
			$( "#dialog1" ).dialog({width: "200px", resizable: false});
		} else {	
			Chef.indexedDB.addRecipe(_input[0], _input[1], _input[2], [])
		}
	},
	runRecipe: function(recipeName, timeStamp, actions, data) {
		console.log("Running..."+recipeName+" <-"+timeStamp)
		rightClickData = Chef.getContent()
		console.log(rightClickData)
		
	}
}

function getValues(){
	actions = {}
	inputs = 1;
	for (i = 0; i<$("#createRecipeForm select option:selected").length; i++){
		console.log(typeof actions[$("#createRecipeForm span")[i+1].innerText.toLowerCase()] == "undefined")
		if (typeof actions[$("#createRecipeForm span")[i+1].innerText.toLowerCase()] == "undefined") {
			if ($($("#createRecipeForm span")[i+1]).parent().has("input").length > 0) {
				inputs++;
				actions[$("#createRecipeForm span")[i+1].innerText.toLowerCase()] = [{action: $("#createRecipeForm select option:selected")[i].innerText, input: $("#createRecipeForm #services input")[inputs-1].value }]
			} else {
				actions[$("#createRecipeForm span")[i+1].innerText.toLowerCase()] = [{action: $("#createRecipeForm select option:selected")[i].innerText}]
			}
		} else {
			if ($($("#createRecipeForm span")[i+1]).parent().has("input").length > 0) {
				inputs++;
				actions[$("#createRecipeForm span")[i+1].innerText.toLowerCase()].push({action: $("#createRecipeForm select option:selected")[i].innerText, input: $("#createRecipeForm #services input")[inputs-1].value })			
			} else {
				actions[$("#createRecipeForm span")[i+1].innerText.toLowerCase()].push({action: $("#createRecipeForm select option:selected")[i].innerText })							
			}
		}
	}

	console.log("actions: "+JSON.stringify(actions));
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

	  if (row.actions.constructor == Object) {
	  	  for (var key in row.actions) {
	  	  	console.log(row.actions[key])
	  	  	for(i=0;i<row.actions[key].length;i++) {
	  	  	  	div.append("<label style='color: #333; font-size: 14px;'>"+key+" - "+row.actions[key][i].action+"</label><br>");
	  	  
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
			title.attr("data", Services[$(this).attr('id')]);

			wrapper.append(title);
			wrapper.append(actions);
			wrapper.append("<br>");
			$("#servicesList").before(wrapper);
			inserted++;
			for (var key in Services[$(this).attr('id')]) {
				if (key == actions.find(":selected").text()) {
					wrapper.append(Services[$(this).attr('id')][key]("", {formData: true}));
				}
			}

			
		}	
	});
	$("#services selected").on("change", function(e) {
		console.log("target: "+e.target.value)
		wrapper.append(Services[$(this).prev().text().toLowerCase()][($this).val()]("", {formData: true}));
	});
	Chef.init()
});