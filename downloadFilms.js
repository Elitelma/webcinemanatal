//O código neste arquivo segue uma ordem estruturada, como se traram de requisições ao banco
//de dados na nuvem, cada função é executada após a anterior ter sucesso e no final
//callback() é executado, voltando para script.js na forma de filmsDownloaded();

function downloadFilms(callback) {
	startDownload(callback);
}

function startDownload(callback) {
	var Natalshopping = Parse.Object.extend("Natalshopping");
	var query = new Parse.Query(Natalshopping);
	query.find({
		success: function(natalShopList) {
			films = films.concat(natalShopList);
			downloadNorteShopping(callback);
		},
		error: function(error) {
			console.log("Error downloading NatalShoppingList: " + error.code + " " + error.message);
		}
	});
}

function downloadNorteShopping(callback) {
	var Norteshopping = Parse.Object.extend("Norteshopping");
	var query = new Parse.Query(Norteshopping);
	query.find({
		success: function(norteShopList) {
			films = films.concat(norteShopList);
			downloadMidwayMall(callback);
		},
		error: function(error) {
			console.log("Error downloading NorteShoppingList: " + error.code + " " + error.message);
		}
	});
}

function downloadMidwayMall(callback) {
	var Midwaymall = Parse.Object.extend("Midwaymall");
	var query = new Parse.Query(Midwaymall);
	query.find({
		success: function(midwayMallList) {
			films = films.concat(midwayMallList);
			downloadPraiaShopping(callback);
		},
		error: function(error) {
			console.log("Error downloading MidwayMallList: " + error.code + " " + error.message);
		}
	});
}

function downloadPraiaShopping(callback) {
	var Praiashopping = Parse.Object.extend("Praiashopping");
	var query = new Parse.Query(Praiashopping);
	query.find({
		success: function(praiaShopList) {
			praiaShopList = takeOutBrackets(praiaShopList);
			films = films.concat(praiaShopList);
			startDownloadExtras(callback);
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function startDownloadExtras(callback) {
	var ExtraNatal = Parse.Object.extend("ExtraNatal");
	var query = new Parse.Query(ExtraNatal);
	query.find({
		success: function(extra) {
			extraNatal = extra[0];
			downloadExtraNorte(callback);
		},
		error: function(error) {
			console.log("Error downloading ExtraNatal: " + error.code + " " + error.message);
		}
	});
}

function downloadExtraNorte(callback) {
	var ExtraNorte = Parse.Object.extend("ExtraNorte");
	var query = new Parse.Query(ExtraNorte);
	query.find({
		success: function(extra) {
			extraNorte = extra[0];
			downloadExtraMidway(callback);
		},
		error: function(error) {
			console.log("Error downloading ExtraNorte: " + error.code + " " + error.message);
		}
	});
}

function downloadExtraMidway(callback) {
	var ExtraMidway = Parse.Object.extend("ExtraMidway");
	var query = new Parse.Query(ExtraMidway);
	query.find({
		success: function(extra) {
			extraMidway = extra[0];
			downloadExtraPraia(callback);
		},
		error: function(error) {
			console.log("Error downloading ExtraMidway: " + error.code + " " + error.message);
		}
	});
}

function downloadExtraPraia(callback) {
	var ExtraPraia = Parse.Object.extend("ExtraPraia");
	var query = new Parse.Query(ExtraPraia);
	query.find({
		success: function(extra) {
			extraPraia = extra[0];
			organizeList(callback);
		},
		error: function(error) {
			console.log("Error downloading ExtraPraia: " + error.code + " " + error.message);
		}
	});
}

function organizeList(callback) {
	createListBySchedule();
	insertSpacesBetweenSchedules();
	callback();
}

function createListBySchedule() {
	for(var i = 0; i < films.length; i++) {
		filmsBySchedule.push(jQuery.extend(true, {}, films[i]));
	}
	for(var i = 0; i < filmsBySchedule.length; i++) {
		var schedules = filmsBySchedule[i].get("schedule");
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

		filmsBySchedule[i].set("schedule", listOfSchedules[0]);
		for(var j = 1; j < listOfSchedules.length; j++) {
			//Error is here, should copy each element to a new object and pass on push
			//var clone = JSON.parse(JSON.stringify(filmsList[i].set("schedule", listOfSchedules[j])));
			var clone = jQuery.extend(true, {}, filmsBySchedule[i]);
			filmsBySchedule.push(clone);
			filmsBySchedule[filmsBySchedule.length - 1].set("schedule", listOfSchedules[j]);
		}
	}

}

function insertSpacesBetweenSchedules() {
	for(var i = 0; i < films.length; i++) {
		var filmSchedule = films[i].get("schedule").split(",").join(", ");;
		films[i].set("schedule", filmSchedule);
	}
}

function takeOutBrackets(list) {
	for(var i = 0; i < list.length; i++) {
		var schedule = list[i].get("schedule");
		var end = schedule.indexOf("(");
		schedule = schedule.substring(0, end);
		list[i].set("schedule", schedule);
	}
	return list;
}