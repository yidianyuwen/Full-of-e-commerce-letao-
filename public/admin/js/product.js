$(function () {

  var page = 1;
  var pageSize = 5;
  var imgs = [];//用于存放上传的图片的结果

  render();

  //渲染表格
  function render() {

    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: page,
        pageSize: pageSize,
      },
      success: function (info) {
        //console.log(info);
        var html = template("tpl1", info);
        $("tbody").html(html);

        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: 'small',

          //这个函数的返回值就是按钮的显示的内容
          // itemTexts: function (type, page) {
          //   //console.log(type, page, current);
          //   switch (type) {
          //     case "first":
          //       return "首页";
          //     case "prev":
          //       return "上一页";
          //     case "next":
          //       return "下一页";
          //     case "last":
          //       return "尾页";
          //     case "page":
          //       return page;
          //   }
          // },
          tooltipTitles: function (type, page) {
            //console.log(type, page, current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          useBootstrapTooltip: true,
          bootstrapTooltipOptions: {
            //按钮显示的提示信息依赖于bootstrap样式，
            //按钮提示信息显示的位置
            placement: 'bottom'
          },
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });

      }
    });

  }

  //点击添加按钮，显示模态框，动态渲染二级分类数据到下拉框
  $(".btn_add").on("click", function () {

    //显示模态框
    $("#addModal").modal("show");

    //动态渲染下拉框
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
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

    //给所有的a注册点击事件
    $(".dropdown-menu").on("click", "a", function () {
      var text = $(this).text();
      $(".dropdown-text").text(text);

      //2. 设置隐藏input的val
      $("[name = 'brandId']").val($(this).data("id"));

      //3. 手动校验成功
      $("form").data("bootstrapValidator").updateStatus("brandId", "VALID");

    });

    //上传图片
    $("#fileupload").fileupload({

      //每上传一张图片就执行一次
      done: function (e, data) {
        if (imgs.length >= 3) {
          return;
        }

        //图片上传成功需要把图片显示出来
        //1. img_box中添加一张img
        //图片上传的结果已经存到数组中
        imgs.push(data.result);
        $(".img_box").append('<img src="' + data.result.picAddr + '" width="97" alt="">')

        if (imgs.length === 3) {
          $("form").data("bootstrapValidator").updateStatus("tips", "VALID");
        } else {
          $("form").data("bootstrapValidator").updateStatus("tips", "INVALID");
        }
      }

    });

    //表单校验功能
    $("form").bootstrapValidator({

      excluded: [],   //excluded:指定不校验的类型，[]所有的类型都校验，默认他会不校验type

      feedbackIcons: {
        //校验成功的图标
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        brandId: {
          validators: {
            notEmpty: {
              message: '请选择二级分类'
            }
          }
        },
        proName: {
          validators: {
            notEmpty: {
              message: '请输入商品的名称'
            }
          }
        },
        proDesc: {
          validators: {
            notEmpty: {
              message: '请输入商品的描述'
            }
          }
        },
        proDesc: {
          validators: {
            notEmpty: {
              message: '请输入商品的描述'
            }
          }
        },
        num: {
          validators: {
            //非空  必须是数字类型的
            notEmpty: {
              message: '请输入商品的库存'
            },
            //正则校验的
            regexp: {
              //不能0开头，不能超过5位数 1-99999
              regexp: /^[1-9]\d{0,4}$/,
              message: '请输入正确的库存（1-99999）'
            }
          }
        },
        size: {
          validators: {
            notEmpty: {
              message: '请输入商品的数据'
            },
            //正则校验的衣服尺码范围 30-50
            // regexp: {
            //   //不能0开头，不能超过5位数 1-99999   
            //   regexp: /^\d{2}-\d{2}$/,
            //   message: '请输入正确的尺码范围（xx-xx）'
            // }
          }
        },
        oldPrice: {
          validators: {
            notEmpty: {
              message: '请输入商品的原价'
            }
          }
        },
        price: {
          validators: {
            notEmpty: {
              message: '请输入商品的现价'
            }
          }
        },
        tips: {
          validators: {
            notEmpty: {
              message: '请上传三张图片'
            }
          }
        },
      }
    });

    //表单校验成功后执行
    $("form").on("success.form.bv", function (e) {
      e.preventDefault();   //阻止浏览器默认跳转
      var param = $("form").serialize();
      param += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
      param += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
      param += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;
      //发送ajax请求，添加数据
      $.ajax({
        type: 'post',
        url: '/product/addProduct',
        data: param,
        success: function (info) {
          if (info.success) {
            //隐藏模态框
            $("#addModal").modal('hide');
            //重新渲染
            page = 1;
            render();

            //重置表单
            $("form").data("bootstrapValidator").resetForm(true);
            //把按钮的文字重置
            $(".dropdown-text").text("请选择二级分类");
            $(".img_box img").remove();

            //重置数组
            imgs = [];
          }
        }
      })

    });

  });

});