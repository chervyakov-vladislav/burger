// hamburger menu header--fullscreen

var header = document.querySelector('.header');

header.addEventListener('click', function(e) {
	var hamburger = e.target.closest('.hamburger-menu');
	if	(hamburger && e.target.closest('.header--fullscreen')) {
		header.classList.remove('header--fullscreen');
	}
	else if (hamburger && e.target.closest('.hamburger-menu')) {
		header.classList.add('header--fullscreen');
	}
});