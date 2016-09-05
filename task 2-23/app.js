/**
 * Created by San on 2016/8/22.
 */
'use strict';

var timer;
var list = [];
var SELECT_COLOR = 'red';
var DEFAULT_COLOR = 'white';
var TARGET_COLOR = 'orange';
var iTarget=null;//记录查找结果索引

function $(dom) {
    return document.querySelector(dom);
}
function log(str) {
    console.log(str);
}

function reset(parent) {
    var nodes = parent.querySelectorAll("div");
    clearInterval(timer);
    iTarget = null;
    list = [];
    changeBgColor(parent,DEFAULT_COLOR);
    for (let i = 0; i < nodes.length; i++) {
        changeBgColor(nodes[i],DEFAULT_COLOR);
        // nodes[i].style.backgroundColor = DEFAULT_COLOR;
    }
}

function changeBgColor(obj, color) {
    if(obj){
        obj.style.backgroundColor = color;
    }else{
        log("changeBgColor : obj not exist !!!");
    }
}


function changeBG() {
    var i = 0;
    changeBgColor(list[i], TARGET_COLOR);
    timer = setInterval(function () {
        i++;

        if(iTarget == i){
            changeBgColor(list[i-1], DEFAULT_COLOR);
            changeBgColor(list[i], SELECT_COLOR);
            clearInterval(timer);
            return;
        }
        if (i < list.length) {
            changeBgColor(list[i - 1], DEFAULT_COLOR);
            changeBgColor(list[i], TARGET_COLOR);
        }else{
            clearInterval(timer);
            changeBgColor(list[list.length - 1], DEFAULT_COLOR);
        }
    }, 300);


}

/**
 * 深度遍历
 * 问题：不能确定有几层，还有递归调用的栈溢出问题 todo
 * @param node
 * @returns {boolean}
 */
function deTraversal(node) {
    if (!node) {
        return false;
    }
    list.push(node);
    var next = null;
    if (node.children.length > 0) {
        next = node.firstElementChild;
    } else if (node.nextElementSibling) {
        next = node.nextElementSibling;
    } else if (node.parentElement.nextElementSibling) {
        next = node.parentElement.nextElementSibling;
    } else if (node.parentElement.parentElement.nextElementSibling) {
        next = node.parentElement.parentElement.nextElementSibling
    }
    deTraversal(next);
}

function deSearch(value,node) {
    if(!value){return false;}
    deTraversal(node);
    for(var i = 0 ;i<list.length;i++){
        var cur = list[i].innerHTML.match(/[\d\w]+/i);
        cur = String(cur).toLowerCase();
        value = value.trim().toLowerCase();
        if(cur === value){
            iTarget = i;
            log("找到了"+value+"在数组的第"+i+"项");
            break;
        }
    }
}

function scTraversal(node) {
    if (!node) {
        return false;
    }
    var next = null;
    var root = $("#root");
    list.push(node);
    if(node == root){
        next = firstChild(node);
    }
    else if(brotherNode(node)){
        next = brotherNode(node);
    }else if(node === node.parentElement.lastElementChild){
        node = node.parentElement;//赋值为父元素
        if(node === root){
            node = node.firstElementChild;
            next = firstChild(node);
        }
        else if(!brotherNode(node)){//往后没有兄弟元素
            node = node.firstElementChild;
            next = firstChild(node);
        }else if(brotherNode(node)){
            //父元素，有兄弟元素
            node = brotherNode(node);

            //node赋值给下一个有子元素的兄弟元素
            while(node){

                if(node.children.length >0){
                    next = firstChild(node);
                    break;
                }
                node = brotherNode(node);
            }

        }else{
            log("mistake!!!");
        }
    }
    scTraversal(next);
}
function parentNode(node) {
    if(node.parentElement){
        return node.parentElement;
    }else{
        return false;
    }
}
function brotherNode(node) {
    if(node.nextElementSibling){
        return node.nextElementSibling;
    }else{
        return false;
    }
}
function firstChild(node) {
    if(node.firstElementChild){
        return node.firstElementChild;
    }else{
        return false;
    }
}

(function () {
    var depthTraversal = $("#depthTraversal"),
        scopeTraversal = $("#scopeTraversal"),
        keySearch = $("#keySearch"),
        depthSearch = $("#depthSearch"),
        scopeSearch = $("#scopeSearch"),
        root = $("#root");

    EventUtil.addHandler(depthTraversal, 'click', function (event) {
        reset(root);
        deTraversal(root);
        changeBG();
        event = EventUtil.getEvent(event);
        event.stopPropagation();
    });
    EventUtil.addHandler(scopeTraversal, 'click', function (event) {
        reset(root);
        scTraversal(root);
        changeBG();
        event = EventUtil.getEvent(event);
        event.stopPropagation();
    });
    EventUtil.addHandler(depthSearch, 'click', function (event) {
        reset(root);
        deSearch(keySearch.value,root);
        changeBG();
        event = EventUtil.getEvent(event);
        event.stopPropagation();
    });

})();