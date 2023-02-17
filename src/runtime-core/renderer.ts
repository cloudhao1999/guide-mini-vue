import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, isObject } from "../shared/index";
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
        patch(null, vnode, container, null);
    }

    // n1 -> oldVnode  n2 -> newVnode
    function patch(n1, n2, container, parentComponent) {
        // 去处理组件

        // 判断 vnode 是不是 element
        // 是 element 那么就应该处理 element
        const { type, shapeFlag } = n2

        // Fragment -> 只渲染children
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent);
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }
    }

    function processElement(n1, n2, container, parentComponent) {
        console.log('processElement');
        if (!n1) {
            mountElement(n2, container, parentComponent);
        } else {
            // update
            patchElement(n1, n2, container)
        }
    }


    function patchElement(n1, n2, container) {
        console.log('patchElement');
        console.log("n1", n1);
        console.log("n2", n2);

        // props
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;

        const el = (n2.el = n1.el);
        patchProps(el, oldProps, newProps);
        // children
    }


    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key];
                if (prevProp !== nextProp) {
                    hostPatchProps(el, key, prevProp, nextProp);
                }
            }
    
            if (oldProps !== EMPTY_OBJ) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProps(el, key, oldProps[key], null);
                    }
                }
            }
        }
    }

    function processComponent(n1, n2: any, container: any, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }

    function mountComponent(initialVnode: any, container: any, parentComponent) {
        console.log('mountComponent');
        const instance = createComponentInstance(initialVnode, parentComponent);

        setupComponent(instance);
        setupRenderEffect(instance, initialVnode, container);
    }

    function setupRenderEffect(instance: any, initialVnode, container: any) {
        effect(() => {

            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));

                // vnode -> patch
                // vnode -> element -> mountElement
                patch(null, subTree, container, instance);

                // element -> mount
                initialVnode.el = subTree.el;

                instance.isMounted = true;
            } else {
                // update
                console.log('update');
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;

                instance.subTree = subTree;

                console.log('subTree', subTree);
                console.log('prevSubTree', prevSubTree);
                patch(prevSubTree, subTree, container, instance);
            }
        });
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
            hostPatchProps(el, key, null, val);
        }

        // container.appendChild(el);
        hostInsert(el, container);
    }


    function mountChildren(children, container, parentComponent) {
        children.forEach(child => {
            patch(null, child, container, parentComponent);
        });
    }
    function processFragment(n1, n2: any, container: any, parentComponent) {
        mountChildren(n2.children, container, parentComponent);
    }

    function processText(n1, n2: any, container: any) {
        const { children } = n2;
        const textNode = (n2.el) = document.createTextNode(children);
        container.append(textNode);
    }

    return {
        createApp: createAppAPI(render)
    }
}





