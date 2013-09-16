var UicsMap = function (mapElement, options) {

    var minPercent = 30;

    var getUicColor = function (uic) {
        var p = uic.outdoorPercents;
        if (p > 20) return 'rgb(211,56,0)';
        if (p > 10) return 'rgb(232,204,0)';
        if (p > 5) return 'rgb(234,239,0)';
        return 'rgb(109,193,55)';
    };

    /* radius scale. was [2;7.4] for [40;100], but will be quadratic */
    /* [0.75;7.5] [30;100] */
    var getUicScale = function (uic) {
        // [30;100] -> [0;70]
        var diff = uic.sobyaninPercents - minPercent;
        // too small percent
        if (diff < 0) return 2;
        // [0;70] -> [2;7.5]
        return 2 + Math.sqrt(diff) / 1.52;
    };

    var getIcon = function (uic) {
        var color = getUicColor(uic);
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

    var openedInfoWindow = null;

    var map = null;

    var uics = [];

    var markers = [];

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