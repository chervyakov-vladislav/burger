;(function() {

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

	// что-то читал о замене таймаутов на промисы и свормировать классы методы, но я не в курсах что это.
	// отдельные действия нужно закинуть в отдельные функции
	
})();