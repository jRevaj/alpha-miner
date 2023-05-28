import { IdPoint } from './id-point';
import { Arc } from './arc';
export declare class DragPoint extends IdPoint {
    private _arc;
    constructor(x: number, y: number, id?: string);
    addArcRef(arc: Arc): void;
    protected svgX(): string;
    protected svgY(): string;
}
