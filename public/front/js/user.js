$(function(){

  //1. 查询用户的个人信息
  $.ajax({
    type:'get',
    url: '/user/queryUserMessage',
    success: function(info) {
      console.log(info);
      if(info.error) {
        //如果没有登录，跳转到登录页
        window.location.href = "login.html";
      }
      //============坑====================
      /* if(info.success) {

      }*/
      $(".userinfo").html( template("tpl", info) );
    }
  });

  //2. 退出功能
  //2.1 给退出按钮注册事件
  //2.2 发送ajax请求，如果成功，跳转到登录页
  $(".btn_logout").on("click", function() {
    $.ajax({
      type:"get",
      url:"/user/logout",
      success: function(info) {
        //console.log(info);
        if(info.success) {
          location.href = "login.html";
        }
      }
    })
  });

});