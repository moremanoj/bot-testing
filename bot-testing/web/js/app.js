'use strict';
//var transporter = transporter();
var SampleApplicationModule = angular.module('mybot',[]);

SampleApplicationModule.controller('botCtrl',function($scope,$http,$sce,$timeout){
  $scope.session_lst =[];
  $scope.resp="";
  $scope.resp += ' <div class="chat-message padding"><div class="chat-message chat-message-recipient"><img class="chat-image chat-image-default" src="http://www.michaelmammoliti.com/_projects/chat/_media/img/user1.jpg" /><div class="chat-message-wrapper"><div class="chat-message-content"><p>Hello I am Jack,Your personal flight assistant..!!</p></div></div></div></div>';
  $("#bot").empty();
  $($scope.resp).appendTo('#bot');
	var accessToken = "d3bf36baa23f41d29d41e6e0619641ae";
	var baseUrl = "https://api.api.ai/v1/";

	/*$(document).ready(function() {
			$("#chatinput").keypress(function(event) {
				if (event.which == 13) {
         insertMessage();
				}
			});
	});*/

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

  var Fake = [
    'Hello I am Jack,Your personal flight assistant..!!',
    ':)'
  ]

  var $messages = $('.messages-content'),
      d, h, m,
      i = 0;
  $messages.mCustomScrollbar();
  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
  }, 100);



	/*$scope.send = function() {
			var text = $("#input").val();
      $scope.session_lst.push({user : text});
      $scope.resp += '<div class="chat-message padding"><div class="chat-message chat-message-sender"><img class="chat-image chat-image-default" src="http://www.michaelmammoliti.com/_projects/chat/_media/img/user1.jpg" /><div class="chat-message-wrapper"><div class="chat-message-content"> <p > '+ text +'</p></div></div></div></div>';
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
            $scope.resp += '<div class="chat-message padding"><div class="chat-message chat-message-recipient"><img class="chat-image chat-image-default" src="http://www.michaelmammoliti.com/_projects/chat/_media/img/user1.jpg" /><div class="chat-message-wrapper"><div class="chat-message-content"><p>'+ str +'</p></div></div></div></div></br>';
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
	}*/



  function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
  }

  function setDate(){
    d = new Date()
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
  }

  $('.message-submit').click(function() {
    insertMessage();
  });

  $("#chatinput").keypress(function(event) {
    if (event.which == 13) {
      insertMessage();
    }
  });

  function insertMessage() {
    var msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();
    setTimeout(function() {
      fakeMessage(msg);
    }, 1000 + (Math.random() * 20) * 100);
  }


  function fakeMessage(msg) {
    $('<div class="message loading new"><figure class="avatar"><img src="img/profile.png" />"</figure><span></span></div>').appendTo($('.mCSB_container'));
    updateScrollbar();



    $.ajax({
      type: "POST",
      url: baseUrl + "query?v=20150910",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: {
        "Authorization": "Bearer " + accessToken
      },
      data: JSON.stringify({ query: msg, lang: "en", sessionId: "somerandomthing" }),

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
          Fake.push(str);

          setTimeout(function() {
            $('.message.loading').remove();
            $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + str + '</div>').appendTo($('.mCSB_container')).addClass('new');
            setDate();
            updateScrollbar();
          }, 1000 + (Math.random() * 20) * 100);


          //console.log(obj);
        }
        //setResponse(JSON.stringify(data, undefined, 2));
      },
      error: function() {
        console.log("Internal Server Error");
      }
    });

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
