SELECT json_build_object(
        'username', "user".username,
        'score', 5*COUNT("like".VALUE) + 10*COUNT("find")
) AS "user"
FROM "user"
LEFT OUTER JOIN "like" ON "user".user_id="like".user_id
LEFT OUTER JOIN "find" ON "user".user_id="find".user_id
GROUP BY "user".username