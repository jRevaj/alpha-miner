export declare class Marking {
    private readonly _marking;
    constructor(marking: {
        [p: string]: number;
    } | Marking);
    get(placeId: string): number | undefined;
    set(placeId: string, tokens: number): void;
    equals(marking: Marking): boolean;
    isGreaterThan(marking: Marking): boolean;
    introduceOmegas(smallerMarking: Marking): void;
    getKeys(): Array<string>;
    private getComparisonKeys;
}
