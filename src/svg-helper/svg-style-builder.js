'use strict';

var styleRules = {
    rect: {
        fill: 'backgroundColor'
    },
    'rect-left-border': {
        'stroke-width': function() { return 0; },
        'fill': 'borderLeftColor'
    },
    'rect-top-border': {
        'stroke-width': function() { return 0; },
        'fill': 'borderTopColor'
    },
    'rect-right-border': {
        'stroke-width': function() { return 0; },
        'fill': 'borderRightColor'
    },
    'rect-bottom-border': {
        'stroke-width': function() { return 0; },
        'fill': 'borderBottomColor'
    }

};

export default function(stl, type) {
    var rulesUsed = styleRules[type] || {},
        retStr = '';
    for(var key in rulesUsed) {
        retStr += key + ' : ' + (typeof rulesUsed[key] === 'function' ? rulesUsed[key]() :
            stl[rulesUsed[key]]) + ';';
    }
    return retStr;
}
