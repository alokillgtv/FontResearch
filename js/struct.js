/* Script tạo struct */

function addMenuBox(e){// Hàm tạo thêm struct
  var $box = $(e).closest('.item-struct'); //select-title-struct
	var $itemlast = $box[0].outerHTML;// Lấy struct cuối cùng
	$box.after($itemlast);// Thêm vào danh sách struct
  var $next = $box.next();
  $next.find('.select-title-struct option[selected=""]').prop("selected", false);// Xóa các options đã chọn
  $next.find('.select-title-struct option:eq(1)').prop("selected", true);// Chọn một options khác
  var $text = $next.find('.select-title-struct option:eq(1)').text();
  $next.find('.title-struct b').html($text);
  var $last = $next.find('.item-char:last');
  $next.find('.list-block-char').html($last);
}

function selectTitleBox($r){// Hàm khi chọn select custom
  var $title = $($r).find("option:selected").text();// Lấy dữ liệu select
  var $class = $($r).attr("class");
  if($title == "Tùy Chỉnh"){// Nếu là custom thì hiện trường nhập
    //console.log($($r).closest("li").find('.input-custom-byte'));
    var $box = $($r).closest("li").find('.input-custom-byte');
    $box.addClass('active');
  }
  if($title == "Dữ Liệu Ký Tự" && $('option[value="Dữ Liệu Ký Tự"]:selected').length > 1){
    var $test = confirm('Đa phần các game chỉ có một khối Dữ Liệu Ký Tự.\n\n\
    Do đó nếu bạn muốn tạo thêm một khối nữa có thể sẽ gây ra lỗi.\n\n\
    Nếu bạn thực sự muốn tạo thêm thì nhấn Ok.');
    if($test){
      $title = "Dữ Liệu Ký Tự";
      //console.log($title);
    }
    else{
      $($r).closest("li").find('option[selected=""]').prop("selected", false);
      var $title = $($r).find("option:eq(1)").text();
      $($r).find("option:eq(1)").prop("selected", true);
    }
    //$($r).closest("li").find('.active').removeClass("active");
  }
  else{// Nếu không phải thì xóa
    //$($r).closest("li").find('.active').removeClass("active");
  }
  //console.log($title);
  if($class.indexOf("select-byte") == -1){
    $($r).closest(".item-struct").find('.title-struct b').html($title);// In tên tiêu đề vào head box
  }
  $($r).closest('.item-struct').attr("boxName",$title)
  changeValue();// Chạy hàm thay đổi dữ liệu
}

function removeMenuBox(e){// Hàm xóa bớt struct
  var $box = $(e).closest('.item-struct');// Lấy box item
  var $max = $('.item-struct').length;// Kiểm tra xem có bao nhiêu struct
  if($max > 1){// Nếu lớn hơn 1 thì xóa
    $box.remove();
  }
  else{
    alert("Bạn không thể xóa hết các khối dữ liệu.")
  }
  changeValue();// Chạy hàm thay đổi dữ liệu
}

function customTitle(e){// Hàm tùy chỉnh title bằng input
  var $box = $(e).closest("li");// Lấy box chính của phần tử này
  var $value = $box.find("input").val();// Lấy dữ liệu tùy chỉnh
  if($value){// Nếu dữ liệu tồn tại
    $box.find('option[selected=""]').prop("selected", false);// Xóa các option đã chọn
    var $new = '<option title="'+$value+'" value="'+$value+'" selected>'+$value+'</option>';// Tạo thêm một option mới với dữ liệu mới nhập
    $box.find(".select-block").append($new);// Thêm option vào danh sách
    $box.find(".input-custom-byte").removeClass("active");// Xóa class để ẩn input
    $(e).closest(".item-struct").find(".title-struct b").text($value);
  }
  else{
    alert("Vui lòng nhập dữ liệu vào ô.");
  }
  changeValue();// Chạy hàm thay đổi dữ liệu
}

function customByte(e){
  var $value = $(e).val();
  var $box = $(e).closest("label");
  if($value){
    if($value.match(/^[0-9]+$/)){
      $box.find('option[selected=""]').prop("selected", false);
      var $new = '<option title="'+$value+'" value="'+$value+'" selected>'+$value+' Byte</option>'
      $box.find(".select-block").append($new);
      $box.find(".input-custom-byte").removeClass("active");
    }
    else{
      alert("Vui lòng chỉ nhập số vào ô.")
      $(e).val("");
    }
  }
  else{
    alert("Vui lòng nhập dữ liệu vào ô.");
  }
  changeValue();// Chạy hàm thay đổi dữ liệu
}

function getStringHex($value){
  var $result = new Object();
  $result.type = "NONE";
  if($value){
    if($value.match(/^0x[a-fA-F0-9]+$/)){// Nếu dữ liệu là hex
      $result.hex = $value.match(/^0x([a-fA-F0-9]+)$/)[1];
      $result.dec = hex2dec($result.hex);
      $result.type = "HEX";
    }
    else if($value.match(/^[0-9]+$/)){
      $result.dec = $value.match(/^([0-9]+)$/)[1];
      $result.hex = pad(dec2hex($result.dec));
      $result.type = "DEC";
    }
    else{// Nếu dữ liệu khác thì thông báo và xóa
      $result.type = "NONE";
    }
  }
  return $result;
}

function checkHex(e,a){
  var $value = $(e).val();
  var $box = $(e).closest("li");
  var $class = $box.attr("class");
  var $parent = $(e).closest(".body-struct");
  if($value){
    var $result = getStringHex($value);
    if($result.type == "HEX"){// Nếu dữ liệu là hex
      $box.addClass("hex-value");
      var $hex = $result.hex;
      var $dec = $result.dec;
      if($class.indexOf("item-menu-offset") > -1){
        $parent.find(".name-menu-offset b").html("(DEC: <i>"+$dec+"</i>)")
      }
      if($class.indexOf("item-menu-max") > -1){
        $parent.find(".name-menu-max b").html("(DEC: <i>"+$dec+"</i>)");
      }
      //console.log("Dữ liệu đúng");
      setRangeValue($parent)
    }
    else if($result.type == "DEC"){
      var $hex = $result.hex;
      var $dec = $result.dec;
      if($class.indexOf("item-menu-offset") > -1){
        $parent.find(".name-menu-offset b").html("(HEX: <i>0x"+$hex+"</i>)")
      }
      if($class.indexOf("item-menu-max") > -1){
        $parent.find(".name-menu-max b").html("(HEX: <i>0x"+$hex+"</i>)");
      }
      $box.removeClass("hex-value");
      setRangeValue($parent);
    }
    else{// Nếu dữ liệu khác thì thông báo và xóa
      if(!a){
        alert("Vui lòng chỉ nhập dữ liệu số thập phân (DEC)\n\nhoặc dữ liệu số thập lục phân (HEX) vào ô.");
      }
    }
  }
}

function structMove($e,$move){
  var $box = $($e).closest(".item-struct");
  var $html = $box[0].outerHTML;
  var $max = $(".item-struct").length;
  var $index = $box.index();
  if($max > 1){
    if($move){// Di chuyển lên
      if($index > 0){
        var $prev = $box.prev();
        //$box.prependTo($(".fontmap-block"));
        $prev.before($box);
        //$box.remove();
      }
    }
    else{
      if($index < ($max - 1)){
        var $next = $box.next();
        $next.after($box);
        //$box.remove();
        //$box.appendTo($(".fontmap-block"));
      }
    }
  }
}