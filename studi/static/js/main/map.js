var map, infoWindow;
var pos;
var marker;
var data;
function initMap() {

    navigator.geolocation.getCurrentPosition(function(position){
        console.log("entered init map")
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map = new google.maps.Map(document.getElementById('map'),
            {
                center: pos,
                zoom: 16,
                disableDefaultUI: true
            }
         );

        map.addListener('click', function(e) {
            console.log("map clicked");
            $("#menu-search-field").blur();
            hideInfoWindow();
        });

        map.addListener('dragstart', function(e) {
            console.log("drag start");
            $("#menu-search-field").blur();
        });

        $.getJSON( "api/get_study_groups", function( data ){
            $.each( data, function( key, val ){
            //console.log(data);
            console.log(val.id+":"+val.latitude+","+val.longitude+" "+val.topic);
            console.log("current location: " + position.coords.latitude + ", " + position.coords.longitude)
            pos = new google.maps.LatLng(val.latitude,val.longitude);
            marker = new google.maps.Marker({position: pos,map: map, title: val.topic, style: {fill: '#76c043'} });
            google.maps.event.addListener(marker,'click', (function(marker,key){
                return function() {
                    console.log("marker clicked");
                    //console.log(marker.get('map'));
                    console.log(key);
                    console.log(data[key]);
                    onMarkerClick(marker, key, data[key])
                }} )(marker,key) );
                //infoWindow.open(map);
                marker.setMap(map);
            });
        });
    }, function error (err) {
        alert("geolocation error: " + err.message + " code: " + err.code);
    }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true}); // end getCurrentPosition
    console.log("hello");
};

function onMarkerClick(marker, key, group) {
    showInfoWindow(group);
}