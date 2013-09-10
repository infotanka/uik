$(function() {
    
    var threshold = 55;
    
    var map = new UicsMap(
        document.getElementById("map"),
        {
            center: new google.maps.LatLng(55.76, 37.64),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    );
    
    function renderThresholdValue(value) {
       $('.j-threshold-value').text(value);
       map.render(value);
    }
    
    $('.j-slider').slider({
        min: 1,
        max: 99,
        value: 55
    }).on('slideStop', function(event) {
        renderThresholdValue(event.value);
    });

    $('.j-close-legend').click(function() {
        $('.j-legend-mobile').hide();
    });
    
    renderThresholdValue(threshold);
});
