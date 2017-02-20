SampleApplicationModule.controller('productController',function( $state, $scope, $location, $http,store,Upload){

  $scope.UserSession = store.get('UserSession');

  //console.log($scope.UserSession);
  $scope.product_detail={
    'BusinessId' : $scope.UserSession.BusinessId,
    'name':'',
    'qty':'',
    'desc':'',
    'price':''
      };
  $scope.imageURL = imageURL;
  $scope.myproduct_div=true;

  $scope.fileArr=[];
  $scope.newfiles=[];
  $scope.productdata={};

  $scope.single_product={};


  $scope.getproducts = function(){
    var id= $scope.UserSession.BusinessId;
    //console.log(id);
    $http.get(baseURL + 'getproducts/'+ id).success(function(res) {
        //console.log(res);
        $scope.productdata=res;
        console.log($scope.productdata);
      });
      //console.log($scope.productdata);
      //$scope.userdata = new Date($scope.data.mydatefield);
  }
  $scope.getproducts();

  $scope.productupdate = function(){
    console.log($scope.single_product);
    console.log($scope.fileArr);
    if($scope.fileArr.length!=0){
        attachImages($scope.fileArr, function(body) {
          $scope.single_product['product_images']=body;
          console.log($scope.single_product);
          $http.post(baseURL + 'updateproduct', $scope.single_product )
          .success(function(res, req){
            console.log('success');
            console.log(res);
            //callback(res);
          }).error(function(err){
            console.log('error');
            console.log(err);
            //callback(false);
          });
        });
    }

  }

  $scope.uploadFiles = function(file,errFiles){

    if(_.isArray(file)==true){
      for(var i =0;i<$scope.file.length;i++){
        $scope.fileArr.push($scope.file[i]);
      }
      //$scope.fielArr = $scope.file;
      console.log($scope.fileArr);
    }else{
      $scope.fileArr.push(file);
    }
      $scope.errFile = errFiles;

  }

  $scope.product_disable= function(obj){
    console.log(obj);
    $http.post(baseURL + 'product_disable', obj )
    .success(function(res, req){
      console.log('success');
      console.log(res);
      //callback(res);
    }).error(function(err){
      console.log('error');
      console.log(err);
      //callback(false);
    });
  }

  $scope.edit_product =function (obj) {
    //console.log(obj);
    $scope.single_product = obj;
    console.log($scope.single_product);
  }

  console.log($scope.single_product);

  $scope.producthandle=function(){
    //var loads= document.getElementsById('productform');
    console.log($scope.product_detail);

    attachImages($scope.fileArr, function(body) {

      $scope.product_detail['product_images']=body;
      $scope.product_detail['status']='Active';
      //console.log($scope.product_detail);

      //console.log($scope.product_detail);
      $http.post(baseURL + 'addproduct', $scope.product_detail )
      . success(function(res, req){
        console.log('success');
        console.log(res);
        //callback(res);
      }).error(function(err){
        console.log('error');
        console.log(err);
        //callback(false);
      });
    });
  }

  function attachImages(parameters, callback) {
    var files=[];
    async.each( parameters, function(item, callback) {

    convertImgToBase64(item, function(response) {
      var file = {
        'file': response,
        'type': 'image',
      };
      $scope.newfiles.push(file);
      //console.log('files', $scope.newfiles);
      callback();
    });
  },function done(error){
    console.log($scope.newfiles.length);
    console.log($scope.newfiles);
    parameters = $scope.newfiles;
    callback(parameters);
  });
}

    //  convert image to  base64

    function convertImgToBase64(blob, callback){
      var reader = new window.FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        callback(reader.result);
      };
    }

});
