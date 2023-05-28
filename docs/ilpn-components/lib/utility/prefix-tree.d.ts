import { StringSequence } from './string-sequence';
export declare class PrefixTreeNode<T> {
    private _children;
    private _content;
    constructor(content?: T);
    get content(): T | undefined;
    set content(value: T | undefined);
    getChild(key: string): PrefixTreeNode<T> | undefined;
    addChild(key: string, content?: T): PrefixTreeNode<T>;
    hasChildren(): boolean;
}
export declare class PrefixTree<T> {
    private readonly _root;
    constructor(rootContent?: T);
    insert(path: StringSequence, newNodeContent: () => T, updateNodeContent: (node: T, treeWrapper: PrefixTreeNode<T>) => void, stepReaction?: (step: string, previousNode: T | undefined, previousTreeWrapper: PrefixTreeNode<T>) => void, newStepNode?: (step: string, prefix: Array<string>, previousNode: T | undefined) => T | undefined): void;
}
