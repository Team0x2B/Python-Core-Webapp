mapboxgl.accessToken = 'pk.eyJ1Ijoic3BhY2VtYW4xNzAxIiwiYSI6ImNqYXk5aDJ4ZjE1bmMyd21rNjh0cnY4NnEifQ.oGvBAyBD4Az0Ij9o2ThX9A';
map_pin_url = '../static/css/images/pin.svg';


var map;
navigator.geolocation.getCurrentPosition(function(position){
    console.log("centering map");
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        pitchWithRotate: false,
        zoom: 16,
        center: [position.coords.longitude, position.coords.latitude]
    });

    map.on('load', onMapLoad);
    map.on('click', onMapClick);

}, function error (msg) {
    console.log("geolocation error");
});

function onMapLoad(event) {
    document.getElementById("loading-info").style.display = "none";
    console.log("map loaded");
    $.getJSON( "api/get_study_groups", function( data ){
            $.each( data, function( key, val ){
                var el = document.createElement('div');
                el.className = 'marker';
                var img = document.createElement('img');
                img.setAttribute("src", map_pin_url);
                img.style.width = '40px';
                img.style.height = '40px';
                el.appendChild(img);

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