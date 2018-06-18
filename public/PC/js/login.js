$(function () {

  //表单校验功能
  //1. 用户名不能为空
  //2. 用户密码不能为空
  //3. 用户密码的长度是6-12位
  var $form = $("form");
  $form.bootstrapValidator({

    feedbackIcons: {
      //校验成功的图标
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    fields: {
      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空",
          },
          stringLength: {
            min: 2,
            message: "用户名最少二位",
          },
          callback: {
            message: "用户名不存在",
          },
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空",
            stringLength: {
              min: 6,
              max: 16,
              message: "密码长度是6-12位",
            },
            callback: {
              message: "密码错误",
            },
          }
        }
      }
    }

  });

  //给表单注册一个校验成功事件
  //success.form.bv是bootstrap表单校验固定表单校验成功事件
  $form.on("success.form.bv", function (e) {

    //阻止浏览器默认跳转
    e.preventDefault();
    //发送AJAX请求
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $form.serialize(),
      success: function (info) {
        //如果校验成功，跳转到首页
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error === 1000) {
          //alert("用户名不存在");

          //手动调用方法，updateStatus让username校验失败即可
          //第一个参数：改变哪个字段
          //第二个参数：改成什么状态  VALID:通过  INVALID:不通过
          //第三个参数：选择提示的信息
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }
        if (info.error === 1001) {
          //alert("密码错误");

          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
      }
    });

  });

  //重置功能
  $("[type='reset']").on("click", function () {

    //取消按钮时重置所有样式
    $form.data("bootsrapValidator").resetForm();

  });

});