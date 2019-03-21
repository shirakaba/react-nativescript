import React, { Component } from 'react';

/**
 * Whether the current element is the descendant of a <Text> element.
 */
/* $FlowFixMe(>=0.85.0 site=react_native_fb) This comment suppresses an error
 * found when Flow v0.85 was deployed. To see the error, delete this comment
 * and run Flow. */

export const TextAncestor: React.Context<boolean> = React.createContext(false);
export const TextAncestorConsumer = TextAncestor.Consumer;
export default TextAncestor;

// module.exports = React.createContext(false);