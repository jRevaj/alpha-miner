export declare class IncrementingCounter {
    private value;
    next(): number;
    current(): number;
    reset(): void;
    setCurrentValue(value: number): void;
}
export interface SetLike<T> {
    has(s: T): boolean;
}
export declare function createUniqueString(prefix: string, existingNames: SetLike<string>, counter: IncrementingCounter): string;
