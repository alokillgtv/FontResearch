#Region ;**** Directives created by AutoIt3Wrapper_GUI ****
#AutoIt3Wrapper_Icon=icont.ico
#AutoIt3Wrapper_Res_Comment=Tool Research Font Game - Design Matran999
#AutoIt3Wrapper_Res_Description=Phiên Bản: Beta
#AutoIt3Wrapper_Res_Fileversion=0.2.0.0
#AutoIt3Wrapper_Res_ProductName=Matran999
#AutoIt3Wrapper_Res_CompanyName=Gametiengviet.com
#EndRegion ;**** Directives created by AutoIt3Wrapper_GUI ****
#include "Library\preview.au3"
#include "Library\GuiHTML_UDF.au3"
#include <MsgBoxConstants.au3>
;HotKeySet("{ESC}", "ExitOut")
; Tạo Gui cho ứng dụng
_HTML_IECheckCompatible(); // Kiểm tra IE
$guiw = @DesktopWidth
$guih = @DesktopHeight
$titlegui = 'Font Map'
$gui = GUICreate($titlegui, @DesktopWidth, @DesktopHeight, 0, 0, $WS_POPUP)
$a = HTML_Load(@ScriptDir & '/index.html', $guiw, $guih,0,0,1); Load file html v�o main gui
GUISetState();
GetSaveConfig(); Chạy hàm get dữ liệu thiết lập đã lưu
HTML_EvalJS("BeginRun()") ; Chạy hàm khởi tạo
;HTML_EvalJS('document.oncontextmenu = document.body.oncontextmenu = function() {return false;}')

; Chạy lập vô hạn để giữ GUI
While 1
	Switch HTML_GUIGetMsg()
		Case "Test";	Nếu chọn file Map font
	EndSwitch
WEnd

Func GetSaveConfig()
	$fileData = FileOpen(@ScriptDir&"\data.txt",0+16); Mở file dữ liệu đã lưu
	$data = Hex(FileRead($fileData));
	$data2 = StringRegExpReplace($data,"^EFBBBF","");
	ConsoleWrite($data2&@CRLF)
	HTML_GUICtrlSetText("copy",$data2); Sao chép dữ liệu sang HTML
	FileClose($fileData);
EndFunc

; Hàm chọn file map font
Func FontChar()
	$FilePath = FileOpenDialog("Chọn file font map. Thường có dạng .bin .dat...",@ScriptDir&"\","All (*)"); Mở thư mục chọn font map
	$FilePath = StringReplace($FilePath,@ScriptDir&"\","");
	$FilePath = StringReplace($FilePath,"\","/");
	HTML_GUICtrlSetText("pathFont",$FilePath)
	;HTML_GUICtrlSetText("cell-content","")
EndFunc

; Hàm chọn file ảnh
Func FontImg()
	$FilePath = FileOpenDialog("Chọn file ảnh font. Thường có dạng .dds .png .bmp",@ScriptDir&"\","Images (*.jpg;*.bmp;*.png)|"); Mở thư mục chọn font ảnh
	$FilePath = StringReplace($FilePath,@ScriptDir&"\","");
	$FilePath = StringReplace($FilePath,"\","/");
	HTML_GUICtrlSetData("img-view",$FilePath)
	HTML_GUICtrlSetText("pathImg",$FilePath)
	;HTML_GUICtrlSetText("cell-content","");
EndFunc

; Hàm thoát nhanh Tool
Func ExitOut()
	Exit;
EndFunc

; Hàm xóa thiết lập
Func ClearCfg()
	$file = FileOpen(@ScriptDir&"\data.txt",2+128);
	FileWrite($file,"");
	FileClose($file);
EndFunc

; Hàm lấy dữ liệu font dạng FNT
Func GetFNT($pathFNT)
	$file = FileOpen(@ScriptDir&"\"&$pathFNT,0+128);
	$read = FileRead($file);
	$hex = StringToBinary($read,4);
	ConsoleWrite($pathFNT&@CRLF);
	HTML_GUICtrlSetData("test",Hex($hex));
	FileClose($file);
	HTML_EvalJS("FNTback()")
EndFunc

; Hàm lưu file CSV
Func SaveCSV($name)
	$value = HTML_GUICtrlRead("test")
	;#cs
	$FileSave = FileSaveDialog("Chọn nơi tạo file .csv", @ScriptDir&"\", "Comma Separated Values File (*.csv)", 2,$name);
	$file = FileOpen($FileSave,2+128);
	;$string = BinaryToString("0x"&$hex,4);
	FileWrite($file,$value);
	FileClose($file);
EndFunc

; Hàm lưu file thiết lập
Func SaveCfg()
	$HexCfg = HTML_GUICtrlRead("copy");
	$textCode = BinaryToString("0x"&$HexCfg,4);
	;popup("Luu thiet lap");
	$file4 = FileOpen(@ScriptDir&"\data.txt",2+128);
	FileWrite($file4,$textCode);
	FileClose($file4);
	;ConsoleWrite($hex&@CRLF);
EndFunc

; Hàm thông báo
Func popup($text)
	MsgBox(0,"Thông Báo",$text)
EndFunc