(function () {
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