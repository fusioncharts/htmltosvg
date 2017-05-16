'use strict';

var styleRules = {
    rect: {
        backgroundColor: 'fill'
    }
};

function getNodeStyle(htmlNode) {
    return window.getComputedStyle(htmlNode);
}

export default function(htmlNode, type) {
    var stl = getNodeStyle(htmlNode),
        rulesUsed = styleRules[type],
        retStr = '';

    for(var key in rulesUsed) {
        retStr += rulesUsed[key] + ': ' + stl[key] + ';';
    }
    return retStr;
}
