var map = L.map('map', {
    center: [52.23189489585977, 21.00729567750159],
    zoom: 17,
    minZoom: 15,
    maxZoom: 19,
    maxBounds: [
        [52.228, 21.002], // południowo-zachodni narożnik
        [52.236, 21.012]  // północno-wschodni narożnik
    ],
    maxBoundsViscosity: 1.0
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var latlngs = [
    [52.233974984772395, 21.002481588666186],
    [52.2352152886107, 21.008359476667984],
    [52.22983506207801, 21.011717183703094],
    [52.22855980591468, 21.005608624394295]
];

var polygon = L.polygon(latlngs, {
    color: 'red',
    weight: 2,
    opacity: 1,
    fillColor: 'red',
    fillOpacity: 0.1 
}).addTo(map);

var centerLatLng = polygon.getBounds().getCenter();

L.marker(centerLatLng).addTo(map)
    .bindPopup('Obszar opracowania')
    .openPopup();

map.fitBounds(polygon.getBounds());

// Dodanie ikony info pod przyciskami zoomu
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
        // Nic do usunięcia
    }
});

L.control.info = function(opts) {
    return new L.Control.Info(opts);
}

L.control.info({ position: 'topleft' }).addTo(map);

// Funkcja do przekierowania na index2.html i podświetlenia przycisku
function redirectToIndex(buttonType) {
    if (buttonType === 'yes') {
        document.querySelector('.button.yes').style.backgroundColor = 'green';
    } else if (buttonType === 'no') {
        document.querySelector('.button.no').style.backgroundColor = 'red';
    }
    setTimeout(function() {
        window.location.href = 'index2.html';
    }, 300); // Krótkie opóźnienie, aby użytkownik zauważył podświetlenie
}
