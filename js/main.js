var i;

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

//overlay reviews
const reviewButton = document.querySelectorAll('.reviews__btn');
const template = document.querySelector('#reviewsPopup').innerHTML;

for (i = 0; i < reviewButton.length; i++) {
	reviewButton[i].addEventListener("click", function(e) {
			let reviewsTitle = e.path[2].querySelector('.reviews__title').innerHTML;
			let reviewsText = e.path[2].querySelector('.reviews__text').innerHTML;
		  let successOverlay = createOverlay(reviewsTitle, reviewsText);
			document.querySelector(".reviews").append(successOverlay);
    });
}

function createOverlay(title, text) {
	// как создавать шаблон без лишнего дива?
	const newElement = document.createElement('div');
	newElement.innerHTML = template;

	const closeOverlay = newElement.querySelector('.overlay__close-btn');
	const closeOverlayBg = newElement.querySelector('.overlay');

	closeOverlayBg.addEventListener('click', function(e) {
		if (e.target === closeOverlayBg) {
			closeOverlay.click();
		}
	});
	closeOverlay.addEventListener('click', function(e) {
		e.preventDefault();
		document.querySelector('.reviews').removeChild(newElement);
	})

	newElement.querySelector('.reviews__overlay--title').innerHTML = title;
	newElement.querySelector('.reviews__overlay--text').innerHTML = text;

	return newElement;
}

//accordeon

const itemVertAccordeon = document.querySelectorAll('.vertical-accordeon__item');
//не работает preventDefault;
for (i = 0; i < itemVertAccordeon.length; i++) {
	itemVertAccordeon[i].addEventListener('click', function(e) {
		if (e.target.closest('.vertical-accordeon__item').classList.contains('vertical-accordeon__item--active')) {
			e.target.closest('.vertical-accordeon__item').classList.remove('vertical-accordeon__item--active');
		} else {
			for (let j = 0; j < itemVertAccordeon.length; j++) {
				itemVertAccordeon[j].classList.remove('vertical-accordeon__item--active');
			}
			e.target.closest('.vertical-accordeon__item').classList.add('vertical-accordeon__item--active');
		}		
	});
}

//team-accordeon
const itemTeamAccordeon = document.querySelectorAll('.staff__item');
for (i = 0; i < itemTeamAccordeon.length; i++) {
	itemTeamAccordeon[i].addEventListener('click', function(e) {
		if (e.target.closest('.staff__item').classList.contains('staff__active')) {
			e.target.closest('.staff__item').classList.remove('staff__active');
		} else {
			for (let j = 0; j < itemTeamAccordeon.length; j++) {
				itemTeamAccordeon[j].classList.remove('staff__active');
			}
			e.target.closest('.staff__item').classList.add('staff__active');
		}
	});
}