(function() {
    'use strict';
    angular.module('meanApp')
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
        })
        .directive('quiz', function(quizFactory) {
            return {
                restrict: 'AE',
                scope: {},
                templateUrl: 'views/quiz.tpl.html',
                link: function(scope, elem, attrs) {
                    scope.start = function() {
                        scope.id = 0;
                        scope.quizOver = false;
                        scope.inProgress = true;
                        scope.getQuestion();
                    };

                    scope.reset = function() {
                        scope.inProgress = false;
                        scope.score = 0;
                    }

                    scope.getQuestion = function() {
                        var q = quizFactory.getQuestion(scope.id);
                        if (q) {
                            scope.question = q.question;
                            scope.options = q.options;
                            scope.answer = q.answer;
                            scope.answerMode = true;
                        } else {
                            scope.quizOver = true;
                            checkAnswer();
                            
                        }
                    };

                    scope.checkAnswer = function() {
                        if (!$('input[name=answer]:checked').length) return;

                        var ans = parseInt($('input[name=answer]:checked').val());

                        if (ans) {
                            scope.score += ans;

                            scope.correctAns = true;
                        } else {
                            scope.correctAns = false;
                        }

                        scope.answerMode = false;
                    };

                    scope.nextQuestion = function() {
                        scope.id++;
                        scope.getQuestion();
                    }

                    scope.reset();

                    function checkAnswer() {
                        if (scope.score <= 5) {
                                scope.result = 'Невысокая креативность Для повышения уровня профессиональной креативности необходимо развивать мышление и гибкость ума, находя различные альтернативные и новые методы решения поставленных задач. Если есть желание, то все получиться.'
                            } else if (6 <= scope.score <= 12) {
                                scope.result = 'Средняя креативность Нормальный уровень креативности.Если Вы реально креативный человек с высоким творчески потенциалом, то у Вас широкие возможности в профессиональной деятельности, в том числе руководящей.'
                            } else {
                                scope.result = 'Высокая креативность Высокий уровень креативности.Иногда слишком высокая креативность может вредить совместной деятельности, поэтому ее надо, иногда, держать в узде.Если же Вы работаете один, то у Вас большие перспективы...'
                            }
                        // body...
                    }
                }
            }
        });
})();
