import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
    const context = ceateTranformContext(root, options);
    // 1. 遍历 - 深度优先遍历
    traverseNode(root, context);
    // 2. 修改 text 的 content

    createRootCodeGen(root)
    // root.codegenNode

    root.helpers = [...context.helpers.keys()];
}

function createRootCodeGen(root) {
    const child = root.children[0];
    if (child.type === NodeTypes.ELEMENT) {
        root.codegenNode = child.codegenNode;
    } else {
        root.codegenNode = root.children[0]
    }
}

function ceateTranformContext(root: any, options: any) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(key: string) {
            context.helpers.set(key, 1);
        }
    }
    return context;
}

function traverseNode(node: any, context: any) {
    console.log(node);

    const nodeTransforms = context.nodeTransforms;
    const exitFns: any = [];
    for (let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i]
        const onExit = transform(node, context);
        if (onExit) exitFns.push(onExit);
    }

    switch (node.type) {
        case NodeTypes.INTERPOLATION:
            context.helper(TO_DISPLAY_STRING);
            break;
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            traverseChildren(node, context);
            break;
        default:
            break;
    }

    let i = exitFns.length;
    while (i--) {
        exitFns[i]();
    }
}


function traverseChildren(node: any, context: any) {
    const children = node.children;

    if (children) {
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            traverseNode(node, context);
        }
    }
}

