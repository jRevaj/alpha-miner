export declare enum OccurenceMatrixType {
    UNIQUE = 0,
    WILDCARD = 1
}
export declare class OccurrenceMatrix {
    private _type;
    private readonly _matrix;
    private readonly _keys;
    constructor(_type: OccurenceMatrixType);
    get keys(): Set<string>;
    get type(): OccurenceMatrixType;
    add(e1: string, e2: string): void;
    get(e1: string, e2: string): boolean;
    getOccurrenceFrequency(e1: string, e2: string): undefined | number;
}
