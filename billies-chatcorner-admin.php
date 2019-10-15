<?php


function billiesChatcorner_admin_menu () {
  add_options_page (
    'billies Chatcorner 管理者ページ',   // 管理ページのタイトル
    'Billies Chat C.',                      // 管理メニュー名
    'manage_options',                    // 管理ページのコンテンツを表示するのに必要な権限
    'billies-chatcorner-admin.php',      // 管理ページのコンテンツを表示するphpファイル
    'billiesChatcorner_admin_page'        // 管理ページのコンテンツを表示する関数
  );
}
add_action('admin_menu', 'billiesChatcorner_admin_menu');


function billies_chatcorner_admin_add_files () {
  wp_enqueue_style('css-billies-chatcorner-shell', plugins_url('admin-css/billiesChatcornerAdmin.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-admin-chat', plugins_url('admin-css/billiesChatcornerAdmin.chat.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-admin-shell', plugins_url('admin-css/billiesChatcornerAdmin.shell.css', __FILE__));

  wp_enqueue_script('js-billies-chatcorner-admin', plugins_url('admin-js/billiesChatcornerAdmin.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-util', plugins_url('admin-js/billiesChatcornerAdmin.util.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-model', plugins_url('admin-js/billiesChatcornerAdmin.model.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-shell', plugins_url('admin-js/billiesChatcornerAdmin.shell.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-chat', plugins_url('admin-js/billiesChatcornerAdmin.chat.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-start', plugins_url('admin-js/billiesChatcornerAdmin.start.js', __FILE__), array('jquery'), false, true);
}
add_action(
  'settings_page_billies-chatcorner-admin', 'billies_chatcorner_admin_add_files'
);


function billiesChatcorner_admin_page () {
?>

  <div id="billiesChatcorner-admin-wrap">
    <h1>Billies Chatcorner 管理者ページ</h1>

  </div>
  
<?php
}


