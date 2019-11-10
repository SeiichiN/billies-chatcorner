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
  $testUrl = 'http://localhost:3000/js/question.js';
  $dataUrl = 'http://localhost:3000/js/billiesChatcorner.data.js';
  
  wp_enqueue_style('css-billies-chatcorner-admin', plugins_url('css/billiesChatcorner.admin.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-admin-shell', plugins_url('css/billiesChatcorner.admin.shell.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-admin-chat', plugins_url('css/billiesChatcorner.admin.chat.css', __FILE__));
  wp_enqueue_style('css-billies-chatcorner-admin-avtr', plugins_url('css/billiesChatcorner.admin.avtr.css', __FILE__));

  wp_enqueue_script('js-billies-chatcorner-socket', plugins_url('socket.io/socket.io.js', __FILE__), array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-taffy', plugins_url('js/jq/taffy.js', __FILE__), array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-gevent', plugins_url('js/jq/jquery.event.gevent.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-jq-event-ue', plugins_url('js/jq/jquery.event.ue.js', __FILE__), array('jquery'), false, false);

  // これはエラーが出る
  // クロスオリジン要求をブロックしました: 同一生成元ポリシーにより、http://loalhost:3000/socket.io/?EIO=3&transport=polling&t=MvNap4L にあるリモートリソースの読み込みは拒否されます (理由: CORS 要求が成功しなかった)。
  // wp_enqueue_script('js-billies-chatcorner-jq-socket', plugins_url('js/jq/sockets.io/socket.io.slim.js', __FILE__), array(), false, false);
  
  wp_enqueue_script('js-billies-chatcorner-admin', plugins_url('js/billiesChatcorner.admin.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-util', plugins_url('js/billiesChatcorner.util.js', __FILE__), array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-util_b', plugins_url('js/billiesChatcorner.util_b.js', __FILE__), array(), false, false);
  wp_enqueue_script('js-billies-chatcorner-data', plugins_url('js/billiesChatcorner.data.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-fake', plugins_url('js/billiesChatcorner.fake.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-model', plugins_url('js/billiesChatcorner.model.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-shell', plugins_url('js/billiesChatcorner.admin.shell.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-chat', plugins_url('js/billiesChatcorner.admin.chat.js', __FILE__), array('jquery'), false, false);
  wp_enqueue_script('js-billies-chatcorner-admin-avtr', plugins_url('js/billiesChatcorner.admin.avtr.js', __FILE__), array('jquery'), false, false);

  // wp_enqueue_script('js-billies-chatcorner-test', $testUrl, array(), false, true);
  // wp_enqueue_script('js-billies-chatcorner-data', $dataUrl, array('jquery'), false, false);
  
  // Kanri Page
  $billiesChatcorner_pageMode = ['mode' => 'admin-page'];
  wp_localize_script('js-billies-chatcorner-fake', 'billiesChatcorner_page_mode', $billiesChatcorner_pageMode);

  // $billiesChatcorner_dataJsUrl = ['data_js_url' => $dataJsUrl ];
  // wp_localize_script('js-billies-chatcorner-admin', 'data_js_url', $billiesChatcorner_dataJsUrl);
  // wp_localize_script('js-billies-chatcorner-model', 'data_js_url', $billiesChatcorner_dataJsUrl);

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


