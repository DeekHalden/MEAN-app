angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, AuthFactory) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = $localStorage.getObject('userinfo', '{}');
        $scope.reservation = {};
        $scope.registration = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };
        $scope.isAuthenticated = AuthFactory.isAuthenticated();
        console.log($scope.isAuthenticated);
        // Perform the login action when the user submits the login form


        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);
            if ($scope.rememberMe) $localStorage.storeObject('userinfo', $scope.loginData);
            AuthFactory.login($scope.loginData);

            $timeout(function() {
                $scope.closeLogin();
            }, 1000);

        };

        $scope.logout = AuthFactory.logout();
        // Form data for the reservation modal

        // Create the reserve modal that we will use later


        // Create the registration modal that we will use later
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.registerform = modal;
        });

        // Triggered in the registration modal to close it
        $scope.closeRegister = function() {
            $scope.registerform.hide();
        };

        // Open the registration modal
        $scope.register = function() {
            $scope.registerform.show();
        };

        // Perform the registration action when the user submits the registration form
        $scope.doRegister = function() {
            console.log('Doing reservation', $scope.reservation);

            // Simulate a registration delay. Remove this and replace with your registration
            // code if using a registration system
            $timeout(function() {
                $scope.closeRegister();
            }, 1000);
        };

    })
    // Taking a picture for the registration through $cordovaCamera bridge propiety
    // $ionicPlatform.ready(function() {
    //     var optionsCamera = {
    //         quality: 50,
    //         destinationType: Camera.DestinationType.DATA_URL,
    //         sourceType: Camera.PictureSourceType.CAMERA,
    //         allowEdit: true,
    //         encodingType: Camera.EncodingType.JPEG,
    //         targetWidth: 100,
    //         targetHeight: 100,
    //         popoverOptions: CameraPopoverOptions,
    //         saveToPhotoAlbum: false
    //     };
    //      $scope.takePicture = function() {
    //         $cordovaCamera.getPicture(optionsCamera).then(function(imageData) {
    //             $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
    //         }, function(err) {
    //             console.log(err);
    //         });

//         $scope.registerform.show();

//     };
//     // Picking a picture from the image folder through $cordovaImagePicker bridge propiety
//     var optionsImagePicker = {
//         maximumImagesCount: 1,
//         width: 100,
//         height: 100,
//         quality: 50
//     };
//     $scope.pickPicture = function() {             
//         $cordovaImagePicker.getPictures(optionsImagePicker).then(function (imageData) {
//             //$scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
//             //The $cordovaImagePicker get the picture source as an array
//             $scope.registration.imgSrc = imageData[0];
//     }, function(error) {
//       // error getting photos
//         console.log(err);
//     });             

//     $scope.registerform.show();

//     };



// });


.controller('MarketController', ['$scope', '$stateParams', '$mdDialog', '$mdToast', 'AuthFactory', 'MarketFactory', '$state', 'ngDialog', function($scope, $stateParams, $mdDialog, $mdToast, AuthFactory, MarketFactory, $state, ngDialog) {
    $scope.isAdmin = AuthFactory.isAdmin();
    $scope.items = MarketFactory.query(function(response) { $scope.items = response; }, function(response) { $scope.message = 'Error: ' + response.status + ' ' + response.statusText; })
    $scope.$on('saveItem', function(event, item) { $scope.items.push(item) })
    $scope.openSidebar = function() { $state.go('app.market.new') };
    $scope.editItem = function(item) {
        $scope.editing = true;
        $scope.sidebarTitle = 'Редактировать Товар';
        $scope.item = item;
        $state.go('app.market.edit', { id: item._id, item: item });
    }
    $scope.user = AuthFactory.getUsername();
    $scope.delete = function(event, item) {
        var confirm = $mdDialog.confirm().title('Вы действительно хотите удалить ' + item.title + '?').ok('Да').cancel('Нет').targetEvent(event);
        $mdDialog.show(confirm).then(function() {
            var index = $scope.items.indexOf(item);
            MarketFactory.delete({ id: item._id }, function(success) { $scope.items.splice(index, 1); });
            showToast(item.title + ' удалён!')
        }, function() {});
    };

    function showToast(message) { $mdToast.show($mdToast.simple().content(message).position('top, right').hideDelay(3000)) };
}]).controller('newItemCtrl', ['$scope', '$state', '$mdSidenav', '$timeout', '$mdDialog', 'MarketFactory', 'AuthFactory', function($scope, $state, $mdSidenav, $timeout, $mdDialog, MarketFactory, AuthFactory) {
    var vm = this;
    vm.closeSidebar = closeSidebar;
    vm.saveItem = saveItem;
    $timeout(function() { $mdSidenav('new').open(); });
    $scope.$watch('vm.sidenavOpen', function(sidenav) {
        if (sidenav === false) $mdSidenav('new').close().then(function() { $state.go('app.market') })
    })

    function closeSidebar() { vm.sidenavOpen = false; }

    function saveItem(item) {
        if (!item.title || item.title === '') {
            return;
        }
        MarketFactory.update({ title: item.title, description: item.description, price: item.price, image: item.photo, stock: item.stock })
        $state.go('app.market', {}, { reload: true })
        item.title = '';
        item.description = '';
        item.price = '';
        item.photo = '';
        item.stock = '';
    };
}]).controller('editItemCtrl', function($state, $scope, $mdSidenav, $mdDialog, $timeout, MarketFactory) {
    var vm = this;
    vm.closeSidebar = closeSidebar;
    vm.saveEdit = saveEdit;
    vm.sidebarTitle = 'Редактировать Товар';
    vm.item = $state.params.item;
    $timeout(function() { $mdSidenav('edit').open(); });
    $scope.$watch('sidenavOpen', function(sidenavOpen) {
        if (sidenavOpen === false) { $mdSidenav('left').close().then(function() { $state.go('app.market'); }); }
    });

    function closeSidebar() {
        vm.item = {};
        $scope.sidenavOpen = false;
    }

    function saveEdit(item) {
        $scope.sidenavOpen = false;
        MarketFactory.update({ id: item._id }, item)
    }
}).controller('ItemController', ['$scope', 'AuthFactory', 'MarketFactory', '$stateParams', function($scope, AuthFactory, MarketFactory, $stateParams) {
    $scope.item = {};
    $scope.message = "Loading ...";
    $scope.item = MarketFactory.get({ id: $stateParams.id }).$promise.then(function(response) { $scope.item = response; }, function(response) { $scope.message = 'Error: ' + response.status + ' ' + response.statusText; })
}]).controller('BlogController', ['$scope', 'BlogFactory', '$state', 'PostFactory', 'AuthFactory', function($scope, BlogFactory, $state, PostFactory, AuthFactory) {
    $scope.isAdmin = AuthFactory.isAdmin();
    $scope.auth = AuthFactory.isAuthenticated();

    var posts = BlogFactory.query(function(response) {
        $scope.posts = response;
        console.log($scope.posts);
    }, function(response) { $scope.message = 'Error: ' + response.status + ' ' + response.statusText; });


    $scope.user = AuthFactory.getUsername();
    $scope.addPost = function(post) {
        if (!post.title || post.title === '') {
            return;
        }
        BlogFactory.save({ title: post.title, content: post.content, author: $scope.user });
        $state.go($state.current, {}, { reload: true });
        $scope.title = '';
        $scope.content = '';
    }
    $scope.deletePost = function(event, post) {
        var confirm = $mdDialog.confirm().title('Вы действительно хотите удалить ' + post.title + '?').ok('Да').cancel('Нет').targetEvent(event);
        $mdDialog.show(confirm).then(function() {
            var index = $scope.posts.indexOf(post);
            BlogFactory.delete({ id: post._id }, function(success) { $scope.posts.splice(index, 1); });

        });
    };
    $scope.sizeOf = function(obj) {
        if (Object.keys(obj || {}).length === 1) {
            return Object.keys(obj || {}).length;
        } else if (Object.keys(obj || {}).length >= 5 || (Object.keys(obj || {}).length) === 0) {
            return Object.keys(obj || {}).length;
        } else if (2 <= (Object.keys(obj || {}).length) <= 4) {
            return Object.keys(obj || {}).length;
        }
    };
    $scope.incrementUpvotes = function(post) { PostFactory.upvote(post); };
    $scope.decrementUpvotes = function(post) { PostFactory.downvote(post); };


}]).controller('PostController', ['$scope', '$state', 'commentFactory', 'BlogFactory', 'PostFactory', 'AuthFactory', '$stateParams', function($scope, $state, commentFactory, BlogFactory, PostFactory, AuthFactory, $stateParams) {
    $scope.post = {};
    $scope.post = BlogFactory.get({ id: $stateParams.id }).$promise.then(function(response) { $scope.post = response; }, function(response) { $scope.message = 'Error: ' + response.status + ' ' + response.statusText; });
    $scope.user = AuthFactory.getUsername();
    $scope.auth = AuthFactory.isAuthenticated();
    console.log($scope.auth);
    $scope.addComment = function() {
        if ($scope.body === '') {
            return false;
        };
        commentFactory.save({ id: $stateParams.id }, { body: $scope.body, author: $scope.user }).$promise.then(function() { $state.go($state.current, {}, { reload: true }); });
        $scope.body = '';
    };
    $scope.incrementUpvotes = function(post, comment) {
        PostFactory.upvoteComment(post, comment);
        $state.go($state.current, {}, { reload: true });
    };
    $scope.decrementUpvotes = function(post, comment) {
        PostFactory.downvoteComment(post, comment);
        $state.go($state.current, {}, { reload: true });
    };
    // $scope.openLogin = function() { ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller: "LoginController" }); };
}]).controller('CheckoutController', ['$scope', '$state', 'ngCart', 'orderFactory', '$mdToast', function($scope, $state, ngCart, orderFactory, $mdToast) {
    $scope.order = { place: '', method: '', name: '', email: '', telephone: '', delivery: '' }
    $scope.errors = '';
    var items = ngCart.getItems();
    $scope.totalCost = ngCart.totalCost();
    $scope.sendOrder = function() {
        orderFactory.save([items, $scope.totalCost, $scope.order]);
        showToast('Заказ сделан! C Вами свяжутся ближайшее время!')
        $scope.order = { place: '', method: '', name: '', email: '', telephone: '', delivery: '' }
        $scope.orderForm.$setPristine();
        $scope.showDetails = false;
    }

    function showToast(message) { $mdToast.show($mdToast.simple().content(message).position('top, right').hideDelay(3000)) };
}]).controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', 'headerFactory', '$mdSidenav', function($scope, $state, $rootScope, ngDialog, AuthFactory, headerFactory, $mdSidenav) {
    $scope.openLeftMenu = function() { $mdSidenav('left').open(); }
    $scope.phrase = '';
    $scope.phrase = headerFactory.query(function(resp) {
        $scope.phrases = resp;
        return $scope.phrase = $scope.phrases[Math.floor(Math.random() * $scope.phrases.length)];
    }, function(resp) { $scope.message = 'Error: ' + resp.status + ' ' + resp.statusText; });
    $scope.name = $scope.loggedIn = false;
    $scope.username = '';
    if (AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
    $scope.openLogin = function() { ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller: "LoginController" }); };
    $scope.logOut = function() {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $state.go($state.current, {}, { reload: true });
    };
    $rootScope.$on('login:Successful', function() {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $state.go($state.current, {}, { reload: true });
    });
    $rootScope.$on('registration:Successful', function() {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    $scope.stateis = function(curstate) {
        return $state.is(curstate);
    };
}]).controller('LoginController', ['$scope', '$state', 'ngDialog', '$localStorage', 'AuthFactory', function($scope, $state, ngDialog, $localStorage, AuthFactory) {
    $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.doLogin = function() {
        if ($scope.rememberMe) $localStorage.storeObject('userinfo', $scope.loginData);
        AuthFactory.login($scope.loginData);
        ngDialog.close();
        $state.go($state.current, {}, { reload: true });
    };
    $scope.openRegister = function() { ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" }); };
}]).controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function($scope, ngDialog, $localStorage, AuthFactory) {
    $scope.register = {};
    $scope.loginData = {};
    $scope.doRegister = function() {
        AuthFactory.register($scope.registration);
        ngDialog.close();
    };
}]);
