'use strict';

let cache = {};

function createBorderRadiusArr(styleObj, dimension) {
    var retArr = {};
    function radiusToPixelArr(styleObj, name) {
        let tempArr = styleObj[name].split(' ');
        tempArr[1] = tempArr[1] || tempArr[0];

        switch(name) {
        case 'borderBottomLeftRadius':
        case 'borderBottomRightRadius':
            tempArr[0] = Math.min(tempArr[0].match(/\%/) ? (dimension.bottom *
                (Number(tempArr[0].replace('%', ''))) / 100) : (Number(tempArr[0].replace('px', ''))),
                dimension.bottom/2);
            break;
        case 'borderTopLeftRadius':
        case 'borderTopRightRadius':
            tempArr[0] = Math.min(tempArr[0].match(/\%/) ? (dimension.top *
                (Number(tempArr[0].replace('%', ''))) / 100) : (Number(tempArr[0].replace('px', ''))),
                dimension.top/2);
            break;
        }

        switch(name) {
        case 'borderBottomLeftRadius':
        case 'borderTopLeftRadius':
            tempArr[1] = Math.min(tempArr[1].match(/\%/) ? (dimension.left *
                (Number(tempArr[1].replace('%', ''))) / 100) : (Number(tempArr[1].replace('px', ''))),
                dimension.left/2);
            break;
        case 'borderBottomRightRadius':
        case 'borderTopRightRadius':
            tempArr[1] = Math.min(tempArr[1].match(/\%/) ? (dimension.right *
                (Number(tempArr[1].replace('%', ''))) / 100) : (Number(tempArr[1].replace('px', ''))),
                dimension.right/2);
            break;
        }
        return tempArr;
    }
    ['borderBottomLeftRadius', 'borderBottomRightRadius', 'borderTopLeftRadius', 'borderTopRightRadius'].map(
        function(a) {
            retArr[a] = radiusToPixelArr(styleObj, a);
        }
    );
    return retArr;
}

function getCornerArcStr(r1, r2, x, y) {
    return 'A' + r1 + ' ' + r2 + ' 0 0 1 ' + x + ' ' + y;
}

function getBoxDetails(bBox, styleObj) {
    let boxDetails = {left: {}, right: {}, top: {}, bottom: {}},
        borderRightWidth = Number(styleObj.borderRightWidth.replace(/px/i, '')),
        borderTopWidth = Number(styleObj.borderTopWidth.replace(/px/i, '')),
        borderLeftWidth = Number(styleObj.borderLeftWidth.replace(/px/i, '')),
        borderBottomWidth = Number(styleObj.borderBottomWidth.replace(/px/i, '')),
        left = bBox.left + borderLeftWidth,
        right = bBox.right - borderRightWidth,
        top = bBox.top + borderTopWidth,
        bottom = bBox.bottom - borderBottomWidth,
        borderRadiusArr = createBorderRadiusArr(styleObj, {
            left: bottom - top,
            right: bottom - top,
            top: right - left,
            bottom: right - left
        }),
        borderTopLeftRadius = borderRadiusArr['borderTopLeftRadius'],
        borderTopRightRadius = borderRadiusArr['borderTopRightRadius'],
        borderBottomLeftRadius = borderRadiusArr['borderBottomLeftRadius'],
        borderBottomRightRadius = borderRadiusArr['borderBottomRightRadius'];

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
        if(boxDetails.top.start.radius[1] || boxDetails.top.start.radius[0]) {
            cornerPath += getCornerArcStr(boxDetails.top.start.radius[1], boxDetails.top.start.radius[0],
                boxDetails.top.start.x, boxDetails.top.start.y);
        }
        break;
    case 'topRightCorner':
        if(boxDetails.right.start.radius[0] || boxDetails.right.start.radius[1]) {
            cornerPath += getCornerArcStr(boxDetails.right.start.radius[0], boxDetails.right.start.radius[1],
                boxDetails.right.start.x, boxDetails.right.start.y);
        }
        break;
    case 'bottomLeftCorner':
        if(boxDetails.left.start.radius[0] || boxDetails.left.start.radius[1]) {
            cornerPath += getCornerArcStr(boxDetails.left.start.radius[0], boxDetails.left.start.radius[1],
                boxDetails.left.start.x, boxDetails.left.start.y);
        }
        break;
    case 'bottomRightCorner':
        if(boxDetails.bottom.start.radius[1] || boxDetails.bottom.start.radius[0]) {
            cornerPath += getCornerArcStr(boxDetails.bottom.start.radius[1], boxDetails.bottom.start.radius[0],
                boxDetails.bottom.start.x, boxDetails.bottom.start.y);
        }
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
            if(topRightCorner) {
                path += topRightCorner;
                path += 'L' + (boxDetails.right.start.x + borderRightWidth) + ' ' + boxDetails.right.start.y;
                path += 'A' + (boxDetails.top.end.radius[0] + borderTopWidth) + ' ' +
                    (boxDetails.top.end.radius[1] + borderRightWidth) +
                    ' 0 0 0 ' + (boxDetails.top.end.x) + ' ' + (boxDetails.top.end.y - borderTopWidth);
            }
            path += 'L' + (boxDetails.top.end.x + (topRightCorner ? 0 : borderRightWidth)) + ' ' +
                (boxDetails.top.end.y - borderTopWidth);
            path += 'L' + (boxDetails.top.start.x - (topLeftCorner ? 0 : borderLeftWidth)) + ' ' +
                (boxDetails.top.start.y - borderTopWidth);
            if(topLeftCorner) {
                path += 'A' + (boxDetails.top.start.radius[1] + borderLeftWidth) + ' ' +
                    (boxDetails.top.start.radius[0] + borderTopWidth) +
                    ' 0 0 0 ' + (boxDetails.left.end.x - borderLeftWidth) + ' ' + boxDetails.left.end.y;
            }
            path += 'Z';
        }
        break;
    case 'right':
        if(borderRightWidth) {
            path += 'M' +  boxDetails.top.end.x + ' ' + boxDetails.top.end.y;
            path += topRightCorner;
            path += 'L' + boxDetails.right.end.x + ' ' + boxDetails.right.end.y;
            if(bottomRightCorner) {
                path += bottomRightCorner;
                path += 'L' + boxDetails.bottom.start.x + ' ' + (boxDetails.bottom.start.y + borderBottomWidth);
                path += 'A' + (boxDetails.right.end.radius[1] + borderBottomWidth) + ' ' +
                    (boxDetails.right.end.radius[0] + borderRightWidth) +
                    ' 0 0 0 ' + (boxDetails.right.end.x + borderRightWidth) + ' ' + (boxDetails.right.end.y);
            }
            path += 'L' + (boxDetails.right.end.x + borderRightWidth) + ' ' +
                (boxDetails.right.end.y + (bottomRightCorner ? 0 : borderBottomWidth));
            path += 'L' + (boxDetails.right.start.x + borderRightWidth) + ' ' +
                (boxDetails.right.start.y - (topRightCorner ? 0 : borderTopWidth));
            if(topRightCorner) {
                path += 'A' + (boxDetails.right.start.radius[0] + borderTopWidth) + ' ' +
                    (boxDetails.right.start.radius[1] + borderRightWidth) +
                    ' 0 0 0 ' + boxDetails.top.end.x + ' ' + (boxDetails.top.end.y - borderTopWidth);
            }
            path += 'Z';
        }
        break;
    case 'bottom':
        if(borderBottomWidth) {
            path += 'M' +  boxDetails.right.end.x + ' ' + boxDetails.right.end.y;
            path += bottomRightCorner;
            path += 'L' + boxDetails.bottom.end.x + ' ' + boxDetails.bottom.end.y;
            if(bottomLeftCorner) {
                path += bottomLeftCorner;
                path += 'L' + (boxDetails.left.start.x - borderLeftWidth) + ' ' + boxDetails.left.start.y;
                path += 'A' + (boxDetails.bottom.end.radius[0] + borderBottomWidth) + ' ' +
                    (boxDetails.bottom.end.radius[1] + borderLeftWidth) +
                    ' 0 0 0 ' + (boxDetails.bottom.end.x) + ' ' + (boxDetails.bottom.end.y + borderBottomWidth);
            }
            path += 'L' + (boxDetails.bottom.end.x - (bottomLeftCorner ? 0 : borderLeftWidth)) + ' ' +
                (boxDetails.bottom.end.y + borderBottomWidth);
            path += 'L' + (boxDetails.bottom.start.x + (bottomRightCorner ? 0 : borderRightWidth)) + ' ' +
                (boxDetails.bottom.start.y + borderBottomWidth);
            if(bottomRightCorner) {
                path += 'A' + (boxDetails.bottom.start.radius[1] + borderRightWidth) + ' ' +
                    (boxDetails.bottom.start.radius[0] + borderBottomWidth) +
                    ' 0 0 0 ' + (boxDetails.right.end.x + borderRightWidth) + ' ' + boxDetails.right.end.y;
            }
            path += 'Z';
        }
        break;
    case 'left':
        if(borderLeftWidth) {
            path += 'M' +  boxDetails.bottom.end.x + ' ' + boxDetails.bottom.end.y;
            path += bottomLeftCorner;
            path += 'L' + boxDetails.left.end.x + ' ' + boxDetails.left.end.y;
            if(topLeftCorner) {
                path += topLeftCorner;
                path += 'L' + boxDetails.top.start.x + ' ' + (boxDetails.top.start.y - borderTopWidth);
                path += 'A' + (boxDetails.left.end.radius[1] + borderLeftWidth) + ' ' +
                    (boxDetails.left.end.radius[0] + borderTopWidth) +
                    ' 0 0 0 ' + (boxDetails.left.end.x - borderLeftWidth) + ' ' + (boxDetails.left.end.y);
            }
            path += 'L' + (boxDetails.left.end.x - borderLeftWidth) + ' ' +
                (boxDetails.left.end.y - (topLeftCorner ? 0 : borderTopWidth));
            path += 'L' + (boxDetails.left.start.x - borderLeftWidth) + ' ' +
                (boxDetails.left.start.y + (bottomLeftCorner ? 0 : borderBottomWidth));
            if(bottomLeftCorner) {
                path += 'A' + (boxDetails.left.start.radius[0] + borderBottomWidth) + ' ' +
                    (boxDetails.left.start.radius[1] + borderLeftWidth) +
                    ' 0 0 0 ' + boxDetails.bottom.end.x + ' ' + (boxDetails.bottom.end.y + borderBottomWidth);
            }
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
