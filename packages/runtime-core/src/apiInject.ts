import { getCurrentInstance } from "./component";

export function provide(key, val) {
    // 存
    // key value
    const currentInstance: any = getCurrentInstance();

    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;

        // init
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides)
        }

        provides[key] = val;
    }
}

export function inject(key, defaultValue) {
    // 取
    const currentInstance: any = getCurrentInstance();

    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;

        if (key in parentProvides) {
            return parentProvides[key];
        } else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            } else {
                return defaultValue;
            }
        }
    }
}