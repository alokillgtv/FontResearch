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
  var $textFile = '';
  var $numberRow = 0;
  for(var $h = 0;$h < $hexSplit.length;$h++){
    var $block = $hexSplit[$h];
    if($block != ""){
      $numberRow = $numberRow + 1;
      var $ascii = hex2ascii($block).replace(/[^\u20-\u1f\u80-\ua1]|\</gi,".");
      var $character = $ascii.match(/(.)/gi);
      var $lineText = '<div class="line-text-hex">';
      for(var $n = 0;$n < $character.length;$n++){
        var $char = $character[$n];
        $lineText += '<span class="char-text-hex">' + $char + '</span>';//|[^\u00A0-\u00FF]
      }
      $textFile += $lineText + "</div>"
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
  $('.output-text-file-hex').html($textFile);
  $('.offset-text-file-hex').html($leftNumber);
  var $width = $('.item-count-head')[0].clientWidth;
  $('.textarea-file-hex').css("width",$width + 5);
  $HEXTEXTAREA = $hexFile;
  $('.textarea-file-hex').val($hexFile);
  TextareaHeight();
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
  var $end = Math.floor(pos.end / 3);
  var $start = Math.floor(pos.start / 3);
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
  var $select = $('.textarea-file-hex')[0].value.substring(pos.start, pos.end).replace(/\s/gi,"");
  console.log($select);
  if($select.length < 20){
    $('.item-hex-code span,.item-little-endian span').text("0x" + $select);
    $('.item-big-endian span').text("0x" + SwapEndian($select));
    $('.item-dec-number span').text(hex2dec($select));
    $('.item-text-number span').text(hex2ascii($select).replace(/[^\u20-\u1f\u80-\ua1]|\</gi,"."));
    if($select.length == 8){
      $('.item-float-number span').text(Round(hex2float($select),6));
    }
  }
  var $length = Math.floor($end - $start) + 1;
  $('.item-offset-hex span').text(dec2hex($start));
  $('.item-block-hex span').text(dec2hex($start) + "-" + dec2hex($end));
  $('.item-length-hex span').text(dec2hex($length));
  $('.char-text-hex').removeClass("hightLight");
  if($length < 500){
    for(var $v = 0;$v < $length;$v++){
      var $eq = $start + $v;
      $('.char-text-hex:eq('+$eq+')').addClass("hightLight");
    }
  }
}

function hexEdit(e){
  $(e).val($HEXTEXTAREA);
  //alert("Vui lòng không chỉnh sửa Hex ở đây");
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
  console.log($('.char-text-hex').eq($start.dec));
  $('.char-text-hex').eq($start.dec)[0].scrollIntoView({behavior: "smooth", block: "center"});
  setTimeout(function(){
    $('.char-text-hex').eq($start.dec)[0].scrollIntoView({behavior: "smooth", block: "center"});
  },500);
  var $hexEnd = dec2hex(Number($start.dec) + Number($start.dec))
  $('.item-offset-hex span').text($start.hex);
  $('.item-block-hex span').text($start.hex + "-" + $hexEnd.replace("0x",""));
  $('.item-length-hex span').text($max.hex);
  $('.char-text-hex').removeClass("hightLight");
  if($max.dec < 500){
    for(var $v = 0;$v < $max.dec;$v++){
      var $eq = Number($start.dec) + $v;
      $('.char-text-hex:eq('+$eq+')').addClass("hightLight");
      //$('.char-text-hex:eq('+$eq+')')[0].classList.add("hightLight");
    }
  }
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
    console.log($('.char-text-hex:eq('+$result.dec+')'));
    $('.char-text-hex:eq('+$result.dec+')')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    setTimeout(function(){
      $('.char-text-hex:eq('+$result.dec+')')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    },500);
    $('.item-offset-hex span').text($result.hex);
    $('.item-block-hex span').text($result.hex + "-" + dec2hex(Number($result.dec)+2));
    $('.item-length-hex span').text(1);
    $('.char-text-hex').removeClass("hightLight");
    $('.char-text-hex:eq('+$result.dec+')').addClass("hightLight");
  }
  else{
    alert("Vui lòng chỉ nhập dữ liệu số thập phân (DEC)\n\nhoặc dữ liệu số thập lục phân (HEX) vào ô.")
  }
}