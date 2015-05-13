SELECT json_build_object(
        'location', ST_AsGeoJSON(location)::json->'coordinates'
)
FROM photo
WHERE photo_id = ?