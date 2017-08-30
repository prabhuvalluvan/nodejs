
var PaddleMarkersArray = [];

function PaddleMarkerObj(lt, ln, tmp, ico) {
    // properties
    this.Location;
    this.Temperature = tmp;
    this.AccuIcon = ico;
    this.Lat = lt;
    this.Lng = ln;
    this.LatLng = new google.maps.LatLng(lt, ln);
    this.Date;
    this.TimeZoneAbbr;
    this.Icon;
    this.IconImage;
    this.IconShape= {
        coord: [6, 1, 6, 52, 40, 52, 40, 1],
        type: 'poly'
    };
    this.IconSize;
    this.IconOrigin;
    this.IconAnchor;
    this.InfoWindow;
    // methods
    this.setIcon = setIcon;

}

function setIcon(datatype, value, direction) {
    var imgDir = "gmap-icons-v2";
    if (datatype == "temps") {
        this.IconSize = new google.maps.Size(50, 64);
        this.IconOrigin = new google.maps.Point(0, 0);
        this.IconAnchor = new google.maps.Point(24, 64);
        switch (direction) {
            case "r":
                pointerSuffix = "-rt";
                this.IconAnchor = new google.maps.Point(51, 60);
                break;
            case "l":
                pointerSuffix = "-lt";
                this.IconAnchor = new google.maps.Point(-3, 60);
                break;
        }
        imgDir = (markerIsNight(this.Date)) ? "gmap-temps-white" : "gmap-temps";
        this.IconImage = "http://vortex.accuweather.com/adc2010/images/" + imgDir + "/" + value + ".png";
    }
    else {
        this.IconSize = new google.maps.Size(56, 67);
        this.IconOrigin = new google.maps.Point(0, 0);
        this.IconAnchor = new google.maps.Point(28, 63);

        var pointerSuffix = "";
        switch (direction) {
            case "r":
                pointerSuffix = "-rt";
                this.IconAnchor = new google.maps.Point(55, 58);
                break;
            case "l":
                pointerSuffix = "-lt";
                this.IconAnchor = new google.maps.Point(1, 58);
                break;
        }
        this.IconImage = "http://vortex.accuweather.com/adc2010/images/" + imgDir + "/" + setMarkerIcon(markerIsNight(this.Date),value) + pointerSuffix + ".png";
    }

    this.Icon = new google.maps.MarkerImage(this.IconImage, this.IconSize, this.IconOrigin, this.IconAnchor);
}

function createPaddleMarker(map, themarker, direction) {

    // Create marker for "background" icon image
    themarker.setIcon("icons", themarker.AccuIcon, direction);
    var markerIconPaddle = new google.maps.Marker({
        position: themarker.LatLng,
        map: map,
        icon: themarker.Icon,
        optimized: false,
        animation: google.maps.Animation.DROP,
        zIndex: Math.round(900 - Math.abs(themarker.Lat*10))
    });
    PaddleMarkersArray.push(markerIconPaddle);

    // Create marker for temperature "overlay"
    themarker.setIcon("temps", themarker.Temperature, direction);
    var markerTemperature = new google.maps.Marker({
        position: themarker.LatLng,
        map: map,
        icon: themarker.Icon,
        shape: themarker.IconShape,
        optimized: false,
        animation: google.maps.Animation.DROP,
        zIndex: Math.round(900 - Math.abs(themarker.Lat * 10))
    });
    PaddleMarkersArray.push(markerTemperature);

    google.maps.event.addListener(markerTemperature, 'click', function () {

        var boxText = document.createElement("div");
        boxText.style.cssText = "border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; box-shadow: 2px 2px 4px #000; -moz-box-shadow: 2px 2px 4px #000; -webkit-box-shadow: 2px 2px 4px #000; margin-top: 8px; background: #ffffff; padding: 3px;";
        boxText.innerHTML = "<div class=\"infoWin\">Weather near:<br><b>" + themarker.Location + "</b><br>" + getFormattedDate(themarker.Date) + " " + themarker.TimeZoneAbbr + "</div>";

        var myOptions = {
            content: boxText
            , disableAutoPan: false
            , maxWidth: 0
            , pixelOffset: new google.maps.Size(-140, 0)
            , zIndex: null
            , boxStyle: {
                background: "url('http://vortex.accuweather.com/adc2010/m/images/infoB.png') no-repeat"
                , opacity: 1.0
                , width: "280px"
            }
            , closeBoxMargin: "15px 7px 2px 2px"
            , closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
            , infoBoxClearance: new google.maps.Size(1, 1)
            , isHidden: false
            , pane: "floatPane"
            , enableEventPropagation: false
        };

        ib.setOptions(myOptions);
        ib.open(map, markerTemperature);

    });
}

function hidePaddleMarkers() {
    if (PaddleMarkersArray) {
        for (i in PaddleMarkersArray) {
            PaddleMarkersArray[i].setMap(null);
        }
        PaddleMarkersArray.length = 0;
    }
}

function getFormattedDate(theDate) {
    var month = new Array(12);
    month[0] = "Jan.";
    month[1] = "Feb.";
    month[2] = "Mar.";
    month[3] = "Apr.";
    month[4] = "May";
    month[5] = "Jun.";
    month[6] = "Jul.";
    month[7] = "Aug.";
    month[8] = "Sep.";
    month[9] = "Oct.";
    month[10] = "Nov.";
    month[11] = "Dec.";

    var theHour = theDate.getHours();
    var theHourLabel;
    if (theHour == 0) {
        theHourLabel = "12 AM";
    }
    else if (theHour < 12)
    {
        theHourLabel = theHour + " AM";
    }
    else if (theHour == 12)
    {
        theHourLabel = theHour + " PM";
    }
    else
    {
        theHourLabel = (theHour - 12) + " PM";
    }
    return month[theDate.getMonth()] + " " + theDate.getDate() + ", " + theHourLabel;
}

function markerIsNight(theDate) {
    if (theDate.getHours() >= 19 || theDate.getHours() < 8) {
        return true;
    }
    else {
        return false;
    }
}

function setMarkerIcon(isNight, value) {
    var icon = value;
    if (isNight) {
        icon = parseInt(icon);
        if (icon < 7) { icon += 32; }
        if (icon == 7 || icon == 8) { icon = 38; }
        if (icon == 11) { icon = 37; }
        if (icon == 12) { icon = 40; }
        if (icon == 13 || icon == 14) { icon = 39; }
        if (icon == 15 || icon == 16) { icon = 41; }
        if (icon == 17) { icon = 42; }
        if (icon == 18) { icon = 40; }
        if (icon == 19 || icon == 20) { icon = 43; }
        if (icon == 21 || icon == 22) { icon = 44; }
    }
    return icon;
}
