'use strict';

var htmlNode;

function addHtmlNode (_node) {
    htmlNode = _node;
}

function getHtmlNode () {
    return htmlNode;
}

export {addHtmlNode, getHtmlNode};
