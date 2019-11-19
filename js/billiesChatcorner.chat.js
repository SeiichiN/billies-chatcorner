/*
 * billiesChatcorner.chat.js
 billiesChatcorner のチャット機能モジュール
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, jQuery, event, billiesChatcorner */

jQuery( function ($) {
  billiesChatcorner.chat = (function () {
    'usr strict';
    
    var configMap = {
      main_html : String()
                + '<div class="billiesChatcorner-chat">'
                  + '<div class="billiesChatcorner-chat-head">'
                    + '<div class="billiesChatcorner-chat-head-toggle">+</div>'
                    + '<div class="billiesChatcorner-chat-head-title"></div>'
                  + '</div>'
                  + '<div class="billiesChatcorner-chat-help"></div>'
                  + '<div class="billiesChatcorner-chat-acct"></div>'
                  + '<div class="billiesChatcorner-chat-closer">X</div>'
                  + '<div class="billiesChatcorner-chat-sizer">'
                    + '<div class="billiesChatcorner-chat-msg">'
                      + '<div class="billiesChatcorner-chat-msg-log"></div>'
                      + '<div class="billiesChatcorner-chat-msg-in">'
                        + '<form class="billiesChatcorner-chat-msg-form">'
                          + '<input type="text">'
                          + '<input type="submit" style="display:none">'
                          + '<div class="billiesChatcorner-chat-msg-send">発言</div>'
                        + '</form>'
                      + '</div>'  // .billiesChatcorner-chat-msg-in
                    + '</div>'  // .billiesChatcorner-chat-msg
                  + '</div>'   // .billiesChatcorner-chat-sizer
                + '</div>',  // .billiesChatcorner-chat
      
      help_html : String()
                + '<div class="billiesChatcorner-help">'
                + '<div class="billiesChatcorner-help-closer">X</div>'
                + '<p>'
                + 'このチャットでは、<br>'
				+ '管理人のビリーとチャットができます。<br>'
                + '管理人がログインしていればの話ですが(^_^;<br>'
                + 'もし、管理人がログインしていない場合は、<br>'
                + '左のメールボタンからメールで連絡をお願いします。<br>'
                + '</p>'
                + '</div>',

      settable_map : {
        slider_open_time : true,
        slider_close_time : true,
        slider_opened_em : true,
        slider_closed_em : true,
        slider_opened_title : true,
        slider_closed_title : true,

        chat_model : true,
        people_model : true,
        set_chat_anchor : true
      },

      slider_open_time : 250,
      slider_close_time : 250,
      slider_opened_em : 26, // チャットスライダーオープン時の高さ
      slider_closed_em : 2,
      slider_opened_title : 'クリックで閉じる',
      slider_closed_title : 'クリックで開く',
	  slider_opened_title_text : 'チャット',
	  slider_closed_title_text : 'チャット開始',
      slider_opened_min_em : 10,
      window_height_min_em : 20,
      slider_acct_text : 'ログイン',
      slider_help_text : '使い方',

      chat_model : null,
      people_model : null,
      set_chat_anchor : null
    },
	  stateMap = {
		$append_target : null,
		position_type : 'closed',
		px_per_em : 0,
		slider_hidden_px : 0,
		slider_closed_px : 0,
		slider_opened_px : 0
	  },
	  jqueryMap = {},

	  setJqueryMap, configModule, initModule,
	  setSliderPosition, setPxSizes,
	  onClickToggle, removeSlider, handleResize,
	  onTapAcct, onLogin, onLogout,
	  scrollChat, writeChat, writeAlert, clearChat,
	  onSubmitMsg, onListchange, onSetchatee, onUpdatechat,
	  onTapHelp, onTapHelpClose
    ;


    //--[ setJqueryMap ]----------------------------------------------
    // stateMap.$container を jqueryMap にセットする
    //
    setJqueryMap = function () {
      var $append_target = stateMap.$append_target,
          $slider = $append_target.find( '.billiesChatcorner-chat' );
      
      jqueryMap = {
        $slider  : $slider,
        $head    : $slider.find( '.billiesChatcorner-chat-head' ),
        $toggle  : $slider.find( '.billiesChatcorner-chat-head-toggle' ),
        $title   : $slider.find( '.billiesChatcorner-chat-head-title' ),
        $sizer   : $slider.find( '.billiesChatcorner-chat-sizer' ),
        $msg     : $slider.find( '.billiesChatcorner-chat-msg' ),
        $msg_log : $slider.find( '.billiesChatcorner-chat-msg-log' ),
        $msg_in  : $slider.find( '.billiesChatcorner-chat-msg-in' ),
        $input   : $slider.find( '.billiesChatcorner-chat-msg-in input[type="text"]' ),
        $send    : $slider.find( '.billiesChatcorner-chat-msg-send' ),
        $form    : $slider.find( '.billiesChatcorner-chat-msg-form' ),
        $acct    : $slider.find( '.billiesChatcorner-chat-acct' ),
        $help    : $slider.find( '.billiesChatcorner-chat-help' ),
        $window  : jQuery(window)
      };
    };

    //--[ setPxSizes ]---------------------------------------------------
    //
    setPxSizes = function () {
      var px_per_em, opened_height_em, window_height_em;

      // .billiesChatcorner-chatのフォントサイズはデフォルトでは 16
      // つまり、1emあたり16px
      px_per_em = billiesChatcorner.util_b.getEmSize( jqueryMap.$slider.get(0) );
      
      // windowの高さを em換算で求める
      // $(window).height() -- windowの高さ
      // 仮にwindowの高さが880pxなら、880/16 で 55 となる。
      // 0.5を足してfloor、つまり、四捨五入。
      window_height_em = Math.floor(
        ( $(window).height() / px_per_em ) + 0.5
      );

      opened_height_em =
        window_height_em > configMap.window_height_min_em ?
        configMap.slider_opened_em :
        configMap.slider_opened_min_em;

      stateMap.px_per_em = px_per_em;
      stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
      stateMap.slider_opened_px = opened_height_em * px_per_em;
      jqueryMap.$sizer.css({
        height: ( opened_height_em - 2 ) * px_per_em
      });
    };

    //--[ handleResize ]---------------------------------------------------
    // 目的：
    //   ウィンドウリサイズイベントに対し、必要に応じてこのモジュールが提供する
    //   表示を調整する
    // 動作：
    //   ウィンドウの高さや幅が所定のしきい値を下回ったら
    //   縮小したウィンドウサイズに合わせてチャットスライダーのサイズを変更する
    // 戻り値：ブール値
    //   * false -- リサイズを考慮していない
    //   * true  -- リサイズを考慮した
    // 例外発行：なし
    //
    handleResize = function () {
      // スライダーコンテナがなければ何もしない
      if ( ! jqueryMap.$slider ) { return false; }

      setPxSizes();
      if ( stateMap.position_type === 'opened' ) {
        jqueryMap.$slider.css( { height : stateMap.slider_opened_px } );
      }
      return true;
    };

    //--[ setSliderPosition ]-----------------------------------------------
    // 用例：billiesChatcorner.chat.setSliderPosition( 'closed' );
    // 目的：チャットスライダーが要求された状態になるようにする。
    // 引数：
    //   * position_type -- enum( 'closed', 'opened', または 'hidden')
    //   * callback -- アニメーションの最後のオプションのコールバック。
    //     （コールバックは引数としてスライダーDOM要素を受け取る）
    // 動作：
    //   スライダーが要求に合致している場合は、現在のままにする。
    //   それ以外の場合は、アニメーションを使って要求された状態にする。
    // 戻り値：
    //   * true -- 要求された状態を実現
    //   * false -- 要求された状態を実現していない
    // 例外発行：なし
    //
    setSliderPosition = function ( position_type, callback ) {
      var height_px, animate_time, slider_title, toggle_text, slider_title_text,
          acct_text, help_text;

      // スライダーがすでに要求された位置にある場合は true を返す
      if ( stateMap.position_type === position_type ) {
        return true
      }

      // アニメーションパラメータを用意する
      switch ( position_type ) {
        case 'opened':
          height_px = stateMap.slider_opened_px;
          animate_time = configMap.slider_open_time;
          slider_title = configMap.slider_opened_title;
		  slider_title_text = configMap.slider_opened_title_text;
          toggle_text = '=';
          acct_text = configMap.slider_acct_text;
          jqueryMap.$help.css('display', 'none');
          jqueryMap.$acct.css('display', 'block');
          break;

        case 'hidden':
          height_px = 0;
          animate_time = configMap.slider_open_px;
          slider_title = '';
		  slider_title_text = '';
          toggle_text = '+';
          acct_text = '';
          help_text = '';
          break;

        case 'closed':
          height_px = stateMap.slider_closed_px;
          animate_time = configMap.slider_close_time;
          slider_title = configMap.slider_closed_title;
		  slider_title_text = configMap.slider_closed_title_text;
          toggle_text = '+';
          help_text = configMap.slider_help_text;
          acct_text = '';
          jqueryMap.$help.css('display', 'block');
          jqueryMap.$acct.css('display', 'none');
          break;

          // 未知のposition_typeに対処する
        default:
          return false;
      }

      // スライダー位置をアニメーションで変更する
      stateMap.position_type = '';
      jqueryMap.$slider.animate(
        { height : height_px },
        animate_time,
        function () {
          jqueryMap.$toggle.prop( 'title', slider_title );
          jqueryMap.$toggle.text( toggle_text );
		  jqueryMap.$title.text( slider_title_text );
          jqueryMap.$acct.text( acct_text );
          jqueryMap.$help.text( help_text );
          stateMap.position_type = position_type;
          if ( callback ) { callback( jqueryMap.$slider ); }
        }
      );
      return true;
    };

    //--[ onClickToggle ]-------------------------------------------
    //
    onClickToggle = function (event) {
      var set_chat_anchor = configMap.set_chat_anchor;

      if ( stateMap.position_type === 'opened' ) {
        set_chat_anchor( 'closed' );
      }
      else if ( stateMap.position_type === 'closed' ) {
        set_chat_anchor( 'opened' );
      }

      return false;
    };

    //--[ onTapAcct ]-----------------------------------------------
    //
    onTapAcct = function (event) {
      var acct_text, user_name,
          user = billiesChatcorner.model.people.get_user();

      if (user.get_is_anon()) {
        user_name = prompt(configMap.slider_acct_text);
        billiesChatcorner.model.people.login( user_name );
        jqueryMap.$acct.text( '...処理中...' );
      }
      else {
        billiesChatcorner.model.people.logout();
      }
      return false;
    };

    //--[ onLogin ]---------------------------------------------------
    //
    onLogin = function ( event, login_user ) {
      jqueryMap.$acct.text( login_user.name );
    };

    //--[ onLogout ]--------------------------------------------------
    //
    onLogout = function ( event, logout_user ) {
      jqueryMap.$acct.text( configMap.slider_acct_text );
      jqueryMap.$title.text( configMap.slider_opened_title_text );
	  clearChat();  // ログ領域の消去
    };

    //--[ onTapHelp ]------------------------------------------------
    //
    onTapHelp = function ( event ) {
      var $area = stateMap.$append_target,
          $modal = $area.append( configMap.help_html ),
		  $help_closer = $modal.find( '.billiesChatcorner-help-closer' );
		  
      $help_closer.bind('utap', onTapHelpClose);
    };

	//--[ onTapHelpClose ]-------------------------------------------
	//
	onTapHelpClose = function ( event ) {
	  var $helpArea = stateMap.$append_target.find( '.billiesChatcorner-help' );

	  $helpArea.css('display', 'none');

	};

	//--[ scrollChat ]-----------------------------------------------
	// メッセージをスクロールする
	//
	scrollChat = function () {
	  var $msg_log = jqueryMap.$msg_log;

	  $msg_log.animate(
		{ scrollTop : $msg_log.prop( 'scrollHeight' ) - $msg_log.height() },
		150
	  );
	};

	//--[ writeChat ]--------------------------------------------------
	// ログ領域にチャット文字列を表示する
	// @param:
	//   person_name -- チャット相手の名前
	//   text        -- チャット文字列
	//   is_user     -- 自分の発言かどうか true / false
	writeChat = function ( person_name, text, is_user ) {
	  var msg_class = is_user
		? 'billiesChatcorner-chat-msg-log-me'
		: 'billiesChatcorner-chat-msg-log-msg';
	  
	  jqueryMap.$msg_log.append(
		'<div class="' + msg_class + '">'
        + '<span class="' + msg_class + '-name">'
		+ billiesChatcorner.util_b.encodeHtml( person_name ) + '> '
        + '</span>'
        + '<span class="' + msg_class + '-body">'
		+ billiesChatcorner.util_b.encodeHtml( text )
        + '</span>'
		+ '</div>'
	  );

	  scrollChat();
	};

	//--[ writeAlert ]-----------------------------------------------------
	// 発言以外の出力を表示する
	//
	writeAlert = function ( alert_text ) {
	  jqueryMap.$msg_log.append(
		'<div class="billiesChatcorner-chat-msg-log-alert">'
		+ billiesChatcorner.util_b.encodeHtml( alert_text )
		+ '</div>'
	  );
	  scrollChat();
	};

	//--[ clearChat ]-----------------------------------------------------
	// ログ領域を初期化する
	//
	clearChat = function () {
	  jqueryMap.$msg_log.empty();
	};

	//--[ onSubmitMsg ]---------------------------------------------------
	//
	onSubmitMsg = function ( event ) {
	  var msg_text = jqueryMap.$input.val(),
          send_msg_ok;

	  if ( msg_text.trim() === '') { return false; }

	  send_msg_ok = configMap.chat_model.send_msg( msg_text );
      console.log('send_msg : client -> admin %s ', msg_text);
      if ( ! send_msg_ok ) {
        writeAlert( chatee.name + ' は席をはずしています。');
      }
      
	  jqueryMap.$input.focus();
	  jqueryMap.$send.addClass( 'billiesChatcorner-x-select' );
	  setTimeout(
		function () { jqueryMap.$send.removeClass('billiesChatcorner-x-select'); },
		250
	  );
	  return false;
	};

	//--[ onListchange ]---------------------------------------------------
	//
	onListchange = function ( event ) {
	  var list_html = String(),
		people_db = configMap.people_model.get_db(),
		chatee = configMap.chat_model.get_chatee();

	  people_db().each( function (person, idx) {
		var select_class = '';

		if ( person.get_is_anon() || person.get_is_user() ) { return true; }

		if ( chatee && chatee.id === person.id ) {
		  select_class = ' billiesChatcorner-x-select';
		}

		list_html = list_html
		  + '<div class="billiesChatcorner-chat-list-name'
		  + select_class + '" data-id="' + person.id + '">'
		  + billiesChatcorner.util_b.encodeHtml( person.name )
		  + '</div>';
		
		if ( ! list_html ) {
		  list_html = String()
		  + '<div class="billiesChatcorner-chat-list-note">'
		  + 'To chat alone is the fate of all great souls...<br><br>'
		  + 'No one is online'
		  + '</div>';
		  clearChat();
		}
		// jqueryMap.$list_box.html( list_html );
	  });
  
	};

	//--[ onSetChatee ]---------------------------------------------------
	//
	onSetchatee = function ( event, arg_map ) {
	  var new_chatee = arg_map.new_chatee,
		old_chatee = arg_map.old_chatee;

	  jqueryMap.$input.focus();
	  if ( ! new_chatee ) {
		if ( old_chatee ) {
		  writeAlert( old_chatee.name + ' さんが退出しました' );
		}
		else {
		  writeAlert( 'チャット相手はもういません' );
		}
		jqueryMap.$title.text( 'チャット' );
		return false;
	  }

	  // jqueryMap.$list_box
	// 	.find( '.billiesChatcorner-chat-list-name' )
	// 	.removeClass( 'billiesChatcorner-x-select' )
	// 	.end()
	// 	.find( '[data-id=' + arg_map.new_chatee.id + ']' )
	// 	.addClass( 'billiesChatcorner-x-select' );

	  writeAlert( 'チャット相手> ' + arg_map.new_chatee.name );
	  jqueryMap.$title.text( '> ' + arg_map.new_chatee.name );
	  return true;
	};

	//--[ onUpdatacat ]----------------------------------------------------
	//
	onUpdatechat = function ( event, msg_map ) {
	  var is_user,
		sender_id = msg_map.sender_id,
		msg_text = msg_map.msg_text,
		chatee = configMap.chat_model.get_chatee() || {},
		sender = configMap.people_model.get_by_cid( sender_id );

	  if ( ! sender ) {
		writeAlert( msg_text );
		return false;
	  }

	  is_user = sender.get_is_user();

	  if ( ! ( is_user || sender_id === chatee.id )) {
		configMap.chat_model.set_chatee( sender_id );
	  }

	  writeChat( sender.name, msg_text, is_user );

	  if ( is_user ) {
		jqueryMap.$input.val('');
		jqueryMap.$input.focus();
	  }
	};


    //--[ configModule ]-----------------------------
    // 用例： billiesChatcorner.chat.configModule( {slider_open_em : 18} );
    // 目的：初期化前にモジュールを構成する
    // 引数：
    //   * set_chat_anchor -- オープンまたはクローズ状態を示すようにURIアンカー
    //     を変更するコールバック。このコールバックは要求された状態を満たせない
    //     場合には false を返さなければならない。
    //   * chat_model -- インスタントメッセージングとやり取りするメソッドを提供
    //     するチャットモデルオブジェクト。
    //   * people_model -- モデルが保持する人々のリストを管理するメソッドを提供
    //     するピープルモデルオブジャクト
    //   * slider_* -- 完全なリストは mapConfig.settable_map を参照。
    //     用例：slider_open_em -- オープン時の高さ（単位em）
    // 動作：
    //  指定された引数で cofigMap を更新する。その他の動作は行わない。
    // 戻り値： true
    // 例外発行：受け入れられない引数や欠如した引数の場合、JavaScriptエラーオブ
    //   ジェクトとスタックトレース
    //
    configModule = function (input_map) {
      billiesChatcorner.util.setConfigMap({
        input_map : input_map,
        settable_map : configMap.settable_map,
        config_map : configMap
      });
      return true;
    };


    //--[ initModule ]----------------------------------------------------
    // 用例：billiesChatcorner.chat.initModule( $('#div_id') );
    // 目的：
    //   ユーザに機能を提供するようにチャットに指示する
    // 引数：
    //   * $append_target -- 例：$('#div_id')
    //     一つのDOMコンテナを表す jQueryコレクション
    // 動作：
    //   指定されたコンテナにチャットスライダーを付加し、HTMLコンテンツで埋める。
    //   そして、要素、イベント、ハンドラを初期化し、ユーザにチャットルームインタ
    //   ーフェースを提供する。
    // 戻り値： true -- 成功 / false -- 失敗
    // 例外発行：なし
    //
    initModule = function ($append_target) {
      $append_target.append( configMap.main_html );
      stateMap.$append_target = $append_target;
      setJqueryMap();
      setPxSizes();

      // チャットスライダーをデフォルトのタイトルと状態で初期化する
      jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
	  jqueryMap.$title.text( configMap.slider_closed_title_text );
      jqueryMap.$head.click( onClickToggle );
      stateMap.position_type = 'closed';
      jqueryMap.$help.css('display', 'block');
      jqueryMap.$help.text( configMap.slider_help_text );
      jqueryMap.$acct.css('display', 'none');
      jqueryMap.$help.click( onTapHelp );

      // 各種ログイン後のイベントを登録する
      jQuery.gevent.subscribe( $append_target, 'billiesChatcorner-listchange', onListchange );
      jQuery.gevent.subscribe( $append_target, 'billiesChatcorner-setchatee', onSetchatee );
      jQuery.gevent.subscribe( $append_target, 'billiesChatcorner-updatechat', onUpdatechat );

      // ログイン処理
      jQuery.gevent.subscribe( $append_target, 'billiesChatcorner-login', onLogin );
      jQuery.gevent.subscribe( $append_target, 'billiesChatcorner-logout', onLogout );
      jqueryMap.$acct.text(configMap.slider_acct_text).bind( 'utap', onTapAcct);

      // 発言ボタンの処理
      jqueryMap.$send.bind( 'utap', onSubmitMsg );
      jqueryMap.$form.bind( 'submit', onSubmitMsg );
      
      return true;
    };

    //--[ removeSlider ]-------------------------------------------------
    // 目的：
    //   * DOM要素chatSliderを削除する
    //   * 初期状態に戻す
    //   * コールバックや他のデータへのポインタを削除する
    // 引数：なし
    // 戻り値：true
    // 例外発行：なし
    //
    removeSlider = function () {
      // 初期化と状態を解除する
      // DOMコンテナを削除する。これはイベントのバインディングも削除する
      if ( jqueryMap.$slider ) {
        jqueryMap.$slider.remove();
        jqueryMap = {};
      }
      stateMap.$append_target = null;
      stateMap.position_type = 'closed';

      // 主な構成を解除する
      configMap.chat_model = null;
      configMap.people_model = null;
      configMap.set_chat_anchor = null;
      return true;
    };
    

    return {
      setSliderPosition : setSliderPosition,
      configModule : configModule,
      initModule : initModule,
      removeSlider : removeSlider,
      handleResize : handleResize
    };
  }());

});
