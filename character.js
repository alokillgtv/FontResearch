// Lấy ký tự đã lưu
var $save = localStorage.getItem("saveChar");
var $typeText = true;
var $mutiFileChar = "";
var $numberFileChar = 0;
var $objTxtFile = [];
var $regexp = ""
$('.tool-item').click(function(){
	var $class = $(this).attr("class");
	if($class.indexOf("active") == -1 && $class.indexOf("pack-tool") > -1){	
		$('.tool-item.active').removeClass("active");
		$(this).addClass("active");
		$('.page-content,.page-join,.page-splitchar').slideUp(500);
		$('.page-encode').slideDown(500);
	}
	if($class.indexOf("active") == -1 && $class.indexOf("join-tool") > -1){
		$('.tool-item.active').removeClass("active");
		$(this).addClass("active");
		$('.page-content,.page-encode,.page-splitchar').slideUp(500);
		$('.page-join').slideDown(500);
	}
	if($class.indexOf("active") == -1 && $class.indexOf("split-tool") > -1){
		$('.tool-item.active').removeClass("active");
		$(this).addClass("active");
		$('.page-content,.page-encode,.page-join').slideUp(500);
		$('.page-splitchar').slideDown(500);
	}
	if($class.indexOf("active") == -1 && $class.indexOf("js-tool") > -1){
		$('.tool-item.active').removeClass("active");
		$(this).addClass("active");
		$('.page-content').slideUp(500);
		$('.page-js').slideDown(500);
	}
})

$('#fileUploadChar').on("change", function($data) {
	//console.log($data);
	$ZipDownload = new JSZip();
	$mutiFileChar = "";	
	$numberFileChar = 0;
	$objTxtFile = [];
	$mutiFileChar = document.getElementById("fileUploadChar").files;
	if($mutiFileChar.length > 0){
		$('.all-file-upload').html("");
		GetTxtChar($mutiFileChar[0], $numberFileChar, $mutiFileChar);
		alert("Đã upload "+$mutiFileChar.length+" file, vui lòng sử dụng các tùy chọn, mã hóa hoặc giải mã để dùng");
	}
	
})


function alert(a, $time) {
  $('.jconfirm').remove();
  if ($time) {
    var $setTime = 'ok|' + $time;
  } else {
    var $setTime = 'ok|60000';
  }
  $boxAlert = $.alert({
    title: a,
    content: "",
    theme: "dark",
    autoClose: $setTime
  });
}

function GetTxtChar(fileToLoad, $number, $mutiFile) {
  // Biến lấy tên file
  var $name = fileToLoad.name;
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent) {
    // Đọc dữ liệu của file;
    var $textdata = fileLoadedEvent.target.result;
		$number = $number + 1;
    completeText($textdata, $name, $number, $mutiFile);
  }
  fileReader.readAsText(fileToLoad, "UTF-8");
}

function completeText($textdata, $name, $number){
	
	if(($number - 1) < $mutiFileChar.length){
		var $new = new Object();
		$new.text = $textdata;
		$new.name = $name;
		$objTxtFile.push($new);
		//console.log($number);
		$('.all-file-upload').append("<li>"+$name+"</li>")		
					
	}	
	if($number == $mutiFileChar.length){
		//$new.text = $textdata;
		//$new.name = $name;
		//$objTxtFile.push($new);
		//console.log($number);
		//$('.all-file-upload').append("<li>"+$name+"</li>")
		//$('#fileUploadChar').val("");
		return false;
		//alert("Xong");
	}
	GetTxtChar($mutiFileChar[$number], $number, $mutiFileChar);
}

$('.type-option').click(function(){
	$('.option-result .active').removeClass("active");
	$(this).addClass("active");
	var $class = $(this).attr("class");
	if($class.indexOf("text-copy") > -1){
		$typeText = true
		$('.list-file-encode').slideUp(500);
		$('.input-page').slideDown(500);
	}
	else{
		$typeText = false;
		$('.input-page').slideUp(500);
		$('.list-file-encode').slideDown(500);
	}
});

$('#jsonChar').on("change", function($data) {
	//console.log($data);
	var $FileChar = document.getElementById("jsonChar").files[0];
	var $name = $FileChar.name;
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent) {
    // Đọc dữ liệu của file;
    var $textdata = fileLoadedEvent.target.result;
		var $obj = JSON.parse($textdata);
		$('.character-input').val($obj.input);
		$('.character-output').val($obj.output);
		switchIn()
  }
  fileReader.readAsText($FileChar, "UTF-8");
})

if($save != null){
	var $obj = JSON.parse($save);
	$('.character-input').val($obj.input);
	$('.character-output').val($obj.output);
	switchIn()
}
else{
	switchIn();
}


$('.btn-switch').click(function(){
	// Lấy class
	var $class = $(this).attr("class");
	// Kiểm tra xem đã kích hoạt chưa
	if($class.indexOf("active") == -1){
		switchIn();
	}
	else{
		$(this).removeClass("active");		
		switchOut();
		$('.character-input-result').slideUp(500);
		$('.character-output-result').slideUp(500);
		$('.character-input').slideDown(500);
		$('.character-output').slideDown(500);
	}
	getCharacter();
})

function switchIn(){
	// Nếu chưa kích hoạt thì thêm class active
	$('.btn-switch').addClass("active");
	$('.character-input-result,.character-output-result').html("");
	// Lấy dữ liệu ký tự đầu vào
	$input = $('.character-input').val().split("\n");
	
	// Lấy dữ liệu ký tự đầu ra
	$output = $('.character-output').val().split("\n");
	// Kiểm tra ký tự đầu vào và ra, nếu thiếu thì ngưng sự kiện
	if($input.length != $output.length){
		if($input.length > $output.length){
			alert("Ký tự đầu ra của bạn đã bị thiếu.<br><br>Nó không trùng khớp với ký tự đầu vào.<br><br>Vui lòng kiểm tra lại.");
			return false;
		}
		if($input.length < $output.length){
			alert("Ký tự đầu vào của bạn đã bị thiếu.<br><br>Nó không trùng khớp với ký tự đầu vào.<br><br>Vui lòng kiểm tra lại.");
			return false;
		}
	}
	// Nếu đúng thì chạy sự kiện
	else{					// Nếu chưa kích hoạt thì thêm class active
		$(this).addClass("active");
		$('.character-input-result,.character-output-result').html("");
		// Lấy dữ liệu ký tự đầu vào
		$input = $('.character-input').val().split("\n");
		
		// Lấy dữ liệu ký tự đầu ra
		$output = $('.character-output').val().split("\n");
		// Kiểm tra ký tự đầu vào và ra, nếu thiếu thì ngưng sự kiện
		if($input.length != $output.length){
			if($input.length > $output.length){
				alert("Ký tự đầu ra của bạn đã bị thiếu.<br><br>Nó không trùng khớp với ký tự đầu vào.<br><br>Vui lòng kiểm tra lại.");
				return false;
			}
			if($input.length < $output.length){
				alert("Ký tự đầu vào của bạn đã bị thiếu.<br><br>Nó không trùng khớp với ký tự đầu vào.<br><br>Vui lòng kiểm tra lại.");
				return false;
			}
		}
		// Nếu đúng thì chạy sự kiện
		else{
		// Lấy dữ liệu ký tự đầu vào
			$input = $('.character-input').val().split("\n");
				
			// Lấy dữ liệu ký tự đầu ra
			$output = $('.character-output').val().split("\n");
			var $resultInput = '<ul class="list-item-input item-input-char">';
			var $resultOutput = '<ul class="list-item-input item-output-char">';
			for(var $j = 0;$j < $input.length;$j++){
				var $charInput = $input[$j];
				var $charOutput = $output[$j];
				//console.log($charInput + "|" + $charOutput)
				var $inputHtml = '<li><input onclick="focusInput.call(this)" class="input-text input-char" type="text" value="'+$charInput.replace('"',"&quot;")+'"/></li>';
				var $outputHtml = '<li><input onclick="focusInput.call(this)" class="input-text output-char" type="text" value="'+$charOutput+'"/></li>';
				if($charInput.length == 0 || $charOutput.length == 0){
					$inputHtml = "";
					$outputHtml = "";
				}
				$resultInput += $inputHtml;
				$resultOutput += $outputHtml;
			}
			$('.character-input').slideUp(500);
			$('.character-output').slideUp(500);
			$resultInput = $resultInput + "</ul><button class=\"add-char btn-add\" onclick=\"addChar.call(this)\">+ Thêm Ký Tự</button>";
			$resultOutput = $resultOutput + "</ul><button class=\"add-char btn-add\" onclick=\"addChar.call(this)\">+ Thêm Ký Tự</button>";
			$('.character-input-result').html($resultInput + "</ul>").slideDown(500);
			$('.character-output-result').html($resultOutput + "</ul>").slideDown(500);
		}
	}
}

function switchOut(){
	var $input = "";
	var $output = "";
	$('.input-char').each(function() {
		$input += $(this).val() + "\n";
	});
	$('.output-char').each(function() {
		$output += $(this).val() + "\n";
	});
	$('.character-input').val($input);
	$('.character-output').val($output);
}
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
// Hàm lưu ký tự lại cho lần sau
$('.btn-save').click(function(){
	// Xóa lưu trữ cũ
	var $class = $('.change-input.btn-switch').attr("class");
	if($class.indexOf("active") > -1){
		switchOut();
	}
	localStorage.removeItem("saveChar");
	var $result = new Object();
	var $input = $('.character-input').val();
	var $output = $('.character-output').val();
	if($input.split("\n").length == $output.split("\n").length && $input.length > 0){
		$result.input = $input;
		$result.output = $output;
		localStorage.setItem("saveChar",JSON.stringify($result));
		//alert("Đã lưu lại ký tự cho lần dùng sau.");
		download(JSON.stringify($result), 'json-character.txt', 'text/plain');
	}
	else{
		alert("Đã xảy ra lỗi khi lưu.<br>Hãy kiểm tra lại các ký tự.")
		return false;
	}	
})

function addChar(){
	$('.item-input-char').append('<li><input onclick="focusInput.call(this)" class="input-text input-char" type="text" value=""/></li>');
	$('.item-output-char').append('<li><input onclick="focusInput.call(this)" class="input-text output-char" type="text" value=""/></li>');
}

function mapReplace(str, map){
  var matchStr = Object.keys(map).join('|');
  if (!matchStr){
		return str;
	}
	matchStr = matchStr.replace(/([\s!@#$%^&*()_+\-=\[\]{};':\"\\,.<>\/?...])/gi,"\\$1").replace(/\|$/,"");
	matchStr += "|(\\<\\w+\\>)";
  $regexp = new RegExp(matchStr, 'g');
	var $text = str.replace($regexp, function(match){
		//console.log(match);
		if(match.match(/(\<\w+\>)/gi)){
			return match.replace(/\<|\>/gi,"")
		}
		else{
			return map[match]
		}
		
	});
	//$text = $text.replace(/([!@#$%^&*()_+\-=\[\]{};':\"\\,.<>\/?...])/gi, match => map[match]);
  return $text
};


function focusInput(){
		$('.list-item-input li.active').removeClass("active");
		var $class = $(this).attr("class");
		var $box = $(this).closest("li");
		var $index = $box.index();
		if($class.indexOf('input-char') > -1 ){				
			var $block = $('.item-output-char li:eq('+$index+')');
			$block.addClass("active");
			$block[0].scrollIntoView();
			//console.log("Focus input");
		}
		else{
			var $block = $('.item-input-char li:eq('+$index+')');
			$block.addClass("active");
			$block[0].scrollIntoView();
			//console.log("Focus output");
		}
}

var $pack = "";
var $repack = "";

$('.btn-click').click(function(){
	$input = $('.character-input').val().split("\n");
	
	// Lấy dữ liệu ký tự đầu ra
	$output = $('.character-output').val().split("\n");
	// Kiểm tra ký tự đầu vào và ra, nếu thiếu thì ngưng sự kiện
	if($input.length != $output.length){
		if($input.length > $output.length){
			alert("Ký tự đầu ra của bạn đã bị thiếu.<br><br>Nó không trùng khớp với ký tự đầu vào.<br><br>Vui lòng kiểm tra lại.");
			return false;
		}
		if($input.length < $output.length){
			alert("Ký tự đầu vào của bạn đã bị thiếu.<br><br>Nó không trùng khớp với ký tự đầu vào.<br><br>Vui lòng kiểm tra lại.");
			return false;
		}
	}
	// Nếu đúng thì chạy sự kiện
	else{
		var $class = $(this).attr("class");
		// Nếu là mã hóa
		if($class.indexOf("btn-encode-input") > -1){
			getCharacter();		
			// Nếu kiểu nhập text
			if($typeText == true){
				textPack();
			}
			// Nếu kiểu upload file
			else{
				filePack()
			}
		}
		// Nếu là giải mã
		else{
			getCharacter();
			if($typeText == true){
				textRepack();
			}
			// Nếu kiểu upload file
			else{
				fileRepack();
			}
		}
	}
	
})

function textPack(){
	getCharacter();
	//setTimeout(function(){
		var $value = $('.text-result').val();
		if(/^[0-9a-f\s0-9a-f]+$/i.test($value) == true){
			$value = $value.replace(/\s/gi,"");
		}
		var $result = mapReplace($value,$pack);
		$('.text-result').val($result);
		$('.text-result').addClass("active");
	//},2000);
}

function textRepack(){
	getCharacter();
	
	//setTimeout(function(){
		var $value = $('.text-result').val();
		if(/^[0-9a-f\s0-9a-f]+$/i.test($value) == true){
			$value = $value.replace(/\s/gi,"");
		}
		var $result = mapReplace($value,$repack);
		$('.text-result').val($result);
		$('.text-result').removeClass("active");
	//},2000);
}

function filePack(){
	for(var $j = 0;$j < $objTxtFile.length;$j++){
		var $text = $objTxtFile[$j].text;
		var $name = $objTxtFile[$j].name;
		$text = mapReplace($text,$pack);
		$ZipDownload.file($name, $text);
	}
	alert("Đã mã hóa các file text, và nén lại thành zip.<br>Vui lòng chờ tải xuống.");
	setTimeout(function() {
    $ZipDownload.generateAsync({
      type: "blob"
    }).then(function(content) {
      saveAs(content, "All File.zip");
    }); 
  }, 2000);
}

function fileRepack(){
	for(var $j = 0;$j < $objTxtFile.length;$j++){
		var $text = $objTxtFile[$j].text;
		var $name = $objTxtFile[$j].name;
		$text = mapReplace($text,$repack);
		$ZipDownload.file($name, $text);
	}
	alert("Đã giải mã các file text, và nén lại thành zip.<br>Vui lòng chờ tải xuống.");
	setTimeout(function() {
    $ZipDownload.generateAsync({
      type: "blob"
    }).then(function(content) {
      saveAs(content, "All File.zip");
    });

  }, 2000);
}

function getCharacter(){
	var $input = $('.character-input').val().split("\n");
	// Lấy dữ liệu ký tự đầu ra
	var $output = $('.character-output').val().split("\n");
	$pack = new Object();
	$repack = new Object();
	for(var $j = 0;$j < $input.length;$j++){
		var $charInput = $input[$j];
		var $charOutput = $output[$j];
		$pack[$charInput] = $charOutput;				
		$repack[$charOutput] = $charInput;
	}
}

$('.select-all').click(function(){
	selectText();
})

$('.copy-all').click(function(){
	selectText();
	var ok = document.execCommand('copy');
	if(ok){
		alert("Đã copy text vào bộ nhớ tạm");
	}
});


function selectText(){
	var $box = $('.text-result');
	$box.focus();
	$box[0].select();
}

function copy(){
		// Setup the variables
	var textarea = document.getElementById("textarea");
	var answer  = document.getElementById("copyAnswer");
	var copy    = document.getElementById("copyBlock");
	copy.addEventListener('click', function(e) {

		 // Select some text (you could also create a range)
		 textarea.select(); 

		 // Use try & catch for unsupported browser
		 try {

				 // The important part (copy selected text)
				 var ok = document.execCommand('copy');

				 if (ok) answer.innerHTML = 'Copied!';
				 else    answer.innerHTML = 'Unable to copy!';
		 } catch (err) {
				 answer.innerHTML = 'Unsupported Browser!';
		 }
	});
}