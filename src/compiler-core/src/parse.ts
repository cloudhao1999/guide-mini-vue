import { NodeTypes } from "./ast";

const enum TagType {
    Start,
    End
}

export function baseParse(content: string) {

    const context = createContext(content);
    return createRoot(parseChildren(context))
}
function parseChildren(context) {
    const nodes = [] as any[];
    // {{}}
    let node;
    const s = context.source;
    if (s.startsWith("{{")) {
        node = parseInterpolation(context)
    } else if (s[0] === "<") {
        if (/[a-z]/i.test(s[1])) {
            node = parseElement(context)
        }
    }

    if (!node) {
        node = parseText(context)
    }

    nodes.push(node)
    return nodes
}

function parseText(context: any): any {
    // 1.获取当前的内容
    const content = parseTextData(context, context.source.length);
    return {
        type: NodeTypes.TEXT,
        content,
    }
}

function parseTextData(context: any, length) {
    const content = context.source.slice(0, length);
    // 2.推进
    anvanceBy(context, length);
    return content;
}

function parseElement(context) {

    // 1. 解析 tag
    const element = parseTag(context, TagType.Start);

    parseTag(context, TagType.End);
    console.log('context', context.source);

    return element;
}

function parseTag(context: any, type: TagType) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source);
    console.log('match', match);
    const tag = match[1];
    // 2. 删除处理完成的代码
    anvanceBy(context, match[0].length);
    anvanceBy(context, 1);

    if (type === TagType.End) return;

    return {
        type: NodeTypes.ELEMENT,
        tag,
    };
}

function parseInterpolation(context) {

    const openDelimiter = "{{"
    const closeDelimiter = "}}"

    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);
    anvanceBy(context, openDelimiter.length);

    const rawContentLength = closeIndex - openDelimiter.length;

    const rawContent = parseTextData(context, rawContentLength);
    const content = rawContent.trim();

    anvanceBy(context, closeDelimiter.length);

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
