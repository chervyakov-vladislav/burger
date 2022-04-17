// hamburger menu header--fullscreen

const header = document.querySelector('.header');
const body = document.querySelector('body');

header.addEventListener('click', function(e) {
	const hamburger = e.target.closest('.hamburger-menu');
	if	(hamburger && e.target.closest('.header--fullscreen')) {
		header.classList.remove('header--fullscreen');
		body.style.overflow = 'inherit';
	}
	else if (hamburger && e.target.closest('.hamburger-menu')) {
		header.classList.add('header--fullscreen');
		body.style.overflow = 'hidden';
	}
});


//burgers-composition-close-btn
const hoverClose = document.querySelector('.composition__close-btn');
const hoverOpen = document.querySelector('.burger-card__composition--item');

	hoverClose.addEventListener('click', function(e) {
		e.preventDefault();
		document.querySelector('.burger-card__composition--hover').style.display = 'none';
	});
	
if (screen.width < 769) {
	hoverOpen.addEventListener('click', function(e) {
		e.preventDefault();
		document.querySelector('.burger-card__composition--hover').style.display = 'block';
	});
}