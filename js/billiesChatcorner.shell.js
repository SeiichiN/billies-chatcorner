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
	var configMap = {
		anchor_schema_map : {
			chat : { open : true, closed : true }
		},
		main_html : String()
		+ '<div class="billiesChatcorner-shell-chat"></div>',
		chat_extend_time : 1000,
		chat_retract_time : 300,
		chat_extend_height : 300,
		chat_retract_height : 20,
		chat_extended_title : 'チャットを閉じる',
		chat_retracted_title : 'チャット開始'
	},
		stateMap = { 
			$container : null,
			anchor_map : {},
			is_chat_retracted : true  // 格納状態 true:格納 false:拡大
		},
		jqueryMap = {},

		copyAnchorMap, changeAnchorPart, onHashchange, onClickChat,
		setJqueryMap, initModule
	;

	// stateMap.anchor_map のコピー
	copyAnchorMap = function () {
		return $.extend( true, {}, stateMap.anchor_map );
	};

	// URIアンカー要素部分を変更
	// 引数：
	//   arg_map -- 変更しあいURIアンカー部分を表すマップ
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
				if ( key_name_indexOf( '_' ) === 0 ) { continue KEYVAL; }

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

	setJqueryMap = function () {
		var $container = stateMap.$container;
	  jqueryMap = {
        $container : $container,
        $chat : $container.find('.billiesChatcorner-shell-chat')
      };
	};

	// do_extend -- true: 拡大   false: 格納
	// callback -- 拡大したあとに開発者が実行したい関数を渡すことができる。
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

	// マウスクリックを捕捉
	onClickChat = function (event) {
		if (toggleChat( stateMap.is_chat_retracted )) {
			$.uriAnchor.setAnchor({
				chat : ( stateMap.is_chat_retracted ? 'open' : 'closed' )
			});
		}
		return false;
	};

	initModule = function ( $container ) {
		stateMap.$container = $container;
		$container.html( configMap.main_html );
		setJqueryMap();

		// チャットスライダーの初期化
		// マウスクリックをバインド
		stateMap.is_chat_retracted = true;
		jqueryMap.$chat
			.attr( 'title', configMap.chat_retracted_title )
			.click( onClickChat );
	};

  setTimeout( function () { toggleChat( true );}, 3000);
  setTimeout( function () { toggleChat( false );}, 3000);

	return { initModule : initModule };
}());
