const express = require('express');
const app = express();

app.get('/', function (req, res) {
    var key = 'AIzaSyDwrHGHKWUjDvdcI5-mLBdqDP9gk1L_XeI';
    var location = '-33.8670522,151.1957362';
    var radius = 500;
    var type = 'point_of_interest';

    var https = require('https');
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + 'key=' + key + '&location=' + location + '&radius=' + radius + '&type=' + type;
    console.log(url);
    https.get(url, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function () {
            // var places = JSON.parse(body);
            // var locations = places.results;
            // var randLoc = locations[Math.floor(Math.random() * locations.length)];

            res.json(JSON.parse(body));
        });
    }).on('error', function (e) {
        console.log('Got error: ' + e.message);
        res.json({error: e.message});
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
