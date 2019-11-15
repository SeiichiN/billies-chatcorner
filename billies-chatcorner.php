<?php
/*
 * @wordpress-plugin
 * Plugin Name: Billies Chatcorner
 * Description: Chat Corner added.
 * Version: 0.1
 * Author: Seiichi Nukayama
 * URL: http://www.billies-works.com/
 */

require_once('billies-chatcorner-admin.php');

function billies_chatcorner_add_files () {
  $socketLocal = 'http://localhost:3000/socket.io/socket.io.js';
  $socketHeroku = 'http://billieschatcorner.herokuapp.com/socket.io/socket.io.js';
  
  wp_enqueue_style('css-billies-chatcorner-chat', plugins_url('css/billiesChatcorner.chat.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-shell', plugins_url('css/billiesChatcorner.shell.css', __FILE__));
  
  wp_enqueue_script('js-billies-chatcorner-socket', $socketHeroku, array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-taffy',     plugins_url('js/jq/taffy.js', __FILE__), array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-uriAnchor', plugins_url('js/jq/jquery.uriAnchor.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-gevent',    plugins_url('js/jq/jquery.event.gevent.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-event-ue',  plugins_url('js/jq/jquery.event.ue.js', __FILE__), array('jquery'), false, false);
  
  wp_enqueue_script('js-billies-chatcorner', plugins_url('js/billiesChatcorner.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-util', plugins_url('js/billiesChatcorner.util.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-data', plugins_url('js/billiesChatcorner.data.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-fake', plugins_url('js/billiesChatcorner.fake.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-model', plugins_url('js/billiesChatcorner.model.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-util_b', plugins_url('js/billiesChatcorner.util_b.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-shell', plugins_url('js/billiesChatcorner.shell.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-chat', plugins_url('js/billiesChatcorner.chat.js', __FILE__), array('jquery'), false, false);

  // Client Page
  $billiesChatcorner_pageMode = ['mode' => 'client-page'];
  wp_localize_script('js-billies-chatcorner-fake', 'billiesChatcorner_page_mode', $billiesChatcorner_pageMode);
  
  wp_enqueue_script('js-billies-chatcorner-start', plugins_url('js/billiesChatcorner.start.js', __FILE__), array('jquery'), false, true);
  // wp_enqueue_script('js-gevent-test', plugins_url('js/gevent.test.js', __FILE__), array('jquery'), false, true);
}
add_action('wp_enqueue_scripts', 'billies_chatcorner_add_files');


