'use strict';


var tagAddTxt = document.querySelector("#tagAddTxt");
var setTag = new Set();//用无法重复的set来管理tag列表
var tagList = document.querySelector("ul#tagList");
var tags = tagList.children;

var setHobby = new Set();//存储兴趣爱好
var hobbyList = document.querySelector("#hobbyList");
var addHobbyBtn = document.querySelector("#addHobbyBtn");
var hobbyTxt = document.querySelector("#hobbyTxt");

/**
 * 添加事件
 */
function addEvent(obj, sEv, func) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + sEv, function () {
            func.call(obj);
        });
    } else {
        obj.addEventListener(sEv, func);
    }
}

/**
 * 阻止默认事件和事件冒泡
 */
function runEvent(event) {
    var oEvent = event || window.event;
    oEvent.cancelBubble = true;
    oEvent.preventDefault();
}

function tagsToggle(obj) {
    var sCon = '删除';
    console.log(obj.innerHTML);
    if (obj.innerHTML.indexOf(sCon) >= 0) {
        obj.classList.remove('select');
        obj.removeChild(obj.lastElementChild);
    } else {
        obj.classList.add('select');
        var oDelNode = document.createElement('i');
        oDelNode.innerText = sCon;
        obj.appendChild(oDelNode);
    }
}


/**
 * tag 控制事件添加
 */
function controlTags() {
    for (let i = 0; i < tags.length; i++) {

        tags[i].onmouseover = function (event) {
            tagsToggle(this);
        };

        tags[i].onmouseout = function (event) {
            tagsToggle(this);
        };
        tags[i].onclick = function (event) {
            if (this.lastElementChild.innerText.indexOf('删除') >= 0) {
                tagList.removeChild(this);
            }
            runEvent(event);
        };
    }
}


/**
 * 添加tag执行程序
 */
function addTag(value) {
    if (!value) {
        alert("字段为空，无法添加！");
        return false;
    }
    if (setTag.has(value)) {
        alert("该字段已经存在，无法重复添加");
        tagAddTxt.value = '';
        return false;
    }
    //最多允许10个Tag，多于10个时,按照录入的先后顺序，把最前面的删掉
    if (setTag.size >= 10) {
        // alert("字段已经满10个！");
        var oDel = tagList.firstElementChild;
        setTag.delete(oDel.innerText);
        tagList.removeChild(oDel);
    }
    setTag.add(value);
    console.log(setTag);
    var oli = document.createElement("li");
    oli.innerText = value;
    oli.classList.add('item');
    tagList.appendChild(oli);
    tagAddTxt.value = '';
    controlTags();

}


function addHobby(value) {
    if (!value) {
        alert("没有添加项，请输入！");
        return false;
    }
    var arr = value.split(/[\s\,\，\、\/\\]+/g);
    //如果最后一项为空，删除
    if (!arr[arr.length - 1]) {
        // alert("最后一项为空，删除！");
        arr.length = arr.length - 1;
    }
    // alert(arr);

    for (let i = 0; i < arr.length; i++) {
        if (setHobby.size >= 10) {
            var oDelItem = hobbyList.firstElementChild;
            setHobby.delete(oDelItem.innerText);
            hobbyList.removeChild(oDelItem);
        }
        if (setHobby.has(arr[i])) {
            // alert("爱好不可以重复");
            console.log("当前列表各项为：");
            console.log(setHobby);
            console.log("爱好不可以重复，忽略:" + arr[i]);
            continue;
        }
        setHobby.add(arr[i]);
        var oli = document.createElement("li");
        oli.innerHTML = arr[i];
        oli.classList.add("item");//为列表元素添加样式
        hobbyList.appendChild(oli);
    }

    hobbyTxt.value = '';
}

(function () {

    //键盘添加tag事件
    addEvent(tagAddTxt, 'keydown', function (event) {
        var oEvent = event || window.event;
        if (oEvent.keyCode == 188) {
            event.preventDefault();
            addTag(tagAddTxt.value.trim());
        }
        if (oEvent.keyCode == 13 || oEvent.keyCode == 32) {
            addTag(tagAddTxt.value.trim());
        }
    });

    addHobbyBtn.onclick = function (event) {
        runEvent(event);
        addHobby(hobbyTxt.value);
    };

})();