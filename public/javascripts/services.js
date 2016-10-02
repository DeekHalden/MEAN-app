'use strict';
angular.module('meanApp')
    .constant('baseURL', '/')
    .factory('headerFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL + 'phrases/', null, {
            'update': {
                method: 'PUT'
            }
        })
    }])
    .factory('MarketFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + 'market/:id', { id: '@_id' }, {
            'update': {
                method: 'PUT'
            }
        })
    }])
    .factory('BlogFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + 'blog/:id', { id: '@_id', postId: '@_postId' }, {
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
    .factory('commentFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + 'blog/:id/comments/:commentId', { id: '@_id', commentId: '@_commentId' }, {
            'update': {
                method: 'PUT'
            }
        })
    }])
    .factory('PostFactory', ['$http', '$state', function($http, $state) {
        var o = {
            posts: []
        };
        o.upvote = function(post) {
            return $http.put('/blog/' + post._id + '/upvote', { id: '@_id' }, {

            }).success(function(data) {
                // console.log(data);
                return data;
            });
        };


        o.downvote = function(post) {
            return $http.put('/blog/' + post._id + '/downvote', { id: '@_id' }, {

            }).success(function(data) {

                return data;
            });
        };
        // also unused methods
        o.upvoteComment = function(post, comment) {

            return $http.post('/blog/' + post._id + '/comments/' + comment._id + '/upvote', { id: '@_id', commentId: '@_commentId' }, {

            }).success(function(data) {
                console.log(data);
               return data

            });
        };


        o.downvoteComment = function(post, comment) {
            return $http.post('/blog/' + post._id + '/comments/' + comment._id + '/downvote', { id: '@_id', commentId: '@_commentId' }, {

            }).success(function(data) {
               
            });
        };

        o.get = function(id) {
            return $http.get('/blog/' + id).then(function(res) {
                return res.data;
            });
        };

        return o;

    }])
    .factory('$localStorage', ['$window', function($window) {
        return {
            store: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function(key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        }
    }])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog) {

    var authFac = {},
        TOKEN_KEY = 'Token',
        isAuthenticated = false,
        username = '',
        authToken = undefined,
        admin;



    function loadUserCredentials() {
        var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
        if (credentials.username != undefined) {
            useCredentials(credentials);
        }
    }

    function storeUserCredentials(credentials) {
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
    }

    function useCredentials(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
        admin = credentials.admin;


        // Set the token as header for your requests!
        $http.defaults.headers.common['x-access-token'] = authToken;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
    }

    authFac.login = function(loginData) {

        $resource(baseURL + "users/login")
            .save(loginData,
                function(response) {
                    storeUserCredentials({ username: loginData.username, token: response.token, admin: response.admin });
                    $rootScope.$broadcast('login:Successful');

                },
                function(response) {
                    isAuthenticated = false;

                    var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                        '<div><p>' + response.data.err.message + '</p><p>' +
                        response.data.err.name + '</p></div>' +
                        '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'

                    ngDialog.openConfirm({ template: message, plain: 'true' });
                }

            );

    };

    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response) {});
        destroyUserCredentials();
    };

    authFac.register = function(registerData) {

        $resource(baseURL + "users/register")
            .save(registerData,
                function(response) {
                    authFac.login({ username: registerData.username, password: registerData.password });
                    if (registerData.rememberMe) {
                        $localStorage.storeObject('userinfo', { username: registerData.username, password: registerData.password });
                    }

                    $rootScope.$broadcast('registration:Successful');
                },
                function(response) {

                    var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                        '<div><p>' + response.data.err.message +
                        '</p><p>' + response.data.err.name + '</p></div>';

                    ngDialog.openConfirm({ template: message, plain: 'true' });

                }

            );
    };

    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    authFac.getUsername = function() {
        return username;
    };

    authFac.isAdmin = function() {
        return admin;
    }

    loadUserCredentials();

    return authFac;

}])

.factory('quizFactory', function() {


    var questions = [{
        "question": "1. Вам предстоит пройти диагностический тест. Какую форму вопросов вы предпочтете?",
        "options": [{
            "name": "Выбор одного ответа из нескольких возможных (как в этом онлайн тесте)",
            "value": 1
        }, {
            "name": "Выбор ответа по типу: «да \u2013 нет», «согласен - не согласен»",
            "value": 0
        }, {
            "name": "Тест с самостоятельной формулировкой ответов",
            "value": 2
        }]
    }, {
        "question": "2. Затрудняясь в решении профессиональной проблемы, вы обращаетесь к эксперту. Какой помощи вы от него ждете?",
        "options": [{
            "name": "Подсказки, которая поможет вам принять решение",
            "value": 1
        }, {
            "name": "Дополнительной информации, которой Вы сами не располагаете",
            "value": 2
        }, {
            "name": "Инструкции, как Вам правильно поступить",
            "value": 0
        }]
    }, {
        "question": "3. Вы намерены посетить страну, в которой еще не бывали. Какой вариант путешествия вы предпочтете?",
        "options": [{
            "name": "Самостоятельное путешествие по собственному плану",
            "value": 2
        }, {
            "name": "Организованный тур с наличием достаточного свободного времени",
            "value": 1
        }, {
            "name": "Стандартный тур с осмотром достопримечательностей под руководством гида",
            "value": 0
        }]
    }, {
        "question": "4. Вам предстоит публичное выступление. Как вы намерены к нему подготовиться?",
        "options": [{
            "name": "Составите подробный конспект, который огласите близко к тексту",
            "value": 0
        }, {
            "name": "Составите развернутые тезисы, которыми будете руководствоваться",
            "value": 1
        }, {
            "name": "Обдумаете ключевую идею, которую экспромтом разовьете перед аудиторией",
            "value": 2
        }]
    }, {
        "question": "5. Каким, по-Вашему мнению, способом можно использовать карандаш?",
        "options": [{
            "name": "Его можно использовать множеством разных способов - и как украшение, и как указку, и даже как оружие",
            "value": 2
        }, {
            "name": "Тем, для которого он предназначен, - для письма и рисования",
            "value": 0
        }, {
            "name": "Если подумать, то им наверное можно воспользоваться не только для письма и рисования",
            "value": 1
        }]
    }, {
        "question": "6. Какое суждение Вы бы выбрали своим девизом?",
        "options": [{
            "name": "Либо я найду путь, либо проложу его!",
            "value": 2
        }, {
            "name": "Чтобы дойти до цели, надо прежде всего идти",
            "value": 1
        }, {
            "name": "Всё приходит к тому, кто умеет ждать",
            "value": 0
        }]
    }, {
        "question": "7. Знаете ли вы способ, каким можно потратить 1 гривну?",
        "options": [{
            "name": "Подать милостыню",
            "value": 1
        }, {
            "name": "Затрудняюсь ответить \u2013 по-моему, в наши дни на такие деньги ничего и не купишь",
            "value": 0
        }, {
            "name": "Есть, пожалуй, несколько способов \u2013 могу ими поделиться",
            "value": 2
        }]
    }, {
        "question": "8. За ограниченное время в незнакомом городе Вы успеваете осмотреть только одну достопримечательность. Какую?",
        "options": [{
            "name": "Галерею современного искусства",
            "value": 1
        }, {
            "name": "Выставку произведений местных народных умельцев",
            "value": 2
        }, {
            "name": "Знаменитый памятник старины",
            "value": 0
        }]
    }]




    return {
        getQuestion: function(id) {
            if (id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        }
    };
});


;
