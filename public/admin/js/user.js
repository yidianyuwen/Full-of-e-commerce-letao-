$(function () {

  //发送AJAX请求，获取用户数据并渲染
  render();

  function render() {

    var page = 1;
    var pageSize = 7;

    $.ajax({

      type: "get",
      url: "/user/queryUser",
      data: {
        page: page,
        pageSize: pageSize,
      },
      success: function (info) {
        // console.log(info);
        var html = template("tpl", info)
        $("tbody").html(html);

        //分页功能
        $("#paginator").bootstrapPaginator({

          bootstrapMajorVersion: 3,    //指定bootstrap的版本
          currentPage: page,          //指定当前页数
          totalPages: Math.ceil(info.total / info.size), //设置总页数
          size: 'small', //调整分页控件的尺寸
          onPageClicked: function (a, b, c, p) {//当点击分页的按钮的时候，会触发
            page = p;
            //重新渲染
            render();

          }

        })

      }

    });

  }

  //启用和禁用框功能
  //需要注册委托事件，因为启用与禁用都是动态生成的
  $("tbody").on("click", ".btn", function () {

    $("#userModal").modal("show");
    var id = $(this).parent().data("id");
    //取决于点的是启用按钮还是禁用按钮
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
    //console.log(id , isDelete);

    //注意解除之前的事件绑定
    $(".btn_update").off().on("click", function () {
      //发送ajax请求
      $.ajax({
        type: 'post',
        url: '/user/updateUser',
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function (info) {
          if (info.success) {
            //关闭模态框
            $("#userModal").modal('hide');
            //重新渲染
            render();
          }
        }
      })

    });

  })

});
