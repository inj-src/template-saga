import article from './article';
import div from './div';
import footer from './footer';
import header from './header';
import section from './section';
import col from './col';
import colgroup from './colgroup';
import img from './img';
import span from './span';
import style from './style';
import sub from './sub';
import sup from './sup';
import table from './table';
import td from './td';
import tr from './tr';
import tbody from './tbody';
import wbr from './wbr';

import svg from './svg';
import g from './g';
import foreignObject from './foreignObject';
import path from './path';

export const nodes = [
   article, div, footer, header, section, col, colgroup,
   img, span, style, sub, sup, tbody, wbr,
   table, td, tr,
   svg, g, foreignObject, path
]
export const NODE_NAMES = nodes.map((node) => node.name)
