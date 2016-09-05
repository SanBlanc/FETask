/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
//用来存在aqiSourceData里面所有的城市
var aCitys = [];
// 用于渲染图表的数据
//这个表格我只留了数据，日期之类的都仍掉了
var chartData = {};
var chartDataTimeInfo = {};//用来存在chartData每一项的时间信息
// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
    // charData
    console.log("----------renderChart----------");
    console.log("chartData only saved the current choice data, get data again from the functin of initAqiChartData");
    initAqiChartData();//重新设置charData

    var oWrap = document.getElementsByClassName("aqi-chart-wrap")[0];
    if (!oWrap) {
        alert('what the fuck problem!');
        return false;
    } else {
        //清空已经存在的
        var childList = oWrap.children;
        for (var i = 0, len = childList.length; i < len; i++) {
            oWrap.removeChild(childList[i]);
        }
    }
    var oUl = document.createElement("ul");
    // oUl.className = 'chart';//非行间样式style取不出来,为了避免麻烦，直接用行间样式
    var oUlHeight = oUl.style.height = "300px";
    var oUlWidth = oUl.style.width = "1000px";
    oUl.style.marginLeft = oUl.style.marginRight = "auto";
    oUl.style.fontSize = "0";
    //获取最大值
    var max = Math.max.apply(null, chartData);
    for (let i = 0; i < chartData.length; i++) {
        var oli = document.createElement("li");
        //四舍五入取整
        var iWidth = parseFloat(oUlWidth) / chartData.length;
        oli.style.width = Math.floor(iWidth);//向下取整
        var iHeight = chartData[i] / max;
        iHeight = iHeight.toFixed(2);//保留小数点2位
        oli.style.height = Math.floor(iHeight * parseFloat(oUlHeight));
        // oli.className = "chart-item";
        // alert(chartData[i].timeInfo);//这样的数据结构没办法取时间！
        oli.title =chartDataTimeInfo[i]+"，aqi数据为："+chartData[i];//日期没在这张表里，该怎么办？::>_<::
        oli.style.display = "inline-block";
        var bgColor = null;
        if (iHeight >= 0.9) {
            bgColor = "#000000";
        } else if (iHeight >= 0.75) {
            bgColor = "#7D0083";
        } else if (iHeight >= 0.6) {
            bgColor = "#FC0000";
        } else if (iHeight >= 0.45) {
            bgColor = "#0102F2";
        } else if (iHeight >= 0.3) {
            bgColor = "#008103";
        } else if (iHeight >= 0.15) {
            bgColor = "#FFBD17";
        } else {
            bgColor = "#F3976C";
        }
        oli.style.backgroundColor = bgColor;
        oUl.appendChild(oli);
    }
    oWrap.appendChild(oUl);
    console.log("the views of chartData done.")
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    var current = this.innerHTML;
    var graTime = current.substring(0, 1);//获取当前选择

    //没有发生改变
    if (graTime === pageState['nowGraTime']) {
        return false;
    } else {
        if (graTime === "日") {
            pageState['nowGraTime'] = "day";
        } else if (graTime === "周") {
            pageState['nowGraTime'] = "week";
        } else if (graTime === "月") {
            pageState['nowGraTime'] = "month";
        }
    }
    // 设置对应数据

    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    console.log("------------citySelectChange-------------");
    var oSelect = document.getElementById("city-select");
    var options = oSelect.getElementsByTagName("option");
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            //没有改变，并且不是第一项数据
            if (pageState['nowSelectCity'] === i &&　i !== 0) {
                return false;//终止程序
            } else {
                pageState['nowSelectCity'] = i;
            }
        }
    }
    // 设置对应数据

    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var oForm = document.getElementById("form-gra-time");
    var oLabels = oForm.getElementsByTagName("label");//选择包裹raido的label作为响应
    for (let i = 0; i < oLabels.length; i++) {
        oLabels[i].addEventListener('click', function (event) {
            window.event ? window.event.cancelBubble = true : e.stopPropagation();//阻止冒泡
            graTimeChange.apply(oLabels[i]);//修改this，指向当前的label对象
        });
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    console.log("------initCitySelector------");
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var oCity = document.getElementById("city-select");

    var curOptions = oCity.getElementsByTagName("option");

    //index 相当于索引，curCont表示已经存在的项
    var curCont=0,index = 0;

    if(curOptions){
        curCont = curOptions.length;
    }
    for (let key in aqiSourceData) {
        aCitys.push(key);//将所有的城市按顺序存放在aCity这个数值中
        //跳过已经处在的，由于options的顺序和aqiSourceData key的顺序一致，所以这样里用continue直接跳过
        if(index < curCont){
            // console.log("curCont:"+curCont+",kip:"+index);
            index +=1;
            continue;
        }else{
            var option = document.createElement("option");
            option.innerHTML = key;
            oCity.appendChild(option);
            // console.log("select-list add option:"+key);
            index +=1;
        }
    }
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    oCity.addEventListener('change', function (event) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();//阻止冒泡
        citySelectChange();
    });

    //问题
    if (pageState['nowSelectCity'] === -1) {
        pageState['nowSelectCity'] = 0;//默认为0，第一项
        console.log("the default choice is 0, set it in pageState");
        citySelectChange();//需要在aCitys之后在手动调用
    }

}
//针对每一项chartData创建的时间数据表
function getTimeInfos(arr,count){
    var iMode,timeDatas=[];
    var strStart,strEnd;
    for(let i=0;i<arr.length;i++){
        iMode = i % count;
        if( count === 1){
            timeDatas.push(arr[i]);
        } else if(iMode === 0 && i === 0){
            strStart = arr[i];
        }else if(i != 0 && iMode ===0){
            strEnd = arr[i-1];
            timeDatas.push(strStart+"到"+strEnd);
            strEnd = null;strStart = arr[i];
        }if(i === arr.length -1){
            strEnd = arr[i];
        }

    }
    if(strStart && strEnd && count != 1){
        timeDatas.push(strStart+" 到 "+strEnd);
    }
    // console.log("时间详情为："+timeDatas);
    return timeDatas;

}

//把arr数据按count个相加，组合成新的数组
function getDatasAcorNum(arr, count) {
    var sum = 0, iMod, datas = [];
    for (let i = 0; i < arr.length; i++) {
        iMod = i % count;
        if (iMod != 0 || i === 0) {
            sum += arr[i];
        } else if (count === 1) {
            //每一项都添加进去
            datas.push(arr[i]);
        } else if (iMod === 0 && i != 0) {
            datas.push(sum);
            // sum =0;
            sum = arr[i];
        }
    }
    //最后不足取模的数值
    if (sum != 0 && count != 1) {
        datas.push(sum);
    }
    return datas;
}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    console.log("------initAqiChartData----------");
    var iTag = pageState['nowSelectCity'];
    var city = aCitys[iTag];//获取当前城市
    if(!city){
        console.log("city is not define, check this aCitys value!!");
        return false;
    }
    console.log("your choice is:"+city);
    var date = pageState['nowGraTime'];
    console.log("clear the value of chartData");
    chartData = [];//重置chartData数据表
    chartDataTimeInfo = [];//构建新表，存储对应chartData每一项的时间信息
    var arrCurTimeInfo = [];
    var arrCurrent = [];//根据城市选择的数据表
    for (let i in aqiSourceData[city]) {
        // var iData = ;
        arrCurrent.push(aqiSourceData[city][i]);
        arrCurTimeInfo.push(i);
        // console.log("i = "+i+", Data = "+iData);
    }
    // var len = arrCurrent.length;

    if (date === "month") {
        chartData = getDatasAcorNum(arrCurrent, 30);
        chartDataTimeInfo = getTimeInfos(arrCurTimeInfo,30);
    } else if (date === "week") {
        chartData = getDatasAcorNum(arrCurrent, 7);
        chartDataTimeInfo = getTimeInfos(arrCurTimeInfo,7);
    } else if (date === "day") {
        chartData = getDatasAcorNum(arrCurrent, 1);
        chartDataTimeInfo = getTimeInfos(arrCurTimeInfo,1);
    } else {
        alert('what the fuck!');
    }
    console.log("chartData done");
    // 处理好的数据存到 chartData 中

}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();//初始化时间周期选择radio
    initCitySelector();//初始化select选项options
    // initAqiChartData();//生成chartData数据表，不需要
}

init();
