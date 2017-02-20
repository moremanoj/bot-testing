SampleApplicationModule.controller('registerController',function( $rootScope, $state, $scope, $location, $http, store,$q,$timeout,$sce){
  $scope.dirty = {};

  $scope.init = function(){
    $scope.UserSession = store.get('UserSession') || {};
    //console.log($scope.UserSession);
  }

  $scope.redirectadmin=function(){
     window.location.href = adminUrl;
  }

  $http.get(baseURL + 'getCategory').success(function(res) {
      //console.log(res);
      $scope.CategoryList = _.pluck(res,'CategoryName');
      //console.log($scope.CategoryList);
  });

  function suggest_cat(term) {
     var q = term.toLowerCase().trim();
     var results = [];

     // Find first 10 states that start with `term`.
     for (var i = 0; i < $scope.CategoryList.length && results.length < 10; i++) {
       var cat = $scope.CategoryList[i];
       if (cat.toLowerCase().indexOf(q) === 0)
         results.push({ label: cat, value: cat });
     }

     return results;
   }

   $scope.autocomplete_options = {
        //console.log('trying this scope');
        suggest: suggest_cat
     };

  $scope.business_details={
                    business_name : '',
                    MembershipType : '',
                    business_category : '',
                    MobileNo:'',
                    Email:'',
                    Password:''
                  };

  $scope.page1 = true;
  $scope.page2 = false;
  $scope.page3 = false;


  $scope.goPage1= function(){
        //console.log($scope.business_details);
        $scope.page1 = false;
        $scope.page2 = true;
        $scope.page3 = false;
      }
  $scope.goPage2 = function(){
        //console.log($scope.business_details);
        $scope.page1 = false;
        $scope.page2 = false;
        $scope.page3 = true;
      }

  $scope.admin_login = function(){
    $location.path('/admin_login');
  }
  $scope.staticLogin = function(){
          //console.log($scope.userinfo);
          $http.post(baseURL + 'staticLogin',$scope.userinfo).success(function(res) {
              //console.log(res);
              if(res.status==true){
                var UserSession = {
                       'BusinessId': res.data[0].BusinessId,
                       'BusiessName': res.data[0].BusiessName,
                       'Email': res.data[0].Email,
                       'Category': res.data[0].Category,
                       'MembershipType': res.data[0].MembershipType
                   };
                  store.set('UserSession', UserSession);
                  $scope.init();
                  if(res.data[0].Role== 'Admin'){
                        window.location.href = adminUrl;
                  }
                  else{
                      $state.go('home');
                  }
              }else{
                $scope.loginerrmsg = 'Please enter valid email or password.';
               $scope.showloginerrmsg = true;
               $timeout(function() {
                   $scope.showloginerrmsg = false;
               }, 5000);
              }
            }).error(function(error){
              console.log('unable to login');
            });
      }
      $scope.logout = function () {
              //console.log('adadwad');
              store.remove('UserSession');
              //store.remove('businessSession');
              $scope.init();

            }
  $scope.userinfo={
        email:'',
        password:''
      };
  $scope.doRegister = function(){
        //console.log($scope.business_details);
        $scope.business_details.MType =  $scope.business_details.MembershipType.Type;
        $scope.business_details.business_category =$scope.dirty.value;
        console.log($scope.business_details);
        $http.post(baseURL + 'register_business',$scope.business_details).success(function(res) {
            //console.log(res);

            if(res.status==0){
              console.log('something went wrong');
           }else{
             $location.path('/login');
           }
          }).error(function(error){
            console.log('unable to login');
          });

        //$location.path('/login');
      }
  $scope.gosite = function(){
        $location.path('/business_site');
      }

/*  $scope.$on('event:google-plus-signin-success', function(event, authResult) {
        //console.log(authResult);
        gapi.client.load('plus', 'v1', function(){
          gapi.client.plus.people.get({ userId: 'me' }).execute(function (res) {
            //console.log(res);
            if(res.name.givenName){
              var user_details = {
                'FirstName':res.name.givenName,
                'LastName':res.name.familyName,
                'GoogleUserRef':res.id,
                'Email':res.emails[0].value
              }
            //console.log(user_details);
              $http.post(baseURL + 'doGoogleLogin',user_details).success(function(res) {
                  //console.log(res);
                  if(res.status==0){
                    alert('something went wrong');
                 }else{
                   login_direct(user_details);
                 }
                }).error(function(error){
                  console.log('unable to login');
                });
            }
          });
        });
      });

      function login_direct(user_details){
        //console.log(user_details);

        $http.post(baseURL + 'googleSignin',user_details).success(function(res) {
            //console.log(res);
            if(res.status==true){
              var UserSession = {
                     'UserId': res.data[0].UserId,
                     'FirstName': res.data[0].FirstName,
                     'LastName': res.data[0].LastName,
                     'Email': res.data[0].Email,
                     'GoogleUserRef': res.data[0].GoogleUserRef,
                     'loginTpye': 'Google'
                 };
                store.set('UserSession', UserSession);
                $scope.init();
                $state.go('home');
            }

          }).error(function(error){
            console.log('unable to login');
          });
      }
*/
  $scope.getMemberShipType = function(){
    $http.get(baseURL + 'getMemberShipType').success(function(res) {
        //console.log(res);
        $scope.MemberType=res;
      });
  }
  $scope.getMemberShipType();


});
