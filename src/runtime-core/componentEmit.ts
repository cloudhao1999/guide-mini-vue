import { toHandlerKey, camelize } from "../shared/index";

export function emit(instance, event, ...args) {
    console.log("emit", event);

    // instance.props => event
    const { props } = instance;

    // add -> Add
    // add-foo -> addFoo

    // event => handler
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}