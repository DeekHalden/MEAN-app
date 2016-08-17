app.controller('BlogCtrl', ['$scope', 'posts', 'auth', function($scope, posts, auth) {
        $scope.posts = posts.posts;

        $scope.blogTitle = 'Психологічний блог';

        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.addPost = function() {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            posts.create({
                title: $scope.title,
                content: $scope.content,
                author: 'user'
            });
            $scope.title = '';
            $scope.content = '';
        };
        $scope.incrementUpvotes = function(post) {
            posts.upvote(post);
        };

        $scope.decrementUpvotes = function(post) {
            posts.downvote(post);
        };

        $scope.user = auth.currentUser();

        $scope.sizeOf = function(obj) {
            if(Object.keys(obj || {}).length === 1){
                return Object.keys(obj || {}).length + ' коментарій';
            } else if(Object.keys(obj || {}).length >= 5 || (Object.keys(obj || {}).length) === 0){
                return Object.keys(obj || {}).length + ' коментаріїв';
            } else if ( 2<= (Object.keys(obj || {}).length) <= 4 ){
                return Object.keys(obj || {}).length + ' коментарії';
            } 
        };
    }])
    .controller('MarketCtrl', ['$scope','market', function($scope, market){
        $scope.title = 'Магазин';
        $scope.items = market.items;
       
    }])
    .controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth', function($scope, posts, post, auth) {
        $scope.post = post;

        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addComment = function() {
            if ($scope.body === '') {
                return;
            }
            posts.addComment(post._id, {
                body: $scope.body,
                author: 'user',
            }).success(function(comment) {
                $scope.post.comments.push(comment);
            });
            $scope.body = '';
        };
        $scope.incrementUpvotes = function(comment) {
            posts.upvoteComment(post, comment);
        };
        $scope.decrementUpvotes = function(comment) {
            posts.downvoteComment(post, comment);
        };
    }])
    .controller('HomeController', ['$scope', function($scope) {
        $scope.links = [
            { src: './images/pr1.jpg', alt: 'kekeke', caption: 'Арт-терапія, яка безболісно допомагає в складних ситуаціях', description: 'Арттерапія Бла-ла-ла' },
            { src: './images/rp2.jpg', alt: '', caption: 'Допоможемо зберігти душевну рівновагу', description: 'Допомога кваліфікованного психолога' },
            { src: './images/pr3.jpg', alt: '', caption: 'Не дамо зруйнувати себе з середини', description: 'блалаллааа' },
        ];

    }])
    .controller('HeaderController', ['$scope', 'headerFactory', function($scope, headerFactory) {
        $scope.phrase = '';
        headerFactory.query(
            function(resp) {
                $scope.phrases = resp;
                return $scope.phrase = $scope.phrases[Math.floor(Math.random() * $scope.phrases.length)];
            },
            function(resp) {
                $scope.message = 'Error: ' + resp.status + ' ' + resp.statusText;
            }
        )

    }])

.controller('AuthCtrl', [
        '$scope',
        '$state',
        'auth',
        function($scope, $state, auth) {
            $scope.user = {};

            $scope.register = function() {
                auth.register($scope.user).error(function(error) {
                    $scope.error = error;
                }).then(function() {
                    $state.go('blog');
                });
            };

            $scope.logIn = function() {
                auth.logIn($scope.user).error(function(error) {
                    $scope.error = error;
                }).then(function() {
                    $state.go('blog');
                });
            };
        }
    ])
    .controller('NavCtrl', [
        '$scope',
        'auth',
        function($scope, auth) {
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = auth.currentUser;
            $scope.logOut = auth.logOut;
        }
    ]);
