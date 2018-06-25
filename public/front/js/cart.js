$(function () {

  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {

        auto: true,
        callback: function () {
          //1. 发送ajax请求，获取商品的数据
          $.ajax({
            type: 'get',
            url: '/cart/queryCart',
            success: function (info) {
              setTimeout(function () {
                console.log(info);
                if (info.error) {
                  //如果用户没有登录，跳转到登录页，需要回跳
                  location.href = "login.html?back=" + location.href;
                }

                //说明用户已经登录了  注意：info返回的是一个数组
                $("#OA_task_2").html(template("tpl", { rows: info }));

                //结束下拉刷新
                mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
              }, 1000);
            }
          });
        }
      }
    }
  });


  //删除功能
  // 1. 注册事件的注意点： 委托事件  注册tap
  // 2. 获取到id，发送ajax请求，删除购物车的信息
  // 3. 成功的时候，重新下拉刷新一次即可
  $("#OA_task_2").on("tap", ".btn_delete", function () {

    var id = $(this).data("id");
    mui.confirm("你确定要删除这件商品吗？", "温馨提示", ["是", "否"], function (e) {
      if (e.index === 0) {

        $.ajax({
          type: 'get',
          url: '/cart/deleteCart',
          data: {
            //注意点：文档需要传递一个数组
            id: id
          },
          success: function (info) {
            if (info.success) {
              //重新下拉
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        });
      }
    })

  });


  //计算总金额   注册委托事件   注册change事件
  $("#OA_task_2").on("change", ".ck", function(){
    //所有选中的checkbox
    var total = 0;
    $(".ck:checked").each(function(){
      total += $(this).data("price") * $(this).data("num");
    });
    //显示出来
    $(".lt_money span").text(total.toFixed(2));
  });


  //修改购物车
  //1. 给修改按钮注册点击事件
  //2. 获取到id
  //3. 根据id获取到原来的信息
  //4. 把原来的信息显示出来
  //5. 用户进行修改
  //6. 发送ajax请求，把数据修改
  //7. 重新下拉刷新一次即可。
  $("#OA_task_2").on("tap", ".btn_edit", function () {
    var data = this.dataset;
    console.log(data);
    //回显数据
    var html = template("tpl2", data);
    //需要把html字符串中所有的\n给干掉
    html = html.replace(/\n/g, "");
    console.log(html);
    mui.confirm(html, "编辑商品", ["确定","取消"], function(e){
      //点击确定的时候，需要修改数据
      if(e.index === 0) {
        var id = data.id;
        var num = $(".mui-numbox-input").val();
        var size = $(".proSize span.now").text();

        $.ajax({
          type: 'post',
          url: '/cart/updateCart',
          data: {
            id: id,
            num: num,
            size: size
          },
          success: function(info) {
            if(info.success) {
              //重新下拉刷新
              mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
            }
          }
        })
      }
    });

    //能够修改数量
    mui(".mui-numbox").numbox();
    //能够修改尺码
    $(".proSize span").on("click", function(){
      $(this).addClass("now").siblings().removeClass("now");
    });

  });

});