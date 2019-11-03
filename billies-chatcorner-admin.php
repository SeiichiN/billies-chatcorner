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
  wp_enqueue_style('css-billies-chatcorner-admin', plugins_url('css/billiesChatcorner.admin.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-admin-shell', plugins_url('css/billiesChatcorner.admin.shell.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-admin-chat', plugins_url('css/billiesChatcorner.admin.chat.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-admin-avtr', plugins_url('css/billiesChatcorner.admin.avtr.css', __FILE__));

  wp_enqueue_script('js-billies-chatcorner-jq-taffy', plugins_url('js/jq/taffy.js', __FILE__), array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-gevent', plugins_url('js/jq/jquery.event.gevent.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-event-ue', plugins_url('js/jq/jquery.event.ue.js', __FILE__), array('jquery'), false, false);
  
  wp_enqueue_script('js-billies-chatcorner-admin', plugins_url('js/billiesChatcorner.admin.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-util', plugins_url('js/billiesChatcorner.util.js', __FILE__), array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-util_b', plugins_url('js/billiesChatcorner.util_b.js', __FILE__), array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-fake', plugins_url('js/billiesChatcorner.fake.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-model', plugins_url('js/billiesChatcorner.model.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-shell', plugins_url('js/billiesChatcorner.admin.shell.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-chat', plugins_url('js/billiesChatcorner.admin.chat.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-avtr', plugins_url('js/billiesChatcorner.admin.avtr.js', __FILE__), array('jquery'), false, false);

  // Kanri Page
  $pageMode = ['mode' => 'admin-page'];
  wp_localize_script('js-billies-chatcorner-fake', 'billiesChatcorner_page_mode', $pageMode);

  wp_enqueue_script('js-billies-chatcorner-admin-start', plugins_url('js/billiesChatcorner.admin.start.js', __FILE__), array('jquery'), false, true);
}
add_action(
  'settings_page_billies-chatcorner-admin', 'billies_chatcorner_admin_add_files'
);


function billiesChatcorner_admin_page () {
?>

  <div id="billiesChatcorner-admin-wrap">
<!--    <h1>Billies Chatcorner 管理者ページ</h1>  -->

  </div>
  
<?php
}


