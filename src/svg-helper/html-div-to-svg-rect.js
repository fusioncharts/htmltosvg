'use strict';

let cache = {};

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

function getCornerArcStr(r1, r2, x, y) {
    return 'A' + r1 + ' ' + r2 + ' 0 0 1 ' + x + ' ' + y;
}

function getBoxDetails(bBox, styleObj) {
    let boxDetails = {left: {}, right: {}, top: {}, bottom: {}},
        borderRadiusArr = createBorderRadiusArr(styleObj),
        borderTopLeftRadius = borderRadiusArr['borderTopLeftRadius'],
        borderTopRightRadius = borderRadiusArr['borderTopRightRadius'],
        borderBottomLeftRadius = borderRadiusArr['borderBottomLeftRadius'],
        borderBottomRightRadius = borderRadiusArr['borderBottomRightRadius'],
        borderRightWidth = Number(styleObj.borderRightWidth.replace(/px/i, '')),
        borderTopWidth = Number(styleObj.borderTopWidth.replace(/px/i, '')),
        borderLeftWidth = Number(styleObj.borderLeftWidth.replace(/px/i, '')),
        borderBottomWidth = Number(styleObj.borderBottomWidth.replace(/px/i, '')),
        left = bBox.left + borderLeftWidth,
        right = bBox.right - borderRightWidth,
        top = bBox.top + borderTopWidth,
        bottom = bBox.bottom - borderBottomWidth;

    boxDetails.radius = {
        right: borderRightWidth,
        top: borderTopWidth,
        left: borderLeftWidth,
        bottom: borderBottomWidth
    };

    boxDetails.left.start = {
        x: left,
        y: bottom - borderBottomLeftRadius[1],
        radius: [borderBottomLeftRadius[0], borderBottomLeftRadius[1]]
    };
    boxDetails.left.end = {
        x: left,
        y: top + borderTopLeftRadius[1],
        radius: [borderTopLeftRadius[1], borderTopLeftRadius[0]]
    };
    boxDetails.top.start = {
        x: left + borderTopLeftRadius[0],
        y: top,
        radius: [borderTopLeftRadius[1], borderTopLeftRadius[0]]
    };
    boxDetails.top.end = {
        x: right - borderTopRightRadius[0],
        y: top,
        radius: [borderTopRightRadius[0], borderTopRightRadius[1]]
    };
    boxDetails.right.start = {
        x: right,
        y: top + borderTopRightRadius[1],
        radius: [borderTopRightRadius[0], borderTopRightRadius[1]]
    };
    boxDetails.right.end = {
        x: right,
        y: bottom - borderBottomRightRadius[1],
        radius: [borderBottomRightRadius[1], borderBottomRightRadius[0]]
    };
    boxDetails.bottom.start = {
        x: right - borderBottomRightRadius[0],
        y: bottom,
        radius: [borderBottomRightRadius[1], borderBottomRightRadius[0]]
    };
    boxDetails.bottom.end = {
        x: left + borderBottomLeftRadius[0],
        y: bottom,
        radius: [borderBottomLeftRadius[0], borderBottomLeftRadius[1]]
    };
    return boxDetails;
}

function getCornerPath(boxDetails, name) {
    if(cache[name] !== undefined) {
        return cache[name];
    }
    let cornerPath = '';
    switch(name) {
    case 'topLeftCorner':
        cornerPath += getCornerArcStr(boxDetails.top.start.radius[1], boxDetails.top.start.radius[0],
            boxDetails.top.start.x, boxDetails.top.start.y);
        break;
    case 'topRightCorner':
        cornerPath += getCornerArcStr(boxDetails.right.start.radius[0], boxDetails.right.start.radius[1],
            boxDetails.right.start.x, boxDetails.right.start.y);
        break;
    case 'bottomLeftCorner':
        cornerPath += getCornerArcStr(boxDetails.left.start.radius[0], boxDetails.left.start.radius[1],
            boxDetails.left.start.x, boxDetails.left.start.y);
        break;
    case 'bottomRightCorner':
        cornerPath += getCornerArcStr(boxDetails.bottom.start.radius[1], boxDetails.bottom.start.radius[0],
            boxDetails.bottom.start.x, boxDetails.bottom.start.y);
        break;
    }
    return cache[name] = cornerPath;
}

function gerRectPath(boxDetails) {
    let retPathStr = '',
        topLeftCorner = getCornerPath(boxDetails, 'topLeftCorner'),
        topRightCorner = getCornerPath(boxDetails, 'topRightCorner'),
        bottomLeftCorner = getCornerPath(boxDetails, 'bottomLeftCorner'),
        bottomRightCorner = getCornerPath(boxDetails, 'bottomRightCorner');

    retPathStr += 'M' + boxDetails.top.start.x + ' ' + boxDetails.top.start.y + ' L ' +
        boxDetails.top.end.x + ' ' + boxDetails.top.end.y;
    retPathStr += topRightCorner;
    retPathStr += 'L' + boxDetails.right.end.x + ' ' + boxDetails.right.end.y;
    retPathStr += bottomRightCorner;
    retPathStr += 'L' + boxDetails.bottom.end.x + ' ' + boxDetails.bottom.end.y;
    retPathStr += bottomLeftCorner;
    retPathStr += 'L' + boxDetails.left.end.x + ' ' + boxDetails.left.end.y;
    retPathStr += topLeftCorner;
    return retPathStr;
}

function getBorderPath(boxDetails, name) {
    let path = '',
        topLeftCorner = getCornerPath(boxDetails, 'topLeftCorner'),
        topRightCorner = getCornerPath(boxDetails, 'topRightCorner'),
        bottomLeftCorner = getCornerPath(boxDetails, 'bottomLeftCorner'),
        bottomRightCorner = getCornerPath(boxDetails, 'bottomRightCorner'),
        borderRightWidth = boxDetails.radius.right,
        borderTopWidth = boxDetails.radius.top,
        borderLeftWidth = boxDetails.radius.left,
        borderBottomWidth = boxDetails.radius.bottom;

    switch(name) {
    case 'top':
        if(borderTopWidth) {
            path += 'M' +  boxDetails.left.end.x + ' ' + boxDetails.left.end.y;
            path += topLeftCorner;
            path += 'L' + boxDetails.top.end.x + ' ' + boxDetails.top.end.y;
            path += topRightCorner;
            path += 'A' + boxDetails.top.end.radius[0] + ' ' + boxDetails.top.end.radius[1] +
                ' 0 0 0 ' + (boxDetails.top.end.x + borderRightWidth) + ' ' + (boxDetails.top.end.y - borderTopWidth);
            path += 'L' + (boxDetails.top.end.x + borderRightWidth) + ' ' +
                (boxDetails.top.end.y - borderTopWidth);
            path += 'L' + (boxDetails.top.start.x - borderLeftWidth) + ' ' +
                (boxDetails.top.start.y - borderTopWidth);
            path += 'A' + boxDetails.top.start.radius[1] + ' ' + boxDetails.top.start.radius[0] +
                ' 0 0 0 ' + boxDetails.left.end.x + ' ' + boxDetails.left.end.y;
            path += 'Z';
        }
        break;
    case 'right':
        if(borderRightWidth) {
            path += 'M' +  boxDetails.top.end.x + ' ' + boxDetails.top.end.y;
            path += topRightCorner;
            path += 'L' + boxDetails.right.end.x + ' ' + boxDetails.right.end.y;
            path += bottomRightCorner;
            path += 'A' + boxDetails.right.end.radius[1] + ' ' + boxDetails.right.end.radius[0] +
                ' 0 0 0 ' + (boxDetails.right.end.x + borderRightWidth) + ' ' + (boxDetails.right.end.y + borderBottomWidth);
            path += 'L' + (boxDetails.right.end.x + borderRightWidth) + ' ' +
                (boxDetails.right.end.y + borderBottomWidth);
            path += 'L' + (boxDetails.right.start.x + borderRightWidth) + ' ' +
                (boxDetails.right.start.y - borderTopWidth);
            path += 'A' + boxDetails.right.start.radius[0] + ' ' + boxDetails.right.start.radius[1] +
                ' 0 0 0 ' + boxDetails.top.end.x + ' ' + boxDetails.top.end.y;
            path += 'Z';
        }
        break;
    case 'bottom':
        if(borderBottomWidth) {
            path += 'M' +  boxDetails.right.end.x + ' ' + boxDetails.right.end.y;
            path += bottomRightCorner;
            path += 'L' + boxDetails.bottom.end.x + ' ' + boxDetails.bottom.end.y;
            path += bottomLeftCorner;
            path += 'A' + boxDetails.bottom.end.radius[0] + ' ' + boxDetails.bottom.end.radius[1] +
                ' 0 0 0 ' + (boxDetails.bottom.end.x - borderLeftWidth) + ' ' + (boxDetails.bottom.end.y + borderBottomWidth);
            path += 'L' + (boxDetails.bottom.end.x - borderLeftWidth) + ' ' +
                (boxDetails.bottom.end.y + borderBottomWidth);
            path += 'L' + (boxDetails.bottom.start.x + borderRightWidth) + ' ' +
                (boxDetails.bottom.start.y + borderBottomWidth);
            path += 'A' + boxDetails.bottom.start.radius[1] + ' ' + boxDetails.bottom.start.radius[0] +
                ' 0 0 0 ' + boxDetails.right.end.x + ' ' + boxDetails.right.end.y;
            path += 'Z';
        }
        break;
    case 'left':
        if(borderLeftWidth) {
            path += 'M' +  boxDetails.bottom.end.x + ' ' + boxDetails.bottom.end.y;
            path += bottomLeftCorner;
            path += 'L' + boxDetails.left.end.x + ' ' + boxDetails.left.end.y;
            path += topLeftCorner;
            path += 'A' + boxDetails.left.end.radius[1] + ' ' + boxDetails.left.end.radius[0] +
                ' 0 0 0 ' + (boxDetails.left.end.x - borderLeftWidth) + ' ' + (boxDetails.left.end.y - borderTopWidth);
            path += 'L' + (boxDetails.left.end.x - borderLeftWidth) + ' ' +
                (boxDetails.left.end.y - borderTopWidth);
            path += 'L' + (boxDetails.left.start.x - borderLeftWidth) + ' ' +
                (boxDetails.left.start.y + borderBottomWidth);
            path += 'A' + boxDetails.left.end.radius[0] + ' ' + boxDetails.left.end.radius[1] +
                ' 0 0 0 ' + boxDetails.bottom.end.x + ' ' + boxDetails.bottom.end.y;
            path += 'Z';
        }
        break;
    }
    return path;
}

function createBorder(bBox, styleObj) {
    let retObj = {},
        boxDetails = getBoxDetails(bBox, styleObj);

    retObj.rect = gerRectPath(boxDetails);
    retObj.borderTop = getBorderPath(boxDetails, 'top', styleObj);
    retObj.borderRight = getBorderPath(boxDetails, 'right', styleObj);
    retObj.borderBottom = getBorderPath(boxDetails, 'bottom', styleObj);
    retObj.borderLeft = getBorderPath(boxDetails, 'left', styleObj);

    cache = {};
    return retObj;
}

export default createBorder;
