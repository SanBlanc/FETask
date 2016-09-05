/**
 * Created by San on 2016/8/3.
 */
function getDOM(id) {
    return document.getElementById(id);
}

/**
 * 冒泡处理
 * @param e
 */
function myCancelBubble(e) {
    var oEvent = e || event;
    oEvent.cancelBubble = true;
}
/**
 * 获取属性
 * @param obj
 * @param attr
 * @returns {*}
 */
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}

/**
 * 运动框架
 * @param obj
 * @param json
 * @param fnEnd
 */
function startMove(obj, json,fnEnd) {
    console.log("----------startMove-----------");
    if (obj.timer) {
        clearInterval(obj.timer);
    }
    obj.timer = setInterval(function() {
        var bStop = true;
        for (var attr in json) {
            var cur = 0;
            if (attr == "opacity") {
                cur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
            } else {
                cur = parseInt(getStyle(obj, attr));
            }
            var speed = (json[attr] - cur) / 6;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (cur != json[attr]) {
                bStop = false;
            }
            if (attr == "opacity") {
                obj.style.filter = 'alpha(opacity:' + (cur + speed) + ')';
                obj.style.opacity = (cur + speed) / 100;
            } else {
                obj.style[attr] = cur + speed + 'px';
            }
        }
        if (bStop) {
            clearInterval(obj.timer);
            console.log("clear the move timer ");
            if (fnEnd) fnEnd();

        }
    }, 30);
}

/**
 * 判断value是否符合10-100
 * @param value
 * @returns {boolean}
 */
function isAvailabe(value) {
    var iTxt = parseInt(value.trim());
    if (isNaN(iTxt)) {
        return false;
    } else if (iTxt >= 10 && iTxt <= 100) {
        return true;
    } else {
        return false;
    }
}

var oParent;
var aChildren;
var iLimit = 60;//不超过60个

/**
 * 设置某一个元素的宽度
 * @param obj
 */
function setSizeStyle(obj,bSort) {
    var iWid = getStyle(oParent, "width");
    // obj.style.width = Math.floor(parseInt(iWid) / aChildren.length) + 'px';
    var iWidTarget = Math.floor(parseInt(iWid) / aChildren.length) + 'px';

    var iParentH = parseInt(getStyle(oParent, "height"));
    var iCnt = obj.textContent;
    var iChildH = iCnt / 100;
    iChildH = iChildH.toFixed(2) * iParentH;
    // obj.style.height = iChildH + 'px';
    var iHeiTarget = iChildH + 'px';

    obj.style.width = iWidTarget;
    obj.style.height = iHeiTarget;

    /*if(bSort){
        startMove(obj,{"width":iWidTarget,"height":iHeiTarget});
    }else{
        obj.style.width = iWidTarget;
        obj.style.height = iHeiTarget;
    }*/
}

/**
 * 重新设置aChildren的宽高
 */
function modiWid(bSort) {
    for (let i = 0; i < aChildren.length; i++) {
        setSizeStyle(aChildren[i],bSort);
    }
}

function setClassStyle(obj) {
    if (obj) {
        if (obj.className) {
            obj.className += " list-item";
        } else {
            obj.className = "list-item";
        }
        obj.title = obj.textContent;
        // setSizeStyle(obj);
        console.log("setClass for " + obj.textContent);
    } else {
        for (let i = 0; i < aChildren.length; i++) {
            var _this = aChildren[i];
            if (_this.className == '') {
                _this.className = "list-item";
            } else {
                _this.className += " list-item";
            }
            _this.title = _this.textContent;
            // setSizeStyle(_this);
        }
    }
    modiWid();
}

function addElement(value, location) {
    if (!value) {
        console.log("addElement----- value is null!");
        return;
    }
    if (aChildren.length == iLimit) {
        alert("上限为60个，请删除其他再添加");
        return;
    } else if (aChildren.length < iLimit) {
        console.log("addElement ---- location:" + location + ", value:" + value);
        var oli = document.createElement("li");
        oli.innerHTML = value.trim();
        if (location == "begin") {
            oParent.insertBefore(oli, aChildren[0]);
            setClassStyle(aChildren[0]);
            addItemEvent(aChildren[0]);
        } else if (location == "end") {
            oParent.appendChild(oli);
            setClassStyle(aChildren[aChildren.length - 1]);
            addItemEvent(aChildren[aChildren.length - 1]);
        }
    }

}

function removeElement(location) {
    if (location == "begin") {
        oParent.removeChild(aChildren[0]);
    } else if (location == "end") {
        oParent.removeChild(aChildren[aChildren.length - 1]);
    }
    modiWid();
}
function setListEvent() {
    for (let i = 0; i < aChildren.length; i++) {
        aChildren[i].onclick = function (e) {
//          console.log("remove item:"+i+"value:"+aChildren[i].textContent);
            oParent.removeChild(this);//如果将this 改成aChildren[i]，会报错
            modiWid();
            myCancelBubble(e);//取消冒泡
            return false;//取消默认方法
        }
    }
}

function addItemEvent(obj) {
    obj.onclick = function (e) {
        oParent.removeChild(this);
        modiWid();
        myCancelBubble(e);
        return false;
    }
}
/**
 * 两两比较，从大到小 >  ，或从小到大  <
 * @param arr
 * @returns {*}
 */
function sortBetween(arr) {
    var mix = 0;
    for (let j = 0; j < arr.length; j++) {
        for (let i = j + 1; i < arr.length; i++) {
            if (arr[i] < arr[j]) {
                mix = arr[i];
                arr[i] = arr[j];
                arr[j] = mix;
            }
        }
    }
    return arr;
}

/**
 * 从小到大排序
 * @param arr
 * @returns {Array}
 */
function sortArray(arr) {
    var min, aResult = [], aSort = [];
    for (let i = 0; i < arr.length; i++) {
        aSort.push(arr[i]);
    }
    var iCount = aSort.length;
    for(let i = 0;i<iCount;i++){//之所以不用length是保证执行次数
        min = Math.min.apply(null,aSort);
        // max = Math.max.apply(null,aSort);//这个可以从大到小
        aResult.push(min);
        var del = aSort.indexOf(min);
        aSort.splice(del,1);
    }
    return aResult;
}

function sortAll() {
    var dataStore = [],arr=[];
    for (let i = 0; i < aChildren.length; i++) {
        // dataStore.push(aChildren[i].textContent);
        arr.push(parseInt(aChildren[i].textContent));
    }
   /* dataStore.sort(function (a, b) {
        return a - b;
    });*/
    dataStore = sortArray(arr);
    // dataStore = sortBetween(arr);
    // alert(dataStore);
    console.log("after be sorted: "+dataStore);
    for (let i = 0; i < dataStore.length; i++) {
        // aChildren[i].innerHTML ='';
        aChildren[i].title = dataStore[i];
        aChildren[i].textContent = dataStore[i];//不删除直接替换里面的内容
    }
    // setClassStyle();
    modiWid(true);
}


function init() {
    oParent = getDOM("list");
    // aChildren = oParent.getElementsByTagName("li");
    aChildren = oParent.children;
    setClassStyle();
    setListEvent();

    var oBtnLeftIn = getDOM("leftIn");
    var oBtnLeftOut = getDOM("leftOut");
    var oBtnRightIn = getDOM("rightIn");
    var oBtnRightOut = getDOM("rightOut");
    var oTxt = getDOM("text-in");
    var oBtnSort = getDOM("sort");

    oBtnSort.onclick = function (e) {
        sortAll();
        myCancelBubble(e);
        return false;
    };

    oBtnLeftIn.onclick = function (e) {
        if (isAvailabe(oTxt.value)) {
            addElement(oTxt.value, "begin");
        } else {
            alert("请输入10-100的数字！");
        }

        myCancelBubble(e);
        oTxt.value = '';
        return false;
    };
    oBtnRightIn.onclick = function (e) {
        if (isAvailabe(oTxt.value)) {
            addElement(oTxt.value, "end");
        } else {
            alert("请输入10-100的数字！");
        }

        myCancelBubble(e);
        oTxt.value = '';
        return false;
    };

    oBtnLeftOut.onclick = function (e) {
        removeElement("begin");
        myCancelBubble(e);
        return false;
    };
    oBtnRightOut.onclick = function (e) {
        removeElement("end");
        myCancelBubble(e);
        return false;
    };
}
init();