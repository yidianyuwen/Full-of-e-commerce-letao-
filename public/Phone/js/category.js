$(function () {

  //获取分类名（一级分类）数据，并动态渲染
  $.ajax ({

    type: 'get',
    url: '/category/queryTopCategory',
    success: function (info) {
      // console.log(info);
      $(".category_left ul").html(template("tpl1", info));

      //获取到一级分类之后，渲染了第一个一级分类对应的二级分类
      renderSecond( info.rows[0].id );
    }

  });

  //点击一级分类名，动态渲染右边二级分类logo
  $(".category_left").on("click", "li", function () {

    //给点击的li加now类并排他
    $(this).addClass("now").siblings().removeClass("now");

    //渲染点击选中的li（一级分类名）的所有二级分类logo
    var id = $(this).data("id");
    renderSecond(id);

    //右边的滚动容器滑动到底部在点其他分类时滚到0，0的位置
    mui('.category_right .mui-scroll-wrapper').scroll().scrollTo(0,0,97);//100毫秒滚动到顶

  });


  //二级分类渲染封装
  function renderSecond(id) {

    $.ajax ({

      type: 'get',
      url: '/category/querySecondCategory',
      data: {
        id: id,
      },
      success: function (info) {
        // console.log(info);
        $(".category_right ul").html(template("tpl2", info));
      }

    });

  }

});