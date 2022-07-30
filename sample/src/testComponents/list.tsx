import * as React from "react";
import { Color, ItemEventData, ObservableArray } from "@nativescript/core";
import { ListView, CellViewContainer } from "react-nativescript";

export class ListViewTest extends React.Component<{}, {}> {
    render() {
        type Item = number;
        const items: Item[] = [...Array(200).keys()];

        /* There may be an argument for nesting the ListView within a LayoutBase once
         * dealing with the Safe Area (shall have to find out and see!). */
        return (
            <ListView
                _debug={{
                    logLevel: "info",
                    onCellFirstLoad: (container: CellViewContainer) => {
                        container.backgroundColor = "orange";
                    },
                    onCellRecycle: (container: CellViewContainer) => {
                        container.backgroundColor = "blue";
                    },
                }}
                height={{ unit: "%", value: 100 }}
                items={[...items.map((val: Item) => val)]}
                itemTemplateSelector={(item: Item, index: number, items: any): string => {
                    return index % 2 === 0 ? "even" : "odd";
                }}
                cellFactories={
                    new Map([
                        [
                            "odd",
                            {
                                placeholderItem: 1,
                                cellFactory: (item: Item) => {
                                    return <label fontSize={24}>{`ODD #${item}`}</label>;
                                },
                            },
                        ],
                        [
                            "even",
                            {
                                placeholderItem: 0,
                                cellFactory: (item: Item) => {
                                    return <textView fontSize={24}>{`EVEN #${item}`}</textView>;
                                },
                            },
                        ],
                    ])
                }
            />
        );
    }
}

/**
 * Code below here ported to React NativeScript from React Native's RNTester app:
 * https://github.com/microsoft/react-native/blob/master/RNTester/js/ListViewExample.js
 * ... which carries the following copyright:
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/** Used in accordance with React_Native_LICENSE.txt in the RNTester_Thumbnails folder. */
const THUMB_URLS: string[] = [
    "~/images/RNTester_Thumbnails/like.png",
    "~/images/RNTester_Thumbnails/dislike.png",
    "~/images/RNTester_Thumbnails/call.png",
    "~/images/RNTester_Thumbnails/fist.png",
    "~/images/RNTester_Thumbnails/bandaged.png",
    "~/images/RNTester_Thumbnails/flowers.png",
    "~/images/RNTester_Thumbnails/heart.png",
    "~/images/RNTester_Thumbnails/liking.png",
    "~/images/RNTester_Thumbnails/party.png",
    "~/images/RNTester_Thumbnails/poke.png",
    "~/images/RNTester_Thumbnails/superlike.png",
    "~/images/RNTester_Thumbnails/victory.png",
];

const LOREM_IPSUM: string =
    "Lorem ipsum dolor sit amet, ius ad pertinax oportere accommodare, an vix civibus corrumpit referrentur. Te nam case ludus inciderint, te mea facilisi adipiscing. Sea id integre luptatum. In tota sale consequuntur nec. Erat ocurreret mei ei. Eu paulo sapientem vulputate est, vel an accusam intellegam interesset. Nam eu stet pericula reprimique, ea vim illud modus, putant invidunt reprehendunt ne qui.";

function hashCode(str: string): number {
    let hash: number = 15;
    for (let ii = str.length - 1; ii >= 0; ii--) {
        hash = (hash << 5) - hash + str.charCodeAt(ii);
    }
    return hash;
}

type IndexToContentItem = {
    index: number;
    content: string;
};
export class DynamicListViewWithImages extends React.Component<{}, {}> {
    private readonly itemsToLoad: number = 100;

    /* Optimisation note: at list initialisation, Portals SHALL be rendered for each item in the starting list. */
    private readonly items: ObservableArray<IndexToContentItem> = new ObservableArray(
        [...Array(this.itemsToLoad).keys()].map((value: number) => ({
            index: value,
            content: value.toString(),
        }))
    );

    private loadMore: boolean = true;
    private loadMoreTimeout?: any;

    /* Making this no-op is sufficient to restore this to being a static list view. */
    private readonly onLoadMoreItems = (args: ItemEventData) => {
        if (!this.loadMore) {
            console.log(`[onLoadMoreItems] debouncing.`);
            return;
        }

        console.log(`[onLoadMoreItems] permitted.`);

        this.loadMoreTimeout = setTimeout(() => {
            const itemsToPush: IndexToContentItem[] = [];

            for (let i = this.items.length; i < +this.items.length + this.itemsToLoad; i++) {
                const lastValueIncremented: number = i;

                itemsToPush.push({
                    index: lastValueIncremented,
                    content: lastValueIncremented.toString(),
                });
            }

            this.items.push(...itemsToPush);
            this.loadMore = true;
        }, 750);
        /* Ample time for a (typical) scroll action's inertia to settle, to avoid list jumpiness. */

        this.loadMore = false;
    };

    componentWillUnmount() {
        if (this.loadMoreTimeout) clearTimeout(this.loadMoreTimeout);
    }

    private readonly styles = {
        row: {
            /* Tried with Flexbox, but it's far too non-compliant and doesn't function as expected. */
            // flexDirection: "row" as "row",
            // justifyContent: "center" as "center",

            padding: 10,
            backgroundColor: new Color("#F6F6F6"),
        },
        thumb: {
            width: { value: 64, unit: "px" as "px" },
            height: { value: 64, unit: "px" as "px" },
        },
        bigThumb: {
            width: { value: 64, unit: "px" as "px" },
            height: { value: 64, unit: "px" as "px" },
        },
        text: {
            flexGrow: 1,
        },
    };

    render() {
        return (
            <ListView
                _debug={{
                    logLevel: "info",
                    onCellFirstLoad: (container: CellViewContainer) => {},
                    onCellRecycle: (container: CellViewContainer) => {},
                }}
                height={{ unit: "%", value: 100 }}
                width={{ unit: "%", value: 100 }}
                items={this.items}
                onLoadMoreItems={this.onLoadMoreItems}
                /* If you only have one template, there's no advantage in setting up a templated list (it's actually wasteful: one extra reconciliation). */
                itemTemplateSelector={(item: IndexToContentItem, index: number, items: any): string => {
                    return index % 2 === 0 ? "even" : "odd";
                }}
                cellFactories={
                    new Map([
                        [
                            "even",
                            {
                                placeholderItem: {
                                    index: 1,
                                    content: "PLACEHOLDER",
                                },
                                cellFactory: (item: IndexToContentItem) => {
                                    const rowHash: number = Math.abs(hashCode(item.index.toString()));
                                    const imgSource: string = THUMB_URLS[rowHash % THUMB_URLS.length];

                                    return (
                                        <gridLayout rows={"*"} columns={"64 *"}>
                                            <image row={0} col={0} src={imgSource} style={this.styles.thumb} stretch={"aspectFill"} />
                                            <textView row={0} col={1} text={item.index.toString()} fontSize={12} paddingRight={8}>
                                                {`${item.index} - ${LOREM_IPSUM.substr(0, (rowHash % 301) + 10)}`}
                                            </textView>
                                        </gridLayout>
                                    );
                                },
                            },
                        ],
                        [
                            "odd",
                            {
                                placeholderItem: {
                                    index: 1,
                                    content: "PLACEHOLDER",
                                },
                                cellFactory: (item: IndexToContentItem) => {
                                    const rowHash: number = Math.abs(hashCode(item.index.toString()));
                                    const imgSource: string = THUMB_URLS[rowHash % THUMB_URLS.length];

                                    return (
                                        <gridLayout backgroundColor={new Color("yellow")} rows={"*"} columns={"* 64"}>
                                            <textView
                                                paddingLeft={8}
                                                row={0}
                                                col={0}
                                                // key={container._domId}
                                                text={item.index.toString()}
                                                fontSize={12}
                                            >
                                                {`${item.index} - ${LOREM_IPSUM.substr(0, (rowHash % 301) + 10)}`}
                                            </textView>
                                            <image row={0} col={1} src={imgSource} style={this.styles.bigThumb} stretch={"aspectFill"} />
                                        </gridLayout>
                                    );
                                },
                            },
                        ],
                    ])
                }
            />
        );
    }
}
