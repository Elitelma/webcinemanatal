var PARSE_ID = "UAHnlUyVZq0Tq6weTzXkzOgzGhndLtbVvReuFXqw";
var PARSE_CLIENTKEY = "dMsW9PbJ0IXIgr1G6SQTAe3RsEcJyU6JJk1NdAGb";

Parse.initialize(PARSE_ID, PARSE_CLIENTKEY);

window.addEventListener("load", config, false);

function config() {
	downloadFilms();
	//generateFilms(films);
}

function downloadFilms() {
	var Natalshopping = Parse.Object.extend("Natalshopping");
	var query = new Parse.Query(Natalshopping);
	query.find({
		success: function(natalShopList) {
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
			filmsList = expandListThroughSchedules(filmsList);
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
			midwayMallList = expandListThroughSchedules(midwayMallList);
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
			praiaShopList = expandListThroughSchedules(praiaShopList);
			filmsList = filmsList.concat(praiaShopList);
			filmsList = ordenateBySchedule(filmsList);
			generateFilms(filmsList);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function generateFilms(films) {
	var htmlFilmsList = document.getElementById("filmsList"); 
	for(var i = 0; i < films.length; i++) {
		createNewListElement(htmlFilmsList, films[i]);
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
	filmGenre.id = "genre"
	listItem.appendChild(filmGenre);

	/*
	var extraInfo = null;
	if(film.get("shopping") === "Praia Shopping") {
		extraInfo = getExtraInfoPraiaShopping(film);
	} 
	else (film.get("schedule").endsWithLetter()) {
		getExtraInfo(film, listItem);
	}

	if(extraInfo != null) {
		var filmExtraInfo = document.createElement("p");
		textNode = document.createTextNode(extraInfo);
		filmExtraInfo.appendChild(textNode);
		filmExtraInfo.id = "extra_info";
		listItem.appendChild(filmExtraInfo);
	}
	*/
}

/*
function getExtraInfo(film, listItem) {
	var schedule = film.get("schedule");
	var letter = schedule.charAt(schedule.length - 1);
	if(film.get("shopping") === "Natal Shopping") {
		var ExtraNatal = Parse.Object.extend("ExtraNatal");
		var query = new Parse.Query(ExtraNatal);
		query.find({
			success: function(parseObjects) {
				var extra = parseObjects[0].get("Extra");
				var listExtras = generateListExtrasCinepolis(extra);
				generateExtraInfoPTag(listItem, extra);
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	} else if(film.get("shopping") === "Norte Shopping") {
		var ExtraNorte = Parse.Object.extend("ExtraNorte");
		var query = new Parse.Query(ExtraNorte);
		query.find({
			success: function(parseObjects) {
				var extra = parseObjects[0].get("Extra");
				extra = extra.substring(extra.indexOf(letter), extra.lastIndexOf(")"));
			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	} else if(film.get("shopping") === "Midway Mall") {
		var ExtraMidway = Parse.Object.extend("ExtraMidway");
		var query = new Parse.Query(ExtraMidway);
		query.find({
			success: function(parseObjects) {
				var extra = parseObjects[0].get("Extra");

			},
			error: function(error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});
	}
}

function generateListExtrasCinepolis(extra) {

}

function generateExtraInfoPTag(listItem, extra) {
	var filmExtraInfo = document.createELement("p");
	var textNode = document.createTextNode(extra);
	filmExtraInfo.appendChild(textNode);
	filmExtraInfo.id = "extra_info";
	listItem.appendChild(filmExtraInfo);
}

function getExtraInfoPraiaShopping(film) {
	var extra = film.get("schedule");
	extra = extra.substring(extra.indexOf("(") + 1, extra.length - 2);
	return extra;
}
*/

function loadFilmInfo(film, htmlFilmsList) {
	var divGeneral = document.getElementById("generalElement");
	divGeneral.id = "generalFilmInfo";
	divGeneral.removeChild(htmlFilmsList);

	var filmImg = document.createElement("img");
	filmImg.src = film.get("image").url();
	divGeneral.appendChild(filmImg);
}

function expandListThroughSchedules(filmsList) {
	var list = [];
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
		for(var j = 0; j < countFilms; j++) {
			var size = list.unshift(filmsList[i]);
			list[0].set("schedule", listOfSchedules[j]);
		}
	}
	return list;
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

function ordenateBySchedule(filmsList) {
	for(var i = 0; i < filmsList.length - 1; i++) {
		for(var j = i+1; j < filmsList.length; j++) {
			var hour1, hour2;
			hour1 = getHour(filmsList[i].get("schedule"));
			hour2 = getHour(filmsList[j].get("schedule"));
			if(hour2 < hour1) {
				var aux = filmsList[i];
				filmsList[i] = filmsList[j];
				filmsList[j] = aux;
			} else if(hour2 == hour1) {
				var min1, min2;
				min1 = getMin(filmsList[i].get("schedule"));
				min2 = getMin(filmsList[j].get("schedule"));
				if(min2 < min1) {
					var aux = filmsList[i];
					filmsList[i] = filmsList[j];
					filmsList[j] = aux;
				}
			}
		}
	}

	return filmsList;
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