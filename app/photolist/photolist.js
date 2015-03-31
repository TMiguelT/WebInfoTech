/**
 * Created by Johanna on 30/03/15.
 */
var photoList;

/**
 *
 */
angular.module('app')
    .controller('photolistController', function () {

        this.orderMode = 'name';
        this.viewMode = 'list';

        this.photos = photoList;

        this.orderBy = function(toorder){
            this.orderMode = toorder;
        };
        this.viewBy = function(toView){
            this.viewMode = toView;
        };



});


photoList = [
    {
        name: 'Yarra Valley',
        image: "Yarravalley.jpg",
        description: "The Yarra Valley is an Australian wine region located east of Melbourne, Victoria.",
        type: "Scenery",
        tags: [
            'Wine',
            'Valley'
        ],
        user: 'user1',
        coordinates: [-37.682395, 145.480557]

    },

    {
        name: 'Melbourne Museum',
        image: "MelbourneMuseum.jpg",
        description: "Melbourne Museum is a natural and cultural history museum located in the Carlton Gardens in Melbourne, Australia, adjacent to the Royal Exhibition Building.",
        type: "Museum",
        tags: [
            'Museum',
            'Tourism',
            'Culture',
        ],
        user: 'user1',
        coordinates: [-37.682395, 145.480557]

    },

    {
        name: 'Sea Life Melbourne Aquarium',
        image: "MelbourneAquarium.gif",
        description: "Sea Life Melbourne Aquarium is a Southern Ocean and Antarctic aquarium in central Melbourne, Australia. It is located on the banks of the Yarra River beside and under the Flinders Street Viaduct and the King Street Bridge.",
        type: "Aquarium",
        tags: [
            'Aquarium',
            'Tourism',
            'Fish',
        ],
        user: 'user5',
        coordinates: [-37.682395, 145.480557]

    },


    {
        name: 'MCG',
        image: "MCG.jpg",
        description: "The Melbourne Cricket Ground is an Australian sports stadium located in Yarra Park, Melbourne, Victoria, and is home to the Melbourne Cricket Club.",
        type: "Stadium",
        tags: [
            "Sports",
            "Stadium",
            "Cricket"
        ],
        user: "user2",
        coordinates: [-37.819963, 144.983605]


    }];



