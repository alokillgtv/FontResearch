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
function dec2hex(str, signed,plus) {
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
  var $sothem = "";
  var $hex = number.toString(16).toUpperCase();
  if (signed) {
    var $hex = pad(number.toString(16).toUpperCase(), signed);
  }
  if(plus){
    if($hex.length < plus){
      var $sokhong = "00000000000000000000000000000000";
      var $tru = plus - $hex.length;
      var $reg = new RegExp("(.{"+$tru+"})","gi");
      $sothem = $sokhong.match($reg)[0];
    }
  }
  return $sothem + $hex;
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


function FileRead($hex,$offset,$length){// H??m t??ch d??? li???u t??? offset v?? length c???a hex
  if($offset < $hex.length && ($offset + $length) < $hex.length ){// N???u offset v?? length ????ng
    $offset = $offset * 2;// M???i ????n v??? nh??n v???i 2 t????ng t??? 1 byte trong hex
    $length = $length * 2;// M???i ????n v??? nh??n v???i 2 t????ng t??? 1 byte trong hex
    var $regexp = new RegExp("^.{"+$offset+"}(.{"+$length+"})");// T???o m???t bi???u th???c ????? t??ch l???y chu???i hex
    var $value = $hex.match($regexp);// Ti???n h??nh t??ch chu???i hex
    if($value){// N???u l???y ???????c d??? li???u
      return $value[1];// Tr??? v??? d??? li???u.
    }
    else{// N???u kh??ng l???y d??? li???u ???????c th?? b??o.
      //alert("???? x???y ra l???i khi t??ch chu???i hex.")
      $ERROR = true;
      return "";
    }
  }
  else{
    //alert("V??? tr?? offset v?? ????? d??i v?????t m???c file bin, n??n kh??ng tr??ch ???????c d??? li???u.\n\nKi???m tra l???i offset v?? length c???a h??m");
    $ERROR = true;
    return "";
  }
}

function Round($num, $scale) {// H??m r??t g???n d??y s???
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

// H??m chuy???n Little v?? Big
function SwapEndian($string){
  if($string){
    var result = [];// T???o bi???n array
    var $len = $string.length - 2;// L???y t???ng s??? byte m???t d??i hex
    while ($len >= 0) {// Ch???y l???p ????? chuy???n ?????i
      result.push($string.substr($len, 2));
      $len -= 2;
    }
    return result.join(''); // Tr??? v??? d??? li???u chuy???n ?????i
  }
  else{
    return $string;
  }
}

function changeHex($value){// H??m x??c nh???n hex v?? chuy???n th??nh dec
  if($value){// N???u c?? d??? li???u
    var $split = String($value).match(/0x(\S+)/);// T??ch chu???i hex
    if($split){// N???u l?? hex
      return hex2dec($split[1]);// Chuy???n sang dec v?? tr??? v???
    }
    else{
      return $value;// ????y l?? dec tr??? v???
    }
  }
}