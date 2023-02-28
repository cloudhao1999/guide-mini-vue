import { NodeTypes } from "./ast";

export function baseParse(content: string) {

    const context = createContext(content);
    return createRoot(parseChildren(context))
}

function parseChildren(context) {
    const nodes = [] as any[];
    // {{}}
    let node;
    if (context.source.startsWith("{{")) {
        node = parseInterpolation(context)
        nodes.push(node)
    }
    return nodes
}

function parseInterpolation(context) {

    const openDelimiter = "{{"
    const closeDelimiter = "}}"

    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);
    anvanceBy(context, openDelimiter.length);

    const rawContentLength = closeIndex - openDelimiter.length;

    const rawContent = context.source.slice(0, rawContentLength);
    const content = rawContent.trim();

    anvanceBy(context, rawContentLength + closeDelimiter.length);

    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_INTERPOLATION,
            content: content,
        }
    }
}

function anvanceBy(context: any, length: number) {
    context.source = context.source.slice(length);
}

function createRoot(children) {
    return {
        children
    }
}

function createContext(content: string) {
    return {
        source: content,
    }
}
