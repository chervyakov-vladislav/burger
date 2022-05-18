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
	// как создавать шаблон без лишнего дива?
	const newElement = document.createElement('div');
	newElement.innerHTML = template;

	const closeOverlay = newElement.querySelector('.overlay__close-btn');
	const closeOverlayBg = newElement.querySelector('.overlay');

	closeOverlayBg.addEventListener('click', function (e) {
		if (e.target === closeOverlayBg) {
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
	newElement.innerHTML = templateForm;

	const closeOverlay = newElement.querySelector('.btn--overlay');
	const closeOverlayBg = newElement.querySelector('.overlay');

	closeOverlayBg.addEventListener('click', function (e) {
		if (e.target === closeOverlayBg) {
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
									iconImageHref: './../img/icons/map-marker.svg',
									iconImageSize: [46, 57],
									iconImageOffset: [-23, -57]
							});
			}

			var clusterer = new ymaps.Clusterer({
					clusterIcons: [
							{
									href: './../img/content/1st_screen_hero/main_burger.png',
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

			setTimeout(closeModal, 500); // закрыть гамбургер-меню через 0.5 секунд 
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

	function closeModal() {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzY3JpcHRzL21hcC5qcyIsInNjcmlwdHMvc2Nyb2xsLmpzIiwic2NyaXB0cy9zbGlkZXIuanMiLCJzY3JpcHRzL3ZpZGVvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQ3BOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1DMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1DNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaTtcclxuXHJcbi8vIGhhbWJ1cmdlciBtZW51IGhlYWRlci0tZnVsbHNjcmVlblxyXG5cclxuY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpO1xyXG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5jb25zdCBoYW1idXJnZXJNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhhbWJ1cmdlci1tZW51Jyk7XHJcblxyXG5oZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdGNvbnN0IGhhbWJ1cmdlciA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5oYW1idXJnZXItbWVudScpO1xyXG5cdGlmIChoYW1idXJnZXJNZW51LmNsYXNzTGlzdC5jb250YWlucygnaGFtYnVyZ2VyLW1lbnUtLXVuVG9nZ2xlZCcpKSB7XHJcblx0XHRoYW1idXJnZXJNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2hhbWJ1cmdlci1tZW51LS11blRvZ2dsZWQnKTtcclxuXHRcdGhhbWJ1cmdlck1lbnUuY2xhc3NMaXN0LmFkZCgnaGFtYnVyZ2VyLW1lbnUtLXRvZ2dsZWQnKTtcclxuXHR9IGVsc2UgaWYgKGhhbWJ1cmdlck1lbnUuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW1idXJnZXItbWVudS0tdG9nZ2xlZCcpICYmIGUudGFyZ2V0LmNsb3Nlc3QoJy5uYXZfX2l0ZW0nKSkge1xyXG5cdFx0aGFtYnVyZ2VyTWVudS5jbGFzc0xpc3QuYWRkKCdoYW1idXJnZXItbWVudS0tdW5Ub2dnbGVkJyk7XHJcblx0XHRoYW1idXJnZXJNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2hhbWJ1cmdlci1tZW51LS10b2dnbGVkJyk7XHJcblx0fVxyXG5cdFxyXG5cdGlmIChoYW1idXJnZXIgJiYgZS50YXJnZXQuY2xvc2VzdCgnLmhlYWRlci0tZnVsbHNjcmVlbicpKSB7XHJcblx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyLS1mdWxsc2NyZWVuJyk7XHJcblx0XHRib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2luaGVyaXQnO1xyXG5cdH1cclxuXHRlbHNlIGlmIChoYW1idXJnZXIgJiYgZS50YXJnZXQuY2xvc2VzdCgnLmhhbWJ1cmdlci1tZW51JykpIHtcclxuXHRcdGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLWZ1bGxzY3JlZW4nKTtcclxuXHRcdGJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHR9XHJcbn0pO1xyXG5cclxuLy9idXJnZXJzLWNvbXBvc2l0aW9uLWNsb3NlLWJ0blxyXG5jb25zdCBob3ZlckNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXBvc2l0aW9uX19jbG9zZS1idG4nKTtcclxuY29uc3QgaG92ZXJPcGVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1cmdlci1jYXJkX19jb21wb3NpdGlvbi0taXRlbScpO1xyXG5cclxuaG92ZXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXItY2FyZF9fY29tcG9zaXRpb24tLWhvdmVyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufSk7XHJcblxyXG5pZiAoc2NyZWVuLndpZHRoIDwgNzY5KSB7XHJcblx0aG92ZXJPcGVuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXItY2FyZF9fY29tcG9zaXRpb24tLWhvdmVyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vb3ZlcmxheSByZXZpZXdzXHJcbmNvbnN0IHJldmlld0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXZpZXdzX19idG4nKTtcclxuY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmV2aWV3c1BvcHVwJykuaW5uZXJIVE1MO1xyXG5cclxuZm9yIChpID0gMDsgaSA8IHJldmlld0J1dHRvbi5sZW5ndGg7IGkrKykge1xyXG5cdHJldmlld0J1dHRvbltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCByZXZpZXdzVGl0bGUgPSBlLnBhdGhbMl0ucXVlcnlTZWxlY3RvcignLnJldmlld3NfX3RpdGxlJykuaW5uZXJIVE1MO1xyXG5cdFx0bGV0IHJldmlld3NUZXh0ID0gZS5wYXRoWzJdLnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX190ZXh0JykuaW5uZXJIVE1MO1xyXG5cdFx0bGV0IHN1Y2Nlc3NPdmVybGF5ID0gY3JlYXRlT3ZlcmxheShyZXZpZXdzVGl0bGUsIHJldmlld3NUZXh0KTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmV2aWV3c1wiKS5hcHBlbmQoc3VjY2Vzc092ZXJsYXkpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVPdmVybGF5KHRpdGxlLCB0ZXh0KSB7XHJcblx0Ly8g0LrQsNC6INGB0L7Qt9C00LDQstCw0YLRjCDRiNCw0LHQu9C+0L0g0LHQtdC3INC70LjRiNC90LXQs9C+INC00LjQstCwP1xyXG5cdGNvbnN0IG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRuZXdFbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlO1xyXG5cclxuXHRjb25zdCBjbG9zZU92ZXJsYXkgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5X19jbG9zZS1idG4nKTtcclxuXHRjb25zdCBjbG9zZU92ZXJsYXlCZyA9IG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuXHJcblx0Y2xvc2VPdmVybGF5QmcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUudGFyZ2V0ID09PSBjbG9zZU92ZXJsYXlCZykge1xyXG5cdFx0XHRjbG9zZU92ZXJsYXkuY2xpY2soKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRjbG9zZU92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld3MnKS5yZW1vdmVDaGlsZChuZXdFbGVtZW50KTtcclxuXHR9KVxyXG5cclxuXHRuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX19vdmVybGF5LS10aXRsZScpLmlubmVySFRNTCA9IHRpdGxlO1xyXG5cdG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld3NfX292ZXJsYXktLXRleHQnKS5pbm5lckhUTUwgPSB0ZXh0O1xyXG5cclxuXHRyZXR1cm4gbmV3RWxlbWVudDtcclxufVxyXG5cclxuLy9hY2NvcmRlb25cclxuXHJcbmNvbnN0IGl0ZW1WZXJ0QWNjb3JkZW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnZlcnRpY2FsLWFjY29yZGVvbl9faXRlbScpO1xyXG5mb3IgKGkgPSAwOyBpIDwgaXRlbVZlcnRBY2NvcmRlb24ubGVuZ3RoOyBpKyspIHtcclxuXHRpdGVtVmVydEFjY29yZGVvbltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRpZiAoZS50YXJnZXQuY2xvc2VzdCgnLnZlcnRpY2FsLWFjY29yZGVvbl9faXRlbScpLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKSkge1xyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcudmVydGljYWwtYWNjb3JkZW9uX19pdGVtJykuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgaXRlbVZlcnRBY2NvcmRlb24ubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRpdGVtVmVydEFjY29yZGVvbltqXS5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGUudGFyZ2V0LmNsb3Nlc3QoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKS5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG4vL3RlYW0tYWNjb3JkZW9uXHJcbmNvbnN0IGl0ZW1UZWFtQWNjb3JkZW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN0YWZmX19pdGVtJyk7XHJcbmZvciAoaSA9IDA7IGkgPCBpdGVtVGVhbUFjY29yZGVvbi5sZW5ndGg7IGkrKykge1xyXG5cdGl0ZW1UZWFtQWNjb3JkZW9uW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLnRhcmdldC5jbG9zZXN0KCcuc3RhZmZfX2l0ZW0nKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N0YWZmX19hY3RpdmUnKSkge1xyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcuc3RhZmZfX2l0ZW0nKS5jbGFzc0xpc3QucmVtb3ZlKCdzdGFmZl9fYWN0aXZlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGl0ZW1UZWFtQWNjb3JkZW9uLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0aXRlbVRlYW1BY2NvcmRlb25bal0uY2xhc3NMaXN0LnJlbW92ZSgnc3RhZmZfX2FjdGl2ZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGUudGFyZ2V0LmNsb3Nlc3QoJy5zdGFmZl9faXRlbScpLmNsYXNzTGlzdC5hZGQoJ3N0YWZmX19hY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuXHJcbi8vZm9ybSBwb3B1cCDQstGL0YLQsNGB0LrQuNCy0LDQtdC8INGI0LDQsdC70L7QvSDQv9C+0L/QsNC/0LAg0Lgg0LfQsNC60LjQtNGL0LLQsNC10Lwg0LIg0YTQvtGA0LzRg1xyXG5jb25zdCB0ZW1wbGF0ZUZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZm9ybVBvcHVwJykuaW5uZXJIVE1MO1xyXG5jb25zdCBzZW5kQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NlbmRCdG4nKTtcclxuY29uc3Qgc2VuZEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fZWxlbScpO1xyXG5cclxubGV0IGRhdGFGb3JtO1xyXG5sZXQgdGV4dEZvcm1Qb3B1cDtcclxubGV0IHRleHRGb3JtUG9wdXBFcnJvciA9ICfQktGLINC90LUg0LLQstC10LvQuC4uLiAnO1xyXG5cclxuc2VuZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRpZiAoIXZhbGlkYXRlRm9ybShzZW5kRm9ybSkpIHtcclxuXHRcdGNyZWF0ZUZvcm1PdmVybGF5KHRleHRGb3JtUG9wdXApO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9ICcnO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRsZXQgZm9ybURhdGEgPSBjcmVhdGVEYXRhKCk7XHJcblx0XHRjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdHhoci5vcGVuKCdQT1NUJywgJ2h0dHBzOi8vd2ViZGV2LWFwaS5sb2Z0c2Nob29sLmNvbS9zZW5kbWFpbCcpXHJcblx0XHR4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xyXG5cdFx0eGhyLnNlbmQoZm9ybURhdGEpO1xyXG5cdFx0eGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh4aHIucmVzcG9uc2Uuc3RhdHVzID09PSAxKSB7XHJcblx0XHRcdFx0dGV4dEZvcm1Qb3B1cCA9IHhoci5yZXNwb25zZS5tZXNzYWdlO1xyXG5cdFx0XHRcdGNyZWF0ZUZvcm1PdmVybGF5KHRleHRGb3JtUG9wdXApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRleHRGb3JtUG9wdXAgPSB4aHIucmVzcG9uc2UubWVzc2FnZTtcclxuXHRcdFx0XHRjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0Rm9ybVBvcHVwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gJyc7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1PdmVybGF5KHRleHQpIHtcclxuXHRjb25zdCBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0bmV3RWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZUZvcm07XHJcblxyXG5cdGNvbnN0IGNsb3NlT3ZlcmxheSA9IG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi0tb3ZlcmxheScpO1xyXG5cdGNvbnN0IGNsb3NlT3ZlcmxheUJnID0gbmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheScpO1xyXG5cclxuXHRjbG9zZU92ZXJsYXlCZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQgPT09IGNsb3NlT3ZlcmxheUJnKSB7XHJcblx0XHRcdGNsb3NlT3ZlcmxheS5jbGljaygpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdGNsb3NlT3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3JkZXInKS5yZW1vdmVDaGlsZChuZXdFbGVtZW50KTtcclxuXHR9KVxyXG5cclxuXHRuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX19vdmVybGF5LS10ZXh0JykuaW5uZXJIVE1MID0gdGV4dDtcclxuXHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vcmRlclwiKS5hcHBlbmQobmV3RWxlbWVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlRm9ybShmb3JtKSB7XHJcblx0bGV0IHZhbGlkID0gdHJ1ZTtcclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMuY29tbWVudCkpIHtcclxuXHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gdGV4dEZvcm1Qb3B1cEVycm9yICsgXCLQmtC+0LzQvNC10L3RgtCw0YDQuNC5IVwiO1xyXG5cdH1cclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMucGhvbmUpKSB7XHJcblx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9IHRleHRGb3JtUG9wdXBFcnJvciArIFwi0KLQtdC70LXRhNC+0L0hXCI7XHJcblx0fVxyXG5cclxuXHRpZiAoIXZhbGlkYXRlRmllbGQoZm9ybS5lbGVtZW50cy5uYW1lKSkge1xyXG5cdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSB0ZXh0Rm9ybVBvcHVwRXJyb3IgKyBcItCY0LzRjyFcIjtcclxuXHR9XHJcblxyXG5cdHJldHVybiB2YWxpZDtcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVGaWVsZChmaWVsZCkge1xyXG5cdHJldHVybiBmaWVsZC5jaGVja1ZhbGlkaXR5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZURhdGEoKSB7XHJcblx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKHNlbmRGb3JtKTtcclxuXHJcblx0Zm9ybURhdGEuYXBwZW5kKFwibmFtZVwiLCBzZW5kRm9ybS5lbGVtZW50cy5uYW1lLnZhbHVlKTtcclxuXHRmb3JtRGF0YS5hcHBlbmQoXCJwaG9uZVwiLCBzZW5kRm9ybS5lbGVtZW50cy5waG9uZS52YWx1ZSk7XHJcblx0Zm9ybURhdGEuYXBwZW5kKFwiY29tbWVudFwiLCBzZW5kRm9ybS5lbGVtZW50cy5jb21tZW50LnZhbHVlKTtcclxuXHRmb3JtRGF0YS5hcHBlbmQoXCJ0b1wiLCBcInZhc3lAbGl5LmNvbVwiKTtcclxuXHJcblx0cmV0dXJuIGZvcm1EYXRhO1xyXG5cdC8vINC/0L7Rh9C10LzRgyDQvdC1INGB0YDQsNCx0L7RgtCw0Lsgc3RyaW5naWZ5P1xyXG5cdC8vIGRhdGFGb3JtID0ge1xyXG5cdC8vIFx0XCJuYW1lXCI6IHNlbmRGb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUsXHJcblx0Ly8gXHRcInBob25lXCI6IHNlbmRGb3JtLmVsZW1lbnRzLnBob25lLnZhbHVlLFxyXG5cdC8vIFx0XCJjb21tZW50XCI6IFwidmFzeUBsaXkuY29tXCIsXHJcblx0Ly8gXHRcInRvXCI6IFwidmFzeUBsaXkuY29tXCJcclxuXHQvLyB9XHJcblx0Ly8gcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGFGb3JtKTtcclxufSIsIjsoZnVuY3Rpb24oKSB7XHJcblx0eW1hcHMucmVhZHkoaW5pdCk7XHJcblxyXG5cdHZhciBwbGFjZW1hcmtzID0gW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0XHRsYXRpdHVkZTogNTkuOTcsXHJcblx0XHRcdFx0XHRsb25naXR1ZGU6IDMwLjMxLFxyXG5cdFx0XHRcdFx0aGludENvbnRlbnQ6ICc8ZGl2IGNsYXNzPVwibWFwX19oaW50XCI+0YPQuy4g0JvQuNGC0LXRgNCw0YLQvtGA0L7Qsiwg0LQuIDE5PC9kaXY+J1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0XHRsYXRpdHVkZTogNTkuOTQsXHJcblx0XHRcdFx0XHRsb25naXR1ZGU6IDMwLjI1LFxyXG5cdFx0XHRcdFx0aGludENvbnRlbnQ6ICc8ZGl2IGNsYXNzPVwibWFwX19oaW50XCI+0JzQsNC70YvQuSDQv9GA0L7RgdC/0LXQutGCINCSINCeLCDQtCA2NDwvZGl2PidcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFx0bGF0aXR1ZGU6IDU5LjkzLFxyXG5cdFx0XHRcdFx0bG9uZ2l0dWRlOiAzMC4zNCxcclxuXHRcdFx0XHRcdGhpbnRDb250ZW50OiAnPGRpdiBjbGFzcz1cIm1hcF9faGludFwiPtC90LDQsS4g0YDQtdC60Lgg0KTQvtC90YLQsNC90LrQuCwg0LQuIDU2PC9kaXY+J1xyXG5cdFx0XHR9XHJcblx0XSxcclxuXHRcdFx0Z2VvT2JqZWN0cz0gW107XHJcblxyXG5cdGZ1bmN0aW9uIGluaXQoKSB7XHJcblx0XHRcdHZhciBtYXAgPSBuZXcgeW1hcHMuTWFwKCdtYXAnLCB7XHJcblx0XHRcdFx0XHRjZW50ZXI6IFs1OS45NCwgMzAuMzJdLFxyXG5cdFx0XHRcdFx0em9vbTogMTIsXHJcblx0XHRcdFx0XHRjb250cm9sczogWyd6b29tQ29udHJvbCddLFxyXG5cdFx0XHRcdFx0YmVoYXZpb3JzOiBbJ2RyYWcnXVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcGxhY2VtYXJrcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdGdlb09iamVjdHNbaV0gPSBuZXcgeW1hcHMuUGxhY2VtYXJrKFtwbGFjZW1hcmtzW2ldLmxhdGl0dWRlLCBwbGFjZW1hcmtzW2ldLmxvbmdpdHVkZV0sXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRoaW50Q29udGVudDogcGxhY2VtYXJrc1tpXS5oaW50Q29udGVudFxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uTGF5b3V0OiAnZGVmYXVsdCNpbWFnZScsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGljb25JbWFnZUhyZWY6ICcuLy4uL2ltZy9pY29ucy9tYXAtbWFya2VyLnN2ZycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGljb25JbWFnZVNpemU6IFs0NiwgNTddLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpY29uSW1hZ2VPZmZzZXQ6IFstMjMsIC01N11cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGNsdXN0ZXJlciA9IG5ldyB5bWFwcy5DbHVzdGVyZXIoe1xyXG5cdFx0XHRcdFx0Y2x1c3Rlckljb25zOiBbXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRocmVmOiAnLi8uLi9pbWcvY29udGVudC8xc3Rfc2NyZWVuX2hlcm8vbWFpbl9idXJnZXIucG5nJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZTogWzEwMCwgMTAwXSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0b2Zmc2V0OiBbLTUwLCAtNTBdXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdGNsdXN0ZXJJY29uQ29udGVudExheW91dDogbnVsbFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG1hcC5nZW9PYmplY3RzLmFkZChjbHVzdGVyZXIpO1xyXG5cdFx0XHRjbHVzdGVyZXIuYWRkKGdlb09iamVjdHMpO1xyXG5cdH1cclxuXHJcbn0pKCk7IiwiOyhmdW5jdGlvbigpIHtcclxuXHJcblx0Y29uc3Qgc2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbicpO1xyXG5cdGNvbnN0IG1lbnVJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maXhlZC1tZW51X19pdGVtJyk7XHJcblx0Y29uc3QgZGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluY29udGVudCcpO1xyXG5cdGxldCBpbnNjcm9sbCA9IGZhbHNlO1xyXG5cdGxldCAgZGF0YVNjcm9sbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1zY3JvbGwtdG9dXCIpO1xyXG5cclxuXHJcblx0Ly/QutC+0LQg0YTRg9C90LrRhtC40Lgg0LTQvtC70LbQtdC9INCx0YvRgtGMINC/0LXRgNC10L/QuNGB0LDQvSDQvdCwIDMg0L7RgtC00LXQu9GM0L3Ri9C1INGE0YPQvdC60YbQuNC4LCDQvdC+INC80L3QtSDQv9C+0LrQsCDRgtCw0Log0L/QvtC90Y/RgtC90LXQtVxyXG5cdGNvbnN0IHBlcmZvcm1UcmFuc2l0aW9uID0gc2VjdGlvbkluZGV4ID0+IHtcclxuXHRcdGlmIChpbnNjcm9sbCA9PSBmYWxzZSkgeyAvLyBpZiAoaW5zY3JvbGwpIHJldHVybjsgXHJcblx0XHRcdGluc2Nyb2xsID0gdHJ1ZTtcclxuXHRcdFx0bGV0IHBvc2l0aW9uID0gYCR7c2VjdGlvbkluZGV4ICogKC0xMDApfSVgO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dChjbG9zZU1vZGFsLCA1MDApOyAvLyDQt9Cw0LrRgNGL0YLRjCDQs9Cw0LzQsdGD0YDQs9C10YAt0LzQtdC90Y4g0YfQtdGA0LXQtyAwLjUg0YHQtdC60YPQvdC0IFxyXG5cdFx0XHRzZWN0aW9uc1tzZWN0aW9uSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlY3Rpb24tLWFjdGl2ZScpO1xyXG5cdFx0XHRtZW51SXRlbXNbc2VjdGlvbkluZGV4XS5jbGFzc0xpc3QuYWRkKCdmaXhlZC1tZW51X19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0bGV0IHNpYmxpbmdzID0gZ2V0U2libGluZ3Moc2VjdGlvbnNbc2VjdGlvbkluZGV4XSk7XHJcblx0XHRcdGZvciAobGV0IHNpYmxpbmcgaW4gc2libGluZ3MpIHtcclxuXHRcdFx0XHRpZiAoc2libGluZ3Nbc2libGluZ10uY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWN0aW9uLS1hY3RpdmUnKSkge1xyXG5cdFx0XHRcdFx0c2libGluZ3Nbc2libGluZ10uY2xhc3NMaXN0LnJlbW92ZSgnc2VjdGlvbi0tYWN0aXZlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHNpYmxpbmdzID0gZ2V0U2libGluZ3MobWVudUl0ZW1zW3NlY3Rpb25JbmRleF0pO1xyXG5cdFx0XHRmb3IgKGxldCBzaWJsaW5nIGluIHNpYmxpbmdzKSB7XHJcblx0XHRcdFx0aWYgKHNpYmxpbmdzW3NpYmxpbmddLmNsYXNzTGlzdC5jb250YWlucygnZml4ZWQtbWVudV9faXRlbS0tYWN0aXZlJykpIHtcclxuXHRcdFx0XHRcdHNpYmxpbmdzW3NpYmxpbmddLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkLW1lbnVfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZGlzcGxheS5zdHlsZS5jc3NUZXh0ID0gYHRyYW5zZm9ybTogdHJhbnNsYXRlWSgke3Bvc2l0aW9ufSk7YDtcclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0aW5zY3JvbGwgPSBmYWxzZTtcclxuXHRcdFx0fSwgMjAwICsgMzAwKTsgLy8g0LLRgNC10LzRjyB0cmFuc2l0aW9uICsg0LLRgNC10LzRjyDQuNC90LXRgNGG0LjQuCDQvdCwINGC0LDRh9C/0LDQtNCw0YUsINC/0L7QtNGA0L7QsdC90YvQuSDQutC+0LzQvNC10L3RgiDQviDRgNCw0LHQvtGC0LUsINC70LjQsdC+INC30LDQvNC10L3QsCDQvdCwINC/0L7QvdGP0YLQvdGL0LUg0L/QtdGA0LXQvNC10L3QvdGL0LVcclxuXHRcdH1cclxuXHR9IFxyXG5cclxuXHRjb25zdCBzY3JvbGxWaWV3cG9ydCA9IGRpcmVjdGlvbiA9PiB7XHJcblx0XHRcclxuXHRcdGxldCBhY3RpdmVTZWN0aW9uID0gMDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHNlY3Rpb25zW2ldLmNsYXNzTGlzdC5jb250YWlucygnc2VjdGlvbi0tYWN0aXZlJykpIHtcclxuXHRcdFx0XHRhY3RpdmVTZWN0aW9uID0gaTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRjb25zdCBwcmV2U2VjdGlvbiA9IGFjdGl2ZVNlY3Rpb24gLSAxO1xyXG5cdFx0Y29uc3QgbmV4dFNlY3Rpb24gPSBhY3RpdmVTZWN0aW9uICsgMTtcclxuXHJcblx0XHRpZiAoZGlyZWN0aW9uID09PSAncHJldicgJiYgcHJldlNlY3Rpb24gPj0gMCkge1xyXG5cdFx0XHRwZXJmb3JtVHJhbnNpdGlvbihwcmV2U2VjdGlvbik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ25leHQnICYmIG5leHRTZWN0aW9uIDwgc2VjdGlvbnMubGVuZ3RoKSB7XHJcblx0XHRcdHBlcmZvcm1UcmFuc2l0aW9uKG5leHRTZWN0aW9uKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGUpID0+IHtcclxuXHRcdGxldCBkZWx0YVkgPSBlLmRlbHRhWTtcclxuXHRcdFxyXG5cdFx0aWYgKGRlbHRhWSA+IDApIHtcclxuXHRcdFx0c2Nyb2xsVmlld3BvcnQoJ25leHQnKVxyXG5cdFx0fSBcclxuXHRcdFxyXG5cdFx0aWYgKGRlbHRhWSA8IDApIHtcclxuXHRcdFx0c2Nyb2xsVmlld3BvcnQoJ3ByZXYnKTtcclxuXHRcdH0gXHJcblxyXG5cdH0pO1xyXG5cclxuXHJcblx0ZnVuY3Rpb24gZ2V0U2libGluZ3MoZWxlbSkge1xyXG4gICAgbGV0IHNpYmxpbmdzID0gW107XHJcbiAgICBsZXQgc2libGluZyA9IGVsZW07XHJcbiAgICB3aGlsZSAoc2libGluZy5wcmV2aW91c1NpYmxpbmcpIHtcclxuICAgICAgICBzaWJsaW5nID0gc2libGluZy5wcmV2aW91c1NpYmxpbmc7XHJcbiAgICAgICAgc2libGluZy5ub2RlVHlwZSA9PSAxICYmIHNpYmxpbmdzLnB1c2goc2libGluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2libGluZyA9IGVsZW07XHJcbiAgICB3aGlsZSAoc2libGluZy5uZXh0U2libGluZykge1xyXG4gICAgICAgIHNpYmxpbmcgPSBzaWJsaW5nLm5leHRTaWJsaW5nO1xyXG4gICAgICAgIHNpYmxpbmcubm9kZVR5cGUgPT0gMSAmJiBzaWJsaW5ncy5wdXNoKHNpYmxpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzaWJsaW5ncztcclxuXHR9XHJcblxyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG5cclxuXHRcdHN3aXRjaChlLmtleUNvZGUpIHtcclxuXHRcdFx0Y2FzZSAzOCA6IFxyXG5cdFx0XHRcdHNjcm9sbFZpZXdwb3J0KCdwcmV2Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgNDAgOlxyXG5cdFx0XHRcdHNjcm9sbFZpZXdwb3J0KCduZXh0Jyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHRmb3IgKGxldCBpPTA7IGkgPCBkYXRhU2Nyb2xsLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRkYXRhU2Nyb2xsW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRsZXQgdGFyZ2V0ID0gcGFyc2VJbnQoZS50YXJnZXQuZGF0YXNldC5zY3JvbGxUbyk7XHJcblx0XHRcdHBlcmZvcm1UcmFuc2l0aW9uKHRhcmdldCk7XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG5cdC8vbW9iaWxlXHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGUgPT4ge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0sIHtwYXNzaXZlOiBmYWxzZX0pXHJcblxyXG5cdGxldCBldmVudDtcclxuXHRsZXQgbW9iaWxlRGlyZWN0aW9uO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBlID0+IHtcclxuXHRcdGV2ZW50ID0gZTtcclxuXHR9KVxyXG5cclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBlID0+IHtcclxuXHRcdGlmIChldmVudCkge1xyXG5cdFx0XHRtb2JpbGVEaXJlY3Rpb24gPSBlLnRvdWNoZXNbMF0ucGFnZVkgLSBldmVudC50b3VjaGVzWzBdLnBhZ2VZO1xyXG5cdFx0XHRpZiAobW9iaWxlRGlyZWN0aW9uID4gMCkge1xyXG5cdFx0XHRcdHNjcm9sbFZpZXdwb3J0KCdwcmV2Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG1vYmlsZURpcmVjdGlvbiA8IDApIHtcclxuXHRcdFx0XHRzY3JvbGxWaWV3cG9ydCgnbmV4dCcpO1xyXG5cdFx0XHR9XHJcblx0fVxyXG5cdH0pXHJcblx0XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZWRcIiwgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGV2ZW50ID0gbnVsbDtcclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuXHRcdC8v0LfQsNC60YDRi9GC0LjQtSDQsdGD0YDQs9C10YDQsFxyXG5cdFx0aWYgKGhhbWJ1cmdlck1lbnUuY2xhc3NMaXN0LmNvbnRhaW5zKCdoYW1idXJnZXItbWVudS0tdW5Ub2dnbGVkJykgJiYgaGVhZGVyLmNsYXNzTGlzdC5jb250YWlucygnaGVhZGVyLS1mdWxsc2NyZWVuJykpIHtcclxuXHRcdFx0aGFtYnVyZ2VyTWVudS5jbGFzc0xpc3QucmVtb3ZlKCdoYW1idXJnZXItbWVudS0tdW5Ub2dnbGVkJyk7XHJcblx0XHRcdGhhbWJ1cmdlck1lbnUuY2xhc3NMaXN0LmFkZCgnaGFtYnVyZ2VyLW1lbnUtLXRvZ2dsZWQnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGhhbWJ1cmdlck1lbnUuY2xhc3NMaXN0LmFkZCgnaGFtYnVyZ2VyLW1lbnUtLXVuVG9nZ2xlZCcpO1xyXG5cdFx0XHRoYW1idXJnZXJNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2hhbWJ1cmdlci1tZW51LS10b2dnbGVkJyk7XHJcblx0XHR9XHJcblx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyLS1mdWxsc2NyZWVuJyk7XHJcblx0XHRib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2luaGVyaXQnO1xyXG5cdFx0XHJcblx0fVxyXG5cclxuXHQvLyDRh9GC0L4t0YLQviDRh9C40YLQsNC7INC+INC30LDQvNC10L3QtSDRgtCw0LnQvNCw0YPRgtC+0LIg0L3QsCDQv9GA0L7QvNC40YHRiyDQuCDRgdCy0L7RgNC80LjRgNC+0LLQsNGC0Ywg0LrQu9Cw0YHRgdGLINC80LXRgtC+0LTRiywg0L3QviDRjyDQvdC1INCyINC60YPRgNGB0LDRhSDRh9GC0L4g0Y3RgtC+LlxyXG5cdC8vINC+0YLQtNC10LvRjNC90YvQtSDQtNC10LnRgdGC0LLQuNGPINC90YPQttC90L4g0LfQsNC60LjQvdGD0YLRjCDQsiDQvtGC0LTQtdC70YzQvdGL0LUg0YTRg9C90LrRhtC40LhcclxuXHRcclxufSkoKTsiLCI7KGZ1bmN0aW9uKCkge1xyXG5cclxuLy8gc2xpZGVyXHJcbi8vINC90LUg0YHQtNC10LvQsNC90Ysg0LHRg9C70LvQtdGC0Ysg0YHQvdC40LfRg1xyXG5sZXQgc2xpZGVyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlci1jb250YWluZXJfX2xpc3QnKTtcclxubGV0IHNsaWRlckNhcm91c2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlci1jb250YWluZXJfX2l0ZW1zJyk7XHJcbmxldCBzbGlkZXJJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlci1jb250YWluZXJfX2l0ZW0nKTtcclxubGV0IGNvbnRlbnRXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItY29udGFpbmVyX19saXN0JykuY2xpZW50V2lkdGg7XHJcbmxldCBzbGlkZXJMZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlci1sZWZ0Jyk7XHJcbmxldCBzbGlkZXJSaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXItcmlnaHQnKTtcclxubGV0IHNsaWRlckRvdHNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlci1kb3RzJyk7XHJcbmxldCBzbGlkZXJQaWN0dXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ1cmdlci1jYXJkX19waWMnKTtcclxubGV0IGFsbERvdHM7XHJcblxyXG5jb25zdCBtaW5SaWdodCA9IDA7XHJcbmNvbnN0IG1heFJpZ2h0ID0gY29udGVudFdpZHRoICogc2xpZGVySXRlbS5sZW5ndGg7XHJcbmNvbnN0IHN0ZXAgPSBjb250ZW50V2lkdGg7XHJcbmxldCBjdXJyZW50UmlnaHQgPSAwO1xyXG5sZXQgY3VycmVudFN0ZXA7XHJcblxyXG5mb3IgKGkgPSAwOyBpIDwgc2xpZGVySXRlbS5sZW5ndGg7IGkrKykge1xyXG5cdHNsaWRlckl0ZW1baV0uc3R5bGUubWluV2lkdGggPSBjb250ZW50V2lkdGggKyBcInB4XCI7XHJcbn1cclxuXHJcbnNsaWRlckxlZnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0aWYgKE1hdGguYWJzKGN1cnJlbnRSaWdodCkgPiBtaW5SaWdodCkge1xyXG5cdFx0Y3VycmVudFJpZ2h0ICs9IHN0ZXA7XHJcblx0XHRzbGlkZXJDYXJvdXNlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2N1cnJlbnRSaWdodH1weClgO1xyXG5cdFx0Y3VycmVudFN0ZXAgPSAtKGN1cnJlbnRSaWdodC9zdGVwKTtcclxuXHRcdHN3aXRjaEFjdGl2ZUNsYXNzKGN1cnJlbnRTdGVwKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7bWF4UmlnaHQgLSBzdGVwfXB4KWA7XHJcblx0XHRjdXJyZW50UmlnaHQgPSAtKG1heFJpZ2h0IC0gc3RlcCk7XHJcblx0XHRjdXJyZW50U3RlcCA9IC0oY3VycmVudFJpZ2h0L3N0ZXApO1xyXG5cdFx0c3dpdGNoQWN0aXZlQ2xhc3MoY3VycmVudFN0ZXApO1xyXG5cdH1cclxufSk7XHJcblxyXG5zbGlkZXJSaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRpZiAoTWF0aC5hYnMoY3VycmVudFJpZ2h0KSA8IChtYXhSaWdodCAtIHN0ZXApKSB7XHJcblx0XHRjdXJyZW50UmlnaHQgLT0gc3RlcDtcclxuXHRcdHNsaWRlckNhcm91c2VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7Y3VycmVudFJpZ2h0fXB4KWA7XHJcblx0XHRjdXJyZW50U3RlcCA9IC0oY3VycmVudFJpZ2h0L3N0ZXApO1xyXG5cdFx0c3dpdGNoQWN0aXZlQ2xhc3MoY3VycmVudFN0ZXApO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzbGlkZXJDYXJvdXNlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgwcHgpYDtcclxuXHRcdGN1cnJlbnRSaWdodCA9IDA7XHJcblx0XHRjdXJyZW50U3RlcCA9IC0oY3VycmVudFJpZ2h0L3N0ZXApO1xyXG5cdFx0c3dpdGNoQWN0aXZlQ2xhc3MoY3VycmVudFN0ZXApO1xyXG5cdH1cclxufSk7XHJcblxyXG5mb3IgKGxldCBpID0gMDsgaSA8IHNsaWRlckl0ZW0ubGVuZ3RoOyBpKyspIHtcclxuXHRzbGlkZXJEb3RzTGlzdC5hcHBlbmQoY3JlYXRlTmV3RWxlbWVudChpKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU5ld0VsZW1lbnQoaSkge1xyXG5cdGxldCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuXHRlbGVtLmNsYXNzTGlzdC5hZGQoJ3NsaWRlci1kb3RzX19pbWcnKTtcclxuXHRsZXQgbmV3SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblx0bmV3SW1nLmNsYXNzTGlzdC5hZGQoJ3NsaWRlci1kb3RzX19pbWctLXBpYycpO1xyXG5cdGxldCBzcmMgPSBzbGlkZXJQaWN0dXJlW2ldLmdldEF0dHJpYnV0ZSgnc3JjJyk7XHJcblx0bGV0IGFsdCA9IHNsaWRlclBpY3R1cmVbaV0uZ2V0QXR0cmlidXRlKCdhbHQnKTtcclxuXHRuZXdJbWcuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMpO1xyXG5cdG5ld0ltZy5zZXRBdHRyaWJ1dGUoJ2FsdCcsIGFsdCk7XHJcblx0ZWxlbS5hcHBlbmQobmV3SW1nKTtcclxuXHRyZXR1cm4gZWxlbTtcclxufVxyXG5cclxuYWxsRG90cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXItZG90c19faW1nJyk7XHJcblxyXG5pZiAoYWxsRG90cy5sZW5ndGggPiAwKSB7XHJcblx0YWxsRG90c1swXS5jbGFzc0xpc3QuYWRkKCdzbGlkZXItZG90c19faW1nLS1hY3RpdmUnKTtcclxufVxyXG5cclxuZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxEb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0YWxsRG90c1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdHN3aXRjaEFjdGl2ZUNsYXNzKGkpO1xyXG5cdFx0ZG90TW92ZVNsaWRlKGkpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkb3RNb3ZlU2xpZGUoaSkge1xyXG5cdGN1cnJlbnRSaWdodCA9IHN0ZXAgKiAoLWkpO1xyXG5cdHNsaWRlckNhcm91c2VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7Y3VycmVudFJpZ2h0fXB4KWA7XHJcbn0gXHJcblxyXG5mdW5jdGlvbiBzd2l0Y2hBY3RpdmVDbGFzcyhpKSB7XHJcblx0YWxsRG90c1tpXS5jbGFzc0xpc3QuYWRkKCdzbGlkZXItZG90c19faW1nLS1hY3RpdmUnKTtcclxuXHRsZXQgc2libGluZ3MgPSBnZXRTaWJsaW5ncyhhbGxEb3RzW2ldKTtcclxuXHRmb3IgKGxldCBzaWJsaW5nIGluIHNpYmxpbmdzKSB7XHJcblx0XHRpZiAoc2libGluZ3Nbc2libGluZ10uY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZXItZG90c19faW1nLS1hY3RpdmUnKSkge1xyXG5cdFx0XHRzaWJsaW5nc1tzaWJsaW5nXS5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZXItZG90c19faW1nLS1hY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuO1xyXG59IFxyXG5cclxuZnVuY3Rpb24gZ2V0U2libGluZ3MoZWxlbSkge1xyXG5cdGxldCBzaWJsaW5ncyA9IFtdO1xyXG5cdGxldCBzaWJsaW5nID0gZWxlbTtcclxuXHR3aGlsZSAoc2libGluZy5wcmV2aW91c1NpYmxpbmcpIHtcclxuXHRcdFx0c2libGluZyA9IHNpYmxpbmcucHJldmlvdXNTaWJsaW5nO1xyXG5cdFx0XHRzaWJsaW5nLm5vZGVUeXBlID09IDEgJiYgc2libGluZ3MucHVzaChzaWJsaW5nKTtcclxuXHR9XHJcblxyXG5cdHNpYmxpbmcgPSBlbGVtO1xyXG5cdHdoaWxlIChzaWJsaW5nLm5leHRTaWJsaW5nKSB7XHJcblx0XHRcdHNpYmxpbmcgPSBzaWJsaW5nLm5leHRTaWJsaW5nO1xyXG5cdFx0XHRzaWJsaW5nLm5vZGVUeXBlID09IDEgJiYgc2libGluZ3MucHVzaChzaWJsaW5nKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBzaWJsaW5ncztcclxufVxyXG5cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHRsZXQgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcblx0bGV0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9jb250ZW50X19wbGF5LWJ0bicpO1xyXG5cdGxldCBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb2NvbnRlbnRfX3BhdXNlLWJ0bicpO1xyXG5cdGxldCBwbGF5QnV0dG9uQ29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3BsYXknKTtcclxuXHRsZXQgcGF1c2VCdXR0b25Db250cm9scyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fcGF1c2UnKTtcclxuXHRsZXQgaGlkZUNvbnRyb2xzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvY29udGVudF9fY29udHJvbHMnKTtcclxuXHRsZXQgdm9sdW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3ZvbHVtZS1sZXZlbCcpXHJcblx0bGV0IHZvbHVtZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdm9sdW1lJyk7XHJcblx0bGV0IGN1cnJlbnRUaW1lRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdGltZWxpbmUtY3VycmVudCcpO1xyXG5cdGxldCB0b3RhbFRpbWVFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX190aW1lbGluZS10b3RhbCcpO1xyXG5cdGxldCBzcGVlZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fc3BlZWQtYnRuJyk7XHJcblx0bGV0IHRpbWVsaW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX190aW1lbGluZScpO1xyXG5cclxuXHRsZXQgcGxheWVyO1xyXG5cdG9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gKCkgPT4ge1xyXG5cdFx0cGxheWVyID0gbmV3IFlULlBsYXllcigndmlkZW9jb250ZW50X19pZnJhbWUnLCB7XHJcblx0XHRcdHZpZGVvSWQ6ICdXZGM4SXVVN2ZvRScsXHJcblx0XHRcdGV2ZW50czoge1xyXG5cdFx0XHRcdG9uUmVhZHk6IG9uUGxheWVyUmVhZHksXHJcblx0XHRcdFx0b25TdGF0ZUNoYW5nZTogb25QbGF5ZXJTdGF0ZUNoYW5nZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwbGF5ZXJWYXJzOiB7XHJcblx0XHRcdFx0Y29udHJvbHM6IDAsXHJcblx0XHRcdFx0ZGlzYWJsZWtiOiAwLFxyXG5cdFx0XHRcdHNob3dpbmZvOiAwLFxyXG5cdFx0XHRcdHJlbDogMCxcclxuXHRcdFx0XHRhdXRvcGxheTogMCxcclxuXHRcdFx0XHRtb2Rlc3RicmFuZGluZzogMCxcclxuXHRcdFx0XHRwbGF5c2lubGluZTogMSxcclxuXHRcdFx0XHRmczogMFxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdG9uUGxheWVyUmVhZHkgPSAoKSA9PiB7XHJcblx0XHRwbGF5UGF1c2VWaWRlb09uUGxheWVyUmVhZHkoKTtcclxuXHRcdHNldFRvdGFsVGltZSgpO1xyXG5cdFx0c2V0VGltZWxpbmVQYXJhbXMoKTtcclxuXHR9XHJcblxyXG5cdG9uUGxheWVyU3RhdGVDaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRwbGF5UGF1c2VWaWRlb09uUGxheWVyU3RhdGVDaGFuZ2UoKTtcclxuXHRcdHNldFZvbHVtZSgpO1xyXG5cdFx0bXV0ZVZvbHVtZSgpO1xyXG5cdFx0c2V0SW50ZXJ2YWwoc2V0Q3VycmVudFRpbWUsIDUwMCk7XHJcblx0XHRjaGFuZ2VTcGVlZCgpO1xyXG5cdFx0Y2hhbmdlVGltZSgpO1xyXG5cdH1cclxuXHJcblx0cGxheVBhdXNlVmlkZW9PblBsYXllclJlYWR5ID0gKCkgPT4ge1xyXG5cdFx0cGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZVBsYXkpO1xyXG5cdFx0cGxheUJ1dHRvbkNvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlUGxheSk7XHJcblx0fVxyXG5cclxuXHJcblx0cGxheVBhdXNlVmlkZW9PblBsYXllclN0YXRlQ2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0aWYgKHBsYXllci5nZXRQbGF5ZXJTdGF0ZSgpID09IDIpIHtcclxuXHRcdFx0dG9nZ2xlUGF1c2UoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGxheWVyLmdldFBsYXllclN0YXRlKCkgPT0gMCkge1xyXG5cdFx0XHR0b2dnbGVTdG9wKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cGF1c2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblx0XHRcdHRvZ2dsZVBhdXNlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRwYXVzZUJ1dHRvbkNvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHR0b2dnbGVQYXVzZSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRcclxuXHQvL3BsYXkgcGF1c2VcclxuXHR0b2dnbGVQbGF5ID0gKCkgPT4ge1xyXG5cdFx0cGxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd2aWRlb2NvbnRlbnRfX3BsYXktYnRuLS1hY3RpdmUnKTtcclxuXHRcdHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3ZpZGVvY29udGVudF9fcGF1c2UtYnRuLS1hY3RpdmUnKTtcclxuXHRcdHBhdXNlQnV0dG9uQ29udHJvbHMuY2xhc3NMaXN0LmFkZCgnY29udHJvbHNfX3BhdXNlLS1hY3RpdmUnKTtcclxuXHRcdHBsYXlCdXR0b25Db250cm9scy5jbGFzc0xpc3QucmVtb3ZlKCdjb250cm9sc19fcGxheS0tYWN0aXZlJyk7XHJcblx0XHRoaWRlQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9jb250ZW50X19jb250cm9scy0tcGF1c2VkJyk7XHJcblx0XHRwbGF5ZXIucGxheVZpZGVvKCk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGVQYXVzZSA9ICgpID0+IHtcclxuXHRcdHBsYXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9jb250ZW50X19wbGF5LWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlb2NvbnRlbnRfX3BhdXNlLWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRwYXVzZUJ1dHRvbkNvbnRyb2xzLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbnRyb2xzX19wYXVzZS0tYWN0aXZlJyk7XHJcblx0XHRwbGF5QnV0dG9uQ29udHJvbHMuY2xhc3NMaXN0LmFkZCgnY29udHJvbHNfX3BsYXktLWFjdGl2ZScpO1xyXG5cdFx0aGlkZUNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ3ZpZGVvY29udGVudF9fY29udHJvbHMtLXBhdXNlZCcpO1xyXG5cdFx0cGxheWVyLnBhdXNlVmlkZW8oKTtcclxuXHR9XHJcblxyXG5cdHRvZ2dsZVN0b3AgPSAoKSA9PiB7XHJcblx0XHRwbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGxheS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0cGF1c2VCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9jb250ZW50X19wYXVzZS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0cGF1c2VCdXR0b25Db250cm9scy5jbGFzc0xpc3QucmVtb3ZlKCdjb250cm9sc19fcGF1c2UtLWFjdGl2ZScpO1xyXG5cdFx0cGxheUJ1dHRvbkNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzX19wbGF5LS1hY3RpdmUnKTtcclxuXHRcdHBsYXllci5zdG9wVmlkZW8oKTtcclxuXHR9XHJcblxyXG5cdC8vdm9sdW1lXHJcblx0bXV0ZVZvbHVtZSA9ICgpID0+IHtcclxuXHRcdHZvbHVtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+e1xyXG5cdFx0XHRpZiAocGxheWVyLmlzTXV0ZWQoKSkge1xyXG5cdFx0XHRcdHBsYXllci51bk11dGUoKTtcclxuXHRcdFx0XHR2b2x1bWVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnY29udHJvbHNfX3ZvbHVtZS0tbXV0ZWQnKTtcclxuXHRcdFx0XHRwbGF5ZXIuc2V0Vm9sdW1lKDUwKTtcclxuXHRcdFx0XHR2b2x1bWVJbnB1dC52YWx1ZSA9IDUwO1xyXG5cdFx0XHR9IGVsc2UgXHJcblx0XHRcdHtcclxuXHRcdFx0XHRwbGF5ZXIubXV0ZSgpO1xyXG5cdFx0XHRcdHZvbHVtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdjb250cm9sc19fdm9sdW1lLS1tdXRlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHNldFZvbHVtZSA9ICgpID0+IHtcclxuXHRcdHBsYXllci5zZXRWb2x1bWUodm9sdW1lSW5wdXQudmFsdWUpO1xyXG5cdFx0dm9sdW1lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xyXG5cdFx0XHRwbGF5ZXIuc2V0Vm9sdW1lKGUudGFyZ2V0LnZhbHVlKTtcclxuXHRcdFx0aWYoZS50YXJnZXQudmFsdWUgPT0gMCkge1xyXG5cdFx0XHRcdHZvbHVtZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdjb250cm9sc19fdm9sdW1lLS1tdXRlZCcpO1xyXG5cdFx0XHRcdHBsYXllci5tdXRlKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dm9sdW1lQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbnRyb2xzX192b2x1bWUtLW11dGVkJyk7XHJcblx0XHRcdFx0cGxheWVyLnVuTXV0ZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0Ly9kdXJhdGlvblxyXG5cdHNldFRvdGFsVGltZSA9ICgpID0+IHtcclxuXHRcdHRvdGFsVGltZUVsZW0uaW5uZXJIVE1MID0gZm9ybWF0RHVydGlvbihwbGF5ZXIuZ2V0RHVyYXRpb24oKSk7XHJcblx0fVxyXG5cclxuXHRzZXRDdXJyZW50VGltZSA9ICgpID0+IHtcclxuXHRcdGN1cnJlbnRUaW1lRWxlbS5pbm5lckhUTUwgPSBmb3JtYXREdXJ0aW9uKHBsYXllci5nZXRDdXJyZW50VGltZSgpKTtcclxuXHRcdHRpbWVsaW5lLnZhbHVlID0gcGxheWVyLmdldEN1cnJlbnRUaW1lKCk7XHJcblx0fVxyXG5cclxuXHRmb3JtYXREdXJ0aW9uID0gKHRpbWUpID0+IHtcclxuXHRcdGNvbnN0IHNlY29uZHMgPSBNYXRoLmZsb29yKHRpbWUgJSA2MCk7XHJcblx0XHRjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcih0aW1lIC8gNjApICUgNjAgO1xyXG5cdFx0aWYgKG1pbnV0ZXMgPT0gMCAmJiBzZWNvbmRzIDwgMTApIHtcclxuXHRcdFx0cmV0dXJuICgnMDowJytgJHtzZWNvbmRzfWApO1xyXG5cdFx0fSBlbHNlIGlmIChtaW51dGVzID09IDApIHtcclxuXHRcdFx0cmV0dXJuICgnMDonK2Ake3NlY29uZHN9YCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gKGAke21pbnV0ZXN9YCsnOicrYCR7c2Vjb25kc31gKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHRjaGFuZ2VTcGVlZCA9ICgpID0+IHtcclxuXHRcdHNwZWVkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2hhbmdlU3BlZWRWYWx1ZSk7XHJcblx0fVxyXG5cclxuXHRjaGFuZ2VTcGVlZFZhbHVlID0gKCkgPT4ge1xyXG5cdFx0aWYgKHBsYXllci5nZXRQbGF5YmFja1JhdGUoKSA9PSAxKSB7XHJcblx0XHRcdHBsYXllci5zZXRQbGF5YmFja1JhdGUoMik7XHJcblx0XHRcdHNwZWVkQnV0dG9uLmlubmVySFRNTCA9IFwiMnhcIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBsYXllci5zZXRQbGF5YmFja1JhdGUoMSk7XHJcblx0XHRcdHNwZWVkQnV0dG9uLmlubmVySFRNTCA9IFwiMXhcIjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvL3RpbWVsaW5lXHJcblx0c2V0VGltZWxpbmVQYXJhbXMgPSAoKSA9PiB7XHJcblx0XHR0aW1lbGluZS5zZXRBdHRyaWJ1dGUoJ21pbicsIDApO1xyXG5cdFx0dGltZWxpbmUuc2V0QXR0cmlidXRlKCdtYXgnLCBwbGF5ZXIuZ2V0RHVyYXRpb24oKSk7XHJcblx0fVxyXG5cclxuXHRjaGFuZ2VUaW1lID0gKCkgPT4ge1xyXG5cdFx0dGltZWxpbmUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xyXG5cdFx0XHRwbGF5ZXIuc2Vla1RvKGUudGFyZ2V0LnZhbHVlKTtcclxuXHRcdFx0dG9nZ2xlUGxheSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59KSgpOyJdfQ==
