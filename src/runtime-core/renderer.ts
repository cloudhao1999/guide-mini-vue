import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    // patch
    patch(vnode, container);
}

function patch(vnode, container) {
    // 去处理组件

    // 判断 vnode 是不是 element
    // 是 element 那么就应该处理 element
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    } else if(isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}

function processElement(vnode, container) {
    console.log('processElement');
    mountElement(vnode, container);
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container);
}

function mountComponent(initialVnode: any, container: any) {
    console.log('mountComponent');
    const instance = createComponentInstance(initialVnode);

    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance: any, initialVnode, container: any) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);

    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);

    // element -> mount
    initialVnode.el = subTree.el;
}

function mountElement(vnode: any, container: any) {
    const el = (vnode.el = document.createElement(vnode.type));

    const { props, children } = vnode;

    if (typeof children === "string") {
        // string
        el.textContent = children
    } else if (Array.isArray(children)) {
        // array
        mountChildren(children, el)
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
