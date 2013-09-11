var UicsMap = function(mapElement, options) {
    
    var canvasContext = null;
    var colorsMapSize = 159;
    
    var maxWatchers = 8;
    var maxOutdoor = 100;
    
    var minScale = 1;
    var maxScale = 10;
    var minPercent = 40;
    
    
    var getUicColor = function(uic) {
        var watchersPart = (maxWatchers - uic.total) / maxWatchers;
        var outdoorPart = uic.outdoorPercents / maxOutdoor;
        
        var pixel = canvasContext.getImageData(
            Math.ceil(outdoorPart * colorsMapSize), 
            Math.ceil(watchersPart * colorsMapSize),
            1,
            1
        ).data; 
            
        return 'rgb('+pixel[0]+','+pixel[1]+','+pixel[2]+')';
    }
    
    var getUicScale = function(uic) {
        var scale = minScale + Math.abs(uic.sobyaninPercents - minPercent) / (100 / (maxScale - minScale));
        return 1 + Math.ceil(scale * 100) / 100;
    }
    
    var getIcon = function(uic) {
        var color = getUicColor(uic);
        return {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: color,
            fillColor: color,
            fillOpacity: 1,
            scale: getUicScale(uic)
        };
    }

    var openedInfoWindow = null;
    
    var map = null;
    
    var uics = [];
    
    var markers = [];
    
    var loadingDeferred = new $.Deferred();
    
    function initialize() {
        map = new google.maps.Map(mapElement, options);
        
        $.get('/uiks.json', function(data) {
            uics = data;
            var img = new Image();
            img.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QCARXhpZgAASUkqAAgAAAAEABoBBQABAAAAPgAAABsBBQABAAAARgAAACgBAwABAAAAAgAAAGmHBAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAAAAwAAkAcABAAAADAyMTAAoAcABAAAADAxMDABoAMAAQAAAP//AAAAAAAA/+EDCmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiB4bWxuczp4bXA9J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8nPgogIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiB4bWxuczp4bXBNTT0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyc+CiAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpCMTUzMUI2NUZFQTkxMUUyQUZFMURGQkRGMjQ0OERFQTwveG1wTU06SW5zdGFuY2VJRD4KICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOkIxNTMxQjY1RkVBOTExRTJBRkUxREZCREYyNDQ4REVBPC94bXBNTTpJbnN0YW5jZUlEPgogIDx4bXBNTTpEb2N1bWVudElEIHJkZjpyZXNvdXJjZT0neG1wLmRpZDpCMTUzMUI2NkZFQTkxMUUyQUZFMURGQkRGMjQ0OERFQScgLz4KICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogIDwveG1wTU06RGVyaXZlZEZyb20+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCjwvcmRmOlJERj4KPC94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';

            img.onload = function() {
                var canvas = $("#canvas");
                canvasContext=canvas.get(0).getContext("2d");
                canvasContext.drawImage(img, 0, 0);
                loadingDeferred.resolve();
            }
        });
    };
    
    initialize();
    
    return {
        render: function() {

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
                    
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(uik.lat, uik.lon),
                        map: map,
                        icon: getIcon(uik),
                        title: uik.sobyaninPercents + '%'
                    });
                
                    var contentString = '<h5>УИК №' + uik.uic + '</h5><div>Результат С. Собянина: ' + uik.sobyaninPercents +'%</div>';
                    contentString = contentString + '<div>Процент «на дому»: '+uik.outdoorPercents+'%</div>';
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

                    markers.push(marker);
                });
            })
        }
    }
}