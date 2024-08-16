var map = L.map('map', {
    center: [52.233294, 21.006974],
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
    [52.232696, 21.009522],
    [52.232755, 21.009828],
    [52.232167, 21.01019],
    [52.231639, 21.007583],
    [52.232216, 21.00725]
];

var polygon = L.polygon(latlngs, {
    color: 'red',
    weight: 2,
    opacity: 1,
    fillColor: 'red',
    fillOpacity: 0.1 
}).addTo(map);

var osmMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var satMap = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=ulKnwyv26J9HpTR3Q5tZ', {
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 20,
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    crossOrigin: true
});

var orto = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution', {
    layers: 'Raster'
});

var wysMap = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/HighResolution', {
    layers: 'Raster'
});

var topo = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/img/guest/TOPO/MapServer/WMSServer', {
    layers: 'Raster'
});

var baseMaps = {
    'Standardowa Mapa': osmMap,
    'Mapa topograficzna': topo,
    'Ortofotomapa': orto,
    'Mapa wysokej rozdzielczosci': wysMap,
    'Satelitarna Mapa': satMap,
};

L.control.layers(baseMaps).addTo(map);

var centerLatLng = polygon.getBounds().getCenter();

var marker = L.marker(centerLatLng).addTo(map)
    .bindPopup('Nowy plac Centralny', { closeButton: false }) 
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

function sendResponse(answer) {
    let tg = window.Telegram.WebApp;  // Inicjalizacja WebApp
    tg.sendData(JSON.stringify({ answer: answer, button_id: 5 })); 
    window.location.href = 'index7.html';  // Przekierowanie na inną stronę
}

// Ensure the map stays centered on the polygon center
function keepPolygonCenter() {
    map.setView(centerLatLng, map.getZoom(), { animate: true });
}

map.on('zoomend', keepPolygonCenter);
map.on('moveend', keepPolygonCenter);

// Ensure the popup remains open
map.on('popupclose', function() {
    marker.openPopup();
});
