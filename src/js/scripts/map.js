;(function() {
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

})();