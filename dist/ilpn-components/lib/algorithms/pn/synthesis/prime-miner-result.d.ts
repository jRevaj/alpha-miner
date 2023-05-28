import { PetriNet } from '../../../models/pn/model/petri-net';
import { Trace } from '../../../models/log/model/trace';
/**
 * A single net in the Prime miner result sequence.
 */
export declare class PrimeMinerResult {
    /**
     * The synthesised model
     */
    net: PetriNet;
    /**
     * List of one based indices of the partial orders included in the model. The indices index the SORTED PO order.
     */
    supportedPoIndices: Array<number>;
    /**
     * List of traces contained in the model
     */
    containedTraces: Array<Trace>;
    constructor(net: PetriNet, supportedPoIndices: Array<number>, containedTraces: Array<Trace>);
}
