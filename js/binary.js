var str = '0x3F160008';
function parseFloat(str) {
  var float = 0, sign, order, mantissa, exp,
  int = 0, multi = 1;
  if (/^0x/.exec(str)) {
      int = parseInt(str, 16);
  }
  else {
      for (var i = str.length -1; i >=0; i -= 1) {
          if (str.charCodeAt(i) > 255) {
              console.log('Wrong string parameter');
              return false;
          }
          int += str.charCodeAt(i) * multi;
          multi *= 256;
      }
  }
  sign = (int >>> 31) ? -1 : 1;
  exp = (int >>> 23 & 0xff) - 127;
  mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
  for (i=0; i<mantissa.length; i+=1) {
      float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
      exp--;
  }
  return float*sign;
}

function bin2text(str) {
  var $split = str.match(/(..)/g);
  var $text = "";
  for(var $j = 0; $j < $split.length;$j++){
    var $item = $split[$j].toUpperCase();
    $text += hex2ascii($item);
  }
  return $text;
}

function bin2hex(str) {
  return parseInt(str, 2).toString(16).toUpperCase();
}
function bin2dec(str) {
  return parseInt(str, 2).toString(10);
}
function bin2float(str, precision) {
  return this.hex2float(this.bin2hex(str), precision);
}
function hex2bin(str) {
  return parseInt(str, 16).toString(2);
}
function hex2dec(str, signed) {
  var number = str;

  if (signed === undefined) {

    return parseInt(number,16);
  }
  if (number.substring(0,2) !== "0x") {
    number = "0x" + number;
  }
  if (signed === 16 && number > 32768) {
    number -= 65536;
  }
  else {
    if (signed === 32 && number > 2147483648) {
      number -= 4294967296;
    }
    else {
      number = parseInt(number,16);
    }
  }

  return number;
}
function hex2float(str, precision) {
  var number = 0, sign, order, mantiss, exp, i;

  if (str.length <= 6) {

    exp = parseInt(str,16);
    sign = (exp >> 16)? -1:1;
    mantiss = (exp >> 12 & 255) - 127;
    order = ((exp & 2047) + 2048).toString(2);
    for (i = 0; i < order.length; i += 1) {
      number += parseInt(order[i],10)? Math.pow(2,mantiss):0;
      mantiss--;
    }
  }

  else if (str.length <= 10) {
    exp = parseInt(str,16);
    sign = (exp >> 31)? -1:1;
    mantiss = (exp >> 23 & 255) - 127;
    order = ((exp & 8388607) + 8388608).toString(2);
    for (i = 0; i < order.length; i += 1) {
      number += parseInt(order[i],10)? Math.pow(2,mantiss):0;
      mantiss--;
    }
  }

  if (precision === 0 || precision) {
    return (number * sign).toFixed(precision).toString(10);
  }
  return (number * sign).toString(10);
}
function dec2bin(str) {
  return parseInt(str, 10).toString(2);
}
function dec2hex(str, signed) {
  var number = str;

  if (number[0] === "-") {
    number = parseInt(number.substring(1),10);
    if (signed === 16) {
      number -= 65536;
    }
    else {
      if (signed === 32) {
        number -= 4294967296;
      }
    }
    number =- number;
  }
  else {
    number = parseInt(number,10);
  }
  if (signed) {
    return pad(number.toString(16).toUpperCase(), signed);
  }
  return number.toString(16).toUpperCase();
}
function dec2float(str) {
  return str + ".0";
}

function float2bin(str) {
  var text = str, no, noa = [0], tmp, i, j, k, l, obj = {};

  no = parseFloat(text);
  text = text.toLowerCase();

  obj.TEXT = text;
  obj.sign = ( text.indexOf('-') >= 0 ) ? '-' : '+';
  obj.e = ( text.indexOf('e') >= 0 ) ? 'e' + obj.sign : '';
  obj.TEXT_FLOAT = (obj.e) ? text.split(obj.e)[0] : text;
  obj.TEXT_EXP = (obj.e) ? text.split(obj.e)[1] : '0';
  text = obj.TEXT_FLOAT;
  tmp = text.split('.');
  obj.Num = Math.abs(tmp[0]);
  obj.Dec = (+( '0.' + ((tmp[1]) ? tmp[1] : '0' )));
  obj.Exp = (obj.e) ? parseInt( obj.TEXT.split( obj.e )[1], 10) : 127;
  obj.Exp += (obj.e && obj.sign === "+") ? 127 : 0;
  text = (obj.e) ? text.split(obj.e)[0] : text;

  noa[0] = ( obj.sign === '-' ) ? 1 : 0;

  tmp = obj.Num;
  obj.Num = (obj.Num);
  no = obj.Dec;
  tmp = tmp.toString(2) + '.';
  for ( i = tmp.length; (i < 32 && no > 0); i++ ) {
    no *= 2;
    text = ('' + no).split('.')[0];
    no -= (+text);
    tmp += text;
  }
  j = 0;
  i = tmp.indexOf('.');
  text = tmp;
  l = i;
  if (obj.Num > 0) {
    for (i--, k = i; i > -1; i--) {
      if (tmp[i] === '1') {
        k = i;
      }
    }
    j = (l - 1) - k;
  }
  else {
    for (i++, k = i; i < tmp.length; i++) {
      if (tmp[i] === '1') {
        k = i - 1;
        j = i - l;
        i = tmp.length;
      }
    }
    j = -j;
  }

  no = (obj.e) ? 0 : j;
  obj.Exp += no;
  tmp = obj.Exp.toString(2);
  for ( i = 8, j = (tmp.length - 1); i > 0; i--, j-- ) {
    noa[ i ] = ( tmp[ j ] ) ? tmp[j] : '0';
  }

  tmp = text.replace('.', '');
  for ( i = 9, j = k + 1; i < 32; i++, j++ ) {
    noa[i] = (tmp[j]) ? tmp[j] : '0';
  }
  return noa.join("");
}

function float2hex(str) {
  return this.bin2hex(this.float2bin(str));
}

function float2dec(str) {
  return str.split(".")[0];
}

function hex2ascii(str, shift) {
  var out = "", i;

  if (shift) {
    for (i = 0; i < str.length; i += 4) {
      if (str[i + 2]) {
        out += String.fromCharCode(parseInt(str.substr(i + 2, 2), 16));
      }
      out += String.fromCharCode(parseInt(str.substr(i, 2), 16));
    }
  }

  else {
    for (i = 0; i < str.length; i += 2) {
      out += String.fromCharCode(parseInt(str.substr(i, 2), 16));
    }
  }
  return out;
}



function ascii2hex(str, shift) {
  var out = "", i;

  if (shift) {
    for (i = 0; i < str.length; i += 2) {
      if (str[i + 1]) {
        out += this.dec2hex(str.charCodeAt(i + 1).toString());
      }
      out += this.dec2hex(str.charCodeAt(i).toString());
    }
  }

  else {
    for (i = 0; i < str.length; i++) {
      out += this.dec2hex(str.charCodeAt(i).toString());
    }
  }
  return out;
}

function ascii2dec(str, shift) {
  var out = "", i;

  if (shift) {
    for (i = 0; i < str.length; i += 2) {
      if (str[i + 1]) {
        out += str.charCodeAt(i + 1).toString();
      }
      out += str.charCodeAt(i).toString();
    }
  }

  else {
    for (i = 0; i < str.length; i++) {
      out += str.charCodeAt(i).toString();
    }
  }
  return out;
}

function dec2ascii(str){
  return String.fromCharCode(str);
}

function BinRead($hex,$offset,$length){
  var $binary = $hex.match(/(..)/g);
  var $binJoin = "";
  var $endGet = $offset + $length;
  if($offset < $length){
    for(var $h = $offset;$h < $endGet;$h++){
      $binJoin += $binary[$h];
    }
    console.log($binJoin);
  }
}

function pad(input, total) {
  var $padLen = input.length
  var $zero = "";
  if($padLen == 1 ||$padLen == 3 || $padLen == 5 || $padLen == 7 || $padLen == 9 || $padLen == 11){
    $zero = 0;
  }
  return $zero + input;
}


function FileRead($hex,$offset,$length){// Hàm tách dữ liệu từ offset và length của hex
  if($offset < $hex.length && ($offset + $length) < $hex.length ){// Nếu offset và length đúng
    $offset = $offset * 2;// Mỗi đơn vị nhân với 2 tương tự 1 byte trong hex
    $length = $length * 2;// Mỗi đơn vị nhân với 2 tương tự 1 byte trong hex
    var $regexp = new RegExp("^.{"+$offset+"}(.{"+$length+"})");// Tạo một biểu thức để tách lấy chuỗi hex
    var $value = $hex.match($regexp);// Tiến hành tách chuỗi hex
    if($value){// Nếu lấy được dữ liệu
      return $value[1];// Trả về dữ liệu.
    }
    else{// Nếu không lấy dữ liệu được thì báo.
      //alert("Đã xảy ra lỗi khi tách chuỗi hex.")
      $ERROR = true;
      return "";
    }
  }
  else{
    //alert("Vị trí offset và độ dài vượt mức file bin, nên không trích được dữ liệu.\n\nKiểm tra lại offset và length của hàm");
    $ERROR = true;
    return "";
  }
}

function Round($num, $scale) {// Hàm rút gọn dãy số
  var $string = String($num);
  if($num && $string.length > $scale){
    var $string = String($num);
    var $regexp = new RegExp("(^\\d+)\\.(\\d){"+$scale+"}");
    var $numSplit = $string.match($regexp);
    if($numSplit){
      return Number($numSplit[0]);
    } 
    else{
      return $num;
    }
  }
  else{
    return $num;
  }
}

// Hàm chuyển Little và Big
function SwapEndian($string){
  if($string){
    var result = [];// Tạo biến array
    var $len = $string.length - 2;// Lấy tổng số byte một dãi hex
    while ($len >= 0) {// Chạy lập để chuyển đổi
      result.push($string.substr($len, 2));
      $len -= 2;
    }
    return result.join(''); // Trả về dữ liệu chuyển đổi
  }
  else{
    return $string;
  }
}

function changeHex($value){// Hàm xác nhận hex và chuyển thành dec
  if($value){// Nếu có dữ liệu
    var $split = String($value).match(/0x(\S+)/);// Tách chuỗi hex
    if($split){// Nếu là hex
      return hex2dec($split[1]);// Chuyển sang dec và trả về
    }
    else{
      return $value;// Đây là dec trả về
    }
  }
}