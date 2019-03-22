import ReactReconciler from 'react-reconciler';

const hostConfig = {

};

const ReactReconcilerInst = ReactReconciler(hostConfig);

export default {
    render: (
        reactElement, // <App />
        domElement, // document.getElementById('root')
        callback // Optional. called after the component App is rendered or updated
    ) => {
        console.log(arguments);
        // Create a root Container if it doesnt exist
        if (!domElement._rootContainer) {
        domElement._rootContainer = ReactReconcilerInst.createContainer(domElement, false);
        }

        // update the root Container
        return ReactReconcilerInst.updateContainer(reactElement, domElement._rootContainer, null, callback);
    }
};