/**
 * Created by San on 2016/8/8.
 */
'use strict';
var oAddTxt = document.querySelector("#add-txt");
var oAddBtn = document.querySelector("#addBtn");

var oFindBtn = document.querySelector("#searchBtn");
var oFindTxt = document.querySelector("#keyTxt");

var oList = document.querySelector("#show");
var arrList = [];//存储当前列表内容

function addList(value) {
    console.log("-----------addList----------");
    //回车，逗号，顿号，空格
    // var arr = value.split(/[\s\,\，\、\\]/);
    var arr = value.split(/[\s\,\，\、\/\\]+/g);
    if (!arr[arr.length - 1]) {
        // alert("最后一项为空，删除！");
        arr.length = arr.length - 1;
    }

    for (let i = 0; i < arr.length; i++) {
        var oli = document.createElement("li");
        oli.innerHTML = arr[i];
        oli.classList.add("item");//为列表元素添加样式
        oList.appendChild(oli);
    }
    for (let i = 0; i < arr.length; i++) {
        arrList.push(arr[i]);
    }
    console.log("get the input array is:" + arrList);
    oAddTxt.value = '';
}

function searchTxt(value) {
    console.log("--------searchTxt---------");
    if (!value) {
        alert("查询字段为空，请输入字段再执行查询操作！");
        return false;
    }
    var aFind = [];
    console.log("查询关键词为：" + value.trim());
    for (let i = 0; i < arrList.length; i++) {
        oList.children[i].classList.remove('select');
        if (arrList[i].indexOf(value.trim()) >= 0) {
            aFind.push(i);
        }
    }
    oFindTxt.value = '';
    if (!aFind.length) {
        alert("没有找到！");
        return;
    }
    console.log("查询结果索引为：" + aFind);
    for (let i = 0; i < aFind.length; i++) {
        oList.children[aFind[i]].classList.add('select');
    }
}


function addEvent(obj, sEv, func) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + sEv, function () {
            func.call(obj);
        });
    } else {
        obj.addEventListener(sEv, func);
    }
}

//init
(function () {
    console.log("---------begin------------");
    addEvent(oAddBtn, 'click', function (event) {
        var oEvent = event || window.event;
        addList(oAddTxt.value);
        oEvent.cancelBubble = true;
        oEvent.preventDefault();
    });
    addEvent(oFindBtn, 'click', function (event) {
        var oEvent = event || window.event;
        searchTxt(oFindTxt.value);
        oEvent.cancelBubble = true;
        oEvent.preventDefault();
    });
})();