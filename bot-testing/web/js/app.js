'use strict';
//var transporter = transporter();
var SampleApplicationModule = angular.module('mybot',[]);

SampleApplicationModule.controller('botCtrl',function($scope,$http,$sce,$timeout){
  $scope.session_lst =[];
  $scope.resp="";
  var accessToken = "b6328ec8aaca46e98d4352e17a509f7e";
  var baseUrl = "https://api.api.ai/v1/";
  //var baseURL= "http://localhost:2001/api/";
  //var session_lst= [];

  $scope.addMessage = function(event) {
    //$scope.info.push(msg);
    if (event.which == 13) {
      event.preventDefault();
      $scope.send();

      event.currentTarget.value = "";
    }
  }

  var recognition;
  function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function(event) {
      updateRec();
    };
    recognition.onresult = function(event) {
      var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setInput(text);
      stopRecognition();
    };
    recognition.onend = function() {
      stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
  }

  function stopRecognition() {
    if (recognition) {
      recognition.stop();
      recognition = null;
    }
    updateRec();
  }

  function switchRecognition() {
    if (recognition) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }

  function setInput(text) {
    $("#input").val(text);
    $scope.send();
  }
  //$scope.session_lst = {};
  function updateRec() {
    $("#rec").text(recognition ? "Stop" : "Speak");
  }

  $timeout(function () {
    function setResponse(val, text) {
      //console.log(val);
      var str = val;
      str = str.replace( /"/g, "" );
      $scope.session_lst.push({user : text});
      $scope.session_lst.push({bot : str});
      //$("#response").text(str);
      console.log($scope.session_lst);
      //$scope.session_lst1 = JSON.stringify($scope.session_lst);
    }
  }, 1000);

   $scope.send =function() {
    var text = $("#input").val();
    $scope.session_lst.push({user : text});
    $scope.resp += ' <p > user: '+ text +'</p>';
    $("#bot").empty();
    $($scope.resp).appendTo('#bot');
    //console.log(session_lst);
    $scope.$watch('$scope.session_lst', function (newValue, oldValue, scope) {
    //Do anything with $scope.letters
    $scope.email_id="";
    $.ajax({
      type: "POST",
      url: baseUrl + "query?v=20150910",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + accessToken
      },
      data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
      success: function(data) {
        console.log(data.status.code);
        if(data.status.code == 200)
        {
          if(data.result.parameters["send_mail"] != undefined && data.result.parameters['Email'] != null) {
            var obj = data.result.parameters;
            console.log(obj)
            if(obj.Email){
              console.log("email:",obj.Email);
              $http.post(baseURL + 'sendmail' ,obj).success(function(res) {
                  console.log(res);
                  //$scope.outdated=res;
                  //console.log($scope.outdated);
              })
            }
            
            $scope.email_id= data.result.parameters.Email;
          }
          var str = JSON.stringify(data.result.fulfillment.speech,undefined,2);
          str = str.replace( /"/g, "" );

          $scope.resp += '<p style="align:left"> bot: '+ str +'</p></br>';
          $("#bot").empty();
          $($scope.resp).appendTo('#bot');
          //$("#bot").scrollTop($("#bot").prop('scrollHeight'));

          $scope.session_lst.push({bot : str});
        }
      },
      error: function() {
        setResponse("Internal Server Error");
      }
    });
    });
    //setResponse("Loading...");
  }


  $http.get(baseURL  + 'gethi').success(function(res){
      console.log('res:',res);

  });

//$scope.getnow();
});
