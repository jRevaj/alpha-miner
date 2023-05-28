import { PetriNet } from '../../../../models/pn/model/petri-net';
import { Trace } from '../../../../models/log/model/trace';
export declare class PetriNetSequence {
    private _net;
    private _lastPlace;
    private _trace;
    constructor();
    get net(): PetriNet;
    get trace(): Trace;
    clone(): PetriNetSequence;
    appendEvent(label: string): void;
    appendTransition(label: string): void;
}
