import { StringSequence } from '../string-sequence';
import { PrefixGraphNode } from './prefix-graph-node';
export declare class PrefixTree<T> {
    private readonly _root;
    constructor(rootContent?: T);
    insert(path: StringSequence, newNodeContent: (treeWrapper: PrefixGraphNode<T>) => T | undefined, updateNodeContent: (node: T, treeWrapper: PrefixGraphNode<T>) => void, stepReaction?: (step: string, previousNode: T | undefined, previousTreeWrapper: PrefixGraphNode<T>) => void, newStepNode?: (step: string, prefix: Array<string>, previousNode: T | undefined) => T | undefined): void;
}
