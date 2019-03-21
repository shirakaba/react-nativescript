export interface ViewProps {
    // ...DirectEventProps,
    // ...GestureResponderEventProps,
    // ...TouchEventProps,
    // ...AndroidViewProps,
    // ...IOSViewProps,
  
    // There's no easy way to create a different type if (Platform.isTV):
    // so we must include TVViewProps
    // ...TVViewProps,
  
    // children?: React.Node,
    // style?: ViewStyleProp,
  
    /**
     * When `true`, indicates that the view is an accessibility element.
     * By default, all the touchable elements are accessible.
     *
     * See http://facebook.github.io/react-native/docs/view.html#accessible
     */
    accessible?: boolean,
  
    /**
     * Overrides the text that's read by the screen reader when the user interacts
     * with the element. By default, the label is constructed by traversing all
     * the children and accumulating all the `Text` nodes separated by space.
     *
     * See http://facebook.github.io/react-native/docs/view.html#accessibilitylabel
     */
    // accessibilityLabel?: Stringish,
  
    /**
     * An accessibility hint helps users understand what will happen when they perform
     * an action on the accessibility element when that result is not obvious from the
     * accessibility label.
     *
     *
     * See http://facebook.github.io/react-native/docs/view.html#accessibilityHint
     */
    // accessibilityHint?: Stringish,
  
    /**
     * Indicates to accessibility services to treat UI component like a specific role.
     */
    // accessibilityRole?: AccessibilityRole,
  
    /**
     * Indicates to accessibility services that UI Component is in a specific State.
     */
    // accessibilityStates?: AccessibilityStates,
  
    /**
     * Used to locate this view in end-to-end tests.
     *
     * > This disables the 'layout-only view removal' optimization for this view!
     *
     * See http://facebook.github.io/react-native/docs/view.html#testid
     */
    testID?: string,
  
    /**
     * Used to locate this view from native classes.
     *
     * > This disables the 'layout-only view removal' optimization for this view!
     *
     * See http://facebook.github.io/react-native/docs/view.html#nativeid
     */
    nativeID?: string,
  
    /**
     * This defines how far a touch event can start away from the view.
     * Typical interface guidelines recommend touch targets that are at least
     * 30 - 40 points/density-independent pixels.
     *
     * > The touch area never extends past the parent view bounds and the Z-index
     * > of sibling views always takes precedence if a touch hits two overlapping
     * > views.
     *
     * See http://facebook.github.io/react-native/docs/view.html#hitslop
     */
    // hitSlop?: EdgeInsetsProp,
  
    /**
     * Controls whether the `View` can be the target of touch events.
     *
     * See http://facebook.github.io/react-native/docs/view.html#pointerevents
     */
    pointerEvents?: ('auto' | 'box-none' | 'box-only' | 'none'),
  
    /**
     * This is a special performance property exposed by `RCTView` and is useful
     * for scrolling content when there are many subviews, most of which are
     * offscreen. For this property to be effective, it must be applied to a
     * view that contains many subviews that extend outside its bound. The
     * subviews must also have `overflow: hidden`, as should the containing view
     * (or one of its superviews).
     *
     * See http://facebook.github.io/react-native/docs/view.html#removeclippedsubviews
     */
    removeClippedSubviews?: boolean,
}