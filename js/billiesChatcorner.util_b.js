/**
 * billiesChatcorner.util_b.js
 * javascript ブラウザユーティリティ
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, jQuery, billiesChatcorner, getComputedStyle */

billiesChatcorner.util_b = ( function () {
  'use strict';

  //--[ モジュールスコープ変数 ]--------------------------
  var configMap = {
    regex_encode_html : /[&"'><]/g,
    regex_encode_noamp : /["'><]/g,
    html_encode_map : {
      '&' : '&#38;',
      '"' : '&#34;',
      "'" : '&#39;',
      '>' : '&#62;',
      '<' : '&#60;'
    }
  },

      decodeHtml, encodeHtml, getEmSize;

  configMap.encode_noamp_map = jQuery.extend(
    {}, configMap.html_encode_map
  );
  delete configMap.encode_noamp_map['&'];

  //==[ ユーティリティメソッド ]===========================
  //--[ decodeHtml ]------------------------------------
  // HTMLエンティティをブラウザに適した方法でデコードする
  // http://stackoverflow.com/questions/1912501/\
  //  unescape-html-entities-in-javascript を参照
  //
  // <div>要素をつくって、その中身に str を入れる。
  decodeHtml = function ( str ) {
    return jQuery('<div />').html( str || '' ).text();
  };

  //--[ encodeHtml ]-------------------------------------
  // @params:
  //   input_arg_str -- HTML文字列
  //   exclude_amp -- true: '&'を除外
  //                  false: '&'を含む
  //
  encodeHtml = function ( input_arg_str, exclude_amp ) {
    // String()を使うことで、replaceメソッドが使えるようになる。
    var input_str = String( inpug_arg_str ),
        regex, lookup_map
    ;

    if ( exclude_amp ) {
      lookup_map = configMap.encode_noamp_map;
      regex = configMap.regex_encode_noamp;
    }
    else {
      lookup_map = configMap.html_encode_map;
      regex = configMap.regex_encode_html;
    }

    return input_str.replace(
      regex,
      function ( match, name ) {
        return lookup_map[ match ] || '';
      }
    );
  };

  //--[ getEmSize ]-----( utility )---------------------------------
  // 要素elemのfontsizeを取得する
  // 引数：要素
  // 戻り値：数値
  //
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '').fontSize.match(/\d*\.?\d*/)[0]
    );
  };

  return {
    decodeHtml : decodeHtml,
    encodeHtml : encodeHtml,
    getEmSize : getEmSize
  };
}());


