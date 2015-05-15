module.exports = {
    getRandomRadiusCenter: function(latitude, longitude, radius) {
        var radiusInDegrees = radius / 111000.0;

        var u = Math.random();
        var v = Math.random();
        var w = radiusInDegrees * Math.sqrt(u);
        var t = 2 * Math.PI * v;
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        var new_x = x / Math.cos(latitude)

        var foundLatitude = new_x + latitude;
        var foundLongitude = y + longitude;

        return {latitude: foundLatitude,
            longitude: foundLongitude};
    }
}