#cs
	 _____       _   _   _ ________  ___ _
	|  __ \     (_) | | | |_   _|  \/  || |
	| |  \/_   _ _  | |_| | | | | .  . || |
	| | __| | | | | |  _  | | | | |\/| || |
	| |_\ \ |_| | | | | | | | | | |  | || |____
	\_____/\__,_|_| \_| |_/ \_/ \_|  |_/\_____/

	================= GuiHTML_UDF v1.0 =========================
	Tác giả:   nhockm4v
	Công Dụng: tạo Gui html và tương tác bằng autoit hoặc js
	Phiên bản AutoIt: 3.3.14.5

	================= FUNCTION AutoIt =====================
	HTML_Load()
	HTML_GUIGetMsg()
	HTML_GUICtrlRead()
	HTML_GUICtrlSetBkColor()
	HTML_GUICtrlGetSize()
	HTML_EvalJS()
	HTML_GUICtrlSetData()
	HTML_SetTitleBar() : HTML_Load() $mode = 0
	_Gui_RoundCorners()

	================= FUNCTION JavaScript ==================
	Tên hàm.........:    execscript()
	Mô tả:..........:    dùng js chạy code autoit, tương tự hàm Execute() autoit, chạy trên main thread, phiên bản UDF sau sẽ có đa luồng
	Cú pháp.........:    execscript($code)
	Tham số.........:   - $code : code cần chạy.

#ce
#include <IE.au3>
#include <GUIConstantsEx.au3>
#include <WindowsConstants.au3>
Local $__title = ''
Local $__bgcolor = 0x000000
Local $__fontcolor = 0xFFFFFF
Local $__drag = 0
Local $__IE = _IECreateEmbedded()

If @error Then MsgBox(16, 'ERROR', 'Create IE Embedded failed')

#cs
	Tên hàm.........:    HTML_Load()
	Mô tả:..........:    Tạo ra một IE object trên Gui có thể tương tác.
	Cú pháp.........:    HTML_Load($init,$w,$h,$left=0,$top=0,$mode=0)
	Tham số.........:   -    $init     : đường dẫn file html ( có thể sử dụng đường dẫn file trong máy hoặc URL web ).
	-    $w : chiều dài của object
	-    $h : chiều rộng của object
	-    $left : khoảng cách từ trái sang (mặc định = 0)
	-    $right : khoảng cách từ trên xuống (mặc định = 0)
	-    $mode :
	0 => thêm 1 thanh tiêu đề html theme win10 mình tạo sẵn ở phía trên của Gui, thường sử dụng khi xài gui POPUP, margin của body html sẽ thành 0
	(sử dụng hàm HTML_SetTitleBar() để chỉnh màu, tiêu đề)
	else => không thêm thanh tiêu đề
	Giá trị trả về..:   -    hwnd của object.
#ce
Func HTML_Load($init, $w, $h, $left = 0, $top = 0, $mode = 0)
	_HTML_IECheckCompatible( True)
	If $__drag = 0 Then $__drag = GUICtrlCreateLabel("", 0, 0, $w - 141, 32, -1, $GUI_WS_EX_PARENTDRAG)
	GUICtrlSetState($__drag, $GUI_DISABLE)
	$obj = GUICtrlCreateObj($__IE, $left, $top, $w, $h)
	_IENavigate($__IE, $init, 1)
	If $mode = 0 Then ; insert title bar
		GUICtrlSetState($__drag, $GUI_ENABLE)
		_IEBodyWriteHTML($__IE, '<style> body { margin: 0 !important; } .ui-titlebar { display: flex; background: ' & '#' & Hex($__bgcolor, 6) & ';} .ui-titleicon { flex-grow: 1; max-width: 32px; max-height: 32px; } .ui-titletext { flex-grow: 2; max-height: 32px; width: auto; font: 15px/32px "Segoe UI", Arial, sans-serif; color: ' & '#' & Hex($__fontcolor, 6) & '; text-indent: 10px; } .ui-titlecontrols { max-width: 144px; max-height: 32px; flex-grow: 1; } .ui-btn { width: 48px; height:32px; border: 0; outline: 0; background: transparent; } .ui-btn:hover { background: rgba(255,255,255,.20); } .ui-btn.closeccc:hover { background: red; } .ui-btn svg path, .ui-btn svg rect, .ui-btn svg polygon { fill: #fff; } .ui-btn svg { width: 10px; height: 10px; } </style> <div id="__bgcolor" class="ui-titlebar"> <!--<div class="ui-titleicon"></div>--> <div id="__title" class="ui-titletext">' & $__title & '</div> <div class="ui-titlecontrols"> <button id="-4" class="ui-btn minimize"> <svg x="0px" y="0px" viewBox="0 0 10.2 1"><rect x="0" y="50%" width="10.2" height="1" /></svg> </button><button class="ui-btn maximize"> <svg viewBox="0 0 10 10"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg> </button><button id="-3" class="ui-btn closeccc"> <svg viewBox="0 0 10 10"><polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" /></svg> </button> </div> </div> ' & _IEBodyReadHTML($__IE)) ;reload body with title bar
		HTML_SetTitleBar()
	Else ; no title bar
		GUICtrlSetState($__drag, $GUI_DISABLE)
		_IEBodyWriteHTML($__IE, _IEBodyReadHTML($__IE)) ;reload body
	EndIf
	HTML_EvalJS('__evalscript = null;function execscript(code){__evalscript = code;} __click = "null"; document.addEventListener("click", function(event) { name = event.target.id; if (name != ""){ __click = name; } event.preventDefault(); }, true);')
	Return $obj
EndFunc   ;==>HTML_Load

#cs
	Tên hàm.........:    HTML_SetTitleBar()
	Mô tả:..........:    Chỉnh sửa tiêu đề, màu chữ, màu background của thanh tiêu đề khi sử dụng mode 0 của hàm HTML_Load().
	Cú pháp.........:    HTML_SetTitleBar($title=$__title,$bgcolor=$__bgcolor,$fontcolor=$__fontcolor)
	Tham số.........:   -    $title  : tiêu đề (mặc định = '')
	-    $bgcolor : màu background (mặc định = 0x000000)
	-    $fontcolor : màu chữ tiêu đề (mặc định = 0xFFFFFF)
#ce
Func HTML_SetTitleBar($title = $__title, $bgcolor = $__bgcolor, $fontcolor = $__fontcolor)
	HTML_EvalJS('document.getElementById("__title").innerHTML = "' & $title & '";')
	HTML_EvalJS('document.getElementById("__bgcolor").style.background = "' & '#' & Hex($bgcolor, 6) & '";')
	HTML_EvalJS('document.getElementsByClassName("ui-titletext")[0].style.color = "' & '#' & Hex($fontcolor, 6) & '";')
	$__title = $title
	$__bgcolor = $bgcolor
	$__fontcolor = $fontcolor
EndFunc   ;==>HTML_SetTitleBar

#cs
	Tên hàm.........:    HTML_EvalJS()
	Mô tả:..........:    eval code js vào object, tương tự hàm eval của js, Hàm này tuy 1 dòng nhưng mình sử dụng hàm này để tạo ra tất cả các hàm khác,
	udf còn sơ sài nên các có thể bạn sử dụng hàm này để để tương tác với Gui nếu chưa có hàm hỗ trợ
	Cú pháp.........:    HTML_EvalJS($code)
	Tham số.........:   -    $code  : code cần chạy
	Giá trị trả về..:   - giá trị trả về của hàm eval js
#ce
Func HTML_EvalJS($code) ; execute js
	Return $__IE.document.parentwindow.eval($code)
EndFunc   ;==>HTML_EvalJS

#cs
	Tên hàm.........:    HTML_GUIGetMsg()
	Mô tả:..........:    Tương tự hàm GUIGetMsg() thêm cái có bắt các sự kiện click của các elementId, chạy code được gọi từ js bởi hàm execscript()
	Cú pháp.........:    HTML_GUIGetMsg()
	Giá trị trả về..:   - Id được click.
#ce
Func HTML_GUIGetMsg() ; get msg from htmlgui
	$guihtmlmsg = HTML_EvalJS('__click;')
	$guievalmsg = HTML_EvalJS('__evalscript;')
	$guimsg = GUIGetMsg()
	If $guihtmlmsg <> 'null' Then
		HTML_EvalJS('__click = "null";')
	ElseIf $guievalmsg <> 'null' Then
		Execute($guievalmsg)
		HTML_EvalJS('__evalscript = "null";')
	ElseIf $guimsg <> 0 Then
		Return $guimsg
	EndIf
	Return $guihtmlmsg
EndFunc   ;==>HTML_GUIGetMsg

#cs
	Tên hàm.........:    HTML_GUICtrlRead()
	Mô tả:..........:    Đọc value từ elementId
	Cú pháp.........:    HTML_GUICtrlRead($id)
	Tham số.........:   -    $id : elementId.
	Giá trị trả về..:   -    value get được.
#ce
Func HTML_GUICtrlRead($id) ; read value from element
	Return HTML_EvalJS('document.getElementById("' & $id & '").value;')
EndFunc   ;==>HTML_GUICtrlRead

#cs
	Tên hàm.........:    HTML_GUICtrlGetSize()
	Mô tả:..........:    lấy chiều dài và rộng của body
	Cú pháp.........:    HTML_GUICtrlGetSize()
	Giá trị trả về..:   - array = [<chiều dài>,<chiều rộng>]
#ce
Func HTML_GUICtrlGetSize() ; get body size
	$iw = HTML_EvalJS('document.body.clientWidth ;')
	$ih = HTML_EvalJS('document.body.clientHeight;')
	Local $return = [$iw, $ih]
	Return $return
EndFunc   ;==>HTML_GUICtrlGetSize

#cs
	Tên hàm.........:    HTML_GUICtrlSetBkColor()
	Mô tả:..........:    Thay đổi màu nền của thẻ body.
	Cú pháp.........:    HTML_GUICtrlSetBkColor($color)
	Tham số.........:   -    $color     : màu nền của body
#ce
Func HTML_GUICtrlSetBkColor($color) ; set background color
	$color = '#' & Hex($color, 6)
	HTML_EvalJS("document.body.style.background = '" & $color & "';")
EndFunc   ;==>HTML_GUICtrlSetBkColor


#cs
	Tên hàm.........:    HTML_GUICtrlSetData()
	Mô tả:..........:    Sửa đổi dữ liệu cho một ElementId.
	Cú pháp.........:    HTML_GUICtrlSetData($id, $data)
	Tham số.........:   -    $id     : ElementId
	-    $data :
	button => sửa tên button
	img, source => sửa src
	else => sửa value
#ce
Func HTML_GUICtrlSetData($id, $data) ; set data
	$tagname = HTML_EvalJS('document.getElementById("' & $id & '").tagName;')
	Switch $tagname
		Case 'BUTTON'
			$nodename = 'innerHTML'
		Case 'IMG', 'SOURCE'
			$nodename = 'src'
		Case Else
			$nodename = 'value'
	EndSwitch
	HTML_EvalJS('document.getElementById("' & $id & '").' & $nodename & '= "' & $data & '";')
EndFunc   ;==>HTML_GUICtrlSetData


Func HTML_GUICtrlSetText($id, $data) ; set data
	$tagname = HTML_EvalJS('document.getElementById("' & $id & '").tagName;')
	HTML_EvalJS('document.getElementById("' & $id & '").innerHTML = "' & $data & '";')
EndFunc
#cs
	Tên hàm.........:    _Gui_RoundCorners()
	Mô tả:..........:    bo tròn viền của gui, hàm này mình lụm lặt trên autoitscript.com lâu rồi nên k nhớ tên tác giả
	Cú pháp.........:    _Gui_RoundCorners($h_win, $i_x3, $i_y3, $i_x1=0, $i_y1=0)
	Tham số.........:   -    $h_win   : hwnd gui cần làm bo tròn.
	-    $i_x3 : độ bo của gui
	-    $i_y3 : độ bo của gui
#ce
Func _Gui_RoundCorners($h_win, $i_x3, $i_y3, $i_x1 = 0, $i_y1 = 0) ; border radius gui
	Local $XS_pos, $XS_ret, $XS_ret2
	$XS_pos = WinGetPos($h_win)
	$XS_ret = DllCall("gdi32.dll", "long", "CreateRoundRectRgn", "long", $i_x1, "long", $i_y1, "long", $XS_pos[2], "long", $XS_pos[3], "long", $i_x3, "long", $i_y3)
	If $XS_ret[0] Then
		$XS_ret2 = DllCall("user32.dll", "long", "SetWindowRgn", "hwnd", $h_win, "long", $XS_ret[0], "int", 1)
	EndIf
EndFunc   ;==>_Gui_RoundCorners








Func _HTML_IECheckCompatible($vCheckMode = True)
	Local $_Reg_BROWSER_EMULATION = '\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION'
	Local $_Reg_HKCU_BROWSER_EMULATION = 'HKCU\SOFTWARE' & $_Reg_BROWSER_EMULATION
	Local $_Reg_HKLM_BROWSER_EMULATION = 'HKLM\SOFTWARE' & $_Reg_BROWSER_EMULATION
	Local $_Reg_HKLMx64_BROWSER_EMULATION = 'HKLM\SOFTWARE\WOW6432Node' & $_Reg_BROWSER_EMULATION
	Local $_IE_Mode, $_AutoItExe = StringRegExp(@AutoItExe, '\\([^\\]+.exe)$', 1)[0]
	Local $_IE_Version = StringRegExp(FileGetVersion(@ProgramFilesDir & "\Internet Explorer\iexplore.exe"), '^\d+', 1)
	If @error Then Return SetError(1, 'Không lấy được version của IE')
	$_IE_Version = $_IE_Version[0]
	Switch $_IE_Version
		Case 8
			$_IE_Mode = 8888
		Case 9
			$_IE_Mode = 9999
		Case 10
			$_IE_Mode = 10001
		Case 11
			$_IE_Mode = 11001
		Case Else
			MsgBox(4096, 'Error', _
					'!!! Phiên bản Internet Explorer hiện tại trên máy bạn đã quá cũ (IE' & $_IE_Version & ').' & @CRLF & _
					'!!! Điều này khiến Tool không thể hiển thị được.' & @CRLF & _
					'!!! Nếu không hiển thị Tool được, máy cần cài Win7 trở lên và IE version 8 trở lên..')
			exit
	EndSwitch
	If $vCheckMode Then
		If RegRead($_Reg_HKCU_BROWSER_EMULATION, $_AutoItExe) <> $_IE_Mode Then RegWrite($_Reg_HKCU_BROWSER_EMULATION, $_AutoItExe, 'REG_DWORD', $_IE_Mode)
		If RegRead($_Reg_HKLM_BROWSER_EMULATION, $_AutoItExe) <> $_IE_Mode Then RegWrite($_Reg_HKLM_BROWSER_EMULATION, $_AutoItExe, 'REG_DWORD', $_IE_Mode)
		If @AutoItX64 And RegRead($_Reg_HKLMx64_BROWSER_EMULATION, $_AutoItExe) <> $_IE_Mode Then RegWrite($_Reg_HKLMx64_BROWSER_EMULATION, $_AutoItExe, 'REG_DWORD', $_IE_Mode)
	Else
		If RegRead($_Reg_HKCU_BROWSER_EMULATION, $_AutoItExe) <> $_IE_Mode Then RegDelete($_Reg_HKCU_BROWSER_EMULATION, $_AutoItExe)
		If RegRead($_Reg_HKLM_BROWSER_EMULATION, $_AutoItExe) <> $_IE_Mode Then RegDelete($_Reg_HKLM_BROWSER_EMULATION, $_AutoItExe)
		If @AutoItX64 And RegRead($_Reg_HKLMx64_BROWSER_EMULATION, $_AutoItExe) <> $_IE_Mode Then RegDelete($_Reg_HKLMx64_BROWSER_EMULATION, $_AutoItExe)
	EndIf
	return $_IE_Version;
EndFunc   ;==>_HTML_IECheckCompatible
