import { Arc } from './arc';
import { IdPoint } from './id-point';
export declare class Node extends IdPoint {
    private readonly _ingoingArcs;
    private readonly _outgoingArcs;
    private readonly _ingoingArcWeights;
    private readonly _outgoingArcWeights;
    constructor(x: number, y: number, id?: string);
    get ingoingArcs(): Array<Arc>;
    get outgoingArcs(): Array<Arc>;
    get ingoingArcWeights(): Map<string, number>;
    get outgoingArcWeights(): Map<string, number>;
    addOutgoingArc(arc: Arc): void;
    addIngoingArc(arc: Arc): void;
    removeArc(arc: Arc | string): void;
}
