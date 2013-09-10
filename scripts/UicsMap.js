var UicsMap = function(mapElement, options) {
    
    var infoIcon = new google.maps.MarkerImage(
        "images/info-32x32.png",
        new google.maps.Size(32, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(0, 8),
        new google.maps.Size(8, 8)
    );
        
    var alertIcon = new google.maps.MarkerImage(
        "images/alert-32x32.png",
        new google.maps.Size(32, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(0, 8),
        new google.maps.Size(8, 8)
    );
        
    var warningIcon = new google.maps.MarkerImage(
        "images/warning-32x32.png",
        new google.maps.Size(32, 32),
        new google.maps.Point(0, 0),
        new google.maps.Point(0, 8),
        new google.maps.Size(8, 8)
    );
    
    var openedInfoWindow = null;
    
    var map = null;
    
    var uics = [];
    
    var markers = [];
    
    var loadingDeferred = new $.Deferred();
    
    function initialize() {
        map = new google.maps.Map(mapElement, options);
        
        $.get('/uiks.json', function(data) {
            uics = data;
            loadingDeferred.resolve();
        });
    };
    
    initialize();
    
    return {
        render: function(dataThreshold) {
            
            loadingDeferred.done(function() {
                if (markers.length > 0) {
                    
                    if (openedInfoWindow != null) {
                        openedInfoWindow.close();
                    }
                    
                    for(var i = 0; i < markers.length; i++){
                        markers[i].setMap(null);
                    }
                    markers = [];
                }
            
                $(uics).each(function(idx, uik) {
                    var icon = infoIcon;
                
                    if (uik.sobyaninPercents > dataThreshold) {
                        if (uik.total == 0) {
                            icon = warningIcon;
                        } else {
                            icon = alertIcon;
                        }
                    } else {
                        icon = infoIcon;
                    }
                
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(uik.lat, uik.lon),
                        map: map,
                        icon: icon,
                        title: uik.sobyaninPercents + '%'
                    });
                
                    var contentString = '<h5>УИК №' + uik.uic + '</h5><div>Результат С. Собянина: ' + uik.sobyaninPercents +'%</div>';
                    contentString = contentString + '<div>Наблюдателей: '+uik.total+'</div>';
                    contentString = contentString + '<div>Членов комиссии с ПРГ: '+uik.uic_prg+'</div>';
                    contentString = contentString + '<div>Членов комиссии с ПCГ: '+uik.uic_psg+'</div>';
                    contentString = contentString + '<div>Журналистов: '+uik.journalist+'</div>';

                    var infoWindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        if (openedInfoWindow != null) {
                            openedInfoWindow.close();
                        }
                        infoWindow.open(map, marker);
                    
                        openedInfoWindow = infoWindow;
                    });

                    google.maps.event.addListener(map, 'zoom_changed', function() {
                        var zoom = map.getZoom();
                        var relativePixelSize = 8*zoom*zoom/100;

                        //change the size of the icon
                        marker.setIcon(
                            new google.maps.MarkerImage(
                                marker.getIcon().url, //marker's same icon graphic
                                null,//size
                                null,//origin
                                null, //anchor
                                new google.maps.Size(relativePixelSize, relativePixelSize) //changes the scale
                            )
                        );
                    });
                    
                    markers.push(marker);
                });
                
            })
        }
    }
}