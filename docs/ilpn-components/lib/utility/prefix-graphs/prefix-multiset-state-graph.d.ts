import { MultisetEquivalent } from '../multiset/multiset-equivalent';
import { StringSequence } from '../string-sequence';
import { Multiset } from '../multiset/multiset';
export declare class PrefixMultisetStateGraph<T> {
    private readonly _root;
    private readonly _stateMap;
    constructor(rootContent: T & MultisetEquivalent);
    insert(path: StringSequence, newStepNode: (step: string, newState: Multiset, previousNode: T & MultisetEquivalent) => (T & MultisetEquivalent), newEdgeReaction?: (step: string, previousNode: T & MultisetEquivalent) => void, finalNodeReaction?: (node: T & MultisetEquivalent) => void, stepReaction?: (prefix: Array<string>, step: string) => void): void;
    private stepState;
    getGraphStates(): Array<T & MultisetEquivalent>;
}
