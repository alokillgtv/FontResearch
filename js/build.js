/* Script tạo các Table phân tích */

/*
function dataChange($AllResult,$dataList,$box){// Hàm khởi chạy khi phân tích dữ liệu từ autoit và khởi chạy nó
	//var $data = $('#formData').val();// Lấy dữ liệu từ form
	sendReturn($AllResult,$dataList,$box);// Gửi dữ liệu đi
}
*/

function sendReturn($data,$dataList,$box){// Hàm lấy dữ liệu từ autoit post qua
  $SUPERDATA.data = $data;
	var $split = $data.split("##");// Tách các dữ liệu từ ký tự ##
	var $result = [];// Tạo biến array mới
	for($j = 0;$j < $split.length;$j++){// Chạy lập từng dữ liệu
		var $blocksplit = $split[$j].split("$$$$");// Tách dữ liệu để lấy từng kiểu dữ liệu
		var $block = $blocksplit[0];// Lấy kiểu dữ liệu
		var $blockHex = $blocksplit[1];// Lấy hex của dữ liệu
    var $calc = $blocksplit[2];// Lấy phép tính của dữ liệu
		var $column = [];// Tạo array cột
		if($block.length > 0){// Nếu dữ liệu tồn tại
			var $cut = $block.split("||");// Tách kiểu dữ liệu ra
			var $cutHex = $blockHex.split("||");// Tách từng hex của kiểu dữ liệu ra
      var $cutCalc = $calc.split("||");// Tách từng phép tính của kiểu dữ liệu ra
			for(var $g = 0;$g < $cut.length;$g++){// Chạy lập từng kiểu dữ liệu
				if($cut[$g] != ""){// Nếu dữ liệu tồn tại
					var $item = new Object();// Tạo 1 biến chứa object
					$item.title = $box.find('.item-block:eq('+$g+') .select-title :selected').text();// Lấy tiêu đề kiểu dữ liệu
					$item.value = $cut[$g];// Gán kết quả kiểu dữ liệu
					$item.hex = $cutHex[$g];// Gám hex của kiểu dữ liệu
          $item.calc = $cutCalc[$g];// Gán phép tính kiểu dữ liệu
					$column.push($item);// Nạp object vào array kiểu dữ liệu
				}
			}
			$result.push($column);// Nạp array kiểu dữ liệu vào khối dữ liệu
		}
	}
  $SUPERDATA.result = $result;
  //console.log($dataList.structTitle)
  if($dataList.structTitle == "Dữ Liệu Ký Tự"){
    dataCheck($result,$box);// Chạy hàm kiểm tra dữ liệu để tạo table
    //console.log($dataList.structTitle)
  }
  else{
    dataValue($result)
    //console.log($dataList.structTitle)
  }
}

function CompleteMap(){
  changeValue();// Chạy hàm thay đổi dữ liệu
  widthTH();
  changeImg($('.button-page-img.active')[0]); // Chạy hàm thay đổi trang ảnh
  setTimeout(function(){
    $('.data-table .table-data-body').hide();
  },5000);
  
  if($ERROR){
    alert("Có lẽ dữ liệu mà bạn phân tích chưa đúng.\n\nBạn hãy thử lại xem.")
  }
}

// Hàm kiểm tra file fnt hoặc text
function FNTcheck(){
  if(document.getElementById("fontmapfile").files.length > 0){
    showLoad(true)
    //execscript('GetFNT("'+$pathChar+'")');// Khởi chạy hàm autoit với đường dẫn file map
    setTimeout(function(){
      FNTback();
    },500);  
    //Console.log("Đường dẫn font map",$pathChar)
  }
  else{
    if($SAVEHERE){
      var $name = $SAVEHERE.datafile;
      if($name == $HEXNAME){
        FNTback();
      }
      else{
        alert("Vui lòng chọn file "+$name+" đã dùng lần trước.");
        showLoad(false)
      }
    }
    else{
      alert("Vui lòng chọn file dữ liệu font map.")
      showLoad(false);
    }
  }
}

// Hàm lấy dữ liệu block
function getCharType($box){
  if(!$box){
    var $box = $('.item-struct:eq(0)');
  }
	var $dataChar = "";// Tạo biến array chứa dữ liệu
	$box.find('.item-block.item-char').each(function(){// Thực thi theo từng block
      if($FontMapType == 0){
        var $item = "";// Tạo một biến item chứa dữ liệu
        var $title = $(this).find('.select-title :selected').val();// Lấy tiêu đề block
        var $byte = $(this).find('.select-byte :selected').val();// Lấy số byte của block
        var $type = $(this).find('.select-type :selected').val();// Lấy kiểu dữ liệu block
        var $calsValue = $(this).find('.input-cals').val();// Lấy phép tính bổ sung của block
        if($calsValue == ""){// Nếu phép tính trống thì giá trị bằng 0
          $calsValue = "+0";
        }
        var $save = $(this).find('#block-save:checked').val();// Kiểm tra xem có giữ nguyên dữ liệu block hay không
        if(!$save){
          $save = "False";
        }
        // Nối các dữ liệu vào biến item
        $item += $title + "##";
        $item += $byte + "##";
        $item += $type + "##";
        $item += $calsValue + "##";
        $item += $save + "##";
        $dataChar += $item + "||";
      }
      else{
        var $item = "";
        var $title = $(this).find('.select-title :selected').val();// Lấy tiêu đề block
        var $cals = $(this).find('.input-cals').val();// Lấy phép tính bổ sung của block
        if($cals == ""){// Nếu phép tính trống thì giá trị bằng 0
          $cals = "+0";
        }
        var $save = $(this).find('#block-save:checked').val();// Kiểm tra xem có giữ nguyên dữ liệu block hay không
        if(!$save){
          $save = "False";
        }
        var $regexpVal = $(this).find('.input-regexp').val(); // Lấy biểu thức chính quy và nối các dữ liệu lại
        $item += $title + "##";
        $item += $regexpVal + "##";
        $item += $cals + "##";
        $item += $save + "##";
        $dataChar += $item + "||";
      }
	})
	return $dataChar;
}

// Hàm kiểm tra file
function Bitmapcheck(){
  if(document.getElementById("fontmapfile").files.length == 0){
    showLoad(false);
    if($SAVEHERE){
      var $name = $SAVEHERE.datafile;
      if($HEXNAME != $name){
        alert("Vui lòng chọn file "+$name+" đã dùng lần trước.");
        return;
      }
    }
    else{
      alert("Vui lòng chọn file dữ liệu font map.");
      return;
    }
  }
  $('#page-result').html("");
  var $itemMax = $('.item-struct').length;
  for(var $i = 0;$i < $itemMax;$i++){
    var $box = $('.item-struct:eq('+$i+')');
    $dataList = new Object();
    $dataList.pathChar = $('#pathFont').val();// Lấy đường dẫn font map
    $dataList.pathImg = $('#pathImg').val();// Lấy đường dẫn font ảnh
    $dataList.width = $('#img-view')[0].naturalWidth;// Lấy width ảnh gốc
    $dataList.height = $('#img-view')[0].naturalHeight;// Lấy height ảnh gốc
    $dataList.structTitle = $box.find(".select-title-struct option:selected").val();
    var $charPos = $box.find(".input-offset").val();
    var $lengthBlock = $box.find(".input-max").val();
    var $maxByte = 0;
    $box.find('.select-byte option:selected').each(function(){
      var $value = Number($(this).val());
      $maxByte = $maxByte + $value;
    });
    $dataList.maxByte = $maxByte;
    $dataList.maxChar = changeHex($lengthBlock) / $maxByte;// Lấy tổng số ký tự
    $dataList.charPos = changeHex($charPos);// Lấy vị trí bắt đầu ký tự
    //console.log($dataList);
    //console.log(changeHex($lengthBlock));
    $dataList.typeChar = $('.typeChar :selected').val();// Lấy kiểu font
    $dataList.charlist = getCharType($box);// Lấy danh sách dữ liệu
    //$data = 'SendData('+$wImg+','+$hImg+','+$maxChar+','+$charPos+','+$typeChar+',"'+$charlist+'","'+$pathChar+'")';// Tạo biến chứa script khởi chạy autoit
    //execscript($data); // Chạy autoit theo hàm sẵn có
    //setTimeout(function(){
      SendData($dataList,$box)
    //},500);
  }
}

function SendData($dataList,$box){
	var $AllResult = "";// Tạo một biến chứa dữ liệu
  $FILEPOS = Number($dataList.charPos);// Lưu giá trị con trỏ file hex
  if($dataList.maxChar == 1){
    $dataList.maxChar = 2;
  }
	for(var $j = 0; $j < $dataList.maxChar - 1;$j++){ //Chạy lập qua từng ký tự
		var $blockChar = ListChar($dataList);// Lấy dữ liệu phân tích từ hàm ListChar
		$AllResult += $blockChar + "##"; //Nối bọn chúng lại bằng dấu phân tách
	}
  //$('#formData').val($AllResult);
  //console.log(JSON.stringify($dataList));
  sendReturn($AllResult,$dataList,$box);
  //dataChange($AllResult,$dataList,$box);
	//HTML_GUICtrlSetText("formData",$AllResult)	; Chuyển dữ liệu sang HTML bằng formData
	//HTML_EvalJS("dataChange()");	Khởi chạy script bên HTML
}

function ListChar($dataList){// Hàm lấy chi tiết các dữ liệu của block
	var $arrayChar = $dataList.charlist.split("||");	//Tạo một biến tách các dữ liệu file font
  //console.log($arrayChar)
	var $itemGet = ""; //Tạo biến chứa dữ liệu font
	var $itemHex = ""; //Tạo biến chứa dữ liệu hex font
	var $itemCals = ""; // Tạo biến chứa dữ liệu phép tính
	for(var $i = 0; $i < $arrayChar.length;$i++){//Chạy lập qua từng block
		var $block = $arrayChar[$i]; //Lấy từng block
    //console.log("block: " + $block);
		if($block.length > 0){//Nếu là ký tự
			var $chitiet = $block.split("##");//Tách các dữ liệu ra.
			var $title = $chitiet[0];	//Lấy tên một block
			var $byte = $chitiet[1];	//Lấy kiểu dữ liệu một block
			var $type = Number($chitiet[2]);	//Lấy giá trị byte của một block
			var $cals = $chitiet[3];	//Lấy phép tính bổ sung của block này
			var $save = $chitiet[4];	//Kiểm tra xem có cần lưu block này hay không
			var $getItem = GetBlock($title,$byte,$type,$cals,$save,$dataList);  //Chạy hàm lấy giá trị thực của block đang thực thi này
			$itemGet += $getItem[0];	//Lưu giá trị của block
			$itemHex += $getItem[1];	//Lưu block hex hiện tại của block này
			$itemCals += $cals + "||"; // Lưu block các phép tính
		}
	}
	return $itemGet + "$$$$" + $itemHex + "$$$$" + $itemCals; //Trả về dữ liệu
}

function GetBlock($title,$byte,$type,$cals,$save,$dataList){// Hàm kiểm tra từng kiểu dữ liệu
	var $value = FileRead($HEXFILE,$FILEPOS,Number($byte));	//Lấy dữ liệu hex của block
  $FILEPOS = Number($FILEPOS) + Number($byte);// Lưu lại con trỏ hiện tại
	var $byte2 = $byte;	// Tạo biến byte2 lưu độ độ dài của block
  var $result = "";
	switch($type){ // Kiểm tra xem kiểu dữ liệu của block
		case 0:	//Character
			if($dataList.typeChar == 0){
				$result = hex2dec(SwapEndian($value)); //Chuyển dữ liệu sang dạng Decimal và kiểu dữ liệu là Litter Endian
			}else{
				$result = hex2dec($value);
			}
      break;
		case 1:	//Decimal
			if($dataList.typeChar == 0){
				var $numberChange = String(hex2dec(SwapEndian($value))) + $cals; //Chuyển dữ liệu sang dạng Decimal đã được tính thêm phép tính bổ sung nếu có và kiểu dữ liệu là Litter Endian
				$result = Round(eval($numberChange),2) //Thu gọn dấu thập phân
			}else{
				$result = Round(String(hex2dec($value)) + $cals,2); //Thu gọn dấu thập phân
			}
      break;
		case 2:	//Hex
			if($dataList.typeChar == 0){
				var $numberChange = String(hex2dec(SwapEndian($value))) + $cals; //Chuyển dữ liệu sang dạng Decimal đã được tính thêm phép tính bổ sung nếu có và kiểu dữ liệu là Litter Endian
        var $numberHex = dec2hex(eval($numberChange),($byte*2)); // Chuyển số sang hex
				$result = $numberHex;
			}else{
				$numberChange = eval(hex2dec($value) + $cals);
				$result = dec2hex($numberChange,($byte*2));
			}
      break;
		case 3:	//Float
			if($dataList.typeChar == 0){
				var $hex = SwapEndian($value); //Chuyển dữ liệu sang dạng Float đã được tính thêm phép tính bổ sung nếu có và kiểu dữ liệu là Litter Endian
				var $float = hex2float($hex); // Chuyển hex sang float
				$result = Round(eval($float + $cals),2);
			}else{
				var $float = hex2float($value);
				$result = Round(eval($float + $cals),2);
			}
      break;
		case 4:	//UV Left
			if($dataList.typeChar == 0){
				var $hex = SwapEndian($value);
				var $float = hex2float($hex)
				var $left = $float * $dataList.width;
				$result = Round(eval($left + $cals),2);
			}else{
				var $float = hex2float($value);
				var $left = $float * $dataList.width;
				$result = Round(eval($left + $cals),2);
			}
      break;
		case 5:	//UV Top
			if($dataList.typeChar == 0){
				var $hex = SwapEndian($value);
				var $float = hex2float($hex)
				var $top = $float * $dataList.height;
				$result = Round(eval($top + $cals),2);   
      }else{
				var $float = hex2float($value);
				var $top = $float * $dataList.height;
				$result = Round(eval($top + $cals),2);
			}
      break;
		case 6:	//UV Right
			if($dataList.typeChar == 0){
				var $hex = SwapEndian($value);
				var $float = hex2float($hex)
				var $right = $float * $dataList.width;
				$result = Round(eval($right + $cals),2);
      }else{
				var $float = hex2float($value);
				var $right = $float * $dataList.width;
				$result = Round(eval($right + $cals),2);
			}
      break;
		case 7:	//UV Bottom
			if($dataList.typeChar == 0){
				var $hex = SwapEndian($value);
				var $float = hex2float($hex)
				var $bottom = $float * $dataList.height;
				$result = Round(eval($bottom + $cals),2);
			}else{
				var $float = hex2float($value);
				var $bottom = $float * $dataList.height;
				$result = Round(eval($bottom + $cals),2);
			}
      break;
		case 8:	//Negative Hex
			var $hexChange = SwapEndian($value);
			var $dec = numberNegative($hexChange,($byte2*2));
			$result = Round(eval($dec + $cals),2);
      break;
    case 9: // Text
      $result = hex2ascii($value);
      break;
		case 10:	//UV Xoffset
			if($dataList.typeChar == 0){
				var $hex = SwapEndian($value);
				var $float = hex2float($hex)
				var $left = $float * $dataList.width;
				$result = Round(eval($left + $cals),2);
			}else{
				var $float = hex2float($value);
				var $left = $float * $dataList.width;
				$result = Round(eval($left + $cals),2);
			}
      break;
		case 11:	//UV Yoffset
			if($dataList.typeChar == 0){
				var $hex = SwapEndian($value);
				var $float = hex2float($hex)
				var $top = $float * $dataList.height;
				$result = Round(eval($top + $cals),2);   
      }else{
				var $float = hex2float($value);
				var $top = $float * $dataList.height;
				$result = Round(eval($top + $cals),2);
			}
      break;
		case 12:	//UV Xadvance
			if($dataList.typeChar == 0){
				var $hex = SwapEndian($value);
				var $float = hex2float($hex)
				var $left = $float * $dataList.width;
				$result = Round(eval($left + $cals),2);
			}else{
				var $float = hex2float($value);
				var $left = $float * $dataList.width;
				$result = Round(eval($left + $cals),2);
			}
      break;
	}
 // console.log("$title: " + $title + " Value: " + $value + ", Pos: " + $FILEPOS + " , Byte: " + $byte + ", width: " + $dataList.width + ", height: " + $dataList.height + ", $cals: " + $cals + " $result: " + $result);
	var $arrayResult =[$result+"||",$value+"||"];
	return $arrayResult;
}

function numberNegative($hex,$byteGet){// Hàm chuyển số âm trong hex
	switch($byteGet){//Kiểm tra giá trị của byte
		case 2:// Nếu là 1 byte
			var $maxNumber = 255 ;// Giá trị tối đa là 255
      break;
		case 4://Nếu là 2 byte
			var $maxNumber = 65535 ; //Giá trị tối đa là 65535
      break;
		case 6://Nếu là 3 byte
			var $maxNumber = 16777215 ; //Giá trị tối đa là 16777215
      break;
		case 8://Nếu là 4 byte
			var $maxNumber = 4294967295 ; //Giá trị tối đa là 4294967295
      break;
	}
	var $splitNumber = ($maxNumber / 2) ; //Phân nữa giá trị tối đa
	var $numberHex = hex2dec($hex);	//Chuyển giá trị hex sang dec
	if ($numberHex > $splitNumber){// Nếu giá trị hex lớn hơn phân nữa giá trị tối đa, thì nó là số âm
		var $numberNegative = $numberHex - $maxNumber - 1;	//Tính ra số âm
	}else{
		var $numberNegative = $numberHex;
	}
	return $numberNegative// Trả về số âm
}

function fontimgfile(e){// Hàm khi chọn file image font
  var $box = $(e);// Chọn phần tử this
  var $input = document.getElementById('fontimgfile');// Tạo biến lấy input file map font
  var $files = $input.files;// Lấy file
  var $htmlItem = '<li class="item-page-img title-label">Chọn Ảnh Font</li>';
  var $numberImage = -1;
  for(var $o = 0;$o < $files.length;$o++){
    var $item = new Object();
    var $file = $files[$o];
    if($file.name.match(/\.png|\.bmp|\.jpg/)){
      $numberImage = $numberImage + 1;
      $item.name = $file.name;// Lấy tên file
      $item.path = $file.webkitRelativePath;// Lấy path file
      $item.imgpath = URL.createObjectURL($file);;// Tạo đường dẫn font ảnh
      if($numberImage == 0){
        $('#pathImg').val($item.path);// Chèn tên file vào khung đường dẫn
        $('#img-view').attr("src",$item.imgpath);// Chèn đường dẫn vào ảnh 
        $htmlItem += '<li class="item-page-img button-page-img active" imagePath="'+$item.path+'" imagePage="0" imageSrc="'+$item.imgpath+'" onclick="changeImg(this)">Ảnh 1</li>';
      }
      else{
        $htmlItem += '<li class="item-page-img button-page-img" imagePath="'+$item.path+'" imagePage="'+$numberImage+'" imageSrc="'+$item.imgpath+'" onclick="changeImg(this)">Ảnh '+($numberImage + 1)+'</li>';
      }
      $('.change-page-img').html($htmlItem);
    }
  }
}

function changeImg(e){
  var $path = $(e).attr("imagepath"); // Lấy path file ảnh;
  var $idImg = $(e).attr("imagepage"); // Lấy Id file ảnh
  var $src = $(e).attr("imagesrc"); // Lấy đường dẫn file ảnh
  var $box = $(e).closest(".change-page-img");
  var $wBefore = $('#img-view')[0].naturalWidth;// Lấy width ảnh gốc
  var $hBefore = $('#img-view')[0].naturalHeight;// Lấy height ảnh gốc
  $box.find(".active").removeClass("active");
  $(e).addClass("active");
  $('#img-view').attr("src",$src);
  $('#pathImg').val($path);
  $('.body-page-img').attr("pageimg",$idImg)
  //$('.body-page-img .char-cell').hide();
  //$('.body-page-img .char-cell[pageimg="'+$idImg+'"]').show();
  setTimeout(function(){
    var $wAfter = $('#img-view')[0].naturalWidth;// Lấy width ảnh gốc
    var $hAfter = $('#img-view')[0].naturalHeight;// Lấy height ảnh gốc
   // console.log("$wBefore: " + $wBefore);
    //console.log("$hBefore: " + $hBefore);
   // console.log("$wAfter: " + $wAfter);
    //console.log("$hAfter: " + $hAfter);
    if($wBefore != $wAfter || $hBefore != $hAfter){
      checkFont();
    }
  },1000);
}

function fontmapfile(e){// Hàm chọn file map font
  var $input = document.getElementById('fontmapfile');// Tạo biến lấy input file map font
  var file = $input.files[0];// Lấy file
  var $name = file.name;// Lấy tên file
  $('#pathFont').val($name);// Chèn tên file vào khung đường dẫn
  var fr = new FileReader();// Tạo biến đọc file
  fr.onload = receivedText;// Tiến hành đọc file và gọi hàm receivedText()
  fr.readAsText(file);// Đọc file đọc file dạng text
  function receivedText() {// Hàm đọc file text và tiến hành đọc file binary
    fr = new FileReader();// Đọc lại file
    fr.onload = receivedBinary;// Chạy hàm call back binary
    fr.readAsBinaryString(file);// Đọc file bằng binary
  }
  function receivedBinary() {// Hàm call back khi đọc file xong
    showResult(fr, "Binary");
  }
  function showResult(fr, label) {// Hàm chuyển đổi từ string sang hex
    var markup, result, n, aByte, byteStr;// Tạo các iến cần thiết
    markup = [];// Tạo biến array
    result = fr.result;// Lấy dữ liệu file
    for (n = 0; n < result.length; ++n) {// Chạy lập để đổi string sang hex
        aByte = result.charCodeAt(n);
        byteStr = aByte.toString(16);
        if (byteStr.length < 2) {
            byteStr = "0" + byteStr;
        }
        markup.push(byteStr);
    }
    if(label == "Binary"){// Chuyển đổi nếu là binary
      $HEXFILE = markup.join("").toUpperCase();
      $('#test').val($HEXFILE);
      setFileHex();
    }
  }
}

// Hàm xuất dữ liệu từ font map FNT
function FNTback(){
	try{// Chạy thử
		var $value = $('#test').val();// Lấy dữ liệu fnt hoặc text
		if($value.length > 10 && $FontMapType == 1){// Nếu dữ liệu là fnt thì khởi chạy
			var $string = fromHex($value,"");// Chuyển dữ liệu hex sang text
			var $split = $string.split(/\n/gi);// Tách dữ liệu font theo từng dòng
			var $here = 0;// Tạo biến số character hiện tại
			var $listChar = "";// Tạo biến chứa các ký tự
      var $arrayBlock = GetArrayFNT(); //  Tạo biến lấy dữ liệu block
      var $headerBar = '<div class="item-table-block"><div class="header-table-bar">\
      <label class="title-table header-button">Range: <b>Dữ Liệu Ký Tự</b></label>\
      <label class="max-character header-button">Tổng Số Ký Tự: <b>$MAXCHAR</b></label>\
      <label class="export-th header-button"><button id="showTable" onclick="showTable(this)"><i class="fas fa-plus"></i> Hiện Dữ Liệu</button></label>\
      </div>';// Tạo header thông tin
      var $table = $headerBar + '<table class="table-data-body"><thead>';
      var $header = '<tr class="table-header header-copy"><th>Thứ Tự</th><th>Unicode</th>';// Tạo header và table
      var $bodyTable = "";
      var $beginHeader = true;// Tạo biến xác định header chưa tạo
			for(var $j = 0;$j < $split.length;$j++){// Chạy lập theo từng dòng file
        var $block = $split[$j];// Lấy từng dòng dữ liệu
        var $test1 = new RegExp($arrayBlock[0][1]);// Tạo biểu thức để kiểm tra
        var $test2 = new RegExp($arrayBlock[1][1]);
        if($block.match($test1) && $block.match($test2)){// Nếu dữ liệu đúng
          var $smallItem = '<tr class="item-cell-row">';// Tạo hàng table
          $here = $here + 1;// Vị trí character hiện tại 
          $smallItem += '<td onmouseover="charTitleHover(this)" class="td-number" onmouseout="CharHoverHide(this)" alt="Thứ Tự" titleText="Thứ Tự:&#10;* Chú giải: Cột xếp thứ tự các ký tự.">'+$here+'</td>';// Tạo cell td chứa dữ liệu
          var $css = ""; // Tạo các biến chứa dữ liệu
          var $titleHTML = "";
          var $id = "";
          var $width = false;
          var $height = false;
          var $left = false;
          var $top = false;
          var $right = false;
          var $bottom = false;      
          var $page = "";
          for(var $l = 0;$l < $arrayBlock.length;$l++){// Chạy lập theo từng dữ liệu block
            var $titleBlock = $arrayBlock[$l][0];// Lấy tiêu đề dữ liệu block
            var $regexpBlock = $arrayBlock[$l][1];// Lấy Regexp dữ liệu block
            var $calcBlock = $arrayBlock[$l][2];// Lấy Calc dữ liệu block
            var $regexp = new RegExp($regexpBlock);// Tạo regexp mới
            var $value = $block.match($regexp);// Tạo biến value để tách dữ loei65
            var $block = $split[$j];// Tạo biến block lấy theo từng dòng
            if($beginHeader == true){// Nếu chưa tạo header
              $header += "<th>"+$titleBlock+"</th>";// Tạo header table với tiêu đề đã lấy
              if($l == $arrayBlock.length - 1){// Nếu là cell cuối
                $header += "<th>Phân Tích</th>";// Thêm header cuối
              }
            }
            if($value){// Nếu dữ liệu tồn tại
              $value[1] = eval($value[1] + $calcBlock); // Tính dữ liệu đúng theo phép tính
              var $title = $titleBlock;// Lấy tiêu đề dữ liệu
              var $titleTag = "<b>" + $title + ":</b><br>";// Tạo biến title hover
              var $hexItem = Number($value[1]).toString(16).toUpperCase();// Chuyển dữ liệu sang hex
              $titleTag += "<b>* Little Endian:</b> <i>0x" + $hexItem + "</i><br>";// Tạo chú thích Little Endian
              $titleTag += "<b>* Big Endian:</b> <i>0x" + SwapEndian($hexItem) + "</i><br>";// Tạo chú thích Big Endian
              $titleTag += "<b>* Decimal:</b> <i>" + $value[1] + "</i><br>";// Tạo chú thích Decimal
              $titleTagAdd = "<b>* Chú giải:</b> " + $title + " của ký tự.";// Ghi chú kiểu dữ liệu
              switch($titleBlock) {// Kiểm tra theo từng dữ liệu
                case "Character":// Nếu là character
                  var $unicode = String.fromCharCode($value[1]).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");// Chuyển sang ký tự từ Unicode đã lấy và replace các ký tự đặc biệt
                  $smallItem += '<td onmouseover="charTitleHover(this)" class="td-unicode" onmouseout="CharHoverHide(this)" titleText="Unicode:&#10;* Chú giải: Mã Unicode của ký tự. Được dùng dưới dạng Decimal." myHex="'+$value[1]+'" alt="Unicode">'+$value[1]+'</td>';// Tạo thêm cột chứa dữ liệu unicode
                  $smallItem += '<td onmouseover="charTitleHover(this)" onmouseout="CharHoverHide(this)" titleText="Character:&#10;* Chú giải: Ký tự được chuyển đổi từ mã Unicode." myHex="'+$value[1]+'" class="td-character" alt="Character">'+String.fromCharCode($value[1]).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;")+'</td>';// Tạo thêm cột chứa dữ liệu character
                  $titleHTML += "Unicode:  <b>" + $value[1] + "</b><br>Character:  <b>" + $unicode + "</b><br>";// Thêm ghi chú
                  $id = $value[1];
                  break;
                case "Width":// Nếu là width
                  $width = $value[1];
                  $css += "width: " + $value[1] + "px;";
                  $titleTagAdd = "<b>* Chú giải:</b> Chiều rộng của ký tự.";
                  break;
                case "Height":
                  $height = $value[1];
                  $css += "height: " + $value[1] + "px;";
                  $titleTagAdd = "<b>* Chú giải:</b> Chiều cao của ký tự.";
                  break;
                case "X":
                  $css += "left: " + $value[1] + "px;";
                  $titleTagAdd = "<b>* Chú giải:</b> Tọa đồ từ lề bên trái của ảnh font cho đến lề bên trái ký tự.";
                  break;
                case "Y":
                  $css += "top: " + $value[1] + "px;";
                  $titleTagAdd = "<b>* Chú giải:</b> Tọa đồ từ lề bên trên của ảnh font cho đến lề bên trên ký tự.";
                  break;
                case "Left":
                  $left = $value[1];
                  $css += "left: " + $value[1] + "px;";
                  $titleTagAdd = "<b>* Chú giải:</b> Tọa đồ từ lề bên trái của ảnh font cho đến lề bên trái ký tự.";
                  break;
                case "Top":
                  $top = $value[1];
                  $css += "top: " + $value[1] + "px;";
                  $titleTagAdd = "<b>* Chú giải:</b> Tọa đồ từ lề bên trên của ảnh font cho đến lề bên trên ký tự.";
                  break;
                case "Right":
                  $right = $value[1];
                  $css += "right: " + $value[1] + "px;";
                  $titleTagAdd = "<b>* Chú giải:</b> Tọa đồ từ lề bên trái của ảnh font cho đến lề bên phải ký tự.";
                  break;
                case "Bottom":
                  $bottom = $value[1];
                  $css += "bottom: " + $value[1] + "px;";
                  $titleTagAdd = "<b>* Chú giải:</b> Tọa đồ từ lề bên trên của ảnh font cho đến lề bên dưới ký tự.";
                  break;                
                case "Page":
                  $page = $value[1];
                  break;
                default:
                  
                  //Console.log("default",$titleBlock)
              } 
              if($titleBlock != "Character"){// Nếu dữ liệu không phải dạng character
                $titleTag += $titleTagAdd;// Nối các chú thích lại
                var $class = "td-"+$titleBlock.replace(/\s/g,"-");// Tạo biến class theo tiêu đề dữ liệu
                $smallItem += '<td calc="'+$calcBlock+'" class="'+$class+'" onmouseover="charTitleHover(this)" myHex="'+$value[1]+'" onmouseout="CharHoverHide(this)" alt="'+$titleBlock+'" titleText="'+$titleTag+'">' + $value[1] + "</td>";// Thêm cột chứa dữ liệu
              }
            }
          }
          
          if($width == false){// Nếu chưa có width thì tính width bằng right - left
            $width = Number($right) - Number($left);
            $css += "width: " + $width + "px;";            
          }
          if($height == false){// Nếu chưa có height thì tính height bằng bottom - top
            $height = Number($bottom) - Number($top);
            $css += "height: " + $height + "px;";
          }
          $beginHeader = false;// Đánh dấu đã tạo header
          $smallItem += '<td class="td-button"><button class="btn-char-des" onclick="viewChar(this)">Phân Tích</button></td></tr>';// Thêm button phân tích vào cột
          //$header += $item;// Thêm các cột vào table
          $listChar += '<div pageImg="'+$page+'" onclick="jumpChar(this)" class="char-cell" onmousemove="charHover(this)" charnumber="'+$id+'" titleText="'+$titleHTML+'" style="'+$css+'"><span class="hover-block-text">'+$titleHTML+'<b>Nhấn Để Chuyển Đến<br>Khung Phân Tích</b></span></div>';// Tạo khung cho character
        }
        if($smallItem){
          $bodyTable += $smallItem;
        }
			}
      $table = $table.replace("$MAXCHAR",$here);// Replace tổng số ký tự
      $table += $header + "</tr></thead><tbody>" + $header + "</tr>" + $bodyTable + "</tbody></table></div>";
			//$('#test').text($listChar);
			$('#page-result').html($table);// Chèn table vào html
			//$('#formData').text($header);//
			$('.block-cell').html($listChar);// Chèn khung character vào html
		}
    showLoad(false);// Đóng loading lại
    CompleteMap();// Chạy hàm hoàn thành
	}
	catch(e){// Nếu xảy ra lỗi thì báo
		alert("Đã xảy ra lỗi:\n\nHàm FNTback():\n\n"+e);
	}
}

function dataValue($obj){
  //console.log($obj);
  var $max = $obj.length; // Tao biến tổng số dữ liệu
  var $allHTML = ""; // Tạo biến chứa tổng dữ liệu
  var $byteMax = $dataList.maxByte;// Số byte trong 1 block
  var $headerBar = '<div class="item-table-block data-table"><div class="header-table-bar">\
  <label class="title-table header-button">Range: <b>'+$dataList.structTitle+'</b></label>\
  <label class="max-character header-button">Tổng Số Block: <b>'+$max+'</b></label>\
  <label class="max-byte-count">Số Byte trong Block: <b>'+$byteMax+'</b></label>\
  <label class="export-th header-button"><button id="showTable" onclick="showTable(this)"><i class="fas fa-plus"></i> Hiện Dữ Liệu</button></label>\
  </div>';// Tạo header thông tin
  var $table = $headerBar + '<table class="table-data-body"><thead>';
  var $header = '<tr class="table-header header-copy"><th>Thứ Tự</th>';// Tạo header và table
  for(var $j = 0;$j < $max;$j++){// Chạy lập theo từng ký tự
    var $item = '<tr class="item-cell-row">';// Tạo hàng chứa dữ liệu
    var $block = $obj[$j];
    
    for(var $e = 0;$e < $block.length;$e++){
      if($j == 0){
        if($block[$e].title == "Character"){
          $header += "<th>Unicode</th>";	
          $header += "<th>Character</th>";	
        }
        else{
          $header += "<th>" + $block[$e].title + "</th>";
        }
      }      
      if($block[$e].title == "Character"){
        $item += '<td onmouseover="charTitleHover(this)" class="td-number" onmouseout="CharHoverHide(this)" alt="Thứ Tự" titleText="Thứ Tự:&#10;* Chú giải: Cột xếp thứ tự các ký tự.">'+($j + 1)+'</td>';// Tạo dữ liệu cột thứ tự
        $item += '<td onmouseover="charTitleHover(this)" class="td-unicode" onmouseout="CharHoverHide(this)" titleText="Unicode:&#10;* Chú giải: Mã Unicode của ký tự. Được dùng dưới dạng Decimal." myHex="'+$block[$e].hex+'" alt="Unicode">' + $block[$e].value + '</td>';// Tạo dữ liệu cột Unicode
        $item += '<td onmouseover="charTitleHover(this)" onmouseout="CharHoverHide(this)" titleText="Character:&#10;* Chú giải: Ký tự được chuyển đổi từ mã Unicode." myHex="'+$block[$e].hex+'" class="td-character" alt="Character">'+String.fromCharCode($block[$e].value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;")+'</td>';// Tạo dữ liệu dạng character
      }
      else{
        if($e == 0){
          $item += '<td onmouseover="charTitleHover(this)" class="td-number" onmouseout="CharHoverHide(this)" alt="Thứ Tự" titleText="Thứ Tự:&#10;* Chú giải: Cột xếp thứ tự các ký tự.">'+($j + 1)+'</td>';// Tạo dữ liệu cột thứ tự
        }
        var $title = $block[$e].title;// Lấy tên dữ liệu
        var $titleTag = "<b>" + $title + ":</b>&#10;";// Tạo chú thích dữ liệu
        $titleTag += "<b>* Little Endian:</b> <i>0x" + $block[$e].hex + "</i>&#10;";
        $titleTag += "<b>* Big Endian:</b> <i>0x" + SwapEndian($block[$e].hex) + "</i>&#10;";
        $titleTag += "<b>* Value:/<b> <i>" + $block[$e].value + "</i>&#10;"; 
        var $class = "td-"+$block[$e].title.replace(/\s/g,"-");// Tạo biến class
        $item += '<td calc="'+$block[$e].calc+'" class="'+$class+'" onmouseover="charTitleHover(this)" myHex="'+$block[$e].hex+'" onmouseout="CharHoverHide(this)" alt="'+$block[$e].title+'" titleText="'+$titleTag+'">' + $block[$e].value + "</td>";// Tạo cột chứa dữ liệu
      }
    }
    $allHTML += $item + '</tr>';// Thêm phím 
  }
  $table += $header + "</tr></thead><tbody>" + $header + $allHTML + "</tbody></table></div>";// Nối các dữ liệu vào table
    //$('#test').text($header);// Chèn dữ liệu vào form test
  $('#page-result').append($table);// Chèn table vào html
  showLoad(false);// Đóng loading
  //$('.table-header-copy').html($('.table-header').html());// Tạo header table phân tích
  CompleteMap();
}

// Hàm xuất dữ liệu bitmap font
function dataCheck($obj,$box){
	try{// Chạy thử
    var $max = $obj.length; // Tao biến tổng số dữ liệu
    var $allHTML = ""; // Tạo biến chứa tổng dữ liệu
    var $byteMax = 0;// Số byte trong 1 block
    $box.find('.select-byte :selected').each(function(){// Tính toán số byte trong block
      var $value = $(this).val();// Lấy số byte
      $byteMax = $byteMax + Number($value)// Cộng tất cả lại
    });
    var $headerBar = '<div class="item-table-block character-table"><div class="header-table-bar">\
    <label class="title-table header-button">Range: <b>'+$dataList.structTitle+'</b></label>\
    <label class="max-character header-button">Tổng Số Block: <b>'+$max+'</b></label>\
    <label class="max-byte-count">Số Byte trong Block: <b>'+$byteMax+'</b></label>\
    <label class="export-th header-button"><button id="showTable" onclick="showTable(this)"><i class="fas fa-minus"></i> Ẩn Dữ Liệu</button></label>\
    </div>';// Tạo header thông tin
    var $table = $headerBar + '<table class="table-data-body active"><thead>'; //<tbody>
    var $header = '<tr class="table-header header-copy"><th>Thứ Tự</th>';// Tạo header và table
    var $listChar = "";// Tạo biến chứa danh sách ký tự
    for(var $j = 0;$j < $max;$j++){// Chạy lập theo từng ký tự
      var $idCharacter = "";// Dữ liệu unicode
      var $item = '<tr class="item-cell-row">';// Tạo hàng chứa dữ liệu
      var $block = $obj[$j];// Tạo biến lấy từng dữ liệu
      var $style = "";// Tạo biến chứa style
      var $titleHTML2 = "";// Tạo biến chứa thông tin hover
      var $objStyle = new Object();// Tạo biến object chứa dữ liệu
      var $page = "";
      $objStyle.Character = "";
      $objStyle.Unicode = "";
      $objStyle.width = "";
      $objStyle.height = "";
      $objStyle.left = "";
      $objStyle.top = "";
      $objStyle.right = "";
      $objStyle.bottom = "";
      var $checkUV = false;// Tạo biến kiểm tra xem UV
      for(var $e = 0;$e < $block.length;$e++){// Chạy lập theo từng kiểu dữ liệu
        if($j == 0){		// Nếu chưa có header th thì tạo thêm head unicode và character
          if($block[$e].title == "Character"){
            $header += "<th>Unicode</th>";	
            $header += "<th>Character</th>";	
          }
          else{// Tạo các header theo tên dữ liệu
            $header += "<th>" + $block[$e].title + "</th>";		
          }
        }
        if($block[$e].title == "Character"){// Nếu là dữ liệu character
          $objStyle.Character = String.fromCharCode($block[$e].value);// Chuyển sang ký tự từ mã unicode
          $objStyle.Unicode = $block[$e].value;// Lấy dữ liệu unicode
          $idCharacter = $block[$e].value;// Gán dữ liệu vào biến Idcharacter
          $item += '<td onmouseover="charTitleHover(this)" class="td-number" onmouseout="CharHoverHide(this)" alt="Thứ Tự" titleText="Thứ Tự:&#10;* Chú giải: Cột xếp thứ tự các ký tự.">'+($j + 1)+'</td>';// Tạo dữ liệu cột thứ tự
          $item += '<td onmouseover="charTitleHover(this)" class="td-unicode" onmouseout="CharHoverHide(this)" titleText="Unicode:&#10;* Chú giải: Mã Unicode của ký tự. Được dùng dưới dạng Decimal." myHex="'+$block[$e].hex+'" alt="Unicode">' + $block[$e].value + '</td>';// Tạo dữ liệu cột Unicode
          $item += '<td onmouseover="charTitleHover(this)" onmouseout="CharHoverHide(this)" titleText="Character:&#10;* Chú giải: Ký tự được chuyển đổi từ mã Unicode." myHex="'+$block[$e].hex+'" class="td-character" alt="Character">'+String.fromCharCode($block[$e].value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;")+'</td>';// Tạo dữ liệu dạng character
        }
        else{// Nếu là các dữ liệu khác
          var $title = $block[$e].title;// Lấy tên dữ liệu
          var $titleTag = "<b>" + $title + ":</b>&#10;";// Tạo chú thích dữ liệu
          $titleTag += "<b>* Little Endian:</b> <i>0x" + $block[$e].hex + "</i>&#10;";
          $titleTag += "<b>* Big Endian:</b> <i>0x" + SwapEndian($block[$e].hex) + "</i>&#10;";
          $titleTag += "<b>* Value:/<b> <i>" + $block[$e].value + "</i>&#10;";
          $titleTagAdd = "<b>* Chú giải:</b> " + $title + " của ký tự.";
          // Kiểm tra từng kiểu dữ liệu và thêm vào style cùng chú giải
          if($title == "Width"){
            $objStyle.width = $block[$e].value;
            $titleTagAdd = "<b>* Chú giải:</b> Chiều rộng của ký tự.";
          }
          if($title == "Height"){
            $objStyle.height = $block[$e].value;
            $titleTagAdd = "<b>* Chú giải:</b> Chiều cao của ký tự.";
          }
          if($title == "X" || $title == "Left" || $title == "UV Left"){
            $objStyle.left = $block[$e].value;
            $titleTagAdd = "<b>* Chú giải:</b> Tọa độ "+$title+" của ký tự.";
          }
          if($title == "Y" || $title == "Top" || $title == "UV Top"){
            $objStyle.top = $block[$e].value;
            $titleTagAdd = "<b>* Chú giải:</b> Tọa độ "+$title+" của ký tự.";
          }
          if($title == "Right" || $title == "UV Right"){
            $objStyle.right = $block[$e].value;
            $titleTagAdd = "<b>* Chú giải:</b> Tọa độ "+$title+" của ký tự.";
            $checkUV = true;
          }
          if($title == "Bottom" || $title == "UV Bottom"){
            $objStyle.bottom = $block[$e].value;
            $titleTagAdd = "<b>* Chú giải:</b> Tọa độ "+$title+" của ký tự.";
            $checkUV = true;
          }	
          if($title == "Page"){
            $page = $block[$e].value;
          }
          $titleTag += $titleTagAdd;// Nối các chú thích lại
          var $class = "td-"+$title.replace(/\s/g,"-");// Tạo biến class
          $item += '<td calc="'+$block[$e].calc+'" class="'+$class+'" onmouseover="charTitleHover(this)" myHex="'+$block[$e].hex+'" onmouseout="CharHoverHide(this)" alt="'+$title+'" titleText="'+$titleTag+'">' + $block[$e].value + "</td>";// Tạo cột chứa dữ liệu
        }		
      }
          
      if($objStyle.width != "" && $objStyle.height != ""){// Nếu có width và height thì tạo object right và bottom
        $objStyle.right = Number($objStyle.left) + Number($objStyle.width);
        $objStyle.bottom = Number($objStyle.top) + Number($objStyle.height);
      }
      if($objStyle.right != "" && $objStyle.bottom != "" && $objStyle.width == "" && $objStyle.height == ""){// Nếu có biến right và bottom nhưng không có width và height thì tính width và height
        $objStyle.width = Number($objStyle.right) - Number($objStyle.left);
        $objStyle.height = Number($objStyle.bottom) - Number($objStyle.top);
      }
      for(var $e in $objStyle){// Chạy lập theo style
        var $value = $objStyle[$e];
        if($value != ""){// Nếu có dữ liệu
          if($e == "width" || $e == "height"){
            $value = Number($value) + 1;
          }
          $style += $e + ": " + $value + "px;";// Chuyển các dữ liệu sang css
          $titleHTML2 += $e.toUpperCase() + ": <b>" + String($value).replace(/(\S+\.\S\S)\S+/,"$1") + "</b><br>";// Replace thông số css để lấy chú thích
        }
      }
      $style = $style.replace(/Character.*?;/,"");
      $listChar += '<div pageImg="'+$page+'" class="char-cell" onclick="jumpChar(this)" onmouseover="charHover(this)" onmouseout="CharHoverHide(this)"  charnumber="'+$idCharacter+'" style="'+$style+'"><span class="hover-block-text">'+$titleHTML2+'<b>Nhấn Để Chuyển Đến<br>Khung Phân Tích</b></span></div>'; // Nối dữ liệu chứa tọa độ ký tự để tạo khung trên hình ảnh font
      $allHTML += $item + '<td class="td-button"><button class="btn-char-des" onclick="viewChar(this)">Giải Thích</button></td></tr>';// Thêm phím phân tích dữ liệu
    }
    $table += $header + "<th>Phân Tích</th></tr></thead><tbody>" + $header + $allHTML + "</tbody></table></div>";// Nối các dữ liệu vào table
    //$('#test').text($header);// Chèn dữ liệu vào form test
    $('#page-result').append($table);// Chèn table vào html
    //$('#formData').text($header);Chèn dữ liệu vào form data
    $('.block-cell').html($listChar);// Chèn tọa độ ký tự vào html
    showLoad(false);// Đóng loading
    //$('.table-header-copy').html($('.table-header').html());// Tạo header table phân tích
    CompleteMap();
	}
	catch(e){// Kiểm tra nếu lỗi thì báo.
		alert("Lỗi rồi:\n\n Hàm dataCheck():\n\n" + e);
	}
}