const publicPropertiesMap = {
   $el: (instance) => instance.vnode.el,
}

export const publicInstanceProxyHandlers = {
    get({_: instance}, key) {
        // setupState
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }

        // key -> $el
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
}