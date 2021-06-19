function TextareaHeight(){
  $('.textarea-file-hex').css("height","")
  $('.textarea-file-hex').each(function(){
  setTimeout(() => {
    $(this).css("height",this.scrollHeight + 'px')
  }, 1000);})
}

function setFileHex(){
  var $hex = $('#test').val();
  var $byte = $('.input-byte-rows').val();
  var $regexp = new RegExp("(.{"+$byte * 2+"})","gi");
  var $hexSplit = $hex.split($regexp);
  var $hexFile = "";
  var $textHtml = "";
  var $textBase = "";
  var $numberRow = 0;
  $ASNIITEXT = "";
  for(var $h = 0;$h < $hexSplit.length;$h++){
    var $block = $hexSplit[$h];
    if($block != ""){
      $numberRow = $numberRow + 1;
      var $ascii = hex2ascii($block).replace(/[^\u20-\u1f\u80-\ua1]|\</gi,".");
      $textBase += $ascii + "\n";
      $ASNIITEXT += $ascii + "\n";
      $textHtml += $ascii + "<br>";
      $hexFile += $block.match(/(.{2})/gi).join(" ") + "\n";
    }
  }
  var $HeadNumber = "";
  for(var $y = 0;$y < $byte;$y++){
    $HeadNumber += dec2hex($y,2) + " ";
  }
  var $leftNumber = "";
  console.log($numberRow);
  for(var $s = 0;$s < $numberRow;$s++){
    $leftNumber += '<div class="left-row-hex">' + dec2hex(($s * $byte),4,8) + "</div>";
  }
  $('.item-count-head span').text($HeadNumber);
  $('.body-output-text-file-hex').html($textHtml);
  $('.textarea-output-text-file-hex').val($textBase);
  $('.offset-text-file-hex').html($leftNumber);
  var $width = $('.item-count-head')[0].clientWidth;
  $('.textarea-file-hex').css("width",$width + 5);
  $HEXTEXTAREA = $hexFile;
  $('.textarea-file-hex').val($hexFile);
  TextareaHeight();
}

function GetCusorText(e){
  var $byte = Number($('.input-byte-rows').val()) + 1;
  var $textarea = $ASNIITEXT.replace(/\n/gi,"<br>");
  $('.body-output-text-file-hex').html($textarea);
  var pos = getCursorPos(e);
  pos.end = pos.end-Math.floor(pos.end/$byte)
  pos.start = pos.start-Math.floor(pos.start/$byte);
  var $BeginOffset = dec2hex(pos.start);
  var $endOffset = dec2hex(pos.end);
  var $length = dec2hex(pos.end - pos.start);
  
  //console.log(pos);
  pos.end = Number(pos.end) * 3;
  pos.start = Number(pos.start) * 3;
  $('.textarea-file-hex').focus();
  setCursorPos($('.textarea-file-hex')[0], pos.start, pos.end);
  var $select = $('.textarea-file-hex')[0].value.substring(pos.start, pos.end).replace(/\s/gi,"");
  if($select.length < 20){
    convertValue($select);
  }
  $('.item-offset-hex span').text($BeginOffset);
  $('.item-block-hex span').text($BeginOffset + "-" + $endOffset);
  $('.item-length-hex span').text($length);
  //console.log($select);
  fillHighlight(pos);
  $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
  setTimeout(function(){
    $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
  },1);
}

function fillHighlight($pos){
  //console.log($pos);
  var $textarea = $ASNIITEXT.replace(/\n/gi,"<br>");
  $('.body-output-text-file-hex').html($textarea);
  var $byte = Number($('.input-byte-rows').val());
  var $start = Number(Math.floor($pos.start / 3));
  var $end = Number(Math.floor($pos.end / 3));
  var $lineStart = Number(String($start / $byte).match(/\d+/)[0]);
  var $lineEnd = Number(String($end / $byte).match(/\d+/)[0]);
  var $posStart = $start - ($lineStart * $byte);
  var $posEnd = $end - ($lineEnd * $byte);
  var $listLineHTML = $ASNIITEXT.split("\n");
  var $getLineStart = $listLineHTML[$lineStart];
  var $getLineEnd = $listLineHTML[$lineEnd];
  if($lineStart == $lineEnd){
    var $length = $end - $start + 1;
    var $regStart = new RegExp("(.{"+$posStart+"})(.{"+$length+"})(.*?)$","gi");
    var $replaceStart = $getLineStart.replace($regStart,'$1<span class="hightlight">$2</span>$3');
    $listLineHTML[$lineStart] = $replaceStart;
  }
  else{
    var $regStart = new RegExp("(.{"+$posStart+"})(.*?)$","gi");
    var $regEnd = new RegExp("(.{"+$posEnd+"})(.*?)$","gi");
    var $replaceStart = $getLineStart.replace($regStart,'$1<span class="hightlight">$2');
    var $replaceEnd = $getLineEnd.replace($regEnd,'$1</span>$2');
    $listLineHTML[$lineStart] = $replaceStart;
    $listLineHTML[$lineEnd] = $replaceEnd;
  }
  $('.body-output-text-file-hex').html($listLineHTML.join("<br>"));
}

function setTextCursor(input, content, row, column){
  // search row times: 
  var pos = 0;
  var prevPos = 0;
  for( var i = 0; (i<row) && (pos != -1); ++i){
      prevPos = pos;
      pos = content.indexOf("\n",pos+1);        
  }


  // if we can't go as much down as we want,
  //  go as far as worked
  if(-1 == pos){ pos = prevPos; }

  if(0 != row)
      ++pos; // one for the linebreak

  // prevent cursor from going beyond the current line
  var lineEndPos = content.indexOf("\n", pos+1);

  if((-1 != lineEndPos) && 
      (column > lineEndPos-pos)){
      // go *only* to the end of the current line
      pos = lineEndPos;
  } else{
      // act as usual
      pos += column
  }

  setSelectionRange(input, pos,pos);
}

function getCursorPos(input) {
    if ("selectionStart" in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0; rng.compareEndPoints("EndToStart", rng) > 0; rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = { start: 0, end: len }; rng.compareEndPoints("EndToStart", rng) > 0; rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}

function setCursorPos(input, start, end) {
    if (arguments.length < 3) end = start;
    if ("selectionStart" in input) {
        setTimeout(function() {
            input.selectionStart = start;
            input.selectionEnd = end;
        }, 1);
    }
    else if (input.createTextRange) {
        var rng = input.createTextRange();
        rng.moveStart("character", start);
        rng.collapse();
        rng.moveEnd("character", end - start);
        rng.select();
    }
}

function byteRows(e){
  var $value = e.value;
  if($value < 16 || $value > 32){
    alert("Vui lòng chỉ nhập số byte từ 16 đến 32.");
  }
  else{
    setFileHex();
  }
}

function GetCusor(e){
  var pos = getCursorPos(e);
  if(pos.end == pos.start){
    pos.end = pos.end + 1;
  }
  var $end = Math.floor(pos.end / 3);
  var $start = Math.floor(pos.start / 3);
  setCursorPos($('.textarea-file-hex')[0], pos.start, pos.end);
  var $select = $('.textarea-file-hex')[0].value.substring(pos.start, pos.end);
  if(/^\d\s/.test($select)){
    $start = $start - 1;
    pos.start = pos.start - 1;
  }
  if(/^\s/.test($select)){
    $start = $start + 1;
    pos.start = pos.start + 1;
  }  
  if(/\s$/.test($select)){
    $end = $end - 1;
    pos.end = pos.end - 1;
  }
  if(/\s\d$/.test($select)){
    $end = $end + 1;
    pos.end = pos.end + 1;
  }
  if(/^\s$/.test($select)){
    pos.end = pos.start - 1;
    pos.start = pos.start - 3
  }
  if(/^\d$/.test($select)){
    if(Number(pos.start) % 2){
      pos.start = pos.start - 1
    }
    else{
      pos.end = pos.end + 1;
    }
  }
  var $length = Math.floor($end - $start) + 1;
  $('.textarea-file-hex').focus();
  setCursorPos($('.textarea-file-hex')[0], pos.start, pos.end);
  var $select = $('.textarea-file-hex')[0].value.substring(pos.start, pos.end).replace(/\s/gi,"");
  if($select.length < 20){
    convertValue($select);
  }
  $('.item-offset-hex span').text(dec2hex($start));
  $('.item-block-hex span').text(dec2hex($start) + "-" + dec2hex($end));
  $('.item-length-hex span').text(dec2hex($length));
  fillHighlight(pos)
  /*
  if($length < 500){
    for(var $v = 0;$v < $length;$v++){
      var $eq = $start + $v;
      $('.char-text-hex:eq('+$eq+')').addClass("hightLight");
    }
  }
  */
}

function convertValue($select){
  $select = $select.replace("0x","");
  $('.item-hex-code span input').val("0x" + $select);
  var $swap = SwapEndian($select);
  $('.item-little-endian span').text("0x" + $swap);
  $('.item-big-endian span').text(hex2dec($select));
  $('.item-dec-number span').text(hex2dec($swap));
  $('.item-text-number span').text(hex2ascii($select).replace(/[^\u20-\u1f\u80-\ua1]|\</gi,"."));
  if($select.length == 8){
    $('.item-float-number span').text(Round(hex2float($select),6));
  }
  else{
    $('.item-float-number span').text("");
  }
}



function hexEdit(e){
  $(e).val($HEXTEXTAREA);
  //alert("Vui lòng không chỉnh sửa Hex ở đây");
}

function textEdit(e){
  $(e).val($ASNIITEXT);
}

function setRangeHight($start,$end,$max){
  if(!$end){
    var $end = new Object();
    $end.dec = Number($start.dec) + Number($max.dec);
    $end.hex = dec2hex($end.dec);
    $end.type = "HEX";
  }
  if(!$max){
    var $max = new Object();
    $max.dec = Number($end.dec) - Number($start.dec);
    $max.hex = dec2hex($max.dec);
    $max.type = "HEX";
  }
  var $decMax = $max.dec * 3;
  var $decStart = Number($start.dec) * 3;
  var $decEnd = $decStart + $decMax;
  $('.textarea-file-hex').focus();
  setCursorPos($('.textarea-file-hex')[0], $decStart, $decEnd - 1);
  var pos = {};
  pos.start = $decStart;
  pos.end = $decEnd - 1;
  fillHighlight(pos)
  //console.log($('.char-text-hex').eq($start.dec));
  $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
  setTimeout(function(){
    $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
  },1);
  var $hexEnd = dec2hex(Number($start.dec) + Number($start.dec))
  $('.item-offset-hex span').text($start.hex);
  $('.item-block-hex span').text($start.hex + "-" + $hexEnd.replace("0x",""));
  $('.item-length-hex span').text($max.hex);
}


function setRangeValue($parent){
  var $valueMax = $parent.find('.item-menu-input.input-max').val();
  var $valueStart = $parent.find('.item-menu-input.input-offset').val();
  var $resultStart = getStringHex($valueStart);
  var $resultMax = getStringHex($valueMax);
  if($resultStart.type != "NONE" && $resultMax.type != "NONE"){
    setRangeHight($resultStart,"",$resultMax)
  }
}

function EndOffset(e){
  var $Endvalue = e.value;
  var $Startvalue = $('.jump-byte-rows').val();
  if($Startvalue){
    var $start = getStringHex($Startvalue);
    var $end = getStringHex($Endvalue);
    setRangeHight($start,$end,"");
  }
  else{
    alert("Vui lòng nhập số liệu vào [Start Offset].");
  }
}

function MaxOffset(e){
  var $Maxvalue = e.value;
  var $Startvalue = $('.jump-byte-rows').val();
  if($Startvalue){
    var $start = getStringHex($Startvalue);
    var $max = getStringHex($Maxvalue);
    setRangeHight($start,"",$max);
  }
  else{
    alert("Vui lòng nhập số liệu vào [Start Offset].");
  }
}

function JumpOffset(e){
  var $value = e.value;
  var $result = getStringHex($value);
  if($result.type != "NONE"){
    var $dec = $result.dec * 3;
    $('.textarea-file-hex').focus();
    setCursorPos($('.textarea-file-hex')[0], $dec, $dec+2);
    var $byte = Number($('.input-byte-rows').val());
    var $textarea = $ASNIITEXT.replace(/\n/gi,"<br>");
    $('.body-output-text-file-hex').html($textarea);
    var pos = {};
    pos.start = $dec;
    pos.end = $dec+2;
    console.log(pos);
    fillHighlight(pos)
    $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    setTimeout(function(){
      $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    },1);
    $('.item-offset-hex span').text($result.hex);
    $('.item-block-hex span').text($result.hex + "-" + dec2hex(Number($result.dec)+2));
    $('.item-length-hex span').text(1);
  }
  else{
    alert("Vui lòng chỉ nhập dữ liệu số thập phân (DEC)\n\nhoặc dữ liệu số thập lục phân (HEX) vào ô.")
  }
}

function themPhepTinh($number){
  var $old = $('.pheptinhmaytinh').val();
  if(String($number).match(/[\+\-\*\/]/)){
    $old = $old + " " + $number + " ";
  }
  else{
    $old = $old + $number;
  }
  $('.pheptinhmaytinh').val($old);
  $('.ketquatinhtoan').html($old);
  ketquapheptinh();
}

function focusCals(){
  $('.pheptinhmaytinh').focus();
}


function ketquapheptinh(){
  var $cacpheptinh = $('.pheptinhmaytinh').val().replace(/\n/,"");
  try{
    if($cacpheptinh.length > 0){
      var $test = $('.btt-console.active').text();
      if($cacpheptinh.match(/[a-fA-F0-9]+/) && $test == "HEX"){
        var $pheptinhdec = $cacpheptinh.replace(/([a-fA-F0-9]+)/gi,function(e){
          return hex2dec(e);
        });
        var $result = eval($pheptinhdec);
        $('.pheptinhmaytinh').val($cacpheptinh);
        $('.ketquatinhtoan').html($cacpheptinh);
        $('.oketquadatinh').text(String(dec2hex($result)).replace(/(\d+\.\d{5})\d+/,"$1"))
      }
      else{
        var $result = eval($cacpheptinh);
        $('.pheptinhmaytinh').val($cacpheptinh);
        $('.ketquatinhtoan').html($cacpheptinh);
        $('.oketquadatinh').text(String($result).replace(/(\d+\.\d{5})\d+/,"$1"));
      }
    }
    else{
      $('.ketquatinhtoan,.oketquadatinh').html("");
    }
  }
  catch{
  }
}

function clearCals($test){
  if($test){
    $('.pheptinhmaytinh').val("");
    $('.ketquatinhtoan,.oketquadatinh').html("");
  }
  else{
    var $cacpheptinh = $('.pheptinhmaytinh').val();
    if($cacpheptinh.indexOf("=") > -1){
      $('.pheptinhmaytinh').val("");
      $('.ketquatinhtoan,.oketquadatinh').html("");
    }
    else{
      $cacpheptinh = $cacpheptinh.substring(0,($cacpheptinh.length - 1));
      $('.pheptinhmaytinh').val($cacpheptinh);
      $('.ketquatinhtoan').html($cacpheptinh);
      ketquapheptinh();
    }
  }
}

function pheptinhtoan(){
  
}

function swapMaytinh(e){
  var $text = $(e).text();
  $('.btt-console.active').removeClass("active");
  $(e).addClass("active");
  var $value = $('.pheptinhmaytinh').val();
  var $ketqua = $('.oketquadatinh').html();
  if($value.length == 0 && $ketqua.length > 0){
    $value = $ketqua;
  }
  if($value.length > 0 || $ketqua.length > 0){
    if($value.match(/\+|\-|\*|\-|\=/)){
      
      if($text == "DEC"){
        $('.numberHex').hide();
        $value = hex2dec($ketqua.replace(/\s/gi,""));
      }
      else{
        $('.numberHex').show();
        $value = dec2hex($ketqua.replace(/\s/gi,""));
      }
      $('.pheptinhmaytinh').val($value);
      $('.ketquatinhtoan,.oketquadatinh').html($value);
    }
    else{
      if($text == "DEC"){
        $value  = hex2dec($value.replace(/\s/gi,""));
        $('.numberHex').hide();
      }
      else{
        $value = dec2hex($value.replace(/\s/gi,""));
        $('.numberHex').show();
      }
      $('.pheptinhmaytinh').val($value);
      $('.ketquatinhtoan,.oketquadatinh').html($value);
    }
  }
}

function copyValue(e,a){
  clearCals(true)
  if(a){
    var $input = $(e).closest("li").find("input");
    if($input.length > 0){
      var $value = $(e).closest("li").find("input").val().replace("0x","");
    }
    else{
      var $value = $(e).closest("li").find("span").text().replace("0x","");
    }
    $('.hexButton').trigger("click");
  }
  else{
    var $value = $(e).closest("li").find("span").text().replace("0x","");
    $('.decButton').trigger("click");
  }
  themPhepTinh($value);
  focusCals();
}
