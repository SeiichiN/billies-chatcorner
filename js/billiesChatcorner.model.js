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
/*global jQuery, $, billiesChatcorner */

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
          user           : null
        },

        isFakeData = true,

        personProto, makePerson, people, initModule,
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
        console.log( user );
        stateMap.people_db.insert( user );
        stateMap.people_cid_map[ user.cid ] = user;
      }
    };

    //--[ completeLogin ]-----------------------------------
    // @param:
    //   user_list -- Array
    //                [{ _id:--, css_map:{top:--,left:--,background-color:--} }]
    //
    completeLogin = function ( user_list ) {
      var user_map = user_list[0];
      delete stateMap.people_cid_map[ user_map.cid ];
      stateMap.user.cid = user_map._id;
      stateMap.user.id = user_map._id;
//      stateMap.user.css_map = user_map.css_map;
      stateMap.people_cid_map[ user_map._id ] = stateMap.user;

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
//          css_map = person_map.css_map,
          id = person_map.id,
          name = person_map.name;

      if ( cid === undefined || ! name ) {
        throw 'client id and name required';
      }

      person = Object.create( personProto );

      person.cid = cid;
      person.name = name;
//      person.css_map = css_map;

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
      var get_by_cid, get_db, get_user, login, logout;

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
//          css_map : { top: 25, left: 25, 'background-color': '#8f8' },
          name    : name
        });

        sio.on( 'userupdate', completeLogin );

        sio.emit( 'adduser', {
          cid     : stateMap.user.cid,
//          css_map : stateMap.user.css_map,
          name    : stateMap.user.name
        });
      };

      logout = function () {
        var is_removed,
            user = stateMap.user;

        // @param  -- user -- [{  }]
        // @return -- true
        is_removed = removePerson( user );
        stateMap.user = stateMap.anon_user;

        jQuery.gevent.publish( 'billiesChatcorner-logout', [ user ] );
        return is_removed;
      };

      return {
        get_by_cid : get_by_cid,
        get_db     : get_db,
        get_user   : get_user,
        login      : login,
        logout     : logout
      };
    }());   // people

    initModule = function () {
      var i, people_list, person_map;

      // anonymous-user initialize
      stateMap.anon_user = makePerson ({
        cid : configMap.anon_id,
        id  : configMap.anon_id,
        name : 'anonymous'
      });
      stateMap.user = stateMap.anon_user;

      if ( isFakeData ) {
        people_list = billiesChatcorner.fake.getPeopleList();

        for ( i = 0; i < people_list.length; i++ ) {
          person_map = people_list[ i ];
          makePerson({
            cid     : person_map._id,
            id      : person_map._id,
            name    : person_map.name
          });
        }
      }
    };
    
    return {
      initModule : initModule,
      people     : people,
    };
  }());
});
