import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    // patch
    patch(vnode, container);
}

function patch(vnode, container) {
    // 去处理组件

    // 判断 vnode 是不是 element
    // 是 element 那么就应该处理 element
    const { shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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

    const { props, children, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // string
        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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
