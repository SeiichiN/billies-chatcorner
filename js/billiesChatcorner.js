/*
 * billiesChatcorner.js
 * ルート名前空間モジュール
 */
/*jslint          browser : true, continue : true,
  devel   : true, indent  : 2,    maxerr   : 50,
  newcap  : true, nomen   : true, plusplus : true,
  regexp  : true, sloppy  : true, vars     : true,
  white   : true
  */
/*global jQuery, $, billiesChatcorner:true */

var billiesChatcorner = (function () {
  'use strict';
  
  var initModule = function ($container) {
    // data_js_url + '/initModule()';
    billiesChatcorner.data.initModule();
    billiesChatcorner.model.initModule( $container );
    billiesChatcorner.shell.initModule( $container );
  };

  return { initModule : initModule };
}());
