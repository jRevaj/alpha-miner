export declare class MappingCounter {
    mappedId: string;
    private _currentChoice;
    private readonly _maximum;
    constructor(mappedId: string, maximum: number);
    current(): number;
    next(): number;
    isLastOption(): boolean;
}
