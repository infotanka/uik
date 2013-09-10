$(function() {
    
    var threshold = 55;
    var outdoorThreshhold = 2;
    
    var map = new UicsMap(
        document.getElementById("map"),
        {
            center: new google.maps.LatLng(55.76, 37.64),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    );
    
    function renderThresholdValue() {
        $('.j-threshold-value').text(threshold);
        $('.j-outdoor-threshold-value').text(outdoorThreshhold);
        console.log(threshold, outdoorThreshhold);
        map.render(threshold, outdoorThreshhold);
    }
    
    $('.j-slider').slider({
        min: 1,
        max: 99,
        value: threshold
    }).on('slideStop', function(event) {
        threshold = event.value;
        renderThresholdValue();
    });

    $('.j-outdoor-slider').slider({
        min: 1,
        max: 9,
        value: outdoorThreshhold
    }).on('slideStop', function(event) {
        console.log(event.value);
        outdoorThreshhold = event.value;
        renderThresholdValue();
    });

    $('.j-close-legend').click(function() {
        $('.j-legend-mobile').hide();
    });
    
    renderThresholdValue();
});
