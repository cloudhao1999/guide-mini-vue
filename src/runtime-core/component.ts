import { publicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
    }

    return component;
}

export function setupComponent(instance) {
    // 1. props
    // 2. slots
    // 3. setup
    setupStatefulComponent(instance);
    // 4. render
    // 5. effect
}

function setupStatefulComponent(instance) {
    const Component = instance.vnode.type;

    // cta
    instance.proxy = new Proxy({
        _: instance
    }, publicInstanceProxyHandlers);

    const { setup } = Component;

    if (setup) {
        const setupResult = setup();

        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
    const Component = instance.type;

    instance.render = Component.render;
}