'use strict';

import {getHtmlNode} from '../html-helper/add-html';
import {createSvgString} from '../svg-helper/svg-utils';

function getSvg() {
    var htmlNode = getHtmlNode();
    return createSvgString(htmlNode);
}

export {getSvg};
