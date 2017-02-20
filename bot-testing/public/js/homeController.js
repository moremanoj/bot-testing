
SampleApplicationModule.controller('newhomeController',function($rootScope,$state,$scope,$location,store){
  //$scope.init();
  $scope.UserSession = store.get('UserSession') || {};

  $scope.goRegister = function(){
        // how to get the href
        $location.path('/page1');
      }
  $scope.gotoadmin = function(){
      window.location.href = adminUrl;
  }
   $scope.userinquiry = function() {
   	console.log ($scope.userinfo)

            $http.post('http://node.fountaintechies.com:7500/api/' + 'addenquiry', $scope.userinfo).success(function(res) {

                if (res.status == 'false') {

                } else {

                }
            }).error(function(error) {
                console.log("error in save other 1", error);
            });
        };

  //$scope.register $location.path('templates/businessName.html')
});
