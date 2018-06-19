$(function () {

  var page = 1;
  var pageSize = 8;

  render();

  function render() {
    //发送ajax请求
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        $("tbody").html(template("tpl", info));

        //初始化分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: 'small',
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });
      }
    });
  }


  //添加分类功能
  $(".btn_add").on("click", function () {
    //显示模态框
    $("#addModal").modal('show');
  });


  //表单校验功能
  $("form").bootstrapValidator({

    feedbackIcons: {
      //校验成功的图标
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    //指定校验的规则
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: '一级分类的名称不能空'
          }
        }
      }
    }
  });


  //给表单注册校验成功的事件  success.form.bv
  $("form").on("success.form.bv", function (e) {
    e.preventDefault();
    //console.log("哈哈");
    $.ajax({
      type: 'post',
      url: "/category/addTopCategory",
      data: $("form").serialize(),
      success: function (info) {
        //console.log(info);
        if (info.success) {

          //隐藏模态框
          $("#addModal").modal("hide");

          //重新渲染第一页，因为添加的数据在最前面
          page = 1;
          render();


          //重置表单的内容
          $("form").data("bootstrapValidator").resetForm(true);
        }
      }
    });
  })


});