// genent.test.js
  // gevent test
jQuery(function ($) {
  $('body').append('<div id="billiesChatcorner-chat-list-box">');

  var $listbox = $('#billiesChatcorner-chat-list-box');
  $listbox.css({
    position: 'absolute',
    'z-index': 1113,
    top: 50,
    left: 50,
    height: 50,
    width: 50,
    border: 'solid 2px black',
    background: '#fff'
  });

  var onListChange = function ( event, update_map ) {
    $( this ).html( update_map.list_text );
    alert( 'onListChange ran' );
  };

  $.gevent.subscribe(
    $listbox,
    'billiesChatcorner-listchange',
    onListChange
  );

  $.gevent.publish(
    'billiesChatcorner-listchange',
    [{ list_text : 'the list is here' }]
  );

  $listbox.remove();
  $.gevent.publish(
    'billiesChatcorner-listchange',
    [ {} ]
  );
});
