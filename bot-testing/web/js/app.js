'use strict';
//var transporter = transporter();
var SampleApplicationModule = angular.module('mybot',[]);

SampleApplicationModule.controller('botCtrl',function($scope,$http,$sce,$timeout){
  $scope.session_lst =[];
  $scope.resp="";
  $scope.resp += ' <p> bot: Hello I am Jack,Your personal flight assistant..!!</p>';
  $("#bot").empty();
  $($scope.resp).appendTo('#bot');
	var accessToken = "d3bf36baa23f41d29d41e6e0619641ae";
	var baseUrl = "https://api.api.ai/v1/";

	$(document).ready(function() {
			$("#input").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();
					$scope.send();
				}
			});
			$("#rec").click(function(event) {
				switchRecognition();
			});
	});

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
			send();
	}

	function updateRec() {
			$("#rec").text(recognition ? "Stop" : "Speak");
	}

	$scope.send = function() {
			var text = $("#input").val();
      $scope.session_lst.push({user : text});
      $scope.resp += ' <p > user: '+ text +'</p>';
      $("#bot").empty();
      $($scope.resp).appendTo('#bot');
      document.getElementById("input").value = "";
      //console.log('check data');

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
          //console.log(data.status.code);
          if(data.status.code == 200)
          {
            var obj = data.result.parameters;
            if(obj.Email){
              if(obj.R_date!=null){
                obj.send_mail = 2;
                if(obj.R_plane_type==null){
                  obj.R_plane_type = obj.S_plane_type;
                }
              }
              console.log(obj);
              $http.post(baseURL  + 'sendmail',obj).success(function(res){
                  console.log('res:',res);
              });
            }

            var str = JSON.stringify(data.result.fulfillment.speech,undefined,2);
            str = str.replace( /"/g, "" );
            $scope.resp += '<p style="align:left"> bot: '+ str +'</p></br>';
            $("#bot").empty();
            $($scope.resp).appendTo('#bot');
            $scope.session_lst.push({bot : str});

            //console.log(obj);
          }
					//setResponse(JSON.stringify(data, undefined, 2));
				},
				error: function() {
					console.log("Internal Server Error");
				}
			});
			//setResponse("Loading...");
	}




  /*$scope.send =function() {

    var text = $("#input").val();
    $scope.session_lst.push({user : text});
    $scope.resp += ' <p > user: '+ text +'</p>';
    $("#bot").empty();
    $($scope.resp).appendTo('#bot');
    console.log('check data');


    //$scope.$watch('$scope.session_lst', function (newValue, oldValue, scope) {
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
          /*if(data.result.parameters["send_mail"] != undefined && data.result.parameters['Email'] != null) {
            var obj = data.result.parameters;
            console.log(obj)
            if(obj.Email){
              console.log("email:",obj.Email);
              $http.post(baseURL  + 'sendmail',obj).success(function(res){
                  console.log('res:',res);
              });
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
        console.log("Internal Server Error");
      }
    });
    //});
    //setResponse("Loading...");
  }*/


  /*$http.get(baseURL  + 'gethi').success(function(res){
      console.log('res:',res);

  });*/

//$scope.getnow();
});
