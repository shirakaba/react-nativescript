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

const renderSectionHeader = ({section}) => (
    <RCTLabel style={styles.sectionHeader}>{section.title}</RCTLabel>
);

export class RNTesterExampleList extends React.Component<
    {
        onNavigate: () => void,
        list: {
            // ComponentExamples: RNTesterExample[],
            ComponentExamples: any[],
            // APIExamples: RNTesterExample[],
            APIExamples: any[],
        },
        style?: any,
        displayTitleRow?: boolean,
    },
    {}
>
{
    render(){
        const filter = ({example, filterRegex}) =>
        filterRegex.test(example.module.title)
        // && (!Platform.isTV || example.supportsTVOS);

        const sections = [
            {
                data: this.props.list.ComponentExamples,
                title: 'COMPONENTS',
                key: 'c',
            },
            {
                data: this.props.list.APIExamples,
                title: 'APIS',
                key: 'a',
            },
        ];

        return (
            <RCTContentView
                style={{
                    ...styles.listContainer,
                    ...this.props.style,
                }}
                >
                {this._renderTitleRow()}
                {/* TODO: RNTesterExampleFilter */}
            </RCTContentView>
        );
    }

    _itemShouldUpdate(curr, prev) {
        return curr.item !== prev.item;
    }

    _renderItem = ({item, separators}) => (
        <RowComponent
            item={item}
            onNavigate={this.props.onNavigate}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}
        />
    );

    _renderTitleRow(): React.ReactElement<any> {
        if(!this.props.displayTitleRow){
            return null;
        }
        return (
            <RowComponent
                item={{
                    module: {
                        title: 'RNTester',
                        description: 'React Native Examples',
                    },
                }}
                onNavigate={this.props.onNavigate}
                onPress={() => {
                    // this.props.onNavigate(RNTesterActions.ExampleList());
                }}
            />
        );
    }

    _handleRowPress(exampleKey: string): void {
        // this.props.onNavigate(RNTesterActions.ExampleAction(exampleKey));
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
        backgroundColor: new Color('#eeeeee'),
        padding: 5,
        // fontWeight: '500',
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