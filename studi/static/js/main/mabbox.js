mapboxgl.accessToken = 'pk.eyJ1Ijoic3BhY2VtYW4xNzAxIiwiYSI6ImNqYXk5aDJ4ZjE1bmMyd21rNjh0cnY4NnEifQ.oGvBAyBD4Az0Ij9o2ThX9A';
map_pin_url = '../static/css/images/pin.svg';

var geolocation_failed = false;
var map;

initGeolocation();

function initGeolocation() {
    navigator.geolocation.getCurrentPosition(function(position){
        onLocationFound(position);
    }, function error (msg) {
        console.log("geolocation error");
        onHighAccuracyError();
    }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true});
}

function onHighAccuracyError() {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("using fallback geolocation")
        onLocationFound(position);
    }, function error (err) {
        if (!geolocation_failed) {
            console.log("fallback geolocation error");
            alert("fallback geolocation error: " + err.message + " code: " + err.code);
            geolocation_failed = true;
        }
    }, {maximumAge:600000, timeout:5000});
}


function onLocationFound(position) {
    console.log("centering map");
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/spaceman1701/cjayjd8wa1m8m2tn2wgkp7o7q',
        pitchWithRotate: false,
        zoom: 15.1,
        center: [position.coords.longitude, position.coords.latitude]
    });

    map.on('load', onMapLoad);
    map.on('click', onMapClick);
}

function onMapLoad(event) {
    document.getElementById("loading-info").style.display = "none";
    console.log("map loaded");
    $.getJSON( "api/get_study_groups", function( data ){
            $.each( data, function( key, val ){
                var el = document.createElement('div');
                el.className = 'marker';

                new mapboxgl.Marker(el)
                    .setLngLat([val.longitude, val.latitude])
                    .addTo(map);

                el.addEventListener('click', function(event) {
                    event.stopImmediatePropagation()
                    onMarkerClick(key, data[key]);
                });
            });
    });
}

function onMapClick(event) {
    console.log("clicked");
    console.log(event);
    hideInfoWindow();
}

function onMarkerClick(key, group_data) {
    console.log(group_data);
    showInfoWindow(group_data.topic, "CSCI 3308", "Student", 1, "This is a description of what this study group is about.");
}