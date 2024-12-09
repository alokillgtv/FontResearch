$htmlData = new Object();
$htmlData.character = new Object();
$htmlData.unicode = new Object();
$htmlData.width = new Object();
$htmlData.height = new Object();
$htmlData.paddingleft = new Object();
$htmlData.paddingtop = new Object();
$htmlData.paddingright = new Object();
$htmlData.paddingbottom = new Object();
$htmlData.x = new Object();
$htmlData.y = new Object();
$htmlData.uvleft = new Object();
$htmlData.uvtop = new Object();
$htmlData.uvright = new Object();
$htmlData.uvbottom = new Object();
$htmlData.uknown = new Object();
$htmlData.left = new Object();
$htmlData.top = new Object();
$htmlData.right = new Object();
$htmlData.bottom = new Object();
$htmlData.page = new Object();
$htmlData.xoffset = new Object();
$htmlData.yoffset = new Object();
$htmlData.xadvance = new Object();
$htmlData.text = new Object();

$htmlData.character.html = '<div class="info-text-view info-character"><i>Character: </i>Ký tự được chuyển đổi từ dữ liệu unicode dạng <b>Decimal</b> khi phân tích. <br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Character:</i> <span>#VALUE#</span><br></div>';

$htmlData.unicode.html = '<div class="info-text-view info-unicode"><i>Unicode: </i>Mã Unicode dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.width.html = '<div class="info-text-view info-width"><i>Width: </i>Dữ liệu chiều rộng ký tự dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br></div>';

$htmlData.height.html = '<div class="info-text-view info-height"><i>Height: </i>Dữ liệu chiều cao ký tự dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br></div>';

$htmlData.paddingleft.html = '<div class="info-text-view info-paddingL"><i>Padding Left: </i>Dữ liệu khoảng trống thêm vào lề bên trái ký tự. Dữ liệu này được tính với dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.paddingtop.html = '<div class="info-text-view info-paddingT"><i>Padding Top: </i>Dữ liệu khoảng trống thêm vào lề bên trên ký tự. Dữ liệu này được tính với dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.paddingright.html = '<div class="info-text-view info-paddingR"><i>Padding Right: </i>Dữ liệu khoảng trống thêm vào lề bên phải ký tự. Dữ liệu này được tính với dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.paddingbottom.html = '<div class="info-text-view info-paddingB"><i>Padding Bottom: </i>Dữ liệu khoảng trống thêm vào lề bên dưới ký tự. Dữ liệu này được tính với dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.x.html = '<div class="info-text-view info-x"><i>X: </i>Dữ liệu tọa độ dựa theo trục X/Y, tính từ lề trái của ảnh cho đến ký tự. Dữ liệu này được tính với dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.y.html = '<div class="info-text-view info-y"><i>Y: </i>Dữ liệu tọa độ dựa theo trục X/Y, tính từ lề bên trên của ảnh cho đến ký tự. Dữ liệu này được tính với dạng <b>Decimal</b> khi phân tích từ hex.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.uvleft.html = '<div class="info-text-view info-uvleft"><i>UV Left: </i>Dữ liệu tọa độ của ký tự. Dữ liệu này được dùng dưới dạng Float (Dấu chấm động). Dữ liệu này trên hex thường có độ dài 4 byte với kiểu Little Endian (0x#LHEX#). Dữ liệu này đại biểu cho tọa độ từ lề bên trái của font ảnh đến vị trí lề bên trái ký tự.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Float:</i> <span>#FLOAT#</span><br>\
Để chuyển đổi từ Hex Float sang Float như trên khá phức tạp, mình sẽ không nói rõ các bạn có thể tự tìm hiểu trên mạng.\
Để tính dữ liệu này, các bạn cần có dữ liệu chiều rộng và chiều cao của ảnh font.<br>\
Ta tạm gọi:<br>\
<i>IMGW</i><b>=</b><span>#IMGW#</span> (Chiều rộng font ảnh)<br>\
<i>LEFT</i> (Tọa độ từ lề trái ảnh font đến lề bên trái ký tự)<br>\
<i>UV_LEFT</i> <b>=</b> <span>#FLOAT#</span><br>\
Công Thức Tính: <i>UV_LEFT</i> <b>=</b> <i>LEFT</i> <b>/</b> <i>IMGW</i>, Như vậy suy ra: <i>LEFT</i> <b>=</b> <i>UV_LEFT</i> <b>*</b> <i>IMGW</i><br>\
Và đưa vào phép tính: <i>LEFT</i> <b>=</b> <i>#FLOAT#</i> <b>*</b> <i>#IMGW#</i> <b>=</b> <span>#VALUE#</span>\
</div>';

$htmlData.uvtop.html = '<div class="info-text-view info-uvtop"><i>UV Top: </i>Dữ liệu tọa độ của ký tự. Dữ liệu này được dùng dưới dạng Float (Dấu chấm động). Dữ liệu này trên hex thường có độ dài 4 byte với kiểu Little Endian (0x#LHEX#). Dữ liệu này đại biểu cho tọa độ từ lề bên trên của font ảnh đến vị trí lề bên trên ký tự.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Float:</i> <span>#FLOAT#</span><br>\
Để chuyển đổi từ Hex Float sang Float như trên khá phức tạp, mình sẽ không nói rõ các bạn có thể tự tìm hiểu trên mạng.\
Để tính dữ liệu này, các bạn cần có dữ liệu chiều rộng và chiều cao của ảnh font.<br>\
Ta tạm gọi:<br>\
<i>IMGH</i><b>=</b><i>#IMGH#</i> (Chiều rộng font ảnh)<br>\
<i>TOP</i> (Tọa độ từ lề bên trên ảnh font đến lề bên dưới ký tự)<br>\
<i>UV_TOP</i> <b>=</b> <span>#FLOAT#</span><br>\
Công Thức Tính: <i>UV_TOP</i> <b>=</b> <i>TOP</i> <b>/</b> <i>IMGH</i>, Như vậy suy ra: <i>TOP</i> <b>=</b> <i>UV_TOP</i> <b>*</b> <i>IMGH</i><br>\
Và đưa vào phép tính: <i>TOP</i> <b>=</b> <i>#FLOAT#</i> <b>*</b> <i>#IMGH#</i> <b>=</b> <span>#VALUE#</span>\
</div>';

$htmlData.uvright.html = '<div class="info-text-view info-uvright"><i>UV RIGHT: </i>Dữ liệu tọa độ của ký tự. Dữ liệu này được dùng dưới dạng Float (Dấu chấm động). Dữ liệu này trên hex thường có độ dài 4 byte với kiểu Little Endian (0x#LHEX#). Dữ liệu này đại biểu cho tọa độ từ lề bên trái của font ảnh đến vị trí lề bên phải ký tự.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Float:</i> <span>#FLOAT#</span><br>\
Để chuyển đổi từ Hex Float sang Float như trên khá phức tạp, mình sẽ không nói rõ các bạn có thể tự tìm hiểu trên mạng.\
Để tính dữ liệu này, các bạn cần có dữ liệu chiều rộng và chiều cao của ảnh font.<br>\
Ta tạm gọi:<br>\
<i>IMGW</i> <b>=</b> <span>#IMGW#</span> (Chiều rộng font ảnh)<br>\
<i>RIGHT</i> (Tọa độ từ lề trái ảnh font đến lề bên phải ký tự)<br>\
<i>UV_RIGHT</i> <b>=</b> <span>#FLOAT#</span><br>\
Công Thức Tính: <i>UV_RIGHT</i> <b>=</b> <i>RIGHT</i> <b>/</b> <i>IMGW</i>, Như vậy suy ra: <i>RIGHT</i> <b>=</b> <i>UV_RIGHT</i> <b>*</b> <i>IMGW</i><br>\
Và đưa vào phép tính: <i>RIGHT</i> <b>=</b> <i>#FLOAT#</i> <b>*</b> <i>#IMGW#</i> <b>=</b> <span>#VALUE#</span>\
</div>';

$htmlData.uvbottom.html = '<div class="info-text-view info-uvbottom"><i>UV BOTTOM: </i>Dữ liệu tọa độ của ký tự. Dữ liệu này được dùng dưới dạng Float (Dấu chấm động). Dữ liệu này trên hex thường có độ dài 4 byte với kiểu Little Endian (0x#LHEX#). Dữ liệu này đại biểu cho tọa độ từ lề bên trên của font ảnh đến vị trí lề bên dưới ký tự.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Float:</i> <span>#FLOAT#</span><br>\
Để chuyển đổi từ Hex Float sang Float như trên khá phức tạp, mình sẽ không nói rõ các bạn có thể tự tìm hiểu trên mạng.\
Để tính dữ liệu này, các bạn cần có dữ liệu chiều rộng và chiều cao của ảnh font.<br>\
Ta tạm gọi:<br>\
<i>IMGH</i> <b>=</b> <span>#IMGH#</span> (Chiều rộng font ảnh)<br>\
<i>BOTTOM</i> (Tọa độ từ lề bên trên ảnh font đến lề bên dưới ký tự)<br>\
<i>UV_BOTTOM</i> <b>=</b> <i>#FLOAT#</i><br>\
Công Thức Tính: <i>UV_BOTTOM</i> <b>=</b> <i>BOTTOM</i> <b>/</b> <i>IMGH</i>, Như vậy suy ra: <i>TOP</i> <b>=</b> <i>UV_BOTTOM</i> <b>*</b> <i>IMGH</i><br>\
Và đưa vào phép tính: <i>BOTTOM</i> <b>=</b> <i>#FLOAT#</i> <b>*</b> <i>#IMGH#</i> <b>=</b> <span>#VALUE#</span>\
</div>';

$htmlData.uknown.html = '<div class="info-text-view info-uknown"><i>UKNOWN: </i>Dữ liệu mà bạn chưa xác nhận được. Thường thì nên để nguyên dạng dữ liệu này ở dạng Hex. Hoặc các bạn có thể chọn các dạng dữ liệu khác để kiểm tra.<br></div>';

$htmlData.left.html = '<div class="info-text-view info-left"><i>LEFT: </i>Dữ liệu tọa độ của ký tự, tính từ lề bên trái của ảnh cho đến lề bên trái của ký tự. Dữ liệu này được tính với dạng <b>Decimal</b>.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.top.html = '<div class="info-text-view info-top"><i>TOP: </i>Dữ liệu tọa độ của ký tự, tính từ lề bên trên của ảnh cho đến lề bên trên của ký tự. Dữ liệu này được tính với dạng <b>Decimal</b>.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.right.html = '<div class="info-text-view info-right"><i>RIGHT: </i>Dữ liệu tọa độ của ký tự, tính từ lề bên trái của ảnh cho đến lề bên phải của ký tự. Dữ liệu này được tính với dạng <b>Decimal</b>.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.bottom.html = '<div class="info-text-view info-bottom"><i>BOTTOM: </i>Dữ liệu tọa độ của ký tự, tính từ lề bên trên của ảnh cho đến lề bên dưới của ký tự. Dữ liệu này được tính với dạng <b>Decimal</b>.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.page.html = '<div class="info-text-view info-page"><i>PAGE: </i>Dữ liệu vị trí ký tự nằm trong font ảnh nào. Một vài game chứa nhiều ký tự trong nhiều tập tin ảnh, chúng được đánh dấu bằng số liệu dạng <b>Decimal</b>. Dữ liệu này thường có độ dài 1 byte<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.xoffset.html = '<div class="info-text-view info-xoffset"><i>XOFFSET: </i>Dữ liệu độ lệch theo trục X để bổ sung cho ký tự. Một vài game chứa nhiều ký tự có chiều cao và chiều rộng không đồng đều. Do đó dữ liệu này để bổ sung cho ký tự đó nằm đúng vị trí. Dữ liệu này có thể là số dương hoặc số âm và được chuyển đổi lại thành <b>Decimal</b>. Dữ liệu này thường có độ dài 1 hoặc 2 byte. Và khi được diễn giải dưới dạng HEX nó được tính theo cách riêng biệt.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span> <b>=></b> <i>Xoffset:</i> <span>#VALUE#</span><br>\</div>';

$htmlData.yoffset.html = '<div class="info-text-view info-yoffset"><i>YOFFSET: </i>Dữ liệu độ lệch theo trục Y để bổ sung cho ký tự. Một vài game chứa nhiều ký tự có chiều cao và chiều rộng không đồng đều. Do đó dữ liệu này để bổ sung cho ký tự đó nằm đúng vị trí. Dữ liệu này có thể là số dương hoặc số âm và được chuyển đổi lại thành <b>Decimal</b>. Dữ liệu này thường có độ dài 1 hoặc 2 byte. Và khi được diễn giải dưới dạng HEX nó được tính theo cách riêng biệt.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span> <b>=></b> <i>Yoffset:</i> <span>#VALUE#</span><br>\</div>';

$htmlData.xadvance.html = '<div class="info-text-view info-xadvance"><i>XADVANCE: </i>Dữ liệu độ lệch theo độ khít chiều rộng để bổ sung cho ký tự. Một vài game chứa nhiều ký tự có độ khít khác nhau. Do đó dữ liệu này để bổ sung cho ký tự đó nằm đúng vị trí. Dữ liệu này thường có dạng <b>Decimal</b>. Dữ liệu này thường có độ dài 1 hoặc 2 byte.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

$htmlData.xadvance.text = '<div class="info-text-view info-text"><i>TEXT: </i>Dữ liệu dạng thuần text.<br>\
Phân tích dữ liệu phía trên, ta có được như sau::<br>\
<i>Gốc:</i> <span>0x#LHEX#</span> <b>=></b> <i>Swap:</i> <span>0x#BHEX#</span> <b>=></b> <i>Decimal:</i> <span>#DEC#</span><br>\</div>';

// Hàm phân tích ký tự
function viewChar(e){
  showPAGE(this,'page-hex'); // Hiện trang phân tích chi tiết
  window.scrollTo(0, 0); // Cuộn đến vị trí phân tích
  var $tr = $(e).closest(".item-cell-row");// Tạo biến lấy tr table hiện tại
  var $list = [];// Tạo biến list array
  var $td = $tr.find("td");// Lấy tất cả khung td
  for(var $h = 0;$h < $td.length;$h++){// Chạy lập theo từng khung td
    var $tdItem = $tr.find("td:eq("+$h+")");// Chọn khung td hiện tại
    var $hex = $tdItem.attr("myhex");// Lấy dữ liệu hex của td
    var $item = new Object();// Tạo biến object
    if($hex != undefined){// Nếu có giá trị hex
      if($FontMapType == 0){
        $item.hex = $hex// Lấy hex
      }
      else{
        $item.hex = Number($hex).toString(16).toUpperCase();
      }
      $item.value = $tdItem.text();// Lấy dữ liệu
      $item.title = $tdItem.attr("alt");// Lấy tên dữ liệu
      $item.calc = $tdItem.attr("calc");// Lấy phép tính dữ liệu
      $list.push($item);// Thêm dữ liệu vào list
    }
  }
  if($FontMapType == 0){// Nếu là font bitmap
    sendTable($list);// Gửi dữ liệu để tạo table
  }
  else{
    sendTable($list);
  }
}

// Hàm tạo table
function sendTable($list){
	var $wImg = $('#img-view')[0].naturalWidth;// Lấy width file ảnh
	var $hImg = $('#img-view')[0].naturalHeight;// Lấy heigth file ảnh
  // Tạo biến header table
  var $topTable = '<div class="top-table">\
    <div class="left-top-table"><b>Chiều Rộng Font Ảnh</b><i>'+$wImg+'</i></div>\
    <div class="left-top-table"><b>Chiều Cao Font Ảnh</b><i>'+$hImg+'</i></div>\
    <div class="left-top-table"><b>Phân Tích Ký Tự:</b><i>$CHARREP</i></div>\
    <div class="left-top-table button-jump-img" onclick="JumpImg(this)" charnumber="$charnumberRep"><b>Nhảy Đến Vị Trí Ký Tự Trong Font Ảnh </b></div>\
  </div>';
  // Tạo biến table
  var $table = '<table id="view-data-cell"><tbody>\
  <tr><th class="header-table-view end-header">Chú Thích</th>'; // Tạo biến chứa header table
  var $cellHex1 = '<tr><td class="begin-row row-table-view">Hex Gốc</td>'; // Tạo biến chứa các cell Little Endian
  var $cellHex2 = '<tr><td class="begin-row row-table-view">Hex Swap</td>'; // Tạo biến chứa các cell Big Endian
  var $cellDec = '<tr><td class="begin-row row-table-view">Dec</td>'; // Tạo biến chứa các cell Big Endian
  var $cellFloat = '<tr><td class="begin-row row-table-view">Float</td>'; // Tạo biến chứa dữ liệu Float
  var $cellCalc = '<tr><td class="begin-row row-table-view">Tính Toán</td>'; // Tạo biến chứa dữ liệu Float
  var $cellValue = '<tr><td class="begin-row row-table-view">Kết Quả</td>'; // Tạo biến chứa dữ liệu kết quả
  for(var $k = 0;$k < $list.length;$k++){// Chạy lập theo từng dữ liệu lấy được
    var $item = $list[$k];// Chọn dữ liệu
    var $titleItem = $item.title.toLowerCase().replace(/\s/g,"");
    //console.log("Title Item: " + $titleItem)
	console.log("hex: "+$item.hex);
    $htmlData[$titleItem].Lhex = pad($item.hex);
    $htmlData[$titleItem].Bhex = SwapEndian(pad($item.hex));
    $htmlData[$titleItem].floatNumber = 0;
    $htmlData[$titleItem].dec = 0;
    $htmlData[$titleItem].value = $item.value;
    $htmlData[$titleItem].calc = $item.calc;
    if($item.title != "Character"){// Nếu dữ liệu không phải là character
      if($item.title == "Unicode"){// Nếu dữ liệu là unicode
        var $charText = $item.value;// Lấy số unicode
        $topTable = $topTable.replace("$charnumberRep",$charText); // Replace character ở header table
      }
      $table += '<th class="header-table-view">' + $item.title + '</th>'; // Nối header
      $cellHex1 += '<td class="hex1-row row-table-view">'+$item.hex+'</td>'; // Nối dữ liệu Little Endian
      $cellHex2 += '<td class="hex2-row row-table-view">'+SwapEndian($item.hex)+'</td>'; // Nối dữ liệu Big Endian
      var $decValue = parseInt("0x" + SwapEndian($item.hex)); // Chuyển dữ liệu sang Dec
      if($decValue > 65535){// Nếu dữ liệu quá lớn thì để trống
        $decValue = "";
      }
      if(isNaN($decValue)){// Nếu dữ liệu lỗi lấy dữ liệu gốc
        $decValue = $item.value;
      }
      $htmlData[$titleItem].dec = $decValue;
      var $floatValue = "";// Tạo biến chứa dữ liệu float
      var $floatTD = '<td class="float-row row-table-view"></td>'; // Tạo cell float trống
      $cellDec += '<td class="dec-row row-table-view">'+$decValue+'</td>'; // Tạo cell chứa dữ liệu Dec
      if($item.title.indexOf("UV Left") > -1 || $item.title.indexOf("UV Right") > -1){// Nếu dữ liệu là UV
         $floatValue = String(Number($item.value) / $wImg).replace(/\s/g,"").replace(/(\S+\.\S\S)\S+/,"$1");
         $htmlData[$titleItem].floatNumber = $floatValue;
         $floatTD = '<td class="float-row row-table-view">'+$floatValue+'</td>'; // Tạo cell chứa dữ liệu float
      }
      if($item.title.indexOf("UV Top") > -1 || $item.title.indexOf("UV Bottom") > -1){// Nếu dữ liệu là UV
         $floatValue = String(Number($item.value) / $hImg).replace(/\s/g,"").replace(/(\S+\.\S\S)\S+/,"$1");
         $htmlData[$titleItem].floatNumber = $floatValue;
         $floatTD= '<td class="float-row row-table-view">'+$floatValue+'</td>';// Tạo cell chứa dữ liệu float
      }
      $cellFloat += $floatTD;
      $cellValue += '<td class="value-row row-table-view">'+$item.value+'</td>'; // Tạo cell chứa dữ liệu kết quả
      if($item.calc == undefined){// Nếu lỗi thì dữ liệu calc bằng 0
        $item.calc = "+0";
      }
      var $calcTD = '<td class="calc-row row-table-view">'+$item.calc+ '</td>'; // Tạo cell tính toán
      if($item.title.indexOf("UV Left") > -1 || $item.title.indexOf("UV Right") > -1){// Nếu là UV
        $calcTD = '<td class="calc-row row-table-view">'+$floatValue + " <i>*</i> " + $wImg + '</td>';
      }
      if($item.title.indexOf("UV Top") > -1 || $item.title.indexOf("UV Bottom") > -1){// Nếu là UV
        $calcTD = '<td class="calc-row row-table-view">'+$floatValue + " <i>*</i> " + $hImg + '</td>';
      }
      $cellCalc += $calcTD; //  Tạo cell tính toán
    }
    else{
      var $charText = $item.value; // Nếu là dữ liệu character
      $topTable = $topTable.replace("$CHARREP",$charText); // Replace ký tự ở đầu header
    }
  }
  $table += "</tr>" + $cellHex1 + "</tr>" + $cellHex2 + "</tr>" + $cellDec + "</tr>" + $cellFloat + "</tr>" + $cellCalc + "</tr>" + $cellValue + "</tr></tbody><table>"; // Nối các dữ liệu vào table
  $('.table-page-hex').html($topTable + $table); // Chèn dữ liệu table vào;
  chuthichData($list,$wImg,$hImg);// Chạy hàm tiếp tục thêm chú thích
}

// Hàm thêm chú thích cho dữ liệu
function chuthichData($list,$w,$h){
  var $headerData = '<div class="page-data-info"><h2>CHÚ THÍCH CÁC DỮ LIỆU PHÂN TÍCH</h2>\
  Dưới đây là chú thích các thuật ngữ đã phân tích được, kèm theo những ví dụ của nó.'; // Tạo biến chứa header dữ liệu chú thích
  var $bodyText = "";// Tạo biến chứa dữ liệu chú thích
  for(var $k = 0;$k < $list.length;$k++){// Chạy lập dựa trên các dữ liệu phân tích được.
    var $item = $list[$k];// Chọn dữ liệu
    var $title = $item.title.toLowerCase().replace(/\s/g,""); // Lấy tiêu đề dữ liệu, chuyển nó sang text thường và replace khoảng trống
    //console.log("chuthichData[title]: " + $title)
    if($htmlData[$title]){
      //console.log("chuthichData2[title]: " + $title)
      var $itemGet = $htmlData[$title];
      var $html = $htmlData[$title].html;
      $html = $html.replace(/#LHEX#/g,$itemGet.Lhex) // Replace Little Endian
      $html = $html.replace(/#BHEX#/g,$itemGet.Bhex) // Replace Big Endian
      $html = $html.replace(/#DEC#/g,$itemGet.dec) // Replace Dec
      $html = $html.replace(/#FLOAT#/g,$itemGet.floatNumber) // Replace Float
      $html = $html.replace(/#VALUE#/g,$itemGet.value) // Replace Value
      $html = $html.replace(/#IMGW#/g,$w) // Replace Image Width
      $html = $html.replace(/#IMGH#/g,$h) // Replace Image Height
      $html = $html.replace("</div>","") // Replace Div cuối
      if($itemGet.calc != "+0" && $itemGet.calc != undefined){
        $html += 'Dữ liệu này có phép tính bổ sung.<br>\
        Theo như dữ liệu phân tích được ta có phép tính là <span>'+$itemGet.calc+'</span>.<br>\
        Như vậy giá trị thực của nó được tính bằng <span>' + $itemGet.dec + '</span><b>' +  $itemGet.calc + '</b>=<span>' + $itemGet.value + '</span>';
      }
      $bodyText += $html + "</div>" // Lấy dữ liệu chú thích dựa trên tiêu đề phân tích
    }
  }
  $headerData += $bodyText + "</div>"// Nối các dữ liệu lại
  $('.data-hide-info').html($headerData);// Chèn dữ liệu vào trang.
}