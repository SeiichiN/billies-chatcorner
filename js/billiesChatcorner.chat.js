/*
 * billiesChatcorner.chat.js
 * billiesChatcorner のチャット機能モジュール
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, jQuery, billiesChatcorner */

jQuery( function ($) {
  billiesChatcorner.chat = (function () {
    var configMap = {
      main_html : String()
                + '<div class="billiesChatcorner-chat">'
                  + '<div class="billiesChatcorner-chat-head">'
                    + '<div class="billiesChatcorner-chat-head-toggle">+</div>'
                    + '<div class="billiesChatcorner-chat-head-title">チャット</div>'
                  + '</div>'
                  + '<div class="billiesChatcorner-chat-closer">X</div>'
                  + '<div class="billiesChatcorner-chat-sizer">'
                    + '<div class="billiesChatcorner-chat-msgs"></div>'
                    + '<div class="billiesChatcorner-chat-box">'
                      + '<input type="text">'
                      + '<div class="submit">発言</div>'
                    + '</div>'
                  + '</div>'
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
      slider_opened_em : 16,
      slider_closed_em : 2,
      slider_opened_title : 'クリックで閉じる',
      clider_closed_title : 'クリックで開く',

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
        setSliderPosition, getEmSize, setPxSizes,
        onClickToggle
    ;

    //--[ getEmSize ]-----( utility )---------------------------------
    //
    getEmSize = function ( elem ) {
		console.log(elem);
      return Number(
        getComputedStyle( elem, '').fontSize.match(/\d*\.?\d*/)[0]
      );
    };

    //--[ setJqueryMap ]----------------------------------------------
    // stateMap.$container を jqueryMap にセットする
    //
    setJqueryMap = function () {
      var $append_target = stateMap.$append_target,
          $slider = $append_target.find( '.billiesChatcorner-chat' );
      
      jqueryMap = {
        $slider : $slider,
        $head : $slider.find( '.billiesChatcorner-chat-head' ),
        $toggle : $slider.find( '.billiesChatcorner-chat-head-toggle' ),
        $title  : $slider.find( '.billiesChatcorner-chat-head-title' ),
        $sizer  : $slider.find( '.billiesChatcorner-chat-sizer' ),
        $msgs   : $slider.find( '.billiesChatcorner-chat-msgs' ),
        $box    : $slider.find( '.billiesChatcorner-chat-box' ),
        $input  : $slider.find( '.billiesChatcorner-chat-box input[type="text"]' ),
      };
    };

    //--[ setPxSizes ]---------------------------------------------------
    //
    setPxSizes = function () {
      var px_per_em, opened_height_em;

      px_per_em = getEmSize( jqueryMap.$slider.get(0) );

      opened_height_em = configMap.slider_opened_em;

      stateMap.px_per_em = px_per_em;
      stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
      stateMap.slider_opened_px = opened_height_em * px_per_em;
      jqueryMap.$sizer.css({
        height: ( opened_height_em - 2 ) * px_per_em
      });
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
      var height_px, animate_time, slider_title, toggle_text;

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
          toggle_text = '=';
          break;

        case 'hidden':
          height_px = 0;
          animate_time = configMap.slider_open_px;
          slider_title = '';
          toggle_text = '+';
          break;

        case 'closed':
          height_x = stateMap.slider_closed_px;
          animate_time = configMap.slider_close_time;
          slider_title = configMap.slider_closed_title;
          toggle_text = '+';
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
      jqueryMap.$head.click( onClickToggle );
      stateMap.position_type = 'closed';
      
      return true;
    };

    return {
      setSliderPosition : setSliderPosition,
      configModule : configModule,
      initModule : initModule
    };
  }());

});
