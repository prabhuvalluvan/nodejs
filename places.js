var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Define the port to run on
app.set('port', 3000);

//This is how you serve a static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// //If you want to serve single file, you have do it like this.
// app.get('/login', function (req, res) {
//     res.sendFile(path.join(__dirname + '/public/pages/login.html'));
// });
//
// app.post('/login', function (req, res) {
//     var data = req.body;
//     User.findOne({email: data.email}, function (err, user) {
//         if (err) return res.json({message: 'Login failed.'});
//         if (user.password !== data.password) return res.json({message: 'Login failed.'});
//         res.json({message: 'Login success. Welcome ' + user.name});
//     });
// });
//
// app.get('/signup', function (req, res) {
//     res.sendFile(path.join(__dirname + '/public/pages/signup.html'));
// });
//
// app.post('/signup', function (req, res) {
//     var data = req.body;
//     //now the password is not encrypted. You have to encrypt.
//     var newUser = new User({
//         name: data.name,
//         email: data.email,
//         password: data.password
//     });
//     newUser.save().then(function () {
//         res.json({message: 'Account created! Please Sign in.'});
//     }).catch(function (error) {
//         res.json({message: 'Oops! Something went wrong.'});
//     });
//
// });

app.get('/', function (req, res) {
    https://maps.googleapis.com/maps/api/directions/json?origin=75+9th+Ave+New+York,+NY&destination=MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073&key=YOUR_API_KEY
    var key = 'AIzaSyDwrHGHKWUjDvdcI5-mLBdqDP9gk1L_XeI';
    var location = '-33.8670522,151.1957362';
    var radius = 500;
    var type = 'point_of_interest';

    var https = require('https');
    var url = 'https://maps.googleapis.com/maps/api/directions/json?origin=Vancouver&destination=Seattle&key=AIzaSyDwrHGHKWUjDvdcI5';
    console.log(url);
    https.get(url, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function () {
            res.json(JSON.parse(body));
        });
    }).on('error', function (e) {
        console.log('Got error: ' + e.message);
        res.json({error: e.message});
    });
});

// Listen for requests
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log('Server running on port ' + port);
});

// app.get('/', function (req, res) {
//     var key = 'AIzaSyDwrHGHKWUjDvdcI5-mLBdqDP9gk1L_XeI';
//     var location = '-33.8670522,151.1957362';
//     var radius = 500;
//     var type = 'point_of_interest';
//
//     var https = require('https');
//     var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + 'key=' + key + '&location=' + location + '&radius=' + radius + '&type=' + type;
//     console.log(url);
//     https.get(url, function (response) {
//         var body = '';
//         response.on('data', function (chunk) {
//             body += chunk;
//         });
//
//         response.on('end', function () {
//             // var places = JSON.parse(body);
//             // var locations = places.results;
//             // var randLoc = locations[Math.floor(Math.random() * locations.length)];
//
//             res.json(JSON.parse(body));
//         });
//     }).on('error', function (e) {
//         console.log('Got error: ' + e.message);
//         res.json({error: e.message});
//     });
// });



function getDirections() {
    var start, end;
    ib.close();
    start = document.directions["in-leaving"].value;
    end = document.directions["in-going"].value;
    if (start == "" || start == "Leaving from..." || end == "" || end == "Going to...") {
        alert("Please enter your location and destination.");
        return false;
    }

    var currentHour = 17;
    var departHour = $('span#leaving').html();
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
    document.getElementById("wxinfoloading").innerHTML = "<div style=\"background:#9cd8f9; padding:25px; color:#FFF; font-weight:bold; border-radius:10px; -moz-border-radius:10px; -webkit-border-radius:10px; box-shadow:2px 2px 5px #000; -moz-box-shadow:2px 2px 5px #000; -webkit-box-shadow:2px 2px 5px #000; text-shadow:1px 1px 3px #000;\">Retrieving Directions...</div>";
    document.getElementById("directions-list").innerHTML = "";
    $('#directions-panel').show();
    document.getElementById("wxinfo").innerHTML = "";

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    // clear map
    hidePaddleMarkers();

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            document.getElementById("wxinfoloading").innerHTML = "<div style=\"background:#9cd8f9; padding:25px; color:#FFF; font-weight:bold; border-radius:10px; -moz-border-radius:10px; -webkit-border-radius:10px; box-shadow:2px 2px 5px #000; -moz-box-shadow:2px 2px 5px #000; -webkit-box-shadow:2px 2px 5px #000; text-shadow:1px 1px 3px #000;\">Loading Weather...</div>";
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
                        document.getElementById("wxinfoloading").innerHTML = "";
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
                document.getElementById("wxinfoloading").innerHTML = "";
            }
            return false;
        }
        else
        {
            alert("Sorry! We are not able to get directions for the destinations you selected.");
            document.getElementById("wxinfoloading").innerHTML = "";
            return false;
        }
        return false;
    });

}
