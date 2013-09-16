var RED = 'rgb(211,56,0)';
var ORANGE = 'rgb(232,204,0)';
var YELLOW = 'rgb(234,239,0)';
var GREEN = 'rgb(109,193,55)';

var uics = [];
var markers = [];

var getUicColor = function (uic, palette) {
    if (palette == 'observers') {
        switch (uic.total) {
            case 0:
                return RED;
            case 1:
                return ORANGE;
            case 2:
                return YELLOW;
        }
        return GREEN;
    }
    var p = uic.outdoorPercents;
    if (p > 20) return RED;
    if (p > 10) return ORANGE;
    if (p > 5) return YELLOW;
    return GREEN;
};

var getUicScale = function (uic) {
    return Math.sqrt(uic.sobyaninPercents);
};

var getIcon = function (uic) {
    var color = getUicColor(uic, 'observers');
    return {
        path: google.maps.SymbolPath.CIRCLE,
        strokeOpacity: 0.2,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 1,
        scale: getUicScale(uic)
    };
};

var setPalette = function (palette) {
    $('.j-line').removeClass('current');
    $('.s-' + palette).addClass('current');
    $(markers).each(function (index, marker) {
        var icon = getIcon(marker.uik);
        icon.fillColor = getUicColor(marker.uik, palette);
        marker.setIcon(icon);
    });
};

var UicsMap = function (mapElement, options) {


    var openedInfoWindow = null;

    var map = null;

    var loadingDeferred = new $.Deferred();

    function initialize() {
        map = new google.maps.Map(mapElement, options);

        $.get('./uiks.json', function (data) {
            uics = data;
            loadingDeferred.resolve();
        });
    }

    initialize();

    return {
        render: function () {

            loadingDeferred.done(function () {
                if (markers.length > 0) {

                    if (openedInfoWindow != null) {
                        openedInfoWindow.close();
                    }

                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setMap(null);
                    }
                    markers = [];
                }

                $(uics).each(function (idx, uik) {

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(uik.lat, uik.lon),
                        map: map,
                        icon: getIcon(uik),
                        title: uik.sobyaninPercents + '%'
                    });
                    marker.uik = uik;

                    var contentString = '<h5>УИК №' + uik.uic + '</h5><div>Результат С. Собянина: ' + uik.sobyaninPercents + '%</div>';
                    contentString = contentString + '<div>Процент «на дому»: ' + uik.outdoorPercents + '%</div>';
                    contentString = contentString + '<div>Наблюдателей: ' + uik.total + '</div>';
                    contentString = contentString + '<div>Членов комиссии с ПРГ: ' + uik.uic_prg + '</div>';
                    contentString = contentString + '<div>Членов комиссии с ПCГ: ' + uik.uic_psg + '</div>';
                    contentString = contentString + '<div>Журналистов: ' + uik.journalist + '</div>';

                    var infoWindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        if (openedInfoWindow != null) {
                            openedInfoWindow.close();
                        }
                        infoWindow.open(map, marker);

                        openedInfoWindow = infoWindow;
                    });

                    markers.push(marker);
                });
            })
        }
    }
};