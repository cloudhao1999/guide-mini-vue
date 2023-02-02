import { createVNode } from './vnode'

export function h(type, props?, children?) {
    const vnode = createVNode(type, props, children)
    return vnode
};
