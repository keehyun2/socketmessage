
var HotCode = {

	/**
	 * stompClient 
	 */
	stompClient : {},
	
	editor: null,
	
	/**
	 * first initialize once  
	 */
	initialize : function(){
		
		$(document).ready(function(){
			
			var noscripts = document.getElementsByClassName("noscript");
			for (var i = 0; i < noscripts.length; i++) {
				noscripts[i].parentNode.removeChild(noscripts[i]);
			}
			
			HotCode.settingCodeMirror();
			
			$('#btnEditor').on('click', function(){
				$('#code-container').toggle();
				$(this).toggleClass('active');
				$("#chat-container").toggleClass('col-md-6');
				$("#chat-container").toggleClass('col-md-10');
			});
			
			/*$("#nickName").on('keydown',function( event ) {
				if (event.keyCode == 13) {
					HotCode.sendMessage();
					event.preventDefault();
				}
			});*/
			
			$('#btnSend').on('click', function(){
				HotCode.sendSourceCode();
			});
			
			$('#btnConfig').on('click', function(){
				$('#modalConfig').modal('show');
			});
			
			$('#btnRefresh').on('click', function(){
				$('#console').html('');
			});
			
			HotCode.bindChat();
			
			$('[data-toggle="popover"]').popover();
			
			
			// event for id change   
			$('#btnSetNick').on('click', function(){
				
				if($('#nick').val() != ''){
					localStorage.setItem('SavedID', $('#nick').val());
					var data = {
					    nickName : localStorage.getItem('SavedID'), 
					    message : ''
					};
					HotCode.stompClient.send("/app/nickname", {}, JSON.stringify(data));
				}
			});
			
			// event after id change modal show   
			$('#modalSetNick').on('show.bs.modal', function (e) {
				if(localStorage.getItem('SavedID') != null){
					$('#nick').val(localStorage.getItem('SavedID'));
				}
			});
			
			$('#btnPopNick').on('click', function(){
				$('#modalSetNick').modal({ keyboard: false, backdrop: 'static' }).modal('show');
				$('#nick').focus();
			}).click();
			
			HotCode.connect();
			
		}); // document ready close
		
		$(window).on('unload',function(){
			HotCode.stompClient.disconnect();
		});
	},
	
	/**
	 * code mirror setting 
	 */
	settingCodeMirror : function(){
		CodeMirror.modeURL = "cm/mode/%N/%N.js";
		
		HotCode.editor = CodeMirror.fromTextArea($("#codeScript > textarea")[0], {
			lineNumbers: true,
			matchBrackets: true,
			mode: "htmlmixed"
		});
		
		$('#mode').change(function(){
			var mime = $(this).val();
			HotCode.editor.setOption("mode", mime);
		    CodeMirror.autoLoadMode(HotCode.editor, CodeMirror.findModeByMIME(mime).mode);
		}).change();
		
		$('input[name=codeFold]').change(function(){
			
			if($(this).val() == 1){
				HotCode.editor.setOption('foldGutter',true);
				HotCode.editor.setOption('gutters',["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
				CodeMirror.commands.foldAll(HotCode.editor);
			}else{
				HotCode.editor.setOption('foldGutter',false);
				HotCode.editor.setOption('gutters',[]);
				CodeMirror.commands.unfoldAll(HotCode.editor);
			}
		}).change();
		
		$('#btnRefreshEdit').on('click', function(){
			HotCode.editor.setValue('');
		});
		
		$('#theme').change(function(){
			HotCode.editor.setOption('theme',$(this).val());
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
		
		$(document).on('click', '#user-list > li',function(){
			HotCode.stompClient.send("/app/nickname", {}, $(this).attr(''));
		});
		
		HotCode.editor.setSize('100%','500px');
		
		// auto complete key bind 
		var mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault;
		CodeMirror.keyMap.default[(mac ? "Cmd" : "Ctrl") + "-Space"] = "autocomplete";
	},

	/**
	 * send Source Code to everyone
	 */
	sendSourceCode : function(){
		
		var jsonData = {
		    nickName : '', 
		    codeScript : HotCode.editor.getValue(),
		    codeConfig : {
				mode : HotCode.editor.getOption('mode'),
				theme : HotCode.editor.getOption('theme'),
				readOnly : 'nocursor',
				lineNumbers : HotCode.editor.getOption('lineNumbers')
		    }
		};
		
		HotCode.stompClient.send("/app/source", {}, JSON.stringify(jsonData));
	},
	
	
	/**
	 * connect SockJS and Stomp
	 */
	connect : function(){
		
		var socket = new SockJS('/hot');
	    HotCode.stompClient = Stomp.over(socket);
	    
	    HotCode.stompClient.debug = null;
	    
	    var SavedID = localStorage.getItem('SavedID');
	    
	    HotCode.stompClient.connect({}, function (frame) {
	        
	    	// '/topic/chat' stomp receive event 
	        HotCode.stompClient.subscribe('/topic/chat', function (message) {
	            var jsonData = JSON.parse(message.body);
				Console.talk(jsonData);
	        });
	        
	        HotCode.stompClient.subscribe('/queue/typing', function (message) {
	        	$('#'+message.body).addClass('typing').delay(1000).queue(function(next){
	        		$(this).removeClass('typing');
	        		next();
	        	});
	        	
	        });
	        
	        HotCode.stompClient.subscribe('/queue/source', function (message) {
	        	var parsed = JSON.parse(message.body);
	        	Console.printSource(parsed);
	        });
	        
	        HotCode.stompClient.subscribe('/queue/members', function (message) {
	        	var parsed = JSON.parse(message.body);
	        	HotCode.setUserList(parsed);
	        });
	        
	        HotCode.stompClient.subscribe("/user/exchange/amq.direct/chat.message", function(message) {
				var parsed = JSON.parse(message.body);
				console.log(parsed);
	        });
	        
	        HotCode.stompClient.send("/app/members", {}, {});
	        
	    });
	    
	},
	
	/**
	 * sendMessage
	 */
	sendMessage : function() {
		
		var data = {
		    nickName : '', 
		    message : $('#chat').val()
		};
		
		HotCode.stompClient.send("/app/chat", {}, JSON.stringify(data));
		
		$('#chat').val('');
	},
	
	/**
	 * send typing signal to websocket
	 */
	sendTyping : function(dataVO) {
		HotCode.stompClient.send("/app/typing", {}, JSON.stringify({sessionID : ''}));
	},
	
	/**
	 * bind chat input form with enter key  
	 */
	bindChat : function(){
		
		$("#chat").on('keydown',function( event ) {
			if ( event.which == 13 ) {
				HotCode.sendMessage();
				event.preventDefault();
			}else{
				HotCode.sendTyping();
			}
			
		});
		
		$("#name").on('keyup',function( event ) {
			$.each($('#user-list li'), function(idx, el){
				if($(this).text().indexOf($("#name").val()) > -1){
					$(this).css('display','block');
				}else{
					$(this).css('display','none');
				}
				
			});
			
		});
	},
	
	/**
	 * set user-list 
	 */
	setUserList : function(arrayJson){
		//console.log(arrayJson)
		
		$('#user-list').html('');
		$.each(arrayJson, function(idx, obj){
			
			var name = obj.nickName + ' (' + obj.ip + ')';
			$('#user-list').append($('<li>').html(name).attr('title',name).attr('id',obj.sessionId));
		});
		
	}
};