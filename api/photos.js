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
                },
                {
                    id: 2,
                    url: "Yarravalley.jpg",
                    name: "Yarra Valley",
                    description: "The Yarra Valley is an Australian wine region located east of Melbourne, Victoria.",
                    location: {
                        coords: {
                            latitude: -37.682395,
                            longitude: 145.480557
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
                    date_posted: "4:00pm 24th March 2015",
                    tags: [
                        {
                            name: "Wine",
                            url: "/tags/wine"
                        },
                        {
                            name: "Valley",
                            url: "/tags/valley"
                        }
                    ],
                    likes: 1,
                    dislikes: 0,
                    finds: 4,
                    comments: [
                        {
                            name: "JimBeam",
                            date_posted: "2:55pm 25th February 2015",
                            post: "The wine tasted very nice, 10/10, nice find"
                        }
                    ]
                },
                {
                    id: 3,
                    url: "MelbourneMuseum.jpg",
                    name: "Melbourne Museum",
                    description: "Melbourne Museum is a natural and cultural history museum located in the Carlton Gardens in Melbourne, Australia, adjacent to the Royal Exhibition Building.",
                    location: {
                        coords: {
                            latitude: -37.682395,
                            longitude: 145.480557
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
                    date_posted: "4:00pm 24th January 2015",
                    tags: [
                        {
                            name: "Museum",
                            url: "/tags/museum"
                        },
                        {
                            name: "Tourism",
                            url: "/tags/tourism"
                        },
                        {
                            name: "Culture",
                            url: "/tags/culture"
                        }
                    ],
                    likes: 105,
                    dislikes: 5,
                    finds: 151,
                    comments: [
                        {
                            name: "KevinRudd",
                            date_posted: "2:55pm 25th February 2015",
                            post: "i lyk dinosaurz lel"
                        },
                        {
                            name: "JuliaGillard",
                            date_posted: "2:51pm 21st February 2015",
                            post: "lol i dont care about the museum, i care about taking student's money..."
                        },
                        {
                            name: "TonyAbbott",
                            date_posted: "2:55pm 1st February 2015",
                            post: "i came in my budgie smugglers - it was fun"
                        },
                        {
                            name: "JohnHoward",
                            date_posted: "2:55pm 25th January 2015",
                            post: "ayyyy lmaooooooo"
                        }
                    ]
                },
                {
                    id: 4,
                    url: "MelbourneAquarium.gif",
                    name: "Sea Life Melbourne Aquarium",
                    description: "Sea Life Melbourne Aquarium is a Southern Ocean and Antarctic aquarium in central Melbourne, Australia. It is located on the banks of the Yarra River beside and under the Flinders Street Viaduct and the King Street Bridge.",
                    location: {
                        coords: {
                            latitude: -37.682395,
                            longitude: 145.480557
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
                    date_posted: "4:00pm 24th January 2015",
                    tags: [
                        {
                            name: "Aquarium",
                            url: "/tags/aquarium"
                        },
                        {
                            name: "Tourism",
                            url: "/tags/tourism"
                        },
                        {
                            name: "Fish",
                            url: "/tags/fish"
                        }
                    ],
                    likes: 155,
                    dislikes: 12,
                    finds: 203,
                    comments: [
                        {
                            name: "JohnWalker",
                            date_posted: "2:55pm 25th February 2015",
                            post: "This photo was an easy find."
                        },
                        {
                            name: "JohnnyDepp",
                            date_posted: "2:51pm 21st February 2015",
                            post: "yeah pretty easy find, but hints were shit"
                        },
                        {
                            name: "YalmarKumar",
                            date_posted: "2:55pm 1st February 2015",
                            post: "good pic"
                        },
                        {
                            name: "CheeseDip",
                            date_posted: "2:55pm 25th January 2015",
                            post: "yum"
                        }
                    ]
                },
                {
                    id: 5,
                    url: "MCG.jpg",
                    name: "Melbourne Cricket Ground",
                    description: "The Melbourne Cricket Ground is an Australian sports stadium located in Yarra Park, Melbourne, Victoria, and is home to the Melbourne Cricket Club.",
                    location: {
                        coords: {
                            latitude: -37.682395,
                            longitude: 145.480557
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
                    date_posted: "4:00pm 24th January 2015",
                    tags: [
                        {
                            name: "Sports",
                            url: "/tags/sports"
                        },
                        {
                            name: "Stadium",
                            url: "/tags/stadium"
                        },
                        {
                            name: "Cricket",
                            url: "/tags/cricket"
                        }
                    ],
                    likes: 15,
                    dislikes: 52,
                    finds: 1,
                    comments: [
                        {
                            name: "John123",
                            date_posted: "2:55pm 25th February 2015",
                            post: "Had to get up in my chopper to find this one lol"
                        }
                    ]
                }
            ]
        };
    }
);

module.exports = router.routes();