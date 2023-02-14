import { hasOwn } from "../shared/index";

const publicPropertiesMap = {
   $el: (instance) => instance.vnode.el,
   // $slots
   $slots: (instance) => instance.slots,
}

export const publicInstanceProxyHandlers = {
    get({_: instance}, key) {
        // setupState
        const { setupState, props } = instance;
        if (key in setupState) {
            return setupState[key];
        }

        if (hasOwn(setupState, key)) {
            return setupState[key];
        } else if (hasOwn(props, key)) {
            return props[key];
        }

        // key -> $el
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
}