/*
 * billiesChatcorner.admin.shell.js
 * billiesChatcorner.admin のシェルモジュール
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, jQuery, billiesChatcorner */

jQuery( function ($) {
  billiesChatcorner.admin.shell = (function () {
    //--[ プロパティ：設定値 ]---------------------------------------------
    var configMap = {
	  main_html : String()
                + '<div class="billiesChatcorner-admin-shell-head">'
                  + '<div class="billiesChatcorner-admin-shell-head-logo"></div>'
                  + '<div class="billiesChatcorner-admin-shell-head-acct"></div>'
                  + '<div class="billiesChatcorner-admin-shell-head-search"></div>'
                + '</div>'
                + '<div class="billiesChatcorner-admin-shell-main">'
                  + '<div class="billiesChatcorner-admin-shell-main-nav"></div>'
                  + '<div class="billiesChatcorner-admin-shell-main-content">'
                    + '<div class="billiesChatcorner-admin-shell-main-content-chat"></div>'
                  + '</div>'
                + '</div>'
                + '<div class="billiesChatcorner-admin-shell-foot"></div>'
                + '<div class="billiesChatcorner-admin-shell-modal"></div>'
    },
	    stateMap = { 
		  $container : undefined,
	    },
	    jqueryMap = {},

//	    copyAnchorMap, changeAnchorPart, onHashChange,
//        initModule, setChatAnchor, onResize,
        onClickChat, setJqueryMap
    ;


    
    //--[ setJqueryMap ]--------------------------------------------
    //
    setJqueryMap = function () {
	  var $container = stateMap.$container;
	  jqueryMap = {
        $container : $container,
        $chat : $container.find('.billiesChatcorner-admin-shell-main-content-chat'),
        $modal : $container.find('.billiesChatcorner-admin-shell-modal')
      };
    };

    //--[ onClickChat ]--------------------------------------------
    // マウスクリックを捕捉
    //
    onClickChat = function (event) {
//      changeAnchorPart({
//	    chat : ( stateMap.is_chat_retracted ? 'open' : 'closed' )
//      });
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
      jqueryMap.$modal.css({
        display : 'none'
      });


	  // 機能モジュールを設定して初期化する
	  billiesChatcorner.admin.chat.configModule({
		chat_model : billiesChatcorner.admin.model.chat,
		people_model : billiesChatcorner.admin.model.people
	  });
	  billiesChatcorner.admin.chat.initModule( jqueryMap.$chat );

      
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
