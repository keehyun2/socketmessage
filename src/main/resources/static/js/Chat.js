
var Chat = {

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
			
			Chat.settingCodeMirror();
			
			$('#btnEditor').on('click', function(){
				$('#code-container').toggle();
				$(this).toggleClass('active');
				$("#chat-container").toggleClass('col-md-6');
				$("#chat-container").toggleClass('col-md-10');
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
			
			/*$('#user-list li').on('click', function(){
				
				Chat.stompClient.send("/app/chat.private." + $(this).attr('id'), {}, JSON.stringify(data));
			});*/
			
			Chat.bindChat();
			
			$('[data-toggle="popover"]').popover();
			
			
			// event for id change   
			$('#btnSetNick').on('click', function(){
				
				if($('#nick').val() != ''){
					localStorage.setItem('SavedID', $('#nick').val());
					var data = {
					    nickName : localStorage.getItem('SavedID'), 
					    message : ''
					};
					Chat.stompClient.send("/app/nickname", {}, JSON.stringify(data));
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
			
			Chat.connect();
			
		}); // document ready close
		
		$(window).on('unload',function(){
			Chat.stompClient.disconnect();
		});
	},
	
	/**
	 * code mirror setting 
	 */
	settingCodeMirror : function(){
		CodeMirror.modeURL = "cm/mode/%N/%N.js";
		
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
		
		Chat.editor.setSize('100%','500px');
		
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
		    codeScript : Chat.editor.getValue(),
		    codeConfig : {
				mode : Chat.editor.getOption('mode'),
				theme : Chat.editor.getOption('theme'),
				readOnly : 'nocursor',
				lineNumbers : Chat.editor.getOption('lineNumbers')
		    }
		};
		
		Chat.stompClient.send("/app/source", {}, JSON.stringify(jsonData));
	},
	
	
	/**
	 * connect SockJS and Stomp
	 */
	connect : function(){
		
		var socket = new SockJS('/ws');
	    Chat.stompClient = Stomp.over(socket);
	    
	    Chat.stompClient.debug = null;
	    
	    var SavedID = localStorage.getItem('SavedID');
	    
	    Chat.stompClient.connect({}, function (frame) {
	        
	    	// '/topic/chat' stomp receive event 
	        Chat.stompClient.subscribe('/topic/chat', function (message) {
	            var jsonData = JSON.parse(message.body);
				Console.talk(jsonData);
	        });
	        
	        Chat.stompClient.subscribe('/queue/typing', function (message) {
	        	$('#'+message.body).addClass('typing').delay(1000).queue(function(next){
	        		$(this).removeClass('typing');
	        		next();
	        	});
	        	
	        });
	        
	        Chat.stompClient.subscribe('/queue/source', function (message) {
	        	var parsed = JSON.parse(message.body);
	        	Console.printSource(parsed);
	        });
	        
	        Chat.stompClient.subscribe('/queue/members', function (message) {
	        	var parsed = JSON.parse(message.body);
	        	Chat.setUserList(parsed);
	        });
	        
	        /*Chat.stompClient.subscribe("/user/exchange/amq.direct/chat.message", function(message) {
				var parsed = JSON.parse(message.body);
				console.log(parsed);
	        });*/
	        
	        Chat.stompClient.send("/app/members", {}, {});
	        
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
		
		Chat.stompClient.send("/app/chat", {}, JSON.stringify(data));
		
		$('#chat').val('');
	},
	
	/**
	 * send typing signal to websocket
	 */
	sendTyping : function(dataVO) {
		Chat.stompClient.send("/app/typing", {}, JSON.stringify({sessionID : ''}));
	},
	
	/**
	 * bind chat input form with enter key  
	 */
	bindChat : function(){
		
		$("#chat").on('keydown',function( event ) {
			if ( event.which == 13 ) {
				Chat.sendMessage();
				event.preventDefault();
			}else{
				Chat.sendTyping();
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