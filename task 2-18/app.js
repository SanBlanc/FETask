/**
 * Created by San on 2016/8/3.
 */

function myCancelBubble(e) {
    // window.event ? window.event.cancelBubble = true : event.stopPropagation();
    // event ? event.cancelBubble = true : e.stopPropagation();
    var oEvent = e || event;
    oEvent.cancelBubble = true;
}

function getDOM(id) {
    return document.getElementById(id);
}

var oParent = getDOM("list");
var aChildren = oParent.getElementsByTagName("li");


function setStyle(obj) {
    if (obj) {
        if (obj.className) {
            obj.className += " list-item";
        } else {
            obj.className = "list-item";
        }
        console.log("setStyle for " + obj.textContent);
    } else {
        for (let i = 0; i < aChildren.length; i++) {
            var _this = aChildren[i];
            if (_this.className == '') {
                _this.className = "list-item";
            } else {
                _this.className += " list-item";
            }
        }
    }
}

function addItemEvent(obj){
    obj.onclick = function (e) {
        oParent.removeChild(this);
        modiWid();
        myCancelBubble(e);
        return false;
    }
}
function setListEvent() {
    for (let i = 0; i < aChildren.length; i++) {
        aChildren[i].onclick = function (e) {
//                    console.log("remove item:"+i+"value:"+aChildren[i].textContent);
            oParent.removeChild(this);//如果将this 改成aChildren[i]，会报错
            myCancelBubble(e);//取消冒泡
            return false;//取消默认方法
        }
    }
}

function addElement(location, value) {
    console.log("addElement ---- location:" + location + ", value:" + value);
    var oli = document.createElement("li");
    oli.innerHTML = value.trim();
    if (location == "begin") {
        oParent.insertBefore(oli, aChildren[0]);
        addItemEvent(aChildren[0]);
        setStyle(aChildren[0]);
    } else if (location == "end") {
        oParent.appendChild(oli);
        setStyle(aChildren[aChildren.length - 1]);
        addItemEvent(aChildren[aChildren.length - 1]);
    }
}

function removeElement(location) {
    if (location == "begin") {
        oParent.removeChild(aChildren[0]);
    } else if (location == "end") {
        oParent.removeChild(aChildren[aChildren.length - 1]);
    }
}

function init() {
    setStyle();//给列表项添加样式
    setListEvent();//给列表项添加点击删除事件


    var oBtnLeftIn = getDOM("leftIn");
    var oBtnLeftOut = getDOM("leftOut");
    var oBtnRightIn = getDOM("rightIn");
    var oBtnRightOut = getDOM("rightOut");
    var sTxt = getDOM("text-in");

    oBtnLeftIn.onclick = function (e) {
        addElement("begin", sTxt.value);
        myCancelBubble(e);
        sTxt.value = '';
        return false;
    };

    oBtnRightIn.onclick = function (e) {
        addElement("end", sTxt.value);
        myCancelBubble(e);
        sTxt.value = '';
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