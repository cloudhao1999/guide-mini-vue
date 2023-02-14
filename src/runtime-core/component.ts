import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { initSlots } from "./componentSlots";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => {},
    }

    component.emit = emit.bind(null, component) as any;

    return component;
}

export function setupComponent(instance) {
    // 1. props
    initProps(instance, instance.vnode.props);
    // 2. slots
    initSlots(instance, instance.vnode.children);
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
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });

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