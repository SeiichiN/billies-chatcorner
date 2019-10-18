/*
 * billiesChatcornerAdmin.chat.js
 * billiesChatcornerAdmin のチャットモジュール
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, jQuery, billiesChatcornerAdmin */

jQuery( function ($) {
  billiesChatcorner.admin.chat = (function () {
    //--[ プロパティ：設定値 ]---------------------------------------------
    var configMap = {
      main_html : String()
                + '<div class="billiesChatcorner-admin-chat">'
                  + '<div class="billiesChatcorner-admin-chat-head">'
//                  + '<div class="billiesChatcorner-admin-chat-head-toggle">+</div>'
                    + '<div class="billiesChatcorner-admin-chat-head-title"></div>'
                  + '</div>'
//                + '<div class="billiesChatcorner-admin-chat-closer">X</div>'
                  + '<div class="billiesChatcorner-admin-chat-sizer">'
                    + '<div class="billiesChatcorner-admin-chat-msgs"></div>'
                    + '<div class="billiesChatcorner-admin-chat-box">'
                      + '<input type="text">'
                      + '<div class="admin-submit">発言</div>'
                    + '</div>'
                  + '</div>'
                + '</div>'
      ,
      settable_map : {
        chat_head_title : true,
        chat_model : true,
        people_model : true
      },
      chatArea_title : 'CHAT',
      
      chat_model : null,
      people_model : null
    },
        
        stateMap = {
          $append_target : null,
          px_per_em : 0
        },
        jqueryMap = {},

        setJqueryMap, configModule, initModule
    ;


    //--[ setJqueryMap ]--------------------------------------------------
    setJqueryMap = function () {
      var $append_target = stateMap.$append_target,
          $chatArea = $append_target.find('.billiesChatcorner-admin-chat');
      
      jqueryMap = {
        $chatArea : $chatArea,
        $head_a : $chatArea.find( '.billiesChatcorner-admin-chat-head' ),
        $title_a : $chatArea.find( '.billiesChatcorner-admin-chat-head-title' ),
        $sizer_a : $chatArea.find( '.billiesChatcorner-admin-chat-sizer' ),
        $msgs_a : $chatArea.find( '.billiesChatcorner-admin-chat-msgs' ),
        $box_a : $chatArea.find( '.billiesChatcorner-admin-chat-box' ),
        $input_a : $chatArea.find( '.billiesChatcorner-admin-chat-box input[type="text"]' )
      };      
    };

    //--[ setPxSizes ]---------------------------------------------------
    setPxSizes = function () {
      var px_per_em, window_height_em;

      px_per_em = billiesChatcorner.util_b.getEmSize( jqueryMap.$chatArea.get(0) );
      window_height_em = Math.floor(
        ( $(window).height() / px_per_em ) + 0.5
      );
      /*
      jqueryMap.$chatArea.css({
        height: (window_height_em - 2) * px_per_em
      });
      */
    };

    //--[ configModule ]-------------------------------------------------
    // @param:
    //   input_map -- 構成可能なキーバリューマップ
    // @return:
    //   true
    // @exception:
    //   なし
    configModule = function ( input_map ) {
      billiesChatcorner.util.setConfigMap({
        input_map : input_map,
        settable_map : configMap.settable_map,
        config_map : configMap
      });
      return true;
    };

    //--[ initModule ]---------------------------------------------------
    // @param:
    //   $container -- jQuery要素
    // @return:
    //   true
    // @exception:
    //   なし
    initModule = function ( $append_target ) {
      $append_target.html( configMap.main_html );
      stateMap.$append_target = $append_target;
      setJqueryMap();
      setPxSizes();

      jqueryMap.$title_a.text( configMap.chatArea_title );
      
      
      return true;
    };

    //--[ public ]-----------------------------------------------
    return {
      configModule : configModule,
      initModule : initModule
    };
  }());
});

      
