import { mutableHandler, readonlyHandler, shallowReadonlyHandler } from "./baseHandlers";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
    return createActiveobject(raw, mutableHandler);
}

export function readonly(raw) {
    return createActiveobject(raw, readonlyHandler);
}

export function shallowReadonly(raw) {
    return createActiveobject(raw, shallowReadonlyHandler);
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadOnly(value) {
    return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
    return isReactive(value) || isReadOnly(value);
}

function createActiveobject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}