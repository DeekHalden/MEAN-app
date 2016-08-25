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
            if (Object.keys(obj || {}).length === 1) {
                return Object.keys(obj || {}).length + ' коментарій';
            } else if (Object.keys(obj || {}).length >= 5 || (Object.keys(obj || {}).length) === 0) {
                return Object.keys(obj || {}).length + ' коментаріїв';
            } else if (2 <= (Object.keys(obj || {}).length) <= 4) {
                return Object.keys(obj || {}).length + ' коментарії';
            }
        };
    }])
    .controller('MarketCtrl', ['$scope', 'market', 'auth', '$state','$timeout','$document',  function($scope, market, auth, $state, $timeout,$document) {
        var duration = 1500;
        var offset = 30;

        $scope.header = 'Магазин';
        $scope.items = market.items;
        $scope.user = auth.currentUser();
        $scope.addItem = function() {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            market.create({
                title: $scope.title,
                description: $scope.description,
                price: $scope.price,
                image: $scope.photo,
                stock: $scope.stock
            });
            $scope.title = '';
            $scope.description = '';
            $scope.price = '';
            $scope.photo = '';
            $scope.stock = '';
        };

        $scope.delete = function(item) {
            var elemToDelete = $scope.items[item];
            console.log(elemToDelete._id);
            market.delete({ id: elemToDelete._id }, function(success) {
                $scope.items.splice(item, 1);
            });
            $state.go($state.current, {}, { reload: true });
        };
        var form = angular.element(document.getElementById('form'));

        $scope.gotoBottom = function() {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $timeout(function() {
                    $document.scrollToElement(form, offset, duration);
                }, 100)
            }
        

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
        '$state',
        function($scope, auth, $state) {
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = auth.currentUser;
            $scope.logOut = auth.logOut;
        }
    ]);
