$(function() {
    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(55.76, 37.64),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        
        var infoIcon = new google.maps.MarkerImage(
            "images/info.png",
            new google.maps.Size(8, 8),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 8)
        );
        
        var alertIcon = new google.maps.MarkerImage(
            "images/alert.png",
            new google.maps.Size(8, 8),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 8)
        );
        
        var warningIcon = new google.maps.MarkerImage(
            "images/warning.png",
            new google.maps.Size(8, 8),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 8)
        );

        var openedInfoWindow = null;
        
        $.get('/uiks.json', function(data) {
            
            $(data).each(function(idx, uik) {
                var icon = infoIcon;
                var color = '';
                var icon = 'twirl#blueIcon';
                var color = '';
                
                if (uik.sobyaninPercents > 50) {
                    if (uik.total == 0) {
                        icon = warningIcon;
                        color = 'red';
                    } else {
                        icon = alertIcon;
                        color = 'red';
                    }
                } else {
                    icon = infoIcon;
                    color = 'lightblue';
                }
                
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(uik.lat, uik.lon),
                    map: map,
                    icon: icon,
                    title: uik.sobyaninPercents + '%'
                });
                
                var contentString = '<h5>УИК №' + uik.uic + '</h5><div>Результат С. Собянина: ' + uik.sobyaninPercents +'%</div>';
                contentString = contentString + '<div>Количество наблюдателей: '+uik.total+'</div>';
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
            });
        });
    }

    initialize();

});
