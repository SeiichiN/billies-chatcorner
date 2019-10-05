<?php
/*
 * @wordpress-plugin
 * Plugin Name: Billies Chatcorner
 * Description: Chat Corner added.
 * Version: 0.1
 * Author: Seiichi Nukayama
 * URL: http://www.billies-works.com/
 */

function billies_chatcorner_add_files () {
  wp_enqueue_style('css-billies-chatcorner', plugins_url('css/billiesChatcorner.shell.css', __FILE__));
  wp_enqueue_script('js-uriAnchor', plugins_url('js/jq/jquery.uriAnchor.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner', plugins_url('js/billiesChatcorner.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-shell', plugins_url('js/billiesChatcorner.shell.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-start', plugins_url('js/billiesChatcorner.start.js', __FILE__), array('jquery'), false, true);
}
add_action('wp_enqueue_scripts', 'billies_chatcorner_add_files');
