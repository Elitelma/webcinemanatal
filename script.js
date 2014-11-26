var PARSE_ID = "UAHnlUyVZq0Tq6weTzXkzOgzGhndLtbVvReuFXqw";
var PARSE_CLIENTKEY = "dMsW9PbJ0IXIgr1G6SQTAe3RsEcJyU6JJk1NdAGb";

Parse.initialize(PARSE_ID, PARSE_CLIENTKEY);

//var text = document.getElementById("p1");
//text.innerHTML = "Mudando texto";

var Natalshopping = Parse.Object.extend("Natalshopping");
var query = new Parse.Query(Natalshopping);
query.find({
	success: function(films) {
		alert("Successifully retrieved " + films.length + " scores.");
		var text = "", i;
		for(i = 0; i < films.length; i++) {
			text = text + films[i].get("name") + "      " + films[i].get("schedule") + 
			"      " + films[i].get("shopping") + "      " + films[i].get("gender") + "      " +
			films[i].get("censure") + "<br><br>";
		}
		document.write(text);
	},
	error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	}
}); 