var i;

// hamburger menu header--fullscreen

const header = document.querySelector('.header');
const body = document.querySelector('body');
const hamburgerMenu = document.querySelector('.hamburger-menu');

header.addEventListener('click', function (e) {
	const hamburger = e.target.closest('.hamburger-menu');
	if (hamburgerMenu.classList.contains('hamburger-menu--unToggled')) {
		hamburgerMenu.classList.remove('hamburger-menu--unToggled');
		hamburgerMenu.classList.add('hamburger-menu--toggled');
	} else if (hamburgerMenu.classList.contains('hamburger-menu--toggled') && e.target.closest('.nav__item')) {
		hamburgerMenu.classList.add('hamburger-menu--unToggled');
		hamburgerMenu.classList.remove('hamburger-menu--toggled');
	}
	
	if (hamburger && e.target.closest('.header--fullscreen')) {
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

hoverClose.addEventListener('click', function (e) {
	e.preventDefault();
	document.querySelector('.burger-card__composition--hover').style.display = 'none';
});

if (screen.width < 769) {
	hoverOpen.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector('.burger-card__composition--hover').style.display = 'block';
	});
}

//overlay reviews
const reviewButton = document.querySelectorAll('.reviews__btn');
const template = document.querySelector('#reviewsPopup').innerHTML;

for (i = 0; i < reviewButton.length; i++) {
	reviewButton[i].addEventListener("click", function (e) {
		let reviewsTitle = e.path[2].querySelector('.reviews__title').innerHTML;
		let reviewsText = e.path[2].querySelector('.reviews__text').innerHTML;
		let successOverlay = createOverlay(reviewsTitle, reviewsText);
		document.querySelector(".reviews").append(successOverlay);
	});
}

function createOverlay(title, text) {
	const newElement = document.createElement('div');
	newElement.classList.add('overlay');
	newElement.innerHTML = template;

	const closeOverlay = newElement.querySelector('.overlay__close-btn');

	newElement.addEventListener('click', function (e) {
		if (e.target === newElement) {
			closeOverlay.click();
		}
	});
	closeOverlay.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector('.reviews').removeChild(newElement);
	})

	newElement.querySelector('.reviews__overlay--title').innerHTML = title;
	newElement.querySelector('.reviews__overlay--text').innerHTML = text;

	return newElement;
}

//accordeon

const itemVertAccordeon = document.querySelectorAll('.vertical-accordeon__item');
for (i = 0; i < itemVertAccordeon.length; i++) {
	itemVertAccordeon[i].addEventListener('click', function (e) {
		e.preventDefault();
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
	itemTeamAccordeon[i].addEventListener('click', function (e) {
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


//form popup вытаскиваем шаблон попапа и закидываем в форму
const templateForm = document.querySelector('#formPopup').innerHTML;
const sendButton = document.querySelector('#sendBtn');
const sendForm = document.querySelector('.form__elem');

let dataForm;
let textFormPopup;
let textFormPopupError = 'Вы не ввели... ';

sendButton.addEventListener('click', (e) => {
	e.preventDefault();

	if (!validateForm(sendForm)) {
		createFormOverlay(textFormPopup);
		textFormPopup = '';
	} else {
		let formData = createData();
		const xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail')
		xhr.responseType = 'json';
		xhr.send(formData);
		xhr.addEventListener('load', function () {
			if (xhr.response.status === 1) {
				textFormPopup = xhr.response.message;
				createFormOverlay(textFormPopup);
			} else {
				textFormPopup = xhr.response.message;
				createFormOverlay(textFormPopup);
			}
		});
		textFormPopup = '';
	}
});

function createFormOverlay(text) {
	const newElement = document.createElement('div');
	newElement.classList.add('overlay');
	newElement.innerHTML = templateForm;

	const closeOverlay = newElement.querySelector('.btn--overlay');

	newElement.addEventListener('click', function (e) {
		if (e.target === newElement) {
			closeOverlay.click();
		}
	});
	closeOverlay.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector('.order').removeChild(newElement);
	})

	newElement.querySelector('.reviews__overlay--text').innerHTML = text;

	document.querySelector(".order").append(newElement);
}

function validateForm(form) {
	let valid = true;

	if (!validateField(form.elements.comment)) {
		valid = false;
		textFormPopup = textFormPopupError + "Комментарий!";
	}

	if (!validateField(form.elements.phone)) {
		valid = false;
		textFormPopup = textFormPopupError + "Телефон!";
	}

	if (!validateField(form.elements.name)) {
		valid = false;
		textFormPopup = textFormPopupError + "Имя!";
	}

	return valid;
}

function validateField(field) {
	return field.checkValidity();
}

function createData() {
	let formData = new FormData(sendForm);

	formData.append("name", sendForm.elements.name.value);
	formData.append("phone", sendForm.elements.phone.value);
	formData.append("comment", sendForm.elements.comment.value);
	formData.append("to", "vasy@liy.com");

	return formData;
	// почему не сработал stringify?
	// dataForm = {
	// 	"name": sendForm.elements.name.value,
	// 	"phone": sendForm.elements.phone.value,
	// 	"comment": "vasy@liy.com",
	// 	"to": "vasy@liy.com"
	// }
	// return JSON.stringify(dataForm);
};;(function() {
	ymaps.ready(init);

	var placemarks = [
			{
					latitude: 59.97,
					longitude: 30.31,
					hintContent: '<div class="map__hint">ул. Литераторов, д. 19</div>'
			},
			{
					latitude: 59.94,
					longitude: 30.25,
					hintContent: '<div class="map__hint">Малый проспект В О, д 64</div>'
			},
			{
					latitude: 59.93,
					longitude: 30.34,
					hintContent: '<div class="map__hint">наб. реки Фонтанки, д. 56</div>'
			}
	],
			geoObjects= [];

	function init() {
			var map = new ymaps.Map('map', {
					center: [59.94, 30.32],
					zoom: 12,
					controls: ['zoomControl'],
					behaviors: ['drag']
			});

			for (var i = 0; i < placemarks.length; i++) {
							geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude],
							{
									hintContent: placemarks[i].hintContent
							},
							{
									iconLayout: 'default#image',
									iconImageHref: './img/icons/map-marker.svg',
									iconImageSize: [46, 57],
									iconImageOffset: [-23, -57]
							});
			}

			var clusterer = new ymaps.Clusterer({
					clusterIcons: [
							{
									href: './img/content/1st_screen_hero/main_burger.png',
									size: [100, 100],
									offset: [-50, -50]
							}
					],
					clusterIconContentLayout: null
			});

			map.geoObjects.add(clusterer);
			clusterer.add(geoObjects);
	}

})();;;(function() {

	const sections = document.querySelectorAll('.section');
	const menuItems = document.querySelectorAll('.fixed-menu__item');
	const display = document.querySelector('.maincontent');
	let inscroll = false;
	let  dataScroll = document.querySelectorAll("[data-scroll-to]");


	//код функции должен быть переписан на 3 отдельные функции, но мне пока так понятнее
	const performTransition = sectionIndex => {
		if (inscroll == false) { // if (inscroll) return; 
			inscroll = true;
			let position = `${sectionIndex * (-100)}%`;

			setTimeout(closeModalBurger, 500); // закрыть гамбургер-меню через 0.5 секунд 
			setTimeout(closeModalOverlay, 500); // закрыть оверлей отзыва через 0.5 секунд 
			sections[sectionIndex].classList.add('section--active');
			menuItems[sectionIndex].classList.add('fixed-menu__item--active');
			let siblings = getSiblings(sections[sectionIndex]);
			for (let sibling in siblings) {
				if (siblings[sibling].classList.contains('section--active')) {
					siblings[sibling].classList.remove('section--active');
				}
			}
			siblings = getSiblings(menuItems[sectionIndex]);
			for (let sibling in siblings) {
				if (siblings[sibling].classList.contains('fixed-menu__item--active')) {
					siblings[sibling].classList.remove('fixed-menu__item--active');
				}
			}

			display.style.cssText = `transform: translateY(${position});`;
			setTimeout(() => {
				inscroll = false;
			}, 200 + 300); // время transition + время инерции на тачпадах, подробный коммент о работе, либо замена на понятные переменные
		}
	} 

	const scrollViewport = direction => {
		
		let activeSection = 0;
		for (let i = 0; i < sections.length; i++) {
			if (sections[i].classList.contains('section--active')) {
				activeSection = i;
			}
		}
		
		const prevSection = activeSection - 1;
		const nextSection = activeSection + 1;

		if (direction === 'prev' && prevSection >= 0) {
			performTransition(prevSection);
		}

		if (direction === 'next' && nextSection < sections.length) {
			performTransition(nextSection);
		}
	}

	document.addEventListener('wheel', (e) => {
		let deltaY = e.deltaY;
		
		if (deltaY > 0) {
			scrollViewport('next')
		} 
		
		if (deltaY < 0) {
			scrollViewport('prev');
		} 

	});


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

	document.addEventListener('keydown', (e) => {

		switch(e.keyCode) {
			case 38 : 
				scrollViewport('prev');
				break;
			case 40 :
				scrollViewport('next');
				break;
		}
	});


	for (let i=0; i < dataScroll.length; i++) {
		dataScroll[i].addEventListener('click', (e) => {
			e.preventDefault();
			let target = parseInt(e.target.dataset.scrollTo);
			performTransition(target);
		})
	}


	//mobile
	window.addEventListener('touchmove', e => {
		e.preventDefault();
	}, {passive: false})

	let event;
	let mobileDirection;
	document.addEventListener('touchstart', e => {
		event = e;
	})

	document.addEventListener('touchmove', e => {
		if (event) {
			mobileDirection = e.touches[0].pageY - event.touches[0].pageY;
			if (mobileDirection > 0) {
				scrollViewport('prev');
			}
			if (mobileDirection < 0) {
				scrollViewport('next');
			}
	}
	})
	
	document.addEventListener("touched", function (e) {
		event = null;
	});

	function closeModalBurger() {
		//закрытие бургера
		if (hamburgerMenu.classList.contains('hamburger-menu--unToggled') && header.classList.contains('header--fullscreen')) {
			hamburgerMenu.classList.remove('hamburger-menu--unToggled');
			hamburgerMenu.classList.add('hamburger-menu--toggled');
		} else {
			hamburgerMenu.classList.add('hamburger-menu--unToggled');
			hamburgerMenu.classList.remove('hamburger-menu--toggled');
		}
		header.classList.remove('header--fullscreen');
		body.style.overflow = 'inherit';
	}

	function closeModalOverlay() {
		if(document.querySelector('.overlay')){
			document.querySelector('.overlay').remove();
		}
	}

	// что-то читал о замене таймаутов на промисы и свормировать классы методы, но я не в курсах что это.
	// отдельные действия нужно закинуть в отдельные функции
	
})();;;(function() {

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


})();;(function () {
	let tag = document.createElement('script');
	let playButton = document.querySelector('.videocontent__play-btn');
	let pauseButton = document.querySelector('.videocontent__pause-btn');
	let playButtonControls = document.querySelector('.controls__play');
	let pauseButtonControls = document.querySelector('.controls__pause');
	let hideControls = document.querySelector('.videocontent__controls');
	let volumeInput = document.querySelector('.controls__volume-level')
	let volumeButton = document.querySelector('.controls__volume');
	let currentTimeElem = document.querySelector('.controls__timeline-current');
	let totalTimeElem = document.querySelector('.controls__timeline-total');
	let speedButton = document.querySelector('.controls__speed-btn');
	let timeline = document.querySelector('.controls__timeline');

	let player;
	onYouTubeIframeAPIReady = () => {
		player = new YT.Player('videocontent__iframe', {
			videoId: 'Wdc8IuU7foE',
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			},
			playerVars: {
				controls: 0,
				disablekb: 0,
				showinfo: 0,
				rel: 0,
				autoplay: 0,
				modestbranding: 0,
				playsinline: 1,
				fs: 0
			}
		});
	}

	onPlayerReady = () => {
		playPauseVideoOnPlayerReady();
		setTotalTime();
		setTimelineParams();
	}

	onPlayerStateChange = () => {
		playPauseVideoOnPlayerStateChange();
		setVolume();
		muteVolume();
		setInterval(setCurrentTime, 500);
		changeSpeed();
		changeTime();
	}

	playPauseVideoOnPlayerReady = () => {
		playButton.addEventListener('click', togglePlay);
		playButtonControls.addEventListener('click', togglePlay);
	}


	playPauseVideoOnPlayerStateChange = () => {
		if (player.getPlayerState() == 2) {
			togglePause();
		}

		if (player.getPlayerState() == 0) {
			toggleStop();
		}

		pauseButton.addEventListener('click', () => {
			togglePause();
		});

		pauseButtonControls.addEventListener('click', () => {
			togglePause();
		});
	}

	
	//play pause
	togglePlay = () => {
		playButton.classList.add('videocontent__play-btn--active');
		pauseButton.classList.add('videocontent__pause-btn--active');
		pauseButtonControls.classList.add('controls__pause--active');
		playButtonControls.classList.remove('controls__play--active');
		hideControls.classList.remove('videocontent__controls--paused');
		player.playVideo();
	}

	togglePause = () => {
		playButton.classList.remove('videocontent__play-btn--active');
		pauseButton.classList.remove('videocontent__pause-btn--active');
		pauseButtonControls.classList.remove('controls__pause--active');
		playButtonControls.classList.add('controls__play--active');
		hideControls.classList.add('videocontent__controls--paused');
		player.pauseVideo();
	}

	toggleStop = () => {
		playButton.classList.remove('videocontent__play-btn--active');
		pauseButton.classList.remove('videocontent__pause-btn--active');
		pauseButtonControls.classList.remove('controls__pause--active');
		playButtonControls.classList.add('controls__play--active');
		player.stopVideo();
	}

	//volume
	muteVolume = () => {
		volumeButton.addEventListener('click', () =>{
			if (player.isMuted()) {
				player.unMute();
				volumeButton.classList.remove('controls__volume--muted');
				player.setVolume(50);
				volumeInput.value = 50;
			} else 
			{
				player.mute();
				volumeButton.classList.add('controls__volume--muted');
			}
		});
	}

	setVolume = () => {
		player.setVolume(volumeInput.value);
		volumeInput.addEventListener('input', (e) => {
			player.setVolume(e.target.value);
			if(e.target.value == 0) {
				volumeButton.classList.add('controls__volume--muted');
				player.mute();
			} else {
				volumeButton.classList.remove('controls__volume--muted');
				player.unMute();
			}
		})
	}

	//duration
	setTotalTime = () => {
		totalTimeElem.innerHTML = formatDurtion(player.getDuration());
	}

	setCurrentTime = () => {
		currentTimeElem.innerHTML = formatDurtion(player.getCurrentTime());
		timeline.value = player.getCurrentTime();
	}

	formatDurtion = (time) => {
		const seconds = Math.floor(time % 60);
		const minutes = Math.floor(time / 60) % 60 ;
		if (minutes == 0 && seconds < 10) {
			return ('0:0'+`${seconds}`);
		} else if (minutes == 0) {
			return ('0:'+`${seconds}`);
		} else {
			return (`${minutes}`+':'+`${seconds}`);
		}
	}


	changeSpeed = () => {
		speedButton.addEventListener('click', changeSpeedValue);
	}

	changeSpeedValue = () => {
		if (player.getPlaybackRate() == 1) {
			player.setPlaybackRate(2);
			speedButton.innerHTML = "2x";
		} else {
			player.setPlaybackRate(1);
			speedButton.innerHTML = "1x";
		}
	}


	//timeline
	setTimelineParams = () => {
		timeline.setAttribute('min', 0);
		timeline.setAttribute('max', player.getDuration());
	}

	changeTime = () => {
		timeline.addEventListener('input', (e) => {
			player.seekTo(e.target.value);
			togglePlay();
		});
	}
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzY3JpcHRzL21hcC5qcyIsInNjcmlwdHMvc2Nyb2xsLmpzIiwic2NyaXB0cy9zbGlkZXIuanMiLCJzY3JpcHRzL3ZpZGVvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1DdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGk7XHJcblxyXG4vLyBoYW1idXJnZXIgbWVudSBoZWFkZXItLWZ1bGxzY3JlZW5cclxuXHJcbmNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKTtcclxuY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuY29uc3QgaGFtYnVyZ2VyTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXItbWVudScpO1xyXG5cclxuaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRjb25zdCBoYW1idXJnZXIgPSBlLnRhcmdldC5jbG9zZXN0KCcuaGFtYnVyZ2VyLW1lbnUnKTtcclxuXHRpZiAoaGFtYnVyZ2VyTWVudS5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbWJ1cmdlci1tZW51LS11blRvZ2dsZWQnKSkge1xyXG5cdFx0aGFtYnVyZ2VyTWVudS5jbGFzc0xpc3QucmVtb3ZlKCdoYW1idXJnZXItbWVudS0tdW5Ub2dnbGVkJyk7XHJcblx0XHRoYW1idXJnZXJNZW51LmNsYXNzTGlzdC5hZGQoJ2hhbWJ1cmdlci1tZW51LS10b2dnbGVkJyk7XHJcblx0fSBlbHNlIGlmIChoYW1idXJnZXJNZW51LmNsYXNzTGlzdC5jb250YWlucygnaGFtYnVyZ2VyLW1lbnUtLXRvZ2dsZWQnKSAmJiBlLnRhcmdldC5jbG9zZXN0KCcubmF2X19pdGVtJykpIHtcclxuXHRcdGhhbWJ1cmdlck1lbnUuY2xhc3NMaXN0LmFkZCgnaGFtYnVyZ2VyLW1lbnUtLXVuVG9nZ2xlZCcpO1xyXG5cdFx0aGFtYnVyZ2VyTWVudS5jbGFzc0xpc3QucmVtb3ZlKCdoYW1idXJnZXItbWVudS0tdG9nZ2xlZCcpO1xyXG5cdH1cclxuXHRcclxuXHRpZiAoaGFtYnVyZ2VyICYmIGUudGFyZ2V0LmNsb3Nlc3QoJy5oZWFkZXItLWZ1bGxzY3JlZW4nKSkge1xyXG5cdFx0aGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlci0tZnVsbHNjcmVlbicpO1xyXG5cdFx0Ym9keS5zdHlsZS5vdmVyZmxvdyA9ICdpbmhlcml0JztcclxuXHR9XHJcblx0ZWxzZSBpZiAoaGFtYnVyZ2VyICYmIGUudGFyZ2V0LmNsb3Nlc3QoJy5oYW1idXJnZXItbWVudScpKSB7XHJcblx0XHRoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLS1mdWxsc2NyZWVuJyk7XHJcblx0XHRib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vYnVyZ2Vycy1jb21wb3NpdGlvbi1jbG9zZS1idG5cclxuY29uc3QgaG92ZXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wb3NpdGlvbl9fY2xvc2UtYnRuJyk7XHJcbmNvbnN0IGhvdmVyT3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXItY2FyZF9fY29tcG9zaXRpb24tLWl0ZW0nKTtcclxuXHJcbmhvdmVyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLWNhcmRfX2NvbXBvc2l0aW9uLS1ob3ZlcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbn0pO1xyXG5cclxuaWYgKHNjcmVlbi53aWR0aCA8IDc2OSkge1xyXG5cdGhvdmVyT3Blbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLWNhcmRfX2NvbXBvc2l0aW9uLS1ob3ZlcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vL292ZXJsYXkgcmV2aWV3c1xyXG5jb25zdCByZXZpZXdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmV2aWV3c19fYnRuJyk7XHJcbmNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jldmlld3NQb3B1cCcpLmlubmVySFRNTDtcclxuXHJcbmZvciAoaSA9IDA7IGkgPCByZXZpZXdCdXR0b24ubGVuZ3RoOyBpKyspIHtcclxuXHRyZXZpZXdCdXR0b25baV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRsZXQgcmV2aWV3c1RpdGxlID0gZS5wYXRoWzJdLnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX190aXRsZScpLmlubmVySFRNTDtcclxuXHRcdGxldCByZXZpZXdzVGV4dCA9IGUucGF0aFsyXS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fdGV4dCcpLmlubmVySFRNTDtcclxuXHRcdGxldCBzdWNjZXNzT3ZlcmxheSA9IGNyZWF0ZU92ZXJsYXkocmV2aWV3c1RpdGxlLCByZXZpZXdzVGV4dCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJldmlld3NcIikuYXBwZW5kKHN1Y2Nlc3NPdmVybGF5KTtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlT3ZlcmxheSh0aXRsZSwgdGV4dCkge1xyXG5cdGNvbnN0IG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRuZXdFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ292ZXJsYXknKTtcclxuXHRuZXdFbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlO1xyXG5cclxuXHRjb25zdCBjbG9zZU92ZXJsYXkgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5X19jbG9zZS1idG4nKTtcclxuXHJcblx0bmV3RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQgPT09IG5ld0VsZW1lbnQpIHtcclxuXHRcdFx0Y2xvc2VPdmVybGF5LmNsaWNrKCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Y2xvc2VPdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzJykucmVtb3ZlQ2hpbGQobmV3RWxlbWVudCk7XHJcblx0fSlcclxuXHJcblx0bmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fb3ZlcmxheS0tdGl0bGUnKS5pbm5lckhUTUwgPSB0aXRsZTtcclxuXHRuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX19vdmVybGF5LS10ZXh0JykuaW5uZXJIVE1MID0gdGV4dDtcclxuXHJcblx0cmV0dXJuIG5ld0VsZW1lbnQ7XHJcbn1cclxuXHJcbi8vYWNjb3JkZW9uXHJcblxyXG5jb25zdCBpdGVtVmVydEFjY29yZGVvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKTtcclxuZm9yIChpID0gMDsgaSA8IGl0ZW1WZXJ0QWNjb3JkZW9uLmxlbmd0aDsgaSsrKSB7XHJcblx0aXRlbVZlcnRBY2NvcmRlb25baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKS5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsLWFjY29yZGVvbl9faXRlbS0tYWN0aXZlJykpIHtcclxuXHRcdFx0ZS50YXJnZXQuY2xvc2VzdCgnLnZlcnRpY2FsLWFjY29yZGVvbl9faXRlbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsLWFjY29yZGVvbl9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGl0ZW1WZXJ0QWNjb3JkZW9uLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0aXRlbVZlcnRBY2NvcmRlb25bal0uY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcudmVydGljYWwtYWNjb3JkZW9uX19pdGVtJykuY2xhc3NMaXN0LmFkZCgndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuLy90ZWFtLWFjY29yZGVvblxyXG5jb25zdCBpdGVtVGVhbUFjY29yZGVvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGFmZl9faXRlbScpO1xyXG5mb3IgKGkgPSAwOyBpIDwgaXRlbVRlYW1BY2NvcmRlb24ubGVuZ3RoOyBpKyspIHtcclxuXHRpdGVtVGVhbUFjY29yZGVvbltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQuY2xvc2VzdCgnLnN0YWZmX19pdGVtJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdGFmZl9fYWN0aXZlJykpIHtcclxuXHRcdFx0ZS50YXJnZXQuY2xvc2VzdCgnLnN0YWZmX19pdGVtJykuY2xhc3NMaXN0LnJlbW92ZSgnc3RhZmZfX2FjdGl2ZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBpdGVtVGVhbUFjY29yZGVvbi5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGl0ZW1UZWFtQWNjb3JkZW9uW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWZmX19hY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcuc3RhZmZfX2l0ZW0nKS5jbGFzc0xpc3QuYWRkKCdzdGFmZl9fYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG4vL2Zvcm0gcG9wdXAg0LLRi9GC0LDRgdC60LjQstCw0LXQvCDRiNCw0LHQu9C+0L0g0L/QvtC/0LDQv9CwINC4INC30LDQutC40LTRi9Cy0LDQtdC8INCyINGE0L7RgNC80YNcclxuY29uc3QgdGVtcGxhdGVGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Zvcm1Qb3B1cCcpLmlubmVySFRNTDtcclxuY29uc3Qgc2VuZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZW5kQnRuJyk7XHJcbmNvbnN0IHNlbmRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2VsZW0nKTtcclxuXHJcbmxldCBkYXRhRm9ybTtcclxubGV0IHRleHRGb3JtUG9wdXA7XHJcbmxldCB0ZXh0Rm9ybVBvcHVwRXJyb3IgPSAn0JLRiyDQvdC1INCy0LLQtdC70LguLi4gJztcclxuXHJcbnNlbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZvcm0oc2VuZEZvcm0pKSB7XHJcblx0XHRjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0Rm9ybVBvcHVwKTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSAnJztcclxuXHR9IGVsc2Uge1xyXG5cdFx0bGV0IGZvcm1EYXRhID0gY3JlYXRlRGF0YSgpO1xyXG5cdFx0Y29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR4aHIub3BlbignUE9TVCcsICdodHRwczovL3dlYmRldi1hcGkubG9mdHNjaG9vbC5jb20vc2VuZG1haWwnKVxyXG5cdFx0eGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcclxuXHRcdHhoci5zZW5kKGZvcm1EYXRhKTtcclxuXHRcdHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoeGhyLnJlc3BvbnNlLnN0YXR1cyA9PT0gMSkge1xyXG5cdFx0XHRcdHRleHRGb3JtUG9wdXAgPSB4aHIucmVzcG9uc2UubWVzc2FnZTtcclxuXHRcdFx0XHRjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0Rm9ybVBvcHVwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZXh0Rm9ybVBvcHVwID0geGhyLnJlc3BvbnNlLm1lc3NhZ2U7XHJcblx0XHRcdFx0Y3JlYXRlRm9ybU92ZXJsYXkodGV4dEZvcm1Qb3B1cCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9ICcnO1xyXG5cdH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0KSB7XHJcblx0Y29uc3QgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdG5ld0VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnb3ZlcmxheScpO1xyXG5cdG5ld0VsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVGb3JtO1xyXG5cclxuXHRjb25zdCBjbG9zZU92ZXJsYXkgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tLW92ZXJsYXknKTtcclxuXHJcblx0bmV3RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQgPT09IG5ld0VsZW1lbnQpIHtcclxuXHRcdFx0Y2xvc2VPdmVybGF5LmNsaWNrKCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Y2xvc2VPdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcicpLnJlbW92ZUNoaWxkKG5ld0VsZW1lbnQpO1xyXG5cdH0pXHJcblxyXG5cdG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld3NfX292ZXJsYXktLXRleHQnKS5pbm5lckhUTUwgPSB0ZXh0O1xyXG5cclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm9yZGVyXCIpLmFwcGVuZChuZXdFbGVtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVGb3JtKGZvcm0pIHtcclxuXHRsZXQgdmFsaWQgPSB0cnVlO1xyXG5cclxuXHRpZiAoIXZhbGlkYXRlRmllbGQoZm9ybS5lbGVtZW50cy5jb21tZW50KSkge1xyXG5cdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSB0ZXh0Rm9ybVBvcHVwRXJyb3IgKyBcItCa0L7QvNC80LXQvdGC0LDRgNC40LkhXCI7XHJcblx0fVxyXG5cclxuXHRpZiAoIXZhbGlkYXRlRmllbGQoZm9ybS5lbGVtZW50cy5waG9uZSkpIHtcclxuXHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gdGV4dEZvcm1Qb3B1cEVycm9yICsgXCLQotC10LvQtdGE0L7QvSFcIjtcclxuXHR9XHJcblxyXG5cdGlmICghdmFsaWRhdGVGaWVsZChmb3JtLmVsZW1lbnRzLm5hbWUpKSB7XHJcblx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9IHRleHRGb3JtUG9wdXBFcnJvciArIFwi0JjQvNGPIVwiO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZhbGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZUZpZWxkKGZpZWxkKSB7XHJcblx0cmV0dXJuIGZpZWxkLmNoZWNrVmFsaWRpdHkoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0YSgpIHtcclxuXHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoc2VuZEZvcm0pO1xyXG5cclxuXHRmb3JtRGF0YS5hcHBlbmQoXCJuYW1lXCIsIHNlbmRGb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUpO1xyXG5cdGZvcm1EYXRhLmFwcGVuZChcInBob25lXCIsIHNlbmRGb3JtLmVsZW1lbnRzLnBob25lLnZhbHVlKTtcclxuXHRmb3JtRGF0YS5hcHBlbmQoXCJjb21tZW50XCIsIHNlbmRGb3JtLmVsZW1lbnRzLmNvbW1lbnQudmFsdWUpO1xyXG5cdGZvcm1EYXRhLmFwcGVuZChcInRvXCIsIFwidmFzeUBsaXkuY29tXCIpO1xyXG5cclxuXHRyZXR1cm4gZm9ybURhdGE7XHJcblx0Ly8g0L/QvtGH0LXQvNGDINC90LUg0YHRgNCw0LHQvtGC0LDQuyBzdHJpbmdpZnk/XHJcblx0Ly8gZGF0YUZvcm0gPSB7XHJcblx0Ly8gXHRcIm5hbWVcIjogc2VuZEZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSxcclxuXHQvLyBcdFwicGhvbmVcIjogc2VuZEZvcm0uZWxlbWVudHMucGhvbmUudmFsdWUsXHJcblx0Ly8gXHRcImNvbW1lbnRcIjogXCJ2YXN5QGxpeS5jb21cIixcclxuXHQvLyBcdFwidG9cIjogXCJ2YXN5QGxpeS5jb21cIlxyXG5cdC8vIH1cclxuXHQvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YUZvcm0pO1xyXG59IiwiOyhmdW5jdGlvbigpIHtcclxuXHR5bWFwcy5yZWFkeShpbml0KTtcclxuXHJcblx0dmFyIHBsYWNlbWFya3MgPSBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRcdGxhdGl0dWRlOiA1OS45NyxcclxuXHRcdFx0XHRcdGxvbmdpdHVkZTogMzAuMzEsXHJcblx0XHRcdFx0XHRoaW50Q29udGVudDogJzxkaXYgY2xhc3M9XCJtYXBfX2hpbnRcIj7Rg9C7LiDQm9C40YLQtdGA0LDRgtC+0YDQvtCyLCDQtC4gMTk8L2Rpdj4nXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRcdGxhdGl0dWRlOiA1OS45NCxcclxuXHRcdFx0XHRcdGxvbmdpdHVkZTogMzAuMjUsXHJcblx0XHRcdFx0XHRoaW50Q29udGVudDogJzxkaXYgY2xhc3M9XCJtYXBfX2hpbnRcIj7QnNCw0LvRi9C5INC/0YDQvtGB0L/QtdC60YIg0JIg0J4sINC0IDY0PC9kaXY+J1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0XHRsYXRpdHVkZTogNTkuOTMsXHJcblx0XHRcdFx0XHRsb25naXR1ZGU6IDMwLjM0LFxyXG5cdFx0XHRcdFx0aGludENvbnRlbnQ6ICc8ZGl2IGNsYXNzPVwibWFwX19oaW50XCI+0L3QsNCxLiDRgNC10LrQuCDQpNC+0L3RgtCw0L3QutC4LCDQtC4gNTY8L2Rpdj4nXHJcblx0XHRcdH1cclxuXHRdLFxyXG5cdFx0XHRnZW9PYmplY3RzPSBbXTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdFx0dmFyIG1hcCA9IG5ldyB5bWFwcy5NYXAoJ21hcCcsIHtcclxuXHRcdFx0XHRcdGNlbnRlcjogWzU5Ljk0LCAzMC4zMl0sXHJcblx0XHRcdFx0XHR6b29tOiAxMixcclxuXHRcdFx0XHRcdGNvbnRyb2xzOiBbJ3pvb21Db250cm9sJ10sXHJcblx0XHRcdFx0XHRiZWhhdmlvcnM6IFsnZHJhZyddXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwbGFjZW1hcmtzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0Z2VvT2JqZWN0c1tpXSA9IG5ldyB5bWFwcy5QbGFjZW1hcmsoW3BsYWNlbWFya3NbaV0ubGF0aXR1ZGUsIHBsYWNlbWFya3NbaV0ubG9uZ2l0dWRlXSxcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGhpbnRDb250ZW50OiBwbGFjZW1hcmtzW2ldLmhpbnRDb250ZW50XHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbkltYWdlSHJlZjogJy4vaW1nL2ljb25zL21hcC1tYXJrZXIuc3ZnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbkltYWdlU2l6ZTogWzQ2LCA1N10sXHJcblx0XHRcdFx0XHRcdFx0XHRcdGljb25JbWFnZU9mZnNldDogWy0yMywgLTU3XVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgY2x1c3RlcmVyID0gbmV3IHltYXBzLkNsdXN0ZXJlcih7XHJcblx0XHRcdFx0XHRjbHVzdGVySWNvbnM6IFtcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGhyZWY6ICcuL2ltZy9jb250ZW50LzFzdF9zY3JlZW5faGVyby9tYWluX2J1cmdlci5wbmcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiBbMTAwLCAxMDBdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRvZmZzZXQ6IFstNTAsIC01MF1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0Y2x1c3Rlckljb25Db250ZW50TGF5b3V0OiBudWxsXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWFwLmdlb09iamVjdHMuYWRkKGNsdXN0ZXJlcik7XHJcblx0XHRcdGNsdXN0ZXJlci5hZGQoZ2VvT2JqZWN0cyk7XHJcblx0fVxyXG5cclxufSkoKTsiLCI7KGZ1bmN0aW9uKCkge1xyXG5cclxuXHRjb25zdCBzZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJyk7XHJcblx0Y29uc3QgbWVudUl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZpeGVkLW1lbnVfX2l0ZW0nKTtcclxuXHRjb25zdCBkaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW5jb250ZW50Jyk7XHJcblx0bGV0IGluc2Nyb2xsID0gZmFsc2U7XHJcblx0bGV0ICBkYXRhU2Nyb2xsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLXNjcm9sbC10b11cIik7XHJcblxyXG5cclxuXHQvL9C60L7QtCDRhNGD0L3QutGG0LjQuCDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0L/QtdGA0LXQv9C40YHQsNC9INC90LAgMyDQvtGC0LTQtdC70YzQvdGL0LUg0YTRg9C90LrRhtC40LgsINC90L4g0LzQvdC1INC/0L7QutCwINGC0LDQuiDQv9C+0L3Rj9GC0L3QtdC1XHJcblx0Y29uc3QgcGVyZm9ybVRyYW5zaXRpb24gPSBzZWN0aW9uSW5kZXggPT4ge1xyXG5cdFx0aWYgKGluc2Nyb2xsID09IGZhbHNlKSB7IC8vIGlmIChpbnNjcm9sbCkgcmV0dXJuOyBcclxuXHRcdFx0aW5zY3JvbGwgPSB0cnVlO1xyXG5cdFx0XHRsZXQgcG9zaXRpb24gPSBgJHtzZWN0aW9uSW5kZXggKiAoLTEwMCl9JWA7XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KGNsb3NlTW9kYWxCdXJnZXIsIDUwMCk7IC8vINC30LDQutGA0YvRgtGMINCz0LDQvNCx0YPRgNCz0LXRgC3QvNC10L3RjiDRh9C10YDQtdC3IDAuNSDRgdC10LrRg9C90LQgXHJcblx0XHRcdHNldFRpbWVvdXQoY2xvc2VNb2RhbE92ZXJsYXksIDUwMCk7IC8vINC30LDQutGA0YvRgtGMINC+0LLQtdGA0LvQtdC5INC+0YLQt9GL0LLQsCDRh9C10YDQtdC3IDAuNSDRgdC10LrRg9C90LQgXHJcblx0XHRcdHNlY3Rpb25zW3NlY3Rpb25JbmRleF0uY2xhc3NMaXN0LmFkZCgnc2VjdGlvbi0tYWN0aXZlJyk7XHJcblx0XHRcdG1lbnVJdGVtc1tzZWN0aW9uSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2ZpeGVkLW1lbnVfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHRsZXQgc2libGluZ3MgPSBnZXRTaWJsaW5ncyhzZWN0aW9uc1tzZWN0aW9uSW5kZXhdKTtcclxuXHRcdFx0Zm9yIChsZXQgc2libGluZyBpbiBzaWJsaW5ncykge1xyXG5cdFx0XHRcdGlmIChzaWJsaW5nc1tzaWJsaW5nXS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlY3Rpb24tLWFjdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRzaWJsaW5nc1tzaWJsaW5nXS5jbGFzc0xpc3QucmVtb3ZlKCdzZWN0aW9uLS1hY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0c2libGluZ3MgPSBnZXRTaWJsaW5ncyhtZW51SXRlbXNbc2VjdGlvbkluZGV4XSk7XHJcblx0XHRcdGZvciAobGV0IHNpYmxpbmcgaW4gc2libGluZ3MpIHtcclxuXHRcdFx0XHRpZiAoc2libGluZ3Nbc2libGluZ10uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXhlZC1tZW51X19pdGVtLS1hY3RpdmUnKSkge1xyXG5cdFx0XHRcdFx0c2libGluZ3Nbc2libGluZ10uY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQtbWVudV9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRkaXNwbGF5LnN0eWxlLmNzc1RleHQgPSBgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKCR7cG9zaXRpb259KTtgO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRpbnNjcm9sbCA9IGZhbHNlO1xyXG5cdFx0XHR9LCAyMDAgKyAzMDApOyAvLyDQstGA0LXQvNGPIHRyYW5zaXRpb24gKyDQstGA0LXQvNGPINC40L3QtdGA0YbQuNC4INC90LAg0YLQsNGH0L/QsNC00LDRhSwg0L/QvtC00YDQvtCx0L3Ri9C5INC60L7QvNC80LXQvdGCINC+INGA0LDQsdC+0YLQtSwg0LvQuNCx0L4g0LfQsNC80LXQvdCwINC90LAg0L/QvtC90Y/RgtC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtVxyXG5cdFx0fVxyXG5cdH0gXHJcblxyXG5cdGNvbnN0IHNjcm9sbFZpZXdwb3J0ID0gZGlyZWN0aW9uID0+IHtcclxuXHRcdFxyXG5cdFx0bGV0IGFjdGl2ZVNlY3Rpb24gPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzZWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoc2VjdGlvbnNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWN0aW9uLS1hY3RpdmUnKSkge1xyXG5cdFx0XHRcdGFjdGl2ZVNlY3Rpb24gPSBpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGNvbnN0IHByZXZTZWN0aW9uID0gYWN0aXZlU2VjdGlvbiAtIDE7XHJcblx0XHRjb25zdCBuZXh0U2VjdGlvbiA9IGFjdGl2ZVNlY3Rpb24gKyAxO1xyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICdwcmV2JyAmJiBwcmV2U2VjdGlvbiA+PSAwKSB7XHJcblx0XHRcdHBlcmZvcm1UcmFuc2l0aW9uKHByZXZTZWN0aW9uKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcgJiYgbmV4dFNlY3Rpb24gPCBzZWN0aW9ucy5sZW5ndGgpIHtcclxuXHRcdFx0cGVyZm9ybVRyYW5zaXRpb24obmV4dFNlY3Rpb24pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZSkgPT4ge1xyXG5cdFx0bGV0IGRlbHRhWSA9IGUuZGVsdGFZO1xyXG5cdFx0XHJcblx0XHRpZiAoZGVsdGFZID4gMCkge1xyXG5cdFx0XHRzY3JvbGxWaWV3cG9ydCgnbmV4dCcpXHJcblx0XHR9IFxyXG5cdFx0XHJcblx0XHRpZiAoZGVsdGFZIDwgMCkge1xyXG5cdFx0XHRzY3JvbGxWaWV3cG9ydCgncHJldicpO1xyXG5cdFx0fSBcclxuXHJcblx0fSk7XHJcblxyXG5cclxuXHRmdW5jdGlvbiBnZXRTaWJsaW5ncyhlbGVtKSB7XHJcbiAgICBsZXQgc2libGluZ3MgPSBbXTtcclxuICAgIGxldCBzaWJsaW5nID0gZWxlbTtcclxuICAgIHdoaWxlIChzaWJsaW5nLnByZXZpb3VzU2libGluZykge1xyXG4gICAgICAgIHNpYmxpbmcgPSBzaWJsaW5nLnByZXZpb3VzU2libGluZztcclxuICAgICAgICBzaWJsaW5nLm5vZGVUeXBlID09IDEgJiYgc2libGluZ3MucHVzaChzaWJsaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBzaWJsaW5nID0gZWxlbTtcclxuICAgIHdoaWxlIChzaWJsaW5nLm5leHRTaWJsaW5nKSB7XHJcbiAgICAgICAgc2libGluZyA9IHNpYmxpbmcubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgc2libGluZy5ub2RlVHlwZSA9PSAxICYmIHNpYmxpbmdzLnB1c2goc2libGluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNpYmxpbmdzO1xyXG5cdH1cclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcblxyXG5cdFx0c3dpdGNoKGUua2V5Q29kZSkge1xyXG5cdFx0XHRjYXNlIDM4IDogXHJcblx0XHRcdFx0c2Nyb2xsVmlld3BvcnQoJ3ByZXYnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSA0MCA6XHJcblx0XHRcdFx0c2Nyb2xsVmlld3BvcnQoJ25leHQnKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG5cdGZvciAobGV0IGk9MDsgaSA8IGRhdGFTY3JvbGwubGVuZ3RoOyBpKyspIHtcclxuXHRcdGRhdGFTY3JvbGxbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGxldCB0YXJnZXQgPSBwYXJzZUludChlLnRhcmdldC5kYXRhc2V0LnNjcm9sbFRvKTtcclxuXHRcdFx0cGVyZm9ybVRyYW5zaXRpb24odGFyZ2V0KTtcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcblx0Ly9tb2JpbGVcclxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZSA9PiB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSwge3Bhc3NpdmU6IGZhbHNlfSlcclxuXHJcblx0bGV0IGV2ZW50O1xyXG5cdGxldCBtb2JpbGVEaXJlY3Rpb247XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGUgPT4ge1xyXG5cdFx0ZXZlbnQgPSBlO1xyXG5cdH0pXHJcblxyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGUgPT4ge1xyXG5cdFx0aWYgKGV2ZW50KSB7XHJcblx0XHRcdG1vYmlsZURpcmVjdGlvbiA9IGUudG91Y2hlc1swXS5wYWdlWSAtIGV2ZW50LnRvdWNoZXNbMF0ucGFnZVk7XHJcblx0XHRcdGlmIChtb2JpbGVEaXJlY3Rpb24gPiAwKSB7XHJcblx0XHRcdFx0c2Nyb2xsVmlld3BvcnQoJ3ByZXYnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAobW9iaWxlRGlyZWN0aW9uIDwgMCkge1xyXG5cdFx0XHRcdHNjcm9sbFZpZXdwb3J0KCduZXh0Jyk7XHJcblx0XHRcdH1cclxuXHR9XHJcblx0fSlcclxuXHRcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlZFwiLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZXZlbnQgPSBudWxsO1xyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiBjbG9zZU1vZGFsQnVyZ2VyKCkge1xyXG5cdFx0Ly/Qt9Cw0LrRgNGL0YLQuNC1INCx0YPRgNCz0LXRgNCwXHJcblx0XHRpZiAoaGFtYnVyZ2VyTWVudS5jbGFzc0xpc3QuY29udGFpbnMoJ2hhbWJ1cmdlci1tZW51LS11blRvZ2dsZWQnKSAmJiBoZWFkZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoZWFkZXItLWZ1bGxzY3JlZW4nKSkge1xyXG5cdFx0XHRoYW1idXJnZXJNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2hhbWJ1cmdlci1tZW51LS11blRvZ2dsZWQnKTtcclxuXHRcdFx0aGFtYnVyZ2VyTWVudS5jbGFzc0xpc3QuYWRkKCdoYW1idXJnZXItbWVudS0tdG9nZ2xlZCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aGFtYnVyZ2VyTWVudS5jbGFzc0xpc3QuYWRkKCdoYW1idXJnZXItbWVudS0tdW5Ub2dnbGVkJyk7XHJcblx0XHRcdGhhbWJ1cmdlck1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnaGFtYnVyZ2VyLW1lbnUtLXRvZ2dsZWQnKTtcclxuXHRcdH1cclxuXHRcdGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkZXItLWZ1bGxzY3JlZW4nKTtcclxuXHRcdGJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaW5oZXJpdCc7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbG9zZU1vZGFsT3ZlcmxheSgpIHtcclxuXHRcdGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5Jykpe1xyXG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheScpLnJlbW92ZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8g0YfRgtC+LdGC0L4g0YfQuNGC0LDQuyDQviDQt9Cw0LzQtdC90LUg0YLQsNC50LzQsNGD0YLQvtCyINC90LAg0L/RgNC+0LzQuNGB0Ysg0Lgg0YHQstC+0YDQvNC40YDQvtCy0LDRgtGMINC60LvQsNGB0YHRiyDQvNC10YLQvtC00YssINC90L4g0Y8g0L3QtSDQsiDQutGD0YDRgdCw0YUg0YfRgtC+INGN0YLQvi5cclxuXHQvLyDQvtGC0LTQtdC70YzQvdGL0LUg0LTQtdC50YHRgtCy0LjRjyDQvdGD0LbQvdC+INC30LDQutC40L3Rg9GC0Ywg0LIg0L7RgtC00LXQu9GM0L3Ri9C1INGE0YPQvdC60YbQuNC4XHJcblx0XHJcbn0pKCk7IiwiOyhmdW5jdGlvbigpIHtcclxuXHJcbi8vIHNsaWRlclxyXG4vLyDQvdC1INGB0LTQtdC70LDQvdGLINCx0YPQu9C70LXRgtGLINGB0L3QuNC30YNcclxubGV0IHNsaWRlckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItY29udGFpbmVyX19saXN0Jyk7XHJcbmxldCBzbGlkZXJDYXJvdXNlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItY29udGFpbmVyX19pdGVtcycpO1xyXG5sZXQgc2xpZGVySXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXItY29udGFpbmVyX19pdGVtJyk7XHJcbmxldCBjb250ZW50V2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLWNvbnRhaW5lcl9fbGlzdCcpLmNsaWVudFdpZHRoO1xyXG5sZXQgc2xpZGVyTGVmdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXItbGVmdCcpO1xyXG5sZXQgc2xpZGVyUmlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyLXJpZ2h0Jyk7XHJcbmxldCBzbGlkZXJEb3RzTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItZG90cycpO1xyXG5sZXQgc2xpZGVyUGljdHVyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXJnZXItY2FyZF9fcGljJyk7XHJcbmxldCBhbGxEb3RzO1xyXG5cclxuY29uc3QgbWluUmlnaHQgPSAwO1xyXG5jb25zdCBtYXhSaWdodCA9IGNvbnRlbnRXaWR0aCAqIHNsaWRlckl0ZW0ubGVuZ3RoO1xyXG5jb25zdCBzdGVwID0gY29udGVudFdpZHRoO1xyXG5sZXQgY3VycmVudFJpZ2h0ID0gMDtcclxubGV0IGN1cnJlbnRTdGVwO1xyXG5cclxuZm9yIChpID0gMDsgaSA8IHNsaWRlckl0ZW0ubGVuZ3RoOyBpKyspIHtcclxuXHRzbGlkZXJJdGVtW2ldLnN0eWxlLm1pbldpZHRoID0gY29udGVudFdpZHRoICsgXCJweFwiO1xyXG59XHJcblxyXG5zbGlkZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGlmIChNYXRoLmFicyhjdXJyZW50UmlnaHQpID4gbWluUmlnaHQpIHtcclxuXHRcdGN1cnJlbnRSaWdodCArPSBzdGVwO1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtjdXJyZW50UmlnaHR9cHgpYDtcclxuXHRcdGN1cnJlbnRTdGVwID0gLShjdXJyZW50UmlnaHQvc3RlcCk7XHJcblx0XHRzd2l0Y2hBY3RpdmVDbGFzcyhjdXJyZW50U3RlcCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHNsaWRlckNhcm91c2VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke21heFJpZ2h0IC0gc3RlcH1weClgO1xyXG5cdFx0Y3VycmVudFJpZ2h0ID0gLShtYXhSaWdodCAtIHN0ZXApO1xyXG5cdFx0Y3VycmVudFN0ZXAgPSAtKGN1cnJlbnRSaWdodC9zdGVwKTtcclxuXHRcdHN3aXRjaEFjdGl2ZUNsYXNzKGN1cnJlbnRTdGVwKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuc2xpZGVyUmlnaHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0aWYgKE1hdGguYWJzKGN1cnJlbnRSaWdodCkgPCAobWF4UmlnaHQgLSBzdGVwKSkge1xyXG5cdFx0Y3VycmVudFJpZ2h0IC09IHN0ZXA7XHJcblx0XHRzbGlkZXJDYXJvdXNlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2N1cnJlbnRSaWdodH1weClgO1xyXG5cdFx0Y3VycmVudFN0ZXAgPSAtKGN1cnJlbnRSaWdodC9zdGVwKTtcclxuXHRcdHN3aXRjaEFjdGl2ZUNsYXNzKGN1cnJlbnRTdGVwKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoMHB4KWA7XHJcblx0XHRjdXJyZW50UmlnaHQgPSAwO1xyXG5cdFx0Y3VycmVudFN0ZXAgPSAtKGN1cnJlbnRSaWdodC9zdGVwKTtcclxuXHRcdHN3aXRjaEFjdGl2ZUNsYXNzKGN1cnJlbnRTdGVwKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXJJdGVtLmxlbmd0aDsgaSsrKSB7XHJcblx0c2xpZGVyRG90c0xpc3QuYXBwZW5kKGNyZWF0ZU5ld0VsZW1lbnQoaSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVOZXdFbGVtZW50KGkpIHtcclxuXHRsZXQgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcblx0ZWxlbS5jbGFzc0xpc3QuYWRkKCdzbGlkZXItZG90c19faW1nJyk7XHJcblx0bGV0IG5ld0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG5cdG5ld0ltZy5jbGFzc0xpc3QuYWRkKCdzbGlkZXItZG90c19faW1nLS1waWMnKTtcclxuXHRsZXQgc3JjID0gc2xpZGVyUGljdHVyZVtpXS5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xyXG5cdGxldCBhbHQgPSBzbGlkZXJQaWN0dXJlW2ldLmdldEF0dHJpYnV0ZSgnYWx0Jyk7XHJcblx0bmV3SW1nLnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjKTtcclxuXHRuZXdJbWcuc2V0QXR0cmlidXRlKCdhbHQnLCBhbHQpO1xyXG5cdGVsZW0uYXBwZW5kKG5ld0ltZyk7XHJcblx0cmV0dXJuIGVsZW07XHJcbn1cclxuXHJcbmFsbERvdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyLWRvdHNfX2ltZycpO1xyXG5cclxuaWYgKGFsbERvdHMubGVuZ3RoID4gMCkge1xyXG5cdGFsbERvdHNbMF0uY2xhc3NMaXN0LmFkZCgnc2xpZGVyLWRvdHNfX2ltZy0tYWN0aXZlJyk7XHJcbn1cclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgYWxsRG90cy5sZW5ndGg7IGkrKykge1xyXG5cdGFsbERvdHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRzd2l0Y2hBY3RpdmVDbGFzcyhpKTtcclxuXHRcdGRvdE1vdmVTbGlkZShpKTtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZG90TW92ZVNsaWRlKGkpIHtcclxuXHRjdXJyZW50UmlnaHQgPSBzdGVwICogKC1pKTtcclxuXHRzbGlkZXJDYXJvdXNlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2N1cnJlbnRSaWdodH1weClgO1xyXG59IFxyXG5cclxuZnVuY3Rpb24gc3dpdGNoQWN0aXZlQ2xhc3MoaSkge1xyXG5cdGFsbERvdHNbaV0uY2xhc3NMaXN0LmFkZCgnc2xpZGVyLWRvdHNfX2ltZy0tYWN0aXZlJyk7XHJcblx0bGV0IHNpYmxpbmdzID0gZ2V0U2libGluZ3MoYWxsRG90c1tpXSk7XHJcblx0Zm9yIChsZXQgc2libGluZyBpbiBzaWJsaW5ncykge1xyXG5cdFx0aWYgKHNpYmxpbmdzW3NpYmxpbmddLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVyLWRvdHNfX2ltZy0tYWN0aXZlJykpIHtcclxuXHRcdFx0c2libGluZ3Nbc2libGluZ10uY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVyLWRvdHNfX2ltZy0tYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybjtcclxufSBcclxuXHJcbmZ1bmN0aW9uIGdldFNpYmxpbmdzKGVsZW0pIHtcclxuXHRsZXQgc2libGluZ3MgPSBbXTtcclxuXHRsZXQgc2libGluZyA9IGVsZW07XHJcblx0d2hpbGUgKHNpYmxpbmcucHJldmlvdXNTaWJsaW5nKSB7XHJcblx0XHRcdHNpYmxpbmcgPSBzaWJsaW5nLnByZXZpb3VzU2libGluZztcclxuXHRcdFx0c2libGluZy5ub2RlVHlwZSA9PSAxICYmIHNpYmxpbmdzLnB1c2goc2libGluZyk7XHJcblx0fVxyXG5cclxuXHRzaWJsaW5nID0gZWxlbTtcclxuXHR3aGlsZSAoc2libGluZy5uZXh0U2libGluZykge1xyXG5cdFx0XHRzaWJsaW5nID0gc2libGluZy5uZXh0U2libGluZztcclxuXHRcdFx0c2libGluZy5ub2RlVHlwZSA9PSAxICYmIHNpYmxpbmdzLnB1c2goc2libGluZyk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gc2libGluZ3M7XHJcbn1cclxuXHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0bGV0IHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cdGxldCBwbGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvY29udGVudF9fcGxheS1idG4nKTtcclxuXHRsZXQgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9jb250ZW50X19wYXVzZS1idG4nKTtcclxuXHRsZXQgcGxheUJ1dHRvbkNvbnRyb2xzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX19wbGF5Jyk7XHJcblx0bGV0IHBhdXNlQnV0dG9uQ29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3BhdXNlJyk7XHJcblx0bGV0IGhpZGVDb250cm9scyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb2NvbnRlbnRfX2NvbnRyb2xzJyk7XHJcblx0bGV0IHZvbHVtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX192b2x1bWUtbGV2ZWwnKVxyXG5cdGxldCB2b2x1bWVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3ZvbHVtZScpO1xyXG5cdGxldCBjdXJyZW50VGltZUVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3RpbWVsaW5lLWN1cnJlbnQnKTtcclxuXHRsZXQgdG90YWxUaW1lRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdGltZWxpbmUtdG90YWwnKTtcclxuXHRsZXQgc3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3NwZWVkLWJ0bicpO1xyXG5cdGxldCB0aW1lbGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdGltZWxpbmUnKTtcclxuXHJcblx0bGV0IHBsYXllcjtcclxuXHRvbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9ICgpID0+IHtcclxuXHRcdHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoJ3ZpZGVvY29udGVudF9faWZyYW1lJywge1xyXG5cdFx0XHR2aWRlb0lkOiAnV2RjOEl1VTdmb0UnLFxyXG5cdFx0XHRldmVudHM6IHtcclxuXHRcdFx0XHRvblJlYWR5OiBvblBsYXllclJlYWR5LFxyXG5cdFx0XHRcdG9uU3RhdGVDaGFuZ2U6IG9uUGxheWVyU3RhdGVDaGFuZ2VcclxuXHRcdFx0fSxcclxuXHRcdFx0cGxheWVyVmFyczoge1xyXG5cdFx0XHRcdGNvbnRyb2xzOiAwLFxyXG5cdFx0XHRcdGRpc2FibGVrYjogMCxcclxuXHRcdFx0XHRzaG93aW5mbzogMCxcclxuXHRcdFx0XHRyZWw6IDAsXHJcblx0XHRcdFx0YXV0b3BsYXk6IDAsXHJcblx0XHRcdFx0bW9kZXN0YnJhbmRpbmc6IDAsXHJcblx0XHRcdFx0cGxheXNpbmxpbmU6IDEsXHJcblx0XHRcdFx0ZnM6IDBcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRvblBsYXllclJlYWR5ID0gKCkgPT4ge1xyXG5cdFx0cGxheVBhdXNlVmlkZW9PblBsYXllclJlYWR5KCk7XHJcblx0XHRzZXRUb3RhbFRpbWUoKTtcclxuXHRcdHNldFRpbWVsaW5lUGFyYW1zKCk7XHJcblx0fVxyXG5cclxuXHRvblBsYXllclN0YXRlQ2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0cGxheVBhdXNlVmlkZW9PblBsYXllclN0YXRlQ2hhbmdlKCk7XHJcblx0XHRzZXRWb2x1bWUoKTtcclxuXHRcdG11dGVWb2x1bWUoKTtcclxuXHRcdHNldEludGVydmFsKHNldEN1cnJlbnRUaW1lLCA1MDApO1xyXG5cdFx0Y2hhbmdlU3BlZWQoKTtcclxuXHRcdGNoYW5nZVRpbWUoKTtcclxuXHR9XHJcblxyXG5cdHBsYXlQYXVzZVZpZGVvT25QbGF5ZXJSZWFkeSA9ICgpID0+IHtcclxuXHRcdHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVQbGF5KTtcclxuXHRcdHBsYXlCdXR0b25Db250cm9scy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZVBsYXkpO1xyXG5cdH1cclxuXHJcblxyXG5cdHBsYXlQYXVzZVZpZGVvT25QbGF5ZXJTdGF0ZUNoYW5nZSA9ICgpID0+IHtcclxuXHRcdGlmIChwbGF5ZXIuZ2V0UGxheWVyU3RhdGUoKSA9PSAyKSB7XHJcblx0XHRcdHRvZ2dsZVBhdXNlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBsYXllci5nZXRQbGF5ZXJTdGF0ZSgpID09IDApIHtcclxuXHRcdFx0dG9nZ2xlU3RvcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBhdXNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHR0b2dnbGVQYXVzZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cGF1c2VCdXR0b25Db250cm9scy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0dG9nZ2xlUGF1c2UoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0XHJcblx0Ly9wbGF5IHBhdXNlXHJcblx0dG9nZ2xlUGxheSA9ICgpID0+IHtcclxuXHRcdHBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgndmlkZW9jb250ZW50X19wbGF5LWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRwYXVzZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd2aWRlb2NvbnRlbnRfX3BhdXNlLWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRwYXVzZUJ1dHRvbkNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzX19wYXVzZS0tYWN0aXZlJyk7XHJcblx0XHRwbGF5QnV0dG9uQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgnY29udHJvbHNfX3BsYXktLWFjdGl2ZScpO1xyXG5cdFx0aGlkZUNvbnRyb2xzLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fY29udHJvbHMtLXBhdXNlZCcpO1xyXG5cdFx0cGxheWVyLnBsYXlWaWRlbygpO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlUGF1c2UgPSAoKSA9PiB7XHJcblx0XHRwbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGxheS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0cGF1c2VCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9jb250ZW50X19wYXVzZS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0cGF1c2VCdXR0b25Db250cm9scy5jbGFzc0xpc3QucmVtb3ZlKCdjb250cm9sc19fcGF1c2UtLWFjdGl2ZScpO1xyXG5cdFx0cGxheUJ1dHRvbkNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzX19wbGF5LS1hY3RpdmUnKTtcclxuXHRcdGhpZGVDb250cm9scy5jbGFzc0xpc3QuYWRkKCd2aWRlb2NvbnRlbnRfX2NvbnRyb2xzLS1wYXVzZWQnKTtcclxuXHRcdHBsYXllci5wYXVzZVZpZGVvKCk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGVTdG9wID0gKCkgPT4ge1xyXG5cdFx0cGxheUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlb2NvbnRlbnRfX3BsYXktYnRuLS1hY3RpdmUnKTtcclxuXHRcdHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGF1c2UtYnRuLS1hY3RpdmUnKTtcclxuXHRcdHBhdXNlQnV0dG9uQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgnY29udHJvbHNfX3BhdXNlLS1hY3RpdmUnKTtcclxuXHRcdHBsYXlCdXR0b25Db250cm9scy5jbGFzc0xpc3QuYWRkKCdjb250cm9sc19fcGxheS0tYWN0aXZlJyk7XHJcblx0XHRwbGF5ZXIuc3RvcFZpZGVvKCk7XHJcblx0fVxyXG5cclxuXHQvL3ZvbHVtZVxyXG5cdG11dGVWb2x1bWUgPSAoKSA9PiB7XHJcblx0XHR2b2x1bWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PntcclxuXHRcdFx0aWYgKHBsYXllci5pc011dGVkKCkpIHtcclxuXHRcdFx0XHRwbGF5ZXIudW5NdXRlKCk7XHJcblx0XHRcdFx0dm9sdW1lQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbnRyb2xzX192b2x1bWUtLW11dGVkJyk7XHJcblx0XHRcdFx0cGxheWVyLnNldFZvbHVtZSg1MCk7XHJcblx0XHRcdFx0dm9sdW1lSW5wdXQudmFsdWUgPSA1MDtcclxuXHRcdFx0fSBlbHNlIFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cGxheWVyLm11dGUoKTtcclxuXHRcdFx0XHR2b2x1bWVCdXR0b24uY2xhc3NMaXN0LmFkZCgnY29udHJvbHNfX3ZvbHVtZS0tbXV0ZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZXRWb2x1bWUgPSAoKSA9PiB7XHJcblx0XHRwbGF5ZXIuc2V0Vm9sdW1lKHZvbHVtZUlucHV0LnZhbHVlKTtcclxuXHRcdHZvbHVtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuXHRcdFx0cGxheWVyLnNldFZvbHVtZShlLnRhcmdldC52YWx1ZSk7XHJcblx0XHRcdGlmKGUudGFyZ2V0LnZhbHVlID09IDApIHtcclxuXHRcdFx0XHR2b2x1bWVCdXR0b24uY2xhc3NMaXN0LmFkZCgnY29udHJvbHNfX3ZvbHVtZS0tbXV0ZWQnKTtcclxuXHRcdFx0XHRwbGF5ZXIubXV0ZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZvbHVtZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdjb250cm9sc19fdm9sdW1lLS1tdXRlZCcpO1xyXG5cdFx0XHRcdHBsYXllci51bk11dGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdC8vZHVyYXRpb25cclxuXHRzZXRUb3RhbFRpbWUgPSAoKSA9PiB7XHJcblx0XHR0b3RhbFRpbWVFbGVtLmlubmVySFRNTCA9IGZvcm1hdER1cnRpb24ocGxheWVyLmdldER1cmF0aW9uKCkpO1xyXG5cdH1cclxuXHJcblx0c2V0Q3VycmVudFRpbWUgPSAoKSA9PiB7XHJcblx0XHRjdXJyZW50VGltZUVsZW0uaW5uZXJIVE1MID0gZm9ybWF0RHVydGlvbihwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKSk7XHJcblx0XHR0aW1lbGluZS52YWx1ZSA9IHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xyXG5cdH1cclxuXHJcblx0Zm9ybWF0RHVydGlvbiA9ICh0aW1lKSA9PiB7XHJcblx0XHRjb25zdCBzZWNvbmRzID0gTWF0aC5mbG9vcih0aW1lICUgNjApO1xyXG5cdFx0Y29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvIDYwKSAlIDYwIDtcclxuXHRcdGlmIChtaW51dGVzID09IDAgJiYgc2Vjb25kcyA8IDEwKSB7XHJcblx0XHRcdHJldHVybiAoJzA6MCcrYCR7c2Vjb25kc31gKTtcclxuXHRcdH0gZWxzZSBpZiAobWludXRlcyA9PSAwKSB7XHJcblx0XHRcdHJldHVybiAoJzA6JytgJHtzZWNvbmRzfWApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIChgJHttaW51dGVzfWArJzonK2Ake3NlY29uZHN9YCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Y2hhbmdlU3BlZWQgPSAoKSA9PiB7XHJcblx0XHRzcGVlZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoYW5nZVNwZWVkVmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlU3BlZWRWYWx1ZSA9ICgpID0+IHtcclxuXHRcdGlmIChwbGF5ZXIuZ2V0UGxheWJhY2tSYXRlKCkgPT0gMSkge1xyXG5cdFx0XHRwbGF5ZXIuc2V0UGxheWJhY2tSYXRlKDIpO1xyXG5cdFx0XHRzcGVlZEJ1dHRvbi5pbm5lckhUTUwgPSBcIjJ4XCI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwbGF5ZXIuc2V0UGxheWJhY2tSYXRlKDEpO1xyXG5cdFx0XHRzcGVlZEJ1dHRvbi5pbm5lckhUTUwgPSBcIjF4XCI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly90aW1lbGluZVxyXG5cdHNldFRpbWVsaW5lUGFyYW1zID0gKCkgPT4ge1xyXG5cdFx0dGltZWxpbmUuc2V0QXR0cmlidXRlKCdtaW4nLCAwKTtcclxuXHRcdHRpbWVsaW5lLnNldEF0dHJpYnV0ZSgnbWF4JywgcGxheWVyLmdldER1cmF0aW9uKCkpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlVGltZSA9ICgpID0+IHtcclxuXHRcdHRpbWVsaW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuXHRcdFx0cGxheWVyLnNlZWtUbyhlLnRhcmdldC52YWx1ZSk7XHJcblx0XHRcdHRvZ2dsZVBsYXkoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSkoKTsiXX0=
