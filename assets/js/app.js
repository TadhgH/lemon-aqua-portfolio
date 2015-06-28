(function(){
  'use strict';

  angular.module('portfolio', ['ngRoute', 'ngStorage', 'textAngular', 'ngTagsInput'])

  .config(function($routeProvider, $httpProvider){

    $routeProvider.
    when('/', {
        templateUrl: 'views/template-index.html',
        controller: 'DataCtrl'
    }).
    /*when('/about', {
        templateUrl: 'views/template-about.html',
        controller: 'DataCtrl'
    }).*/
    when('/contact', {
        templateUrl: 'views/template-contact.html',
        controller: 'DataCtrl'
    }).
    when('/work', {
        templateUrl: 'views/template-work.html',
        controller: 'DataCtrl'
    }).
    when('/cms', {
        templateUrl: 'views/template-cms.html',
        controller: 'CMSCtrl'
    }).
    when('/authenticate', {
        templateUrl: 'views/template-authenticate.html',
        controller: 'AuthCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
      return {
        'request': function (config) {
          console.log("interceptor");

          var token = $localStorage.token;
          config.headers = config.headers || {};
          if ($localStorage.token) {
              config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        'responseError': function(response) {
          console.log("interceptor error");
          if(response.status === 401 || response.status === 403) {
              $location.path('/authenticate');
          }
          return $q.reject(response);
        }
      };
    }]);

  })

})();
