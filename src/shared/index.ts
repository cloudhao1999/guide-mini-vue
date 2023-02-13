export const extend = Object.assign;

export const isObject = (val) => val !== null && typeof val === 'object';

export const hasChanged = (val, newValue) => {
    return !Object.is(val, newValue);
}

export const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);

export const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

export const capitalize = (str: string) =>  {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const toHandlerKey = (str: string) => {
    return str ? `on${capitalize(str)}` : "";
}
