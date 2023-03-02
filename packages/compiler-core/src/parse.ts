import { NodeTypes } from "./ast";

const enum TagType {
    Start,
    End
}

export function baseParse(content: string) {

    const context = createContext(content);
    return createRoot(parseChildren(context, []))
}

function parseChildren(context, ancestor?) {
    const nodes = [] as any[];

    while(!isEnd(context, ancestor)) {
        // {{}}
        let node;
        const s = context.source;
        if (s.startsWith("{{")) {
            node = parseInterpolation(context)
        } else if (s[0] === "<") {
            if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestor)
            }
        }
    
        if (!node) {
            node = parseText(context)
        }
    
        nodes.push(node)
    }
    return nodes
}

function isEnd(context, ancestor) {
    // 1.当遇到结束标签的时候
    const s = context.source;
    if (s.startsWith("</")) {
        for (let i = ancestor.length - 1; i >= 0; i--) {
            const tag = ancestor[i].tag;
            if (startsWithEndTagOpen(s, tag)) {
                return true;
            }
        }
    }
    // 2.当source有值的时候
    return !s
}

function parseText(context: any): any {

    let endIndex = context.source.length;
    let endTokens = ["<", "{{"]

    for (let i = 0; i < endTokens.length; i++) {

        const index = context.source.indexOf(endTokens[i])
        if (index !== -1 && index < endIndex) {
            endIndex = index;
        }
    }

    // 1.获取当前的内容
    const content = parseTextData(context, endIndex);
    console.log("content =========", content);
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

function parseElement(context, ancestor) {

    // 1. 解析 tag
    const element: any = parseTag(context, TagType.Start);
    ancestor.push(element);
    element.children = parseChildren(context, ancestor);
    ancestor.pop();

    if (startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, TagType.End);
    } else {
        throw new Error(`缺少结束标签:${element.tag}`)
    }


    return element;
}

function startsWithEndTagOpen(source, tag) {
    return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
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
        children,
        type: NodeTypes.ROOT,
    }
}

function createContext(content: string) {
    return {
        source: content,
    }
}

