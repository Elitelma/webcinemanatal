var PARSE_ID = "UAHnlUyVZq0Tq6weTzXkzOgzGhndLtbVvReuFXqw";
var PARSE_CLIENTKEY = "dMsW9PbJ0IXIgr1G6SQTAe3RsEcJyU6JJk1NdAGb";

Parse.initialize(PARSE_ID, PARSE_CLIENTKEY);

window.addEventListener("load", config, false);

function config() {
	var orderList = [];
	downloadFilms();
	//generateFilms(films);
}

function downloadFilms() {
	var Natalshopping = Parse.Object.extend("Natalshopping");
	var query = new Parse.Query(Natalshopping);
	query.find({
		success: function(natalShopList) {
			expandListThroughSchedules(natalShopList);
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
			console.log("Fez o download de Norte Shopping corretamente. Tipo: " + typeof(norteShopList));
			var filmsList = natalShopList.concat(norteShopList);
			expandListThroughSchedules(filmsList);
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
			console.log("Fez o download de Midway Mall corretamente. Tipo: " + typeof(midwayMallList));
			expandListThroughSchedules(midwayMallList);
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
			console.log("Fez o download de Praiashopping corretamente. Tipo: " + typeof(praiaShopList));
			praiaShopList = takeOutBrackets(praiaShopList);
			expandListThroughSchedules(praiaShopList);
			filmsList = filmsList.concat(praiaShopList);
			generateFilms(filmsList);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function generateFilms(films) {
	console.log("Filmes antes de ordenar: " + films.length);
	for(var i = 0; i < films.length; i++) {
		console.log(films[i].get("name") + " " + films[i].get("schedule"));
	}
	var htmlFilmsList = document.getElementById("filmsList");
	var orderList = [];
	for(var i = 0; i < films.length; i++) {
		orderList[i] = i;
	} 
	ordenateBySchedule(films, orderList);
	console.log("Filmes depois de ordenar: " + orderList.length);
	for(var i = 0; i < orderList.length; i++) {
		console.log(films[orderList[i]].get("name") + " " + films[orderList[i]].get("schedule"));
	}
	for(var i = 0; i < orderList.length; i++) {
		createNewListElement(htmlFilmsList, films[orderList[i]]);
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

	var filmSchedule = document.createElement("p");
	textNode = document.createTextNode(film.get("schedule"));
	filmSchedule.appendChild(textNode);
	filmSchedule.id = "schedule";
	listItem.appendChild(filmSchedule);

	var filmShopping = document.createElement("p");
	textNode = document.createTextNode(film.get("shopping"));
	filmShopping.appendChild(textNode);
	listItem.appendChild(filmShopping);

	var filmGenre = document.createElement("p");
	textNode = document.createTextNode(film.get("gender"));
	filmGenre.appendChild(textNode);
	filmGenre.id = "genre";
	listItem.appendChild(filmGenre);
}

function loadFilmInfo(film, htmlFilmsList) {
	var divGeneral = document.getElementById("generalElement");
	divGeneral.id = "generalFilmInfo";
	divGeneral.removeChild(htmlFilmsList);

	var filmImg = document.createElement("img");
	filmImg.src = film.get("image").url();
	divGeneral.appendChild(filmImg);
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