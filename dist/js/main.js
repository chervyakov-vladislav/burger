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
	
})();;(function () {
	// не удалось подключить через iframe, создал через js
	let tag = document.createElement('script');
	let playButton = document.querySelector('.videocontent__play-btn');
	let pauseButton = document.querySelector('.videocontent__pause-btn');

	tag.src = "https://www.youtube.com/iframe_api";
	let firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
		player.setVolume(50);
		playButton.addEventListener('click', () => {
			playButton.classList.add('videocontent__play-btn--active');
			pauseButton.classList.add('videocontent__pause-btn--active');
			player.playVideo();
		});
	}

	onPlayerStateChange = () => {
		if (player.getPlayerState() == 2 || player.getPlayerState() == 0) {
			playButton.classList.remove('videocontent__play-btn--active');
			pauseButton.classList.remove('videocontent__pause-btn--active');
			player.pauseVideo();
		}
		pauseButton.addEventListener('click', () => {
			playButton.classList.remove('videocontent__play-btn--active');
			pauseButton.classList.remove('videocontent__pause-btn--active');
			player.pauseVideo();
		});

	}
})();


// getPlayerState() статус видео
//-1 – воспроизведение видео не началось
// 0 – воспроизведение видео завершено
// 1 – воспроизведение
// 2 – пауза
// 3 – буферизация
// 5 – видео находится в очереди
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzY3JpcHRzL21vZHVsZS1hIGNvcHkuanMiLCJzY3JpcHRzL3ZpZGVvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQ2xQQTtBQUNBO0FBQ0EsTUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpO1xyXG5cclxuLy8gaGFtYnVyZ2VyIG1lbnUgaGVhZGVyLS1mdWxsc2NyZWVuXHJcblxyXG5jb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XHJcbmNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcblxyXG5oZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdGNvbnN0IGhhbWJ1cmdlciA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5oYW1idXJnZXItbWVudScpO1xyXG5cdGlmIChoYW1idXJnZXIgJiYgZS50YXJnZXQuY2xvc2VzdCgnLmhlYWRlci0tZnVsbHNjcmVlbicpKSB7XHJcblx0XHRoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyLS1mdWxsc2NyZWVuJyk7XHJcblx0XHRib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2luaGVyaXQnO1xyXG5cdH1cclxuXHRlbHNlIGlmIChoYW1idXJnZXIgJiYgZS50YXJnZXQuY2xvc2VzdCgnLmhhbWJ1cmdlci1tZW51JykpIHtcclxuXHRcdGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItLWZ1bGxzY3JlZW4nKTtcclxuXHRcdGJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHR9XHJcbn0pO1xyXG5cclxuLy9idXJnZXJzLWNvbXBvc2l0aW9uLWNsb3NlLWJ0blxyXG5jb25zdCBob3ZlckNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbXBvc2l0aW9uX19jbG9zZS1idG4nKTtcclxuY29uc3QgaG92ZXJPcGVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ1cmdlci1jYXJkX19jb21wb3NpdGlvbi0taXRlbScpO1xyXG5cclxuaG92ZXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXItY2FyZF9fY29tcG9zaXRpb24tLWhvdmVyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufSk7XHJcblxyXG5pZiAoc2NyZWVuLndpZHRoIDwgNzY5KSB7XHJcblx0aG92ZXJPcGVuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXItY2FyZF9fY29tcG9zaXRpb24tLWhvdmVyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vb3ZlcmxheSByZXZpZXdzXHJcbmNvbnN0IHJldmlld0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXZpZXdzX19idG4nKTtcclxuY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmV2aWV3c1BvcHVwJykuaW5uZXJIVE1MO1xyXG5cclxuZm9yIChpID0gMDsgaSA8IHJldmlld0J1dHRvbi5sZW5ndGg7IGkrKykge1xyXG5cdHJldmlld0J1dHRvbltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCByZXZpZXdzVGl0bGUgPSBlLnBhdGhbMl0ucXVlcnlTZWxlY3RvcignLnJldmlld3NfX3RpdGxlJykuaW5uZXJIVE1MO1xyXG5cdFx0bGV0IHJldmlld3NUZXh0ID0gZS5wYXRoWzJdLnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX190ZXh0JykuaW5uZXJIVE1MO1xyXG5cdFx0bGV0IHN1Y2Nlc3NPdmVybGF5ID0gY3JlYXRlT3ZlcmxheShyZXZpZXdzVGl0bGUsIHJldmlld3NUZXh0KTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmV2aWV3c1wiKS5hcHBlbmQoc3VjY2Vzc092ZXJsYXkpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVPdmVybGF5KHRpdGxlLCB0ZXh0KSB7XHJcblx0Ly8g0LrQsNC6INGB0L7Qt9C00LDQstCw0YLRjCDRiNCw0LHQu9C+0L0g0LHQtdC3INC70LjRiNC90LXQs9C+INC00LjQstCwP1xyXG5cdGNvbnN0IG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRuZXdFbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlO1xyXG5cclxuXHRjb25zdCBjbG9zZU92ZXJsYXkgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5X19jbG9zZS1idG4nKTtcclxuXHRjb25zdCBjbG9zZU92ZXJsYXlCZyA9IG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuXHJcblx0Y2xvc2VPdmVybGF5QmcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUudGFyZ2V0ID09PSBjbG9zZU92ZXJsYXlCZykge1xyXG5cdFx0XHRjbG9zZU92ZXJsYXkuY2xpY2soKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRjbG9zZU92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld3MnKS5yZW1vdmVDaGlsZChuZXdFbGVtZW50KTtcclxuXHR9KVxyXG5cclxuXHRuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX19vdmVybGF5LS10aXRsZScpLmlubmVySFRNTCA9IHRpdGxlO1xyXG5cdG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnJldmlld3NfX292ZXJsYXktLXRleHQnKS5pbm5lckhUTUwgPSB0ZXh0O1xyXG5cclxuXHRyZXR1cm4gbmV3RWxlbWVudDtcclxufVxyXG5cclxuLy9hY2NvcmRlb25cclxuXHJcbmNvbnN0IGl0ZW1WZXJ0QWNjb3JkZW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnZlcnRpY2FsLWFjY29yZGVvbl9faXRlbScpO1xyXG5mb3IgKGkgPSAwOyBpIDwgaXRlbVZlcnRBY2NvcmRlb24ubGVuZ3RoOyBpKyspIHtcclxuXHRpdGVtVmVydEFjY29yZGVvbltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRpZiAoZS50YXJnZXQuY2xvc2VzdCgnLnZlcnRpY2FsLWFjY29yZGVvbl9faXRlbScpLmNsYXNzTGlzdC5jb250YWlucygndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKSkge1xyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcudmVydGljYWwtYWNjb3JkZW9uX19pdGVtJykuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgaXRlbVZlcnRBY2NvcmRlb24ubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRpdGVtVmVydEFjY29yZGVvbltqXS5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGUudGFyZ2V0LmNsb3Nlc3QoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKS5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG4vL3RlYW0tYWNjb3JkZW9uXHJcbmNvbnN0IGl0ZW1UZWFtQWNjb3JkZW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN0YWZmX19pdGVtJyk7XHJcbmZvciAoaSA9IDA7IGkgPCBpdGVtVGVhbUFjY29yZGVvbi5sZW5ndGg7IGkrKykge1xyXG5cdGl0ZW1UZWFtQWNjb3JkZW9uW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLnRhcmdldC5jbG9zZXN0KCcuc3RhZmZfX2l0ZW0nKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N0YWZmX19hY3RpdmUnKSkge1xyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcuc3RhZmZfX2l0ZW0nKS5jbGFzc0xpc3QucmVtb3ZlKCdzdGFmZl9fYWN0aXZlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGl0ZW1UZWFtQWNjb3JkZW9uLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0aXRlbVRlYW1BY2NvcmRlb25bal0uY2xhc3NMaXN0LnJlbW92ZSgnc3RhZmZfX2FjdGl2ZScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGUudGFyZ2V0LmNsb3Nlc3QoJy5zdGFmZl9faXRlbScpLmNsYXNzTGlzdC5hZGQoJ3N0YWZmX19hY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuLy8gc2xpZGVyXHJcbi8vINC90LUg0YHQtNC10LvQsNC90Ysg0LHRg9C70LvQtdGC0Ysg0YHQvdC40LfRg1xyXG5sZXQgc2xpZGVyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlci1jb250YWluZXJfX2xpc3QnKTtcclxubGV0IHNsaWRlckNhcm91c2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlci1jb250YWluZXJfX2l0ZW1zJyk7XHJcbmxldCBzbGlkZXJJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlci1jb250YWluZXJfX2l0ZW0nKTtcclxubGV0IGNvbnRlbnRXaWR0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItY29udGFpbmVyX19saXN0JykuY2xpZW50V2lkdGg7XHJcbmxldCBzbGlkZXJMZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NsaWRlci1sZWZ0Jyk7XHJcbmxldCBzbGlkZXJSaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXItcmlnaHQnKTtcclxuXHJcbmNvbnN0IG1pblJpZ2h0ID0gMDtcclxuY29uc3QgbWF4UmlnaHQgPSBjb250ZW50V2lkdGggKiBzbGlkZXJJdGVtLmxlbmd0aDtcclxuY29uc3Qgc3RlcCA9IGNvbnRlbnRXaWR0aDtcclxubGV0IGN1cnJlbnRSaWdodCA9IDA7XHJcblxyXG5mb3IgKGkgPSAwOyBpIDwgc2xpZGVySXRlbS5sZW5ndGg7IGkrKykge1xyXG5cdHNsaWRlckl0ZW1baV0uc3R5bGUubWluV2lkdGggPSBjb250ZW50V2lkdGggKyBcInB4XCI7XHJcbn1cclxuXHJcbnNsaWRlckxlZnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0aWYgKE1hdGguYWJzKGN1cnJlbnRSaWdodCkgPiBtaW5SaWdodCkge1xyXG5cdFx0Y3VycmVudFJpZ2h0ICs9IHN0ZXA7XHJcblx0XHRzbGlkZXJDYXJvdXNlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2N1cnJlbnRSaWdodH1weClgO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzbGlkZXJDYXJvdXNlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgtJHttYXhSaWdodCAtIHN0ZXB9cHgpYDtcclxuXHRcdGN1cnJlbnRSaWdodCA9IC0obWF4UmlnaHQgLSBzdGVwKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuc2xpZGVyUmlnaHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0aWYgKE1hdGguYWJzKGN1cnJlbnRSaWdodCkgPCAobWF4UmlnaHQgLSBzdGVwKSkge1xyXG5cdFx0Y3VycmVudFJpZ2h0IC09IHN0ZXA7XHJcblx0XHRzbGlkZXJDYXJvdXNlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2N1cnJlbnRSaWdodH1weClgO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRzbGlkZXJDYXJvdXNlbC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgwcHgpYDtcclxuXHRcdGN1cnJlbnRSaWdodCA9IDA7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vZm9ybSBwb3B1cCDQstGL0YLQsNGB0LrQuNCy0LDQtdC8INGI0LDQsdC70L7QvSDQv9C+0L/QsNC/0LAg0Lgg0LfQsNC60LjQtNGL0LLQsNC10Lwg0LIg0YTQvtGA0LzRg1xyXG5jb25zdCB0ZW1wbGF0ZUZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZm9ybVBvcHVwJykuaW5uZXJIVE1MO1xyXG5jb25zdCBzZW5kQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NlbmRCdG4nKTtcclxuY29uc3Qgc2VuZEZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fZWxlbScpO1xyXG5cclxubGV0IGRhdGFGb3JtO1xyXG5sZXQgdGV4dEZvcm1Qb3B1cDtcclxubGV0IHRleHRGb3JtUG9wdXBFcnJvciA9ICfQktGLINC90LUg0LLQstC10LvQuC4uLiAnO1xyXG5cclxuc2VuZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRpZiAoIXZhbGlkYXRlRm9ybShzZW5kRm9ybSkpIHtcclxuXHRcdGNyZWF0ZUZvcm1PdmVybGF5KHRleHRGb3JtUG9wdXApO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9ICcnO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRsZXQgZm9ybURhdGEgPSBjcmVhdGVEYXRhKCk7XHJcblx0XHRjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdHhoci5vcGVuKCdQT1NUJywgJ2h0dHBzOi8vd2ViZGV2LWFwaS5sb2Z0c2Nob29sLmNvbS9zZW5kbWFpbCcpXHJcblx0XHR4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xyXG5cdFx0eGhyLnNlbmQoZm9ybURhdGEpO1xyXG5cdFx0eGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh4aHIucmVzcG9uc2Uuc3RhdHVzID09PSAxKSB7XHJcblx0XHRcdFx0dGV4dEZvcm1Qb3B1cCA9IHhoci5yZXNwb25zZS5tZXNzYWdlO1xyXG5cdFx0XHRcdGNyZWF0ZUZvcm1PdmVybGF5KHRleHRGb3JtUG9wdXApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRleHRGb3JtUG9wdXAgPSB4aHIucmVzcG9uc2UubWVzc2FnZTtcclxuXHRcdFx0XHRjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0Rm9ybVBvcHVwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gJyc7XHJcblx0fVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1PdmVybGF5KHRleHQpIHtcclxuXHRjb25zdCBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0bmV3RWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZUZvcm07XHJcblxyXG5cdGNvbnN0IGNsb3NlT3ZlcmxheSA9IG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi0tb3ZlcmxheScpO1xyXG5cdGNvbnN0IGNsb3NlT3ZlcmxheUJnID0gbmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheScpO1xyXG5cclxuXHRjbG9zZU92ZXJsYXlCZy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQgPT09IGNsb3NlT3ZlcmxheUJnKSB7XHJcblx0XHRcdGNsb3NlT3ZlcmxheS5jbGljaygpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdGNsb3NlT3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3JkZXInKS5yZW1vdmVDaGlsZChuZXdFbGVtZW50KTtcclxuXHR9KVxyXG5cclxuXHRuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX19vdmVybGF5LS10ZXh0JykuaW5uZXJIVE1MID0gdGV4dDtcclxuXHJcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vcmRlclwiKS5hcHBlbmQobmV3RWxlbWVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlRm9ybShmb3JtKSB7XHJcblx0bGV0IHZhbGlkID0gdHJ1ZTtcclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMuY29tbWVudCkpIHtcclxuXHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gdGV4dEZvcm1Qb3B1cEVycm9yICsgXCLQmtC+0LzQvNC10L3RgtCw0YDQuNC5IVwiO1xyXG5cdH1cclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMucGhvbmUpKSB7XHJcblx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9IHRleHRGb3JtUG9wdXBFcnJvciArIFwi0KLQtdC70LXRhNC+0L0hXCI7XHJcblx0fVxyXG5cclxuXHRpZiAoIXZhbGlkYXRlRmllbGQoZm9ybS5lbGVtZW50cy5uYW1lKSkge1xyXG5cdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSB0ZXh0Rm9ybVBvcHVwRXJyb3IgKyBcItCY0LzRjyFcIjtcclxuXHR9XHJcblxyXG5cdHJldHVybiB2YWxpZDtcclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVGaWVsZChmaWVsZCkge1xyXG5cdHJldHVybiBmaWVsZC5jaGVja1ZhbGlkaXR5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZURhdGEoKSB7XHJcblx0bGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKHNlbmRGb3JtKTtcclxuXHJcblx0Zm9ybURhdGEuYXBwZW5kKFwibmFtZVwiLCBzZW5kRm9ybS5lbGVtZW50cy5uYW1lLnZhbHVlKTtcclxuXHRmb3JtRGF0YS5hcHBlbmQoXCJwaG9uZVwiLCBzZW5kRm9ybS5lbGVtZW50cy5waG9uZS52YWx1ZSk7XHJcblx0Zm9ybURhdGEuYXBwZW5kKFwiY29tbWVudFwiLCBzZW5kRm9ybS5lbGVtZW50cy5jb21tZW50LnZhbHVlKTtcclxuXHRmb3JtRGF0YS5hcHBlbmQoXCJ0b1wiLCBcInZhc3lAbGl5LmNvbVwiKTtcclxuXHJcblx0cmV0dXJuIGZvcm1EYXRhO1xyXG5cdC8vINC/0L7Rh9C10LzRgyDQvdC1INGB0YDQsNCx0L7RgtCw0Lsgc3RyaW5naWZ5P1xyXG5cdC8vIGRhdGFGb3JtID0ge1xyXG5cdC8vIFx0XCJuYW1lXCI6IHNlbmRGb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUsXHJcblx0Ly8gXHRcInBob25lXCI6IHNlbmRGb3JtLmVsZW1lbnRzLnBob25lLnZhbHVlLFxyXG5cdC8vIFx0XCJjb21tZW50XCI6IFwidmFzeUBsaXkuY29tXCIsXHJcblx0Ly8gXHRcInRvXCI6IFwidmFzeUBsaXkuY29tXCJcclxuXHQvLyB9XHJcblx0Ly8gcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGFGb3JtKTtcclxufSIsIjsoZnVuY3Rpb24oKSB7XHJcblx0XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQvLyDQvdC1INGD0LTQsNC70L7RgdGMINC/0L7QtNC60LvRjtGH0LjRgtGMINGH0LXRgNC10LcgaWZyYW1lLCDRgdC+0LfQtNCw0Lsg0YfQtdGA0LXQtyBqc1xyXG5cdGxldCB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuXHRsZXQgcGxheUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlb2NvbnRlbnRfX3BsYXktYnRuJyk7XHJcblx0bGV0IHBhdXNlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvY29udGVudF9fcGF1c2UtYnRuJyk7XHJcblxyXG5cdHRhZy5zcmMgPSBcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGlcIjtcclxuXHRsZXQgZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XHJcblx0Zmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGFnLCBmaXJzdFNjcmlwdFRhZyk7XHJcblxyXG5cdGxldCBwbGF5ZXI7XHJcblx0b25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkgPSAoKSA9PiB7XHJcblx0XHRwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCd2aWRlb2NvbnRlbnRfX2lmcmFtZScsIHtcclxuXHRcdFx0dmlkZW9JZDogJ1dkYzhJdVU3Zm9FJyxcclxuXHRcdFx0ZXZlbnRzOiB7XHJcblx0XHRcdFx0b25SZWFkeTogb25QbGF5ZXJSZWFkeSxcclxuXHRcdFx0XHRvblN0YXRlQ2hhbmdlOiBvblBsYXllclN0YXRlQ2hhbmdlXHJcblx0XHRcdH0sXHJcblx0XHRcdHBsYXllclZhcnM6IHtcclxuXHRcdFx0XHRjb250cm9sczogMCxcclxuXHRcdFx0XHRkaXNhYmxla2I6IDAsXHJcblx0XHRcdFx0c2hvd2luZm86IDAsXHJcblx0XHRcdFx0cmVsOiAwLFxyXG5cdFx0XHRcdGF1dG9wbGF5OiAwLFxyXG5cdFx0XHRcdG1vZGVzdGJyYW5kaW5nOiAwLFxyXG5cdFx0XHRcdHBsYXlzaW5saW5lOiAxLFxyXG5cdFx0XHRcdGZzOiAwXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0b25QbGF5ZXJSZWFkeSA9ICgpID0+IHtcclxuXHRcdHBsYXllci5zZXRWb2x1bWUoNTApO1xyXG5cdFx0cGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0cGxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd2aWRlb2NvbnRlbnRfX3BsYXktYnRuLS1hY3RpdmUnKTtcclxuXHRcdFx0cGF1c2VCdXR0b24uY2xhc3NMaXN0LmFkZCgndmlkZW9jb250ZW50X19wYXVzZS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0XHRwbGF5ZXIucGxheVZpZGVvKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdG9uUGxheWVyU3RhdGVDaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRpZiAocGxheWVyLmdldFBsYXllclN0YXRlKCkgPT0gMiB8fCBwbGF5ZXIuZ2V0UGxheWVyU3RhdGUoKSA9PSAwKSB7XHJcblx0XHRcdHBsYXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgndmlkZW9jb250ZW50X19wbGF5LWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRcdHBhdXNlQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGF1c2UtYnRuLS1hY3RpdmUnKTtcclxuXHRcdFx0cGxheWVyLnBhdXNlVmlkZW8oKTtcclxuXHRcdH1cclxuXHRcdHBhdXNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHRwbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZpZGVvY29udGVudF9fcGxheS1idG4tLWFjdGl2ZScpO1xyXG5cdFx0XHRwYXVzZUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCd2aWRlb2NvbnRlbnRfX3BhdXNlLWJ0bi0tYWN0aXZlJyk7XHJcblx0XHRcdHBsYXllci5wYXVzZVZpZGVvKCk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG59KSgpO1xyXG5cclxuXHJcbi8vIGdldFBsYXllclN0YXRlKCkg0YHRgtCw0YLRg9GBINCy0LjQtNC10L5cclxuLy8tMSDigJMg0LLQvtGB0L/RgNC+0LjQt9Cy0LXQtNC10L3QuNC1INCy0LjQtNC10L4g0L3QtSDQvdCw0YfQsNC70L7RgdGMXHJcbi8vIDAg4oCTINCy0L7RgdC/0YDQvtC40LfQstC10LTQtdC90LjQtSDQstC40LTQtdC+INC30LDQstC10YDRiNC10L3QvlxyXG4vLyAxIOKAkyDQstC+0YHQv9GA0L7QuNC30LLQtdC00LXQvdC40LVcclxuLy8gMiDigJMg0L/QsNGD0LfQsFxyXG4vLyAzIOKAkyDQsdGD0YTQtdGA0LjQt9Cw0YbQuNGPXHJcbi8vIDUg4oCTINCy0LjQtNC10L4g0L3QsNGF0L7QtNC40YLRgdGPINCyINC+0YfQtdGA0LXQtNC4Il19
