import { Trace } from '../../models/log/model/trace';
import { Multiset } from './multiset';
import { MultisetEquivalentTraces } from './multiset-equivalent-traces';
export declare class TraceMultisetEquivalentStateTraverser {
    /**
     * Traverses the state diagram defined by the list of traces.
     * Where each state is represented by the multiset of events contained in the prefix closure of each trace.
     *
     * Whenever a state is reached for the first time the `newEdgeReaction` method is called,
     * with the previous state as well as the event that caused the transition as arguments.
     *
     * @param traces a list of traces - an event log
     * @param newEdgeReaction a method that is called whenever a new state is reached
     * @param stepReaction a method that is called whenever a step in the state graph is made
     * @returns a list of all final states. Each state contains the traces that terminate in it.
     */
    traverseMultisetEquivalentStates(traces: Array<Trace>, newEdgeReaction?: (prefix: Multiset, step: string) => void, stepReaction?: (prefix: Array<string>, step: string) => void): Array<MultisetEquivalentTraces>;
}