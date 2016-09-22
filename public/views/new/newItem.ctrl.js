(function() {
    'use strict';
    angular
        .module('meanApp')
        .controller('newClassifiedsCtrl', ['$scope', '$state', '$mdSidenav', '$timeout', '$mdDialog', function($scope, $state, $mdSidenav, $timeout, $mdDialog ) {

            var vm = this;

            vm.closeSidebar = closeSidebar;
            vm.saveClassified = saveClassified;

            $timeout(function() {
                $mdSidenav('left').open();
            });

            $scope.$watch('vm.sidenavOpen', function(sidenav) {
                if (sidenav === false)
                    $mdSidenav('left')
                    .close()
                    .then(function() {
                        $state.go('app.market')
                    })
            })

            function closeSidebar() {
                vm.sidenavOpen = false;
            }

            function saveClassified(classified) {
                if (classified) {
                    classified.contact = {
                        name: 'Deek',
                        phone: '(066)286-57-56',
                        email: 'aa@aoeipq.com'
                    };
                    console.log(classified);
                    $scope.$emit('newClassified', classified);
                    vm.sidenavOpen = false;
                }
            }

        }])

})()
