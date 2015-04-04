

var app = angular.module('app', ['ngRoute'])

app.controller('loggedIn', function ($scope, UserSvc) {
  $scope.logz = 'Logged?'
  $scope.amLoggedIn = function(){
    return console.log(UserSvc.getUser().value.data);
  }
})

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
      console.log(svc.token)
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

//posts controller
app.controller('PostsCtrl', function ($scope, $http) {
  $scope.message = 'testing'
  $scope.addPost = function(){
    if ($scope.postBody) {
     $http.post('/blog',{
       title: 'test',
       text: $scope.postBody
     }).success(function(post) {
       $scope.postBody = null
     })
    }
  }
})

app.controller('LoginCtrl', function ($scope, UserSvc, $location) {
  $scope.login = function (username, password) {
    UserSvc.login(username, password)
    .then(function (user) {
      $scope.$emit('login', user)
      $location.path('/')
    })
  }
})

app.controller('RegisterCtrl', function ($scope, UserSvc, $location) {
  $scope.register = function (username, password) {
    UserSvc.register(username, password)
    .then(function (user) {
      $scope.$emit('login', user)
      $location.path('/')
    })
  }
})



app.config(function ($routeProvider) {
  $routeProvider
  .when('/posts',    { controller: 'PostsCtrl', templateUrl: 'post.html' })
  .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
  .when('/login',    { controller: 'LoginCtrl', templateUrl: 'login.html' })
})
