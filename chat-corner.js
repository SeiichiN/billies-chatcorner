// chat-corner.js
// by Seiichi Nukayama
// 2019.09.26
//

$(function() {
	$('body').append('<div id="chat-corner">わはは</div>');
	$('#chat-corner').on('click', function () {
		$('#chat-corner').addClass('chat-corner-open');
	});
});

