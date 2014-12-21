var PARSE_ID = "UAHnlUyVZq0Tq6weTzXkzOgzGhndLtbVvReuFXqw";
var PARSE_CLIENTKEY = "dMsW9PbJ0IXIgr1G6SQTAe3RsEcJyU6JJk1NdAGb";

Parse.initialize(PARSE_ID, PARSE_CLIENTKEY);

var films = [];
var filmsBySchedule = [];
var searchFilms = [];
var extraNatal, extraNorte, extraMidway, extraPraia;
var showFilmsBy = "SHOPPING";
var onInfo = false;
var onSearch = false;
var searchBy = "NONE";

window.addEventListener("load", config, false);

function config() {
	downloadFilms(filmsDownloaded);
}

function filmsDownloaded() {
	setupSearch();
	setupJQueryUI();
	generateFilms();
}

function setupJQueryUI() {
	$(document).tooltip();
}

function setupSearch() {
	for(var i = 0; i < films.length; i++) {
		searchFilms.push(films[i].get("name").trim());
	}
	searchFilms = uniq(searchFilms);
    $("#searchField").autocomplete({
    	minLength: 0,
    	source: searchFilms,
    	select: function(event, ui) {
    		searchByName(ui.item.value);
      	}
    });
    $("#searchField").keydown(function(e) {
    	if(e.which === 13) {
    		searchByName(document.getElementById("searchField").value);
    		$("#searchField").autocomplete("close");
    	}
    });
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
		document.getElementById("checkSchedule").checked = true;
		document.getElementById("checkShopping").checked = false;
		var htmlFilmsList = document.getElementById("filmsList");
		deleteList(htmlFilmsList);
		createList();
		generateFilms();
	} else if(showFilmsBy != "SCHEDULE") {
		showFilmsBy = "SCHEDULE";
		document.getElementById("checkSchedule").checked = false;
		document.getElementById("checkShopping").checked = true;
		deleteList(htmlFilmsList);
		generateFilms();
	}
}

function showFilmsByShopping() {
	if(showFilmsBy != "SHOPPING" && !onInfo) {
		showFilmsBy = "SHOPPING";
		document.getElementById("checkSchedule").checked = false;
		document.getElementById("checkShopping").checked = true;
		var htmlFilmsList = document.getElementById("filmsList");
		deleteList(htmlFilmsList);
		createList();
		generateFilms();
	} else if(showFilmsBy != "SHOPPING") {
		showFilmsBy = "SHOPPING";
		document.getElementById("checkSchedule").checked = true;
		document.getElementById("checkShopping").checked = false;
		deleteList(htmlFilmsList);
		generateFilms();
	}
}

function searchByName(search) {
	var htmlFilmsList = document.getElementById("filmsList");
	deleteList(htmlFilmsList);
	onSearch = true;
	searchBy = "NAME";

	var divGeneral = document.getElementById("generalElement");
	var textNode;
	setupBackButton(divGeneral, textNode);
	//createSearchByNameField(divGeneral);
	search = search.split(" ").join("").toLowerCase();
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
	var extras = [];
	var schedule = film.get("schedule").split(" ").join("").split(",");
	if( /Android|iPhone|iPod|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		for(var i = 0; i < schedule.length; i++) {
			if(endsWithLetter(schedule[i])) {
				extras.push(getExtraFromLetter(film.get("shopping"), schedule[i].charAt(schedule[i].length-1)));
			}
			if(i !== schedule.length - 1) {
				textNode = document.createTextNode(schedule[i] + ", ");
			} else {
				textNode = document.createTextNode(schedule[i]);
			}
			filmSchedule.appendChild(textNode);
		}
	} /*else if(/iPhone|iPod/i.test(navigator.userAgent)){
		textNode = document.createTextNode(film.get("schedule"));
		filmSchedule.appendChild(textNode);
	} */else {
		for(var i = 0; i < schedule.length; i++) {
			if(endsWithLetter(schedule[i])) {
				var tooltip = document.createElement("a");
				tooltip.title = getExtraFromLetter(film.get("shopping"), schedule[i].charAt(schedule[i].length-1));
				if(i !== schedule.length - 1) {
					textNode = document.createTextNode(schedule[i] + ", ");
				} else {
					textNode = document.createTextNode(schedule[i]);
				}
				tooltip.appendChild(textNode);
				filmSchedule.appendChild(tooltip);
			} else {
				if(i !== schedule.length - 1) {
					textNode = document.createTextNode(schedule[i] + ", ");
				} else {
					textNode = document.createTextNode(schedule[i]);
				}
				filmSchedule.appendChild(textNode);
			}
		}
	}

	//textNode = document.createTextNode(film.get("schedule"));
	//filmSchedule.appendChild(textNode);
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
		if(text.indexOf("ico3d") > -1) {
			text = text.replace("ico3d", "3d");
		}	
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

	if( /Android|iPhone|iPod|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		listItem.appendChild(document.createElement("br"));
		for(var i = 0; i < extras.length; i++) {
			var extra = document.createElement("p");
			textNode = document.createTextNode(extras[i]);
			extra.appendChild(textNode);
			extra.id = "schedulesExtra";
			listItem.appendChild(extra);
		}
	}
}

function getExtraFromLetter(shopping, letter) {
	var extras = [];
	if(shopping === "Natal Shopping") {
		if(extraNatal.get("Extra") !== "none") {
			extras = extraMidway.get("Extra").split(".");
			for(var i = 0; i < extras.length; i++) {
				extras[i] = extras[i].trim();
				if(extras[i].charAt(0) === letter) {
					return extras[i];
				}
			}
		}
	} else if(shopping === "Norte Shopping") {
		if(extraNorte.get("Extra") !== "none") {
			extras = extraMidway.get("Extra").split(".");
			for(var i = 0; i < extras.length; i++) {
				extras[i] = extras[i].trim();
				if(extras[i].charAt(0) === letter) {
					return extras[i];
				}
			}
		}
	} else if(shopping === "Midway Mall") {
		if(extraMidway.get("Extra") !== "none") {
			extras = extraMidway.get("Extra").split(".");
			for(var i = 0; i < extras.length; i++) {
				extras[i] = extras[i].trim();
				if(extras[i].charAt(0) === letter) {
					return extras[i];
				}
			}
		}
	} else if(shopping === "Praia Shopping") {
		if(extraPraia.get("Extra") !== "none") {
			return "none";
		}
	}
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

	var extras = [];
	var schedule = film.get("schedule").split(" ").join("").split(",");
	for(var i = 0; i < schedule.length; i++) {
		if(endsWithLetter(schedule[i])) {
			extras.push(getExtraFromLetter(film.get("shopping"), schedule[i].charAt(schedule[i].length-1)));
		}
	}

	for(var i = 0; i < extras.length; i++) {
		var extra = document.createElement("p");
		textNode = document.createTextNode(extras[i]);
		extra.appendChild(textNode);
		extra.id = "infoSchedulesExtra";
		divInfo.appendChild(extra);
	}
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
  		if (e.which === 8 && (onSearch || onInfo)) {
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

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

function uniq(a) {
    return a.sort().filter(function(item, pos) {
        return !pos || item != a[pos - 1];
    })
}