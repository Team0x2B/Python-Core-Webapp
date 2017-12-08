mapboxgl.accessToken = 'pk.eyJ1Ijoic3BhY2VtYW4xNzAxIiwiYSI6ImNqYXk5aDJ4ZjE1bmMyd21rNjh0cnY4NnEifQ.oGvBAyBD4Az0Ij9o2ThX9A';
map_pin_url = '../static/css/images/pin.svg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10'
});

map.on('load', function(event) {
    console.log("map loaded");
    navigator.geolocation.getCurrentPosition(function(position){
        console.log("centering map");
        lngLat = [position.coords.longitude, position.coords.latitude]
        map.jumpTo({center: lngLat, zoom: 16})
    }, function error (msg) {
        console.log("geolocation error");
    });
    $.getJSON( "api/get_study_groups", function( data ){
            $.each( data, function( key, val ){
                var el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage = 'url(' + map_pin_url + ')';
                el.style.width = '50' + 'px';
                el.style.height = '50' + 'px';

                new mapboxgl.Marker(el)
                    .setLngLat([val.longitude, val.latitude])
                    .addTo(map);

                el.addEventListener('click', function() {
                    onMarkerClick(key, data[key]);
                });
            });
    });
});

map.on('click', function(event) {
    console.log("clicked");
    console.log(event);


});

function onMarkerClick(key, group_data) {
    console.log(group_data);
    showInfoWindow(group_data.topic, "CSCI 3308", "Student", 1, "This is a description of what this study group is about.");
}