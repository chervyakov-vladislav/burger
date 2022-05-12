"use strict";

var i; // hamburger menu header--fullscreen

var header = document.querySelector('.header');
var body = document.querySelector('body');
header.addEventListener('click', function (e) {
  var hamburger = e.target.closest('.hamburger-menu');

  if (hamburger && e.target.closest('.header--fullscreen')) {
    header.classList.remove('header--fullscreen');
    body.style.overflow = 'inherit';
  } else if (hamburger && e.target.closest('.hamburger-menu')) {
    header.classList.add('header--fullscreen');
    body.style.overflow = 'hidden';
  }
}); //burgers-composition-close-btn

var hoverClose = document.querySelector('.composition__close-btn');
var hoverOpen = document.querySelector('.burger-card__composition--item');
hoverClose.addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelector('.burger-card__composition--hover').style.display = 'none';
});

if (screen.width < 769) {
  hoverOpen.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.burger-card__composition--hover').style.display = 'block';
  });
} //overlay reviews


var reviewButton = document.querySelectorAll('.reviews__btn');
var template = document.querySelector('#reviewsPopup').innerHTML;

for (i = 0; i < reviewButton.length; i++) {
  reviewButton[i].addEventListener("click", function (e) {
    var reviewsTitle = e.path[2].querySelector('.reviews__title').innerHTML;
    var reviewsText = e.path[2].querySelector('.reviews__text').innerHTML;
    var successOverlay = createOverlay(reviewsTitle, reviewsText);
    document.querySelector(".reviews").append(successOverlay);
  });
}

function createOverlay(title, text) {
  // как создавать шаблон без лишнего дива?
  var newElement = document.createElement('div');
  newElement.innerHTML = template;
  var closeOverlay = newElement.querySelector('.overlay__close-btn');
  var closeOverlayBg = newElement.querySelector('.overlay');
  closeOverlayBg.addEventListener('click', function (e) {
    if (e.target === closeOverlayBg) {
      closeOverlay.click();
    }
  });
  closeOverlay.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.reviews').removeChild(newElement);
  });
  newElement.querySelector('.reviews__overlay--title').innerHTML = title;
  newElement.querySelector('.reviews__overlay--text').innerHTML = text;
  return newElement;
} //accordeon


var itemVertAccordeon = document.querySelectorAll('.vertical-accordeon__item');

for (i = 0; i < itemVertAccordeon.length; i++) {
  itemVertAccordeon[i].addEventListener('click', function (e) {
    e.preventDefault();

    if (e.target.closest('.vertical-accordeon__item').classList.contains('vertical-accordeon__item--active')) {
      e.target.closest('.vertical-accordeon__item').classList.remove('vertical-accordeon__item--active');
    } else {
      for (var j = 0; j < itemVertAccordeon.length; j++) {
        itemVertAccordeon[j].classList.remove('vertical-accordeon__item--active');
      }

      e.target.closest('.vertical-accordeon__item').classList.add('vertical-accordeon__item--active');
    }
  });
} //team-accordeon


var itemTeamAccordeon = document.querySelectorAll('.staff__item');

for (i = 0; i < itemTeamAccordeon.length; i++) {
  itemTeamAccordeon[i].addEventListener('click', function (e) {
    if (e.target.closest('.staff__item').classList.contains('staff__active')) {
      e.target.closest('.staff__item').classList.remove('staff__active');
    } else {
      for (var j = 0; j < itemTeamAccordeon.length; j++) {
        itemTeamAccordeon[j].classList.remove('staff__active');
      }

      e.target.closest('.staff__item').classList.add('staff__active');
    }
  });
} // slider
// не сделаны буллеты снизу


var sliderContainer = document.querySelector('.slider-container__list');
var sliderCarousel = document.querySelector('.slider-container__items');
var sliderItem = document.querySelectorAll('.slider-container__item');
var contentWidth = document.querySelector('.slider-container__list').clientWidth;
var sliderLeft = document.querySelector('#slider-left');
var sliderRight = document.querySelector('#slider-right');
var minRight = 0;
var maxRight = contentWidth * sliderItem.length;
var step = contentWidth;
var currentRight = 0;

for (i = 0; i < sliderItem.length; i++) {
  sliderItem[i].style.minWidth = contentWidth + "px";
}

sliderLeft.addEventListener('click', function (e) {
  e.preventDefault();

  if (Math.abs(currentRight) > minRight) {
    currentRight += step;
    sliderCarousel.style.transform = "translateX(".concat(currentRight, "px)");
  } else {
    sliderCarousel.style.transform = "translateX(-".concat(maxRight - step, "px)");
    currentRight = -(maxRight - step);
  }
});
sliderRight.addEventListener('click', function (e) {
  e.preventDefault();

  if (Math.abs(currentRight) < maxRight - step) {
    currentRight -= step;
    sliderCarousel.style.transform = "translateX(".concat(currentRight, "px)");
  } else {
    sliderCarousel.style.transform = "translateX(0px)";
    currentRight = 0;
  }
}); //form popup вытаскиваем шаблон попапа и закидываем в форму

var templateForm = document.querySelector('#formPopup').innerHTML;
var sendButton = document.querySelector('#sendBtn');
var sendForm = document.querySelector('.form__elem');
var dataForm;
var textFormPopup;
var textFormPopupError = 'Вы не ввели... ';
sendButton.addEventListener('click', function (e) {
  e.preventDefault();

  if (!validateForm(sendForm)) {
    createFormOverlay(textFormPopup);
    textFormPopup = '';
  } else {
    var formData = createData();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
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
  var newElement = document.createElement('div');
  newElement.innerHTML = templateForm;
  var closeOverlay = newElement.querySelector('.btn--overlay');
  var closeOverlayBg = newElement.querySelector('.overlay');
  closeOverlayBg.addEventListener('click', function (e) {
    if (e.target === closeOverlayBg) {
      closeOverlay.click();
    }
  });
  closeOverlay.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.order').removeChild(newElement);
  });
  newElement.querySelector('.reviews__overlay--text').innerHTML = text;
  document.querySelector(".order").append(newElement);
}

function validateForm(form) {
  var valid = true;

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
  var formData = new FormData(sendForm);
  formData.append("name", sendForm.elements.name.value);
  formData.append("phone", sendForm.elements.phone.value);
  formData.append("comment", sendForm.elements.comment.value);
  formData.append("to", "vasy@liy.com");
  return formData; // почему не сработал stringify?
  // dataForm = {
  // 	"name": sendForm.elements.name.value,
  // 	"phone": sendForm.elements.phone.value,
  // 	"comment": "vasy@liy.com",
  // 	"to": "vasy@liy.com"
  // }
  // return JSON.stringify(dataForm);
}

;
;

(function () {
  console.log('world');
})();

;

(function () {
  console.log('hello world');
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzY3JpcHRzL21vZHVsZS1hIGNvcHkuanMiLCJzY3JpcHRzL21vZHVsZS1hLmpzIl0sIm5hbWVzIjpbImkiLCJoZWFkZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJoYW1idXJnZXIiLCJ0YXJnZXQiLCJjbG9zZXN0IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwic3R5bGUiLCJvdmVyZmxvdyIsImFkZCIsImhvdmVyQ2xvc2UiLCJob3Zlck9wZW4iLCJwcmV2ZW50RGVmYXVsdCIsImRpc3BsYXkiLCJzY3JlZW4iLCJ3aWR0aCIsInJldmlld0J1dHRvbiIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ0ZW1wbGF0ZSIsImlubmVySFRNTCIsImxlbmd0aCIsInJldmlld3NUaXRsZSIsInBhdGgiLCJyZXZpZXdzVGV4dCIsInN1Y2Nlc3NPdmVybGF5IiwiY3JlYXRlT3ZlcmxheSIsImFwcGVuZCIsInRpdGxlIiwidGV4dCIsIm5ld0VsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xvc2VPdmVybGF5IiwiY2xvc2VPdmVybGF5QmciLCJjbGljayIsInJlbW92ZUNoaWxkIiwiaXRlbVZlcnRBY2NvcmRlb24iLCJjb250YWlucyIsImoiLCJpdGVtVGVhbUFjY29yZGVvbiIsInNsaWRlckNvbnRhaW5lciIsInNsaWRlckNhcm91c2VsIiwic2xpZGVySXRlbSIsImNvbnRlbnRXaWR0aCIsImNsaWVudFdpZHRoIiwic2xpZGVyTGVmdCIsInNsaWRlclJpZ2h0IiwibWluUmlnaHQiLCJtYXhSaWdodCIsInN0ZXAiLCJjdXJyZW50UmlnaHQiLCJtaW5XaWR0aCIsIk1hdGgiLCJhYnMiLCJ0cmFuc2Zvcm0iLCJ0ZW1wbGF0ZUZvcm0iLCJzZW5kQnV0dG9uIiwic2VuZEZvcm0iLCJkYXRhRm9ybSIsInRleHRGb3JtUG9wdXAiLCJ0ZXh0Rm9ybVBvcHVwRXJyb3IiLCJ2YWxpZGF0ZUZvcm0iLCJjcmVhdGVGb3JtT3ZlcmxheSIsImZvcm1EYXRhIiwiY3JlYXRlRGF0YSIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInJlc3BvbnNlVHlwZSIsInNlbmQiLCJyZXNwb25zZSIsInN0YXR1cyIsIm1lc3NhZ2UiLCJmb3JtIiwidmFsaWQiLCJ2YWxpZGF0ZUZpZWxkIiwiZWxlbWVudHMiLCJjb21tZW50IiwicGhvbmUiLCJuYW1lIiwiZmllbGQiLCJjaGVja1ZhbGlkaXR5IiwiRm9ybURhdGEiLCJ2YWx1ZSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBQUEsQ0FBQSxDLENBRUE7O0FBRUEsSUFBQUMsTUFBQSxHQUFBQyxRQUFBLENBQUFDLGFBQUEsQ0FBQSxTQUFBLENBQUE7QUFDQSxJQUFBQyxJQUFBLEdBQUFGLFFBQUEsQ0FBQUMsYUFBQSxDQUFBLE1BQUEsQ0FBQTtBQUVBRixNQUFBLENBQUFJLGdCQUFBLENBQUEsT0FBQSxFQUFBLFVBQUFDLENBQUEsRUFBQTtFQUNBLElBQUFDLFNBQUEsR0FBQUQsQ0FBQSxDQUFBRSxNQUFBLENBQUFDLE9BQUEsQ0FBQSxpQkFBQSxDQUFBOztFQUNBLElBQUFGLFNBQUEsSUFBQUQsQ0FBQSxDQUFBRSxNQUFBLENBQUFDLE9BQUEsQ0FBQSxxQkFBQSxDQUFBLEVBQUE7SUFDQVIsTUFBQSxDQUFBUyxTQUFBLENBQUFDLE1BQUEsQ0FBQSxvQkFBQTtJQUNBUCxJQUFBLENBQUFRLEtBQUEsQ0FBQUMsUUFBQSxHQUFBLFNBQUE7RUFDQSxDQUhBLE1BSUEsSUFBQU4sU0FBQSxJQUFBRCxDQUFBLENBQUFFLE1BQUEsQ0FBQUMsT0FBQSxDQUFBLGlCQUFBLENBQUEsRUFBQTtJQUNBUixNQUFBLENBQUFTLFNBQUEsQ0FBQUksR0FBQSxDQUFBLG9CQUFBO0lBQ0FWLElBQUEsQ0FBQVEsS0FBQSxDQUFBQyxRQUFBLEdBQUEsUUFBQTtFQUNBO0FBQ0EsQ0FWQSxFLENBWUE7O0FBQ0EsSUFBQUUsVUFBQSxHQUFBYixRQUFBLENBQUFDLGFBQUEsQ0FBQSx5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SyxLQUFBLEVBQUE7RUFDQSxPQUFBQSxLQUFBLENBQUFDLGFBQUEsRUFBQTtBQUNBOztBQUVBLFNBQUFqQixVQUFBLEdBQUE7RUFDQSxJQUFBRCxRQUFBLEdBQUEsSUFBQW1CLFFBQUEsQ0FBQXpCLFFBQUEsQ0FBQTtFQUVBTSxRQUFBLENBQUFwQyxNQUFBLENBQUEsTUFBQSxFQUFBOEIsUUFBQSxDQUFBbUIsUUFBQSxDQUFBRyxJQUFBLENBQUFJLEtBQUE7RUFDQXBCLFFBQUEsQ0FBQXBDLE1BQUEsQ0FBQSxPQUFBLEVBQUE4QixRQUFBLENBQUFtQixRQUFBLENBQUFFLEtBQUEsQ0FBQUssS0FBQTtFQUNBcEIsUUFBQSxDQUFBcEMsTUFBQSxDQUFBLFNBQUEsRUFBQThCLFFBQUEsQ0FBQW1CLFFBQUEsQ0FBQUMsT0FBQSxDQUFBTSxLQUFBO0VBQ0FwQixRQUFBLENBQUFwQyxNQUFBLENBQUEsSUFBQSxFQUFBLGNBQUE7RUFFQSxPQUFBb0MsUUFBQSxDQVJBLENBU0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtBQUNBOztBQUFBO0FDbFBBOztBQUFBLENBQUEsWUFBQTtFQUNBcUIsT0FBQSxDQUFBQyxHQUFBLENBQUEsT0FBQTtBQUNBLENBRkE7O0FBRUE7O0FDRkEsQ0FBQSxZQUFBO0VBQ0FELE9BQUEsQ0FBQUMsR0FBQSxDQUFBLGFBQUE7QUFDQSxDQUZBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaTtcclxuXHJcbi8vIGhhbWJ1cmdlciBtZW51IGhlYWRlci0tZnVsbHNjcmVlblxyXG5cclxuY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpO1xyXG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRjb25zdCBoYW1idXJnZXIgPSBlLnRhcmdldC5jbG9zZXN0KCcuaGFtYnVyZ2VyLW1lbnUnKTtcclxuXHRpZiAoaGFtYnVyZ2VyICYmIGUudGFyZ2V0LmNsb3Nlc3QoJy5oZWFkZXItLWZ1bGxzY3JlZW4nKSkge1xyXG5cdFx0aGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlYWRlci0tZnVsbHNjcmVlbicpO1xyXG5cdFx0Ym9keS5zdHlsZS5vdmVyZmxvdyA9ICdpbmhlcml0JztcclxuXHR9XHJcblx0ZWxzZSBpZiAoaGFtYnVyZ2VyICYmIGUudGFyZ2V0LmNsb3Nlc3QoJy5oYW1idXJnZXItbWVudScpKSB7XHJcblx0XHRoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLS1mdWxsc2NyZWVuJyk7XHJcblx0XHRib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vYnVyZ2Vycy1jb21wb3NpdGlvbi1jbG9zZS1idG5cclxuY29uc3QgaG92ZXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21wb3NpdGlvbl9fY2xvc2UtYnRuJyk7XHJcbmNvbnN0IGhvdmVyT3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXJnZXItY2FyZF9fY29tcG9zaXRpb24tLWl0ZW0nKTtcclxuXHJcbmhvdmVyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLWNhcmRfX2NvbXBvc2l0aW9uLS1ob3ZlcicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbn0pO1xyXG5cclxuaWYgKHNjcmVlbi53aWR0aCA8IDc2OSkge1xyXG5cdGhvdmVyT3Blbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLWNhcmRfX2NvbXBvc2l0aW9uLS1ob3ZlcicpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vL292ZXJsYXkgcmV2aWV3c1xyXG5jb25zdCByZXZpZXdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmV2aWV3c19fYnRuJyk7XHJcbmNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jldmlld3NQb3B1cCcpLmlubmVySFRNTDtcclxuXHJcbmZvciAoaSA9IDA7IGkgPCByZXZpZXdCdXR0b24ubGVuZ3RoOyBpKyspIHtcclxuXHRyZXZpZXdCdXR0b25baV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRsZXQgcmV2aWV3c1RpdGxlID0gZS5wYXRoWzJdLnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX190aXRsZScpLmlubmVySFRNTDtcclxuXHRcdGxldCByZXZpZXdzVGV4dCA9IGUucGF0aFsyXS5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fdGV4dCcpLmlubmVySFRNTDtcclxuXHRcdGxldCBzdWNjZXNzT3ZlcmxheSA9IGNyZWF0ZU92ZXJsYXkocmV2aWV3c1RpdGxlLCByZXZpZXdzVGV4dCk7XHJcblx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJldmlld3NcIikuYXBwZW5kKHN1Y2Nlc3NPdmVybGF5KTtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlT3ZlcmxheSh0aXRsZSwgdGV4dCkge1xyXG5cdC8vINC60LDQuiDRgdC+0LfQtNCw0LLQsNGC0Ywg0YjQsNCx0LvQvtC9INCx0LXQtyDQu9C40YjQvdC10LPQviDQtNC40LLQsD9cclxuXHRjb25zdCBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0bmV3RWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcclxuXHJcblx0Y29uc3QgY2xvc2VPdmVybGF5ID0gbmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheV9fY2xvc2UtYnRuJyk7XHJcblx0Y29uc3QgY2xvc2VPdmVybGF5QmcgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5Jyk7XHJcblxyXG5cdGNsb3NlT3ZlcmxheUJnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLnRhcmdldCA9PT0gY2xvc2VPdmVybGF5QmcpIHtcclxuXHRcdFx0Y2xvc2VPdmVybGF5LmNsaWNrKCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0Y2xvc2VPdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzJykucmVtb3ZlQ2hpbGQobmV3RWxlbWVudCk7XHJcblx0fSlcclxuXHJcblx0bmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fb3ZlcmxheS0tdGl0bGUnKS5pbm5lckhUTUwgPSB0aXRsZTtcclxuXHRuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXZpZXdzX19vdmVybGF5LS10ZXh0JykuaW5uZXJIVE1MID0gdGV4dDtcclxuXHJcblx0cmV0dXJuIG5ld0VsZW1lbnQ7XHJcbn1cclxuXHJcbi8vYWNjb3JkZW9uXHJcblxyXG5jb25zdCBpdGVtVmVydEFjY29yZGVvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKTtcclxuZm9yIChpID0gMDsgaSA8IGl0ZW1WZXJ0QWNjb3JkZW9uLmxlbmd0aDsgaSsrKSB7XHJcblx0aXRlbVZlcnRBY2NvcmRlb25baV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy52ZXJ0aWNhbC1hY2NvcmRlb25fX2l0ZW0nKS5jbGFzc0xpc3QuY29udGFpbnMoJ3ZlcnRpY2FsLWFjY29yZGVvbl9faXRlbS0tYWN0aXZlJykpIHtcclxuXHRcdFx0ZS50YXJnZXQuY2xvc2VzdCgnLnZlcnRpY2FsLWFjY29yZGVvbl9faXRlbScpLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsLWFjY29yZGVvbl9faXRlbS0tYWN0aXZlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGl0ZW1WZXJ0QWNjb3JkZW9uLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0aXRlbVZlcnRBY2NvcmRlb25bal0uY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcudmVydGljYWwtYWNjb3JkZW9uX19pdGVtJykuY2xhc3NMaXN0LmFkZCgndmVydGljYWwtYWNjb3JkZW9uX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuLy90ZWFtLWFjY29yZGVvblxyXG5jb25zdCBpdGVtVGVhbUFjY29yZGVvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGFmZl9faXRlbScpO1xyXG5mb3IgKGkgPSAwOyBpIDwgaXRlbVRlYW1BY2NvcmRlb24ubGVuZ3RoOyBpKyspIHtcclxuXHRpdGVtVGVhbUFjY29yZGVvbltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQuY2xvc2VzdCgnLnN0YWZmX19pdGVtJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdGFmZl9fYWN0aXZlJykpIHtcclxuXHRcdFx0ZS50YXJnZXQuY2xvc2VzdCgnLnN0YWZmX19pdGVtJykuY2xhc3NMaXN0LnJlbW92ZSgnc3RhZmZfX2FjdGl2ZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBpdGVtVGVhbUFjY29yZGVvbi5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGl0ZW1UZWFtQWNjb3JkZW9uW2pdLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YWZmX19hY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlLnRhcmdldC5jbG9zZXN0KCcuc3RhZmZfX2l0ZW0nKS5jbGFzc0xpc3QuYWRkKCdzdGFmZl9fYWN0aXZlJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIHNsaWRlclxyXG4vLyDQvdC1INGB0LTQtdC70LDQvdGLINCx0YPQu9C70LXRgtGLINGB0L3QuNC30YNcclxubGV0IHNsaWRlckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItY29udGFpbmVyX19saXN0Jyk7XHJcbmxldCBzbGlkZXJDYXJvdXNlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItY29udGFpbmVyX19pdGVtcycpO1xyXG5sZXQgc2xpZGVySXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbGlkZXItY29udGFpbmVyX19pdGVtJyk7XHJcbmxldCBjb250ZW50V2lkdGggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLWNvbnRhaW5lcl9fbGlzdCcpLmNsaWVudFdpZHRoO1xyXG5sZXQgc2xpZGVyTGVmdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzbGlkZXItbGVmdCcpO1xyXG5sZXQgc2xpZGVyUmlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2xpZGVyLXJpZ2h0Jyk7XHJcblxyXG5jb25zdCBtaW5SaWdodCA9IDA7XHJcbmNvbnN0IG1heFJpZ2h0ID0gY29udGVudFdpZHRoICogc2xpZGVySXRlbS5sZW5ndGg7XHJcbmNvbnN0IHN0ZXAgPSBjb250ZW50V2lkdGg7XHJcbmxldCBjdXJyZW50UmlnaHQgPSAwO1xyXG5cclxuZm9yIChpID0gMDsgaSA8IHNsaWRlckl0ZW0ubGVuZ3RoOyBpKyspIHtcclxuXHRzbGlkZXJJdGVtW2ldLnN0eWxlLm1pbldpZHRoID0gY29udGVudFdpZHRoICsgXCJweFwiO1xyXG59XHJcblxyXG5zbGlkZXJMZWZ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGlmIChNYXRoLmFicyhjdXJyZW50UmlnaHQpID4gbWluUmlnaHQpIHtcclxuXHRcdGN1cnJlbnRSaWdodCArPSBzdGVwO1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtjdXJyZW50UmlnaHR9cHgpYDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoLSR7bWF4UmlnaHQgLSBzdGVwfXB4KWA7XHJcblx0XHRjdXJyZW50UmlnaHQgPSAtKG1heFJpZ2h0IC0gc3RlcCk7XHJcblx0fVxyXG59KTtcclxuXHJcbnNsaWRlclJpZ2h0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdGlmIChNYXRoLmFicyhjdXJyZW50UmlnaHQpIDwgKG1heFJpZ2h0IC0gc3RlcCkpIHtcclxuXHRcdGN1cnJlbnRSaWdodCAtPSBzdGVwO1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtjdXJyZW50UmlnaHR9cHgpYDtcclxuXHR9IGVsc2Uge1xyXG5cdFx0c2xpZGVyQ2Fyb3VzZWwuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoMHB4KWA7XHJcblx0XHRjdXJyZW50UmlnaHQgPSAwO1xyXG5cdH1cclxufSk7XHJcblxyXG4vL2Zvcm0gcG9wdXAg0LLRi9GC0LDRgdC60LjQstCw0LXQvCDRiNCw0LHQu9C+0L0g0L/QvtC/0LDQv9CwINC4INC30LDQutC40LTRi9Cy0LDQtdC8INCyINGE0L7RgNC80YNcclxuY29uc3QgdGVtcGxhdGVGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Zvcm1Qb3B1cCcpLmlubmVySFRNTDtcclxuY29uc3Qgc2VuZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZW5kQnRuJyk7XHJcbmNvbnN0IHNlbmRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2VsZW0nKTtcclxuXHJcbmxldCBkYXRhRm9ybTtcclxubGV0IHRleHRGb3JtUG9wdXA7XHJcbmxldCB0ZXh0Rm9ybVBvcHVwRXJyb3IgPSAn0JLRiyDQvdC1INCy0LLQtdC70LguLi4gJztcclxuXHJcbnNlbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZvcm0oc2VuZEZvcm0pKSB7XHJcblx0XHRjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0Rm9ybVBvcHVwKTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSAnJztcclxuXHR9IGVsc2Uge1xyXG5cdFx0bGV0IGZvcm1EYXRhID0gY3JlYXRlRGF0YSgpO1xyXG5cdFx0Y29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHR4aHIub3BlbignUE9TVCcsICdodHRwczovL3dlYmRldi1hcGkubG9mdHNjaG9vbC5jb20vc2VuZG1haWwnKVxyXG5cdFx0eGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcclxuXHRcdHhoci5zZW5kKGZvcm1EYXRhKTtcclxuXHRcdHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoeGhyLnJlc3BvbnNlLnN0YXR1cyA9PT0gMSkge1xyXG5cdFx0XHRcdHRleHRGb3JtUG9wdXAgPSB4aHIucmVzcG9uc2UubWVzc2FnZTtcclxuXHRcdFx0XHRjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0Rm9ybVBvcHVwKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZXh0Rm9ybVBvcHVwID0geGhyLnJlc3BvbnNlLm1lc3NhZ2U7XHJcblx0XHRcdFx0Y3JlYXRlRm9ybU92ZXJsYXkodGV4dEZvcm1Qb3B1cCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9ICcnO1xyXG5cdH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtT3ZlcmxheSh0ZXh0KSB7XHJcblx0Y29uc3QgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdG5ld0VsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVGb3JtO1xyXG5cclxuXHRjb25zdCBjbG9zZU92ZXJsYXkgPSBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tLW92ZXJsYXknKTtcclxuXHRjb25zdCBjbG9zZU92ZXJsYXlCZyA9IG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJsYXknKTtcclxuXHJcblx0Y2xvc2VPdmVybGF5QmcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKGUudGFyZ2V0ID09PSBjbG9zZU92ZXJsYXlCZykge1xyXG5cdFx0XHRjbG9zZU92ZXJsYXkuY2xpY2soKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRjbG9zZU92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yZGVyJykucmVtb3ZlQ2hpbGQobmV3RWxlbWVudCk7XHJcblx0fSlcclxuXHJcblx0bmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmV2aWV3c19fb3ZlcmxheS0tdGV4dCcpLmlubmVySFRNTCA9IHRleHQ7XHJcblxyXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3JkZXJcIikuYXBwZW5kKG5ld0VsZW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZUZvcm0oZm9ybSkge1xyXG5cdGxldCB2YWxpZCA9IHRydWU7XHJcblxyXG5cdGlmICghdmFsaWRhdGVGaWVsZChmb3JtLmVsZW1lbnRzLmNvbW1lbnQpKSB7XHJcblx0XHR2YWxpZCA9IGZhbHNlO1xyXG5cdFx0dGV4dEZvcm1Qb3B1cCA9IHRleHRGb3JtUG9wdXBFcnJvciArIFwi0JrQvtC80LzQtdC90YLQsNGA0LjQuSFcIjtcclxuXHR9XHJcblxyXG5cdGlmICghdmFsaWRhdGVGaWVsZChmb3JtLmVsZW1lbnRzLnBob25lKSkge1xyXG5cdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdHRleHRGb3JtUG9wdXAgPSB0ZXh0Rm9ybVBvcHVwRXJyb3IgKyBcItCi0LXQu9C10YTQvtC9IVwiO1xyXG5cdH1cclxuXHJcblx0aWYgKCF2YWxpZGF0ZUZpZWxkKGZvcm0uZWxlbWVudHMubmFtZSkpIHtcclxuXHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHR0ZXh0Rm9ybVBvcHVwID0gdGV4dEZvcm1Qb3B1cEVycm9yICsgXCLQmNC80Y8hXCI7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdmFsaWQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlRmllbGQoZmllbGQpIHtcclxuXHRyZXR1cm4gZmllbGQuY2hlY2tWYWxpZGl0eSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVEYXRhKCkge1xyXG5cdGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShzZW5kRm9ybSk7XHJcblxyXG5cdGZvcm1EYXRhLmFwcGVuZChcIm5hbWVcIiwgc2VuZEZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSk7XHJcblx0Zm9ybURhdGEuYXBwZW5kKFwicGhvbmVcIiwgc2VuZEZvcm0uZWxlbWVudHMucGhvbmUudmFsdWUpO1xyXG5cdGZvcm1EYXRhLmFwcGVuZChcImNvbW1lbnRcIiwgc2VuZEZvcm0uZWxlbWVudHMuY29tbWVudC52YWx1ZSk7XHJcblx0Zm9ybURhdGEuYXBwZW5kKFwidG9cIiwgXCJ2YXN5QGxpeS5jb21cIik7XHJcblxyXG5cdHJldHVybiBmb3JtRGF0YTtcclxuXHQvLyDQv9C+0YfQtdC80YMg0L3QtSDRgdGA0LDQsdC+0YLQsNC7IHN0cmluZ2lmeT9cclxuXHQvLyBkYXRhRm9ybSA9IHtcclxuXHQvLyBcdFwibmFtZVwiOiBzZW5kRm9ybS5lbGVtZW50cy5uYW1lLnZhbHVlLFxyXG5cdC8vIFx0XCJwaG9uZVwiOiBzZW5kRm9ybS5lbGVtZW50cy5waG9uZS52YWx1ZSxcclxuXHQvLyBcdFwiY29tbWVudFwiOiBcInZhc3lAbGl5LmNvbVwiLFxyXG5cdC8vIFx0XCJ0b1wiOiBcInZhc3lAbGl5LmNvbVwiXHJcblx0Ly8gfVxyXG5cdC8vIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhRm9ybSk7XHJcbn0iLCI7KGZ1bmN0aW9uKCkge1xyXG5cdGNvbnNvbGUubG9nKCd3b3JsZCcpO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHRjb25zb2xlLmxvZygnaGVsbG8gd29ybGQnKTtcclxufSkoKTsiXX0=
