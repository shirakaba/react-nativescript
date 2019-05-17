/**
 * Code below here ported to React NativeScript from React Native's RNTester app, whose licence is stored in this folder as React_Native_LICENCE.txt:
 * https://github.com/facebook/react-native/blob/master/RNTester/js/RNTesterExampleList.js
 * ... which carries the following copyright:
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
    RCTButton,
    RCTContentView,
    RCTTextView,
    RCTTextField,
    RCTLabel,
    RCTImage,
    // StylePropContents,
    RCTDockLayout,
    RCTAbsoluteLayout,
    RCTStackLayout,
    RCTFlexboxLayout,
    RCTGridLayout,
    RCTListView,
    RCTActionBar,
    RCTTabView,
    RCTTabViewItem,
    RCTPage,
} from "react-nativescript/dist/index";
import { Color } from "tns-core-modules/color/color";

class RowComponent extends React.PureComponent<
    {
        item: {
            module: {
                title: string,
                description: string,
            }
        },
        onNavigate: () => void,
        onPress?: () => void,
        onShowUnderlay?: () => void,
        onHideUnderlay?: () => void,
    }
> {
    private readonly _onPress = () => {
        if (this.props.onPress) {
          this.props.onPress();
          return;
        }
        // this.props.onNavigate(RNSTesterActions.ExampleAction(this.props.item.key));
    };

    render() {
        const { item } = this.props;

        return (
            <RCTContentView
                style={styles.row}
                onTap={this._onPress}
            >
                <RCTLabel style={styles.rowTitleText}>{item.module.title}</RCTLabel>
                <RCTLabel style={styles.rowDetailText}>{item.module.description}</RCTLabel>
            </RCTContentView>
        )
    }
}

const styles = {
    listContainer: {
        flex: 1,
    },
    list: {
        backgroundColor: '#eeeeee',
    },
    sectionHeader: {
        backgroundColor: '#eeeeee',
        padding: 5,
        fontWeight: '500',
        fontSize: 11,
    },
    row: {
        backgroundColor: new Color('white'),
        justifyContent: 'center' as 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    separator: {
        // height: StyleSheet.hairlineWidth,
        backgroundColor: '#bbbbbb',
        marginLeft: 15,
    },
    separatorHighlighted: {
        // height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgb(217, 217, 217)',
    },
    sectionListContentContainer: {
        backgroundColor: 'white',
    },
    rowTitleText: {
        fontSize: 17,
        // fontWeight: 500, // FIXME
    },
    rowDetailText: {
        fontSize: 15,
        color: new Color('#888888'),
        lineHeight: 20,
    },
}