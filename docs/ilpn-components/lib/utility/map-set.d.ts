export declare class MapSet<K, V> {
    private _map;
    constructor();
    add(key: K, value: V): void;
    addAll(key: K, values: Iterable<V>): void;
    has(key: K, value: V): boolean;
    get(key: K): Set<V>;
    entries(): IterableIterator<[K, Set<V>]>;
}
