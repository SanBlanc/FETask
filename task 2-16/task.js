function getDOM(nodeID) {
    return document.getElementById(nodeID);
}
function newEle(tag) {
    return document.createElement(tag);
}
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var oTable = getDOM("aqi-table");
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var sCity = getDOM("aqi-city-input"),
        iAqi = getDOM("aqi-value-input");
    sCity = sCity.value.trim();
    iAqi = iAqi.value.trim();

    //判断中英文字符正则
    if (!sCity.match(/^[A-Za-z\u4E00-\u9FA5]+$/)) {
        alert("城市名必须为中英文字符！");
        return;
    }
    //判断数值正则
    if (!iAqi.match(/^\d+$/)) {
        alert("空气质量指数必须为整数！");
        return;
    }
    aqiData[sCity] = iAqi;
}


/**
 * 渲染aqi-table表格
 */
function renderAqiList() {

    if (oTable.children.length <= 0) {
        oTable.innerHTML = "<tr> <td>城市</td> <td>空气质量</td> <td>操作</td> </tr>";
    }


    for (var city in aqiData) {



        var otr = newEle("tr");
        var otd1 = newEle("td");
        var otd2 = newEle("td");
        var otd3 = newEle("td");


        otd1.innerHTML = city;
        otd2.innerHTML = aqiData[city];
//        otd3.innerHTML = '<a onclick="delBtnHandle()" href="javascript:;">删除</a>';
        otd3.innerHTML = '<a href="javascript:;">删除</a>';
        otr.appendChild(otd1);
        otr.appendChild(otd2);
        otr.appendChild(otd3);
    }
    oTable.tBodies[0].appendChild(otr);
    addEvents();//再次刷新数据之后
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
    // do sth.
    delete aqiData[city];//删除数据
//    renderAqiList();
}
var oRemove=null;
function addEvents(){
    oRemove = oTable.getElementsByTagName('a');
    for(var i = 0;i<oRemove.length;i++){
        oRemove[i].onclick = function(){
            var city = this.parentNode.parentNode.firstChild.textContent;//删除的索引
            oTable.tBodies[0].removeChild(this.parentNode.parentNode);//delete
            delBtnHandle(city);
        };
    }
}
function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    var oBtn = getDOM("add-btn");
    oBtn.onclick = addBtnHandle;
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    //因为初始化的时候并不存在a标签，所以添加事件放在表格渲染之后
}
init();