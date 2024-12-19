$mutiFile = ""
$number = 0;
$FileJoin = "";
$limitFile = 0;
$maxFile = 0;
$NameFileJoin = "";
$NumberJoin = 0;
$ZipDownload = new JSZip();
$ListFile = "";
$NameList = "";
$typeJoin = "";
$numberSplit = 0;
$FileSplit = "";
$NameFileSplit = "";
$NumberFileSplit = 0;
$UploadType = true;
/*
var $regSave = localStorage.getItem("regKey");
if($regSave != null){
	//var $vreg = $regSave.split("*tach*")[0];
	//var $trep = $regSave.split("*tach*")[1];
	//$('.charRegexpSplit').val($vreg);
	//$('.charRegexpJoin').val($trep);
}
*/



$('input[name="upload-type-file"]').change(function() {
  if (this.value == "file") {
    $UploadType = true;
		$('#fileJoin').removeAttr("webkitdirectory");
  } else {
    $UploadType = false;
		$('#fileJoin').attr("webkitdirectory","webkitdirectory");
  }
})

$('input[name="split-type"]').change(function() {
  if (this.value == "split") {
    $('.limit-line').slideDown(500);
  } else {
    $('.limit-line').slideUp(500);
  }
})

$('input[name="join-type"]').change(function() {
  if (this.value == "split") {
    $('.limit-file').slideUp(500);
  } else {
    $('.limit-file').slideDown(500);
  }
})

$('#fileSplit').on("change", function($data) {
  //console.log($data);
  $ZipDownload = new JSZip();
  $FileSplit = "";
  $numberSplit = 0;
  $maxFileSplit = 0;
  $NumberFileSplit = 0;
  $FileSplit = document.getElementById("fileSplit").files;
  var $check = $('input[name="split-type"]:checked').val();

  $('.type-status').text("Tách File");
  $('.text-load').text("Đang phân tích file, vui lòng chờ...");
  $('.complete-gif').hide();
  $('.loading-gif').show();
  $('.loading-run').addClass("active");
  $('.list-file').html("")
  setTimeout(function() {
    splitTxt($FileSplit[$numberSplit], $numberSplit, $FileSplit, $check);
  }, 2000);

});


function splitTxt(fileToLoad, $number, $mutiFile, $check) {
  // Biến lấy tên file
  var $name = fileToLoad.name;
  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent) {
    // Đọc dữ liệu của file;
    var $textdata = fileLoadedEvent.target.result;
    splitText($textdata, $name, $number, $mutiFile, $check);
  }
  fileReader.readAsText(fileToLoad, "UTF-8"); //UTF-8
}
$maxFileSplit = 0

function splitText($textdata, $name, $number, $mutiFile, $check) {
  $textSave = $textdata;
  if ($check == "join") {
    var $result = $textdata.split(/\r\n\=\=SplitFile\=\=/);
    if ($result.length == 1) {
      alert("File " + $name + " không được nối bằng tool, nên không tách được.");
      $('.loading-run').removeClass("active");
      return false;
    }
    if ($numberSplit < $FileSplit.length) {
      for (var $j = 0; $j < $result.length; $j++) {
        var $block = $result[$j];
        var $split = $block.split(/NameFILE\|(.+)\r\n/gi);
        if ($split.length > 1) {
          var $name = $split[1];
          var $text = $split[2];
          var $list = '<li class="item-file split-item"><label class="file-item">' + $name + '</label></li>';
          $('.list-file').append($list);
          $maxFileSplit = $maxFileSplit + 1;
          $('.type-status').text("Đã tách " + $maxFileSplit + " file.")
          ////console.log($list);
          $ZipDownload.file($name, $text);
        }
      }
    }

    $numberSplit = $numberSplit + 1;
    if ($numberSplit == $FileSplit.length) {
      completeSplit();
      return false;
    }
    splitTxt($FileSplit[$numberSplit], $numberSplit, $FileSplit, $check);
  } else {
    var $split = $textSave.split(/\r\n/);
    var $result = "";
    if ($check == 1) {
      var $split = $textSave.split(/\n/);
    }
    var $maxLine = Number($('input.input-val.input-split').val());
    var $limitLine = $maxLine;
    for (var $j = 0; $j < $split.length; $j++) {
      $result += $split[$j] + "\r\n";
      ////console.log($limitLine);
      if ($j == $limitLine) {
        $NameFileSplit = $name + "_" + $NumberFileSplit + ".txt";
        $NumberFileSplit = $NumberFileSplit + 1;
        $('.type-status').text("Đã tách " + $NumberFileSplit + " file.")
        var $list = '<li class="item-file split-item"><label class="file-item">' + $NameFileSplit + '</label></li>';
        $('.list-file').append($list);
        $limitLine = $maxLine + $limitLine;
        $ZipDownload.file($NameFileSplit, $result);
        $result = "";
      }
      if (($j + 1) == $split.length) {
        $NameFileSplit = $name + "_" + $NumberFileSplit + ".txt";
        $NumberFileSplit = $NumberFileSplit + 1;
        $('.type-status').text("Đã tách " + $NumberFileSplit + " file.")
        var $list = '<li class="item-file split-item"><label class="file-item">' + $NameFileSplit + '</label></li>';
        $('.list-file').append($list);
        $ZipDownload.file($NameFileSplit, $result);
        completeSplit();
        $result = "";
      }
    }
  }
}



function completeSplit() {
  ////console.log("Đã tách xong");
  $('.text-load').text("Đã tách file xong.");
  $('.loading-gif').hide();
  $('.complete-gif').show();
  document.getElementById('fileSplit').value = "";
  setTimeout(function() {
    $ZipDownload.generateAsync({
      type: "blob"
    }).then(function(content) {
      saveAs(content, "All File Split.zip");
    });
    $('.loading-run').removeClass("active");
  }, 2000);
}

$('#fileJoin').on("change", function($data) {
  //console.log($data);
  $mutiFile = "";
  $number = 0;
  $NumberJoin = 0;
  $typeJoin = "";
  $limitFile = Number($('input[name="number-join"]').val());
  $typeJoin = $('input[name="join-type"]:checked').val();
	$ZipDownload = new JSZip();
  $('.type-status').text("Nối File");
  $('.text-load').text("Đang phân tích file, vui lòng chờ...");
  $('.complete-gif').hide();
  $('.loading-gif').show();
  $('.loading-run').addClass("active");
  $('.list-file').html("")
  $maxFile = $limitFile;
  $mutiFile = document.getElementById("fileJoin").files;
  var $type = $mutiFile[0].type;
  // Tạo list tên file
  setTimeout(function() {
    ////console.log($type);
    postFile($number, $mutiFile);
  }, 2000);
});


function postFile($number, $mutiFile) {
  // Nếu chưa đến file cuối thì tạo icont load và icont comple ở file hoàn thành
  getTxt($mutiFile[$number], $number, $mutiFile);

}

// Hàm đọc dữ liệu từng file dựa theo số thứ tự được gửi vào
function getTxt(fileToLoad, $number, $mutiFile) {
  // Biến lấy tên file
  var $name = fileToLoad.name;
	if(fileToLoad.webkitRelativePath){
		$name = fileToLoad.webkitRelativePath;
	}
	
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		// Đọc dữ liệu của file;
		var $textdata = fileLoadedEvent.target.result;
		convertText($textdata, $name, $number, $mutiFile);
	}
	fileReader.readAsText(fileToLoad, "UTF-8");
}

function collect() {
  var $class = $(this).attr("class");
  //console.log($class);
  if ($class.indexOf("active") == -1) {
    $(this).addClass("active");
    $(this).attr("title", "Nhấn để mở rộng.");
    $(this).find(".list-item-child").slideUp(500);
  } else {
    $(this).removeClass("active");
    $(this).attr("title", "Nhấn để thu gọn lại.");
    $(this).find(".list-item-child").slideDown(500);
  }
}

function convertText($textdata, $name, $number, $mutiFile) {
  //console.log("type: " + $typeJoin)
  if ($typeJoin == "join") {
		if($name.indexOf(".txt") > -1){
			$FileJoin += "NameFILE|" + $name + "\r\n" + $textdata + "\r\n" + "==SplitFile==" + "\r\n";
			$NameList += "<li class=\"Item-child\">" + $name + "</li>";
		}
    var $check = $mutiFile.length - $number;
    if ($number == $limitFile /*&& $check > $maxFile*/ ) {
      $limitFile = $maxFile + $limitFile;
      $NameFileJoin = "File_Join_" + $NumberJoin + ".txt";
      $NumberJoin = $NumberJoin + 1;
	  $ZipDownload.file($NameFileJoin, $FileJoin);
	  /*
	  var blob = new Blob([$FileJoin], {
			type: "text/plain;charset=utf-8;",
	  });
	  saveAs(blob, $NameFileJoin);	
	  */
      $FileJoin = "";
      $ListFile += '<li class="item-file" onclick="collect.call(this)" title="Nhấn để thu gọn lại.">';
      $ListFile += '<label class="file-item">' + $NameFileJoin + '</label>';
      $ListFile += '<ul class="list-item-child">' + $NameList + '</ul></li>';
      $('.type-status').text("Đã nối " + $NumberJoin + " file.")
      $('.list-file').append($ListFile);
      $ListFile = "";
      $NameList = "";
			
      //console.log("Gộp lại 1 file: " + $limitFile + "|" + $number + "|" + $maxFile + "|" + $check);
    }
    //console.log("Check: " + $check + "| Maxfile: " + $maxFile)
    //console.log("MaxMuti: " + $mutiFile.length + "| NumberFile: " + $number)
    if ( /*$check < $maxFile &&*/ ($mutiFile.length - 1) == $number) {
      $limitFile = $maxFile + $number;
      $NameFileJoin = "File_Join_" + $NumberJoin + ".txt";
      $NumberJoin = $NumberJoin + 1;
			$ZipDownload.file($NameFileJoin, $FileJoin);
			$ListFile += '<li class="item-file" onclick="collect.call(this)" title="Nhấn để thu gọn lại.">';
			$ListFile += '<label class="file-item">' + $NameFileJoin + '</label>';
			$ListFile += '<ul class="list-item-child">' + $NameList + '</ul></li>';
			$('.list-file').append($ListFile);
			$('.type-status').text("Đã nối " + $NumberJoin + " file.");
			$ListFile = "";
			$NameList = "";
      //console.log("Tới file gộp cuối");
      compleJoin();
      return false;
    }
    //console.log("Chuyển sang file mới");
    $number = $number + 1;
    postFile($number, $mutiFile);
    //console.log("Số:" + $number);
  }
  if ($typeJoin == "split") {
    $FileJoin += $textdata + "\r\n"
    $('.type-status').text("Đã nối " + ($number + 1) + " file.");
    $ListFile = '<li class="item-file" onclick="collect.call(this)" title="Nhấn để thu gọn lại."><label class="file-item">' + $name + '</label></li>';
    $('.list-file').append($ListFile);
    if (($number + 1) == $mutiFile.length) {
		$ZipDownload.file($name.replace(/\_\d+\.txt/,".txt"), $FileJoin);
		/*
	  	var blob = new Blob([$FileJoin], {
			type: "text/plain;charset=utf-8;",
		});
		saveAs(blob, $name.replace(/\_\d+\.txt/,".txt"));	
		*/
      compleJoin();
      return false;
    }
    $number = $number + 1;
    postFile($number, $mutiFile);
  }
}

function compleJoin() {

  $('.text-load').text("Đã nối file xong.");
  $('.loading-gif').hide();
  $('.complete-gif').show();
  document.getElementById('fileJoin').value = "";
  setTimeout(function() {
	  if($NumberJoin == 1){
		var blob = new Blob([$FileJoin], {
			type: "text/plain;charset=utf-8;",
		});
		saveAs(blob, "All Text Join.txt");	
		$('.loading-run').removeClass("active");
	  }
	  else{
		//*  
		$ZipDownload.generateAsync({
		  type: "blob"
		}).then(function(content) {
		  saveAs(content, "All File Join.zip");
		});
		$('.loading-run').removeClass("active");

	  //*/
	  }
  }, 2000);
}

function submitSplit(){
	var $vreg = $('.charRegexpSplit').val();
	var $trep = $('.charRegexpJoin').val();
	if($trep.length < 1 || $vreg.length < 1){
		alert("Vui lòng nhập các cụm từ hoặc từ thay thế vào ô.")
	}
	else{
		$run = false;
		var $reg = new RegExp($vreg,"g");
		var $source = $('.char-result-text').val();
		var $obj = $source.split("\n");
		var $result = ""
		var $allCum = "";
		for(var $j = 0;$j < $obj.length;$j++){
			var $bl = $obj[$j];
			var $mt = $bl.match($reg);
			var $plus = "";
			if($mt){
				for(var $t = 0;$t < $mt.length;$t++){
					var $l = $mt[$t];
					$bl = $bl.replace($l,$trep + $t + " ");	
					$plus += $l + " ";
				}
				$allCum += $plus + "\n";
				$result += $bl + "\n";
			}
			else{
				$result += $bl + "\n"
				$allCum += "\n";
			}

		}
		$('.char-result-text').val($result);
		$('.char-result-char').val($allCum);
		var $regKey = $vreg + "*tach*" + $trep;
		//var $regSave = localStorage.setItem("regKey", $regKey);
		$('textarea.char-result-text, textarea.char-result-char').css("background","cornsilk");
		setTimeout(function(){
			$('textarea.char-result-text, textarea.char-result-char').css("background","white");		
		},5000);

	}

}

function submitJoin(){
	var $vreg = $('.charRegexpSplit').val();
	var $trep = $('.charRegexpJoin').val();
	if($trep.length < 1 || $vreg.length < 1){
		alert("Vui lòng nhập các cụm từ hoặc từ thay thế vào ô.")
	}
	else{
		$run = false;
		var $reg = new RegExp($vreg,"g");
        console.log("$reg = " + $reg);
		var $source = $('.char-result-text').val();
		var $comple = $('.char-result-char').val();
		var $obj = $comple.split("\n");
		var $textAll = $source.split("\n");
		var $result = ""
		var $allCum = "";
		for(var $j = 0;$j < $obj.length;$j++){
			var $bl = $obj[$j];
            console.log("$bl = " + $bl);
			var $tl = $textAll[$j];
            console.log("$tl = " + $tl);
			var $mt = $bl.match($reg);
            console.log("$mt = " + $mt);
			var $plus = "";
			if($mt){
				for(var $t = 0;$t < $mt.length;$t++){
					var $l = $mt[$t];
                    console.log("$l = " + $l);
					$tl = $tl.replace($trep + $t,$l);
                    console.log("replace = " + $trep + $t + " ");
				}
				$result += $tl + "\n"
			}
			else{
                if($tl != undefined){
				    $result += $tl + "\n"
                    console.log("$tl = " + $tl)
                }
			}

		}
		$('.char-result-text').val($result);
		$('textarea.char-result-text').css("background","cornsilk");
		setTimeout(function(){
			$('textarea.char-result-text').css("background","white");		
		},5000)
	}
};

$upCASE = false;

function RunReplace(){
	console.log("Run replace file");
	if($saveTextDownload){
		if(!$saveTextReplace){
			alert("Vui lòng upload file text replace cụm từ.");
			return false;
		}
		var $max = $saveTextDownload.length;
		for($k = 0;$k < $max;$k++){
			var $cumReplace = $saveTextReplace;
			$lineCum = $cumReplace.split("\n");
			var $TextAll = $saveTextDownload[$k].text;
			$packCum = new Object();
			for(var $j = 0;$j < $lineCum.length;$j++){
				var $block = $lineCum[$j];
				var $split = $block.split("\t");
				if($block.match(/\t/)){
					if($upCASE == true){
						var $in = $split[0];
					}
					else{
						var $in = $split[0].toLowerCase();
					}
					//console.log("$in: " + $in)
					var $out = $split[1];
					//console.log("$out: " + $out)
					$packCum[$in] = $out;
				}
			}
			console.log("Đang thực thi " + ($k + 1) + " / "+ $max +" files");
			var $resultReplace = CumTuReplace($TextAll,$packCum);
			$saveTextDownload[$k].text = $resultReplace;
		}
		SaveFileText($saveTextDownload);
		console.log("Đã replace xong text lưu trong biến tải về");
	}
	else{
		alert("Vui lòng upload file text nguồn")
	}
}

function SaveFileText($OBJFile){
	var $maxFiles = $OBJFile.length;
	if($maxFiles == 1){
		var blob = new Blob([$OBJFile[0].text], {
			type: "text/plain;charset=utf-8;",
		});
		saveAs(blob, $OBJFile[0].name);	
	}
	else{
		var $ZipTEXT = new JSZip();
		for(var $h = 0;$h < $maxFiles;$h++){
			var $file = $OBJFile[$h];
			$ZipTEXT.file($file.name, $file.text);
		}
		$ZipTEXT.generateAsync({
		  type: "blob"
		}).then(function(content) {
		  saveAs(content, "All File Replace.zip");
		});
	}
}

function submitReplaceCheck(){
	try{
		submitReplace();
	}
	catch(e){
		console.log(e);
		alert("Dung lượng file quá lớn... Không thể thực thi được.")
	}
}

function DAOCUMTU(e){
	if($optionSave == true){
		//$upCASE = false;
		var $cumReplace = $('.char-result-char').val();
		var $newText = chuyendoi($cumReplace);
		$('.char-result-char').val($newText);
		console.log("Chuyển khi cụm replace là ở khung.")
	}
	else{
		//$upCASE = true;
		var $cumReplace = $saveTextReplace;
		var $newText = chuyendoi($cumReplace);
		$saveTextReplace = $newText;
		$('.char-result-char').val($newText);
		console.log("Chuyển khi cụm replace đã upload.")
	}
}

function chuyendoi($cumReplace){
	var $newReturn = "";
	var $lineCum = $cumReplace.split("\r\n");
	if($lineCum){
		if($lineCum.length == 1){
			var $lineCum = $cumReplace.split("\n");
		}
	}
	for(var $j = 0;$j < $lineCum.length;$j++){
		var $block = $lineCum[$j];
		var $split = $block.split("\t");
		if($block.match(/\t/)){
			if($upCASE == false){
				$line = $split[1]+"\t"+$split[0];
			}
			if($upCASE == true){
				$line = $split[0]+"\t"+$split[1];
			}
			$newReturn += $line + "\r\n";
		}
	}
	if($upCASE == false){
		$upCASE = true;
		$('.copyform.daocumtu').removeClass("active");
		$('.copyform.daocumtu').addClass("active");
	}
	if($upCASE == true){
		$upCASE = false
		$('.copyform.daocumtu').removeClass("active");
	}
	console.log($upCASE);
	return $newReturn;
}


function submitReplace(){
	if($optionSave == true){
		var $cumReplace = $('.char-result-char').val();	// Replace Text
	//console.log("$cumReplace" + $cumReplace)
		$lineCum = $cumReplace.split("\n");
	if($lineCum){
		if($lineCum.length == 1){
			var $lineCum = $cumReplace.split("\n");
		}
	}
		var $TextAll = $('.char-result-text').val();
	}
	else{
		RunReplace();
		return false;
	}
	$packCum = new Object();
	for(var $j = 0;$j < $lineCum.length;$j++){
		var $block = $lineCum[$j];
		var $split = $block.split("\t");
		if($block.match(/\t/)){
			if($upCASE == true){
				var $in = $split[0];
			}
			else{
				var $in = $split[0].toLowerCase();
			}
			//console.log("$in: " + $in)
			var $out = $split[1];
			//console.log("$out: " + $out)
			$packCum[$in] = $out;
		}
	}
	var $result = CumTuReplace($TextAll,$packCum);
	$('.char-result-text').val($result);
	$('textarea.char-result-text').css("background","cornsilk");
		setTimeout(function(){
			$('textarea.char-result-text').css("background","white");		
	},5000)
}

RegExp.quote = function(str) {
     return str.replace(/([.?*+^$[\]\\(){}-])/g, "\\$1");
};

function CumTuReplace(str, map){
	$object = map;
	//var matchStr = Object.keys(map).join('\\b|\\b');
	//var matchStr = Object.keys(map).join('|');
	var matchStr = Object.keys($packCum).join('|');
	//matchStr = "" + matchStr + ""
	matchStr = RegExp.quote(matchStr);
	matchStr = matchStr.replace(/\|/g,"\\b|\\b").replace(/\\b</gi,"<").replace(/>\\b/gi,">").replace(/(\\)/gi,"\$1");
	//console.log(matchStr)
	if (!matchStr){
		return str;
	}
	//var regexp = new RegExp(matchStr, 'gi');
	if($upCASE == true){
		matchStr = matchStr.replace(/\\b/gi,"");
		var regexp = new RegExp(matchStr, 'gi');
	}
	else{
		var regexp = new RegExp("\\b" + matchStr + "\\b", 'gi');		
	}
	console.log(regexp)
	var $text = str.replace(regexp, function(match){
		if($upCASE == true){
			var $lowCas = match;
		}
		else{
			var $lowCas = match.toLowerCase();
		}
		if(map[$lowCas]){
			//console.log($lowCas + " = " + map[$lowCas]);
			//console.log($lowCas);
			return map[$lowCas]
		}
		else{
			console.log($lowCas + " = " + map[$lowCas]);
			return match
		}
	});
	return $text
}

$optionSave = true;
$saveTextDownload = new Array();
$saveTextReplace = false;

function optionForm(){
	$('.option-button-change').removeClass("active").addClass("active");
	$optionSave = true;
}

function optionDownload(){
	$('.option-button-change').removeClass("active");
	$optionSave = false;
}

function formLeft(){
	var $files = $('#fileUploadXML')[0].files;
	var $maxFiles = $files.length;
	for(var $j = 0;$j < $maxFiles;$j++){
		var $file = $files[$j];
		var $textRead = readFileTxt($file,"Left");
	}
}

function formRight(){
	var $files = $('#fileUploadTEXT')[0].files;
	var $maxFiles = $files.length;
	for(var $j = 0;$j < $maxFiles;$j++){
		var $file = $files[$j];
		var $textRead = readFileTxt($file,"Right");
	}
}

function selectText(){
	var $box = $('.text-result');
	$box.focus();
	$box[0].select();
}

function copyAll($this){
    var $form = $($this).next();
	$form.focus();
	$form[0].select();
	var ok = document.execCommand('copy');
	if(ok){
		alert("Đã copy text vào bộ nhớ tạm");
	}
}


function ActionLeft($text,$nameFile){
	var $old = $('.char-result-text').val();
	var $new = $old + "\r\n" + $text;
	if($optionSave == true){
		$('.char-result-text').val($new);
		console.log("Tùy chọn chèn text vào khung");
	}
	else{
		var $objFile = new Object();
		$objFile.text = $new;
		$objFile.name = $nameFile;
		$saveTextDownload.push($objFile);
		console.log("Tùy chọn tải file text về máy");
	}
}

function ActionRight($text,$nameFile){
	//var $old = $('.char-result-char').val();
	//var $new = $old + "\r\n" + $text;
	if($optionSave == true){
		$('.char-result-char').val($text);
		console.log("Tùy chọn chèn text vào khung");
	}
	else{
		$saveTextReplace = $text;
		$('.char-result-char').val($text);
		console.log("Tùy chọn tải file text về máy");
	}
}

function readFileTxt($File,$action) {
	var $nameFile = $File.name;
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
	  if($action == "Left"){
		  ActionLeft(text,$nameFile)
	  }
	  else{
		  ActionRight(text,$nameFile)
	  }
    };
    reader.readAsText($File);
};

function eraseForm(){
	$('textarea.char-result-text, textarea.char-result-char').val("");
}