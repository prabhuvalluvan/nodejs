/* Google Map inside of tab */

/* Google Map */
var from, to;
var map;
var directionsService;
var directionsDisplay;
var rtDistance = 0; //running total of distance
var rtDuration = 0; //running total of duration
var markers = new Array();

var ib = new InfoBox();

function getWeather(data) {
    var dataArray = data[0].markers;
    console.log(dataArray);
    var thisLat, thisLon, nextLat, nextLon, mSlope;
    var markerDirection = "m";  // marker pointer direction (can be l-left, m-middle, or r-right)
    for (var i = 0; i < dataArray.length; i++) {
        markerDirection = "m";
        thisLat = parseFloat(dataArray[i].lt);
        thisLon = parseFloat(dataArray[i].ln);
        if ((i + 1) < dataArray.length) {
            nextLat = parseFloat(dataArray[i + 1].lt);
            nextLon = parseFloat(dataArray[i + 1].ln);
            if (i == 0)
            {
                markerDirection = (thisLon <= parseFloat(dataArray[dataArray.length - 1].ln)) ? "r" : "l"; // leaving from
            }
            else if (thisLon - nextLon != 0)
            {
                mSlope = (nextLat - thisLat) / (nextLon - thisLon);
                if (mSlope < -0.5) { markerDirection = "l"; }
                if (mSlope > 0.5) { markerDirection = "r"; }
                if (Math.abs(mSlope) > 2) {
                    markerDirection = (i % 2 == 0) ? "l" : "r";
                }
            }
        }
        else {
            nextLat = parseFloat(dataArray[i-1].lt);
            nextLon = parseFloat(dataArray[i-1].ln);
            if (thisLon - nextLon != 0)
            {
                mSlope = (nextLat - thisLat) / (nextLon - thisLon);
                if (mSlope < -0.5) { markerDirection = "l"; }
                if (mSlope > 0.5) { markerDirection = "r"; }
                if (Math.abs(mSlope) > 2) {
                    markerDirection = (i % 2 == 0) ? "l" : "r";
                }
            }
        }
        markers[i] = new PaddleMarkerObj(thisLat, thisLon, dataArray[i].t1, dataArray[i].i1);
        markers[i].Location = unescape(dataArray[i].nm);
        markers[i].Date = new Date(dataArray[i].dt);
        markers[i].TimeZoneAbbr = dataArray[i].tz;
        createPaddleMarker(map, markers[i], markerDirection);
    }
}

function init() {
    // Google Map Options
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 10,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(41.82399, -71.41283), // New York

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{
            'featureType': 'administrative.country',
            'elementType': 'geometry',
            'stylers': [{
                'visibility': 'simplified'
            }, {
                'hue': '#ff0000'
            }]
        }]
    };

    // Get the HTML DOM element that will contain your map
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    map = new google.maps.Map(mapElement, mapOptions);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directions-list"));

    var marker = new google.maps.Marker({
        map: map,
        position: map.getCenter()
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            marker.setPosition(pos);
            map.setZoom(15);
            map.panTo(marker.position);
        });
    }
}

function getDirections(start, end) {
    ib.close();

    var currentHour = 17;
    var departHour = "5pm";
    departHour = departHour.replace("@", "");
    if (departHour.indexOf("am") > -1) {
        departHour = departHour.replace("am","");
        departHour = parseInt(departHour);
        if (departHour == 12) { departHour = 0; }        }
    else {
        departHour = departHour.replace("pm","");
        departHour = parseInt(departHour);
        departHour += 12;
        if (departHour > 23) { departHour = 12; }
    }
    if (departHour < currentHour) {
        departHour += 24;
    }

    rtDistance = 0; //running total of distance
    rtDuration = 0; //running total of duration
    document.getElementById("directions-list").innerHTML = "";
    $('#directions-panel').show();

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    // clear map
    hidePaddleMarkers();

    directionsService.route(request, function (response, status) {
        console.log(status);
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var numRoutes = response.routes.length;

            var route = response.routes[0];
            var verts = route.overview_path.length;
            var path = route.overview_path;

            for (var i = 0; i < route.legs.length; i++) {
                rtDuration += route.legs[i].duration.value; // seconds
            }

            var pathVertsPerHour = Math.round((verts / rtDuration) * 3600);
            if (pathVertsPerHour > 0)
            {
                var pathHours = (Math.round(rtDuration / 3600));
                var pathMarkerCount = 0;
                var mURL = "http://drivingwx.accu-weather.com/widget/drivingwx/weather-data.asp?metric=0&locs=";
                var hrCutoff = 24;
                for (var v = 0; v < verts; v += pathVertsPerHour) {
                    if (pathMarkerCount == pathHours) {
                        // Find distance between this and final destination point
                        // d = sqrt( (x2-x1)^2 + (y2-y1)^2 )
                        var distance = Math.sqrt(Math.pow(path[v].lng() - path[verts - 1].lng(), 2) + Math.pow(path[v].lat() - path[verts - 1].lat(), 2));
                        if (distance < 0.2) {
                            continue;
                        }
                    }
                    if (v > 0) { mURL += "|"; }
                    mURL += (departHour+pathMarkerCount) + "," + roundToDecimal(path[v].lat(), 3) + "," + roundToDecimal(path[v].lng(), 3);
                    pathMarkerCount++;
                    if (pathMarkerCount == hrCutoff) {
                        break;
                    }
                }
                // add destination point
                if (pathMarkerCount < hrCutoff) {
                    mURL += "|" + (departHour+pathMarkerCount) + "," + roundToDecimal(path[verts - 1].lat(), 3) + "," + roundToDecimal(path[verts - 1].lng(), 3);
                }

                $.ajax({
                    url: mURL,
                    dataType: "jsonp",
                    timeout: 2000,
                    jsonpCallback: "getWeather",
                    error: function(data) {
                        alert("Sorry! We are not able to get weather information for the route you selected.");
                    },
                    statusCode: {
                        408: function() {
                            alert('Sorry! The request took took long. Press \"GO\" to try again.');
                        }
                    }
                });
                //alert(mURL);
            }
            else {
                alert("Sorry! We are not able to get weather information for the route you selected.");
            }
            return false;
        }
        else
        {
            alert("Sorry! We are not able to get directions for the destinations you selected.");
            return false;
        }
        return false;
    });

}

function roundToDecimal(value, decimals) {
    var rfactor = Math.pow(10, decimals);
    return Math.round(value * rfactor) / rfactor;
}
function pad(number, length) {
    var str = "" + number;
    while (str.length < length) {
        str = "0" + str;
    }
    return str;
}

var from_address  = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById('from_address')), {
        types: ['geocode']
    });
from_address.addListener('place_changed', addressChanged);

var to_address  = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    (document.getElementById('to_address')), {
        types: ['geocode']
    });
to_address.addListener('place_changed', addressChanged);

function addressChanged() {
    from = from_address.getPlace();
    to = to_address.getPlace();

    if(from && to){
        getDirections(from.geometry.location, to.geometry.location)
    }
}

$('.button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'left', // Choose the horizontal origin
    closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true // Choose whether you can drag to open on touch screens
});

// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);
