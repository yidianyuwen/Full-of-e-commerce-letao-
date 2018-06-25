$(function () {

  var page = 1;
  var pageSize = 3;

  //页面加载的时候，需要获取到地址栏中的key
  var key = getSearch().key;
  $(".lt_search input").val(key);

  //初始化下拉刷新与上拉加载
  //1. 页面一加载，需要下拉刷新一次
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down: {
        auto: true,
        callback: function () {
          //发送ajax请求，渲染数据
          page = 1;
          render(function (info) {
            //假设获取数据需要1s
            $(".lt_product").html(template("tpl", info));
            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
            //重置上拉加载
            mui(".mui-scroll-wrapper").pullRefresh().refresh(true);
          });
        }
      },
      up: {
        callback: function () {
          page++;
          render(function (info) {
            //假设获取数据需要1s
            $(".lt_product").append(template("tpl", info));
            if (info.data.length === 0) {
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
            } else {
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(false);
            }

          });
        }
      }
    }
  });

  //2. 点击按钮，需要下拉刷新一次
  $(".lt_search button").on("click", function () {
    //重置所有的now和箭头的方向
    $(".lt_sort li").removeClass("now");
    $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
    //修改了全局的key
    key = $(".lt_search input").val();
    //重新下拉刷新一次即可
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  });


  //3. 点击排序，需要下拉刷新一次
  $(".lt_sort li[data-type]").on("tap", function () {
    if ($(this).hasClass("now")) {
      //让下面的span换箭头
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      $(this).addClass("now").siblings().removeClass("now");
      //让所有的span的箭头都向下
      $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
    }

    //手动下拉刷新
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  });

  function render(callback) {
    var obj = {};
    obj.page = page;
    obj.pageSize = pageSize;
    obj.proName = key;

    //处理排序的字段
    //判断li有没有被点，看有没有now这个类
    var $select = $(".lt_sort li.now");
    if($select.length > 0) {
      //拿到type  拿到value
      var type = $select.data("type");
      var value =  $select.find("span").hasClass("fa-angle-up")?1:2;
      //给发送的参数增加了一个值
      obj[type] = value;
    }

    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: obj,
      success: function (info) {
        setTimeout(function () {
          callback(info);
        }, 1000);
      }
    })
  }









});