/**
 * flapperNews Module
 *
 * Description
 */
var app = angular.module('flapperNews', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngResource']);



app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeaderController'
                },
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'HomeController'
                }
            }
        })
        .state('blog', {
            url: '/blog',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeaderController'
                },
                'content@': {
                    templateUrl: 'views/blog.html',
                    controller: 'BlogCtrl'
                }
            },
            resolve: {
                postPromise: ['posts', function(posts) {
                    return posts.getAll();
                }]
            }
        })
        .state('posts', {
            url: '/posts/{id}',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeaderController'
                },
                'content@': {
                    templateUrl: 'views/posts.html',
                    controller: 'PostsCtrl'
                }
            },
            resolve: {
                post: ['$stateParams', 'posts', function($stateParams, posts) {
                    return posts.get($stateParams.id);
                }]
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeaderController'
                },
                'content@':{
                    templateUrl:'views/login.html',
                    controller: 'AuthCtrl'
                }
            },
            
            onEnter: ['$state', 'auth', function($state, auth) {
                if (auth.isLoggedIn()) {
                    $state.go('home');
                }
            }]
        })
        .state('register', {
            url: '/register',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeaderController'
                },
                'content@':{
                    templateUrl:'views/register.html',
                    controller: 'AuthCtrl'
                }
            },
            onEnter: ['$state', 'auth', function($state, auth) {
                if (auth.isLoggedIn()) {
                    $state.go('home');
                }
            }]
        });

    $urlRouterProvider.otherwise('/')
}]);
