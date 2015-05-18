SELECT json_build_object(
        'user_id', "user".user_id,
        'username', "user".username,
        'score', 5*COUNT(DISTINCT "like") + 10*COUNT(DISTINCT "find")
) AS "user"
FROM "user"
LEFT OUTER JOIN "like" ON "user".user_id="like".user_id
LEFT OUTER JOIN "find" ON "user".user_id="find".user_id
GROUP BY "user".user_id