$(function () {

  //点击确认按钮
  //获取到用户名和密码，表单校验
  //发送ajax请求，如果成功了跳转到？？？？？
  $(".btn_login").on("click", function () {
    var username = $("[name='username']").val();
    var password = $("[name='password']").val();

    if (!username) {
      mui.toast("请输入用户名");
      return;
    }
    if (!password) {
      mui.toast("请输入密码");
      return;
    }

    //发送ajax
    $.ajax({
      type: 'post',
      url: '/user/login',
      data: {
        username: username,
        password: password
      },
      success: function (info) {
        console.log(info);
        //如果错误，提示错误信息
        if (info.error) {
          mui.toast(info.message);
        }
        if (info.success) {
          //跳转到？？？？？？？
          //如果是直接访问的登录页面，跳转到会员中心
          //如果是购物车页面或者商品详情页面跳转到登录页的，成功之后，需要回跳
          //判断是否有back参数，如果有，跳转到back对应的页面即可，如果没有back，默认跳到user.html
          if (location.search.indexOf("back") > -1) {
            //包含了back参数
            location.href = location.search.replace("?back=", "");
          } else {
            location.href = "user.html";
          }


        }
      }
    })

  });

});