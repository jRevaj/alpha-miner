import { Node } from './node';
export declare class Place extends Node {
    private _marking;
    constructor(marking?: number, x?: number, y?: number, id?: string);
    get marking(): number;
    set marking(value: number);
    protected svgX(): string;
    protected svgY(): string;
}
