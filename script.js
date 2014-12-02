var PARSE_ID = "UAHnlUyVZq0Tq6weTzXkzOgzGhndLtbVvReuFXqw";
var PARSE_CLIENTKEY = "dMsW9PbJ0IXIgr1G6SQTAe3RsEcJyU6JJk1NdAGb";

Parse.initialize(PARSE_ID, PARSE_CLIENTKEY);

var showFilmsBy = "SCHEDULE";
var onInfo = false;

window.addEventListener("load", config, false);

function config() {
	var orderList = [];
	downloadFilms();
}

function showFilmsBySchedule() {
	if(showFilmsBy != "SCHEDULE" && !onInfo) {
		showFilmsBy = "SCHEDULE";
		var htmlFilmsList = document.getElementById("filmsList");
		deleteList(htmlFilmsList);
		createList();
		downloadFilms();
	} else if(showFilmsBy != "SCHEDULE") {
		showFilmsBy = "SCHEDULE";
		deleteList(htmlFilmsList);
		downloadFilms();
	}
}

function showFilmsByShopping() {
	if(showFilmsBy != "SHOPPING" && !onInfo) {
		showFilmsBy = "SHOPPING";
		var htmlFilmsList = document.getElementById("filmsList");
		deleteList(htmlFilmsList);
		createList();
		downloadFilms();
	} else if(showFilmsBy != "SHOPPING") {
		showFilmsBy = "SHOPPING";
		deleteList(htmlFilmsList);
		downloadFilms();
	}
}

function createList() {
	var divGeneral = document.getElementById("generalElement");
	var htmlFilmsList = document.createElement("ul");
	htmlFilmsList.id = "filmsList";
	divGeneral.appendChild(htmlFilmsList);
}

function downloadFilms() {
	var Natalshopping = Parse.Object.extend("Natalshopping");
	var query = new Parse.Query(Natalshopping);
	query.find({
		success: function(natalShopList) {
			if(showFilmsBy === "SCHEDULE") {
				expandListThroughSchedules(natalShopList);
			} else if(showFilmsBy === "SHOPPING") {
				insertSpacesOnSchedule(natalShopList);
			}
			downloadNorteShopping(natalShopList);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function downloadNorteShopping(natalShopList) {
	var Norteshopping = Parse.Object.extend("Norteshopping");
	var query = new Parse.Query(Norteshopping);
	query.find({
		success: function(norteShopList) {
			var filmsList = natalShopList.concat(norteShopList);
			if(showFilmsBy === "SCHEDULE") {
				expandListThroughSchedules(filmsList);
			} else if(showFilmsBy === "SHOPPING") {
				insertSpacesOnSchedule(filmsList);
			}
			downloadMidwayMall(filmsList);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function downloadMidwayMall(filmsList) {
	var Midwaymall = Parse.Object.extend("Midwaymall");
	var query = new Parse.Query(Midwaymall);
	query.find({
		success: function(midwayMallList) {
			if(showFilmsBy === "SCHEDULE") {
				expandListThroughSchedules(midwayMallList);
			} else if(showFilmsBy === "SHOPPING") {
				insertSpacesOnSchedule(midwayMallList);
			}
			filmsList = filmsList.concat(midwayMallList);
			downloadPraiaShopping(filmsList);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function downloadPraiaShopping(filmsList) {
	var Praiashopping = Parse.Object.extend("Praiashopping");
	var query = new Parse.Query(Praiashopping);
	query.find({
		success: function(praiaShopList) {
			praiaShopList = takeOutBrackets(praiaShopList);
			if(showFilmsBy === "SCHEDULE") {
				expandListThroughSchedules(praiaShopList);
			} else if(showFilmsBy === "SHOPPING") {
				insertSpacesOnSchedule(praiaShopList);
			}
			filmsList = filmsList.concat(praiaShopList);
			generateFilms(filmsList);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function generateFilms(films) {
	removeFilms(films);
	var htmlFilmsList = document.getElementById("filmsList");
	var orderList = [];
	for(var i = 0; i < films.length; i++) {
		orderList[i] = i;
	}
	if(showFilmsBy === "SCHEDULE") {
		ordenateBySchedule(films, orderList);	
	} 
	for(var i = 0; i < orderList.length; i++) {
		createNewListElement(htmlFilmsList, films[orderList[i]]);
	}
}

function removeFilms(films) {
	var checkNatal = document.getElementById("checkNatal");
	var checkNorte = document.getElementById("checkNorte");
	var checkMidway = document.getElementById("checkMidway");
	var checkPraia = document.getElementById("checkPraia");

	var shopping;
	if(!checkNatal.checked) {
		shopping = "Natal Shopping";
		takeOutFilms(shopping, films);
	}
	if(!checkNorte.checked) {
		shopping = "Norte Shopping";
		takeOutFilms(shopping, films);
	}
	if(!checkMidway.checked) {
		shopping = "Midway Mall";
		takeOutFilms(shopping, films);
	}
	if(!checkPraia.checked) {
		shopping = "Praia Shopping";
		takeOutFilms(shopping, films);
	}
}

function takeOutFilms(shopping, films) {
	var indexes = [];
	for(var i = 0, j = 0; i < films.length; i++) {
		if(films[i].get("shopping") == shopping) {
			console.log("Achou" + films[i].get("shopping"));
			//indexes[j] = i;
			//j++;
			films.splice(i, 1);
			i--;
		}
	}
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

	var backButton = document.createElement("button");
	backButton.addEventListener("click", function() {
		var htmlFilmsList = document.getElementById("filmsList");
		deleteList(htmlFilmsList);

		var newList = document.createElement("ul");
		newList.id = "filmsList";
		divGeneral.appendChild(newList);
		downloadFilms();
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
			downloadFilms();
    	return false;
  		}
	});

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

function expandListThroughSchedules(filmsList) {
	for(var i = 0; i < filmsList.length; i++) {
		var schedules = filmsList[i].get("schedule");
		var countFilms = 1;
		for(var j = 0; j < schedules.length; j++) {
			if(schedules[j] == ',') {
				countFilms++;
			}
		}
		var listOfSchedules = [];
		for(var j = 0; j < countFilms; j++) {
			var end = schedules.indexOf(",");
			if(end == -1) {
				end = schedules.length;
			}
			listOfSchedules[j] = schedules.substring(0, end);
			schedules = schedules.substring(end+1);
		}

		filmsList[i].set("schedule", listOfSchedules[0]);
		for(var j = 1; j < listOfSchedules.length; j++) {
			//Error is here, should copy each element to a new object and pass on push
			//var clone = JSON.parse(JSON.stringify(filmsList[i].set("schedule", listOfSchedules[j])));
			var clone = jQuery.extend(true, {}, filmsList[i]);
			filmsList.push(clone);
			filmsList[filmsList.length - 1].set("schedule", listOfSchedules[j]);
		}
	}
}

function insertSpacesOnSchedule(filmsList) {
	for(var i = 0; i < filmsList.length; i++) {
		var schedule = filmsList[i].get("schedule");
		schedule = schedule.replace(",", " - ");
		filmsList[i].set("schedule", schedule);
	}
}

function takeOutBrackets(filmsList) {
	for(var i = 0; i < filmsList.length; i++) {
		var schedule = filmsList[i].get("schedule");
		var end = schedule.indexOf("(");
		schedule = schedule.substring(0, end);
		filmsList[i].set("schedule", schedule);
	}
	return filmsList;
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

function copyFromTo(from, to) {
	to.set("name", from.get("name"));
	to.set("sinopse", from.get("sinopse"));
	to.set("language", from.get("language"));
	to.set("image", from.get("image"));
	to.set("duration", from.get("duration"));
	to.set("gender", from.get("gender"));
	to.set("censure", from.get("censure"));
	to.set("roomType", from.get("roomType"));
	to.set("schedule", from.get("schedule"));
	to.set("shopping", from.get("shopping"));
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
	downloadFilms();
}

function changeCheckBoxNorteShopping() {
	var checkbox = document.getElementById("checkNorte");
	checkbox.checked = !checkbox.checked;
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	createList();
	downloadFilms();
}

function changeCheckBoxMidwayMall() {
	var checkbox = document.getElementById("checkMidway");
	checkbox.checked = !checkbox.checked;
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	createList();
	downloadFilms();
}

function changeCheckBoxPraiaShopping() {
	var checkbox = document.getElementById("checkPraia");
	checkbox.checked = !checkbox.checked;
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	createList();
	downloadFilms();
}

function deleteList(htmlFilmsList) {
	if(!onInfo) {
		var divGeneral = document.getElementById("generalElement");
		divGeneral.removeChild(htmlFilmsList);
	} else {
		onInfo = false;
		var divGeneral = document.getElementById("generalElement");
		var divInfo = document.getElementById("info");
		divGeneral.removeChild(divInfo);
		var backButton = document.getElementById("backButton");
		divGeneral.removeChild(backButton);
	}
}