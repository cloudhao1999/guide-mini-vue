import { shallowReadonly, proxyRefs } from "@guide-mini-vue/reactivity";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { initSlots } from "./componentSlots";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode, parent) {
    console.log('createComponentInstance', parent);
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
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
        setCurrentInstance(instance)
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });

        setCurrentInstance(null)

        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult);
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
    const Component = instance.type;

    if (compiler && !Component.render) {
        if (Component.template) {
            Component.render = compiler(Component.template)
        }
    }
    // template
    instance.render = Component.render;
}

let currentInstance = null;

export function getCurrentInstance() {
    return currentInstance;
}

function setCurrentInstance(instance) {
    currentInstance = instance;
}

let compiler;

export function registerRuntimeCompiler(_compiler) {
    compiler = _compiler;
}