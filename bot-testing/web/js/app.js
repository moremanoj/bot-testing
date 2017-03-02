'use strict';
//var transporter = transporter();
var SampleApplicationModule = angular.module('mybot',[]);

SampleApplicationModule.controller('botCtrl',function($scope,$http,$sce,$timeout){
  $scope.session_lst =[];
  $scope.resp="";
  $scope.resp += ' <div class="chat-message padding"><div class="chat-message chat-message-recipient"><img class="chat-image chat-image-default" src="http://www.michaelmammoliti.com/_projects/chat/_media/img/user1.jpg" /><div class="chat-message-wrapper"><div class="chat-message-content"><p>Hello I am Lucy,Your personal flight assistant..!!</p></div></div></div></div>';
  $("#bot").empty();
  $scope.diff_button = true;
  $($scope.resp).appendTo('#bot');
	var accessToken = "d3bf36baa23f41d29d41e6e0619641ae";
	var baseUrl = "https://api.api.ai/v1/";

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
    'Hello I am Julia,Your personal flight assistant..!!',
    ':)',
    ' Where do you wanna fly today ? ',
    '<div><h4>Great, I have listed few types, choose your desired one:</h4>Enter whichever you want..!!<button >1. very light jet</button><button>2. Light jet</button><button>3. Meduim size jet</button><button>4. super meduim jet</button><button>5. heavy jet</button><button>6. turbo pro jet</button></div>'
    ]

  var $messages = $('.messages-content'),
      d, h, m,
      i = 0;
  $messages.mCustomScrollbar();
  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + Fake[0] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    fakeMessage(Fake[0]);
    //$('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + Fake[2] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
  }, 100);

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
    console.log(msg);
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    $('.message-input').val(null);
    updateScrollbar();
    setTimeout(function() {
      fakeMessage(msg);
    }, 1000 + (Math.random() * 20) * 100);
  }


  function fakeMessage(msg) {
    //$scope.diff_button = true;
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
        var x = [];
        //console.log(data.status.code);
        if(data.status.code == 200)
        {
          var obj = data.result.parameters;
          if(obj.Email){
            if(obj.R_date==null || obj.R_date==""){
              obj.send_mail = 1;
            }else{
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
          x = document.getElementsByTagName("P");
          if(x.length!=0){
              $scope.diff_button = false;
            }else{
              $scope.diff_button = true;
            }
          str = str.replace( /"/g, "" );
          Fake.push(str);

          console.log(x);
          setTimeout(function() {
            $('.message.loading').remove();
            $('<div class="message new"><figure class="avatar"><img src="img/profile.png" /></figure>' + str + '</div>').appendTo($('.mCSB_container')).addClass('new');
            setDate();
            updateScrollbar();
          }, 1000 + (Math.random() * 20) * 100);

          x=[];
          //console.log(obj);
        }
        //setResponse(JSON.stringify(data, undefined, 2));
      },
      error: function() {
        console.log("Internal Server Error");
      }
    });

  }

//$scope.getnow();


});
