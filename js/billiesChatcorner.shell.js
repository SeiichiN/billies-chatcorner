/*
 * billiesChatcorner.shell.js
 * billiesChatcorner のシェルモジュール
 */

/*jslint          browser : true, continue : true,
  devel   : true, indent  : 2,    maxerr   : 50,
  newcap  : true, nomen   : true, plusplus : true,
  regexp  : true, sloppy  : true, vars     : true,
  white   : true
  */
/*global $, billiesChatcorner */

billiesChatcorner.shell = (function () {
	var
	configMap = {
	  main_html : String()
      + '<div class="billiesChatcorner-shell-chat"></div>',
      chat_extend_time : 1000,
      chat_retract_time : 300,
      chat_extend_height : 300,
      chat_retract_height : 20
	},
		stateMap = { $container : null },
		jqueryMap = {},

		setJqueryMap, initModule;

	setJqueryMap = function () {
		var $container = stateMap.$container;
	  jqueryMap = {
        $container : $container,
        $chat : $container.find('.billiesChatcorner-shell-chat')
      };
	};

  toggleChat = function ( do_extend, callback ) {
    var px_chat_ht = jqueryMap.$chat.height(),
        is_open = px_chat_ht === configMap.chat_extend_height,
        is_closed = px_chat_ht === configMap.chat_retract_height,
        is_sliding = ! is_open && ! is_closed;

    if ( is_sliding ) { return false; }

    // チャットスライダーの拡大開始
    if ( do_extend ) {
      jqueryMap.$chat.animate (
        { height : configMap.chat_extend_height },
        configMap.chat_extend_time,
        function () {
          if ( callback ) { callback( jqueryMap.$chat ); }
        }
      );
      return true;
    }

    // チャットスライダーの格納開始
    jqueryMap.$chat.animate(
      { height : configMap.chat_retract_height },
      configMap.chat_retract_time,
      function () {
        if ( callback ) { callback( jqueryMap.$chat ); }
      }
    );
    return true;
  };

	initModule = function ( $container ) {
		stateMap.$container = $container;
		$container.html( configMap.main_html );
		setJqueryMap();
	};

  setTimeout( function () { toggleChat( true );}, 3000);
  setTimeout( function () { toggleChat( false );}, 3000);

	return { initModule : initModule };
}());
