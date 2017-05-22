'use strict';

var styleRules = {
    rect: {
        backgroundColor: 'fill'
    }
};

export default function(stl, type) {
    var rulesUsed = styleRules[type] || {},
        retStr = '';

    for(var key in rulesUsed) {
        retStr += rulesUsed[key] + ': ' + stl[key] + ';';
    }
    return retStr;
}
