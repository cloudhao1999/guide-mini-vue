import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
    const {
        createElement: hostCreateElement,
        patchProps: hostPatchProps,
        insert: hostInsert,
    } = options;

    function render(vnode, container) {
        // patch
        patch(vnode, container, null);
    }

    function patch(vnode, container, parentComponent) {
        // 去处理组件

        // 判断 vnode 是不是 element
        // 是 element 那么就应该处理 element
        const { type, shapeFlag } = vnode

        // Fragment -> 只渲染children
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(vnode, container, parentComponent);
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(vnode, container, parentComponent);
                }
                break;
        }
    }

    function processElement(vnode, container, parentComponent) {
        console.log('processElement');
        mountElement(vnode, container, parentComponent);
    }

    function processComponent(vnode: any, container: any, parentComponent) {
        mountComponent(vnode, container, parentComponent);
    }

    function mountComponent(initialVnode: any, container: any, parentComponent) {
        console.log('mountComponent');
        const instance = createComponentInstance(initialVnode, parentComponent);

        setupComponent(instance);
        setupRenderEffect(instance, initialVnode, container);
    }

    function setupRenderEffect(instance: any, initialVnode, container: any) {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);

        // vnode -> patch
        // vnode -> element -> mountElement
        patch(subTree, container, instance);

        // element -> mount
        initialVnode.el = subTree.el;
    }

    function mountElement(vnode: any, container: any, parentComponent) {
        const el = (vnode.el = hostCreateElement(vnode.type));

        const { props, children, shapeFlag } = vnode;

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // string
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // array
            mountChildren(children, el, parentComponent)
        }



        // props
        for (const key in props) {
            // on + EventName
            // onClick
            const val = props[key];
            // const isOn = (key: string) => /^on[A-Z]/.test(key);
            // if (isOn(key)) {
            //     el.addEventListener(key.slice(2).toLowerCase(), val);
            // } else {
            //     el.setAttribute(key, val);
            // }
            hostPatchProps(el, key, val);
        }

        // container.appendChild(el);
        hostInsert(el, container);
    }


    function mountChildren(children, container, parentComponent) {
        children.forEach(child => {
            patch(child, container, parentComponent);
        });
    }
    function processFragment(vnode: any, container: any, parentComponent) {
        mountChildren(vnode.children, container, parentComponent);
    }

    function processText(vnode: any, container: any) {
        const { children } = vnode;
        const textNode = (vnode.el) = document.createTextNode(children);
        container.append(textNode);
    }

    return {
        createApp: createAppAPI(render)
    }
}





