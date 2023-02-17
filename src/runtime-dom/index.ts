import { createRenderer } from "../runtime-core"

function createElement(type) {
    return document.createElement(type);
}

function patchProps(el, key, preVal, nextVal) {
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        el.addEventListener(key.slice(2).toLowerCase(), nextVal);
    } else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        } else {
            el.setAttribute(key, nextVal);
        }
    }
}

function insert(el, parent) {
    parent.append(el);
}

const renderer: any = createRenderer({
    createElement,
    patchProps,
    insert,
})

export function createApp(...args: any) {
    return renderer.createApp(...args);
}

export * from '../runtime-core/index';
