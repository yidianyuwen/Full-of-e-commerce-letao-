$(function () {

  var page = 1;
  var pageSize = 7;

  //动态渲染分类数据
  render();

  function render() {

    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize,
      },
      success: function (info) {

        // console.log(info);
        var html = template("tpl1", info);
        $("tbody").html(html);

        //分页
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

  //分类菜单
  $(".btn_add").on("click", function () {

    $("#addModal").modal("show");

    //发送ajax请求，获取所有的一级分类的数据
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 97,
      },
      success: function (info) {
        //console.log(info);
        var html = template("tpl2", info);
        $(".dropdown-menu").html(html);
      }
    });

  });

  //给分类菜单注册功能
  //让一级分类能够选择
  $(".dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    //设置给button
    $(".dropdown-text").text(txt);

    var id = $(this).data("id");
    //获取到id，设置给categoryId这个隐藏域
    $("[name='categoryId']").val(id);

    //让隐藏的categoryIde的校验通过
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });

  //图片上传功能,获取上传后的结果
  $("#fileupload").fileupload({
    dataType: 'json', //返回的结果的类型是json
    //e :事件对象
    //data: 上传后的结果
    done: function (e, data) {//图片上传后的回调函数

      //获取到地址后，需要干什么？？？？
      console.log(data.result.picAddr);
      //修改img_box下的img的src
      $(".img_box img").attr("src", data.result.picAddr);

      //给brandLogo赋值
      $("[name='brandLogo']").val(data.result.picAddr);

      //让brandLogo校验通过
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  //表单校验功能
  $("form").bootstrapValidator({
    //excluded:指定不校验的类型，[]所有的类型都校验，默认他会不校验type
    excluded: [],

    feedbackIcons: {
      //校验成功的图标
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类的名称'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传二级分类的图片'
          }
        }
      }
    }
  });

  //表单校验成功，阻止表单提交，使用AJAX提交
  $("form").on("success.form.bv", function (e) {

    e.preventDefault();     //阻止表单提交

    $.ajax({

      type: 'post',
      url: '/category/addSecondCategory',
      data: $("form").serialize(),
      success: function (info) {
        if (info.success) {
          //隐藏模态框
          $("#addModal").modal("hide");
          //重新渲染第一页
          page = 1;
          render();
          //重置表单
          $("form").data("bootstrapValidator").resetForm(true);
          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src", "images/none.png");
        }
      }

    });

  });

});