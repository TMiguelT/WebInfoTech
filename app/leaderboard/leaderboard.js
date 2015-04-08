/**
 * Created by Emma Jamieson-Hoare
 */



angular.module('app')
    .controller('leaderboardController', function () {

        this.players = PlayerList;

    });




PlayerList = [

    {
        Rank: "1",
        Username: "emma0987",
        Score: "5"
    },

    {
        Rank: "2",
        Username: "jakemoxey",
        Score: "3"
    },

    {
        Rank: "3",
        Username: "brandonlyly",
        Score: "0"
    }

]