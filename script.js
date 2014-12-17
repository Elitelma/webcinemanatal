var PARSE_ID = "UAHnlUyVZq0Tq6weTzXkzOgzGhndLtbVvReuFXqw";
var PARSE_CLIENTKEY = "dMsW9PbJ0IXIgr1G6SQTAe3RsEcJyU6JJk1NdAGb";

Parse.initialize(PARSE_ID, PARSE_CLIENTKEY);

var films = [];
var filmsBySchedule = [];
var extraNatal, extraNorte, extraMidway, extraPraia;
var showFilmsBy = "SHOPPING";
var onInfo = false;
var onSearch = false;
var searchBy = "NONE";

window.addEventListener("load", config, false);

function config() {
	downloadFilms2(filmsDownloaded);
}

function filmsDownloaded() {
	generateFilms();
}

function generateFilms(search) {
	var orderList = [];

	var list;
	var htmlFilmsList = document.getElementById("filmsList");
	var checkNatal = document.getElementById("checkNatal");
	var checkNorte = document.getElementById("checkNorte");
	var checkMidway = document.getElementById("checkMidway");
	var checkPraia = document.getElementById("checkPraia");

	if(showFilmsBy === "SHOPPING") {
		for(var i = 0; i < films.length; i++) {
			orderList[i] = i;
		}
		list = films;
	}
	else if(showFilmsBy === "SCHEDULE") {
		for(var i = 0; i < filmsBySchedule.length; i++) {
			orderList[i] = i;
		}
		list = filmsBySchedule;
		ordenateBySchedule(list, orderList);
	}

	if(!onSearch) {
		for(var i = 0; i < orderList.length; i++) {
			var shopping = list[orderList[i]].get("shopping");
			if(shopping === "Natal Shopping" && !checkNatal.checked) {
				continue;
			} else if(shopping === "Norte Shopping" && !checkNorte.checked) {
				continue;
			} else if(shopping === "Midway Mall" && !checkMidway.checked) {
				continue;
			} else if(shopping === "Praia Shopping" && !checkPraia.checked) {
				continue;
			}
			createNewListElement(htmlFilmsList, list[orderList[i]]);
		}
	} else if(searchBy === "NAME"){
		for(var i = 0; i < orderList.length; i++) {
			var shopping = list[orderList[i]].get("shopping");
			if(shopping === "Natal Shopping" && !checkNatal.checked) {
				continue;
			} else if(shopping === "Norte Shopping" && !checkNorte.checked) {
				continue;
			} else if(shopping === "Midway Mall" && !checkMidway.checked) {
				continue;
			} else if(shopping === "Praia Shopping" && !checkPraia.checked) {
				continue;
			}

			var name = list[orderList[i]].get("name");
			name = name.split(" ").join("").toLowerCase();
			if(name.indexOf(search) > -1) {
				createNewListElement(htmlFilmsList, list[orderList[i]]);
			}
		}
	}
}

function showFilmsBySchedule() { 
	if(showFilmsBy != "SCHEDULE" && !onInfo) {
		showFilmsBy = "SCHEDULE";
		var htmlFilmsList = document.getElementById("filmsList");
		deleteList(htmlFilmsList);
		createList();
		generateFilms();
	} else if(showFilmsBy != "SCHEDULE") {
		showFilmsBy = "SCHEDULE";
		deleteList(htmlFilmsList);
		generateFilms();
	}
}

function showFilmsByShopping() {
	if(showFilmsBy != "SHOPPING" && !onInfo) {
		showFilmsBy = "SHOPPING";
		var htmlFilmsList = document.getElementById("filmsList");
		deleteList(htmlFilmsList);
		createList();
		generateFilms();
	} else if(showFilmsBy != "SHOPPING") {
		showFilmsBy = "SHOPPING";
		deleteList(htmlFilmsList);
		generateFilms();
	}
}

function searchByName() {
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	onSearch = true;
	searchBy = "NAME";

	var divGeneral = document.getElementById("generalElement");
	var textNode;
	setupBackButton(divGeneral, textNode);
	//createSearchByNameField(divGeneral);
	var search = prompt("Digite sua busca:");
	search = search.split(" ").join("");
	search = search.toLowerCase();
	createList();
	generateFilms(search);
}

function searchBySchedule() {

}

function createNewListElement(htmlFilmsList, film) {
	var textNode;

	var listItem = document.createElement("li");
	listItem.addEventListener("click", function() {
		loadFilmInfo(film, htmlFilmsList); 
	}, false);
	htmlFilmsList.appendChild(listItem);

	var filmImg = document.createElement("img");
	filmImg.src = film.get("image").url();
	listItem.appendChild(filmImg);

	var filmName = document.createElement("h3");
	textNode = document.createTextNode(film.get("name"));
	filmName.appendChild(textNode);
	listItem.appendChild(filmName);

	var filmLanguage = document.createElement("p");
	var roomType = film.get("roomType");
	textNode = document.createTextNode(film.get("language"));
	filmLanguage.appendChild(textNode);
	filmLanguage.id = "language";
	listItem.appendChild(filmLanguage);

	var filmSchedule = document.createElement("p");
	textNode = document.createTextNode(film.get("schedule"));
	filmSchedule.appendChild(textNode);
	filmSchedule.id = "schedule";
	listItem.appendChild(filmSchedule);

	var filmShopping = document.createElement("p");
	textNode = document.createTextNode(film.get("shopping"));
	filmShopping.appendChild(textNode);
	listItem.appendChild(filmShopping);

	if(film.get("roomType") != "none") {
		var filmRoomType = document.createElement("p");
		var text = film.get("roomType").replace("ico", "");
		text = text.charAt(0).toUpperCase() + text.slice(1);	
		textNode = document.createTextNode("Sala " + text);
		filmRoomType.appendChild(textNode);
		filmRoomType.id = "roomType";
		listItem.appendChild(filmRoomType);
	}

	var filmGenre = document.createElement("p");
	textNode = document.createTextNode(film.get("gender"));
	filmGenre.appendChild(textNode);
	filmGenre.id = "genre";
	listItem.appendChild(filmGenre);
}

function loadFilmInfo(film, htmlFilmsList) {
	deleteList(htmlFilmsList);
	onInfo = true;

	var divGeneral = document.getElementById("generalElement");
	var textNode;
	setupBackButton(divGeneral, textNode);	

	var divInfo = document.createElement("div");
	divInfo.id = "info";
	divGeneral.appendChild(divInfo);

	var filmImg = document.createElement("img");
	filmImg.src = film.get("image").url();
	filmImg.id = "infoImg";
	divInfo.appendChild(filmImg);

	var filmName = document.createElement("h3");
	textNode = document.createTextNode(film.get("name"));
	filmName.appendChild(textNode);
	filmName.id = "infoName";
	divInfo.appendChild(filmName);

	var filmShopping = document.createElement("p");
	textNode = document.createTextNode(film.get("shopping"));
	filmShopping.appendChild(textNode);
	filmShopping.id = "infoShopping";
	divInfo.appendChild(filmShopping);

	var filmScheduleLanguage = document.createElement("p");
	textNode = document.createTextNode(film.get("schedule") + " - " + film.get("language"));
	filmScheduleLanguage.appendChild(textNode);
	filmScheduleLanguage.id = "infoScheduleLanguage";
	divInfo.appendChild(filmScheduleLanguage);

	var filmGender = document.createElement("p");
	textNode = document.createTextNode(film.get("gender"));
	filmGender.appendChild(textNode);
	filmGender.id = "infoGender";
	divInfo.appendChild(filmGender);

	var filmDuration = document.createElement("p");
	textNode = document.createTextNode(film.get("duration"));
	filmDuration.appendChild(textNode);
	filmDuration.id = "infoDuration";
	divInfo.appendChild(filmDuration);

	var filmCensure = document.createElement("p");
	textNode = document.createTextNode(film.get("censure"));
	filmCensure.appendChild(textNode);
	filmCensure.id = "infoCensure";
	divInfo.appendChild(filmCensure);

	var filmSinopse = document.createElement("p");
	textNode = document.createTextNode(film.get("sinopse"));
	filmSinopse.appendChild(textNode);
	filmSinopse.id = "infoSinopse";
	divInfo.appendChild(filmSinopse);
}

function ordenateBySchedule(filmsList, orderList) {
	for(var i = 0; i < filmsList.length - 1; i++) {
		for(var j = i+1; j < filmsList.length; j++) {
			var hour1, hour2;
			hour1 = getHour(filmsList[orderList[i]].get("schedule"));
			hour2 = getHour(filmsList[orderList[j]].get("schedule"));
			if(hour2 < hour1) {
				//console.log("Primeiro: " + orderList[i] + ", Segundo: " + orderList[j]);
				var aux = orderList[i];
				orderList[i] = orderList[j];
				orderList[j] = aux;
				//console.log("Trocou: Primeiro: " + orderList[i] + ", Segundo: " + orderList[j]);
			} else if(hour2 == hour1) {
				var min1, min2;
				min1 = getMin(filmsList[orderList[i]].get("schedule"));
				min2 = getMin(filmsList[orderList[j]].get("schedule"));
				if(min2 < min1) {
					//console.log("Primeiro: " + orderList[i] + ", Segundo: " + orderList[j]);
					var aux = orderList[i];
					orderList[i] = orderList[j];
					orderList[j] = aux;
					//console.log("Trocou: Primeiro: " + orderList[i] + ", Segundo: " + orderList[j]);
				}
			}
		}
	}
}

function setupBackButton(divGeneral, textNode) {
	var backButton = document.createElement("button");
	backButton.addEventListener("click", function() {
		var htmlFilmsList = document.getElementById("filmsList");
		deleteList(htmlFilmsList);

		var newList = document.createElement("ul");
		newList.id = "filmsList";
		divGeneral.appendChild(newList);
		generateFilms();
	});
	textNode = document.createTextNode("Voltar");
	backButton.appendChild(textNode);
	backButton.id = "backButton";
	divGeneral.appendChild(backButton);

	$(document).keydown(function (e) {
  		if (e.which === 8) {
    		e.preventDefault();
    		var htmlFilmsList = document.getElementById("filmsList");
			deleteList(htmlFilmsList);
			var newList = document.createElement("ul");
			newList.id = "filmsList";
			divGeneral.appendChild(newList);
			generateFilms();
    	return false;
  		}
	});
}

function createSearchByNameField(divGeneral) {
	var searchField = document.createElement("div");
	searchField.id = "searchField";

	var searchInput = document.createElement("input");
	searchInput.id = "searchInput";
	searchField.appendChild(searchInput);

	var searchSubmit = document.createElement("input");
	searchSubmit.type = "submit";
	var textNode = document.createTextNode("Buscar!");
	searchSubmit.appendChild(textNode);
	searchSubmit.onclick = generateListBySearchName;

	searchField.appendChild(searchSubmit);
	divGeneral.appendChild(searchField);
}

function getHour(schedule) {
	if(endsWithLetter(schedule)) {
		var letter = schedule.charAt(schedule.length - 1);
		schedule = schedule.replace(letter, "");
	}
	var hour = schedule.substring(0, schedule.indexOf("h"));
	return parseInt(hour);
}

function getMin(schedule) {
	if(endsWithLetter(schedule)) {
		var letter = schedule.charAt(schedule.length - 1);
		schedule = schedule.replace(letter, "");
	}
	var min = schedule.substring(schedule.indexOf("h") + 1, schedule.length);
	return parseInt(min);
}

function endsWithLetter(schedule) {
	var lastChar = schedule.charAt(schedule.length - 1);
	if(lastChar >= 'A' && lastChar <= 'Z') {
		return true;
	} else {
		return false;
	}
}

function changeCheckBoxNatalShopping() {
	var checkbox = document.getElementById("checkNatal");
	checkbox.checked = !checkbox.checked;
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	createList();
	generateFilms();
}

function changeCheckBoxNorteShopping() {
	var checkbox = document.getElementById("checkNorte");
	checkbox.checked = !checkbox.checked;
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	createList();
	generateFilms();
}

function changeCheckBoxMidwayMall() {
	var checkbox = document.getElementById("checkMidway");
	checkbox.checked = !checkbox.checked;
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	createList();
	generateFilms();
}

function changeCheckBoxPraiaShopping() {
	var checkbox = document.getElementById("checkPraia");
	checkbox.checked = !checkbox.checked;
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	createList();
	generateFilms();
}

function createList() {
	var divGeneral = document.getElementById("generalElement");
	var htmlFilmsList = document.createElement("ul");
	htmlFilmsList.id = "filmsList";
	divGeneral.appendChild(htmlFilmsList);
}

function deleteList(htmlFilmsList) {
	if(!onInfo && !onSearch) {
		var divGeneral = document.getElementById("generalElement");
		divGeneral.removeChild(htmlFilmsList);
	} else if(onInfo) {
		onInfo = false;
		var divGeneral = document.getElementById("generalElement");
		var divInfo = document.getElementById("info");
		divGeneral.removeChild(divInfo);
		var backButton = document.getElementById("backButton");
		divGeneral.removeChild(backButton);
	} else if(onSearch) {
		onSearch = false;
		searchBy = "NONE";
		var divGeneral = document.getElementById("generalElement");
		divGeneral.removeChild(htmlFilmsList);
		var backButton = document.getElementById("backButton");
		divGeneral.removeChild(backButton);
	}
}