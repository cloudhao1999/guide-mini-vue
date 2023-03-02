import { ShapeFlags } from "@guide-mini-vue/shared";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export { createVNode as createElementVNode }

export function createVNode(type, props?, children?) {
    const vnode = {
        type,
        props,
        children,
        next: null,
        component: null,
        key: props && props.key,
        shapeFlag: getShapeFlag(type),
        el: null,
    };

    // children
    if (typeof children === "string") {
        vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN;
    } else if (Array.isArray(children)) {
        vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN;
    }

    // 组件 + children object
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if (typeof children === "object") {
            vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOTS_CHILDREN
        }
    }

    return vnode;
}

function getShapeFlag(type) {
    return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}

export function createTextVNode(text) {
    return createVNode(Text, {}, text);
}