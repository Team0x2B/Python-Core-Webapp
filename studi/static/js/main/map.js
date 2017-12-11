var map, infoWindow;
var pos;
var groups = [];
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
                group = new google.maps.Marker({position: pos,map: map, title: val.topic, style: {fill: '#76c043'} });

                google.maps.event.addListener(group,'click', (function(group,key){
                    return function() {
                        onMarkerClick(group, key, data[key])
                }} )(group,key) );
                group.setMap(map);
                console.log(val.id + " is added to list");
                groups.push({id: val.id, marker: group});
            });

        });
    }, function error (err) {
        alert("geolocation error: " + err.message + " code: " + err.code);
    }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true}); // end getCurrentPosition
    console.log("hello");
};

function removeGroupMarker(group_id) {
    console.log("removing group: " + group_id);
    var to_remove;
    groups.forEach(function(g) {
        if (g.id == group_id) {
            to_remove = g;
        }
    });
    to_remove.marker.setMap(null);
    index = groups.indexOf(to_remove);
    groups.splice(index, 1);
}

function onMarkerClick(marker, key, group) {
    showInfoWindow(group);
}