$CHARACTERFNT = "";

// Hàm chuyển base64
if (!window.atob) {
  var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var table = tableStr.split("");

  window.atob = function (base64) {
    if (/(=[^=]+|={3,})$/.test(base64)) throw new Error("String contains an invalid character");
    base64 = base64.replace(/=/g, "");
    var n = base64.length & 3;
    if (n === 1) throw new Error("String contains an invalid character");
    for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
      var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
      var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
      if ((a | b | c | d) < 0) throw new Error("String contains an invalid character");
      bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
      bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
      bin[bin.length] = ((c << 6) | d) & 255;
    };
    return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4);
  };

  window.btoa = function (bin) {
    for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
      var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
      if ((a | b | c) > 255) throw new Error("String contains an invalid character");
      base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
                              (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
                              (isNaN(b + c) ? "=" : table[c & 63]);
    }
    return base64.join("");
  };

}

// Hex sang base64
function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

// Base64 sang Hex
function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join(" ");
}

// Hàm lưu file binary
function FileBinarySave($base64,$filename){
  // convert base64 string to byte array
  var byteCharacters = atob($base64);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  var byteArray = new Uint8Array(byteNumbers);  
  // now that we have the byte array, construct the blob from it
  var blob1 = new Blob([byteArray], {type: "application/octet-stream"});
  saveAs(blob1, $filename);
}

function checkFNTFILE(e){
  var $titleStruct = $('.title-struct b').text();
  e.value = "";
  if($FontMapType != 0){
    alert("Tool chỉ hỗ trợ tạo font dạng bitmap.\n\nHiện chưa hỗ trợ tạo font dạng text.");
    return;
  }
  if($titleStruct.indexOf("Dữ Liệu Ký Tự") == -1){
    alert("Để tạo được font bitmap, bạn cần phải phân tích chính xác dữ liệu của font bitmap.\n\nTheo thiếp lập hiện tại bạn vẫn chưa phân tích đúng cấu trúc của font.\n\nDo đó, hãy kiểm tra lại dữ liệu phân tích của bạn.\n\nLưu ý rằng, để tạo được font bitmap, bạn cần có 1 Range đặt tên là Dữ Liệu Ký Tự ở cột phân tích bên trái.");
    return;
  }
}

// Hàm đọc file text
function FNTFILE(e){// Hàm chọn file map font
  var $titleStruct = $('.title-struct b').text();
  if($FontMapType != 0){
    return;
  }
  if($titleStruct.indexOf("Dữ Liệu Ký Tự") == -1){
    return;
  }
  var file = e.files[0];// Lấy file
  var $size = file.size;
  if($size > 1000000){
    alert("Vui lòng chỉ chọn những file dưới 1MB.\nDung lượng file quá lớn tool không thể xử lý được.");
    return false;
  }
  var $name = file.name;// Lấy tên file
  var fr = new FileReader();// Tạo biến đọc file
  fr.onload = receivedText;// Tiến hành đọc file và gọi hàm receivedText()
  fr.readAsText(file);// Đọc file đọc file dạng text
  function receivedText() {// Hàm đọc file text và tiến hành đọc file binary
    fr = new FileReader();// Đọc lại file
    fr.onload = receivedBinary;// Chạy hàm call back binary
    fr.readAsText(file);// Đọc file bằng binary
  }
  function receivedBinary() {// Hàm call back khi đọc file xong
    $CHARACTERFNT = actionFNT(fr.result);
    checkFILE($CHARACTERFNT);
  }
}

// Hàm phân tách các dữ liệu FNT
function actionFNT($string){
  if($string.match(/\r\n/gi)){
    var $listLine = $string.split("\r\n");
  }
  else{
    var $listLine = $string.split("\n");
  }
  var $charLISTFNT = {};
  $charLISTFNT.list = [];
  for(var $t = 0;$t < $listLine.length;$t++){
    var $line = $listLine[$t];
    var $count = $line.match(/(count)\=(\S+)/)
    var $charText = $line.match(/yoffset|xoffset|width/)
    if($count){
      $charLISTFNT.count = $count[2];
    }
    if($charText){
      var $item = {};
      $item.id = $line.match(/id\=(\S+)/)[1];
      $item.x = $line.match(/x\=(\S+)/)[1];
      $item.y = $line.match(/y\=(\S+)/)[1];
      $item.width = $line.match(/width\=(\S+)/)[1];
      $item.height = $line.match(/height\=(\S+)/)[1];
      $item.xoffset = $line.match(/xoffset\=(\S+)/)[1];
      $item.yoffset = $line.match(/yoffset\=(\S+)/)[1];
      $item.xadvance = $line.match(/xadvance\=(\S+)/)[1];
      $item.chnl = $line.match(/chnl\=(\S+)/)[1];
      $charLISTFNT.list.push($item);
    }
  }
  return $charLISTFNT;
}

function checkFILE($objFNT){
  $('.max-charFNT b').text($objFNT.count);
  getDataList(false)
  var $boxChar = $('.item-struct[boxname="Dữ Liệu Ký Tự"]');
  var $start = getStringHex($boxChar.find(".input-offset").val()).dec;
  var $length = getStringHex($boxChar.find(".input-max").val()).dec;
  var $bytelong = 0;
  var $listStruct = [];
  $('.item-struct').each(function(){
    var $boxName = $(this).attr("boxname");
    var $struct = getCharType($(this));
    $listStruct.push($struct);
  })
  $boxChar.find('.select-byte option:selected').each(function(){
    var $value = Number($(this).val());
    $bytelong = $bytelong + $value;
  });
  var $stringCals = $length + " % " + $bytelong;
  $stringCals = eval($stringCals);
  var $maxChar = $length / $bytelong;
  if($stringCals == 0){
    $('.max-charBIT b').text($maxChar);
  }
  else{
    alert("Có vẻ như khối Range Dữ Liệu Ký Tự của bạn có độ dài vượt quá số ký tự phân tích được,\nhãy nhớ kiểm tra lại nếu xong dễ xảy ra lỗi khi tạo font mới.");
    return;
  }
}

