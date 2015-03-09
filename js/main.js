

var app = angular.module('app', ['ngRoute'])

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
       console.log('its been post')
     })
    }
  }

})


app.service('UserSvc', function ($http) {
  var svc = this
  svc.getUser = function () {
    return $http.get('/api/users', {
      headers: { 'X-Auth' : this.token }
    })
  }
  svc.login = function (username, password) {
    return $http.post('/api/sessions', {
      username: username, password: password
    }).then(function (response) {
      svc.token = response.data
      // $http.defaults.headers.common['X-Auth'] = response.data
      return svc.getUser()
    })
  }
})


app.controller('LoginCtrl', function ($scope, UserSvc) {
  console.log('ere');
  $scope.login = function (username, password) {
    UserSvc.login(username, password)
    .then(function (user) {
      console.log(user);
    })
  }
})

app.config(function ($routeProvider) {
  $routeProvider
  .when('/posts',         { controller: 'PostsCtrl', templateUrl: 'post.html' })
  // .when('/register', { controller: 'RegisterCtrl', templateUrl: 'register.html' })
  .when('/login',    { controller: 'LoginCtrl', templateUrl: 'login.html' })
})
