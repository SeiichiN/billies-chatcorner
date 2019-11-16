/*
 * billiesChatcorner.admin.chat.js
 * billiesChatcorner.admin のチャットモジュール
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, jQuery, billiesChatcorner */

jQuery( function ($) {
  billiesChatcorner.admin.chat = (function () {
    'use strict';
    
    //--[ プロパティ：設定値 ]---------------------------------------------
    var configMap = {
      main_html : String()
                + '<div class="billiesChatcorner-admin-chat">'
                  + '<div class="billiesChatcorner-admin-chat-head">'
//                  + '<div class="billiesChatcorner-admin-chat-head-toggle">+</div>'
                    + '<div class="billiesChatcorner-admin-chat-head-title"></div>'
                  + '</div>'
//                + '<div class="billiesChatcorner-admin-chat-closer">X</div>'
                  + '<div class="billiesChatcorner-admin-chat-sizer">'
                    + '<div class="billiesChatcorner-admin-chat-list">'
                      + '<div class="billiesChatcorner-admin-chat-list-box"></div>'
                    + '</div>'
                    + '<div class="billiesChatcorner-admin-chat-msg">'
                      + '<div class="billiesChatcorner-admin-chat-msg-log"></div>'
                      + '<div class="billiesChatcorner-admin-chat-msg-in">'
                        + '<form class="billiesChatcorner-admin-chat-msg-form">'
                          + '<input type="text">'
                          + '<input type="submit" style="display:none">'
                            + '<div class="billiesChatcorner-admin-chat-msg-send">発言</div>'
                        + '</form>'
                      + '</div>'   // .billiesChatcorner-admin-chat-msg-in
                    + '</div>'   // .billiesChatcorner-admin-chat-msg
                  + '</div>'  // ,billiesChatcorner-admin-chat-sizer
                + '</div>'  // .billiesChatcorner-admin-chat
      ,
      settable_map : {
        chat_head_title : true,
        chat_model : true,
        people_model : true
      },
      chatArea_title : 'CHAT',
      
      chat_model : null,
      people_model : null
    },
        
        stateMap = {
          $append_target : null,
          px_per_em : 0
        },
        jqueryMap = {},

        setJqueryMap, configModule, setPxSizes, initModule,
        scrollChat, writeChat, writeAlert, clearChat,
        onSubmitMsg, onListchange, onSetchatee, onAdminUpdatechat,
        onTapList, onChatLogin, onChatLogout
    ;


    //--[ setJqueryMap ]--------------------------------------------------
    setJqueryMap = function () {
      var $append_target = stateMap.$append_target,
          $chatArea = $append_target.find('.billiesChatcorner-admin-chat');
      
      jqueryMap = {
        $chatArea   : $chatArea,
        $head_a     : $chatArea.find( '.billiesChatcorner-admin-chat-head' ),
        $title_a    : $chatArea.find( '.billiesChatcorner-admin-chat-head-title' ),
        $sizer_a    : $chatArea.find( '.billiesChatcorner-admin-chat-sizer' ),
        $list_box_a : $chatArea.find( '.billiesChatcorner-admin-chat-list-box' ),
        $msg_a      : $chatArea.find( '.billiesChatcorner-admin-chat-msg' ),
        $msg_log_a  : $chatArea.find( '.billiesChatcorner-admin-chat-msg-log' ),
        $msg_in_a   : $chatArea.find( '.billiesChatcorner-admin-chat-msg-in'),
        $input_a    : $chatArea.find( '.billiesChatcorner-admin-chat-msg-in input[type="text"]' ),
        $send_a     : $chatArea.find( '.billiesChatcorner-admin-chat-msg-send' ),
        $form_a     : $chatArea.find( '.billiesChatcorner-admin-chat-msg-form' ),
        $window     : jQuery(window)
      };      
    };

    //--[ setPxSizes ]---------------------------------------------------
    setPxSizes = function () {
      var px_per_em, window_height_em;

      px_per_em = billiesChatcorner.util_b.getEmSize( jqueryMap.$chatArea.get(0) );
      window_height_em = Math.floor(
        ( jqueryMap.$window.height() / px_per_em ) + 0.5
      );
    };

    //--[ scrollChat ]---------------------------------------------------
    // メッセージログをスクロール
    //
    scrollChat = function () {
      var $msg_log = jqueryMap.$msg_log_a;

      $msg_log.animate(
        { scrollTop : $msg_log.prop( 'scrollHeight' ) - $msg_log.height() },
        150
      );
    };

    //--[ writeChat ]----------------------------------------------------
    // ログ領域にチャット文字列を表示する
    // @param:
    //   person_name -- チャット相手の名前
    //   text        -- チャット文字列
    //   is_user     -- 自分の発言かどうか true/false
    //
    writeChat = function ( person_name, text, is_user ) {
      var msg_class = is_user
                    ? 'billiesChatcorner-admin-chat-msg-log-me'
                    : 'billiesChatcorner-admin-chat-msg-log-msg';

      jqueryMap.$msg_log_a.append(
        '<div class="' + msg_class + '">'
        + '<span class="' + msg_class + '-name">'
        + billiesChatcorner.util_b.encodeHtml(person_name) + ':'
        + '</span>'
        + '<span class="' + msg_class + '-body">'
        + billiesChatcorner.util_b.encodeHtml(text)
        + '</span>'
        + '</div>'
      );

      scrollChat();
    };

    //--[ writeAlert ]--------------------------------------------------
    // 発言以外の出力を表示する
    //
    writeAlert = function ( alert_text ) {
      jqueryMap.$msg_log_a.append(
        '<div class="billiesChatcorner-admin-chat-msg-log-alert">'
        + billiesChatcorner.util_b.encodeHtml( alert_text )
        + '</div>'
      );
      scrollChat();
    };

    //--[ clearChat ]---------------------------------------------------
    // ログ領域を初期化する
    //
    clearChat = function () {
      jqueryMap.$msg_log_a.empty();
    };

    //--[ onSubmitMsg ]------------------------------------------------
    //
    onSubmitMsg = function ( event ) {
      var msg_text = jqueryMap.$input_a.val();

      if ( msg_text.trim() === '' ) { return false; }

      configMap.chat_model.send_msg( msg_text );
      jqueryMap.$input_a.focus();
      jqueryMap.$send_a.addClass( 'billiesChatcorner-x-select' );
      setTimeout(
        function () { jqueryMap.$send_a.removeClass('billiesChatcorner-x-select' );},
        250
      );
      return false;
    };

    //--[ onListchange ]--------------------------------------------------
    //
    onListchange = function ( event ) {
      var list_html = String(),
          people_db = configMap.people_model.get_db(),
          chatee = configMap.chat_model.get_chatee();

      console.log('NOW onListchange!');
      
      people_db().each( function ( person, idx ) {
        var select_class = '';

        // if ( person.get_is_anon() || person.get_is_user() ) { return true; }
        if ( person.get_is_anon() ) {
          if ( people_db().count() === 1) {
            list_html = String()
                      + '<div class="billiesChatcorner-admin-chat-list-note">'
                      + '誰もいない'
                      + '</div>';
            clearChat();
          }
          else {
            list_html = String()
                      + '<div class="billiesChatcorner-admin-chat-list-note">'
                      + '管理人不在'
                      + '</div>';
          
            return true;
            }
        }
        else {
          if ( chatee && chatee.id === person.id ) {
            select_class = ' billiesChatcorner-x-select';
          }

          if ( ! person.get_is_user() ) {
            list_html = list_html
                      + '<div class="billiesChatcorner-admin-chat-list-name'
                      + select_class + '" data-id="' + person.id + '">'
                      + billiesChatcorner.util_b.encodeHtml( person.name )
                      + '</div>';
          }

          if ( people_db().count() === 1 && person.get_is_user() ) {
            list_html = String()
                      + '<div class="billiesChatcorner-admin-chat-list-note">'
                      + '崇高な孤独<br><br>'
                      + '誰もいない'
                      + '</div>';
            clearChat();
          }
        }

        
        jqueryMap.$list_box_a.html( list_html );
      });
    };

    //--[ onSetChatee ]-----------------------------------------------------
    //
    onSetchatee = function ( event, arg_map ) {
      var new_chatee = arg_map.new_chatee,
          old_chatee = arg_map.old_chatee;

      jqueryMap.$input_a.focus();
      if ( ! new_chatee ) {
        if ( old_chatee ) {
          writeAlert( old_chatee.name + ' さんが退出しました' );
        }
        else {
          writeAlert( '相手はもういません' );
        }
        jqueryMap.$title_a.text( 'チャット' );
        return false;
      }

      jqueryMap.$list_box_a
               .find( '.billiesChatcorner-admin-chat-list-name' )
               .removeClass( 'billiesChatcorner-x-select' )
               .end()
               .find( '[data-id=' + arg_map.new_chatee.id + ']' )
               .addClass( 'billiesChatcorner-x-select' );

      writeAlert( 'チャット相手> ' + arg_map.new_chatee.name );
      jqueryMap.$title_a.text( '> ' + arg_map.new_chatee.name );
      return true;
    };

    //--[ onUpdatachat ]-------------------------------------------------
    //
    onAdminUpdatechat = function ( event, msg_map ) {
      var is_user,
          sender_id = msg_map.sender_id,
          msg_text = msg_map.msg_text,
          chatee = configMap.chat_model.get_chatee() || {},
          sender = configMap.people_model.get_by_cid( sender_id );
      
      if ( ! sender ) {
        writeAlert( msg_text );
        return false;
      }

      is_user = sender.get_is_user();

      if ( ! ( is_user || sender_id === chatee.id )) {
        configMap.chat_model.set_chatee( sender_id );
      }

      writeChat( sender.name, msg_text, is_user );

      if ( is_user ) {
        jqueryMap.$input_a.val('');
        jqueryMap.$input_a.focus();
      }
    };

    //--[ onTapList ]---------------------------------------------------
    //
    onTapList = function ( event) {
      var $tapped = jQuery( event.elem_target ), chatee_id;

      if ( ! $tapped.hasClass( 'billiesChatcorner-admin-chat-list-name' )) {
        return false;
      }

      chatee_id = $tapped.attr( 'data-id' );
      if ( ! chatee_id ) { return false; }

      configMap.chat_model.set_chatee( chatee_id );
      return false;
    };

    //--[ configModule ]-------------------------------------------------
    // @param:
    //   input_map -- 構成可能なキーバリューマップ
    // @return:
    //   true
    // @exception:
    //   なし
    configModule = function ( input_map ) {
      billiesChatcorner.util.setConfigMap({
        input_map : input_map,
        settable_map : configMap.settable_map,
        config_map : configMap
      });
      return true;
    };

    //--[ onChatLogin ]------------------------------------------------------
    //
    onChatLogin = function ( event, login_user ) {
      console.log( login_user.name + ' さんがログインしました。' );
    };

    //--[ onChatLogout ]-----------------------------------------------------
    //
    onChatLogout = function (event, logout_user) {
      console.log('NOW admin.chat.js -- adminLogout');
      console.log(logout_user.name + ' さんがログアウトしました。');
	  jqueryMap.$title_a.text( 'チャット' );
      clearChat();
	  console.log('ClearChat!');
    };

    //--[ initModule ]---------------------------------------------------
    // @param:
    //   $container -- jQuery要素
    // @return:
    //   true
    // @exception:
    //   なし
    initModule = function ( $append_target ) {
      var $list_box;

      $append_target.html( configMap.main_html );
      stateMap.$append_target = $append_target;
      setJqueryMap();
      setPxSizes();

      jqueryMap.$title_a.text( configMap.chatArea_title );

      $list_box = jqueryMap.$list_box_a;
      console.log('admin.chat.js -- $list_box'); console.log($list_box);
      jQuery.gevent.subscribe( $list_box, 'billiesChatcorner-listchange', onListchange );
      jQuery.gevent.subscribe( $list_box, 'billiesChatcorner-setchatee' , onSetchatee );
      jQuery.gevent.subscribe( $list_box, 'billiesChatcorner-updatechat', onAdminUpdatechat );
      jQuery.gevent.subscribe( $list_box, 'billiesChatcorner-adminLogin', onChatLogin );
      jQuery.gevent.subscribe( $list_box, 'billiesChatcorner-adminLogout', onChatLogout );

      jqueryMap.$list_box_a.on( 'utap', onTapList );
      jqueryMap.$send_a.bind( 'utap', onSubmitMsg );
      jqueryMap.$form_a.bind( 'submit', onSubmitMsg );
      
//      writeChat( 'Billie', 'こんにちは', true );
      
      return true;
    };

    //--[ public ]-----------------------------------------------
    return {
      configModule : configModule,
      initModule : initModule,
      onChatLogout : onChatLogout
    };
  }());
});

