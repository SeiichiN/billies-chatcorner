/*
 * billies-chatcorner.js
 * ルート名前空間モジュール
 */
/*jslint          browser : true, continue : true,
  devel   : true, indent  : 2,    maxerr   : 50,
  newcap  : true, nomen   : true, plusplus : true,
  regexp  : true, sloppy  : true, vars     : true,
  white   : true
  */
/*global $, billiesChatcorner:true */

var billiesChatcorner = (function () {
  var initModule = function ($container) {
    $container.html(
      '<h1>Hello World!</h1>'
    );
  };

  return { initModule : initModule };
}());