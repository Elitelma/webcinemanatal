var PARSE_ID = "UAHnlUyVZq0Tq6weTzXkzOgzGhndLtbVvReuFXqw";
var PARSE_CLIENTKEY = "dMsW9PbJ0IXIgr1G6SQTAe3RsEcJyU6JJk1NdAGb";

Parse.initialize(PARSE_ID, PARSE_CLIENTKEY);

var Natalshopping = Parse.Object.extend("Natalshopping");
var query = new Parse.Query(Natalshopping);
query.find({
	success: function(films) {
		alert("Pegou com sucesso " + films.length + " filmes.");
		var htmlFilmsList = document.getElementById("filmsList");
		for(i = 0; i < films.length; i++) {
			createNewListElement(htmlFilmsList, films[i]);
		}
	},
	error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	}
}); 

function createNewListElement(htmlFilmsList, film) {
	var textNode;

	var listItem = document.createElement("li");
	htmlFilmsList.appendChild(listItem);

	var filmImg = document.createElement("img");
	filmImg.src = film.get("image").url();
	listItem.appendChild(filmImg);

	var filmName = document.createElement("h3");
	textNode = document.createTextNode(film.get("name"));
	filmName.appendChild(textNode);
	listItem.appendChild(filmName);

	var filmShopping = document.createElement("p");
	textNode = document.createTextNode(film.get("shopping"));
	filmShopping.appendChild(textNode);
	listItem.appendChild(filmShopping);

	var filmSchedule = document.createElement("p");
	textNode = document.createTextNode(film.get("schedule"));
	filmSchedule.appendChild(textNode);
	listItem.appendChild(filmSchedule);
}