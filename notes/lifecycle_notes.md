# TabView test

## Sync render pattern

Assumes `ReactNativeScript.render()` to be sync, and that `rootRef` becomes populated as part of the work.

```ts
run({
    create: () => {
        ReactNativeScript.render(
            React.createElement(AppContainer, { forwardedRef: rootRef }, null),
            null,
            () => {
                console.log(`Root tree rendered! rootRef.current: ${rootRef.current}`); // 7 (non-null)
            },
            "__APP_ROOT__",
        );

        console.log(`run.create() with rootRef.current: ${rootRef.current}`);
        return rootRef.current;
    }
})
```

## Async render pattern

Assumes `ReactNativeScript.render()` to be async, and only expects `rootRef` to become populated upon the render callback.

```ts
ReactNativeScript.render(
    React.createElement(AppContainer, { forwardedRef: rootRef }, null),
    null,
    () => {
        console.log(`Root tree rendered! rootRef.current: ${rootRef.current}`); // 7 (non-null)
        run({
            create: () => {
                console.log(`run.create() with rootRef.current: ${rootRef.current}`);
                return rootRef.current;
            },
        });
    },
    "__APP_ROOT__",
);
```

## Behaviour

In both cases:

1. render() is called on the class component owning the base of the tree: AppContainer; `rootRef` not yet populated
2. render() is called on its first child, a class-component: Tab One; neither `rootRef` nor `selfRef` yet populated
3. render() is called on its second child, a class-component: Tab Two; neither `rootRef` nor `selfRef` yet populated
4. componentDidMount() called on Tab One; `selfRef` becomes populated
5. componentDidMount() called on Tab Two; `selfRef` becomes populated
6. componentDidMount() called on AppContainer; `rootRef` becomes populated
7. Top-level render() callback

# Frame to Page test

Setup:

* we assume `ReactNativeScript.render()` to be sync in `run.create()` (and it does appear to be so – the render work begins; the render callback returns after it has finished all its componentDidMount() calls. More work is done by the renderer after that due to a second enqueued render, and this fact evidently prevents the initial block from returning).
* we assume it to be *async* in RootFrame.componentDidMount() (because indeed it is – the block from which it was called immediately returns, allowing the top-level render to finish its last componentDidMount() and fire its render callback, all before any work on this next top-level render is even started. When this second top-level render finishes all its componentDidMount calls (i.e. the one in LandingPage), it fires its own render callback, and the original `run.create()` block is finally allowed to return)

This shows that `ReactNativeScript.render()` is sync only when the render queue is empty. When it's not empty, it'll just add work to the queue and act as a non-blocking operation.

## Behaviour

1. render() is called on the function component owing the base of the tree: `app`; `rootRef` not yet populated
2. render() is called on its first child, a class-component: RootFrame; `rootRef` not yet populated
3. componentDidMount() called on RootFrame; `rootRef` becomes populated. RootFrame begins the top-level render of the LandingPage
4. componentDidMount() block exits. `landingPageRef` not yet populated.
5. **Top-level render() callback for `app`, but bootstrap run.create() block hasn't yet returned.**
6. render() is called on the class-component, LandingPage: `landingPageRef` not yet populated
7. componentDidMount() called on LandingPage; `landingPageRef` becomes populated
8. Top-level render() callback for LandingPage, and frame.navigate.create() called on populated LandingPage ref.
9. Bootstrap run.create() block returns.