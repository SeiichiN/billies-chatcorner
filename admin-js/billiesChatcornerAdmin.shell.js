/*
 * billiesChatcornerAdmin.shell.js
 * billiesChatcornerAdmin のシェルモジュール
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, jQuery, billiesChatcornerAdmin */

jQuery( function ($) {
  billiesChatcornerAdmin.shell = (function () {
    //--[ プロパティ：設定値 ]---------------------------------------------
    var configMap = {
	  main_html : String()
                + '<div class="billiesChatcornerAdmin-shell-head">'
                  + '<div class="billiesChatcornerAdmin-shell-head-logo"></div>'
                  + '<div class="billiesChatcornerAdmin-shell-head-acct"></div>'
                  + '<div class="billiesChatcornerAdmin-shell-head-search"></div>'
                + '</div>'
                + '<div class="billiesChatcornerAdmin-shell-main">'
                  + '<div class="billiesChatcornerAdmin-shell-main-nav"></div>'
                  + '<div class="billiesChatcornerAdmin-shell-main-content">'
                    + '<div class="billiesChatcornerAdmin-shell-main-content-chat"></div>'
                  + '</div>'
                + '</div>'
                + '<div class="billiesChatcornerAdmin-shell-foot"></div>'
                + '<div class="billiesChatcornerAdmin-shell-modal"></div>'
    },
	    stateMap = { 
		  $container : undefined,
	    },
	    jqueryMap = {},

	    copyAnchorMap, changeAnchorPart, onHashChange, onClickChat,
	    setJqueryMap, initModule, setChatAnchor, onResize
    ;


    
    //--[ setJqueryMap ]--------------------------------------------
    //
    setJqueryMap = function () {
	  var $container = stateMap.$container;
	  jqueryMap = {
        $container : $container,
        $chat : $container.find('.billiesChatcornerAdmin-shell-main-content-chat')
      };
    };

    //--[ onClickChat ]--------------------------------------------
    // マウスクリックを捕捉
    //
    onClickChat = function (event) {
      changeAnchorPart({
	    chat : ( stateMap.is_chat_retracted ? 'open' : 'closed' )
      });
      /*
         if (toggleChat( stateMap.is_chat_retracted )) {
	     $.uriAnchor.setAnchor({
  	     chat : ( stateMap.is_chat_retracted ? 'open' : 'closed' )
	     });
	     }
       */
	  return false;
    };

    //--[ initModule ]--------------------------------------------
    // 用例：billiesChatcorner.shell.initModule( $('#app_div_id') );
    // 目的：ユーザに機能を提供するようにチャットに指示する
    // 引数：
    //   * $append_target (例：$('#app_div_id'))
    //     一つのDOMコンテナを表すjQueryコレクション
    // 動作：
    //   $containerにUIのシェルを含め、機能モジュールを構成して初期化する
    //   シェルはURIアンカーやCookieの管理などのブラウザ全体に及ぶ問題を
    //   担当する
    // 戻り値：なし
    // 例外発行：なし
    //
    initModule = function ( $container ) {
	  stateMap.$container = $container;
	  $container.html( configMap.main_html );
      setJqueryMap();


	  // 機能モジュールを設定して初期化する
	  billiesChatcornerAdmin.chat.configModule({
		chat_model : billiesChatcornerAdmin.model.chat,
		people_model : billiesChatcornerAdmin.model.people
	  });
	  billiesChatcornerAdmin.chat.initModule( jqueryMap.$chat );

      
/*
      $(window)
        .bind( 'hashchange', onHashChange )
        .trigger( 'hashchange' );
*/
    };

    //--[ オープンするメソッド ]----------------------------------
    //
    return { initModule : initModule };
  }());
});
