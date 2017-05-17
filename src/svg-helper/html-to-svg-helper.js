'use strict';

import svgTagBuilder from './svg-tag-builder';

export default function(htmlNode) {
    var retStr = '';
    switch(htmlNode.nodeName) {
    case 'DIV':
        retStr = svgTagBuilder.rect(htmlNode);
        break;
    case '#text':
        retStr = svgTagBuilder.text(htmlNode);
        break;
    default:
        retStr = '';
    }

    return retStr;
}
