;(function() {

// slider
// не сделаны буллеты снизу
let sliderContainer = document.querySelector('.slider-container__list');
let sliderCarousel = document.querySelector('.slider-container__items');
let sliderItem = document.querySelectorAll('.slider-container__item');
let contentWidth = document.querySelector('.slider-container__list').clientWidth;
let sliderLeft = document.querySelector('#slider-left');
let sliderRight = document.querySelector('#slider-right');
let sliderDotsList = document.querySelector('.slider-dots');
let sliderPicture = document.querySelectorAll('.burger-card__pic');
let allDots;

const minRight = 0;
const maxRight = contentWidth * sliderItem.length;
const step = contentWidth;
let currentRight = 0;
let currentStep;

for (i = 0; i < sliderItem.length; i++) {
	sliderItem[i].style.minWidth = contentWidth + "px";
}

sliderLeft.addEventListener('click', e => {
	e.preventDefault();
	if (Math.abs(currentRight) > minRight) {
		currentRight += step;
		sliderCarousel.style.transform = `translateX(${currentRight}px)`;
		currentStep = -(currentRight/step);
		switchActiveClass(currentStep);
	} else {
		sliderCarousel.style.transform = `translateX(-${maxRight - step}px)`;
		currentRight = -(maxRight - step);
		currentStep = -(currentRight/step);
		switchActiveClass(currentStep);
	}
});

sliderRight.addEventListener('click', e => {
	e.preventDefault();
	if (Math.abs(currentRight) < (maxRight - step)) {
		currentRight -= step;
		sliderCarousel.style.transform = `translateX(${currentRight}px)`;
		currentStep = -(currentRight/step);
		switchActiveClass(currentStep);
	} else {
		sliderCarousel.style.transform = `translateX(0px)`;
		currentRight = 0;
		currentStep = -(currentRight/step);
		switchActiveClass(currentStep);
	}
});

for (let i = 0; i < sliderItem.length; i++) {
	sliderDotsList.append(createNewElement(i));
}

function createNewElement(i) {
	let elem = document.createElement('li');
	elem.classList.add('slider-dots__img');
	let newImg = document.createElement('img');
	newImg.classList.add('slider-dots__img--pic');
	let src = sliderPicture[i].getAttribute('src');
	let alt = sliderPicture[i].getAttribute('alt');
	newImg.setAttribute('src', src);
	newImg.setAttribute('alt', alt);
	elem.append(newImg);
	return elem;
}

allDots = document.querySelectorAll('.slider-dots__img');

if (allDots.length > 0) {
	allDots[0].classList.add('slider-dots__img--active');
}

for (let i = 0; i < allDots.length; i++) {
	allDots[i].addEventListener('click', () => {
		switchActiveClass(i);
		dotMoveSlide(i);
	});
}

function dotMoveSlide(i) {
	currentRight = step * (-i);
	sliderCarousel.style.transform = `translateX(${currentRight}px)`;
} 

function switchActiveClass(i) {
	allDots[i].classList.add('slider-dots__img--active');
	let siblings = getSiblings(allDots[i]);
	for (let sibling in siblings) {
		if (siblings[sibling].classList.contains('slider-dots__img--active')) {
			siblings[sibling].classList.remove('slider-dots__img--active');
		}
	}
	return;
} 

function getSiblings(elem) {
	let siblings = [];
	let sibling = elem;
	while (sibling.previousSibling) {
			sibling = sibling.previousSibling;
			sibling.nodeType == 1 && siblings.push(sibling);
	}

	sibling = elem;
	while (sibling.nextSibling) {
			sibling = sibling.nextSibling;
			sibling.nodeType == 1 && siblings.push(sibling);
	}

	return siblings;
}


})();