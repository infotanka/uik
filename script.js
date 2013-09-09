$(function() {
    var config = {
        map: 'map'
    };
    ymaps.ready(function() {
        var map = new ymaps.Map(
                config.map,
                {
                    center: [55.76, 37.64],
                    zoom: 12
                },
        {
            autoFitToViewport: 'always'
        }
        );

        map.controls.add('zoomControl', {left: '20px', top: '20px'});
        map.behaviors.disable('dblClickZoom');
        map.behaviors.enable('scrollZoom');

        $.get('/uiks.json', function(data) {
            var isClustered = true;
            var geoObjects = [];
            $(data).each(function(idx, uik) {
                var preset = 'twirl#blueIcon';
                var color = '';
                if (uik.sobyaninPercents < 50) {
                    preset = 'twirl#blueIcon';
                    color = 'lightblue';
                } else if (uik.sobyaninPercents < 51) {
                    preset = 'twirl#darkorangeIcon';
                    color = 'orange';
                } else {
                    preset = 'twirl#redIcon';
                    color = 'red';
                }

                var placemark = new ymaps.Placemark(
                    [uik.lat, uik.lon],
                    {
                        iconContent: uik.total,
                        hintContent: uik.sobyaninPercents + '%',
                        clusterCaption: 'УИК ' + uik.uic,
                        balloonContentBody: '<div style="background-color: ' + color + ';width: 110px;">&nbsp;</div><span>Наблюдателей: ' + uik.total + '</span><br><span>Собянин: ' + uik.sobyaninPercents + '%</span>'
                    },
                    {
                        preset: preset,
                        balloonAutoPan: true
                    }
                );

                if (isClustered) {
                    geoObjects[idx] = placemark;
                } else {
                    map.geoObjects.add(placemark);
                }
            });
            if (isClustered) {
                var clusterer = new ymaps.Clusterer({clusterDisableClickZoom: true});
                clusterer.add(geoObjects);
                map.geoObjects.add(clusterer);
            }
            var bounds = map.geoObjects.getBounds();
            if (bounds) {
                map.setBounds(bounds, {
                    checkZoomRange: true,
                    zoomMargin: [20]
                });
            }
        }, 'json');
    });
})
