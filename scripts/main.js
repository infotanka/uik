$(function() {
    var map = new UicsMap(
        document.getElementById("map"),
        {
            center: new google.maps.LatLng(55.76, 37.64),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    );

    $('.j-close-legend').click(function() {
        $('.j-legend-mobile').hide();
    });

    map.render();
});
