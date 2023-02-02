import { ReactiveEffect } from "./effect";


class ComputedRefImpl {
    private _getter: any;
    private _dirty = true;
    private _value: any;
    private _effect: any;
    constructor(getter) {
        this._getter = getter
        this._effect = new ReactiveEffect(getter, () => {
            // 依赖的响应式数据发生变化的时候，会执行这个回调
            if (!this._dirty) {
                this._dirty = true;
            }
        });
    }

    get value() {
        // get
        // get value -> dirty true
        // 当依赖的响应式数据发生变化的时候，dirty 会变成 true
        // effect
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
        }

        return this._value;
    }
}

export function computed(getter) {
    return new ComputedRefImpl(getter);
}