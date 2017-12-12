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
                clickableIcons: false,
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
                group = new google.maps.Marker({position: pos,map: map, title: val.topic, style: {fill: 'blue'} });

                google.maps.event.addListener(group,'click', (function(group,key){
                    return function() {
                        onMarkerClick(group, key, data[key])
                }} )(group,key) );
                group.setMap(map);
                console.log(val.id + " is added to list");
                groups.push({id: val.id, marker: group, keyword: val.topic});
            });

        });
    }, function error (err) {
        console.log("loading failed");
        document.getElementById("map").style.display = "none";
        loading_message = document.getElementById("loading-message");
        loading_message.removeChild(loading_message.firstChild);
        failure_link = document.createElement("a");
        failure_link.setAttribute("href", "/home");
        failure_message = document.createTextNode("Failed to Load Studi (Click to retry)");
        failure_link.appendChild(failure_message);
        loading_message.appendChild(failure_link);
    }, {maximumAge:600000, timeout:5000, enableHighAccuracy: true}); // end getCurrentPosition
    console.log("hello");

     var input = document.getElementById("menu-search-field");

    input.addEventListener('input', function()
    {
       if (input.value == "") {
            showAll();
       } else {
            showFromKeyword(input.value);
       }
    });
};

function resetSearch() {
    document.getElementById('menu-search-field').value = ''
    showAll();
}

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

function showFromKeyword(keyword) {
    groups.forEach(function(g) {
        if (g.keyword.toLowerCase().indexOf(keyword.toLowerCase()) == -1) {
            g.marker.setMap(null);
        } else {
            g.marker.setMap(map);
        }
    });
}

function showAll() {
    groups.forEach(function(g) {
        g.marker.setMap(map);
    });
}