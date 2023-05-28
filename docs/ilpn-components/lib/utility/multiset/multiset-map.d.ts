import { MultisetEquivalent } from './multiset-equivalent';
import { Multiset } from './multiset';
export declare class MultisetMap<T> {
    private _map;
    constructor();
    put(value: T & MultisetEquivalent): void;
    get(key: Multiset): (T & MultisetEquivalent) | undefined;
    private hashKey;
    values(): Array<T & MultisetEquivalent>;
}
