var map = L.map('map', {
    center: [52.23382, 21.008972],
    zoom: 17,
    maxZoom: 18,
    minZoom: 17,
    maxBounds: [
        [52.228, 21.002],
        [52.236, 21.012]  
    ],
    maxBoundsViscosity: 1.0,
    dragging: false, // Disable dragging
    scrollWheelZoom: false // Disable scroll wheel zoom
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var latlngs = [
    [52.233464, 21.007086],
    [52.233375, 21.007148],
    [52.23375, 21.008999],
    [52.232431, 21.009769],
    [52.23248, 21.0099],
    [52.23391, 21.009044]
];

var polygon = L.polygon(latlngs, {
    color: 'red',
    weight: 2,
    opacity: 1,
    fillColor: 'red',
    fillOpacity: 0.1 
}).addTo(map);

var centerLatLng = [52.23382, 21.008972];

var marker = L.marker(centerLatLng).addTo(map)
    .bindPopup('Nowe obszary zielone', { closeButton: false }) 
    .openPopup();

map.fitBounds(polygon.getBounds());

L.Control.Info = L.Control.extend({
    onAdd: function(map) {
        var infoButton = L.DomUtil.create('div', 'leaflet-control-zoom-info');
        infoButton.innerHTML = '<span class="material-symbols-outlined">info</span>';
        L.DomEvent.on(infoButton, 'click', function() {
            window.location.href = 'index_info.html';
        });
        return infoButton;
    },
    onRemove: function(map) {
        // Kod do wykonania przy usunięciu kontrolki (jeśli wymagany)
    }
});

L.control.info = function(opts) {
    return new L.Control.Info(opts);
}

L.control.info({ position: 'topleft' }).addTo(map);

function redirectToIndex(buttonType) {
    if (buttonType === 'yes') {
        document.querySelector('.button.yes').style.backgroundColor = 'green';
    } else if (buttonType === 'no') {
        document.querySelector('.button.no').style.backgroundColor = 'red';
    }
    setTimeout(function() {
        window.location.href = 'index5.html';
    }, 300);
}

// Ensure the map stays centered on the polygon center
function keepPolygonCenter() {
    map.setView(centerLatLng, map.getZoom(), { animate: false });
}

map.on('zoomend', keepPolygonCenter);
map.on('moveend', keepPolygonCenter);

// Ensure the popup remains open
map.on('popupclose', function() {
    marker.openPopup();
});
