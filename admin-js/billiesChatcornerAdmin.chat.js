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
  billiesChatcornerAdmin.chat = (function () {
    //--[ プロパティ：設定値 ]---------------------------------------------
    var configMap = {
      main_html : String()
                + '<div style="padding:1em; color:#fff;">'
                + 'Say hello to chat'
                + '</div>'
      ,
      settable_map : {}
    },
        stateMap = { $container : null },
        jqueryMap = {},

        setJqueryMap, configModule, initModule
    ;


    //--[ setJqueryMap ]--------------------------------------------------
    setJqueryMap = function () {
      var $container = stateMap.$container;
      jqueryMap = { $container : $container };      
    };

    //--[ configModule ]-------------------------------------------------
    // @param:
    //   input_map -- 構成可能なキーバリューマップ
    // @return:
    //   true
    // @exception:
    //   なし
    configModule = function ( input_map ) {
      billiesChatcornerAdmin.util.setConfigMap({
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
    initModule = function ( $container ) {
      $container.html( configMap.main_html );
      stateMap.$container = $container;
      setJqueryMap();
      return true;
    };

    //--[ public ]-----------------------------------------------
    return {
      configModule : configModule,
      initModule : initModule
    };
  }());
});

      
