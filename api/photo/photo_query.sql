SELECT json_build_object(
	'id', photo.photo_id,
	'url', image_path,
	'name', photo.name,
	'description', description,
	'date_posted', date_created,
	'finds', num_finds,
	'location', ST_AsGeoJSON(location),
	'orientation', ST_AsGeoJSON(orientation),
	'user', "user"
) as photo
FROM
	photo
	JOIN "user" USING (user_id)
	JOIN comment USING (photo_id)
	JOIN "user" comment_user ON comment.user_id = comment_user.user_id
	JOIN photo_tag ON photo_tag.photo_id = photo.photo_id
	JOIN tag USING(tag_id)
LIMIT 1