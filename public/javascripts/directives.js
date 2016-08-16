(function() {
    'use strict';
    angular.module('flapperNews')
        .directive('carousel', function($timeout) {
            return {
                controller: 'HomeController',
                restrict: 'E',
                scope: {
                    links: '='
                },
                templateUrl: 'views/carousel.html',
                link: function(scope, element) {
                    $timeout(function() {
                        $('.carousel-indicators li', element).first().addClass('active');
                        $('.carousel-inner .item', element).first().addClass('active');
                    });
                }
            };
        });
})();
