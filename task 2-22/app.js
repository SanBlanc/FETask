'use strict';
var list =[];
var timer;
function $(dom) {
    return document.querySelector(dom);
}
function log(str) {
    console.log(str);
}
function preOrder(node) {
    if(!node) { return; }
    list.push(node);
    preOrder(node.firstElementChild);
    preOrder(node.lastElementChild);

}
function inOrder(node) {
    if(!node){return;}
    inOrder(node.firstElementChild);
    list.push(node);
    inOrder(node.lastElementChild);

}
function ptOrder(node) {
    if(!node){return;}
    ptOrder(node.firstElementChild);
    ptOrder(node.lastElementChild);
    list.push(node);
}
function changeColor() {
    log('--------changeColor-----------');
    var index = 0;
    list[index].style.backgroundColor = 'navy';
    timer = setInterval(function () {
        index++;
        if(index < list.length){
            list[index-1].style.backgroundColor = '#fff';
            list[index].style.backgroundColor = 'navy';
        }else{
            clearInterval(timer);
            list[list.length - 1].style.backgroundColor = '#fff';
        }
    },500);
}

function resetStyle(parent) {
    log('----------resetStyle--------------');
    list = [];
    clearInterval(timer);
    var nodelist = parent.querySelectorAll("div");
    for(let i = 0; i<nodelist.length ;i++){
        nodelist[i].style.backgroundColor = '#fff';
    }
}

function init() {
    log('------------init----------');
    var oRoot = $("#nodeTree"),
        preOrderBtn = $('#preOrderBtn'),
        inOrderBtn = $('#inOrderBtn'),
        ptOrderBtn = $('#ptOrderBtn');

    //前序
    EventUtil.addHandler(preOrderBtn,'click',function (event) {
        resetStyle(oRoot);
        preOrder(oRoot);
        changeColor();
        event = EventUtil.getEvent(event);
        event.stopPropagation();
    });
    //中序
    EventUtil.addHandler(inOrderBtn,'click',function (event) {
        resetStyle(oRoot);
        inOrder(oRoot);
        changeColor();
        event = EventUtil.getEvent(event);
        event.stopPropagation();
    });
    //后序
    EventUtil.addHandler(ptOrderBtn,'click',function (event) {
        resetStyle(oRoot);
        ptOrder(oRoot);
        changeColor();
        event = EventUtil.getEvent(event);
        event.stopPropagation();
    });


}
init();