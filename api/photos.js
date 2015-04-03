var router = require('koa-router')();

router
    .get('/photos', function *(next) {
        this.body = {
            photos: [
                {
                    id: 1,
                    url: "flinders.jpg",
                    name: "Flinders Street Station",
                    description: "Flinders Street railway station is a railway station on the corner of Flinders and Swanston Streets in Melbourne, Australia. It serves the entire metropolitan rail network. Backing onto the city reach of the Yarra River in the heart of the city, the complex covers two whole city blocks and extends from Swanston Street to Queen Street.",
                    location: {
                        coords: {
                            latitude: -37.810144,
                            longitude: 144.962674
                        },
                        altitude: 50,
                        orientation: {
                            alpha: 241.223,
                            beta: 23.322
                        }
                    },
                    user: {
                        name: "MikeHunt"
                    },
                    date_posted: "4:00pm 69th May 2015",
                    tags: [
                        {
                            name: "Railway Station",
                            url: "#/tags/railway_station"
                        },
                        {
                            name: "Heritage",
                            url: "#/tags/heritage"
                        },
                        {
                            name: "Sexy",
                            url: "#/tags/sexy"
                        }
                    ],
                    likes: 22,
                    dislikes: 12,
                    finds: 42,
                    comments: [
                        {
                            name: "MikeHunt",
                            date_posted: "4:01pm 25th August 2015",
                            post: "this is awesome lol"
                        },
                        {
                            name: "AlistairMoffat",
                            date_posted: "3:55pm 25th August 2015",
                            post: "2/10 wood bang"
                        }
                    ]
                }
            ]
        };
    }
);

module.exports = router.routes();