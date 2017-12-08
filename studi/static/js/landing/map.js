 // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
var map, infoWindow;
var pos;
var groupMarker;
var data;
function initMap() {
    navigator.geolocation.getCurrentPosition(function(position){
        console.log("entered init map")
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map = new google.maps.Map(document.getElementById('map'),{center: pos,zoom: 16});

        groupMarker = new google.maps.Marker({
            position: pos,
            map: map,
            title:"You Are Here",
            draggable:true
        });
        groupMarker.setMap(map);


        map.addListener('click', function(event) {
           groupMarker.setPosition(event.latLng);

        });
    }, function error (msg) {
        alter("geolocation error!")
    }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true}); // end getCurrentPosition
    console.log("hello");
};