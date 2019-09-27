// chat-corner.js
// by Seiichi Nukayama
// 2019.09.26
//

$(function() {
	var mode;
	
	mode = 'closed';
	$('#chat-corner').addClass('chat-corner-close');

	$('body').append('<div id="chat-corner">わはは</div>');
	$('#chat-corner').on('click', function () {
		if (mode === 'closed') {
			$('#chat-corner').removeClass('chat-corner-close');
			$('#chat-corner').addClass('chat-corner-open');
			mode = 'opened';
		} else if (mode === 'opened') {
			$('#chat-corner').removeClass('chat-corner-open');
			$('#chat-corner').addClass('chat-corner-close');
			mode = 'closed';
		}
	});
});

