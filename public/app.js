angular.module('quiz', ['ngMaterial']).controller('QuizController', function($scope) {

    "use strict";
    $scope.questions = [{
        "questionText": "Why is the sky blue?",
        "answers": [
            { "answerText": "blah blah 1", "value": 1 },
            { "answerText": "blah blah 2", "value": 2 },
            { "answerText": "blah blah 3", "value": 3 }
        ]
    }, {
        "questionText": "Why is the meaning of life?",
        "answers": [
            { "answerText": "blah blah 1", "value": 1 },
            { "answerText": "blah blah 2", "value": 2 },
            { "answerText": "blah blah 3", "value": 3 }
        ]
    }, {
        "questionText": "How many pennies are in $10.00?",
        "answers": [
            { "answerText": "1,000.", "value": 1 },
            { "answerText": "10,000.", "value": 2 },
            { "answerText": "A lot", "value": 3 }
        ]
    }, {
        "questionText": "What is the default program?",
        "answers": [
            { "answerText": "Hello World.", "value": 1 },
            { "answerText": "Hello Sunshine.", "value": 2 },
            { "answerText": "Hello my ragtime gal.", "value": 3 }
        ]
    }];
    $scope.answers = {};
    $scope.correctCount = 0;
    $scope.showResult = function() {
        $scope.correctCount = 0;
        var qLength = $scope.questions.length;
        for (var i = 0; i < qLength; i++) {
            var answers = $scope.questions[i].answers;
            $scope.questions[i].userAnswer = $scope.answers[i];
            console.log($scope.questions[i].userAnswer)
            
            for (var j = 0; j < answers.length; j++) {
                
                if ($scope.questions[i].userAnswer === answers[j].answerText) {
                    console.log($scope.questions[i].userAnswer);
                    $scope.correctCount += answers[j].value;
                }
            }
        }

        //console.log($scope.answers);

    };
})
