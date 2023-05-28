export declare type Multiset = {
    [k: string]: number;
};
export declare function addToMultiset(multiset: Multiset, value: string): void;
export declare function cloneMultiset(multiset: Multiset): Multiset;
export declare function mapMultiset<T>(multiset: Multiset, mappingFunction: (name: string, cardinality: number) => T): Array<T>;
