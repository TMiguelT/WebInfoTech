/**
 * Created by Emma Jamieson-Hoare
 */



angular.module('app')
    .controller('leaderboardController', function () {

        this.players = PlayerList;

    });




PlayerList = [

    {
        rank: "1",
        username: "emma0987",
        score: "5"
    },

    {
        rank: "2",
        username: "jakemoxey",
        score: "3"
    },

    {
        rank: "3",
        username: "brandonlyly",
        score: "0"
    }];