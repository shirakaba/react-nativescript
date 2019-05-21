if((module as any).hot) {
    console.log(`module as any hot is true.`);
    (module as any).hot.accept(
        ['./list', './layout'],
        function() {
            // Do something with the updated library module...
        }
    );
}

import { hot } from 'react-hot-loader';
import * as React from "react";

import { DynamicListViewWithImages } from "./list";
import { DockLayoutTest } from './layout';

export default hot(module)(DockLayoutTest); /* */