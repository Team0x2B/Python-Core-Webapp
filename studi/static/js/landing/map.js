 // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
var map, infoWindow;
var pos;
var marker;
var data;
function initMap() {
    navigator.geolocation.getCurrentPosition(function(position){
        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map = new google.maps.Map(document.getElementById('map'),{center: pos,zoom: 16});

        infoWindow = new google.maps.Marker({position: pos,map: map,title:"You Are Here"});
        infoWindow.setMap(map);

        $.getJSON( "api/getUsers", function( data ){
            $.each( data, function( key, val ){
            //console.log(data);
            console.log(val.username+":"+val.locationX+","+val.locationY+" "+val.study);
            pos = new google.maps.LatLng(val.locationX,val.locationY);
            marker = new google.maps.Marker({position: pos,map: map,label: key.toString(), title: val.username, style: {fill: '#76c043'} });
                google.maps.event.addListener(marker,'click', (function(marker,key){
                return function() {
                    console.log("marker clicked");
                    //console.log(marker.get('map'));
                    console.log(key);
                    console.log(data[key]);
                    //console.log('clicked:'+marker.title);
                    //mywindow.open(marker.get('map'),marker);
                }} )(marker,key) );
                //infoWindow.open(map);
                marker.setMap(map);
            });
        });
    }); // end getCurrentPosition
    console.log("hello");
};