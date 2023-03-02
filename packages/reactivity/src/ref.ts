import { hasChanged, isObject } from "@guide-mini-vue/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value: any;
    public dep;
    private _rawValue: any;
    public __v_isRef = true;
    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        // value -> reactive
        // 1. 看看 value 是不是对象

        
        this.dep = new Set();
    }

    get value() {
        trackRefValue(this);
        return this._value;
    }

    set value(newValue) {
        // 一定先去修改值

        // newValue -> this._value
        // hasChanged
        if (hasChanged(this._rawValue, newValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }
    }
}

function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
    return new RefImpl(value);
}

export function isRef(ref) {
    return !!ref.__v_isRef;
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}

export function proxyRefs (objectWithRefs) {
    // get set
    return new Proxy(objectWithRefs, {
        get(target, key) {
            // get -> age (ref) -> age.value
            // not ref -> value
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            // set -> ref .value
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            } else {
                return Reflect.set(target, key, value);
            }
        }
    })
}