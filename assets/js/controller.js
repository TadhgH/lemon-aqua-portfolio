(function(){
  'use strict';

  angular.module('portfolio')

  .controller('DataCtrl', ['$scope', '$localStorage', 'data', function($scope, $localStorage, data){

    $localStorage.$reset();

    $scope.dataProj = data.returnProjects(function(res) {
        $scope.contents = res;
      }, function() {
        console.log("list error");
    });

    $scope.dataTech = data.returnTechnologies();

  }])

  .controller('CMSCtrl', ['$scope', '$http', 'auth', 'db', function($scope, $http, auth, db){

    $scope.tags = [
        { text: 'JavaScript' }
    ];

    $scope.loadTags = function(query) {
      return $http.get('tags.json');
    };

    auth.admin(function(res) {
        if(res.verified == true){
          $scope.myDetails = res;
        } else {
          window.location = "/";
        }

      }, function() {
        console.log("admin error");
          //$rootScope.error = 'Failed to fetch details';
    });

    $scope.saveContent = function(content){
      content.tags = $scope.tags;
      db.save(content, function(res){
        //do something with response
      }, function() {
          //do something with error
      });

    }
  }])

  .controller('AuthCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'auth', function($rootScope, $scope, $location, $localStorage, auth){

    $scope.signin = function() {
      console.log("sign in");
      var formData = {
          adminname: $scope.adminname,
          password: $scope.password
      }

      console.log(formData);

      auth.signin(formData, function(res) {
          if (res.success == false) {
              alert("Incorrect login details");
              //window.location = "/cms";
          } else {
              console.log(res);
              $localStorage.token = res.token;
              window.location = "/#/cms";
          }
      }, function() {
          $rootScope.error = 'Failed to signin';
      })
    };

    $scope.logout = function() {
        auth.logout(function() {
            console.log("logging out");
            $localStorage.$reset();
            console.log($localStorage.token);
            window.location = "/"
        }, function() {
            alert("Failed to logout!");
        });
    };

    $scope.token = $localStorage.token;
    console.log("works");

  }]);



})();
