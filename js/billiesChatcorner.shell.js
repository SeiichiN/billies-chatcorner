/*
 * billiesChatcorner.shell.js
 * billiesChatcorner のシェルモジュール
 */

/*jslint          browser : true, continue : true,
  devel   : true, indent  : 2,    maxerr   : 50,
  newcap  : true, nomen   : true, plusplus : true,
  regexp  : true, sloppy  : true, vars     : true,
  white   : true
  */
/*global $, billiesChatcorner */

billiesChatcorner.shell = (function () {
	var
	configMap = {
		main_html : String()
	},
		stateMap = { $container : null },
		jqueryMap = {},

		setJqueryMap, initModule;

	setJqueryMap = function () {
		var $container = stateMap.$container;
		jqueryMap = { $container : $container };
	};

	initModule = function ( $container ) {
		stateMap.$container = $container;
		$container.html( configMap.main_html );
		setJqueryMap();
	};

	return { initModule : initModule };
}());
