// chat-corner.js
// by Seiichi Nukayama
// 2019.09.26
//

/*jslint          browser : true, continue : true,
  devel   : true, indent  : 2,    maxerr   : 50,
  newcap  : true, nomen   : true, plusplus : true,
  regexp  : true, sloppy  : true, vars     : true,
  white   : true
  */
/*global $, billiesChatcorner:true */

var billiesChatcorner = (function ($) {
  var configMap = {
	    extended_height: 300,
	    extended_title: 'チャットコーナー',
	    retracted_height: 20,
	    retracted_title: 'チャット開始',
	    template_html: '<div class="chat-corner"></div>'
  },
      
      $chatSlider,
      toggleSlider, onClickSlider,
      initModule;
  
  toggleSlider = function () {
	var	slider_height = $chatSlider.height();

	if ( slider_height === configMap.retracted_height ) {
	  $chatSlider
		.animate( { height : configMap.extended_height } )
		.attr( 'title', configMap.extended_title );
	  return true;
	}
	else if ( slider_height === configMap.extended_height ) {
	  $chatSlider
		.animate( { height : configMap.retracted_height } )
		.attr( 'title', configMap.retracted_title );
	  return true;
	}

	// 上の条件以外 = スライダーが移行中の場合
	return false;
  };

  onClickSlider = function (event) {
	toggleSlider();
	return false;
  };

  initModule = function ($container) {
	$container.html( configMap.template_html );

	$chatSlider = $container.find( '.chat-corner' );

	$chatSlider
	  .attr( 'title', configMap.retracted_title )
      .click( onClickSlider );

	return true;
  };

  return { initModule : initModule };

})(jQuery);

