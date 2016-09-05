/**
 * Created by San on 2016/8/17.
 */
"use strict";

/**
 * 事件处理工具
 * @type {{addHandler: EventUtil.addHandler, removeHandler: EventUtil.removeHandler, getEvent: EventUtil.getEvent, getTarget: EventUtil.getTarget, preventDefault: EventUtil.preventDefault, stopPropagation: EventUtil.stopPropagation}}
 */
var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);//false 事件冒泡时执行
        } else if (element.attachEvent) {
            element.attachEvent('on'+type,function () {
                handler.call(element);//修改this指向
            });
            // element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
            /*element.detachEvent('on'+type,function () {
                handler.call(element);
            });*/
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function(event) {
        return event ? event : window.event;
    },
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};