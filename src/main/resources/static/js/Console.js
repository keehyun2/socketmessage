/**
 * 
 */

var Console = {
	
	/**
	 * discuss the topics 
	 */
	talk : function(jsonData) {
		$('#console').append($('<p>').html('&nbsp;' + jsonData.nickName + ' : ' + jsonData.message));
		
		/*while (console.childNodes.length > 25) {
			console.removeChild(console.firstChild);
		}*/
		
		$('#console').scrollTop($('#console')[0].scrollHeight);
	},
	
	/**
	 * print source 
	 */
	printSource : function(jsonData) {
		//console.log(jsonData);
		
		// wrap in pre tag , inject program language type to attribute class and set code coloring   
		var btn = $("<button type='button' name='btnFold' class='btn btn-primary btn-xs' >Fold</button>");
		var pre = $('<pre>');
		var codeElement = $("<code>");
		
		//pre.prev().find('[name=btnFold]').prop('cm',cm);
		$('#console').append($('<p>').html('&nbsp;' + jsonData.nickName + ' : ').append(btn));
		$('#console').append(pre.append(codeElement));
		
		jsonData.codeConfig.value = jsonData.codeScript;
		var cm = CodeMirror(codeElement[0], jsonData.codeConfig);
		btn.prop('cm',cm);
		
		window.setTimeout(function(){
			$('#console').scrollTop($('#console')[0].scrollHeight);
		}, 200);
		
	}
	
};