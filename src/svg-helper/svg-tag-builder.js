'use strict';

import {getBBox} from './svg-utils';
import svgStyleBuilder from './svg-style-builder';

export default {
    rect: function(htmlNode) {
        var bBox = getBBox(htmlNode);
        return '<rect x="'+ bBox.left +'" y="'+ bBox.top +'" width="'+ bBox.width +'" height="'+ bBox.height +
            '" style="'+ svgStyleBuilder(htmlNode, 'rect') +'"/>';
    }
};
