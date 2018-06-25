$(function () {

  var page = 1;//当前页
  var pageSize = 4;//每页显示的条数

  //获取地址栏中的参数
  var key = getSearch().key;
  //设置给input框
  $(".lt_search input").val(key);


  //配置下拉刷新与上拉加载的
  //上拉加载与下拉刷新的异同点：
  //相同点：都需要发送ajax请求
  //不同点：1. 下拉刷新：page=1 使用html方法把以前的内容覆盖   结束下拉刷新
  //       2.  上拉加载 page++ 使用append方法追加内容         结束上拉加载
  mui.init({
    pullRefresh: {
      //指定区域滚动的容器
      container: ".mui-scroll-wrapper",
      //指定下拉刷新的配置
      down: {
        //当下拉刷新触发的时候会执行
        auto: true, //页面一加载，先下拉刷新一次
        callback: function () {
          //下拉刷新，只需要加载第一页
          page = 1;
          //info是render发送ajax得到的info参数
          //callback
          render(function (info) {
            $(".lt_product").html(template("tpl", info));
            //结束下拉刷新
            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();

            //重置上拉加载，保证上拉加载可以继续使用
            mui(".mui-scroll-wrapper").pullRefresh().refresh(true);
          });
        }
      },
      //上拉加载
      up: {
        callback: function () {
          //下拉刷新，只需要加载第一页
          page++;
          //info是render发送ajax得到的info参数
          //callback
          render(function (info) {
            //console.log(info);
            $(".lt_product").append(template("tpl", info));
            //结束上拉加载
            // if(info.data.length > 0) {
            //   mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(false);
            // }else {
            //   mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(true);
            // }
            mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh(info.data.length == 0);

          });
        }
      }
    }
  });


  //点击搜索按钮，渲染
  //1. 给按钮注册点击事件
  //2. 获取到文本框的值
  //3. 重新渲染
  $(".lt_search button").on("click", function () {

    //当点击搜索按钮的时候，需要把排序的样式重置
    //把所有的li的now的类全部清掉
    //把所有的li下的span的箭头全部向下
    $(".lt_sort li").removeClass("now")
    $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");


    key = $(".lt_search input").val();
    //调用一次下拉刷新功能即可
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
  });


  //点击排序的按钮（价格或者是库存），重新发送ajax请求
  //如果点了价格进行排序，需要多传一个参数，price: 1或者是2
  //如果点了库存进行排序，需要多传一个参数，num: 1或者是2

  //如果当前的li没有now这个类，让当前的li有now这个类，并且让其他的li没有now这个类,让所有的span的箭头都初始向下
  //如果当前li有now这个类，修改当前li下的span的箭头的类
  $(".lt_sort li[data-type]").on("tap", function () {
    
    var $this = $(this);
    if (!$this.hasClass("now")) {
      //没有now这个类
      //1. 让当前的li有now这个类，移除其他li的now
      $(this).addClass("now").siblings().removeClass("now");
      //2. 让所有span下的箭头都向下
      $(".lt_sort li span").addClass("fa-angle-down").removeClass("fa-angle-up");
    } else {
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }

    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

  });

  /* 
    
  
   
  
    //点击搜索按钮，渲染
    //1. 给按钮注册点击事件
    //2. 获取到文本框的值
    //3. 重新渲染
    $(".lt_search button").on("click", function () {
  
      //当点击搜索按钮的时候，需要把排序的样式重置
      //把所有的li的now的类全部清掉
      //把所有的li下的span的箭头全部向下
      $(".lt_sort li").removeClass("now")
      $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
  
  
      key = $(".lt_search input").val();
      render();
    });
  
  
  
  
    //点击排序的按钮（价格或者是库存），重新发送ajax请求
    //如果点了价格进行排序，需要多传一个参数，price: 1或者是2
    //如果点了库存进行排序，需要多传一个参数，num: 1或者是2
  
    //如果当前的li没有now这个类，让当前的li有now这个类，并且让其他的li没有now这个类,让所有的span的箭头都初始向下
    //如果当前li有now这个类，修改当前li下的span的箭头的类
    $(".lt_sort li[data-type]").on("click", function () {
  
      var $this = $(this);
  
      if (!$this.hasClass("now")) {
        //没有now这个类
        //1. 让当前的li有now这个类，移除其他li的now
        $(this).addClass("now").siblings().removeClass("now");
        //2. 让所有span下的箭头都向下
        $(".lt_sort li span").addClass("fa-angle-down").removeClass("fa-angle-up");
      } else {
        $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
      }
  
      render();
  
    });
  
  
  
    
  
   */


  function render(callback) {
    //每次需要重新渲染数据的时候，先把内容替换成loading
    // $(".lt_product").html('<div class="loading"></div>');
    //发送ajax请求，获取搜索到商品数据
    var obj = {
      proName: key,
      page: page,
      pageSize: pageSize
    };

    //判断是否需要添加price或者是num参数
    var $select = $(".lt_sort li.now");
    if ($select.length > 0) {
      //console.log("需要排序");
      var type = $select.data("type");
      var value = $select.find("span").hasClass("fa-angle-down") ? 2 : 1;
      //给参数增加了一个属性，属性可以能是price，也可以能是num
      obj[type] = value;
    } else {
      //console.log("不需要排序");
    }

    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: obj,
      success: function (info) {
        //console.log(info);
        setTimeout(function () {
          callback(info);
        }, 1000);

      }
    })
  }
});