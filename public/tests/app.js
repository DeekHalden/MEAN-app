var app = angular.module('quizApp', ['ngMaterial']);

app.directive('quiz', function(quizFactory) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template.html',
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
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.answer = q.answer;
					scope.answerMode = true;
				} else {
					scope.quizOver = true;
				}
			};

			scope.checkAnswer = function() {
				if(!$('input[name=answer]:checked').length) return;

				var ans = parseInt($('input[name=answer]:checked').val());
				
				if(ans) {
					scope.score+=ans;
					console.log(scope.score);
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
		}
	}
});

app.factory('quizFactory', function() {
	var questions = [
		{
			question: "1. Вам предстоит пройти диагностический тест. Какую форму вопросов вы предпочтете?",
			options: [
			{
				name:"Выбор одного ответа из нескольких возможных (как в этом онлайн тесте)",
				value: 1
			}, 
			{
				name:"Выбор ответа по типу: «да – нет», «согласен - не согласен»",
				value: 0
			}, 
			{
				name:"Тест с самостоятельной формулировкой ответов",
				value: 2
			}],
			
		},
		{
			question: "2. Затрудняясь в решении профессиональной проблемы, вы обращаетесь к эксперту. Какой помощи вы от него ждете?",
			options: [
			{
				name:"Подсказки, которая поможет вам принять решение",
				value: 1
			}, 
			{
				name:"Дополнительной информации, которой Вы сами не располагаете",
				value: 2
			}, 
			{
				name:"Инструкции, как Вам правильно поступить",
				value: 0
			}],
			
		},
		{
			question: "3. Вы намерены посетить страну, в которой еще не бывали. Какой вариант путешествия вы предпочтете?",
			options: [
			{
				name:"Самостоятельное путешествие по собственному плану",
				value: 2
			}, 
			{
				name:"Организованный тур с наличием достаточного свободного времени",
				value: 1
			}, 
			{
				name:"Стандартный тур с осмотром достопримечательностей под руководством гида",
				value: 0
			}],
			
		},
		{
			question: "4. Вам предстоит публичное выступление. Как вы намерены к нему подготовиться?",
			options: [
			{
				name:"Составите подробный конспект, который огласите близко к тексту",
				value: 0
			}, 
			{
				name:"Составите развернутые тезисы, которыми будете руководствоваться",
				value: 1
			}, 
			{
				name:"Обдумаете ключевую идею, которую экспромтом разовьете перед аудиторией",
				value: 2
			}],
			
		},
		{	
			question: "5. Каким, по-Вашему мнению, способом можно использовать карандаш?",
			options: [
			{
				name:"Его можно использовать множеством разных способов - и как украшение, и как указку, и даже как оружие",
				value: 2
			}, 
			{
				name: "Тем, для которого он предназначен, - для письма и рисования",
				value: 0
			}, 
			{
				name:"Если подумать, то им наверное можно воспользоваться не только для письма и рисования",
				value: 1
			}]
			
		},
		{	
			question: "6. Какое суждение Вы бы выбрали своим девизом?",
			options: [
			{
				name:"Либо я найду путь, либо проложу его!",
				value: 2
			}, 
			{
				name: "Чтобы дойти до цели, надо прежде всего идти",
				value: 1
			}, 
			{
				name:"Всё приходит к тому, кто умеет ждать",
				value: 0
			}]
			
		},
		{	
			question: "7. Знаете ли вы способ, каким можно потратить 1 гривну?",
			options: [
			{
				name:"Подать милостыню",
				value: 1
			}, 
			{
				name: "Затрудняюсь ответить – по-моему, в наши дни на такие деньги ничего и не купишь",
				value: 0
			}, 
			{
				name:"Есть, пожалуй, несколько способов – могу ими поделиться",
				value: 2
			}]
			
		},
		{	
			question: "За ограниченное время в незнакомом городе Вы успеваете осмотреть только одну достопримечательность. Какую?",			
			options: [
			{
				name:"Галерею современного искусства",
				value: 1
			}, 
			{
				name: "Выставку произведений местных народных умельцев",
				value: 2
			}, 
			{
				name:"Знаменитый памятник старины",
				value: 0
			}]
			
		}

	];

	return {
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else {
				return false;
			}
		}
	};
});