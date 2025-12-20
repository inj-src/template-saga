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
import br from './br';
import li from './li';
import ol from './ol';
import paragraph from './paragraph';

export const nodes = [
   article, div, footer, header, section, col, colgroup,
   img, span, style, sub, sup, tbody, wbr,
   table, td, tr
]
export const NODE_NAMES = nodes.map((node) => node.name)
