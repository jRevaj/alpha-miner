import { Trace } from '../../../../models/log/model/trace';
import { Multiset, MultisetEquivalent } from '../../../../utility/multiset-map';
export declare class MultisetEquivalentTraces extends MultisetEquivalent {
    traces: Array<Trace>;
    count: number;
    constructor(multiset: Multiset);
    addTrace(trace: Trace): void;
    incrementCount(): void;
    merge(ms: MultisetEquivalentTraces): void;
}
