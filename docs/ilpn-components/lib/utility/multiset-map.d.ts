export declare type Multiset = {
    [k: string]: number;
};
export declare abstract class MultisetEquivalent {
    private _multiset;
    protected constructor(_multiset: Multiset);
    get multiset(): Multiset;
    equals(ms: Multiset): boolean;
    abstract merge(ms: MultisetEquivalent): void;
}
export declare class MultisetMap<T> {
    private _map;
    constructor();
    put(value: T & MultisetEquivalent): void;
    get(key: Multiset): (T & MultisetEquivalent) | undefined;
    private hashKey;
    values(): Array<T & MultisetEquivalent>;
}
