/*
 * billiesChatcorner.fake.js
 * フェイクモジュール
 */

/*jslint          browser : true, continue : true,
  devel   : true, indent  : 2,    maxerr   : 50,
  newcap  : true, nomen   : true, plusplus : true,
  regexp  : true, sloppy  : true, vars     : true,
  white   : true
  */
/*global jQuery, $, billiesChatcorner */

billiesChatcorner.fake = (function () {
  'use strict';
  var getPeopleList, fakeIdSerial, makeFakeId, mockSio;

  fakeIdSerial = 2;

  makeFakeId = function () {
    return 'id_' + String( fakeIdSerial++ );
  };

  getPeopleList = function () {
    return [ { name : 'Billie', _id : 'id_01' } ];
  };

  mockSio = (function () {
    var on_sio, emit_sio, callback_map = {};

    on_sio = function ( msg_type, callback ) {
      callback_map[ msg_type ] = callback;
    };

    emit_sio = function ( msg_type, data ) {
      if ( msg_type === 'adduser' && callback_map.userupdate ) {
        setTimeout( function () {
          callback_map.userupdate(
            [{ _id     : makeFakeId(),
               name    : data.name    }]
          );
        }, 3000);
      }
    };

    return {
      emit : emit_sio,
      on   : on_sio
    };
  }());

  return {
    getPeopleList : getPeopleList,
    mockSio       : mockSio
  };
}());

