/** AngularJS powered Cover Flow with CSS3
 *
 * Created by: Jake Moxey
 *
 */


(function() {
    function coverFlowController($scope) {
        var index;

        function listenToKeystrokes() {
            var e;
            $(document).keydown(function(e) {
                if (e.which === 37) {
                    goLeft();
                } else if (e.which === 39) {
                    goRight();
                }
                $scope.$apply();
            });
        }

        function init() {
<<<<<<< HEAD
            $scope.photos = ['photos/flinders.jpg','photos/MCG,jpg','photos/MelbourneAquarium.gif',
=======
            /*$scope.colors = ['#cc0000', '#0000cc', '#00ccc0', '#00cc00', '#00e0e0', '#ccc000', '#ff00ff', '#00ff00'];*/
            $scope.colors = ['photos/flinders.jpg','photos/MCG.jpg','photos/MelbourneAquarium.gif',
>>>>>>> 0535ba290c7f7de55c40cab2f6eb2a2e1a39d391
                'photos/MelbourneMuseum.jpg','photos/Yarravalley.jpg'];
            $scope.index = parseInt($scope.photos.length / 2);

            listenToKeystrokes();
        }
        init();

        function getNonFocussedElementStyle(loc, i, multiplier) {
<<<<<<< HEAD
            return "background: url(\"public/" + $scope.photos[i] + "\"); transform: translateX(" + String(-70 * multiplier) + "%) rotateY(" + String(-loc * 45) +"deg); -webkit-transform: translateX(" + String(-70 * multiplier) + "%) rotateY(" + String(-loc * 45) +"deg); z-index: " + String(loc * multiplier) + "; opacity: " + String(1 - (-0.1 * loc * multiplier)) + ";";
=======
            /*return "background-color:" + $scope.colors[i] + "; transform: translateX(" + String(-70 * multiplier) + "%) rotateY(" + String(-loc * 45) +"deg); -webkit-transform: translateX(" + String(-70 * multiplier) + "%) rotateY(" + String(-loc * 45) +"deg); z-index: " + String(loc * multiplier) + "; opacity: " + String(1 - (-0.1 * loc * multiplier)) + ";"; */
            return "background: url(\"public/" + $scope.colors[i] + "\"); transform: translateX(" + String(-70 * multiplier) + "%) rotateY(" + String(-loc * 45) +"deg); -webkit-transform: translateX(" + String(-70 * multiplier) + "%) rotateY(" + String(-loc * 45) +"deg); z-index: " + String(loc * multiplier) + "; opacity: " + String(1 - (-0.1 * loc * multiplier)) + "; background-size: auto 200px; background-position: 50%";
>>>>>>> 0535ba290c7f7de55c40cab2f6eb2a2e1a39d391

        }

        function getFocussedElementStyle(i) {
<<<<<<< HEAD
            return "background: url(\"public/" + $scope.photos[i] + "\"); transform: translateZ(150px); -webkit-transform: translateZ(150px)";
=======
            /*return "background-color:" + $scope.colors[i] + "; transform: translateZ(150px); -webkit-transform: translateZ(150px)"; */
            return "background: url(\"public/" + $scope.colors[i] + "\"); transform: translateZ(150px); -webkit-transform: translateZ(150px); background-size: auto 200px; background-position: 50%;";
>>>>>>> 0535ba290c7f7de55c40cab2f6eb2a2e1a39d391
        }

        function goLeft() {
            if($scope.index !== 0) {
                $scope.index--;
            }
        }

        function goRight() {
            if($scope.index !== $scope.photos.length - 1) {
                $scope.index++;
            }
        }

        $scope.changeIndex = function(i) {
            $scope.index = i;
            $scope.$apply();
        };

        $scope.loadElementStyle = function(i, index) {
            var multiplier = index - i;

            if(i < index) {
                return getNonFocussedElementStyle(-1, i, multiplier);
            } else if (i === index) {
                return getFocussedElementStyle(i);
            } else {
                return getNonFocussedElementStyle(1, i, multiplier);
            }
        };

    }

    angular.
        module("app").
        controller("coverFlowController", ['$scope',
            coverFlowController]);

})();