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
  var peopleList, fakeIdSerial, makeFakeId, mockSio;

  fakeIdSerial = 2;

  makeFakeId = function () {
    return 'id_' + String( fakeIdSerial++ );
  };

  peopleList =
    [ { name : 'Billie', _id : 'id_01' } ];

  mockSio = (function () {
	var on_sio, emit_sio,
	  send_listchange, listchange_idto,
	  callback_map = {};

    on_sio = function ( msg_type, callback ) {
      callback_map[ msg_type ] = callback;
    };

    emit_sio = function ( msg_type, data ) {
	  var person_map;

      if ( msg_type === 'adduser' && callback_map.userupdate ) {
        setTimeout( function () {
		  person_map = {
			_id : makeFakeId(),
			name : data.name,
			css_map : data.css_map
		  };
		  peopleList.push( person_map );
          callback_map.userupdate( [ person_map ] );
        }, 3000);
      }
    };

	send_listchange = function () {
	  listchange_idto = setTimeout( function () {
		if (callback_map.listchange) {
		  callback_map.listchange([ peopleList ])
		  listchange_idto = undefined;	
		}
		else { send_listchange(); }
	  }, 1000);
	};

	send_listchange();

    return {
      emit : emit_sio,
      on   : on_sio
    };
  }());

  return {
    mockSio       : mockSio
  };
}());

