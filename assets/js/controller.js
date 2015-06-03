(function(){
  'use strict';

  angular.module('portfolio')

  .controller('DataCtrl', ['$scope', '$localStorage', 'data', function($scope, $localStorage, data){

    $localStorage.$reset();
    //console.log($localStorage.token);
    $scope.hey = "hey";
    $scope.dataProj = data.returnProjects();
    $scope.dataTech = data.returnTechnologies();

    console.log($scope.dataTech[0].img);

  }])

  .controller('CMSCtrl', ['$scope', 'auth', function($scope, auth){

    console.log("jckpot");

    auth.admin(function(res) {
        if(res.verified == true){
          console.log(res);
          $scope.myDetails = res;
        } else {
          console.log(res);
          window.location = "/";
        }

      }, function() {
        console.log("admin error");
          //$rootScope.error = 'Failed to fetch details';
    });
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
