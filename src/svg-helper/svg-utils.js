'use strict';

import Queue from '../algo-utils/queue';
import htmlToSvgHelper from './html-to-svg-helper';
var queue = new Queue();

function prepareNodeQueue(htmlNode, queue) {
    htmlNode.childNodes.forEach(function(element) {
        queue.enqueue(element);
        prepareNodeQueue(element, queue);
    });
    return queue;
}

function getBBox(htmlNode) {
    return htmlNode.getBoundingClientRect();
}

function createSvgString(htmlNode) {
    var bBox = getBBox(htmlNode);
    var retStr = '<svg xmlns="http://www.w3.org/2000/svg" height="'+bBox.height+'" width="'+bBox.width+'">';
    prepareNodeQueue(htmlNode, queue);
    while(true) {
        try {
            retStr += htmlToSvgHelper(queue.dequeue());
        } catch(e) {
            break;
        }
    }
    retStr += '</svg>';
    queue.reset();
    return retStr;
}

export {prepareNodeQueue, createSvgString, getBBox};
