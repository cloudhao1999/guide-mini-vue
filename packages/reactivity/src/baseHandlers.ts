import { extend, isObject } from "@guide-mini-vue/shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadOnly: boolean = false, shadow = false) {
    return function get(target, key) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadOnly;
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadOnly;
        }

        const res = Reflect.get(target, key);

        if (shadow) {
            return res;
        }

        // 看看 res 是否是对象，如果是对象，需要递归代理
        if (isObject(res)) {
            return isReadOnly ? readonly(res) : reactive(res);
        }

        if (!isReadOnly) {
            // TODO 依赖收集
            track(target, key)
        }

        return res;
    }
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    }
}

export const mutableHandler = {
    get,
    set
}

export const readonlyHandler = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`Set operation on key "${key}" failed: target is readonly.`);
        return true;
    }
}

export const shallowReadonlyHandler = extend({}, readonlyHandler, {
    get: shallowReadonlyGet
})