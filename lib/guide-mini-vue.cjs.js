'use strict';

const isObject = (val) => val !== null && typeof val === 'object';

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // 1. props
    // 2. slots
    // 3. setup
    setupStatefulComponent(instance);
    // 4. render
    // 5. effect
}
function setupStatefulComponent(instance) {
    const Component = instance.vnode.type;
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

function render(vnode, container) {
    // patch
    patch(vnode, container);
}
function patch(vnode, container) {
    // 去处理组件
    // 判断 vnode 是不是 element
    // 是 element 那么就应该处理 element
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    console.log('processElement');
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    console.log('mountComponent');
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
}
function mountElement(vnode, container) {
    const el = document.createElement(vnode.type);
    const { props, children } = vnode;
    if (typeof children === "string") {
        // string
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        // array
        mountChildren(children, el);
    }
    // props
    for (const key in props) {
        el.setAttribute(key, props[key]);
    }
    container.appendChild(el);
}
function mountChildren(children, container) {
    children.forEach(child => {
        patch(child, container);
    });
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先 vnode
            // component -> vnode
            // 所有的逻辑操作 都会基于 vnode 做处理
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    const vnode = createVNode(type, props, children);
    return vnode;
}

exports.createApp = createApp;
exports.h = h;
