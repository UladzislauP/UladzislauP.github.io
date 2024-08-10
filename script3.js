const question_id = 2;

var map = L.map('map', {
    center: [52.232363, 21.007306],
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
    [52.232363, 21.007306],
    [52.231766, 21.007669],
    [52.231964, 21.008495],
    [52.232542, 21.008149]
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
    .bindPopup('Historycznego bruk, tory oraz piwnic dawnych kamienic', { closeButton: false }) 
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
    }
});

L.control.info = function(opts) {
    return new L.Control.Info(opts);
}

L.control.info({ position: 'topleft' }).addTo(map);

function getChatId() {
    // Pobierz chat_id z LocalStorage
    const chat_id = localStorage.getItem('chat_id');
    return chat_id;
}

function redirectToIndex(buttonType) {
    const chat_id = getChatId(); 
    const bot_token = '7307143800:AAEPdI_XTkTSDnYE_54o5IKZIc-k58z_T0k';
    const answerText = buttonType === 'yes' ? 'Tak' : 'Nie';

    if (!chat_id) {
        alert("Brak ID sesji. Proszę uruchomić ankietę przez link otrzymany od bota.");
        return;
    }

    if (buttonType === 'yes') {
        document.querySelector('.button.yes').style.backgroundColor = 'green';
    } else if (buttonType === 'no') {
        document.querySelector('.button.no').style.backgroundColor = 'red';
    }

    fetch(`https://api.telegram.org/bot${bot_token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chat_id,
            text: `/map_poll ${question_id} ${answerText.toLowerCase()}`
        })
    }).then(response => response.json())
      .then(data => {
          console.log("Wyniki zostały przesłane do bota:", data);

          setTimeout(function() {
              window.location.href = 'index4.html';
          }, 300);
      }).catch(error => console.error('Error:', error));
}


// Ensure the map stays centered on the polygon center
function keepPolygonCenter() {
    var centerLatLng = polygon.getBounds().getCenter();
    map.setView(centerLatLng, map.getZoom(), { animate: true });
}

map.on('zoomend', keepPolygonCenter);
map.on('moveend', keepPolygonCenter);

// Ensure the popup remains open
map.on('popupclose', function() {
    marker.openPopup();
});
