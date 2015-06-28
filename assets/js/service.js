(function(){
  'use strict';

  angular.module('portfolio')

  .service('data', ['$http', function($http){

    var baseUrl = "https://tadhghportfolio.herokuapp.com";

    var technologies = [
    {
      name: 'Angular',
      img: 'img/portfolio/400x300/angular1.jpg'
    },
    {
      name: 'Node',
      img: 'img/portfolio/400x300/node2.jpg'
    },
    {
      name: 'JavaScript',
      img: 'img/portfolio/400x300/javascript1.jpg'
    },
    {
      name: 'Bootstrap',
      img: 'img/portfolio/400x300/bootstrap1.jpg'
    },
    {
      name: 'Html',
      img: 'img/portfolio/400x300/html52.jpg'
    },
    {
      name: 'Github',
      img: 'img/portfolio/400x300/github1.jpg'
    }];

    this.returnProjects = function(success, error) {
        return $http.get(baseUrl + '/admin/list').success(success).error(error)
    }

    this.returnTechnologies = function(){
      return technologies;
    }

  }])

  .factory('auth', ['$http', '$localStorage', function($http, $localStorage){
    var baseUrl = "https://tadhghportfolio.herokuapp.com";

    function changeUser(user) {
      angular.extend(currentUser, user);
    }

    function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
          case 0:
              break;
          case 2:
              output += '==';
              break;
          case 3:
              output += '=';
              break;
          default:
              throw 'Illegal base64url string!';
      }
      return window.atob(output);
    }

    function getUserFromToken() {
      var token = $localStorage.token;
      var user = {};
      if (typeof token !== 'undefined') {
          var encoded = token.split('.')[1];
          user = JSON.parse(urlBase64Decode(encoded));
      }
      return user;
    }

    var currentUser = getUserFromToken();

    return {
      save: function(data, success, error) {
          $http.post(baseUrl + '/signin', data).success(success).error(error)
      },
      signin: function(data, success, error) {
          $http.post(baseUrl + '/admin/authenticate', data).success(success).error(error)
      },
      admin: function(success, error) {
          $http.get(baseUrl + '/cms').success(success).error(error)
      },
      logout: function(success) {
          changeUser({});
          delete $localStorage.token;
          //$localStorage.$reset();
          //$localStorage.token = 0;
          success();
      }
    }

  }])

  .factory('db', ['$http', function($http){

    var baseUrl = "https://tadhghportfolio.herokuapp.com";

    return {
      save: function(data, success, error) {
        console.log(data);
          $http.post(baseUrl + '/admin/save', data).success(success).error(error)
      },
      delete: function(data, success, error) {
          //$http.post(baseUrl + '/admin/authenticate', data).success(success).error(error)
      },
      get: function(success, error) {
          //$http.get(baseUrl + '/cms').success(success).error(error)
      }
    }
  }])

})();
