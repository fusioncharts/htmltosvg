'use strict';

import svgTagBuilder from './svg-tag-builder';

export default function(htmlNode) {
    var retStr = '';
    switch(htmlNode.tagName) {
    case 'DIV':
        retStr = svgTagBuilder.rect(htmlNode);
        break;
    default:
        retStr = '';
    }

    return retStr;
}
