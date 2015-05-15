SELECT json_build_object(
        'location', ST_AsGeoJSON(location)::json->'coordinates',
        'distance', ST_Distance(location, ST_GeomFromGeoJSON(?)),
        'direction', ST_Azimuth(ST_GeomFromGeoJSON(?), location) /(2*pi())*360
)
FROM photo
WHERE photo_id = ?