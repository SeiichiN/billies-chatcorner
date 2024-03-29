/*
 * billiesChatcorner.util.js
 * billiesChatcorner のユーティリティ
 */

/*jslint          browser : true, continue : true,
   devel   : true, indent  : 2,    maxerr   : 50,
   newcap  : true, nomen   : true, plusplus : true,
   regexp  : true, sloppy  : true, vars     : true,
   white   : true
 */
/*global $, billiesChatcorner */

billiesChatcorner.util = (function () {
  var makeError, setConfigMap;

  //--[ makeError ]------------------------------------------
  // @param:
  //   name_test -- エラー名
  //   msg_text -- エラーメッセージ
  //   data -- 付加するデータ（オプション）
  // @return:
  //   errorオブジェクト
  //
  makeError = function ( name_text, msg_text, data ) {
    var error = new Error();

    error.name = name_text;
    error.message = msg_text;

    if ( data ) { error.data = data; }

    return error;
  };

  //--[ setConfigMap ]--------------------------------------
  // @param: arg_map
  //   * input_map -- 新たに設定したいキーとバリューのセット { key: value }
  //   * settable_map -- chat.js がもっている config_map.settable_map
  //   * config_map -- chat.js がもっている config_map
  // @return: true
  //
  setConfigMap = function ( arg_map ) {
    var input_map = arg_map.input_map,
        settable_map = arg_map.settable_map,
        config_map = arg_map.config_map,
        key_name, error;

    // 
    for ( key_name in input_map ) {
      if ( input_map.hasOwnProperty( key_name ) ) {
        if ( settable_map.hasOwnProperty( key_name ) ) {
          config_map[ key_name ] = input_map[ key_name ];
        }
        else {
          error = makeError(
            'Bad Input',
            'Setting config key | ' + key_name + ' | is not supported'
          );
          console.log(error);
          throw error;
        }
      }
    }
  };

  //--[ deleteArray ]-------------------------------------
  // オブジェクトの配列の中で、あるオブジェクトを削除する。
  // たとえば、peopleList = [ {id:'xxx', name:'xxx'},{....},....]
  // という配列が合った場合、
  // remakeArray( peopleList, 'name', 'sarry' ); で、
  // name が sarry であるオブジェクトを配列から削除できる。
  //
  // @param:
  //   arr -- 対象となるオブジェクトの配列
  //   objKey -- この検索キーで探す
  //   objVal -- この値をもつオブジェクトを削除する
  //
  deleteArray = function ( arr, objKey, objVal ) {
    var newArray = [];
    
    newArray =  arr.filter( function ( target ) {
      return target[objKey] !== objVal;
    });

    return newArray;
  };

  return {
    makeError : makeError,
    setConfigMap : setConfigMap,
    deleteArray : deleteArray
  };
}());
