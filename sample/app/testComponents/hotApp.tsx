// declare const module: any;
// if(module.hot) {
//     console.log(`module as any hot is true.`);
//     module.hot.accept(
//         ['./list', './layout'],
//         function() {
//             // Do something with the updated library module...
//         }
//     );
// }

import * as React from "react";
import { hot } from 'react-hot-loader';

import { DynamicListViewWithImages } from "./list";
import { DockLayoutTest } from './layout';

export default hot(module)(DockLayoutTest); /* */