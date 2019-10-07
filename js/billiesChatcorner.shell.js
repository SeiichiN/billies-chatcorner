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
/*global $, jQuery, billiesChatcorner */

jQuery( function ($) {
  billiesChatcorner.shell = (function () {
    //--[ プロパティ：設定値 ]---------------------------------------------
    var configMap = {
	  anchor_schema_map : {
	    chat : { opened : true, closed : true }
	  },
	  main_html : String()
		        + '<div class="billiesChatcorner-shell-chat"></div>',
/*
      chat_extend_time : 1000,
	  chat_retract_time : 300,
	  chat_extend_height : 300,
	  chat_retract_height : 32,
	  chat_extended_title : 'チャットを閉じる',
	  chat_retracted_title : 'チャット開始'
*/
    },
	    stateMap = { 
		  anchor_map : {},
	    },
	    jqueryMap = {},

	    copyAnchorMap, changeAnchorPart, onHashChange, onClickChat,
	    setJqueryMap, initModule, toggleChat, setChatAnchor
    ;

    //--[ toggleChat ]-------------------------------------------------
    // do_extend -- true: 拡大   false: 格納
    // callback -- 拡大したあとに開発者が実行したい関数を渡すことができる。
	  /*
    toggleChat = function ( do_extend, callback ) {
      var px_chat_ht = jqueryMap.$chat.height(),
          is_open = px_chat_ht === configMap.chat_extend_height,
          is_closed = px_chat_ht === configMap.chat_retract_height,
          is_sliding = ! is_open && ! is_closed;

      if ( is_sliding ) {
        console.log(px_chat_ht);
      }
      
      if ( is_sliding ) { return false; }

      // チャットスライダーの拡大開始
      if ( do_extend ) {
        jqueryMap.$chat.animate (
          { height : configMap.chat_extend_height },
          configMap.chat_extend_time,
          function () {
		    jqueryMap.$chat.attr(
			  'title', configMap.chat_extended_title
		    );
		    stateMap.is_chat_retracted = false;  // 格納状態ではない
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
		  jqueryMap.$chat.attr(
		    'title', configMap.chat_retracted_title
		  );
		  stateMap.is_chat_retracted = true;   // 格納状態である
          if ( callback ) { callback( jqueryMap.$chat ); }
        }
      );
      return true;
    };
	*/

    //--[ copyAnchorMap ]---------------------------------------------------
    // stateMap.anchor_map のコピー
    copyAnchorMap = function () {
	  return $.extend( true, {}, stateMap.anchor_map );
    };

    //--[ changeAnchorPart ]---------------------------------------------------
    // URIアンカー要素部分を変更
    // 引数：
    //   arg_map -- 変更したいURIアンカー部分を表すマップ
    // 戻り値： boolean
    //   true -- URIのアンカー部分が更新された
    //   false -- URIのアンカー部分を更新できなかった
    // 動作：
    // 現在のアンカーを stateMap.anchor_map に格納する。
    // エンコーディングの説明は uriAnchor を参照。
    // このメソッドは
    //   * copyAnchorMap()を使って子のマップのコピーを作成する
    //   * arg_mapを使ってキーバリューを修正する
    //   * エンコーディングの独立値と従属値の区別を管理する
    //   * uriAnchorを使ってURIの変更を試みる
    //   * 成功時には true、失敗時には false を返す
    //
    changeAnchorPart = function ( arg_map ) {
	  var anchor_map_revise = copyAnchorMap(),
		  bool_return = true,
			          key_name, key_name_dep;

	  KEYVAL:
		                for ( key_name in arg_map ) {
			              if ( arg_map.hasOwnProperty( key_name )) {
				            if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

				            anchor_map_revise[ key_name ] = arg_map[ key_name ];

				            key_name_dep = '_' + key_name;
				            if ( arg_map[ key_name_dep ] ) {
					          anchor_map_revise[ key_name_dep ] = arg_map[ key_name_dep ];
				            }
				            else {
					          delete anchor_map_revise[ key_name_dep ];
					          delete anchor_map_revise[ '_s' + key_name_dep];
				            }
			              }
		                }

	  // URIの更新。成功しなければもとにもどす
	  try {
	    $.uriAnchor.setAnchor( anchor_map_revise );
	  }
	  catch ( error ) {
	    // URIを既存の状態に置き換える
	    $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
	    bool_return = false;
	  }

	  return bool_return;
    };

    //--[ イベントハンドラ：onHashChange ]------------------------------
    // 引数： event -- jQueryイベントオブジェクト
    // 戻り値： false
    // 動作：
    //   * URIアンカー要素を解析する
    //   * 提示されたアプリケーション状態と現在の状態を比較する。
    //   * 提示された状態が既存の状態と異なる場合のみ
    //     アプリケーションを調整する。
    onHashChange = function (event) {
      var anchor_map_previous = copyAnchorMap(),
          anchor_map_proposed,
          _s_chat_previous, _s_chat_proposed,
          s_chat_proposed,
          is_ok = true;

      // アンカーの解析
      try {
        anchor_map_proposed = $.uriAnchor.makeAnchorMap();
      }
      catch (error) {
        $.uriAnchor.setAnchor( anchor_map_previous, null, true );
        return false;
      }
      stateMap.anchor_map = anchor_map_proposed;

      // 便利な変数
      _s_chat_previous = anchor_map_previous._s_chat;
      _s_chat_proposed = anchor_map_proposed._s_chat;

      // 変更されている場合のチャットコンポーネントの調整開始
      if ( ! anchor_map_previous
        || _s_chat_previous !== _s_chat_proposed ) {
        s_chat_proposed = anchor_map_proposed.chat;
        switch ( s_chat_proposed ) {
          case 'opened':
            is_ok = billiesChatcorner.chat.setSliderPosition( 'opened' );
            // toggleChat( true );
            break;
          case 'closed':
            is_ok = billiesChatcorner.chat.setSliderPosition( 'closed' );
            // toggleChat( false );
            break;
          default:
            // toggleChat( false );
            billiesChatcorner.chat.setSliderPosition( 'closed' );
            delete anchor_map_proposed.chat;
            $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
        }
      }

      // スライダーの変更が拒否された場合にアンカーを元に戻す処理
      if ( ! is_ok) {
        if ( anchor_map_previous ) {
          $.uriAnchor.setAnchor( anchor_map_previous, null, true );
          stateMap.anchor_map = anchor_map_previous;
        } else {
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
        }
      }

      return false;
    };

    //--[ setChatAnchor ]------------------------------------------
    // 用例：setChatAnchor( 'closed' );
    // 目的：アンカーのチャットコンポーネントを変更する。
    // 引数：
    //   * position_type -- closed / opened
    // 動作：
    //   可能ならURIアンカーパラメータ「chat」を要求値に変更する
    // 戻り値：
    //   * true -- 要求されたアンカー部分が更新された
    //   * false -- 要求されたアンカー部分が更新されなかった
    // 例外発行：なし
    //
    setChatAnchor = function ( position_type ) {
      return changeAnchorPart( { chat : position_type } );
    };

    //--[ setJqueryMap ]--------------------------------------------
    //
    setJqueryMap = function () {
	  var $container = stateMap.$container;
	  jqueryMap = {
        $container : $container,
        // $chat : $container.find('.billiesChatcorner-shell-chat')
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

		// 我々のスキーマを使うように uriAnchor を設定する
		$.uriAnchor.configModule({
			schema_map : configMap.anchor_schema_map
		});

		// 機能モジュールを設定して初期化する
		billiesChatcorner.chat.configModule({
			set_chat_anchor : setChatAnchor,
			chat_model : billiesChatcorner.model.chat,
			people_model : billiesChatcorner.model.people
		});
		billiesChatcorner.chat.initModule( jqueryMap.$container );

	  // チャットスライダーの初期化
	  // マウスクリックをバインド
		/*
	  stateMap.is_chat_retracted = true;
	  jqueryMap.$chat
			   .attr( 'title', configMap.chat_retracted_title )
			   .click( onClickChat );
      $.uriAnchor.configModule({
        schema_map : configMap.anchor_schema_map
      });

      billiesChatcorner.chat.configModule( {} );
      billiesChatcorner.chat.initModule( jqueryMap.$chat );
      */

      $(window)
        .bind( 'hashchange', onHashChange )
        .trigger( 'hashchange' );
    };

    //--[ オープンするメソッド ]----------------------------------
    //
    return { initModule : initModule };
  }());
});
