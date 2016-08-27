'use strict';
angular.module('flapperNews')
    .factory('posts', ['$http', 'auth', function($http, auth) {
        // service body
        var o = {
            posts: []
        };

        o.getAll = function() {
            return $http.get('/posts').success(function(data) {
                angular.copy(data, o.posts);
            });
        };

        o.create = function(post) {
            return $http.post('/posts', post, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function(data) {
                o.posts.push(data);
            });
        };

        o.upvote = function(post) {
            return $http.put('/posts/' + post._id + '/upvote', null, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function(data) {
                post.upvotes += 1;

            });
        };
        o.downvote = function(post) {
            return $http.put('/posts/' + post._id + '/downvote', null, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function(data) {
                post.downvotes -= 1;
            });
        };

        o.addComment = function(id, comment) {
            return $http.post('/posts/' + id + '/comments', comment, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            });
        };

        o.upvoteComment = function(post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function(data) {
                comment.upvotes += 1;

            });
        };
        o.downvoteComment = function(post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote', null, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function(data) {
                comment.downvotes -= 1;
            });
        };
        o.get = function(id) {
            return $http.get('/posts/' + id).then(function(res) {
                return res.data;
            });
        };

        return o;
    }])
    .factory('market', ['$http', 'auth', function($http, auth) {
        var obj = {
            items: []
        };

        obj.getAll = function() {
            return $http.get('/market').success(function(data) {

                angular.copy(data, obj.items);
            });
        };

        obj.create = (item) => $http.post('/market', item, {
            headers: { Authorization: 'Bearer ' + auth.getToken() }
        }).success(function(data) {
            obj.items.push(data);
        });
        obj.delete = function(item) {
            return $http.delete('/market/' + item.id, null, {
                headers: { Authorization: 'Bearer ' + auth.getToken() }
            }).success(function(data) {
                obj.items.slice(data, 1);
            });
        };
        return obj;

    }])
    .factory('auth', ['$http', '$window', '$state', function($http, $window, $state) {
        var auth = {};
        auth.saveToken = function(token) {
            $window.localStorage['flapper-news-token'] = token;
        };

        auth.getToken = function() {
            return $window.localStorage['flapper-news-token'];
        };
        auth.isLoggedIn = function() {
            var token = auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        auth.currentUser = function() {
            if (auth.isLoggedIn()) {
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };
        auth.register = function(user) {
            return $http.post('/users/register', user).success(function(data) {
                auth.saveToken(data.token);
            });
        };
        auth.logIn = function(user) {
            return $http.post('/users/login', user).success(function(data) {
                auth.saveToken(data.token);
            });
        };
        auth.logOut = function() {
            $window.localStorage.removeItem('flapper-news-token');
            $state.go($state.current, {}, { reload: true });

        };
        return auth;
    }])

.constant('baseURL', '/')
    .factory('headerFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL + 'phrases/', null, {
            'update': {
                method: 'PUT'
            }
        })
    }])
    .factory('orderFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + 'checkout/', null, {
            'update': {
                method: 'PUT'
            }
        })
    }])
