import { Node } from './node';
import { FoldingStatus } from '../../../algorithms/bp/folding/model/folding-status';
export declare class Place extends Node {
    private _marking;
    private _foldingStatus?;
    private _foldedPair?;
    constructor(marking?: number, x?: number, y?: number, id?: string);
    get marking(): number;
    set marking(value: number);
    get foldingStatus(): FoldingStatus | undefined;
    set foldingStatus(value: FoldingStatus | undefined);
    get foldedPair(): Place | undefined;
    set foldedPair(value: Place | undefined);
    protected svgX(): string;
    protected svgY(): string;
}
