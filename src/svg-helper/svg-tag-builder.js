'use strict';

import {getBBox} from './svg-utils';
import svgStyleBuilder from './svg-style-builder';

function getNodeStyle(htmlNode) {
    return window.getComputedStyle(htmlNode);
}

function createBorderRadiusArr(styleObj) {
    var retArr = {};
    ['borderBottomLeftRadius', 'borderBottomRightRadius', 'borderTopLeftRadius', 'borderTopRightRadius'].map(
        function(a) {
            var tempArr = styleObj[a].split(' ');
            retArr[a] = [];
            retArr[a].push(Number(tempArr[0].replace('px', '')));
            retArr[a].push(Number((tempArr[1] || tempArr[0]).replace('px', '')));
        }
    );
    return retArr;
}

function createBorder(bBox, styleObj) {
    let borderRadiusArr = createBorderRadiusArr(styleObj),
        top,
        right,
        left,
        bottom;

    top = 'M' + (bBox.left + borderRadiusArr['borderTopLeftRadius'][0]) + ' ' + bBox.top + 'L' +
        (bBox.right - borderRadiusArr['borderTopRightRadius'][0]) + ' ' + bBox.top+ 'A' +
        borderRadiusArr['borderTopRightRadius'][0] + ' ' + borderRadiusArr['borderTopRightRadius'][1] + ' 0 0 1 ' +
        bBox.right + ' ' + (bBox.top + borderRadiusArr['borderTopRightRadius'][1]);
    right = 'L' + bBox.right + ' ' + (bBox.bottom - borderRadiusArr['borderBottomRightRadius'][1]) + 'A' +
        borderRadiusArr['borderBottomRightRadius'][0] + ' ' + borderRadiusArr['borderBottomRightRadius'][1] + ' 0 0 1 ' +
        (bBox.right - borderRadiusArr['borderBottomRightRadius'][0]) + ' ' + bBox.bottom;
    bottom = 'L' + (bBox.left + borderRadiusArr['borderBottomLeftRadius'][0]) + ' ' + bBox.bottom + 'A' +
        borderRadiusArr['borderBottomLeftRadius'][0] + ' ' + borderRadiusArr['borderBottomLeftRadius'][1] + ' 0 0 1 ' +
        bBox.left + ' ' + (bBox.bottom - borderRadiusArr['borderBottomLeftRadius'][1]);
    left = 'L' + bBox.left + ' ' + (bBox.top + borderRadiusArr['borderTopLeftRadius'][1]) + 'A' +
        borderRadiusArr['borderTopLeftRadius'][0] + ' ' + borderRadiusArr['borderTopLeftRadius'][1] + ' 0 0 1 ' +
        (bBox.left + borderRadiusArr['borderTopLeftRadius'][0]) + ' ' + bBox.top;

    return {
        top: top,
        right: right,
        bottom: bottom,
        left: left
    };
}

export default {
    rect: function(htmlNode) {
        var bBox = getBBox(htmlNode),
            htmlStyleObj = getNodeStyle(htmlNode),
            retStr = '';

        var rectOutline = createBorder(bBox, htmlStyleObj);

        retStr += '<path d="' + rectOutline.top + rectOutline.right + rectOutline.bottom + rectOutline.left + 'Z' +
            '" style="'+ svgStyleBuilder(htmlStyleObj, 'rect') +'"/>';

        return retStr;
    },
    text: function(htmlNode) {
        var tempNode = htmlNode.ownerDocument.createElement('p-temp'),
            parent = htmlNode.parentNode,
            htmlStyleObj = getNodeStyle(parent),
            oldText = htmlNode.cloneNode(true);

        tempNode.appendChild(htmlNode.cloneNode(true));
        parent.replaceChild(tempNode, htmlNode);
        var bBox = getBBox(tempNode);
        parent.replaceChild(oldText, tempNode);
        return '<text x="'+ bBox.left +'" y="'+ bBox.bottom +
            '" style="'+ svgStyleBuilder(htmlStyleObj, 'text') +'">'+ htmlNode.nodeValue +'</text>';
    }
};
