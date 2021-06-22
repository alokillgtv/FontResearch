
// Hàm lấy dữ liệu hex và chuyển nó vào form HEX và ASNII
function setFileHex(){
  var $hex = $('#test').val(); // Lấy text file HEX
  var $byte = $('.input-byte-rows').val();// Lấy số byte trong một hàng
  var $regexp = new RegExp("(.{"+$byte * 2+"})","gi");// Tạo một regexp để lấy số byte trong một hàng
  var $hexSplit = $hex.split($regexp);// Tiến hành tách các hàng ra
  var $hexFile = "";
  var $textHtml = "";
  var $textBase = "";// Tạo các biến chứa dữ liệu
  var $numberRow = 0;// Tạo biến chứa dòng hiện tại
  $ASNIITEXT = "";// Xóa file HEX cũ
  for(var $h = 0;$h < $hexSplit.length;$h++){// Chạy lập theo từng hàng
    var $block = $hexSplit[$h];// Lấy từng hàng
    if($block != ""){// Nếu hàng trống thì bỏ qua
      $numberRow = $numberRow + 1;// Cộng 1 hàng vào
      var $ascii = hex2ascii($block).replace(/[^\u20-\u1f\u80-\ua1]|\</gi,".");// Chuyển từ hex sang ANSII và replace các ký tự đặc biệt
      $textBase += $ascii + "\n";// Nối dữ liệu ASNII dạng text
      $ASNIITEXT += $ascii + "\n";// Tạo 1 file ASNII mới
      $textHtml += $ascii + "<br>";// Nối dữ liệu ASNII dạng HTML
      $hexFile += $block.match(/(.{2})/gi).join(" ") + "\n";// Tiến hành chuyển hex sang có khoảng trống dễ nhìn
    }
  }
  var $HeadNumber = "";// Hàm chứa dòng head đếm số byte trong một hàng
  for(var $y = 0;$y < $byte;$y++){
    $HeadNumber += dec2hex($y,2) + " ";// Nối các số lại thành hàng
  }
  var $leftNumber = "";// Tạo biến chứa số offset cột trái
  //console.log($numberRow);
  for(var $s = 0;$s < $numberRow;$s++){// Chạy vòng lập để tạo cột offset
    $leftNumber += '<div class="left-row-hex">' + dec2hex(($s * $byte),4,8) + "</div>";
  }
  $('.item-count-head span').text($HeadNumber);// Thêm head đếm số vào hàng
  $('.body-output-text-file-hex').html($textHtml); // Thêm dữ liệu ASNII html
  $('.textarea-output-text-file-hex').val($textBase);// Thêm dữ liệu ASNII text
  $('.offset-text-file-hex').html($leftNumber);// Thêm cột trái offset vào
  var $width = $('.item-count-head')[0].clientWidth;// Tính chiều dài của cột HEX
  $('.textarea-file-hex').css("width",$width + 5);// Gán chiều dài vào form HEX
  $HEXTEXTAREA = $hexFile;// Lưu dữ liệu HEXTAREA lại
  $('.textarea-file-hex').val($hexFile);// Chèn dữ liệu hex vào form
  $('.textarea-file-hex-copy').html($hexFile.replace(/\n/gi,"<br>"))
  //TextareaHeight(); // Chạy hàm thiếp lập chiều cao form
}

function GetCusorText(e){// Hàm chọn 1 ký tự ở khung ASNII
  try{
    var $byte = Number($('.input-byte-rows').val()) + 1;// lấy số buye trong 1 hàng
    var $textarea = $ASNIITEXT.replace(/\n/gi,"<br>");// Chuyển dữ liệu ASNII cũ để phục hồi lại
    $('.body-output-text-file-hex').html($textarea);// Xóa các hightlight cũ đi
    var pos = getCursorPos(e);// Lấy vị trí con trỏ ở khung HEX
    pos.end = pos.end-Math.floor(pos.end/$byte)// Vị trí cuối chính xác của con trỏ
    pos.start = pos.start-Math.floor(pos.start/$byte); // Vị trí đầu chính xác của con trỏ
    setFormOffset(pos.start * 3,pos.end * 3,((Number(pos.end) - Number(pos.start)) * 3)); // Thêm vào form offset
    var $BeginOffset = dec2hex(pos.start);// Tính Begin Offset của khối hex mà bạn chọn
    var $endOffset = dec2hex(pos.end);// Tính End Offset của của khối hex mà bạn chọn
    var $length = dec2hex(pos.end - pos.start);// Tính độ dài của khối hex mà bạn chọn
    //console.log(pos);
    pos.end = Number(pos.end) * 3;// Offset bắt đầu chính xác bên khung HEX
    pos.start = Number(pos.start) * 3;// Offset kết thúc chính xác bên khung HEX
    $('.textarea-file-hex').focus();// Di chuyển con trỏ vào khung HEX để chọn khối
    setCursorPos($('.textarea-file-hex')[0], pos.start, pos.end+2);// Chọn khối HEX với offset khối đã chọn
    if(pos.end == pos.start){
      pos.end = pos.start + 2
    }
    var $select = $('.textarea-file-hex')[0].value.substring(pos.start, pos.end).replace(/\s/gi,"");// Lấy dữ liệu đã chọn
    if($select.length < 20){// Nếu dữ liệu dưới 10 byte thì chuyển dữ liệu
      convertValue($select);// Chuyển các dữ liệu đã chọn thành từng giá trị
    }
    //console.log($select);
    fillHighlight(pos);// Bôi đen khung ASNII tương ứng với khối HEX đã chọn
    $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"}); // Cuộn đến vị trí đã chọn
    setTimeout(function(){
      $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    },1);
  }
  catch(e){
    console.log("Lỗi GetCusorText(): " + e)
  }
}

function GetCusor(e){// Hàm thực thi khi chọn con trỏ ở khung HEX
  try{
    var $object = {} // Tạo biến lưu giá trị chuyển đổi của khối hex
    var pos = getCursorPos(e);// Lấy vị trí con trỏ hiện tại
    if(pos.end == pos.start){// Nếu con trỏ không chọn khối
      pos.end = pos.end + 1;
      pos.start = pos.start - 1;// Tính toán lại con trỏ để lấy 1 byte HEX
    }
    var $end = Math.floor(pos.end / 3);// Tính vị trí chính xác đối với khung ASNII
    var $start = Math.floor(pos.start / 3);
    setCursorPos($('.textarea-file-hex')[0], pos.start, pos.end);// Đặt con trỏ vào đúng vị trí để lấy 1 byte
    var $select = $('.textarea-file-hex')[0].value.substring(pos.start, pos.end);// Lấy dữ liệu với dữ liệu khối đã chọn
    //console.log($select);
    $select = $select.replace(/\n/gi,"")
    if(/^\s\S\S.*?\s$/.test($select)){// Tính lại vị trí khi chọn khối Ví dụ: " 00 00 "
      pos.end = pos.end - 1;
      pos.start = pos.start + 1
      //console.log("R" + 5);
    }
    else if(/^\S\s.*?\s$|^\S\s$/.test($select)){// Tính lại vị trí khi chọn khối Ví dụ: "8 00 0B 00 ","0 "
      pos.start = pos.start - 1;
      pos.end = pos.end - 1;
      //console.log("R" + 3);
    }
    else if(/^\s\S\S.*?\s\S$|^\s\S$/.test($select)){// Tính lại vị trí khi chọn khối Ví dụ: " 00 00 10 0"," 0"
      pos.start = pos.start + 1;
      pos.end = pos.end + 1;
      //console.log("R" + 4);
    }
    else if(/^\S\S.*?\s$|^\S\S\s$|^\S\s$/.test($select)){// Tính lại vị trí khi chọn khối Ví dụ: "00 00 "
      pos.end = pos.end - 1;
      //console.log("R" + 6);
    }
    else if(/^\S\s.*?\s\S$|^\S\s\S$/.test($select)){// Tính lại vị trí khi chọn khối Ví dụ: "0 00 00 0","0 0"," 00 00 10 0"
      pos.end = pos.end + 1;
      pos.start = pos.start - 1
      //console.log("R" + 7);
    }
    else if(/^\s\S\S$|^\s\S\S.*?$/.test($select)){// Tính lại vị trí khi chọn khối Ví dụ:  " 00"," 0"
      pos.start = pos.start + 1
      //console.log("R" + 8);
    }
    else if(/^\S\s.*?$/.test($select)){// Tính lại vị trí khi chọn khối ở đầu Ví dụ:  "0 00"," 0"
      pos.start = pos.start - 1
      //console.log("R" + 1);
    }
    else if(/^.*?\s\S$/.test($select)){// Tính lại vị trí khi chọn khối ở đầu Ví dụ:  "00 0"
      pos.end = pos.end + 1;
      //console.log("R" + 2);
    }
    $end = pos.end;
    $start = pos.start;
    //console.log(pos);
    var $length = Math.floor($end - $start) + 1;// Tính độ dài của khối
    $('.textarea-file-hex').focus();// Đặt con trỏ vào lại khung hex
    setCursorPos($('.textarea-file-hex')[0], pos.start, pos.end);// Di chuyển con trỏ đến vị trí khối
    var $select = $('.textarea-file-hex')[0].value.substring(pos.start, pos.end).replace(/\s/gi,"");//Lấy dũ liệu khối đã chọn
    $object.type = false;// Tạo biến kiểm tra dữ liệu
    if($select.length < 32){// Nếu dữ liệu dưới 16 byte thì chuyển đổi
      $object.type = true;// Nếu dữ liệu chuyển đổi được
      $('.input-hex-calc-swap').val($select);// Chèn khối hex đã chọn vào khung
      $object.value = convertValue($select);// Chuyển đổi dữ liệu
    }
    else{
      convertValue("")
    }
    fillHighlight(pos)// Highlight khung ASNII
    setFormOffset($start,$end,$length); // Thêm vào form offset
    $object.pos = pos;// Thêm object vị trí con trỏ
    $OBJECTCUSOR = $object;// Lưu dữ liệu vào biến toàn cục
  }
  catch(e){
    console.log("Lỗi GetCusor(): " + e)
  }
}
/*
function subString($start,$end,$string){// Hàm tách dữ liệu theo offset
  var $object = {};// Tạo biến object
  var $length = $string.length;// Tổng số ký tự của đoạn string
  $object.beginString = $string.substring(0,$start);// Lấy từ đầu string cho đến vị trí bắt đầu con trỏ
  $object.endString  = $string.substring($end,$length);// Lấy từ vị trí kết thúc con trỏ cho đến kết thúc string
  $object.getString = $string.substring($start,$end);// Lấy đoạn string từ đầu cho đến vị trí kết thúc con trỏ
  return $object;// Trả về dữ liệu lấy được
}
*/

function subString($arraylist,$string,$saveStart){// Hàm tách dữ liệu theo offset
  var $arraylist = $arraylist.sort(function(a, b) {
    return a[0] - b[0];
  });
  $DELETEOFFSET = $arraylist;
  var $newObject = {};
  var $splitString = [];
  var $endSplit = 0;
  var $length = $string.length;
  var $startEnd = 0;
  var $endEnd = 0;
  $newObject.lineNumber = false;
  for(var $k = 0;$k < $arraylist.length;$k++){
    var $splitBlock = $arraylist[$k];
    var $start = $splitBlock[0];
    var $end = $splitBlock[1];
    var $item = [];
    if($saveStart == $start){
      $newObject.lineNumber = $k;
    }
    if($k < ($arraylist.length - 1)){
      $item.push($string.substring($endSplit,$start));
      $item.push($string.substring($start,$end));
      $splitString.push($item);
      $endSplit = $end;
    }
    if($k == ($arraylist.length - 1)){
      $item.push($string.substring($endSplit,$start));
      $item.push($string.substring($start,$end));
      $splitString.push($item);
      var $item = [];
      $item.push($string.substring($end,$length));
      $item.push("");
      $splitString.push($item);
      $startEnd = $end;
      $endEnd = $length;
    }
  }
  $newObject.string = $splitString;
  return $newObject;
}

function SAVEchange(){
  $SAVECHANGE = [];
  $('.block-highlight').each(function(){
    var $box = $(this);
    var $startOffset = $box.attr("startoffset");
    var $title = $box.find(".select-title-HL option:selected").text();
    var $Value = $box.find(".select-title-HL option:selected").val();
    var $type = $('.select-type-HL option:selected').val();
    var $newObj = {};
    $newObj.title = $title;
    $newObj.value = $Value;
    $newObj.type = $type;
    $newObj.start = $startOffset;
    $SAVECHANGE.push($newObj);
  });
}

function ChangeSAVE(){
  for(var $h = 0;$h < $SAVECHANGE.length;$h++){
    var $block = $SAVECHANGE[$h];
    var $startOffset = $block.start;
    var $title = $block.title;
    var $Value = $block.value;
    var $type = $block.type;
    var $box = $('.block-highlight[startoffset="'+$startOffset+'"]');
    var $selectTitle = $box.find(".select-title-HL");
    var $selectType = $box.find(".select-type-HL");
    $selectTitle.val($Value);
    $selectType.val($type);
    $box.find(".body-arrow").text($title);
    selectTitleHL($selectTitle[0]);
    myTypeHL($selectType[0]);
  }
}

function removeToolHex(){
  $('.textarea-file-hex-copy').html($HEXTEXTAREA.replace(/\n/gi,"<br>"))
  $OBJECTCUSOR = ""// Tạo biến lưu dữ liệu con trỏ hex
  $OBJECTHLOFFSET = [];
  $OBJECTHL = []// Tạo biến lưu dữ liệu highlight
  $OBJECEDITTHL = [];//
  $OFFSETEDIT = [];//
  $DELETEOFFSET = [];
}

function openToolHex(){
  if($OBJECTCUSOR == ""){
    alert("Vui lòng ghim bên cột HEX.")
    return;
  }
  //$('.textarea-file-hex-copy').html($HEXTEXTAREA.replace(/\n/gi,"<br>"))// Phục hồi lại dữ liệu cũ, xóa các highlight trước
  SAVEchange();
  var $itemOffset = [];
  var $saveStart = $OBJECTCUSOR.pos.start;
  $itemOffset.push($OBJECTCUSOR.pos.start);
  $itemOffset.push($OBJECTCUSOR.pos.end);
  $OBJECTHLOFFSET.push($itemOffset);
  var $getObject = subString($OBJECTHLOFFSET,$HEXTEXTAREA,$saveStart)
  $OBJECTHL = $getObject.string;
  console.log($getObject)
  $OBJECEDITTHL = $OBJECTHL;
  $('.block-highlight.active').removeClass("active");// Ẩn highlight đang edit
  for($k = 0;$k < $OBJECTHL.length;$k++){
    if($k < ($OBJECTHL.length - 1)){
      var $startOffset = $DELETEOFFSET[$k][0];
      var $endOffset = $DELETEOFFSET[$k][1];
    }
    else{
      var $startOffset = "";
      var $endOffset = "";
    }
    var $lineBlockHex = $OBJECTHL[$k][1];
    var $class = "";
    if($k == $getObject.lineNumber){
      $class = "active";
    }
    //var $hexBlock = subString($OBJECTCUSOR.pos.start,$OBJECTCUSOR.pos.end,$HEXTEXTAREA);
    //console.log($hexBlock.getString);
    if($lineBlockHex != ""){
      var $splitBR = $lineBlockHex.split("\n");
      var $lineStringHex = [];
      for(var $d = 0;$d < $splitBR.length;$d++){
        var $lineHEX = $splitBR[$d];
        $lineStringHex.push('<span class="text-hex-highlight">'+$lineHEX+'</span>');
      }
      $lineStringHex = $lineStringHex.join("<br>");
      var $selectTitle = $('.select-block.select-title')[0].outerHTML.replace('<select class=\"select-block select-title\" onchange=\"selectType(this)\">','<select class=\"select-block-HL select-title-HL\" onchange="selectTitleHL(this)">');
      var $selectType = $('.select-block.select-type')[0].outerHTML.replace('<select class=\"select-block select-type\" onchange=\"myType(this)\">','<select class=\"select-block-HL select-type-HL\" onchange=\"myTypeHL(this)\">');
      var $htmlBlock = '\
      <span blockid="'+$k+'" startOffset="'+$startOffset+'" endOffset="'+$endOffset+'" class="block-highlight '+$class+'"><span class="arrow-title"></span>\
        <span class="full-text-high" stringOG="'+$lineBlockHex+'" >'+$lineStringHex+'</span>\
        <span class="body-highlight">\
          <span class="select-highlight">\
            <label><span>Tiêu Đề:&nbsp;</span>'+$selectTitle+'</label>\
            <label><span>Kiểu:&nbsp;</span>'+$selectType+'</label>\
          </span>\
          <span class="tool-result-highlight">\
            <button title="Lưu vị trí ghim này." onclick="saveHighLight(this,true)" class="button-highlight save-buttonHL"><i class="far fa-eye-slash"></i>&nbsp;Ẩn</button>\
            <button title="Xóa vị trí ghim này." onclick="saveHighLight(this,false)" class="button-highlight delete-buttonHL"><i class="fas fa-times"></i>&nbsp;Xóa</button>\
          </span>\
          <span class="result-highlight">\
            <span class="number-result-hightlight">\
            </span>\
          </span>\
        </span>\
      </span>\
      ';
      //$('.hight-light-hex').append($htmlToolHL);
      $OBJECEDITTHL[$k][1] = "##" + $htmlBlock + "##";
    }
    else{
      $OBJECEDITTHL[$k][1] = $OBJECTHL[$k][1];
    }
  }
  var $stringAll = $OBJECEDITTHL.join("");
  $stringAll = $stringAll.replace(/\n/gi,"<br>").replace(/\,/gi,"").replace(/\s+\</gi,"<").replace(/\>\s+/gi,">").replace(/##/gi," ").replace(/\s\s/gi," ").replace(/thistrue/gi,"this,true").replace(/thisfalse/gi,"this,false");
  $('.textarea-file-hex-copy').html($stringAll);
  setTimeout(function(){
    ChangeSAVE();
  },1000)
}//<span>Kết Quả: </span><label></label>\

function myTypeHL(e){
  var $box = $(e).closest(".block-highlight")
  var $type = Number($(e).find("option:selected").val());
  var $hex = $box.find(".text-hex-highlight").text().replace(/\s/gi,"");
  var $length = $hex.length;
  if($length > 10 || $length == 0){
    alert("Vui lòng chỉ chọn khối hex nhỏ hơn 5 byte để xem kết quả chuyển đổi.");
    return false;
  }
  var $value = convertValue($hex);
  var $result = "";
	switch($type){ // Kiểm tra xem kiểu dữ liệu của block
		case 0:	//Character
      $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.asnii+'</label></div>'
      break;
		case 1:	//Decimal
			$result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.dec+'</label></div>'
			$result += '<div><span>Swap: </span><label>'+$value.decSwap+'</label></div>'
      break;
		case 2:	//Hex
			$result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>0x'+$value.hex+'</label></div>'
			$result += '<div><span>Swap: </span><label>0x'+$value.swap+'</label></div>'
      break;
		case 3:	//Float
			if($value.Float){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.Float+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.FloatSwap+'</label></div>'
      }
      else{
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>Không Phải Float</label></div>'
        $result += '<div><span>Swap: </span><label>Không Phải Float</label></div>'
      }
      break;
		case 4:	//UV Left
			if($value.uv.type){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.uv.width+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.uv.widthSwap+'</label></div>'
      }
      else{
        if($value.uv.value){// Nếu không có font ảnh
          alert($value.uv.value);
        }
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>Không Phải UV</label></div>'
        $result += '<div><span>Swap: </span><label>Không Phải UV</label></div>'
      }
      break;
		case 5:	//UV Top
			if($value.uv.type){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.uv.heigth+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.uv.heightSwap+'</label></div>'
      }
      else{
        if($value.uv.value){// Nếu không có font ảnh
          alert($value.uv.value);
        }
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>Không Phải UV</label></div>'
        $result += '<div><span>Swap: </span><label>Không Phải UV</label></div>'
      }
      break;
		case 6:	//UV Right
			if($value.uv.type){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.uv.width+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.uv.widthSwap+'</label></div>'
      }
      else{
        if($value.uv.value){// Nếu không có font ảnh
          alert($value.uv.value);
        }
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>Không Phải UV</label></div>'
        $result += '<div><span>Swap: </span><label>Không Phải UV</label></div>'
      }
      break;
		case 7:	//UV Bottom
			if($value.uv.type){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.uv.heigth+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.uv.heightSwap+'</label></div>'
      }
      else{
        if($value.uv.value){// Nếu không có font ảnh
          alert($value.uv.value);
        }
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>Không Phải UV</label></div>'
        $result += '<div><span>Swap: </span><label>Không Phải UV</label></div>'
      }
      break;
		case 8:	//Negative Hex
			if($value.Negative){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.Negative+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.NegativeSwap+'</label></div>'
      }
      break;
    case 9: // Text
      $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.asnii+'</label></div>'
      break;
		case 10:	//UV Xoffset
			if($value.uv.type){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.uv.width+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.uv.widthSwap+'</label></div>'
      }
      else{
        if($value.uv.value){// Nếu không có font ảnh
          alert($value.uv.value);
        }
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>Không Phải UV</label></div>'
        $result += '<div><span>Swap: </span><label>Không Phải UV</label></div>'
      }
      break;
		case 11:	//UV Yoffset
			if($value.uv.type){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.uv.heigth+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.uv.heightSwap+'</label></div>'
      }
      else{
        if($value.uv.value){// Nếu không có font ảnh
          alert($value.uv.value);
        }
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>Không Phải UV</label></div>'
        $result += '<div><span>Swap: </span><label>Không Phải UV</label></div>'
      }
      break;
		case 12:	//UV Xadvance
			if($value.uv.type){
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>'+$value.uv.width+'</label></div>'
        $result += '<div><span>Swap: </span><label>'+$value.uv.widthSwap+'</label></div>'
      }
      else{
        if($value.uv.value){// Nếu không có font ảnh
          alert($value.uv.value);
        }
        $result += '<div><span>Gốc:&nbsp;&nbsp;</span><label>Không Phải UV</label></div>'
        $result += '<div><span>Swap: </span><label>Không Phải UV</label></div>'
      }
      break;
	}
  $box.find('.number-result-hightlight').html($result);
}

function focusTextarea(e,b){
  if(b){
    $('.textarea-file-hex-copy').removeClass("focus")
  }
  else{
    $('.textarea-file-hex-copy').addClass("focus")
    hexEdit(e);
  }
  //$box.removeClass("active");
}

function selectTitleHL(e){// Hàm chọn kiểu dữ liệu dựa trên tiêu đề dữ liệu
	var $select = $(e).find("option:selected").val();// Lấy kiểu dữ liệu
  var $text = '<span class="body-arrow">' + $(e).find("option:selected").text() + '</span>';
	var $box = $(e).closest(".block-highlight");// Chọn thành phần li chứa nó
  $box.find(".arrow-title").html($text);
  var $selectType = $box.find(".select-type-HL");
	switch(Number($select)) {// Kiểm tra xem kiểu dữ liệu nào
    case 0:
      // Nếu là character
			$box.find(".select-type-HL").val(0);
      break;
		case 9:
			// Nếu là UV left
			$box.find(".select-type-HL").val(4);
			break;
		case 10:
			// Nếu là UV Top 
			$box.find(".select-type-HL").val(5);
			break;
		case 11:
			// Nếu là UV Right 
			$box.find(".select-type-HL").val(6);
			break;
		case 12:
			// Nếu là UV Top 
			$box.find(".select-type-HL").val(7);
			break;
		case 13:
			// Nếu là Uknown 
			$box.find(".select-type-HL").val(2);
			break;
		case 19:
			// Nếu là Xoffset
			$box.find(".select-type-HL").val(8);
			break;
		case 20:
			// Nếu là Yoffset
			$box.find(".select-type-HL").val(8);
			break;
		case 22:
			$box.find(".select-type-HL").val(9);
			break;
		case 23:
			// Nếu là UV Xoffset
			$box.find(".select-type-HL").val(10);
			break;
		case 24:
			// Nếu là UV Yoffset
			$box.find(".select-type-HL").val(11);
			break;
		case 25:
			// Nếu là UV Xadvance
			$box.find(".select-type-HL").val(12);
      break;
		default:
			$box.find(".select-type-HL").val(1);
			break;
	}
  myTypeHL($selectType[0]);
}

function convertValue($select){// Hàm chuyển đổi các dữ liệu khi chọn khối hex
  var $object = {};// Tạo một biến object chữa dữ liệu
  $object.type = false;// Tạo biến kiểm tra kiểu dữ liệu
  if($select.length > 0){// Nếu khối chọn có dữ liệu
    if($select.match(/^[a-fA-F0-9]+$/) || $select.match(/^[0-9]+$/)){// Kiểm tra xem dữ liệu là hex hoặc dec
      $object.type = true;// Dữ liệu có tồn tại
      $object.hex = $select;// Gán dữ liệu vào object hex
      $object.swap = SwapEndian($object.hex);// Chuyển khối hex swap
      $object.dec = hex2dec($object.hex);// Chuyển sang dạng Dec
      $object.decSwap = hex2dec($object.swap);// Chuyển sang dạng dec của khối hex swap
      $object.Negative = false;// Tạo object lưu số âm hex
      $object.NegativeSwap = false;// Tạo object lưu số âm khối hex swap
      $object.Float = false;// Tạo object lưu giá trị float của khối hex
      $object.uv = {};// Tạo object lưu giá trị uv của khối hex
      $object.uv.type = false;// Kiểm tra xem uv có tính được không
      $object.uv.value = "Dữ liệu UV không thể tính được.\nDo không có kích thước font ảnh.\nVui lòng chọn font ảnh để tính giá trị này."     
      $object.asnii = hex2ascii($object.hex).replace(/[^\u20-\u1f\u80-\ua1]|\</gi,".");// Lưu giá trị text của khối hex
      $('.item-little-endian span').text($object.swap);// Gán các giá trị vào cột phải dữ liệu
      $('.item-big-endian span').text($object.swap);// Gán các giá trị vào cột phải dữ liệu
      $('.item-dec-number span').text($object.dec);// Gán các giá trị vào cột phải dữ liệu
      $('.item-text-number span').text($object.asnii);// Gán các giá trị vào cột phải dữ liệu
      if($select.length <= 8){// Nếu khối hex nhỏ hơn 4 byte
        $object.Negative = numberNegative($object.hex);// Chuyển khối hex sang số âm
        $object.NegativeSwap = numberNegative($object.swap);// Chuyển khối hex swap sang số âm
        var $Negative = "<b>Origin: </b><b>" + $object.Negative + "</b><br><b>SWAP: </b><b>" + $object.NegativeSwap + "</b>";
        $('.item-Negative-number span').html($Negative);// Gán các giá trị vào cột phải dữ liệu
      }
      if($select.length == 8){// Nếu khối hex bằng 4 byte
        $object.FloatSwap = Round(hex2float($object.swap),6);// Lưu lại object Float
        $object.Float = Round(hex2float($object.hex),6);// Lưu lại object Float
        $('.item-float-number span').text($object.Float);
        var $width = $('.width-input-img').val(); // Lấy width ảnh
        var $height = $('.height-input-img').val();// Lấy height ảnh
        if($width && $height){
          $object.uv.type = true;// Có UV
          $object.uv.width = $object.Float * $width;
          $object.uv.heigth = $object.Float * $height;
          $object.uv.widthSwap = $object.FloatSwap * $width;
          $object.uv.heightSwap = $object.FloatSwap * $height;
          /*
          if($object.uv.width > $width || $object.uv.widthSwap > $width || $object.uv.heigth > $height || $object.uv.heightSwap > $height){
            $object.uv.type = false;
            $object.uv.value = false;
          }
          */
        }
      }
      else{// Nếu số liệu lớn hoặc nhỏ hơn 4 byte thì xóa float
        $('.item-float-number span').text("");
      }
    }
  }
  else{
    // Dữ liệu không phải hex hoặc quá dài, xóa các dữ liệu cột phải
    $('.item-little-endian span,.item-big-endian span,.item-dec-number span,.item-text-number span,.item-Negative-number span,.item-float-number span').text("");
    $('.input-hex-calc-swap').val("");
  }
  return $object;// Trả về các giá trị đã chuyển đổi
}

function RemoveArray($ARRAY,$number){
  var $newArray = [];
  for(var $j = 0;$j < $ARRAY.length;$j++){
    if($j != $number){
      $newArray.push($ARRAY[$j]);
    }
  }
  return $newArray;
}

function saveHighLight(e,a){// Hàm lưu hoặc xóa highlight
  var $box = $(e).closest(".block-highlight");
  if(a){
    var $class = $box.attr("class");
    if($class.indexOf("active") > -1){
      $box.removeClass("active");// Xóa active để ẩn
      $box.find(".save-buttonHL").html('<i class="far fa-eye"></i> Hiện')
    }
    else{
      $box.addClass("active");
      $box.find(".save-buttonHL").html('<i class="far fa-eye-slash"></i> Ẩn')
    }
  }
  else{
    var $value = $box.find(".full-text-high").attr("stringog");
   // console.log($value);
   // console.log($box[0].outerHTML);
    $box[0].outerHTML = $value;
    var $html = $('.textarea-file-hex-copy').html().replace(/     /gi," ");
    $('.textarea-file-hex-copy').html($html);
    var $id = $box.attr("blockid");
    $OBJECTHLOFFSET = RemoveArray($OBJECTHLOFFSET,Number($id));
    //$box.remove();
  }
}

function setFormOffset($start,$end,$length){
  var $start = Number(Math.floor($start / 3));// Lấy vị trí bắt đầu khối HEX
  var $end = Number(Math.floor($end / 3));// Lấy vị trí kết thúc khối HEX
  var $length = Number(Math.floor($length / 3));// Lấy vị trí kết thúc khối HEX
  $('.jump-byte-rows').val("0x" + dec2hex($start)); // Thêm vào form begin Start
  $('.end-byte-rows').val("0x" + dec2hex($end)); // Thêm vào form begin End
  $('.max-byte-rows').val("0x" + dec2hex($length)); // Thêm vào form length
}

function clearFill(){// Hàm xóa hightlight khung ANSII
  var $textarea = $ASNIITEXT.replace(/\n/gi,"<br>");// Lấy dữ liệu ASNII đã lưu
  $('.body-output-text-file-hex').html($textarea);// Chèn dữ liệu cũ vào form
}

function fillHighlight($pos){// Hàm hightlight khung ASNII
  //console.log("$POSHIGH: ");
  //console.log($pos);
  clearFill();// Xóa hightlight cũ
  var $byte = Number($('.input-byte-rows').val());// Lấy số byte trong một hàng
  var $start = Number(Math.floor($pos.start / 3));// Lấy vị trí bắt đầu khối HEX
  var $end = Number(Math.floor($pos.end / 3));// Lấy vị trí kết thúc khối HEX
  var $lineStart = Number(String($start / $byte).match(/\d+/)[0]);// Tính số dòng chứa vị trí bắt đầu
  var $lineEnd = Number(String($end / $byte).match(/\d+/)[0]);// Tính số dòng chứa vị trí kết thúc
  var $posStart = $start - ($lineStart * $byte);// Tính vị trí bắt đầu khối ASNII
  var $posEnd = $end - ($lineEnd * $byte);// Tính vị trí kết thúc khối ASNII
  var $listLineHTML = $ASNIITEXT.split("\n");// Tách dữ liệu ASNII ra từng dòng
  var $getLineStart = $listLineHTML[$lineStart];// Lấy dòng chứa dữ liệu bắt đầu khối ASNII
  var $getLineEnd = $listLineHTML[$lineEnd];// Lấy dòng chứa dữ liệu kết thúc khối ASNII
  //console.log($lineStart);console.log($lineEnd);
  if($lineStart < $listLineHTML.length){// Kiểm tra xem offset có vượt số dòng hay không
    if($lineStart == $lineEnd){// Nếu vị trí bắt đầu và kết thúc ở 1 dòng
      var $length = $end - $start + 1;// Tính độ dài khối
      var $regStart = new RegExp("^(.{"+$posStart+"})(.{"+$length+"})(.*?)$","gi");// Tạo một regexp để tách dữ liệu ra theo vị trí chỉ định
      var $replaceStart = $getLineStart.replace($regStart,'$1<span class="hightlight" onclick="clearFill()">$2</span>$3');// Replace dữ liệu với tag Hightlight
      $listLineHTML[$lineStart] = $replaceStart;// Lưu vị trí bắt đầu vào list dòng
    }
    else{// Nếu vị trí bắt đầu và kết thúc khác nhau
      $posEnd = Number($posEnd) + 1;// Vị trí kết thúc tăng 1 byte
      var $regStart = new RegExp("^(.{"+$posStart+"})(.*?)$","gi");// Tạo Regexp để tách chuỗi bắt đầu khối
      var $regEnd = new RegExp("^(.{"+$posEnd+"})(.*?)$","gi");// Tạo Regexp để tách chuỗi kết thúc khối
      var $replaceStart = $getLineStart.replace($regStart,'$1<span class="hightlight" onclick="clearFill()">$2');// Replace dữ liệu bắt đầu với tag Hightlight
      var $replaceEnd = $getLineEnd.replace($regEnd,'$1</span>$2');// Replace dữ liệu kết thúc
      $listLineHTML[$lineStart] = $replaceStart;// Lưu vị trí bắt đầu vào list dòng
      $listLineHTML[$lineEnd] = $replaceEnd;// Lưu vị trí kết thúc vào list dòng
      //console.log($replaceStart)
    }
    $('.body-output-text-file-hex').html($listLineHTML.join("<br>"));// Chèn dữ liệu đã thêm hightlight vào khung ASNII
  }
  else{
    alert("Vị trí START OFFSET vượt quá độ dài của file HEX\n\nHãy kiểm tra lại.");
  }
}

function getCursorPos(input) {// Hàm tính vị trí con trỏ bắt đầu và kết thúc khi ở khung TEXTAREA
  if ("selectionStart" in input && document.activeElement == input) {// Nếu vị trí bắt đầu tồn tại, và con trỏ đang ở khung TEXTAREA
    return {// Trả về giá trị
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

function setCursorPos(input, start, end) {// Hàm đặt con trỏ vào vị trí chỉ định
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

function byteRows(e){// Hàm kiểm tra số byte trong một hàng
  var $value = e.value;// Lấy số byte
  if($value < 16 || $value > 32){// Nếu số byte nhỏ hơn 16 và lớn hơn 32
    alert("Vui lòng chỉ nhập số byte từ 16 đến 32.");
  }
  else{
    setFileHex();// Tạo lại file hex với số byte chỉ định
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
  try{
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
    var $endDec = Number($start.dec) + Number($max.dec);
    var $hexEnd = dec2hex($endDec)
    setFormOffset($start.dec * 3,$endDec * 3,$max.dec * 3); // Thêm vào form offset
  }
  catch(e){
    console.log("Lỗi setRangeHight():" + e);
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
  if($Endvalue.length > 0){
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
}

function MaxOffset(e){
  var $Maxvalue = e.value;
  if($Maxvalue.length){
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
}

function JumpOffset(e){
  try{
    var $value = e.value;
    if($value.length > 0){
      var $result = getStringHex($value);
      if($result.type != "NONE"){
        var $dec = $result.dec * 3;
        $('.textarea-file-hex').focus();
        setCursorPos($('.textarea-file-hex')[0], $dec, $dec+2);
        var $byte = Number($('.input-byte-rows').val());
        var $textarea = $ASNIITEXT.replace(/\n/gi,"<br>");
        $('.body-output-text-file-hex').html($textarea);
        var $endOffset = getStringHex($('.end-byte-rows').val());
        var $maxOffset = getStringHex($('.max-byte-rows').val());
        if($endOffset.type == "NONE" && $maxOffset.type != "NONE"){
          $endOffset.dec = $maxOffset.dec - $result.dec;
        }
        if($maxOffset.type == "NONE" && $endOffset.type != "NONE"){
          $maxOffset.dec = $endOffset.dec - $result.dec;
        }
        console.log($result.dec);console.log($endOffset);console.log($maxOffset);
        setRangeHight($result,$endOffset,$maxOffset)
        //fillHighlight(pos)
        $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        setTimeout(function(){
          $('.hightlight')[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        },1);
        setFormOffset($result.dec * 3,$endOffset.dec * 3,$maxOffset.dec * 3)
      }
      else{
        alert("Vui lòng chỉ nhập dữ liệu số thập phân (DEC)\n\nhoặc dữ liệu số thập lục phân (HEX) vào ô.")
      }
    }
  }
  catch(e){
    console.log("Lỗi JumpOffset():" + e);
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
        var $ketqua = String(dec2hex($result)).replace(/(\d+\.\d{5})\d+/,"$1");
        $('.oketquadatinh').text($ketqua).attr("title",$ketqua);
      }
      else{
        var $result = eval($cacpheptinh);
        $('.pheptinhmaytinh').val($cacpheptinh);
        $('.ketquatinhtoan').html($cacpheptinh);
        var $ketqua = String($result).replace(/(\d+\.\d{5})\d+/,"$1");
        $('.oketquadatinh').text($ketqua).attr("title",$ketqua);
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

function swapMaytinh(e){
  var $text = $(e).text();
  if($text == "DEC"){
    $('.numberHex').hide();
  }
  else{
    $('.numberHex').show();
  }
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
        $value = hex2dec($ketqua.replace(/\s/gi,""));
      }
      else{
        $value = dec2hex($ketqua.replace(/\s/gi,""));
      }
      $('.pheptinhmaytinh').val($value);
      $('.ketquatinhtoan,.oketquadatinh').html($value);
    }
    else{
      if($text == "DEC"){
        $value  = hex2dec($value.replace(/\s/gi,""));
      }
      else{
        $value = dec2hex($value.replace(/\s/gi,""));
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
