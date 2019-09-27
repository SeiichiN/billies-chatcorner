// chat-corner.js
// by Seiichi Nukayama
// 2019.09.26
//

$(function() {
	var mode, htmlbox, chatcorner_closeBtn;
	
	htmlbox = '<div id="chat-corner">'
		+ '<div id="chatcorner-title"></div>'
		+ '<div id="chatcorner-body"></div>'
		+ '</div>';

	chatcorner_closeBtn = '<div id="chatcorner-closeBtn">Ｘ</div>';

	mode = 'closed';
	// $('body').append('<div id="chat-corner">わはは</div>');
	$('body').append(htmlbox);
	$('#chatcorner-title').text('チャット開始');

	$('#chat-corner').addClass('chat-corner-close');

	$('#chatcorner-title').on('click', function () {
		console.log(mode);
		if (mode === 'closed') {
			$('#chat-corner').removeClass('chat-corner-close');
			$('#chat-corner').addClass('chat-corner-open');
			$('#chatcorner-title').text('チャットコーナー');
			$('#chatcorner-title').prepend(chatcorner_closeBtn);
			mode = 'opened';
		}
	});
	$('#chatcorner-closeBtn').on('click', function () {
		console.log('mode');
		// if (mode == 'opened') {
			console.log('close');
			$('#chat-corner').removeClass('chat-corner-open');
			$('#chat-corner').addClass('chat-corner-close');
			$('#chatcorner-title').text('チャット開始');
			$('#chatcorner-closeBtn').remove();
			mode = 'closed';
		// }
	});
});

