SELECT 
	json_agg(photos) as photos,
	json_agg(DISTINCT json_build_object(
		'image_path', found_photo.image_path,
		'date', find.date
	)) AS finds,
	"user".* 

FROM 
	"user"
	LEFT JOIN "find" ON "find"."user_id" = "user"."user_id"
	LEFT JOIN "photo" AS "found_photo" ON "find"."photo_id" = "found_photo"."photo_id",
	LATERAL (
		SELECT 
			taken_photo."image_path",
			count("taken_find") AS finds,
			count("taken_like") AS likes,
			count("taken_dislike") AS dislikes

		FROM 
			"photo" as "taken_photo"
			LEFT JOIN "like" AS "taken_like" ON "taken_photo"."photo_id" = "taken_like"."photo_id" AND "taken_like"."value" > 1
			LEFT JOIN "like" AS "taken_dislike" ON "taken_photo"."photo_id" = "taken_dislike"."photo_id" AND "taken_dislike"."value" < 1
			LEFT JOIN "find" AS "taken_find" ON "taken_photo"."photo_id" = "taken_find"."photo_id"

		WHERE taken_photo.user_id = 23

		GROUP BY "taken_photo".photo_id
	) photos

WHERE "user"."user_id" = 23
	
GROUP BY "user"."user_id"