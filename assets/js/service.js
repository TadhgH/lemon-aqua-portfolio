(function(){
  'use strict';

  angular.module('portfolio')

  .service('data', [function(){

    var projects = [
    {
      name: 'Lia Lugo',
      tech: 'svg-1',
      content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
    },
    {
      name: 'George Duke',
      tech: 'svg-2',
      content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
    }];

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

    this.returnProjects = function(){
      return projects;
    }

    this.returnTechnologies = function(){
      return technologies;
    }

  }])

  .factory('auth', ['$http', '$localStorage', function($http, $localStorage){
    var baseUrl = "http://localhost:1337";

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
    };


  }]);
})();
