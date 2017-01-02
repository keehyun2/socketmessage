/**
 * 
 */

var Console = {
	
	/**
	 * 채팅 출력
	 */
	log : function(jsonData) {
		$('#console').append($('<p>').css('wordWrap','break-word').html(jsonData.nickName + ' : ' + jsonData.message));
		
		/*while (console.childNodes.length > 25) {
			console.removeChild(console.firstChild);
		}*/
		
		$('#console').scrollTop($('#console')[0].scrollHeight);
	},
	
	/**
	 * 코드 출력
	 */
	codeChat : function(jsonData) {
		//console.log(jsonData);
		// pre 로 감싸고 class 에 언어 타입 넣어주고, 코드 하이라이트 
		
		var pre = $('<pre>');
		var codeElement = $("<code>");
		$('#console').append(pre.append(codeElement));
		jsonData.codeConfig.value = jsonData.codeScript;
		var cm = CodeMirror(codeElement[0], jsonData.codeConfig);
		pre.prev().find('[name=btnFold]').prop('cm',cm);
		pre.prev().find('[name=btnUnfold]').prop('cm',cm);
		
		window.setTimeout(function(){
			$('#console').scrollTop($('#console')[0].scrollHeight);
		}, 200);
		
	}
	
};