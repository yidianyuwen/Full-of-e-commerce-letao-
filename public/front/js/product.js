$(function(){
  //1. 获取地址栏中的productId的值
  //2. 发送ajax请求，获取商品的数据
  //3. 结合模版渲染
  var productId = getSearch().productId;
  //动态的渲染商品的详情
  $.ajax({
    type: 'get',
    url:'/product/queryProductDetail',
    data: {
      id: productId
    },
    success: function(info) {
      /* 
      var temp = info.size.split("-");//30 50
      var tempArray = [];
      for(var i = +temp[0]; i <= temp[1]; i++) {
        tempArray.push(i);
      }
      info.sizeArray = tempArray;
       */
      //console.log(info);
      $(".mui-scroll").html( template("tpl", info) );


      //重新初始化轮播图的结构
      mui(".mui-slider").slider({
        interval: 3000
      });

      //支持尺码的选择功能
      $(".proSize span").on("click", function() {
        $(this).addClass("now").siblings().removeClass("now");
      });

      //初始化numbox
      mui(".mui-numbox").numbox()

    }
  });




  //加入购物车的功能
  //1. 给加入购物车按钮注册点击事件
  //2. 获取产品id，数量，尺码，发送ajax请求
  $(".add_cart").on("click", function() {
    var size = $(".proSize span.now").text();
    var num = $(".mui-numbox-input").val();
    if(!size) {
      mui.toast("请选择尺码");
      return;
    }

    //发送ajax请求
    $.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId: productId,
        size: size,
        num: num
      },
      success: function(info) {
        console.log(info);
        //如果用户没有登录，跳转到登录页面,给一个回跳的地址
        if(info.error === 400) {
          window.location.href = "login.html?back="+location.href;
        }
        //如果用户登录了，给用户一个提示，加入购物车成功
        if(info.success) {
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function(e){
            if(e.index === 0) {
              location.href = "cart.html";
            }
          });
        }
      }
    });

  });
});