/*
 * billiesChatcorner.data.js
 * データモジュール
 */

/*jslint          browser : true, continue : true,
  devel   : true, indent  : 2,    maxerr   : 50,
  newcap  : true, nomen   : true, plusplus : true,
  regexp  : true, sloppy  : true, vars     : true,
  white   : true
  */
/*global jQuery, io, billiesChatcorner */

jQuery( function ($) {
  billiesChatcorner.data = (function () {
    'use strict';

    var stateMap = { sio : null },
        makeSio, getSio, initModule;

    makeSio = function () {
      // var socket = io.connect( '/chat' );
      var socket = io.connect( 'http://localhost:3000/chat' );
      // var socket = io.connect( 'http://billieschatcorner.herokuapp.com/chat' );

      return {
        emit : function ( event_name, data ) {
          socket.emit( event_name, data );
        },
        on : function ( event_name, callback ) {
          socket.on( event_name, function () {
            callback( arguments );
          });
        }
      };
    };

    getSio = function () {
      if ( ! stateMap.sio ) { stateMap.sio = makeSio(); }
      return stateMap.sio;
    };

    initModule = function () {};

    return {
      getSio     : getSio,
      initModule : initModule
    };
  }());
});
