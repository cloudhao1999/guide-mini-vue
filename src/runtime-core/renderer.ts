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
        remove: hostRemove,
        setElementText: hostSetElementText,
    } = options;

    function render(vnode, container) {
        // patch
        patch(null, vnode, container, null, null);
    }

    // n1 -> oldVnode  n2 -> newVnode
    function patch(n1, n2, container, parentComponent, anchor) {
        // 去处理组件

        // 判断 vnode 是不是 element
        // 是 element 那么就应该处理 element
        const { type, shapeFlag } = n2

        // Fragment -> 只渲染children
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent, anchor);
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
                break;
        }
    }

    function processElement(n1, n2, container, parentComponent, anchor) {
        console.log('processElement');
        if (!n1) {
            mountElement(n2, container, parentComponent, anchor);
        } else {
            // update
            patchElement(n1, n2, container, parentComponent, anchor)
        }
    }


    function patchElement(n1, n2, container, parentComponent, anchor) {
        console.log('patchElement');
        console.log("n1", n1);
        console.log("n2", n2);

        // props
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;

        const el = (n2.el = n1.el);
        // children
        patchChildren(n1, n2, el, parentComponent, anchor);
        patchProps(el, oldProps, newProps);
    }

    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;
        const c1 = n1.children;
        const c2 = n2.children;

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                // 1. 把老的 children 清空    
                unmountChildren(n1.children);
            } 
            if (c1 !== c2) {
                hostSetElementText(container, c2);
            }
        } else {
            if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                hostSetElementText(container, '');
                mountChildren(c2, container, parentComponent, anchor);
            } else {
                // array diff array
                patchKeyedChildren(c1, c2, container, parentComponent, anchor);
            }
        }
    }

    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        const l2 = c2.length;
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;

        function isSomeVnodeType(n1, n2) {
            // type
            // key
            return n1.type === n2.type && n1.key === n2.key
        }

        // 左侧
        while (i <= e1 && i <= e2) {
            const n1 = c1[i]
            const n2 = c2[i]

            if (isSomeVnodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            } else {
                break;
            }

            i++;
        }

        while(i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];

            if (isSomeVnodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            } else {
                break;
            }

            e1--;
            e2--;
        }

        // 3. 新的比老得多 创建
        if (i > e1) {
            if (i <= e2) {
                const nextPos = e2 + 1;
                const anchor = nextPos < l2 ?  c2[nextPos].el : null;
                while(i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++;
                }
            }
        }  else if (i > e2) {
            while(i <= e1) {
                hostRemove(c1[i].el);
                i++;
            }
        } 
    }

    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el;
            // remove
            hostRemove(el);
        }
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

    function processComponent(n1, n2: any, container: any, parentComponent, anchor) {
        mountComponent(n2, container, parentComponent, anchor);
    }

    function mountComponent(initialVnode: any, container: any, parentComponent, anchor) {
        console.log('mountComponent');
        const instance = createComponentInstance(initialVnode, parentComponent);

        setupComponent(instance);
        setupRenderEffect(instance, initialVnode, container, anchor);
    }

    function setupRenderEffect(instance: any, initialVnode, container: any, anchor) {
        effect(() => {

            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));

                // vnode -> patch
                // vnode -> element -> mountElement
                patch(null, subTree, container, instance, anchor);

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
                patch(prevSubTree, subTree, container, instance, anchor);
            }
        });
    }

    function mountElement(vnode: any, container: any, parentComponent, anchor) {
        const el = (vnode.el = hostCreateElement(vnode.type));

        const { props, children, shapeFlag } = vnode;

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // string
            el.textContent = children
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // array
            mountChildren(children, el, parentComponent, anchor)
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
        hostInsert(el, container, anchor);
    }


    function mountChildren(children, container, parentComponent, anchor) {
        children.forEach(child => {
            patch(null, child, container, parentComponent, anchor);
        });
    }
    function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
        mountChildren(n2.children, container, parentComponent, anchor);
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





