/*
* billiesChatcorner.model.js
* billiesChatcorner のモデルモジュール
*/

/*jslint          browser : true, continue : true,
 devel   : true, indent  : 2,    maxerr   : 50,
 newcap  : true, nomen   : true, plusplus : true,
 regexp  : true, sloppy  : true, vars     : true,
 white   : true
*/
/*global $, jQuery, billiesChatcorner, TAFFY, billiesChatcorner_page_mode */

jQuery( function ($) {
  billiesChatcorner.model = (function () {
    'use strict';
    
    //--[ プロパティ：設定値 ]---------------------------------------------
    // Personオブジェクト
    //   cid -- クライアントid。文字列。常に定義され、クライアントデータが
    //          バックエンドと同期していない場合のみid属性と異なる。
    //    id -- 一意のid。オブジェクトがバックエンドと同期していない場合、
    //          未定義になることがある。
    //
    var configMap = { anon_id : 'a0' },
	    stateMap = {
		  anon_user      : null,
		  cid_serial     : 0,
		  people_cid_map : {},
		  people_db      : TAFFY(),
		  user           : null,
		  is_connected   : false
	    },

	    isFakeData = true,

	    personProto, makePerson, people, chat, initModule,
	    makeCid, clearPeopleDb, completeLogin, removePerson
    ;

    //--[ personProto ]---------------------------------------
    //
    personProto = {
	  // オブジェクトが現在のuserである場合、true
	  get_is_user : function () {
	    return this.cid === stateMap.user.cid;
	  },
	  // オブジェクトが匿名userである場合、true
	  get_is_anon : function () {
	    return this.cid === stateMap.anon_user.cid;
	  }
    };

    //--[ makeCid ]--------------------------------------------
    //
    makeCid = function () {
	  return 'c' + String( stateMap.cid_serial++ );
    };

    //--[ clearPeopleDb ]--------------------------------------
    // stateMap.peope_db を初期化する
    // stateMap.people_cid_map を初期化する
    // 現在のユーザがあれば、そのユーザのみデータベースに加える。
    // 
    clearPeopleDb = function () {
	  var user = stateMap.user;
	  stateMap.people_db = TAFFY();
	  stateMap.people_cid_map = {};
	  if (user) {
	    stateMap.people_db.insert( user );
	    stateMap.people_cid_map[ user.cid ] = user;
	  }
    };

    //--[ completeLogin ]-----------------------------------
    // ログイン処理
    //   ログインしたら、stateMap.userを確定する。
    // @param:
    //   user_list -- Array
    //                [{ _id:--, css_map:{top:--,left:--,background-color:--} }]
    //
    completeLogin = function ( user_list ) {
	  var user_map = user_list[0];
	  
	  delete stateMap.people_cid_map[ user_map.cid ];
	  stateMap.user.cid = user_map._id;
	  stateMap.user.id = user_map._id;
	  stateMap.user.css_map = user_map.css_map;
	  stateMap.people_cid_map[ user_map._id ] = stateMap.user;

	  chat.join();                                              // <--- add

	  // チャットに参加するイベント発火
	  jQuery.gevent.publish( 'billiesChatcorner-login', [ stateMap.user ] );
    };

    //--[ makePerson ]-----------------------------------
    // @param:
    //   person_map -- { cid : ------ ,
    //                   id  : ------,
    //                   name : ------,
    //                   css_map : { top : ---, left : ---,
    //                              background-color : --- } }
    //
    makePerson = function ( person_map ) {
	  var person,
		  cid = person_map.cid,
		  css_map = person_map.css_map,
		  id = person_map.id,
		  name = person_map.name;

	  if ( cid === undefined || ! name ) {
	    throw 'client id and name required';
	  }

	  person = Object.create( personProto );

	  person.cid = cid;
	  person.name = name;
	  person.css_map = css_map;

	  if ( id ) { person.id = id; }

	  stateMap.people_cid_map[ cid ] = person;

	  stateMap.people_db.insert( person );
	  
	  return person;
    };

    //--[ removePerson ]------------------------------------
    // @param:
    //   person -- このpersonを削除する。
    //             つまり、person.cidをもつデータを削除する。
    //
    removePerson = function (person) {
	  if ( ! person ) { return false; }

	  // 'a0'は削除できない
	  if ( person.id === configMap.anon_id ) {
	    return false;
	  }

	  // cidが person.cid であるデータを削除
	  stateMap.people_db({ cid : person.cid }).remove();

      if ( person.cid ) {
	    delete stateMap.people_cid_map[ person.cid ];
	  }
	  return true;
    };

    //--[ people ]---------------------------------------------
    // get_db() -- TAFFY()
    // get_cid_map() -- { top:--, left:--, background-color:-- }
    //
    people = (function () {
	  var get_by_cid, get_db, get_user, login, logout, is_removed;

	  get_by_cid = function ( cid ) {
	    return stateMap.people_cid_map[ cid ];
	  };
	  
	  get_db = function () { return stateMap.people_db; };

	  get_user = function () { return stateMap.user; };

	  login = function ( name ) {
	    var sio = isFakeData
			    ? billiesChatcorner.fake.mockSio
			    : billiesChatcorner.data.getSio();

	    stateMap.user = makePerson({
		  cid     : makeCid(),
		  css_map : { top: 25, left: 25, 'background-color': '#8f8' },
		  name    : name
	    });

	    // 'userupdate'に completeLogin をひもづける 
	    sio.on( 'userupdate', completeLogin );

	    // 'adduser' を発行
	    sio.emit( 'adduser', {
		  cid     : stateMap.user.cid,
		  css_map : stateMap.user.css_map,
		  name    : stateMap.user.name
	    });
	  };

	  logout = function () {
	    var user = stateMap.user,
            sio = isFakeData
                ? billiesChatcorner.fake.mockSio
                : billiesChatcorner.data.getSio();

	    chat._leave();                                  // <--- add

	    // @param  -- user -- [{  }]
	    // @return -- true
	    is_removed = removePerson( user );

	    stateMap.user = stateMap.anon_user;

	    clearPeopleDb();
        
        sio.emit('listchange');

        // $acct の表示を「ログイン」に変える
	    jQuery.gevent.publish( 'billiesChatcorner-logout', [ user ] );

	    if ( billiesChatcorner_page_mode.mode === 'admin-page' ) {
		  jQuery.gevent.publish( 'billiesChatcorner-chatLogout', [ user ] );
	    }
      };

      return {
        get_by_cid : get_by_cid,
        get_db     : get_db,
        get_user   : get_user,
        login      : login,
        logout     : logout
      };
    }());   // people

    //--[ chat ]------------------------------------------------------
    // chatオブジェクトAPI
    // -------------------
    // public method
    //   * join() -- チャットルームに参加する。
    //       グローバルカスタムイベント listchange, updatechat
    //       バックエンドとのプロトコルの確立。
    //       anon_user の場合は、false を返す。
    //   * get_chatee() -- ユーザがチャットしている相手の person オブジェクト
    //       を返す。
    //   * set_chatee( <person_id> ) -- チャット相手を設定する。
    //       person_id がリストに存在しない場合は、null を返す。
    //       グローバルカスタムイベント setchatee を発行。
    //   * send_msg( <msg_text> ) -- チャット相手にメセジを送信。
    //       グローバルカスタムイベント updatechat を発行。
    //       anon_user, 相手がnull ならば、false を返す。
    //   * update_avatar( <update_avtr_map> ) -- バックエンドに
    //       update_avtr_map を送信する。これにより更新されたユーザリスト
    //       とアバター情報を含む listchange イベントを発行。
    //       update_avtr_map 形式 -- {person_id : person_id, css_map : css_map }
    //
    // このオブジェクトが発行するグローバルカスタムイベント
    //   * billiesChatcorner-setchatee -- 新しいチャット相手が設定されたときに
    //       発行される。
    //       { old_chatee : <old_chatee_person_object>,
    //         new_chatee : <new_chatee_person_object> }
    //   * billiesChatcorner-listchange -- ユーザがチャットに参加、退出したとき
    //       内容が変わったとき（アバター詳細が変わったとき）に発行される。
    //   * billiesChatcorner-updatechat -- 新しいメッセージを送受信したとき。
    //       以下の内容をデータとして提供。
    //       { dest_id   : <chatee_id>
    //         dest_name : <chatee_name>
    //         sender_id : <sender_id>
    //         msg_text  : <message_content> }
    //
    chat = (function () {
      var _publish_listchange,
          _publish_updatechat,                                // <== add
          _update_list,
          _leave_chat,
          
          join_chat,
          get_chatee, send_msg, set_chatee,                    // <-- add
          update_avator,

          chatee = null       // <-- add ... ユーザがチャットしている相手   
      ;

      //--[ _update_list ]-----------------------------------
      // @param:
      //   arg_list -- 0 [ 0: {name: "Betty",   _id: "id_01", css_map: {...}},
      //                   1: {name: "Mike",    _id: "id_02", css_map: {...}},
      //                   2: {name: "Pebbles", _id: "id_03", css_map: {...}},
      //                   3: {name: "Wilma",   _id: "id_04", css_map: {...}},
      //                   4: {name: "Sayuri",  _id: "id_05", css_map: {...}}]
      //
      _update_list = function( arg_list ) {
        var i, person_map, make_person_map, person,
            people_list = arg_list[ 0 ],
            is_chatee_online = false;                         // <-- add

        clearPeopleDb();

        PERSON:
                               for (i = 0; i < people_list.length; i++) {
                                 person_map = people_list[ i ];

                                 if (! person_map.name) { continue PERSON; }

                                 // ユーザがリストにあれば、css_map を更新して残りをとばす
                                 if ( stateMap.user &&
                                      stateMap.user.id === person_map._id ) {
                                   stateMap.user.css_map = person_map.css_map;
                                   continue PERSON;
                                 }

                                 make_person_map = {
                                   cid     : person_map._id,
                                   css_map : person_map.css_map,
                                   id      : person_map._id,
                                   name    : person_map.name
                                 };

                                 // この記述は、いつ紛れ込んだんだろう？
                                 // person = makePerson( make_person_map );

                                 //                                   V-- add
                                 if ( chatee && chatee.id === make_person_map.id ) {
                                   is_chatee_online = true;
                                   chatee = person;
                                 }

                                 makePerson( make_person_map );
                               }

        stateMap.people_db.sort( 'name' );
        //                                                      V-- add
        // チャット相手がオンラインなら、チャット相手を解除。
        if ( chatee && ! is_chatee_online ) { set_chatee(''); }
      };

      //--[ _publish_listchange ]----------------------------
      // @param: arg_list -- [0, [0, { _id, css_map, name }],
      //                         [1, { _id, css_map, name }],
      //                         ...                        ,
      //                         [5, { _id, css_map, name }] ]
      //
      _publish_listchange = function ( arg_list ) {
        _update_list( arg_list );

        // 表示されているリストを更新する
        jQuery.gevent.publish( 'billiesChatcorner-listchange', [ arg_list ] );
      };

      //--[ _publish_updatechat ]----------------------------  V-- add
      // sender_id と 現在のチャット相手が違ったら、
      // sender_id を 現在のチャット相手とする。
      //
      // @param:
      //   arg_list -- [ 0: { dest_id  : "id_5",
      //                      dest_name: "Sayuri",
      //                      msg_text : "Hi there Sayuri! Billie here.",
      //                      sender_id: "id_01"                          } ]
      //
      _publish_updatechat = function ( arg_list ) {
        var msg_map = arg_list[ 0 ];

        if ( ! chatee ) { set_chatee( msg_map.sender_id ); }
        else if ( msg_map.sender_id !== stateMap.user.id
               && msg_map.sender_id !== chatee.id ) {
          set_chatee( msg_map.sender_id );
        }

        jQuery.gevent.publish( 'billiesChatcorner-updatechat', [ msg_map ] );
      };

      //--[ _leave_chat ]------------------------------------
      //
      _leave_chat = function () {
        var sio = isFakeData
                ? billiesChatcorner.fake.mockSio
                : billiesChatcorner.data.getSio();

        stateMap.is_connected = false;

        if ( sio ) { sio.emit( 'leavechat' ); }
      };

      //--[ get_chatee ]------------------------------------  V-- add
      // 現在のチャット相手を返す
      //
      get_chatee = function () { return chatee; };
      
      //--[ join_chat ]-------------------------------------
      //
      join_chat = function () {
        var sio;

        if ( stateMap.is_connected ) { return false; }

        if ( stateMap.user.get_is_anon() ) {
          console.warn( 'User must be defined before joining chat' );
          return false;
        }

        sio = isFakeData
            ? billiesChatcorner.fake.mockSio
            : billiesChatcorner.data.getSio();
        // イベント待受 -- listchange が来れば、
        // _publish_listchange を実行
        sio.on( 'listchange', _publish_listchange );
        sio.on( 'updatechat', _publish_updatechat );          // <-- add
        stateMap.is_connected = true;
        return true;
      };

      //--[ send_msg ]---------------------------------------- V-- add
      //
      send_msg = function ( msg_text ) {
        var msg_map,
            sio = isFakeData
                ? billiesChatcorner.fake.mockSio
                : billiesChatcorner.data.getSio();

        if ( ! sio ) { return false; }   // 接続できていない場合
        // チャット相手が設定されていない場合
        if ( ! ( stateMap.user && chatee ) ) { return false; }

        msg_map = {
          dest_id   : chatee.id,
          dest_name : chatee.name,
          sender_id : stateMap.user.id,
          msg_text  : msg_text
        };
        
        _publish_updatechat( [ msg_map ] );
        sio.emit( 'updatechat', msg_map );
        return true;
      };

      //--[ set_chatee ]---------------------------------------- V-- add
      //
      set_chatee = function ( person_id ) {
        var new_chatee;

        new_chatee = stateMap.people_cid_map[ person_id ];
        if ( new_chatee ) {
          if ( chatee && chatee.id === new_chatee.id ) {
            return false;
          }
        }
        else {
          new_chatee = null;
        }

        jQuery.gevent.publish(
          'billiesChatcorner-setchatee',
          { old_chatee : chatee, new_chatee : new_chatee }
        );
        chatee = new_chatee;
        return true;
      };
      
      //--[ update_avator ]-------------------------------------
      // @param:
      //   avator_upate_map
      //     { person_id : <string>,
      //       css_map   : { top                : <int>,
      //                     left               : <int>,
      //                     'background-color' : <string> }}
      //
      update_avator = function ( avator_update_map ) {
        var sio = isFakeData
                ? billiesChatcorner.fake.mockSio
                : billiesChatcorner.data.getSio();

        if ( sio ) {
          sio.emit( 'updateavator', avator_update_map );
        }
      };
      
      return {
        _leave        : _leave_chat,
        join          : join_chat,
        get_chatee    : get_chatee,                             // <-- add
        send_msg      : send_msg,                               // <-- add
        set_chatee    : set_chatee,                             // <-- add
        update_avator : update_avator
      };
    }());

    
    initModule = function () {
      var i, people_list, person_map;

      // anonymous-user initialize
      stateMap.anon_user = makePerson ({
        cid : configMap.anon_id,
        id  : configMap.anon_id,
        name : 'anonymous'
      });
      stateMap.user = stateMap.anon_user;

    };
    
    return {
      initModule : initModule,
      people     : people,
      chat       : chat
    };
  }());  // billiesChatcorner.admin.model
});  // jQuery
