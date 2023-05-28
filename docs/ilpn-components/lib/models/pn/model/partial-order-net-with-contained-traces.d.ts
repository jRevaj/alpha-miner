import { PetriNet } from './petri-net';
import { Trace } from '../../log/model/trace';
export declare class PartialOrderNetWithContainedTraces {
    net: PetriNet;
    containedTraces: Array<Trace>;
    constructor(net: PetriNet, containedTraces: Array<Trace>);
}
