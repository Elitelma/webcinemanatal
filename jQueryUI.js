var menuOpen = false;
var menu = document.getElementById("menu");
var list = document.getElementById("filmsList");

$('#menuButton').on('click touchstart', function(e){
	if(menuOpen == false) {
		menuOpen = true;
		menu.style.display = "block";
		$('#menuButton').text("Voltar");
		list.style.visibility = "hidden";
	} else {
		menuOpen = false;
		menu.style.display = "none";
		$('#menuButton').text("Menu");
		list.style.visibility = "visible";
	}
  	e.preventDefault();
});