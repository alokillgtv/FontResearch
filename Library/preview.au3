#include <Array.au3>
#include <WinAPIConv.au3>

; Hàm chuyển Endian
Func SwapEndian($iValue,$range,$check)
$value = Hex(_WinAPI_SwapQWord("0x"&Hex($iValue)));
$smax = StringLen($value) - $range;
$result = StringTrimRight($value,$smax);
If $check = true Then
	return Dec($result);
Else
	return $result;
EndIf
EndFunc
;SendData(512,1024,179,1539,0,"0##3##1||9##4##4||10##4##5||11##4##6||12##4##7||3##2##1||4##2##1||1##2##1||2##2##1||","C:\Users\Administrator\Desktop\Font View\Chainprinter_Latin.ffd");

; Hàm gửi dữ liệu
Func SendData($wIMG,$hIMG,$maxChar,$charPos,$typeChar,$charlist,$linkFont)
	;ConsoleWrite("Đã gửi dữ liệu");
	$check = StringRegExp($linkFont,"^[a-zA-Z]:\\\w|^[a-zA-Z]:\/\w",0); Kiểm tra xem đường dẫn có đúng không
	If $check = 0 Then
		$linkFont = @ScriptDir&"\"&$linkFont
	EndIf
	$FileFont = FileOpen($linkFont,0+16); Mở file font bằng Hex
	If Not(FileExists($linkFont)) Then ; Nếu file font không tồn tại, thì hiện cảnh báo
		MsgBox(0,"Cảnh Báo","Đường dẫn file không tồn tại, vui lòng kiểm tra lại."&@CRLF&$linkFont);
		return false;
	EndIf
	FileSetPos($FileFont,$charPos,0); Dịch chuyển con trỏ đến vị trí ký tự đầu tiên
	$AllResult = ""; Tạo một biến chứa dữ liệu
	For $j = 0 To $maxChar - 1 ; Chạy lập qua từng ký tự
		$blockChar = ListChar($linkFont,$wIMG,$hIMG,$maxChar,$charPos,$typeChar,$charlist,$FileFont); Lấy dữ liệu phân tích từ hàm ListChar
		$AllResult &= $blockChar & "##"; Nối bọn chúng lại bằng dấu phân tách
	Next
	;ConsoleWrite($AllResult&@CRLF);
	HTML_GUICtrlSetText("formData",$AllResult)	; Chuyển dữ liệu sang HTML bằng formData
	HTML_EvalJS("dataChange()");	Khởi chạy script bên HTML
EndFunc

; Hàm phân tích dữ liệu font
Func ListChar($linkFont,$wIMG,$hIMG,$maxChar,$charPos,$typeChar,$charlist,$FileFont)
	$arrayChar = StringSplit($charlist,"||",1);	Tạo một biến tách các dữ liệu file font
	$itemGet = ""; Tạo biến chứa dữ liệu font
	$itemHex = ""; Tạo biến chứa dữ liệu hex font
	$itemCals = "";
	For $j = 1 To $arrayChar[0]	; Chạy lập qua từng block
		$block = $arrayChar[$j]; Lấy từng block
		If StringLen($block) > 1 Then	; Nếu là ký tự
			$chitiet = StringSplit($block,"##",1);	Tách các dữ liệu ra.
			$title = $chitiet[1];	Lấy tên một block
			$byte = $chitiet[2];	Lấy kiểu dữ liệu một block
			$type = $chitiet[3];	Lấy giá trị byte của một block
			$cals = $chitiet[4];	Lấy phép tính bổ sung của block này
			ConsoleWrite($cals&@CRLF);
			$save = $chitiet[5];	Kiểm tra xem có cần lưu block này hay không
			$getItem = GetBlock($title,$byte,$type,$wIMG,$hIMG,$maxChar,$charPos,$typeChar,$FileFont,$cals,$save);  Chạy hàm lấy giá trị thực của block đang thực thi này
			$itemGet &= $getItem[0];	Lưu giá trị của block
			$itemHex &= $getItem[1];	Lưu block hex hiện tại của block này
			$itemCals &= $cals & "||";
		EndIf
	Next
	return $itemGet & "$$$$" & $itemHex & "$$$$" & $itemCals; Trả về dữ liệu
EndFunc

; Hàm chuyển số âm trong hex
Func numberNegative($hex,$byteGet)
	Switch $byteGet ; Kiểm tra giá trị của byte
		Case 2 ; Nếu là 1 byte
			$maxNumber = 255 ; Giá trị tối đa là 255
		Case 4 ; Nếu là 2 byte
			$maxNumber = 65535 ; Giá trị tối đa là 65535
		Case 6	; Nếu là 3 byte
			$maxNumber = 16777215 ; Giá trị tối đa là 16777215
		Case 8	; Nếu là 4 byte
			$maxNumber = 4294967295 ; Giá trị tối đa là 4294967295
	EndSwitch
	$splitNumber = ($maxNumber / 2) ; Phân nữa giá trị tối đa
	$numberHex = Dec($hex);	Chuyển giá trị hex sang dec
	;ConsoleWrite($numberHex&@CRLF);
	if $numberHex > $splitNumber Then	; Nếu giá trị hex lớn hơn phân nữa giá trị tối đa, thì nó là số âm
		$numberNegative = $numberHex - $maxNumber;	Tính ra số âm
	Else
		$numberNegative = $numberHex;
	EndIf
	return $numberNegative
EndFunc

; Hàm tính giá trị của block
Func GetBlock($title,$byte,$type,$wIMG,$hIMG,$maxChar,$charPos,$typeChar,$FileFont,$cals,$save)
	$value = FileRead($FileFont,$byte);	Lấy dữ liệu hex của block
	$byte2 = $byte;	Độ dài của block
	Switch $type ; Kiểm tra xem kiểu dữ liệu của block
		Case 0	; Character
			If $typeChar = 0 Then
				$result = SwapEndian($value,($byte*2),true); Chuyển dữ liệu sang dạng Decimal và kiểu dữ liệu là Litter Endian
				;ConsoleWrite("Text: "&$result&@CRLF);
			Else
				$result = Dec(Hex($value));
			EndIf
		Case 1	;Decimal
			If $typeChar = 0 Then
				$numberChange = SwapEndian($value,($byte*2),true) & $cals; Chuyển dữ liệu sang dạng Decimal đã được tính thêm phép tính bổ sung nếu có và kiểu dữ liệu là Litter Endian
				$result = Round(Execute($numberChange),2) ; Thu gọn dấu thập phân
			Else
				$result = Round(Execute(Dec(Hex($value)) & $cals),4);
			EndIf
		Case 2	;Hex
			If $typeChar = 0 Then
				$numberChange = Execute(SwapEndian($value,($byte*2),true) & $cals); ; Chuyển dữ liệu sang dạng Decimal đã được tính thêm phép tính bổ sung nếu có và kiểu dữ liệu là Litter Endian
				$result = Hex($numberChange,($byte*2));
			Else
				$numberChange = Execute(Dec(Hex($value)) & $cals)
				$result = Hex($numberChange,($byte*2));
			EndIf
		Case 3	;Float
			If $typeChar = 0 Then
				$dec = SwapEndian($value,($byte*2),true); Chuyển dữ liệu sang dạng Float đã được tính thêm phép tính bổ sung nếu có và kiểu dữ liệu là Litter Endian
				$float = _WinAPI_IntToFloat($dec);
				$result = Round(Execute($float & $cals),2);
			Else
				$float = _WinAPI_IntToFloat(Hex($value));
				$result = Round(Execute($float & $cals),2);
			EndIf
		Case 4	;UV Left
			If $typeChar = 0 Then
				$dec = SwapEndian($value,($byte*2),true);
				$float = _WinAPI_IntToFloat($dec);
				$left = $float * $wIMG;
				$result = Round(Execute($left & $cals),2);
			Else
				$float = _WinAPI_IntToFloat(Hex($value));
				$left = $float * $wIMG;
				$result = Round(Execute($left & $cals),2);
			EndIf
		Case 5	; UV Top
			If $typeChar = 0 Then
				$dec = SwapEndian($value,($byte*2),true);
				$float = _WinAPI_IntToFloat($dec);
				$top = $float * $hIMG;
				$result = Round(Execute($top & $cals),2);
			Else
				$float = _WinAPI_IntToFloat(Hex($value));
				$top = $float * $hIMG;
				$result = Round(Execute($top & $cals),2);
			EndIf
		Case 6	; UV Right
			If $typeChar = 0 Then
				$dec = SwapEndian($value,($byte*2),true);
				$float = _WinAPI_IntToFloat($dec);
				$right = $float * $wIMG;
				$result = Round(Execute($right & $cals),2);
			Else
				$float = _WinAPI_IntToFloat(Hex($value));
				$right = $float * $wIMG;
				$result = Round(Execute($right & $cals),2);
			EndIf
		Case 7	; UV Bottom
			If $typeChar = 0 Then
				$dec = SwapEndian($value,($byte*2),true);
				$float = _WinAPI_IntToFloat($dec);
				$bottom = $float * $hIMG;
				$result = Round(Execute($bottom & $cals),2);
			Else
				$float = _WinAPI_IntToFloat(Hex($value));
				$bottom = $float * $hIMG;
				$result = Round(Execute($bottom & $cals),2);
			EndIf
		Case 8	; Xoffset
			;ConsoleWrite($byte2&@CRLF);
			$hexChange = SwapEndian($value,($byte2*2),"");
			$dec = numberNegative($hexChange,($byte2*2));
			$result = Round(Execute($dec & $cals),2);
	EndSwitch
	;ConsoleWrite("Result: " & $result);
	Local $arrayResult[2] =	[$result&"||",Hex($value)&"||"];
	return $arrayResult;
EndFunc
