export declare class PrefixGraphNode<T> {
    private _children;
    private _content;
    constructor(content?: T);
    get content(): T | undefined;
    set content(value: T | undefined);
    getChild(key: string): PrefixGraphNode<T> | undefined;
    addChild(key: string, content?: T): PrefixGraphNode<T>;
    addChild(key: string, content: PrefixGraphNode<T>): PrefixGraphNode<T>;
    hasChildren(): boolean;
}
