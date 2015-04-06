

var app = angular.module('app', ['ngRoute'])

app.service('UserSvc', function ($http) {
  var svc = this
  svc.getUser = function () {
    return $http.get('/users')
    .then(function (response) {
      return response.data
    })
  }
  svc.login = function (username, password) {
    return $http.post('/sessions', {
      username: username, password: password
    }).then(function (response) {
      svc.token = response.data
      $http.defaults.headers.common['X-Auth'] = response.data
      return svc.getUser()
    })
  }
  svc.register = function (username, password) {
    // return 'hey';
    return $http.post('/users', {
      username: username, password: password
    }).then(function () {
      return svc.login(username, password)
    })
  }
})

app.service('PostsSvc', function ($http) {
  this.fetch = function() {
    return $http.get('/blog/all')
  }
})

app.controller('EditPostsCtrl', function ($scope, PostsSvc, $http, $location) {
  PostsSvc.fetch().success(function(posts) {
    $scope.posts = posts
  })
  $scope.specific = function(id, post) {
    post.deleted = true
    $http.delete('/blog/select/' + id)
    .success(function(post){
    })
  }
})

app.controller('PostsCtrl', function ($scope, PostsSvc, $http) {
//   $scope.addPost = function(){
//     if ($scope.postBody) {
//      $http.post('/blog',{
//        title: 'test',
//        text: $scope.postBody
//      }).success(function(post) {
//        $scope.postBody = null
//      })
//     }
//   }
});

app.controller('LoginCtrl', function ($scope, $rootScope, UserSvc, $location) {
  $scope.login = function (username, password) {
    UserSvc.login(username, password)
    .then(function (user) {
      $scope.$emit('login', user)
      $rootScope.loggedIn = 'yes'
      console.log($rootScope.loggedIn)
      $location.path('/posts')
    })
  }
})

app.controller('RegisterCtrl', function ($scope, UserSvc, $location) {
  $scope.register = function (username, password) {
    UserSvc.register(username, password)
    .then(function (user) {
      $scope.$emit('login', user)
      $location.path('/posts')
    })
  }
})




app.config(function ($routeProvider) {
  $routeProvider
  .when('/posts',    { controller: 'PostsCtrl', templateUrl: 'post.html' })
  .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
  .when('/login',    { controller: 'LoginCtrl', templateUrl: 'login.html' })
  .when('/',    { controller: 'LoginCtrl', templateUrl: 'login.html' })
  .when('/editposts',    { controller: 'EditPostsCtrl', templateUrl: 'editposts.html' })
})
.run( function($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( $rootScope.loggedIn == null ) {
        // no logged user, we should be going to #login
        if ( next.templateUrl == "partials/login.html" ) {
          // already going to #login, no redirect needed
        } else {
          // not going to #login, we should redirect now
          $location.path( "/login" );
        }
      }         
    });
 })
