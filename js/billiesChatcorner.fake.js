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
/*global jQuery, $, billiesChatcorner, billiesChatcorner_page_mode */

billiesChatcorner.fake = (function () {
  'use strict';
  var peopleList, fakeIdSerial, makeFakeId, mockSio;

  fakeIdSerial = 5;

  makeFakeId = function () {
    return 'id_' + String( fakeIdSerial++ );
  };

  console.log(billiesChatcorner_page_mode.mode);

  switch (billiesChatcorner_page_mode.mode) {
    case 'admin-page':
      peopleList = [
        {
          name : 'ビリー',
          _id : 'id_01',
          css_map : { top: 20, left: 20, 'background-color': 'rgb(128, 128, 128)' }
        },
        {
          name : 'マイク',
          _id : 'id_02',
          css_map : { top: 60, left: 20, 'background-color': 'rgb(128, 255, 128)' }
        },
        {
          name : 'ペブルス',
          _id : 'id_03',
          css_map : { top: 100, left: 20, 'background-color': 'rgb(128, 192, 192)' }
        },
        {
          name : 'ウィルマ',
          _id : 'id_04',
          css_map : { top: 140, left: 20, 'background-color': 'rgb(192, 128, 128)' }
        }
      ];
      break;
    case 'client-page':
      peopleList = [
        {
          name : 'ビリー',
          _id : 'id_01',
          css_map : { top: 20, left: 20, 'background-color': 'rgb(128, 128, 128)' }
        },
      ];
      break;
    default:
      peopleList = [
        {
          name : '太郎',
          _id : 'id_01',
          css_map : { top: 20, left: 20, 'background-color': 'rgb(128, 128, 128)' }
        },
      ];
  }
  

  //==[ mockSio ]===========================================================
  mockSio = (function () {
    var on_sio, emit_sio, emit_mock_msg,
        send_listchange, listchange_idto,
        callback_map = {};

    //--[ on_sio ]-------------------------------------------------
    // フロントから受信
    //
    on_sio = function ( msg_type, callback ) {
      callback_map[ msg_type ] = callback;
    };

    //--[ emit_sio ]-----------------------------------------------
    // フロントへの送信
    //
    emit_sio = function ( msg_type, data ) {
      var person_map, i;

      // peopleList に ログインユーザーを加える
      if ( msg_type === 'adduser' && callback_map.userupdate ) {
        setTimeout( function () {
          person_map = {
            _id     : makeFakeId(),
            name    : data.name,
            css_map : data.css_map
          };
          peopleList.push( person_map );
          callback_map.userupdate( [person_map] );
          
          console.log('NOW fake.js emit_sio msg_type="adduser"');
          console.log(callback_map);
          
        }, 3000);
      }

      if ( msg_type === 'updatechat' && callback_map.updatechat ) {
        setTimeout( function () {
          var user = billiesChatcorner.model.people.get_user();
          callback_map.updatechat(
            [{
              dest_id   : user.id,
              dest_name : user.name,
              sender_id : data.dest_id,
              msg_text  : '発言ありがとうございます、 ' + user.name + ' さん。'
            }]
          );
        }, 2000);
      }

      if ( msg_type === 'leavechat' ) {
        // ログイン状態をリセットする
        delete callback_map.listchange;
        delete callback_map.updatechat;

        if ( listchange_idto ) {
          clearTimeout( listchange_idto );
          listchange_idto = undefined;
        }

        send_listchange();
      }

      if ( msg_type === 'updateavator' && callback_map.listchange ) {
        for ( i = 0; i < peopleList.length; i++) {
          if ( peopleList[ i ]._id === data.person_id ) {
            peopleList[ i ].css_map = data.css_map;
            break;
          }
        }

        callback_map.listchange( [ peopleList ] );
      }
    };

    //--[ emit_mock_msg ]-----------------------------------------
    //
    emit_mock_msg = function () {
      setTimeout( function () {
        var user = billiesChatcorner.model.people.get_user();

        if ( callback_map.updatechat ) {
          callback_map.updatechat(
            [{
              dest_id   : user.id,
              dest_name : user.name,
              sender_id : 'id_01',
              msg_text  : 'こんにちは ' + user.name + ' さん。ビリー です。'
            }]
          );
        }
        else { emit_mock_msg(); }
      }, 8000);
    };

    //--[ send_listchange ]------------------------------------------
    // もし callback_map.listchange が設定されていたら、それを実行。
    // 設定されていなくても、1秒後に実行。
    // つまり、この mock は、1秒間隔で send_listchange を実行している。
    //
    send_listchange = function () {
      listchange_idto = setTimeout( function () {
        if ( callback_map.listchange ) {
          callback_map.listchange([ peopleList ]);
          emit_mock_msg();
          listchange_idto = undefined;
        }
        else {
          send_listchange();
        }
      }, 1000);
    };

    // send_listchangeの実行をはじめる。
    send_listchange();

    return {
      emit : emit_sio,
      on   : on_sio
    };
  }());

  return {
    mockSio : mockSio
  };
}());

