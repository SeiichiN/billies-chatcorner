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
	  onTapNav, onHeldStartNav,
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
		top : perseInt( $target.css( 'top' ), 10 ),
		left : perseInt( $target.css( 'left' ), 10 ),
		'background-color' : $target.css( 'background-color' )
	  };
	  person_id = $target.attr( 'data-id' );

	  configMap.chat_model.update_avatar({
		person_id : person_id, css_map : css_map
	  });
	};

	//--[ onTapNav ]-----------------------------------------
	//
	onTapNav = funtion ( event ) {
	  var css_map,
		$target = $( event.elem_target ).closest( '.billiesChatcorner-avtr-box' );

	  if ( $target.length === 0)  { return false; }

	  $target.css({ 'background-color' : getRandRgb() });
	  updateAvatar( $target );
	};

	//--[ onHeldstartNav ]-------------------------------------
	//
	onHeldstargNav = function ( event ) {
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

  }());
});

