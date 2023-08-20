mapboxgl.accessToken = 'pk.eyJ1IjoiaG9uZ3FpYW5saSIsImEiOiJjbGticW84cjIwaGRjM2xvNjNrMjh4cmRyIn0.o65hBMiuqrCXY-3-bxGsUg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hongqianli/cllbn6d7n015p01qkgnrlgbfy',
    zoom: 12.5,
    center: [-73.9856, 40.7426],
    pitch: 60, // 设置倾斜角度，例如60度
    bearing: -20 // 可选的旋转角度，例如20度
});

map.on('load', function () {
    map.addLayer({
        'id': 'safety',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/final.geojson'
        },
        'paint': {
            'fill-color': ['step', ['get', 'safety'],
                '#ffffff',
                0, '#5f2a75',
                30, '#843680',
                38, '#a84389',
                43, '#ca5390',
                48, '#eb6695'],
            'fill-opacity': ['case', ['==', ['get', 'safety'], null], 49, 1]
        }
    });
    map.addLayer({
        'id': 'lively',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/final.geojson'
        },
        'paint': {
            'fill-color': ['step', ['get', 'lively'],
                '#ffffff',
                0, '#5f2a75',
                10, '#00519e',
                33, '#006da2',
                41, '#008187',
                47, '#008f5e'],
            'fill-opacity': ['case', ['==', ['get', 'lively'], null], 49, 1]
        }
    });
    map.addLayer({
        'id': 'depressing',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/final.geojson'
        },
        'paint': {
            'fill-color': ['step', ['get', 'depressing'],
                '#ffffff',
                0, '#6682eb',
                52, '#6b6bcd',
                54, '#6b55af',
                58, '#673f92',
                70, '#5f2a75'],
            'fill-opacity': ['case', ['==', ['get', 'depressing'], null], 49, 1]
        }
    });
    
    map.addLayer({
        'id': 'skyview',
        'type': 'fill-extrusion',
        'source': {
            'type': 'geojson',
            'data': 'data/finalpoints.geojson' 
        },
        'paint': {
            'fill-extrusion-color': ['interpolate', ['linear'], ['get', '%AveOpenVi'],
                0.18, '#d309e8',
                0.58, '#ad3c75',
                0.7, '#e5475d',
                0.84, '#fbaa68',
                1.02, '#fbeb80'
            ],
            'fill-extrusion-base': 2000,  // 设置底部高度为2000
            'fill-extrusion-height': ['interpolate', ['linear'], ['get', '%AveOpenVi'],
                // 0.18, 0,
                // 0.58, 200,
                // 0.7, 400,
                // 0.84, 600,
                // 1.02, 800,
                // 1.43, 1000
                0.18, 2000,
                0.58, 1800,
                0.7, 1600,
                0.84, 1400,
                1.02, 1200,
                1.43, 1000
            ],
        }
    });

    map.addLayer({
        'id': 'buildingheights',
        'type': 'fill-extrusion',
        'source': {
            'type': 'geojson',
            'data': 'data/buildheights.geojson'
        },
        'paint': {
            'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'heightroof'],
                0, '#000000',
                87, '#00519e',
                160, '#006da2',
                266, '#008187',
                448, '#008f5e'
            ],
            // 'fill-extrusion-base': 2000,  // 设置底部高度为2000
            'fill-extrusion-height': ['interpolate', ['linear'], ['get', 'heightroof'],
                // 1, 2000,
                // 87, 1800,
                // 160, 1600,
                // 266, 1400,
                // 448, 1200,
                // 1050, 1000
                1, 0,
                87, 200,
                160, 400,
                266, 600,
                448, 800,
                1050, 1000
            ],
        }
    });
    
    
    
});

map.on('load', function() {
    // ...您其他的地图代码...
    
    var toggleableLayerIds = ['skyview', 'buildingheights', 'depressing', 'lively', 'safety'];
    var activeLayers = ['skyview', 'depressing'];

    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var id = toggleableLayerIds[i];

        var link = document.createElement('a');
        link.href = '#';
        link.textContent = id;

        if (activeLayers.includes(id)) {
            link.className = 'active';
        } else {
            link.className = ''; 
            map.setLayoutProperty(id, 'visibility', 'none');
        }

        link.onclick = function(e) {
            var clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
        };

        var layers = document.getElementById('menu');
        layers.appendChild(link);
    }
});




const layersConfig = {
    'skyview': {
        property: '%AveOpenVi',
        label: '%sky exposure'
    },
    'depressing': {
        property: 'depressing',
        label: 'Depressing'
    },
    'lively': {
        property: 'lively',
        label: 'Lively'
    },
    'safety': {
        property: 'safety',
        label: 'Safety'
    }
};

Object.keys(layersConfig).forEach(layerName => {
    // Create the popup
    map.on('click', layerName, function (e) {
        let propertyValue = e.features[0].properties[layersConfig[layerName].property];

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML('<h4>' + layersConfig[layerName].label + ':</h4>' + propertyValue)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the layer
    map.on('mouseenter', layerName, function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves
    map.on('mouseleave', layerName, function () {
        map.getCanvas().style.cursor = '';
    });
});

// map.on('load', function () {
//     var layers = map.getStyle().layers;
//     for (var i = 0; i < layers.length; i++) {
//         var layer = layers[i];
//         if (layer.type === 'background') {
//             map.setPaintProperty(layer.id, 'background-color', 'rgba(0, 0, 0, 0)');
//         } else {
//             map.setLayoutProperty(layer.id, 'visibility', 'none');
//         }
//     }
// });

// map.on('load', function () {
//     map.setPaintProperty('background', 'background-color', 'rgba(0, 0, 0, 0)');
//     var layers = map.getStyle().layers;

//     layers.forEach(function(layer) {
//         if (layer.type === 'fill') {
//             map.setPaintProperty(layer.id, 'fill-opacity', 0);
//         } else if (layer.type === 'line') {
//             map.setPaintProperty(layer.id, 'line-opacity', 0);
//         } else if (layer.type === 'circle') {
//             map.setPaintProperty(layer.id, 'circle-opacity', 0);
//         } else if (layer.type === 'symbol') {
//             map.setPaintProperty(layer.id, 'text-opacity', 0);
//             map.setPaintProperty(layer.id, 'icon-opacity', 0);
//         } else if (layer.type === 'raster') {
//             map.setPaintProperty(layer.id, 'raster-opacity', 0);
//         }
//     });
// });


