/** AngularJS powered Cover Flow with CSS3
 *
 * Created by: Jake Moxey
 *
 */


(function() {
    function coverFlowController($scope, photoService) {
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
            $scope.index = parseInt($scope.photos.length / 2);

            listenToKeystrokes();
        }
        init();

        function getNonFocussedElementStyle(loc, i, multiplier) {
            return "background: url(\"" + photoService.getPhotoUrl() + $scope.photos[i].photo.url + "\"); transform: translateX(" + String(-70 * multiplier) + "%) rotateY(" + String(-loc * 45) +"deg); -webkit-transform: translateX(" + String(-70 * multiplier) + "%) rotateY(" + String(-loc * 45) +"deg); z-index: " + String(loc * multiplier) + "; opacity: " + String(1 - (-0.1 * loc * multiplier)) + "; background-size: auto 200px; background-position: 50%";
        }

        function getFocussedElementStyle(i) {
            return "background: url(\"" + photoService.getPhotoUrl() + $scope.photos[i].photo.url + "\"); transform: translateZ(150px); -webkit-transform: translateZ(150px); background-size: auto 200px; background-position: 50%; cursor: pointer;";
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
            if ($scope.index === i) {
                window.location.assign("/photo/" + $scope.photos[$scope.index].photo.id);
            }

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
        controller("coverFlowController", ['$scope', 'photoService',
            coverFlowController]);

})();