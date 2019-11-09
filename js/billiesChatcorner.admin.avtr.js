/*
 * billiesChatcorner.admin.avtr.js
 * アバター機能モジュール
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, jQuery, billiesChatcorner */


jQuery( function ($) {
  billiesChatcorner.admin.avtr = (function () {
	'use strict';

	//--[ モジュールスコープ変数 ]---------------
	var configMap = {
	  chat_model : null,
	  people_model : null,

	  settable_map : {
		chat_model : true,
		people_model : true
	  }
	},

	  stateMap = {
		drag_map : null,
		$drag_target : null,
		drag_bg_color : undefined
	  },

	  jqueryMap = {},

	  getRandRgb,
	  setJqueryMap,
	  updateAvatar,
	  onTapNav, onHeldstartNav,
	  onHeldmoveNav, onHeldendNav,
	  onSetchatee, onListchange,
	  onLogou,
	  configModule, initModule;

	//--[ ユーティリティメソッド ]---------------
	//
	//--[ getRandRgb ]-------------------------------
	//
	getRandRgb = function () {
	  var i, rgb_list = [];

	  for ( i = 0; i < 3; i++ ) {
		rgb_list.push( Math.floor( Math.random() * 128 ) + 128 );
	  }
	  return 'rgb(' + rgb_list.join(',') + ')';
	};

	//--[ setJqueryMap ]--------------------------------------
	//
	setJqueryMap = function ( $container ) {
	  jqueryMap = { $container : $container };
	};

	//--[ updateAvatar ]--------------------------------------
	//
	updateAvatar = function ( $target ) {
	  var css_map, person_id;

	  css_map = {
		top : parseInt( $target.css( 'top' ), 10 ),
		left : parseInt( $target.css( 'left' ), 10 ),
		'background-color' : $target.css( 'background-color' )
	  };
	  person_id = $target.attr( 'data-id' );

      // console.log(configMap.chat_model);
      
	  configMap.chat_model.update_avatar({
		person_id : person_id, css_map : css_map
	  });
	};

	//--[ onTapNav ]-----------------------------------------
	//
	onTapNav = function ( event ) {
	  var css_map,
		$target = $( event.elem_target ).closest( '.billiesChatcorner-avtr-box' );

	  if ( $target.length === 0)  { return false; }

	  $target.css({ 'background-color' : getRandRgb() });
	  updateAvatar( $target );
	};

	//--[ onHeldstartNav ]-------------------------------------
	//
	onHeldstartNav = function ( event ) {
	  var offset_target_map, offset_nav_map,
		$target = $( event.elem_target ).closest( '.billiesChatcorner-avtr-box' );

	  if ( $target.length === 0 ) { return false; }

	  stateMap.$drag_target = $target;
	  offset_target_map = $target.offset();
	  offset_nav_map = jqueryMap.$container.offset();

	  offset_target_map.top -= offset_nav_map.top;
	  offset_target_map.left -= offset_nav_map.left;

	  stateMap.drag_map = offset_target_map;
	  stateMap.drag_bg_color = $target.css( 'background-color' );

	  $target.addClass( 'billiesChatcorner-x-is-drag')
		.css( 'background-color', '' );
	};

    //--[ onHeldmoveNav ]-----------------------------------------
    //
    onHeldmoveNav = function ( event ) {
      var drag_map = stateMap.drag_map;

      if ( ! drag_map ) { return false; }

      // event.px_delta_y -- jquery.event.ue
      // https://github.com/mmikowski/jquery.event.ue
      drag_map.top += event.px_delta_y;
      drag_map.left += event.px_delta_x;

      stateMap.$drag_target.css ({
        top  : drag_map.top,
        left : drag_map.left
      });
    };

    //--[ onHeldendNav ]----------------------------------------
    //
    onHeldendNav = function ( event ) {
      var $drag_target = stateMap.$drag_target;

      if ( ! $drag_target ) { return false; }

      $drag_target
        .removeClass( 'billiesChatcorner-x-is-drag' )
        .css( 'background-color', stateMap.drag_bg_color );

      stateMap.drag_bg_color = undefined;
      stateMap.$drag_target = null;
      stateMap.drag_map = null;
      updateAvatar( $drag_target );
    };

    //--[ onSetchatee ]------------------------------------------
    //
    onSetchatee = function ( event, arg_map ) {
      var $nav = $(this),
          new_chatee = arg_map.new_chatee,
          old_chatee = arg_map.old_chatee;

      // アバターの強調表示
      // new_chatee.name, old_chatee.name 参照。
      // old_chatee アバターの強調表示を削除
      if ( old_chatee ) {
        $nav
          .find( 'billiesChatcorner-avtr-box[data-id=' + old_chatee.cid + ']' )
          .removeClass( 'billiesChatcorner-x-is-chatee' );
      }

      // new_chatee アバターに強調表示
      if ( new_chatee ) {
        $nav
          .find( 'billiesChatcorner-avtr-box[data-id=' + new_chatee.cid + ']' )
          .addClass( 'billiesChatcorner-x-is-chatee' );
      }
    };

    //--[ onListchange ]----------------------------------------
    //
    onListchange = function ( event ) {
      var $nav = jQuery(this),
          people_db = configMap.people_model.get_db(),
          user = configMap.people_model.get_user(),
          chatee = configMap.chat_model.get_chatee() || {},
          $box;

      $nav.empty();
      // ユーザーがログアウトしていたら描画しない
      if ( user.get_is_anon() ) { return false; }

      people_db().each( function ( person, idx ) {
        var class_list;

        if ( person.get_is_anon() ) { return true; }
        class_list = [ 'billiesChatcorner-avtr-box' ];

        if ( person.id === chatee.id ) {
          class_list.push( 'billiesChatcorner-x-is-chatee' );
        }
        if ( person.get_is_user() ) {
          class_list.push( 'billiesChatcorner-x-is-user' );
        }

        $box = jQuery('<div>')
          .addClass( class_list.join(' '))
          .css( person.css_map )
          .attr( 'data-id', String( person.id ) )
          .prop( 'title', billiesChatcorner.util_b.encodeHtml( person.name ))
          .text( person.name )
          .appendTo( $nav );
      });
    };

    //--[ onLogout ]------------------------------------------
    //
    onLogout = function () {
      jqueryMap.$container.empty();
    };

    //--[ configModule ]--------------------------------------
    //
    configModule = function ( input_map ) {
      billiesChatcorner.util.setConfigMap({
        input_map    : input_map,
        settable_map : configMap.settable_map,
        config_map   : configMap
      });
      return true;
    };

    //--[ initModule ]---------------------------------------
    //
    initModule = function ( $container ) {
      setJqueryMap( $container );

      console.log( $container );
      
      jQuery.gevent.subscribe( $container, 'billiesChatcorner-setchatee', onSetchatee );
      jQuery.gevent.subscribe( $container, 'billiesChatcorner-listchange', onListchange );
      jQuery.gevent.subscribe( $container, 'billiesChatcorner-logout', onLogout );

      $container
        .bind( 'utap', onTapNav )
        .bind( 'uheldstart', onHeldstartNav )
        .bind( 'uheldmove', onHeldmoveNav )
        .bind( 'uheldend', onHeldendNav);

      return true;
    };

    //--[ return ]---------------------------------------------
    //
    return {
      configModule : configModule,
      initModule   : initModule
    };
  }());
});

