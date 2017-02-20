'use strict';
var SampleApplicationModule = angular.module('80Shops', ['ui.router','directive.g+signin','angular-storage','ngSanitize','ngMessages','MassAutoComplete']);

SampleApplicationModule.config(['$urlRouterProvider', '$stateProvider','storeProvider',
    function($urlRouterProvider, $stateProvider,storeProvider) {

      $urlRouterProvider.otherwise('/home');
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'templates/newhome.html',
          controller : 'newhomeController'
        })
        .state('buisnesSite',{
          url :'/buisnesssite',
          templateUrl:'templates/buisnessSite.html'
        })
        .state('businessName',{
          url :'/page1',
          templateUrl:'templates/businessName.html',
          controller: 'registerController'
        })
        .state('businessType',{
          url :'/page2',
          templateUrl:'templates/businessType.html',
          controller: 'registerController'
        })
        .state('businessCategory',{
          url :'/page3',
          templateUrl:'templates/businessCategory.html',
          controller: 'registerController'
        })
        .state('contactus',{
          url :'/contactus',
          templateUrl:'templates/contactus.html',
          controller: 'newhomeController'
        })
        .state('login',{
          url :'/login',
          templateUrl:'templates/login.html',
          controller: 'registerController'
        });
        //admin_login
  }
]);
