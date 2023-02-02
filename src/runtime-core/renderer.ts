import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    // patch
    patch(vnode, container);
}

function patch(vnode, container) {
    // 去处理组件

    // 判断 vnode 是不是 element
    // 是 element 那么就应该处理 element
    processElement();
    processComponent(vnode, container);
}

function processElement() {
    console.log('processElement');
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
    console.log('mountComponent');
    const instance = createComponentInstance(vnode);

    setupComponent(instance);
    setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
    const subTree = instance.render();

    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
}

