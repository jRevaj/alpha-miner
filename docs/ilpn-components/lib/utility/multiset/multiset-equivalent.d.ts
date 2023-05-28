import { Multiset } from './multiset';
export declare abstract class MultisetEquivalent {
    private _multiset;
    protected constructor(_multiset: Multiset);
    get multiset(): Multiset;
    equals(ms: Multiset): boolean;
    abstract merge(ms: MultisetEquivalent): void;
}
