import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
    // patch
    patch(vnode, container);
}

function patch(vnode, container) {
    // 去处理组件

    // 判断 vnode 是不是 element
    // 是 element 那么就应该处理 element
    const { type, shapeFlag } = vnode

    // Fragment -> 只渲染children
    switch (type) {
        case Fragment:
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container);
            } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container);
            }
            break;
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
        // on + EventName
        // onClick
        const isOn = (key: string) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            el.addEventListener(key.slice(2).toLowerCase(), props[key]);
        } else {
            el.setAttribute(key, props[key]);
        }
    }

    container.appendChild(el);
}


function mountChildren(children, container) {
    children.forEach(child => {
        patch(child, container);
    });
}
function processFragment(vnode: any, container: any) {
    mountChildren(vnode.children, container);
}

function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el) = document.createTextNode(children);
    container.append(textNode);
}

