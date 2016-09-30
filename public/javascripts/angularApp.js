/**
 * meanApp Module
 *
 * Description
 */
angular.module('meanApp', ['ui.router',
    'ngAnimate',
    'ngResource',
    'ngMaterial',
    'md.data.table',
    'ngCart', 'ngRoute',
    'google.places', 'ngDialog','ngMdIcons'
]).config(function($mdThemingProvider, $stateProvider, $urlRouterProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('orange');



    $stateProvider
        .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/partials/header.html',
                    controller: 'HeaderController'

                },
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'HomeController'
                },
                'footer': {
                    templateUrl: 'views/partials/footer.html'
                }
            }
        })
        .state('app.market', {
            url: 'market',
            views: {
                'content@': {
                    templateUrl: 'views/market.html',
                    controller: 'MarketController'
                }
            }
        })
        .state('app.market.new', {
            url: '/new',
            templateUrl: 'views/partials/newItem.tpl.html',
            controller: 'newItemCtrl as vm'

        })

        .state('app.market.edit', {
            url: '/:id/edit',
            templateUrl: 'views/partials/editItem.tpl.html',
            controller: 'editItemCtrl as vm',
            params: {
                item: null
            }

        })
        .state('app.item', {
            url: 'market/:id',
            views: {
                'content@': {
                    templateUrl: 'views/item.html',
                    controller: 'ItemController'
                }
            }
        })
        .state('app.checkout', {
            url: '/checkout',
            views: {
                'content@': {
                    templateUrl: 'views/products-checkout.html',
                    controller: 'CheckoutController'
                }
            }
        })
        .state('app.blog', {
            url: 'blog',
            views: {
                'content@': {
                    templateUrl: 'views/blog.html',
                    controller: 'BlogController'
                }
            }
        })
        .state('app.post', {
            url: 'blog/:id',
            views: {
                'content@': {
                    templateUrl: 'views/post.html',
                    controller: 'PostController'
                }
            }
        })
        .state('app.tests', {
            url: 'tests/',
            views: {
                'content@': {
                    templateUrl: 'views/tests.html',
                    controller: ''
                }
            }
        })
    $urlRouterProvider.otherwise('/');

})
