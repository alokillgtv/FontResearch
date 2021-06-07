/* Script Tổng Thể Thực Thi*/

$FontMapType = 0;	// Tạo biến chứa kiểu font, hiện tại là bitmap font
$nameCfg = "";	// Tạo biến chứa tên
$varGetHTML = true; // Tạo biến kiểm tra khi lấy html
$HEXFILE = "";// Tạo biến chứa dữ liệu file hex
$FILEPOS = 0;// Tạo biến chứa vị trí con trỏ file hex
$SAVEHERE = ""; // Tạo biến file save hiện tại.
$ERROR = false;// Tạo biến báo lỗi
$dataList = "";// Tạo biến toàn cục chứa dữ liệu
$SUPERDATA = new Object();
$HEXNAME = "";
// Hàm tạo fontmap bằng dữ liệu font trích xuất từ BMFONT
function createDATA(){
	alert("Hiện vẫn chưa hỗ trợ tính năng này");
}

function clearData(){
  $('#fontmapfile,#fontimgfile,#test,input').val("");
  $('#cell-content,#page-result,.name-label b').html("");
  $('#page-result').html('<p class="none-data" style="background:white;border:1px solid #ccc">Hiện chưa có dữ liệu để phân tích. Bạn cần chọn các dữ liệu cần thiết và nhấn vào nút Phân Tích Font để phân tích.</p>');
  $('.body-page-hex').html('<div class="table-page-hex"></div>\
        <div class="data-hide-info"><p class="none-data">Hiện chưa có dữ liệu để phân tích chi tiết. Bạn cần bấm vào nút phân tích chi tiết ở trang cấu trúc font để tiến hành phân tích chi tiết ký tự.</p>\
        </div>');
  $('.fontmap-block').html($('.item-struct:last'));
  $('.list-block-char').html($('.item-char:last'));
  $('.select-title option[value="13"]').prop("selected", true);
  $('.select-title-struct option[value="Không Xác Định"]').prop("selected", true);
  $('.title-struct b').text("Không Xác Định");
  showIMG();
}

// Hàm khởi chạy đầu tiên
function BeginRunJS(){
  var $localSave = JSON.parse(localStorage.getItem("$dataSave"));
	if($localSave){ // Nếu có dữ liệu ở form COPY
    $dataSave = $localSave;
  }
	try{// Thử chạy hàm
    clearData(); // Xóa các dữ liệu cũ
		var $key = Object.keys($dataSave); // Lấy key mỗi object
		var $item = "";
		for(var $j = 0;$j < $key.length;$j++){// Chạy lập từng object
			$item += '<li class="item-options" title="'+$key[$j]+'"><b onclick="importcfg(this)">'+ $key[$j]+'</b><i onclick="delSave(this)" title="Xóa Thiết Lập Này"><small class="fas fa-trash-alt"></small></i></li>'; // Tạo các dòng chứa thiết lập
		}
		$('#import-cfg').append($item); // Chuyển các dòng thiết lập vào danh sách thiết lập
    changeValue();// Chạy hàm thay đổi dữ liệu
	}
	catch(e){// Nếu xảy ra lỗi, thì chạy hàm phục hồi thiết lập
    alert("Hàm BeginRun():\n\n" + e);
	}
}

// Hàm khởi chạy đầu tiên
function BeginRun(){
	if(document.getElementById("copy").value != ""){ // Nếu có dữ liệu ở form COPY
		var $data = fromHex(document.getElementById("copy").value,""); // Chuyển dữ liệu hex sang text
		try{// Thử chạy hàm
			var $obj = JSON.parse($data); // Chuyển dữ liệu thành Object
			var $key = Object.keys($dataSave); // Lấy key mỗi object
			var $item = "";
			for(var $j = 0;$j < $key.length;$j++){// Chạy lập từng object
				$item += '<li class="item-options" title="'+$key[$j]+'"><b onclick="importcfg(this)">'+ $key[$j]+'</b><i onclick="delSave(this)" title="Xóa Thiết Lập Này"><small class="fas fa-trash-alt"></small></i></li>'; // Tạo các dòng chứa thiết lập
			}
			$('#import-cfg').append($item); // Chuyển các dòng thiết lập vào danh sách thiết lập
		}
		catch(e){// Nếu xảy ra lỗi, thì chạy hàm phục hồi thiết lập
      alert("Hàm BeginRun():\n\n" + e);
			//execscript('ClearCfg()');
		}
	}
}

// Hàm chuyển dữ liệu hex sang text
function fromHex(hex,str){
  try{// Chạy thử nghiệm
    str = decodeURIComponent(hex.replace(/(..)/g,'%$1'));// Tách từng byte hex và chuyển nó thành văn bản
  }
  catch(e){
    str = hex // Nếu xảy ra lỗi thì trả về hex
  }
  //Console.log(str);
  return str
}

// Hàm chuyển văn bản sang hex
function toHex(str,hex){
  try{
    hex = unescape(encodeURIComponent(str))
    .split('').map(function(v){
      return v.charCodeAt(0).toString(16)
    }).join('')
  }
  catch(e){
    hex = str
  }
  return hex
}

// Hàm chọn dòng thiết lập
function importcfg(e){
  var $box = $(e).closest("li");
	var $value = $box.attr("title"); // Lấy tên dữ liệu
	$box.closest("ul").find(".active").removeClass("active"); // Xóa class active đã chọn
	$box.addClass("active"); // Thêm class active vừa chọn
	if($value != "None"){
    //Console.log("$value",$value);
		$nameCfg = $value; // biến tên thiết lập
		//importConfig($value) // Chạy hàm thêm thiết lập
		importConfigJS($value) // Chạy hàm thêm thiết lập
		$('.item-main b').text($value); // Thêm tên dữ liệu vào main item
	}
}

// Hàm phóng to ảnh font
function zoomIMG(e){
	var $value = $(e).attr("title"); // Lấy tiêu đề chứa kích cỡ phóng to ảnh
	var $img = $('#img-view').attr("src"); // Lấy đường dẫn font ảnh
	$(e).closest("ul").find(".active").removeClass("active");// Xóa đánh dấu đã chọn
	$(e).addClass("active");// Đánh dấu dòng đã chọn
	var $text = $(e).html() + '<i class="fas fa-caret-square-down"></i>';// Lấy dữ liệu đã phóng to và thêm icont vào
	$('.item-zoom-main').html($text);// Thêm vào danh sách
	if($img.indexOf("empty.png") == -1){// Nếu là font ảnh
		$('.page-img').css("transform","scale("+$value+")").css("-ms-transform","scale("+$value+")");// Phóng to ảnh theo kích cỡ đã chọn
	}
	else{
		alert("Vui lòng chọn file ảnh font");// Nếu chưa có font ảnh thì báo
	}
}

function sleep2($time){
  setTimeout(function(){
    var $test = "";
  },$time)
}

function getStructItem(){// Hàm lấy dữ liệu structItem
  var $struct = new Object();
  $struct.list = [];// Tạo biến chứa array dữ liệu
  
   // Lấy dữ liệu cho struct object
  $struct.typeChar = $('.typeChar :selected').val();// Lấy kiểu dữ liệu Little hoặc Big
  $struct.mapType = $('#type-check :selected').val();// Lấy kiểu phân tích font
  $struct.hexFile = $('#test').val();
  $struct.dataimg = $('#img-view').attr("src");// Lấy đường dẫn font ảnh
  $struct.datafile = $('#pathFont').text();// Lấy đường dẫn font ảnh
  $struct.width = $('#img-view')[0].naturalWidth;// Lấy width ảnh gốc
  $struct.height = $('#img-view')[0].naturalHeight;// Lấy height ảnh gốc
  for(var $o = 0;$o < $('.item-struct').length;$o++){
    var $node = $('.item-struct:eq('+$o+')');
    //console.log($node);
    var $lengthBlock = $node.find(".input-max").val();
    var $maxByte = 0;
    $node.find('.select-byte option:selected').each(function(){
      var $value = Number($(this).val());
      $maxByte = $maxByte + $value;
    });
    var $item = new Object();// Tạo biến chứa object dữ liệu
    $item.maxByte = $maxByte;// Lấy tổng số byte 1 range
    $item.maxChar = changeHex($lengthBlock) / $maxByte;// Lấy tổng số ký tự
    $item.structTitle = $node.find(".select-title-struct option:selected").val();// Lấy tiêu đề một khối
    $item.structLength = $node.find(".input-max").val();// Lấy tiêu đề một khối
    $item.charPos = $node.find(".input-offset").val(); // Lấy start offset một khối
    $item.charlist = getCharType($node);// Lấy kiểu phân tích ở các block
    $struct.list.push($item);
  }
  return $struct
}

function exportcfg(e){// Hàm xuất thiết lập để lưu lại
  try{// Chạy thử hàm
    var $struct = getStructItem();
    var $name = prompt("Nhập tên dữ liệu bạn muốn lưu.", ""); // Lấy tên thiết lập bằng prompt
    if($name != null && $name != undefined && $name != ""){// Nếu tên đúng định dạng
      $nameCfg = $name; //  Lưu tên thiết lập vào biến
      $struct.gameName = $name;
      if($dataSave[$name]){
        alert("Đã đè lưu thiết lập ("+$name+")");
      }
      else{
        alert("Đã lưu thiết lập ("+$name+")");
      }
      $dataSave[$name] = $struct; // Lưu dữ liệu dưới tên thiết lập
      //var $return = execscript('SaveCfg()');// Chạy script autoit lưu file thiết lập lại
      var $check = $('.item-options[title="'+$name+'"]').length;// Biến kiểm tra xem thiết lập có tồn tại chưa
      if($check == 0){// Nếu chưa có thiết lập thì tạo một menu thiết lập mới
        var $option = '<li class="item-options" onclick="importcfg(this)" title="'+$name+'"><b>'+ $name+'</b><i onclick="delSave(this)" title="Xóa Thiết Lập Này"><small class="fas fa-trash-alt"></small></i></li>';
      }
      $('#import-cfg').append($option);// Chèn vào danh sách thiết lập
      $('#import-cfg').attr("onchange","importcfg(this)");// Thêm hàm tương tác khi chuyển
      //alert("Đã lưu thiết lập ("+$name+")");// Thông báo khi tạo thiết lập thành công
      localStorage.setItem('$dataSave', JSON.stringify($dataSave));
    }
  }
  catch(e){
    alert("Hàm exportcfg(): \n\n" + e + "\n" + e.name); // Thông báo nếu gặp lỗi
  }
}

function AddStruct($maxStruct){// Hàm tạo struct
  var $last = $('.character-list .item-struct:last');
  $('.character-list').html($last);
  var $lastChar = $('.character-list .item-struct:last .item-char:last');
  $('.character-list .item-struct:last .list-block-char').html($lastChar);
   var $block = $('.character-list .item-struct:last')[0].outerHTML; 
  for(var $j = 0;$j < $maxStruct - 1;$j++){
    // Lấy dữ liệu block cuối cùng
    $('.character-list').append($block); // Tăng thêm block dữ liệu.
  }
  changeValue();// Chạy hàm thay đổi dữ liệu
}

// Hàm thêm cấu trúc block
function AddValue($number,$box){
  var $block = $box.find('.item-block:last')[0].outerHTML; 
  $box.find('.list-block-char').html($block);
  for(var $j = 0;$j < $number - 1;$j++){
    // Lấy dữ liệu block cuối cùng
    $box.find('.list-block-char').append($block); // Tăng thêm block dữ liệu.
  }
  changeValue();// Chạy hàm thay đổi dữ liệu
}

// Hàm tách các thiết lập đã lưu
function importConfigJS($name){
  clearData();
	var $json = $dataSave;//Chuyển sang dạng Object
	var $obj = $json[$name];// Lấy dòng thiết lập dựa theo tên thiết lập
  $SAVEHERE = $obj;// Lưu lại file save hiện tại
  $HEXNAME = $obj.datafile;
  /*
  
	var $datafile = $obj.datafile;// Lấy đường dẫn font map
	var $dataimg = $obj.dataimg;// Lấy đường dẫn font ảnh
	var $maxchar = $obj.maxChar;//Lấy tổng số ký tự đã lưu
	var $posChar = $obj.posChar;// Lấy vị trí bắt đầu ký tự
	var $typeChar = $obj.typeChar;// Lấy kiểu dữ liệu font map. Big Endian hoặc Little Endian
	var $charlist = $obj.charlist.split("||");// Tách các dữ liệu ký tự
	var $mapType = $obj.mapType;// Lấy kiểu font map, bitmap hoặc text
	$FontMapType = Number($mapType);// Lưu biến fontmap hiện tại
	$('#FontMax').val($maxchar);	// Chèn tổng số ký tự
	$('#FontPos').val($posChar);	// Chèn vị trí bắt đầu ký tự đầu tiên
	$('.typeChar').val($obj.typeChar); // Chọn kiểu dữ liệu Big Endian hoặc Little Endian
  */
  $("#type-check").val($obj.mapType); // Chuyển đổi tùy chọn
  FontMapChange(); // Chuyển đổi kiểu font map phù hợp
	$('#pathFont').val($obj.datafile);// Chèn đường dẫn file font map
	$('#pathImg').val($obj.dataimg);// Chèn đường dẫn file ảnh font
	$('#img-view').attr("src",$obj.dataimg);// Chèn đường dẫn font ảnh vào
  $('#test').val($obj.hexFile);
  $HEXFILE = $obj.hexFile;
  var $maxStruct = $obj.list.length;
  AddStruct($maxStruct);// Chạy hàm tạo struct
  for(var $a = 0;$a < $maxStruct;$a++){
    var $itemStruct = $obj.list[$a];
    var $charlist = $itemStruct.charlist.split("||");
    var $countList = $charlist.length - 1;// Tạo biến tổng số ký tự
    var $box = $('.item-struct:eq('+$a+')');
    $box.find(".input-offset").val($itemStruct.charPos);
    $box.find(".input-max").val($itemStruct.structLength);
    if($box.find('.select-title-struct option[value="'+$itemStruct.structTitle+'"]').length == 0){
      $box.find(".select-title-struct").append('<option value="'+$itemStruct.structTitle+'">'+$itemStruct.structTitle+'</option>')
    }
    else{
      $box.find(".select-title-struct").val($itemStruct.structTitle);
    }  
    $box.find(".title-struct b").text($itemStruct.structTitle);
    $box.find('.select-title-struct option[value="'+$itemStruct.structTitle+'"]').prop("selected", true)
    AddValue($countList,$box);
    for(var $h = 0;$h < $countList;$h++){// Chạy lập để thêm block có sẵn dữ liệu
      var $split = $charlist[$h].split("##");// Tách các dữ liệu block ra
      var $title = $split[0];// Lấy tiêu đề block
      $box.find('.list-block-char li:eq('+$h+') .select-title').val($title);
      if($FontMapType == 0){
        var $byte = $split[1];// Lấy số byte của block này
        var $type = $split[2];// Lấy kiểu dữ liệu của block
        var $cals = $split[3];
          // Chọn tiêu đề, byte, kiểu dữ liệu phù hợp
        var $check = $box.find('.list-block-char li:eq('+$h+') .select-byte option[value="'+$byte+'"]').length;
        if($check == 0){
          $box.find('.list-block-char li:eq('+$h+') .select-byte').append('<option value="'+$byte+'">'+$byte+' Byte</option>');
          //$box.find('.list-block-char li:eq('+$h+') option[value="'+$byte+'"]').prop("selected", true);
        }
        $box.find('.list-block-char li:eq('+$h+') .select-byte').val($byte);
        $box.find('.list-block-char li:eq('+$h+') .select-type').val($type);
        $box.find('.list-block-char li:eq('+$h+') .input-cals').val($cals);
        
      }
      else{
        var $regText = $split[1];
        var $cals = $split[2];
        var $save = $split[3];
        $box.find('.list-block-char li:eq('+$h+') .input-regexp').val($regText);
        $box.find('.list-block-char li:eq('+$h+') .input-cals').val($cals);
      }
    }
  }
	try{
    setTimeout(function(){
      checkFont()// Chạy hàm kiểm tra các dữ liệu font
    },5000);
	}
	catch(e){	
		alert("Đã xảy ra lỗi:\n\nHàm importConfig():\n\n" + e)
	};
}

// Hàm xóa bớt các block 
function RemoveBlock(e){
  var $li = $(e).closest("li");
  var $box = $(e).closest("ul");
  if($box.find("li").length > 1){
    $li.remove();
  };
  changeValue();// Chạy hàm thay đổi dữ liệu
}
// Hàm tạo thêm block dữ liệu
function AddBlockValue(e){
  var $box = $(e).closest(".item-struct");
  var $block = $box.find('.item-block:last')[0].outerHTML; 
  $box.find('.list-block-char').append($block);
  changeValue();// Chạy hàm thay đổi dữ liệu
}

// Hàm kiểm tra kiểu font
function checkFont(){
  showLoad(true);// Hiện loading
  Console.log("Kiểu font hiện tại",$FontMapType)
	if($FontMapType == 0){// Nếu là font map
		setTimeout(function(){Bitmapcheck()},500);
	}
	if($FontMapType == 1 || $FontMapType == 2){// Nếu là font fnt hoặc font text
		setTimeout(function(){FNTcheck()},500);
	}
}

// Hàm chuyển đổi kiểu font
function FontMapChange(e){
	var $value = $("#type-check option:selected").val();// Lấy dữ liệu đã chọn
	$FontMapType = Number($value);// Chuyển nó thành dạng số
  switch($FontMapType) {// Kiểm tra theo kiểu nào
    case 0:
      // Kiểu font bitmap
      ShowMapFont(true)
      break;
    case 1:
      // Kiểu font FNT
      ShowMapFont(false)
      setFontFnt();
      break;
    case 2:
      // Kiểu font text
      ShowMapFont(false)
      break;
  } 
}

// Hàm thiết lập kiểu font fnt
function setFontFnt(){
  AddValue(8,$('.item-struct:last'))// Thêm 9 block mới
  var $arraySet = [];
  $arraySet.push([0,"id=(\\S+)"])// Thêm array character
  $arraySet.push([7,"x=(\\S+)"])// Thêm array x
  $arraySet.push([8,"y=(\\S+)"])// Thêm array x
  $arraySet.push([1,"width=(\\S+)"])// Thêm array width
  $arraySet.push([2,"height=(\\S+)"])// Thêm array height
  $arraySet.push([19,"xoffset=(\\S+)"])// Thêm array xoffset
  $arraySet.push([20,"yoffset=(\\S+)"])// Thêm array yoffset
  $arraySet.push([21,"xadvance=(\\S+)"])// Thêm array yoffset
  $arraySet.push([18,"page=(\\S+)"])// Thêm array yoffset
  for(var $j = 0;$j < $arraySet.length;$j++){// Chạy lập từng block
    var $box = $('.item-block:eq('+$j+')');// Lấy theo block
    var $title = $arraySet[$j][0];// Lấy title array block
    var $regexp = $arraySet[$j][1];// Lấy regexp array block
    $box.find(".select-title").val($title);// Chọn select character
    $box.find(".input-regexp").val($regexp);// Thêm dữ liệu regexp vào trường
  }
}

function clearFile(e){// Hàm xóa input file
	$(e).val("");
  var $id = $(e).attr("id");
  if($id.indexOf("fontmapfile") > -1){
    var $test = confirm("Bạn có muốn xóa hết các dữ liệu cũ đã thiết lập hay không?\n\nChọn Ok(Có) để xóa các thiết lập cũ.\n\nChọn Không (No,Hủy Bỏ) để giữ nguyên các thiết lập cũ.");
    if($test){
      clearData();
    }
  }
}

function ConvertHex(){
  var $value = fromHex($('#copy').val(),"");
  $('#test').val($value);
}

// Hàm kiểm tra file fnt hoặc text
function FNTcheck(){
  showLoad(true)
	var $pathChar = $('#pathFont').val(); // Lấy đường dẫn file map fnt hoặc text
	var $pathImg = $('#pathImg').val();  // Lấy đường dẫn file ảnh
	var $wImg = $('#img-view')[0].naturalWidth;// Lấy width file ảnh
	var $hImg = $('#img-view')[0].naturalHeight;// Lấy heigth file ảnh
	//execscript('GetFNT("'+$pathChar+'")');// Khởi chạy hàm autoit với đường dẫn file map
  FNTback();
  //Console.log("Đường dẫn font map",$pathChar)
}

function imagePath(e){
  var $src = $(e).val();
  $('#img-view').attr("src",$src);
}

// Hàm lấy array input FNT
function GetArrayFNT(){
  var $newArray = []; // Tọa biến chứa array
  $('.item-char').each(function(){// Thực thi theo từng block
    var $titleChar = $(this).find('.select-title :selected').text(); // Lấy title block
    var $regexpText = $(this).find('.input-regexp').val(); // Lấy regexp block
    var $calc = $(this).find('.input-cals').val(); // Lấy calc block
    $newArray.push([$titleChar,$regexpText,$calc]); // Thêm vào biến chứa array
  });
  return $newArray;
}

// Hàm hiện loading
function showLoad($show){
	if($show == true){// Hiện loading
    window.scrollTo(0, 0);
		$('#loading-run').removeClass("active");
		$('#loading-run').addClass("active");
    setTimeout(function(){
      $('#loading-run').removeClass("active");
    },10000)
	}
	else{// Ẩn loading
		$('#loading-run').removeClass("active")
	}
}

function showIMG(e){// Hàm hiện trang ảnh font
  window.scrollTo(0, 0);// Cuộn đến đầu trang
	$('.page-data,#page-debug,.page-hex').hide();// Đóng các trang khác
	$('.page-img').show();// Mở trang ảnh font
}

function showDATA(e){// Hàm hiện trang phân tích
	$('.page-img,#page-debug,.page-hex').hide();// Đóng các trang khác
	$('.page-data').show();// Mở trang phân tích
  widthTH();
}

function showCharInfo(){// Hàm hiện trang phân tích chi tiết
  $('.page-img,#page-debug,.page-data').hide();// Đóng các trang khác
  $('.page-hex').show(); // Mở trang phân tích chi tiết
}

function Debugger(){// Hàm mở trang debug
  window.scrollTo(0, 0);// Cuộn lên đầu trang
	$('#page-debug').show();// Hiện trang debug
	$('.page-data,.page-img,.page-hex').hide(); // Ẩn các trang ko liên quan
}

function myType(e){// Hàm chọn kiểu dữ liệu
	var $this = $(e);
	var $value = $this.find("option:selected").text();// Lấy dữ liệu chọn
	$this.closest("label").attr("blocktype",$value);// Thêm dữ liệu chọn vào
}

function selectType(e){// Hàm chọn kiểu dữ liệu dựa trên tiêu đề dữ liệu
	var $select = $(e).find("option:selected").val();// Lấy kiểu dữ liệu
	var $box = $(e).closest("li");// Chọn thành phần li chứa nó
	switch(Number($select)) {// Kiểm tra xem kiểu dữ liệu nào
    case 0:
      // Nếu là character
      $box.find(".select-byte").val(2);
			$box.find(".select-type").val(0);
      break;
		case 9:
			// Nếu là UV left
			$box.find(".select-byte").val(4);
			$box.find(".select-type").val(4);
			break;
		case 10:
			// Nếu là UV Top 
			$box.find(".select-byte").val(4);
			$box.find(".select-type").val(5);
			break;
		case 11:
			// Nếu là UV Right 
			$box.find(".select-byte").val(4);
			$box.find(".select-type").val(6);
			break;
		case 12:
			// Nếu là UV Top 
			$box.find(".select-byte").val(4);
			$box.find(".select-type").val(7);
			break;
		case 13:
			// Nếu là Uknown 
			$box.find(".select-byte").val(1);
			$box.find(".select-type").val(2);
			break;
		case 19:
			// Nếu là Xoffset
			$box.find(".select-byte").val(2);
			$box.find(".select-type").val(8);
			break;
		case 20:
			// Nếu là Yoffset
			$box.find(".select-byte").val(2);
			$box.find(".select-type").val(8);
			break;
		case 22:
			// Nếu là Text
      var $parent = $(e).closest(".item-struct");
      var $value = $parent.find(".input-max").val();
      if($value.match(/^0x[a-fA-F0-9]+$/)){// Nếu dữ liệu là hex
        var $hex = $value.match(/^0x([a-fA-F0-9]+)$/)[1];
        var $dec = hex2dec($hex);
      }
      if($value.match(/^[0-9]+$/)){
        var $dec = $value.match(/^([0-9]+)$/)[1];
      }
      $parent.find(".select-byte").append('<option value="'+$dec+'">'+$dec+' Byte</option>');
			$box.find(".select-byte").val($dec);
			$box.find(".select-type").val(9);
			break;
		default:
			$box.find(".select-byte").val(2);
			$box.find(".select-type").val(1);
			break;
	}
}

Console = {// Hàm console mới, in ra khung
  log: function($e,$a){
      if(!$a){
        $a = "";
      }
      else{
        $a = " = '" + $a + "'"
      }
      //console.log($a);
      $('#console').val($('#console').val() + "\n\n" + $e + $a);
  }
}

// Hàm chạy code
function CodeRun(){
  try{
   // Console.log("Runcode","");
    var $code = $('#code').val();// Lấy code từ form
    eval($code);// Khởi chạy code
  }
  catch(e){// Thông báo nếu gặp lỗi
    alert(e);
  }
}

function delSave(e){// Hàm xóa thiết lập
  var $box = $(e).closest(".item-options");
	var $value = $box.attr("title");// Lấy tên thiết lập
	try{// Chạy thử hàm
		var $objSave = $dataSave// Chuyển đổi dữ liệu sang object
		delete $objSave[$value];// Xóa thiết lập đã chọn
    localStorage.setItem("$dataSave",JSON.stringify($dataSave));
    $box.remove();
    alert("Đã xóa thiết lập [" + $value + "]")
	}
	catch(e){// Thông báo khi lỗi
		alert("Hàm delSave():\n\n" + e);
	}
}

function SendHTML($test){// Hàm chèn html ở develope
  var $codeHTML = $('#test').val();// Lấy dữ liệu html từ form test
  if($test){// Nếu là chèn toàn bộ
    $('body').html($codeHTML);  
  }
  else{// Chèn 1 phần html
    $('#page-content').html($codeHTML);
  }
}

function AllGetHTML($test){// Hàm lấy html
  if($test){// Nếu lệnh lấy toàn bộ html
    $varGetHTML = true;// Set biến lấy toàn bộ html
    var $html = $('body').html();// Lấy toàn bộ html
    $('#test').val($html);// Chèn html vào form test
  }
  else{// Hàm lấy 1 phần html
    $varGetHTML = false;// Set biến lấy 1 phần html
    var $html = $('#page-content').html(); // Lấy 1 phần html
    $('#test').val($html);// Chèn html vào form test
  }
}

function exportCSV() {// Hàm xuất file CSV
	var table_id = "csv-data";// Tạo biến id table
  var rows = document.querySelectorAll('table#' + table_id + ' tr'); // Lấy từng hàng table
  var csv = []; // Tạo biến array mới
  for (var i = 0; i < rows.length; i++) {// Chạy lập theo từng hàng
    var row = [], cols = rows[i].querySelectorAll('td, th');// Tạo biến lấy từng hàng
    for (var j = 0; j < cols.length; j++) {// Chạy lập theo từng cột
      var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');// Xóa các dấu xuống hàng
      data = data.replace(/"/g, '""');//Replace dấu "
      row.push('"' + data + '"');// Chèn dữ liệu vào array hàng
    }
    csv.push(row.join(','));// Chèn dữ liệu vào file csv
  }
  var csv_string = csv.join('\n');// Nối các dữ liệu bằng dấu xuống hàng
	if($nameCfg == ""){// Nếu không có tên file thì tự tạo
		var filename =  "dataFont.csv";
	}
	else{
		var filename = $nameCfg + ".csv";// Tạo tên file theo tên thiết lập
	}
	var $hex = toHex(csv_string,"");// Chuyển dữ liệu csv sang string hex
	$('#test').text(csv_string);// Chèn dữ liệu csv string hex vào form test
	var $return = execscript('SaveCSV("'+filename+'")');// Chạy script autoit lưu file csv
}

// Hàm bật tắt qua lại kiểu font
function ShowMapFont($check){
  if($check){// Nếu là font bitmap thì tắt font text đi
    $('.item-regexp').hide();
    $('.item-mapFont').show();
  }
  else{// Nếu là font text thì tắt font bitmap đi
    $('.item-mapFont').hide();
    $('.item-regexp').show();
  }
}

function calsinput(e){// Hàm kiểm tra input tính toán
  var $value = $(e).val(); // Lấy dữ liệu regexp từ input
  var $test = $value.match(/[a-z]|\s/gi);// Kiểm tra xem có chứa text không
  if(!$test){// Nếu không chứa
    var $cals = $value.match(/^\-|^\+|^\*|^\/|^0/); // Lấy phép tính đúng
    if(!$cals && $value.length > 0){// Nếu không chứa phép tính
      alert("Vui lòng nhập phép tính trước số liệu bổ sung.\n\nVD: +1, -1, *1, /1 => Tương đương với Cộng Trừ Nhân Chia.")
    }
    else{
      var $cals = $value.match(/^\-|^\+|^\*|^\/|\d+/gi);// Lấy phép tính đúng
      return $value; // Trả về phép tính
    }
  }
}

function CharHoverHide(){// Hàm khi không hover char
  var $style = $('#tooltip').attr("style");// Lấy style tooltip
  $style = $style.replace("opacity: 1","").replace("z-index: 1000","");// Xóa đi style để ẩn tooltip
  $('#tooltip').attr("style",$style + "position:fixed;");// Chèn style vào
}

function charTitleHover(e){// Hàm khi hover char
  var $title = $(e).attr("titleText").replace(/\n/g,"<br>"); // Lấy dữ liệu khi hover
  show_tooltip(e, $title);// Chèn vào tooltip và cho hiện nó
}

function charHover(e){// Hàm khi hover khung char của font ảnh
  show_tooltip(e, $(e).find("span").html());// Chèn vào tooltip và cho hiện nó
}

function show_tooltip(e,b){// Hàm hiện tooltip
  var $widthTag = $(e)[0].offsetWidth; // Lấy width của phần tử được hover
  var $offset = $(e).offset();// Lấy vị trí của phần tử được hover
  var $top = $offset.top; // Lấy top
  var $left = $offset.left;// Lấy left
  var $width = $('#tooltip')[0].offsetWidth; // Lấy width của tooltip
  var $height = $('#tooltip')[0].offsetHeight;// Lấy height của tooltip
  var $right = $left + $width; // Tính right của tooltip
  var $bottom = $top + $height; // Tính bottom của tooltip
  var $screenW = $("body")[0].offsetWidth;; // Lấy chiều rộng trang html
  var $screenH = $("body")[0].offsetHeight; // Lấy chiều cao trang html
  if(($right + 30) > $screenW){// Nếu gần bên lề phải trang html thì lùi tooltip lại về lề trái
    $left = $left - $width - 30;
  }
  if(($bottom + 30) > $screenH){// Nếu gần bên lề dưới trang html thì lùi tooltip lại về lề trên
    $top = $top - $height - 80;
  }
  if($left == 0){// Nếu đang ở lề trái thì giữ nguyên
    $left = $widthTag
  }
  $('#tooltip').html(b);// Chèn chú thích vào tooltip
  var $css = 'opacity: 1;left: '+($left+40)+'px ;top: '+($top+40)+'px;z-index: 1000;'; // Tạo css cho tooltio
  $('#tooltip').attr("style",$css);// Thêm css vào tooltip
}

// Hàm sự kiện khi cuộn

function scrollMove(){
  /*
    var $top = $("html")[0].scrollTop; // Lấy vị trí thanh cuộn
    if($top < 50){// Nếu nhỏ hơn 200 thì ẩn header
        $('.table-header-copy').removeClass("active")
    }
    else{// Nếu lớn hơn 200 thì hiện header
        $('.table-header-copy').addClass("active")
    }
  */
}

function widthTH(){// Hàm căn chỉnh width cho thead
  $('.table-data-body').each(function(){
    var $parent = $(this);
    var $box1 = $parent.find('tbody .header-copy'); // Lấy th ở tbody
    var $box2 = $parent.find('thead .header-copy'); // Lấy th ở thead
    var $tr = $box1.find("th");// Lấy tr tbody
    for(var $k = 0;$k < $tr.length;$k++){
      var $th = $box1.find("th:eq("+$k+")"); // Lấy từng th
      if($th[0]){
        var $width = $th[0].offsetWidth + 1;// Lấy chiều rộng cơ bản của td
        console.log($width);
        $box2.find("th:eq("+$k+")").css("width",$width + "px");// Thêm chiều rộng cho th
        $box1.find("th:eq("+$k+")").css("width",$width + "px");// Thêm chiều rộng cho th
      }
    }
  });
}

function showTable(e){
  var $box = $(e).closest(".item-table-block");
  var $class = $box.find('.table-data-body').attr("class");
  var $table = $box.find(".table-data-body");
  if($class.indexOf("active") > -1){
    $table.removeClass("active");
    $table.hide();
    $(e).html('<i class="fas fa-plus"></i> Hiện Dữ Liệu');
  }
  else{
    $table.addClass("active");
    $table.show();
    $(e).html('<i class="fas fa-minus"></i> Ẩn Dữ Liệu');
    //widthTH();
  }
}

// Hàm chạy khi cuộn
window.addEventListener('scroll', function() {
  scrollMove();
});

function JumpImg(e){// Hàm nhảy khi chọn phân tích
  showIMG(); // Hiện trang ảnh
  var $unicodeNum = $(e).attr("charnumber"); // Lấy số unicode ký tự
  $('.char-cell').each(function(){// Chạy lập theo từng ký tự để tìm ra ký tự phù hợp
    var $textCode = $(this).attr("charnumber"); // Lấy số unicode của ký tự trong font ảnh
    if(Number($unicodeNum) == Number($textCode)){ // Nếu kiểm tra trùng nhau
      var $box = $(this);// Chọn phần tự chủ
      var $top = $box.offset().top - 100; // Tính top
      var $w = $box[0].offsetWidth + 4;// Tính width thực
      var $h = $box[0].offsetHeight + 4;// Tính height thực
      window.scrollTo(0, $top);// Cuộn lên đầu trang
      $box.addClass("DivAnimation");// Thêm css chuyển động
      $box.find(".hover-block-text").css("left",$w).css("$top",$h);// Hiện chú thích cho ký tự này
      setTimeout(function(){// Sau 15 giây đóng tất cả css chuyển động và chú thích
        $box.removeClass("DivAnimation");
        $box.find(".hover-block-text").removeAttr("style")
      },15000)
    }
  })
}

function jumpChar(e){// Hàm nhảy khi chọn ký tự ở ảnh font
  showDATA();// Hiện trang phân tích
  var $unicodeNum = $(e).attr("charnumber"); // Lấy số unicode ký tự
  $('.character-table td[alt="Unicode"]').each(function(){// Chạy lập theo từng ký tự để tìm ra ký tự phù hợp
    var $textCode = $(this).text();// Lấy số unicode của dữ liệu này
    if(Number($unicodeNum) == Number($textCode)){// Nếu kiểm tra trùng nhau
      var $top = $(this).offset().top - 120; // Tính top
      //console.log($top);
      var $box = $(this).closest("tr"); // Chọn theo từng hàng
      //console.log($top);
      $(this)[0].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      //$('.character-table tbody')[0].scrollTo(0, $top); // Cuộn lên đầu trang
      $box.addClass("trAnimation"); // Thêm css chuyển động
      setTimeout(function(){// Sau 15 giây tự động số class
        $box.removeClass();
      },15000)
    }
  })
}

function changeValue(){// Hàm thay đổi dữ liệu khi thêm block hoặc
  var $itemMax = $('.item-struct').length;// Lấy tổng số item struct
  for(var $p = 0;$p < $itemMax;$p++){// Chạy lập qua từng struct
    var $box = $('.item-struct:eq('+$p+')');// Lấy từng struct
    var $title = $box.find('.select-title-struct option:selected').val();// Lấy tiêu đề 1 struct
    $box.find('.title-struct b').text($title);// Chèn tiêu đề vào đúng struct
    $box.find('.item-menu-input').each(function(){// Thực thi từng ô nhập offset và length
      var $value = $(this).val();// Lấy dữ liệu đã nhập
      var $box2 = $(this).closest("li");// Lấy phần tử cha của nó
      if($value.match(/^0x[a-fA-F0-9]+$/)){// Nếu dữ liệu là hex
        $box2.addClass("hex-value");// Thêm vào class hex nếu là hex
       // console.log("Dữ liệu đúng");
      }
      else if($value.match(/^[0-9]+$/)){
        $box2.removeClass("hex-value");// Xóa class hex nếu là dec
      }
      checkHex(this,true)
    });
    //$box.find('.select-title').each(function(){
     // selectType(this);
    //})
    var $byte = 0;// Tạo biến chứa byte
    $box.find('.select-byte option:selected').each(function(){// Thực thi từng trường byte
      $byte = Number($(this).val()) + $byte;// Tính tổng byte đã có
    });
    $box.find('.name-lable-byte').html('Độ Dài <b>('+$byte+' Byte)</b>');// Chèn tổng byte vào ô     
  }
}

BeginRunJS()