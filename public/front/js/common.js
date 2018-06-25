//初始化mui的区域滚动
mui('.mui-scroll-wrapper').scroll({
  indicators: false, //不显示滚动条
});

//初始化轮播图
mui('.mui-slider').slider({
  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
});


//用于获取地址栏中的参数
function getSearch() {
  //1. 获取到地址栏中的key对应的值，把这个值放到搜索框中
  var search = location.search;
  //2. 地址栏会对中文进行转码
  search = decodeURI(search);
  //3. 去掉?
  search = search.slice(1);
  //4. 变成一个数组
  var arr = search.split("&");
  var obj = {};
  arr.forEach(function (e, i) {
    var k = e.split("=")[0];
    var v = e.split("=")[1];
    obj[k] = v;
  });
  return obj;
}