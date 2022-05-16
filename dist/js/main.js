var i;

// hamburger menu header--fullscreen

const header = document.querySelector('.header');
const body = document.querySelector('body');

header.addEventListener('click', function (e) {
	const hamburger = e.target.closest('.hamburger-menu');
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

// slider
// не сделаны буллеты снизу
let sliderContainer = document.querySelector('.slider-container__list');
let sliderCarousel = document.querySelector('.slider-container__items');
let sliderItem = document.querySelectorAll('.slider-container__item');
let contentWidth = document.querySelector('.slider-container__list').clientWidth;
let sliderLeft = document.querySelector('#slider-left');
let sliderRight = document.querySelector('#slider-right');

const minRight = 0;
const maxRight = contentWidth * sliderItem.length;
const step = contentWidth;
let currentRight = 0;

for (i = 0; i < sliderItem.length; i++) {
	sliderItem[i].style.minWidth = contentWidth + "px";
}

sliderLeft.addEventListener('click', e => {
	e.preventDefault();
	if (Math.abs(currentRight) > minRight) {
		currentRight += step;
		sliderCarousel.style.transform = `translateX(${currentRight}px)`;
	} else {
		sliderCarousel.style.transform = `translateX(-${maxRight - step}px)`;
		currentRight = -(maxRight - step);
	}
});

sliderRight.addEventListener('click', e => {
	e.preventDefault();
	if (Math.abs(currentRight) < (maxRight - step)) {
		currentRight -= step;
		sliderCarousel.style.transform = `translateX(${currentRight}px)`;
	} else {
		sliderCarousel.style.transform = `translateX(0px)`;
		currentRight = 0;
	}
});

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
	const display = document.querySelector('.maincontent');
	let inscroll = false;
	let  dataScroll = document.querySelectorAll("[data-scroll-to]");

	const performTransition = sectionIndex => {
		if (inscroll == false) {
			inscroll = true;
			let position = `${sectionIndex * (-100)}%`;

			sections[sectionIndex].classList.add('section--active');
			let siblings = getSiblings(sections[sectionIndex]);
			for (let sibling in siblings) {
				if (siblings[sibling].classList.contains('section--active')) {
					siblings[sibling].classList.remove('section--active');
				}
			}

			display.style.cssText = `transform: translateY(${position});`;
			setTimeout(() => {
				inscroll = false;
			}, 200 + 300);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzY3JpcHRzL21hcC5qcyIsInNjcmlwdHMvc2Nyb2xsLmpzIiwic2NyaXB0cy92aWRlb3BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1DcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGk7XHJcblxyXG4vLyBoYW1idXJnZXIgbWVudSBoZWFkZXItLWZ1bGxzY3JlZW5cclxuXHJcbmNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKTtcclxuY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHJcbmhlYWRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0Y29uc3QgaGFtYnVyZ2VyID0gZS50YXJnZXQuY2xvc2VzdCgnLmhhbWJ1cmdlci1tZW51Jyk7XHJcblx0aWYgKGhhbWJ1cmdlciAmJiBlLnRhcmdldC5jbG9zZXN0KCcuaGVhZGVyLS1mdWxsc2NyZWVuJykpIHtcclxuXHRcdGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkZXItLWZ1bGxzY3JlZW4nKTtcclxuXHRcdGJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaW5oZXJpdCc7XHJcblx0fVxyXG5cdGVsc2UgaWYgKGhhbWJ1cmdlciAmJiBlLnRhcmdldC5jbG9zZXN0KCcuaGFtYnVyZ2VyLW1lbnUnKSkge1xyXG5cdFx0aGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlci0tZnVsbHNjcmVlbicpO1xyXG5cdFx0Ym9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cdH1cclxufSk7XHJcblxyXG4vL2J1cmdlcnMtY29tcG9zaXRpb24tY2xvc2UtYnRuXHJcbmNvbnN0IGhvdmVyQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29tcG9zaXRpb25fX2Nsb3NlLWJ0bicpO1xyXG5jb25zdCBob3Zlck9wZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLWNhcmRfX2NvbXBvc2l0aW9uLS1pdGVtJyk7XHJcblxyXG5ob3ZlckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1cmdlci1jYXJkX19jb21wb3NpdGlvbi0taG92ZXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG59KTtcclxuXHJcbmlmIChzY3JlZW4ud2lkdGggPCA3NjkpIHtcclxuXHRob3Zlck9wZW4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1cmdlci1jYXJkX19jb21wb3NpdGlvbi0taG92ZXInKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHR9KTtcclxufVxyXG5cclxuLy9vdmVybGF5IHJldmlld3NcclxuY29uc3QgcmV2aWV3QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJldmlld3NfX2J0bicpO1xyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXZpZXdzUG9wdXAnKS5pbm5lckhUTUw7XHJcblxyXG5mb3IgKGkgPSAwOyBpIDwgcmV2aWV3QnV0dG9uLmxlbmd0aDsgaSsrKSB7XHJcblx0cmV2aWV3QnV0dG9uW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0bGV0IHJldmlld3NUaXRsZSA9IGUucGF0aFsyXS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fdGl0bGUnKS5pbm5lckhUTUw7XHJcblx0XHRsZXQgcmV2aWV3c1RleHQgPSBlLnBhdGhbMl0ucXVlcnlTZWxlY3RvcignLnJldmlld3NfX3RleHQnKS5pbm5lckhUTUw7XHJcblx0XHRsZXQgc3VjY2Vzc092ZXJsYXkgPSBjcmVhdGVPdmVybGF5KHJldmlld3NUaXRsZSwgcmV2aWV3c1RleHQpO1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXZpZXdzXCIpLmFwcGVuZChzdWNjZXNzT3ZlcmxheSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU92ZXJsYXkodGl0bGUsIHRleHQpIHtcclxuXHQvLyDQutCw0Log0YHQvtC30LTQsNCy0LDRgtGMINGI0LDQsdC70L7QvSDQsdC10Lcg0LvQuNGI0L3QtdCz0L4g0LTQuNCy0LA/XHJcblx0Y29uc3QgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdG5ld0VsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGU7XHJcblxyXG5cdGNvbnN0IGNsb3NlT3ZlcmxheSA9IG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXlfX2Nsb3NlLWJ0bicpO1xyXG5cdGNvbnN0IGNsb3NlT3ZlcmxheUJnID0gbmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheScpO1xyXG5cclxuXHRjbG9zZU92ZXJsYXlCZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQgPT09IGNsb3NlT3ZlcmxheUJnKSB7XHJcblx0XHRcdGNsb3NlT3ZlcmxheS5jbGljaygpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdGNsb3NlT3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3cycpLnJlbW92ZUNoaWxkKG5ld0VsZW1lbnQpO1xyXG5cdH0pXHJcblxyXG5cdG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld3NfX292ZXJsYXktLXRpdGxlJykuaW5uZXJIVE1MID0gdGl0bGU7XHJcblx0bmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fb3ZlcmxheS0tdGV4dCcpLmlubmVySFRNTCA9IHRleHQ7XHJcblxyXG5cdHJldHVybiBuZXdFbGVtZW50O1xyXG59XHJcblxyXG4vL2FjY29yZGVvblxyXG5cclxuY29uc3QgaXRlbVZlcnRBY2NvcmRlb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmVydGljYWwtYWNjb3JkZW9uX19pdGVtJyk7XHJcbmZvciAoaSA9IDA7IGkgPCBpdGVtVmVydEFjY29yZGVvbi5sZW5ndGg7IGkrKykge1xyXG5cdGl0ZW1WZXJ0QWNjb3JkZW9uW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGlmIChlLnRhcmdldC5jbG9zZXN0KCcudmVydGljYWwtYWNjb3JkZW9uX19pdGVtJykuY2xhc3NMaXN0LmNvbnRhaW5zKCd2ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0tLWFjdGl2ZScpKSB7XHJcblx0XHRcdGUudGFyZ2V0LmNsb3Nlc3QoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKS5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBpdGVtVmVydEFjY29yZGVvbi5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGl0ZW1WZXJ0QWNjb3JkZW9uW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsLWFjY29yZGVvbl9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZS50YXJnZXQuY2xvc2VzdCgnLnZlcnRpY2FsLWFjY29yZGVvbl9faXRlbScpLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsLWFjY29yZGVvbl9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vdGVhbS1hY2NvcmRlb25cclxuY29uc3QgaXRlbVRlYW1BY2NvcmRlb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3RhZmZfX2l0ZW0nKTtcclxuZm9yIChpID0gMDsgaSA8IGl0ZW1UZWFtQWNjb3JkZW9uLmxlbmd0aDsgaSsrKSB7XHJcblx0aXRlbVRlYW1BY2NvcmRlb25baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy5zdGFmZl9faXRlbScpLmNsYXNzTGlzdC5jb250YWlucygnc3RhZmZfX2FjdGl2ZScpKSB7XHJcblx0XHRcdGUudGFyZ2V0LmNsb3Nlc3QoJy5zdGFmZl9faXRlbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWZmX19hY3RpdmUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgaXRlbVRlYW1BY2NvcmRlb24ubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRpdGVtVGVhbUFjY29yZGVvbltqXS5jbGFzc0xpc3QucmVtb3ZlKCdzdGFmZl9fYWN0aXZlJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZS50YXJnZXQuY2xvc2VzdCgnLnN0YWZmX19pdGVtJykuY2xhc3NMaXN0LmFkZCgnc3RhZmZfX2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG4vLyBzbGlkZXJcclxuLy8g0L3QtSDRgdC00LXQu9Cw0L3RiyDQsdGD0LvQu9C10YLRiyDRgdC90LjQt9GDXHJcbmxldCBzbGlkZXJDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLWNvbnRhaW5lcl9fbGlzdCcpO1xyXG5sZXQgc2xpZGVyQ2Fyb3VzZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLWNvbnRhaW5lcl9faXRlbXMnKTtcclxubGV0IHNsaWRlckl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVyLWNvbnRhaW5lcl9faXRlbScpO1xyXG5sZXQgY29udGVudFdpZHRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlci1jb250YWluZXJfX2xpc3QnKS5jbGllbnRXaWR0aDtcclxubGV0IHNsaWRlckxlZnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyLWxlZnQnKTtcclxubGV0IHNsaWRlclJpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlci1yaWdodCcpO1xyXG5cclxuY29uc3QgbWluUmlnaHQgPSAwO1xyXG5jb25zdCBtYXhSaWdodCA9IGNvbnRlbnRXaWR0aCAqIHNsaWRlckl0ZW0ubGVuZ3RoO1xyXG5jb25zdCBzdGVwID0gY29udGVudFdpZHRoO1xyXG5sZXQgY3VycmVudFJpZ2h0ID0gMDtcclxuXHJcbmZvciAoaSA9IDA7IGkgPCBzbGlkZXJJdGVtLmxlbmd0aDsgaSsrKSB7XHJcblx0c2xpZGVySXRlbVtpXS5zdHlsZS5taW5XaWR0aCA9IGNvbnRlbnRXaWR0aCArIFwicHhcIjtcclxufVxyXG5cclxuc2xpZGVyTGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRpZiAoTWF0aC5hYnMoY3VycmVudFJpZ2h0KSA+IG1pblJpZ2h0KSB7XHJcblx0XHRjdXJyZW50UmlnaHQgKz0gc3RlcDtcclxuXHRcdHNsaWRlckNhcm91c2VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7Y3VycmVudFJpZ2h0fXB4KWA7XHJcblx0fSBlbHNlIHtcclxuXHRcdHNsaWRlckNhcm91c2VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKC0ke21heFJpZ2h0IC0gc3RlcH1weClgO1xyXG5cdFx0Y3VycmVudFJpZ2h0ID0gLShtYXhSaWdodCAtIHN0ZXApO1xyXG5cdH1cclxufSk7XHJcblxyXG5zbGlkZXJSaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRpZiAoTWF0aC5hYnMoY3VycmVudFJpZ2h0KSA8IChtYXhSaWdodCAtIHN0ZXApKSB7XHJcblx0XHRjdXJyZW50UmlnaHQgLT0gc3RlcDtcclxuXHRcdHNsaWRlckNhcm91c2VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7Y3VycmVudFJpZ2h0fXB4KWA7XHJcblx0fSBlbHNlIHtcclxuXHRcdHNsaWRlckNhcm91c2VsLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKDBweClgO1xyXG5cdFx0Y3VycmVudFJpZ2h0ID0gMDtcclxuXHR9XHJcbn0pO1xyXG5cclxuLy9mb3JtIHBvcHVwINCy0YvRgtCw0YHQutC40LLQsNC10Lwg0YjQsNCx0LvQvtC9INC/0L7Qv9Cw0L/QsCDQuCDQt9Cw0LrQuNC00YvQstCw0LXQvCDQsiDRhNC+0YDQvNGDXHJcbmNvbnN0IHRlbXBsYXRlRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmb3JtUG9wdXAnKS5pbm5lckhUTUw7XHJcbmNvbnN0IHNlbmRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2VuZEJ0bicpO1xyXG5jb25zdCBzZW5kRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19lbGVtJyk7XHJcblxyXG5sZXQgZGF0YUZvcm07XHJcbmxldCB0ZXh0Rm9ybVBvcHVwO1xyXG5sZXQgdGV4dEZvcm1Qb3B1cEVycm9yID0gJ9CS0Ysg0L3QtSDQstCy0LXQu9C4Li4uICc7XHJcblxyXG5zZW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdGlmICghdmFsaWRhdGVGb3JtKHNlbmRGb3JtKSkge1xyXG5cdFx0Y3JlYXRlRm9ybU92ZXJsYXkodGV4dEZvcm1Qb3B1cCk7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gJyc7XHJcblx0fSBlbHNlIHtcclxuXHRcdGxldCBmb3JtRGF0YSA9IGNyZWF0ZURhdGEoKTtcclxuXHRcdGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0eGhyLm9wZW4oJ1BPU1QnLCAnaHR0cHM6Ly93ZWJkZXYtYXBpLmxvZnRzY2hvb2wuY29tL3NlbmRtYWlsJylcclxuXHRcdHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XHJcblx0XHR4aHIuc2VuZChmb3JtRGF0YSk7XHJcblx0XHR4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHhoci5yZXNwb25zZS5zdGF0dXMgPT09IDEpIHtcclxuXHRcdFx0XHR0ZXh0Rm9ybVBvcHVwID0geGhyLnJlc3BvbnNlLm1lc3NhZ2U7XHJcblx0XHRcdFx0Y3JlYXRlRm9ybU92ZXJsYXkodGV4dEZvcm1Qb3B1cCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGV4dEZvcm1Qb3B1cCA9IHhoci5yZXNwb25zZS5tZXNzYWdlO1xyXG5cdFx0XHRcdGNyZWF0ZUZvcm1PdmVybGF5KHRleHRGb3JtUG9wdXApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSAnJztcclxuXHR9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybU92ZXJsYXkodGV4dCkge1xyXG5cdGNvbnN0IG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRuZXdFbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlRm9ybTtcclxuXHJcblx0Y29uc3QgY2xvc2VPdmVybGF5ID0gbmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnRuLS1vdmVybGF5Jyk7XHJcblx0Y29uc3QgY2xvc2VPdmVybGF5QmcgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5Jyk7XHJcblxyXG5cdGNsb3NlT3ZlcmxheUJnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLnRhcmdldCA9PT0gY2xvc2VPdmVybGF5QmcpIHtcclxuXHRcdFx0Y2xvc2VPdmVybGF5LmNsaWNrKCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Y2xvc2VPdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcmRlcicpLnJlbW92ZUNoaWxkKG5ld0VsZW1lbnQpO1xyXG5cdH0pXHJcblxyXG5cdG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld3NfX292ZXJsYXktLXRleHQnKS5pbm5lckhUTUwgPSB0ZXh0O1xyXG5cclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm9yZGVyXCIpLmFwcGVuZChuZXdFbGVtZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVGb3JtKGZvcm0pIHtcclxuXHRsZXQgdmFsaWQgPSB0cnVlO1xyXG5cclxuXHRpZiAoIXZhbGlkYXRlRmllbGQoZm9ybS5lbGVtZW50cy5jb21tZW50KSkge1xyXG5cdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSB0ZXh0Rm9ybVBvcHVwRXJyb3IgKyBcItCa0L7QvNC80LXQvdGC0LDRgNC40LkhXCI7XHJcblx0fVxyXG5cclxuXHRpZiAoIXZhbGlkYXRlRmllbGQoZm9ybS5lbGVtZW50cy5waG9uZSkpIHtcclxuXHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gdGV4dEZvcm1Qb3B1cEVycm9yICsgXCLQotC10LvQtdGE0L7QvSFcIjtcclxuXHR9XHJcblxyXG5cdGlmICghdmFsaWRhdGVGaWVsZChmb3JtLmVsZW1lbnRzLm5hbWUpKSB7XHJcblx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9IHRleHRGb3JtUG9wdXBFcnJvciArIFwi0JjQvNGPIVwiO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZhbGlkO1xyXG59XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZUZpZWxkKGZpZWxkKSB7XHJcblx0cmV0dXJuIGZpZWxkLmNoZWNrVmFsaWRpdHkoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0YSgpIHtcclxuXHRsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoc2VuZEZvcm0pO1xyXG5cclxuXHRmb3JtRGF0YS5hcHBlbmQoXCJuYW1lXCIsIHNlbmRGb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUpO1xyXG5cdGZvcm1EYXRhLmFwcGVuZChcInBob25lXCIsIHNlbmRGb3JtLmVsZW1lbnRzLnBob25lLnZhbHVlKTtcclxuXHRmb3JtRGF0YS5hcHBlbmQoXCJjb21tZW50XCIsIHNlbmRGb3JtLmVsZW1lbnRzLmNvbW1lbnQudmFsdWUpO1xyXG5cdGZvcm1EYXRhLmFwcGVuZChcInRvXCIsIFwidmFzeUBsaXkuY29tXCIpO1xyXG5cclxuXHRyZXR1cm4gZm9ybURhdGE7XHJcblx0Ly8g0L/QvtGH0LXQvNGDINC90LUg0YHRgNCw0LHQvtGC0LDQuyBzdHJpbmdpZnk/XHJcblx0Ly8gZGF0YUZvcm0gPSB7XHJcblx0Ly8gXHRcIm5hbWVcIjogc2VuZEZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSxcclxuXHQvLyBcdFwicGhvbmVcIjogc2VuZEZvcm0uZWxlbWVudHMucGhvbmUudmFsdWUsXHJcblx0Ly8gXHRcImNvbW1lbnRcIjogXCJ2YXN5QGxpeS5jb21cIixcclxuXHQvLyBcdFwidG9cIjogXCJ2YXN5QGxpeS5jb21cIlxyXG5cdC8vIH1cclxuXHQvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YUZvcm0pO1xyXG59IiwiOyhmdW5jdGlvbigpIHtcclxuXHR5bWFwcy5yZWFkeShpbml0KTtcclxuXHJcblx0dmFyIHBsYWNlbWFya3MgPSBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRcdGxhdGl0dWRlOiA1OS45NyxcclxuXHRcdFx0XHRcdGxvbmdpdHVkZTogMzAuMzEsXHJcblx0XHRcdFx0XHRoaW50Q29udGVudDogJzxkaXYgY2xhc3M9XCJtYXBfX2hpbnRcIj7Rg9C7LiDQm9C40YLQtdGA0LDRgtC+0YDQvtCyLCDQtC4gMTk8L2Rpdj4nXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRcdGxhdGl0dWRlOiA1OS45NCxcclxuXHRcdFx0XHRcdGxvbmdpdHVkZTogMzAuMjUsXHJcblx0XHRcdFx0XHRoaW50Q29udGVudDogJzxkaXYgY2xhc3M9XCJtYXBfX2hpbnRcIj7QnNCw0LvRi9C5INC/0YDQvtGB0L/QtdC60YIg0JIg0J4sINC0IDY0PC9kaXY+J1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0XHRsYXRpdHVkZTogNTkuOTMsXHJcblx0XHRcdFx0XHRsb25naXR1ZGU6IDMwLjM0LFxyXG5cdFx0XHRcdFx0aGludENvbnRlbnQ6ICc8ZGl2IGNsYXNzPVwibWFwX19oaW50XCI+0L3QsNCxLiDRgNC10LrQuCDQpNC+0L3RgtCw0L3QutC4LCDQtC4gNTY8L2Rpdj4nXHJcblx0XHRcdH1cclxuXHRdLFxyXG5cdFx0XHRnZW9PYmplY3RzPSBbXTtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdFx0dmFyIG1hcCA9IG5ldyB5bWFwcy5NYXAoJ21hcCcsIHtcclxuXHRcdFx0XHRcdGNlbnRlcjogWzU5Ljk0LCAzMC4zMl0sXHJcblx0XHRcdFx0XHR6b29tOiAxMixcclxuXHRcdFx0XHRcdGNvbnRyb2xzOiBbJ3pvb21Db250cm9sJ10sXHJcblx0XHRcdFx0XHRiZWhhdmlvcnM6IFsnZHJhZyddXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwbGFjZW1hcmtzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0Z2VvT2JqZWN0c1tpXSA9IG5ldyB5bWFwcy5QbGFjZW1hcmsoW3BsYWNlbWFya3NbaV0ubGF0aXR1ZGUsIHBsYWNlbWFya3NbaV0ubG9uZ2l0dWRlXSxcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGhpbnRDb250ZW50OiBwbGFjZW1hcmtzW2ldLmhpbnRDb250ZW50XHJcblx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbkltYWdlSHJlZjogJy4vLi4vaW1nL2ljb25zL21hcC1tYXJrZXIuc3ZnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWNvbkltYWdlU2l6ZTogWzQ2LCA1N10sXHJcblx0XHRcdFx0XHRcdFx0XHRcdGljb25JbWFnZU9mZnNldDogWy0yMywgLTU3XVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgY2x1c3RlcmVyID0gbmV3IHltYXBzLkNsdXN0ZXJlcih7XHJcblx0XHRcdFx0XHRjbHVzdGVySWNvbnM6IFtcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGhyZWY6ICcuLy4uL2ltZy9jb250ZW50LzFzdF9zY3JlZW5faGVyby9tYWluX2J1cmdlci5wbmcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplOiBbMTAwLCAxMDBdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRvZmZzZXQ6IFstNTAsIC01MF1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0Y2x1c3Rlckljb25Db250ZW50TGF5b3V0OiBudWxsXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bWFwLmdlb09iamVjdHMuYWRkKGNsdXN0ZXJlcik7XHJcblx0XHRcdGNsdXN0ZXJlci5hZGQoZ2VvT2JqZWN0cyk7XHJcblx0fVxyXG5cclxufSkoKTsiLCI7KGZ1bmN0aW9uKCkge1xyXG5cclxuXHRjb25zdCBzZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uJyk7XHJcblx0Y29uc3QgZGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluY29udGVudCcpO1xyXG5cdGxldCBpbnNjcm9sbCA9IGZhbHNlO1xyXG5cdGxldCAgZGF0YVNjcm9sbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1zY3JvbGwtdG9dXCIpO1xyXG5cclxuXHRjb25zdCBwZXJmb3JtVHJhbnNpdGlvbiA9IHNlY3Rpb25JbmRleCA9PiB7XHJcblx0XHRpZiAoaW5zY3JvbGwgPT0gZmFsc2UpIHtcclxuXHRcdFx0aW5zY3JvbGwgPSB0cnVlO1xyXG5cdFx0XHRsZXQgcG9zaXRpb24gPSBgJHtzZWN0aW9uSW5kZXggKiAoLTEwMCl9JWA7XHJcblxyXG5cdFx0XHRzZWN0aW9uc1tzZWN0aW9uSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ3NlY3Rpb24tLWFjdGl2ZScpO1xyXG5cdFx0XHRsZXQgc2libGluZ3MgPSBnZXRTaWJsaW5ncyhzZWN0aW9uc1tzZWN0aW9uSW5kZXhdKTtcclxuXHRcdFx0Zm9yIChsZXQgc2libGluZyBpbiBzaWJsaW5ncykge1xyXG5cdFx0XHRcdGlmIChzaWJsaW5nc1tzaWJsaW5nXS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlY3Rpb24tLWFjdGl2ZScpKSB7XHJcblx0XHRcdFx0XHRzaWJsaW5nc1tzaWJsaW5nXS5jbGFzc0xpc3QucmVtb3ZlKCdzZWN0aW9uLS1hY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGRpc3BsYXkuc3R5bGUuY3NzVGV4dCA9IGB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoJHtwb3NpdGlvbn0pO2A7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdGluc2Nyb2xsID0gZmFsc2U7XHJcblx0XHRcdH0sIDIwMCArIDMwMCk7XHJcblx0XHR9XHJcblx0fSBcclxuXHJcblx0Y29uc3Qgc2Nyb2xsVmlld3BvcnQgPSBkaXJlY3Rpb24gPT4ge1xyXG5cdFx0XHJcblx0XHRsZXQgYWN0aXZlU2VjdGlvbiA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChzZWN0aW9uc1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ3NlY3Rpb24tLWFjdGl2ZScpKSB7XHJcblx0XHRcdFx0YWN0aXZlU2VjdGlvbiA9IGk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Y29uc3QgcHJldlNlY3Rpb24gPSBhY3RpdmVTZWN0aW9uIC0gMTtcclxuXHRcdGNvbnN0IG5leHRTZWN0aW9uID0gYWN0aXZlU2VjdGlvbiArIDE7XHJcblxyXG5cdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnICYmIHByZXZTZWN0aW9uID49IDApIHtcclxuXHRcdFx0cGVyZm9ybVRyYW5zaXRpb24ocHJldlNlY3Rpb24pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkaXJlY3Rpb24gPT09ICduZXh0JyAmJiBuZXh0U2VjdGlvbiA8IHNlY3Rpb25zLmxlbmd0aCkge1xyXG5cdFx0XHRwZXJmb3JtVHJhbnNpdGlvbihuZXh0U2VjdGlvbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChlKSA9PiB7XHJcblx0XHRsZXQgZGVsdGFZID0gZS5kZWx0YVk7XHJcblx0XHRcclxuXHRcdGlmIChkZWx0YVkgPiAwKSB7XHJcblx0XHRcdHNjcm9sbFZpZXdwb3J0KCduZXh0JylcclxuXHRcdH0gXHJcblx0XHRcclxuXHRcdGlmIChkZWx0YVkgPCAwKSB7XHJcblx0XHRcdHNjcm9sbFZpZXdwb3J0KCdwcmV2Jyk7XHJcblx0XHR9IFxyXG5cclxuXHR9KTtcclxuXHJcblxyXG5cdGZ1bmN0aW9uIGdldFNpYmxpbmdzKGVsZW0pIHtcclxuICAgIGxldCBzaWJsaW5ncyA9IFtdO1xyXG4gICAgbGV0IHNpYmxpbmcgPSBlbGVtO1xyXG4gICAgd2hpbGUgKHNpYmxpbmcucHJldmlvdXNTaWJsaW5nKSB7XHJcbiAgICAgICAgc2libGluZyA9IHNpYmxpbmcucHJldmlvdXNTaWJsaW5nO1xyXG4gICAgICAgIHNpYmxpbmcubm9kZVR5cGUgPT0gMSAmJiBzaWJsaW5ncy5wdXNoKHNpYmxpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNpYmxpbmcgPSBlbGVtO1xyXG4gICAgd2hpbGUgKHNpYmxpbmcubmV4dFNpYmxpbmcpIHtcclxuICAgICAgICBzaWJsaW5nID0gc2libGluZy5uZXh0U2libGluZztcclxuICAgICAgICBzaWJsaW5nLm5vZGVUeXBlID09IDEgJiYgc2libGluZ3MucHVzaChzaWJsaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2libGluZ3M7XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG5cclxuXHRzd2l0Y2goZS5rZXlDb2RlKSB7XHJcblx0XHRjYXNlIDM4IDogXHJcblx0XHRcdHNjcm9sbFZpZXdwb3J0KCdwcmV2Jyk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSA0MCA6XHJcblx0XHRcdHNjcm9sbFZpZXdwb3J0KCduZXh0Jyk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdH1cclxufSk7XHJcblxyXG5cclxuZm9yIChsZXQgaT0wOyBpIDwgZGF0YVNjcm9sbC5sZW5ndGg7IGkrKykge1xyXG5cdGRhdGFTY3JvbGxbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0bGV0IHRhcmdldCA9IHBhcnNlSW50KGUudGFyZ2V0LmRhdGFzZXQuc2Nyb2xsVG8pO1xyXG5cdFx0cGVyZm9ybVRyYW5zaXRpb24odGFyZ2V0KTtcclxuXHR9KVxyXG59XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0bGV0IHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cdGxldCBwbGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvY29udGVudF9fcGxheS1idG4nKTtcclxuXHRsZXQgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW9jb250ZW50X19wYXVzZS1idG4nKTtcclxuXHRsZXQgcGxheUJ1dHRvbkNvbnRyb2xzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX19wbGF5Jyk7XHJcblx0bGV0IHBhdXNlQnV0dG9uQ29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3BhdXNlJyk7XHJcblx0bGV0IGhpZGVDb250cm9scyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb2NvbnRlbnRfX2NvbnRyb2xzJyk7XHJcblx0bGV0IHZvbHVtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX192b2x1bWUtbGV2ZWwnKVxyXG5cdGxldCB2b2x1bWVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3ZvbHVtZScpO1xyXG5cdGxldCBjdXJyZW50VGltZUVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3RpbWVsaW5lLWN1cnJlbnQnKTtcclxuXHRsZXQgdG90YWxUaW1lRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdGltZWxpbmUtdG90YWwnKTtcclxuXHRsZXQgc3BlZWRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3NwZWVkLWJ0bicpO1xyXG5cdGxldCB0aW1lbGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdGltZWxpbmUnKTtcclxuXHJcblx0bGV0IHBsYXllcjtcclxuXHRvbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9ICgpID0+IHtcclxuXHRcdHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoJ3ZpZGVvY29udGVudF9faWZyYW1lJywge1xyXG5cdFx0XHR2aWRlb0lkOiAnV2RjOEl1VTdmb0UnLFxyXG5cdFx0XHRldmVudHM6IHtcclxuXHRcdFx0XHRvblJlYWR5OiBvblBsYXllclJlYWR5LFxyXG5cdFx0XHRcdG9uU3RhdGVDaGFuZ2U6IG9uUGxheWVyU3RhdGVDaGFuZ2VcclxuXHRcdFx0fSxcclxuXHRcdFx0cGxheWVyVmFyczoge1xyXG5cdFx0XHRcdGNvbnRyb2xzOiAwLFxyXG5cdFx0XHRcdGRpc2FibGVrYjogMCxcclxuXHRcdFx0XHRzaG93aW5mbzogMCxcclxuXHRcdFx0XHRyZWw6IDAsXHJcblx0XHRcdFx0YXV0b3BsYXk6IDAsXHJcblx0XHRcdFx0bW9kZXN0YnJhbmRpbmc6IDAsXHJcblx0XHRcdFx0cGxheXNpbmxpbmU6IDEsXHJcblx0XHRcdFx0ZnM6IDBcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRvblBsYXllclJlYWR5ID0gKCkgPT4ge1xyXG5cdFx0cGxheVBhdXNlVmlkZW9PblBsYXllclJlYWR5KCk7XHJcblx0XHRzZXRUb3RhbFRpbWUoKTtcclxuXHRcdHNldFRpbWVsaW5lUGFyYW1zKCk7XHJcblx0fVxyXG5cclxuXHRvblBsYXllclN0YXRlQ2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0cGxheVBhdXNlVmlkZW9PblBsYXllclN0YXRlQ2hhbmdlKCk7XHJcblx0XHRzZXRWb2x1bWUoKTtcclxuXHRcdG11dGVWb2x1bWUoKTtcclxuXHRcdHNldEludGVydmFsKHNldEN1cnJlbnRUaW1lLCA1MDApO1xyXG5cdFx0Y2hhbmdlU3BlZWQoKTtcclxuXHRcdGNoYW5nZVRpbWUoKTtcclxuXHR9XHJcblxyXG5cdHBsYXlQYXVzZVZpZGVvT25QbGF5ZXJSZWFkeSA9ICgpID0+IHtcclxuXHRcdHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVQbGF5KTtcclxuXHRcdHBsYXlCdXR0b25Db250cm9scy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZVBsYXkpO1xyXG5cdH1cclxuXHJcblxyXG5cdHBsYXlQYXVzZVZpZGVvT25QbGF5ZXJTdGF0ZUNoYW5nZSA9ICgpID0+IHtcclxuXHRcdGlmIChwbGF5ZXIuZ2V0UGxheWVyU3RhdGUoKSA9PSAyKSB7XHJcblx0XHRcdHRvZ2dsZVBhdXNlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHBsYXllci5nZXRQbGF5ZXJTdGF0ZSgpID09IDApIHtcclxuXHRcdFx0dG9nZ2xlU3RvcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBhdXNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHR0b2dnbGVQYXVzZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0cGF1c2VCdXR0b25Db250cm9scy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0dG9nZ2xlUGF1c2UoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0XHJcblx0Ly9wbGF5IHBhdXNlXHJcblx0dG9nZ2xlUGxheSA9ICgpID0+IHtcclxuXHRcdHBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgndmlkZW9jb250ZW50X19wbGF5LWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRwYXVzZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd2aWRlb2NvbnRlbnRfX3BhdXNlLWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRwYXVzZUJ1dHRvbkNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzX19wYXVzZS0tYWN0aXZlJyk7XHJcblx0XHRwbGF5QnV0dG9uQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgnY29udHJvbHNfX3BsYXktLWFjdGl2ZScpO1xyXG5cdFx0aGlkZUNvbnRyb2xzLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fY29udHJvbHMtLXBhdXNlZCcpO1xyXG5cdFx0cGxheWVyLnBsYXlWaWRlbygpO1xyXG5cdH1cclxuXHJcblx0dG9nZ2xlUGF1c2UgPSAoKSA9PiB7XHJcblx0XHRwbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGxheS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0cGF1c2VCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9jb250ZW50X19wYXVzZS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0cGF1c2VCdXR0b25Db250cm9scy5jbGFzc0xpc3QucmVtb3ZlKCdjb250cm9sc19fcGF1c2UtLWFjdGl2ZScpO1xyXG5cdFx0cGxheUJ1dHRvbkNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2NvbnRyb2xzX19wbGF5LS1hY3RpdmUnKTtcclxuXHRcdGhpZGVDb250cm9scy5jbGFzc0xpc3QuYWRkKCd2aWRlb2NvbnRlbnRfX2NvbnRyb2xzLS1wYXVzZWQnKTtcclxuXHRcdHBsYXllci5wYXVzZVZpZGVvKCk7XHJcblx0fVxyXG5cclxuXHR0b2dnbGVTdG9wID0gKCkgPT4ge1xyXG5cdFx0cGxheUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlb2NvbnRlbnRfX3BsYXktYnRuLS1hY3RpdmUnKTtcclxuXHRcdHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGF1c2UtYnRuLS1hY3RpdmUnKTtcclxuXHRcdHBhdXNlQnV0dG9uQ29udHJvbHMuY2xhc3NMaXN0LnJlbW92ZSgnY29udHJvbHNfX3BhdXNlLS1hY3RpdmUnKTtcclxuXHRcdHBsYXlCdXR0b25Db250cm9scy5jbGFzc0xpc3QuYWRkKCdjb250cm9sc19fcGxheS0tYWN0aXZlJyk7XHJcblx0XHRwbGF5ZXIuc3RvcFZpZGVvKCk7XHJcblx0fVxyXG5cclxuXHQvL3ZvbHVtZVxyXG5cdG11dGVWb2x1bWUgPSAoKSA9PiB7XHJcblx0XHR2b2x1bWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PntcclxuXHRcdFx0aWYgKHBsYXllci5pc011dGVkKCkpIHtcclxuXHRcdFx0XHRwbGF5ZXIudW5NdXRlKCk7XHJcblx0XHRcdFx0dm9sdW1lQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbnRyb2xzX192b2x1bWUtLW11dGVkJyk7XHJcblx0XHRcdFx0cGxheWVyLnNldFZvbHVtZSg1MCk7XHJcblx0XHRcdFx0dm9sdW1lSW5wdXQudmFsdWUgPSA1MDtcclxuXHRcdFx0fSBlbHNlIFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cGxheWVyLm11dGUoKTtcclxuXHRcdFx0XHR2b2x1bWVCdXR0b24uY2xhc3NMaXN0LmFkZCgnY29udHJvbHNfX3ZvbHVtZS0tbXV0ZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzZXRWb2x1bWUgPSAoKSA9PiB7XHJcblx0XHRwbGF5ZXIuc2V0Vm9sdW1lKHZvbHVtZUlucHV0LnZhbHVlKTtcclxuXHRcdHZvbHVtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuXHRcdFx0cGxheWVyLnNldFZvbHVtZShlLnRhcmdldC52YWx1ZSk7XHJcblx0XHRcdGlmKGUudGFyZ2V0LnZhbHVlID09IDApIHtcclxuXHRcdFx0XHR2b2x1bWVCdXR0b24uY2xhc3NMaXN0LmFkZCgnY29udHJvbHNfX3ZvbHVtZS0tbXV0ZWQnKTtcclxuXHRcdFx0XHRwbGF5ZXIubXV0ZSgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZvbHVtZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdjb250cm9sc19fdm9sdW1lLS1tdXRlZCcpO1xyXG5cdFx0XHRcdHBsYXllci51bk11dGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdC8vZHVyYXRpb25cclxuXHRzZXRUb3RhbFRpbWUgPSAoKSA9PiB7XHJcblx0XHR0b3RhbFRpbWVFbGVtLmlubmVySFRNTCA9IGZvcm1hdER1cnRpb24ocGxheWVyLmdldER1cmF0aW9uKCkpO1xyXG5cdH1cclxuXHJcblx0c2V0Q3VycmVudFRpbWUgPSAoKSA9PiB7XHJcblx0XHRjdXJyZW50VGltZUVsZW0uaW5uZXJIVE1MID0gZm9ybWF0RHVydGlvbihwbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKSk7XHJcblx0XHR0aW1lbGluZS52YWx1ZSA9IHBsYXllci5nZXRDdXJyZW50VGltZSgpO1xyXG5cdH1cclxuXHJcblx0Zm9ybWF0RHVydGlvbiA9ICh0aW1lKSA9PiB7XHJcblx0XHRjb25zdCBzZWNvbmRzID0gTWF0aC5mbG9vcih0aW1lICUgNjApO1xyXG5cdFx0Y29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvIDYwKSAlIDYwIDtcclxuXHRcdGlmIChtaW51dGVzID09IDAgJiYgc2Vjb25kcyA8IDEwKSB7XHJcblx0XHRcdHJldHVybiAoJzA6MCcrYCR7c2Vjb25kc31gKTtcclxuXHRcdH0gZWxzZSBpZiAobWludXRlcyA9PSAwKSB7XHJcblx0XHRcdHJldHVybiAoJzA6JytgJHtzZWNvbmRzfWApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIChgJHttaW51dGVzfWArJzonK2Ake3NlY29uZHN9YCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Y2hhbmdlU3BlZWQgPSAoKSA9PiB7XHJcblx0XHRzcGVlZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoYW5nZVNwZWVkVmFsdWUpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlU3BlZWRWYWx1ZSA9ICgpID0+IHtcclxuXHRcdGlmIChwbGF5ZXIuZ2V0UGxheWJhY2tSYXRlKCkgPT0gMSkge1xyXG5cdFx0XHRwbGF5ZXIuc2V0UGxheWJhY2tSYXRlKDIpO1xyXG5cdFx0XHRzcGVlZEJ1dHRvbi5pbm5lckhUTUwgPSBcIjJ4XCI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwbGF5ZXIuc2V0UGxheWJhY2tSYXRlKDEpO1xyXG5cdFx0XHRzcGVlZEJ1dHRvbi5pbm5lckhUTUwgPSBcIjF4XCI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Ly90aW1lbGluZVxyXG5cdHNldFRpbWVsaW5lUGFyYW1zID0gKCkgPT4ge1xyXG5cdFx0dGltZWxpbmUuc2V0QXR0cmlidXRlKCdtaW4nLCAwKTtcclxuXHRcdHRpbWVsaW5lLnNldEF0dHJpYnV0ZSgnbWF4JywgcGxheWVyLmdldER1cmF0aW9uKCkpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlVGltZSA9ICgpID0+IHtcclxuXHRcdHRpbWVsaW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuXHRcdFx0cGxheWVyLnNlZWtUbyhlLnRhcmdldC52YWx1ZSk7XHJcblx0XHRcdHRvZ2dsZVBsYXkoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxufSkoKTsiXX0=
