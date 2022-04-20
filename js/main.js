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

for (i = 0; i < reviewButton.length; i++) {
	reviewButton[i].addEventListener("click", function(e) {
			let reviewsTitle = e.path[2].querySelector('.reviews__title').innerHTML;
			let reviewsText = e.path[2].querySelector('.reviews__text').innerHTML;
		  let successOverlay = createOverlay(reviewsTitle, reviewsText);
			document.querySelector(".reviews").append(successOverlay);
    });
}


function createOverlay(title, text) {
	//не получилось добавить готовый шаблон на страницу, пришлось создавать див с оверлеем (newElement = document.createElement('div');) и в него закидывать шиблон
	const newElement = document.createElement('div');
	newElement.classList.add('overlay');
	newElement.innerHTML = document.querySelector('#reviewsPopup').innerHTML;
	
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