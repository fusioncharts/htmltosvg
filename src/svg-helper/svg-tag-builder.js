'use strict';

import {getBBox} from './svg-utils';
import svgStyleBuilder from './svg-style-builder';
import createBorder from './html-div-to-svg-rect';

function getNodeStyle(htmlNode) {
    return window.getComputedStyle(htmlNode);
}

export default {
    rect: function(htmlNode) {
        var bBox = getBBox(htmlNode),
            htmlStyleObj = getNodeStyle(htmlNode),
            retStr = '';

        var rectOutline = createBorder(bBox, htmlStyleObj);

        retStr += '<path d="' + rectOutline.rect + '" style="'+ svgStyleBuilder(htmlStyleObj, 'rect') +'"/>';

        rectOutline.borderLeft && (retStr += '<path d="' + rectOutline.borderLeft + '" style="'+ svgStyleBuilder(htmlStyleObj, 'rect-left-border') +'"/>');
        rectOutline.borderRight && (retStr += '<path d="' + rectOutline.borderRight + '" style="'+ svgStyleBuilder(htmlStyleObj, 'rect-right-border') +'"/>');
        rectOutline.borderTop && (retStr += '<path d="' + rectOutline.borderTop + '" style="'+ svgStyleBuilder(htmlStyleObj, 'rect-top-border') +'"/>');
        rectOutline.borderBottom && (retStr += '<path d="' + rectOutline.borderBottom + '" style="'+ svgStyleBuilder(htmlStyleObj, 'rect-bottom-border') +'"/>');

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
