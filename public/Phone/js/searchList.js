$(function () {

  var page = 1;
  var pageSize = 5;

  //获取地址栏中的参数
  var key = getSearch().key;
  //设置给input框
  $(".lt_search input").val(key);
  //渲染
  // render();

  //初始化下拉刷新与上拉加载
  //1. 页面一加载，需要下拉刷新一次
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: 49, //可选,默认50.触发下拉刷新拖动距离,
        auto: true, //可选,默认false.首次加载自动下拉刷新一次
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          //发送ajax请求，渲染数据
          page = 1;
          render(function (info) {
            //假设获取数据需要1s
            $(".lt_product").html(template("tpl", info));
            //结束下拉刷新
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
              //结束上拉加载
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
    if ($select.length > 0) {
      //拿到type  拿到value
      var type = $select.data("type");
      var value = $select.find("span").hasClass("fa-angle-up") ? 1 : 2;
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
    });

  }


//没有引入mui下拉刷新，上啦加载组件的版本
  // //点击搜索按钮，渲染
  // //1. 给按钮注册点击事件
  // //2. 获取到文本框的值
  // //3. 重新渲染
  // $(".lt_search button").on("click", function () {

  //   //当点击搜索按钮的时候，需要把排序的样式重置
  //   //把所有的li的now的类全部清掉
  //   //把所有的li下的span的箭头全部向下
  //   $(".lt_sort li").removeClass("now")
  //   $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");

  //   key = $(".lt_search input").val();
  //   render();

  // });

  // //点击排序的按钮（价格或者是库存），重新发送ajax请求
  // //如果点了价格进行排序，需要多传一个参数，price: 1或者是2
  // //如果点了库存进行排序，需要多传一个参数，num: 1或者是2

  // //如果当前的li没有now这个类，让当前的li有now这个类，并且让其他的li没有now这个类,让所有的span的箭头都初始向下
  // //如果当前li有now这个类，修改当前li下的span的箭头的类
  // $(".lt_sort li[data-type]").on("click", function () {

  //   var $this = $(this);

  //   if (!$this.hasClass("now")) {
  //     //没有now这个类
  //     //1. 让当前的li有now这个类，移除其他li的now
  //     $(this).addClass("now").siblings().removeClass("now");
  //     //2. 让所有span下的箭头都向下
  //     $(".lt_sort li span").addClass("fa-angle-down").removeClass("fa-angle-up");
  //   } else {
  //     $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
  //   }

  //   render();

  // });


  //多个页面需要获取，放到公共js
  // //用于获取地址栏中的参数  要多次获取，封装
  // function getSearch() {
  //   //1. 获取到地址栏中的key对应的值，把这个值放到搜索框中
  //   var search = location.search;
  //   //2. 地址栏会对中文进行转码
  //   search = decodeURI(search);
  //   //3. 去掉?
  //   search = search.slice(1);
  //   //4. 变成一个数组
  //   var arr = search.split("&");
  //   var obj = {};
  //   arr.forEach(function (e, i) {
  //     var k = e.split("=")[0];
  //     var v = e.split("=")[1];
  //     obj[k] = v;
  //   });
  //   return obj;
  // }


  // function render() {
  //   //每次需要重新渲染数据的时候，先把内容替换成loading
  //   // $(".lt_product").html('<div class="loading"></div>');
  //   //发送ajax请求，获取搜索到商品数据
  //   var obj = {
  //     proName: key,
  //     page: page,
  //     pageSize: pageSize
  //   };

  //   //判断是否需要添加price或者是num参数
  //   var $select = $(".lt_sort li.now");
  //   if ($select.length > 0) {
  //     //console.log("需要排序");
  //     var type = $select.data("type");
  //     var value = $select.find("span").hasClass("fa-angle-down") ? 2 : 1;
  //     //给参数增加了一个属性，属性可以能是price，也可以能是num
  //     obj[type] = value;
  //   } else {
  //     //console.log("不需要排序");
  //   };

  //   $.ajax({
  //     type: 'get',
  //     url: '/product/queryProduct',
  //     data: obj,
  //     success: function (info) {
  //       //console.log(info);
  //       setTimeout(function () {
  //         //结合模板引擎渲染出来
  //         $(".lt_product").html(template("tpl", info));
  //       }, 1000);
  //     },
  //   });

  // }


});