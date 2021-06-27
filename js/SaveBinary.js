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

function IMGBIT(e){
  var $file = e.files[0];// lấy file font ảnh
  var $imgsrc = URL.createObjectURL($file);// Tạo đường dẫn font ảnh
  $('#imgTool').attr("src",$imgsrc);// Chèn đường dẫn font ảnh
  setTimeout(function(){
    var $width = $('#imgTool')[0].naturalWidth;// Lấy width ảnh font bitmap
    var $height = $('#imgTool')[0].naturalHeight;// Lấy height ảnh font bitmap
    $('.wIMGFNT b').text($width);// Chèn width vào ô
    $('.hIMGFNT b').text($height);// Chèn height vào ô
  },100)
}

function checkFILE($objFNT){
  $('#checkWidth,#checkHeight,#checkXadvance,#checkUnicode').attr("disabled","disabled");
  if($('.character-table').length == 0){// Nếu chưa bấm phân tích font
    checkFont();
  }
  $('.max-charFNT b').text($objFNT.count);// Chèn tổng số ký tự file FNT
  getDataList(false)// Lấy dữ liệu $SUPERDATA
  var $boxChar = $('.item-struct[boxname="Dữ Liệu Ký Tự"]'); // Lấy box struct Dữ Liệu Ký Tự
  if($boxChar.length == 0){
    alert("Bạn phải có một khối Range Dữ Liệu Ký Tự mới có thể dùng tính năng này.");
    return;
  }
  var $start = getStringHex($boxChar.find(".input-offset").val()).dec;// Lấy start offset struct
  var $length = getStringHex($boxChar.find(".input-max").val()).dec;// Lấy length struct
  var $bytelong = 0;// Tạo biến lấy tổng số byte 1 struct
  var $listStruct = [];// Tạo array chứa dữ liệu tất cả struct
  $('.item-struct').each(function(){// Chạy lập theo từng struct
    var $struct = getCharType($(this));// Lấy dữ liệu 1 struct
    $listStruct.push($struct);// Gán dữ liệu vào array struct
  })
  $boxChar.find('.select-byte option:selected').each(function(){// Chạy lập theo từng select byte để tính
    var $value = Number($(this).val());// Lấy byte 1 khối
    $bytelong = $bytelong + $value;// Cộng byte lại
  });
  var $stringCals = $length + " % " + $bytelong;// Kiểm tra xem khối dữ liệu này có đúng hay không
  $stringCals = eval($stringCals);
  var $maxChar = $length / $bytelong;// Lấy tổng số ký tự font bitmap
  if($stringCals == 0){// Nếu dữ liệu đúng
    $('.max-charBIT b').text($maxChar);// Chèn tổng số ký tự vào ô
    var $width = $('#img-view')[0].naturalWidth;// Lấy width ảnh font bitmap
    var $height = $('#img-view')[0].naturalHeight;// Lấy height ảnh font bitmap
    $('.wIMG b').text($width);// Chèn width vào ô
    $('.hIMG b').text($height);// Chèn height vào ô
    createTable($listStruct,$objFNT,$SUPERDATA);// Tạo table chứa các ký tự
  }
  else{
    alert("Có vẻ như khối Range Dữ Liệu Ký Tự của bạn có độ dài vượt quá số ký tự phân tích được,\nhãy nhớ kiểm tra lại nếu xong dễ xảy ra lỗi khi tạo font mới.");
    return;
  }
}

function splitData($listStruct){
  if($listStruct[0]){
    for(var $N = 0;$N < $listStruct.length;$N++){
      var $Struct = $listStruct[$N];
      var $Name = $Struct.Name;
      var $Start = $Struct.StartOffset;
      var $Length = $Struct.LengthOffset;
      var $HexStruct = FileRead($HEXFILE,$Start,$Length);
      var $maxByte = $Struct.maxByte * 2;
      var $regexp = new RegExp("(.{"+$maxByte+"})","gi");
      var $lineStruct = $HexStruct.match($regexp);
      if($lineStruct){
        //console.log($lineStruct);
        $listStruct[$N].resultData = splitBlock($lineStruct,$Struct);
        $DATASTRUCT = $listStruct;
      }
    }
  }
}

function splitBlock($lineStruct,$Struct){
  var $listHex = [];
  for(var $U = 0;$U < $lineStruct.length;$U++){
    var $lineHex = $lineStruct[$U]; // Hex 1D200000F83F3F00600E3F00B8483F0098163FC8FFFDFF18010701
    //console.log($lineHex)
    var $beginSplit = 0;
    var $listCharHex = [];
    for(var $M = 0; $M < $Struct.listChar.length;$M++){
      var $thisChar = $Struct.listChar[$M];
      var $byteLong = $thisChar.byteLong * 2;
      var $titleText = $thisChar.titleText;
      var $regSplit = new RegExp("^(.{"+$beginSplit+"})(.{"+$byteLong+"})");
      $beginSplit = $beginSplit + $byteLong;
      var $item = $thisChar;
      if($lineHex){
        $item.Hex = $lineHex.match($regSplit)[2];
        $listCharHex.push($item);
      }
    }
    $listHex.push($listCharHex);
  }
  //console.log($listHex);
  return $listHex;
}

function createTable($listStruct,$objFNT,$SUPERDATA){// Hàm tạo table và kiểm tra ký tự
  for(var $n = 0;$n < $listStruct.length;$n++){
    var $struct = $listStruct[$n];
    if($struct.Name == "Dữ Liệu Width"){
      $('#checkWidth').removeAttr("disabled");
    }
    if($struct.Name == "Dữ Liệu Height"){
      $('#checkHeight').removeAttr("disabled");
    }    
    if($struct.Name == "Dữ Liệu Xadvance"){
      $('#checkXadvance').removeAttr("disabled");
    }
    if($struct.Name == "Dữ Liệu Unicode"){
      $('#checkUnicode').removeAttr("disabled");
    }
  }
  
}