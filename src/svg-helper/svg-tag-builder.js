'use strict';

import {getBBox} from './svg-utils';
import svgStyleBuilder from './svg-style-builder';

export default {
    rect: function(htmlNode) {
        var bBox = getBBox(htmlNode);
        return '<rect x="'+ bBox.left +'" y="'+ bBox.top +'" width="'+ bBox.width +'" height="'+ bBox.height +
            '" style="'+ svgStyleBuilder(htmlNode, 'rect') +'"/>';
    },
    text: function(htmlNode) {
        var tempNode = htmlNode.ownerDocument.createElement('p-temp'),
            parent = htmlNode.parentNode,
            oldText = htmlNode.cloneNode(true);

        tempNode.appendChild(htmlNode.cloneNode(true));
        parent.replaceChild(tempNode, htmlNode);
        var bBox = getBBox(tempNode);
        parent.replaceChild(oldText, tempNode);
        return '<text x="'+ bBox.left +'" y="'+ bBox.bottom +'">'+ htmlNode.nodeValue +'</text>';
    }
};
