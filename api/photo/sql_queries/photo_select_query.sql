SELECT json_build_object(
        'id', photo.photo_id,
        'url', image_path,
        'name', photo.name,
        'description', description,
        'date_posted', date_created,
        'finds', json_agg(find_json),
        'user', json_agg(user_json),
        'comments', json_agg(comment_json),
        'tags', json_agg(tag_json),
        'likes', json_agg(like_json)
) AS "photo"
FROM
        photo
        LEFT OUTER JOIN comment USING (photo_id)
        LEFT OUTER JOIN "user" AS "commenter" ON comment.user_id = "commenter".user_id
        LEFT OUTER JOIN "user" AS "owner" ON photo.user_id = "owner".user_id
        LEFT OUTER JOIN photo_tag ON photo_tag.photo_id = photo.photo_id
        LEFT OUTER JOIN tag ON tag.tag_id = photo_tag.tag_id
        LEFT OUTER JOIN "like" ON "like".photo_id = photo.photo_id
        LEFT OUTER JOIN "user" AS "liker" ON "like".user_id = "liker".user_id
        LEFT OUTER JOIN find ON find.photo_id = photo.photo_id
        LEFT OUTER JOIN "user" AS "finder" ON "find".user_id = "finder".user_id,
        json_build_object('user_id', "commenter".user_id, 'username', "commenter".username, 'text', comment.text, 'date_posted', comment.DATE) AS comment_json,
        json_build_object('user_id', "owner".user_id, 'username', "owner".username) AS user_json,
        json_build_object('name', tag.name, 'url', CONCAT('/tags/', tag.name)) AS tag_json,
        json_build_object('user_id', "liker".user_id, 'value', "like".value) AS like_json,
        json_build_object('user_id', "finder".user_id, 'date_found', "find".date) AS find_json
