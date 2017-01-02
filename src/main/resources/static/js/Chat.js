
var Chat = {

	/**
	 * socket 변수 선언
	 */
	//socket : {},
	stompClient : {},
	
	editor: null,
	/**
	 * value Object 
	 */
	data: {
		code : 0, 
	    nickName : 'Guest', 
	    room : 0,
	    option : '',
	    message : '',
	    codeScript : '',
	    codeConfig : {}
	},
	
	/**
	 * 초기화
	 */
	initialize : function(){
		
		Chat.connect();
		
		$(document).ready(function(){
			
			var noscripts = document.getElementsByClassName("noscript");
			for (var i = 0; i < noscripts.length; i++) {
				noscripts[i].parentNode.removeChild(noscripts[i]);
			}
			
			Chat.settingCodeMirror();
			
			$('#btnEditor').on('click', function(){
				$('#code-container').toggle();
				$(this).toggleClass('active');
				$("#chat-container").toggleClass('col-md-7');
				$("#chat-container").toggleClass('col-md-12');
			});
			
			$("#nickName").on('keydown',function( event ) {
				if (event.keyCode == 13) {
					Chat.data.nickName = $('this').val();
					Chat.sendMessage();
					event.preventDefault();
				}
			});
			
			$('#btnSend').on('click', function(){
				Chat.sendSourceCode();
			});
			
			$('#btnConfig').on('click', function(){
				$('#modalConfig').modal('show');
			});
			
			$('#btnRefresh').on('click', function(){
				$('#console').html('');
			});
			
			Chat.bindChat();
			
			//$('#modalSetNick').modal({ keyboard: false }).modal('show');
			
			$('[data-toggle="popover"]').popover()
			
		}); // documnet ready close
		
		$(window).on('unload',function(){
			//Chat.socket.close();
			Chat.stompClient.disconnect();
		});
	},
	
	/**
	 * code mirror setting 
	 */
	settingCodeMirror : function(){
		CodeMirror.modeURL = "cm/mode/%N/%N.js";
		
		// code mirror 설정
		/*Chat.editor = CodeMirror($("#codeScript")[0], {
	        lineNumbers: true,
	        matchBrackets: true // 괄호 자동 닫기? 
	    });*/
		
		Chat.editor = CodeMirror.fromTextArea($("#codeScript > textarea")[0], {
			lineNumbers: true,
			matchBrackets: true,
			mode: "htmlmixed"
		});
		
		$('#mode').change(function(){
			var mime = $(this).val();
			Chat.editor.setOption("mode", mime);
		    CodeMirror.autoLoadMode(Chat.editor, CodeMirror.findModeByMIME(mime).mode);
		}).change();
		
		$('input[name=codeFold]').change(function(){
			
			if($(this).val() == 1){
				Chat.editor.setOption('foldGutter',true);
				Chat.editor.setOption('gutters',["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
				CodeMirror.commands.foldAll(Chat.editor);
			}else{
				Chat.editor.setOption('foldGutter',false);
				Chat.editor.setOption('gutters',[]);
				CodeMirror.commands.unfoldAll(Chat.editor);
			}
		}).change();
		
		$('#btnRefreshEdit').on('click', function(){
			Chat.editor.setValue('');
		});
		
		$('#theme').change(function(){
			Chat.editor.setOption('theme',$(this).val());
		}).change();
		
		$(document).on('click', '[name=btnFold]',function(){
			
			if($(this).prop('cm').getOption('foldGutter')){
				$(this).html('Fold');
				$(this).prop('cm').setOption('foldGutter',false);
				$(this).prop('cm').setOption('gutters',[]);
				CodeMirror.commands.unfoldAll($(this).prop('cm'));
			}else{
				$(this).html('Unfold');
				$(this).prop('cm').setOption('foldGutter',true);
				$(this).prop('cm').setOption('gutters',["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
				CodeMirror.commands.foldAll($(this).prop('cm'));
			}
		});
		
		$(document).on('click', '[name=btnUnfold]',function(){
			
		});
		
		Chat.editor.setSize('100%','500px');
		
		// autocomplete key bind
		var mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault;
		CodeMirror.keyMap.default[(mac ? "Cmd" : "Ctrl") + "-Space"] = "autocomplete";
	},

	/**
	 * 소스코드 보내기 
	 */
	sendSourceCode : function(){
		// Chat.data.code을 1로 바꾸고, 
		// message, codeScript 를 send 함.
		// 그리고 메세지를 받을때 1인경우 출력을  
		// Console.code 로 함.
		
		var dataVO = {
			code : 1, 
		    nickName : $('#nickName').val(), 
		    room : 0,
		    option : $('#option').val(),
		    message : "<button type='button' name='btnFold' class='btn btn-primary btn-xs' >Fold</button>",
		    codeScript : Chat.editor.getValue(),
		    codeConfig : {
				mode : $('#mode').val(),
				theme : $('#theme').val(),
				readOnly : 'nocursor',
				lineNumbers : true
		    }
		};
		
		Chat.sendMessage(dataVO);
	},
	
	
	/**
	 * 웹소켓 연결
	 * @param host
	 */
	connect : function(){
		
		var socket = new SockJS('/gs-guide-websocket');
	    Chat.stompClient = Stomp.over(socket);
	    
	    Chat.stompClient.debug = null;
	    Chat.stompClient.connect({}, function (frame) {
	        
	        //console.log('Connected: ' + frame);
	        
	        Chat.stompClient.subscribe('/topic/greetings', function (message) {
	            //console.log(message);
	            
	            var jsonData = JSON.parse(message.body);
				
				if(jsonData.code == 3){
					if(!$(".img_type").is(':visible')){
						$('.img_type').show(1).delay(1000).hide(2);
					}
					return
				}
				//console.log(jsonData);
				
				Console.log(jsonData);
				
				if(jsonData.code == 2){
					// 다른 browser로 접근해서 소켓 닫음.
					//Chat.socket.close();
					Chat.stompClient.disconnect();
				}else if(jsonData.code == 1){
					// 코드를 출력함. 
					Console.codeChat(jsonData);
				}else if(jsonData.code == 0){
					// 기본
					return;
				}
	        });
	        
	    });
	    
	},
	
	/**
	 * 웹소켓 메세지 보내기
	 */
	sendMessage : function(dataVO) {
		if(dataVO){
			Chat.stompClient.send("/app/k", {}, JSON.stringify(dataVO));

			Chat.checkType(dataVO.code);
		}else{
			Chat.data.nickName = $('#nickName').val(); 
			Chat.data.message = $('#chat').val();
			
			Chat.stompClient.send("/app/k", {}, JSON.stringify(Chat.data));
			
			Chat.checkType(Chat.data.code);
		}
	},
	
	/**
	 * 키보드 채팅 치는 거 체크, code 가 3이면 typing 중이라는 메세지임. 
	 */
	checkType : function(code) {
		if(code != 3 && code != 1){
			$('#chat').val('');
		}
	},
	
	/**
	 * chat 입력창 enter key bind
	 */
	bindChat : function(){
		$("#chat").on('keydown',function( event ) {
			if ( event.which == 13 ) {
				Chat.sendMessage();
				event.preventDefault();
			}else{
				var dataVO = {
					code : 3, 
				    nickName : '', 
				    room : 0,
				    option : '',
				    message : '',
				    codeScript : '',
				    codeConfig : {}
				};
				Chat.sendMessage(dataVO);
			}
		});
	}
};