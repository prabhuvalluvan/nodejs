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

//If you want to serve single file, you have do it like this.

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname + '/public/pages/maps.html'));
// });

// Listen for requests
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log('Server running on port ' + port);
});
