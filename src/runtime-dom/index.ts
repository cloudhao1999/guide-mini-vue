import { createRenderer } from "../runtime-core"

function createElement(type) {
    return document.createElement(type);
}

function patchProps(el, key, val) {
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        el.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
        el.setAttribute(key, val);
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
