import { PartialOrderNetWithContainedTraces } from '../../../../models/pn/model/partial-order-net-with-contained-traces';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { Trace } from '../../../../models/log/model/trace';
export declare class PrimeMinerInput extends PartialOrderNetWithContainedTraces {
    lastIterationChangedModel?: boolean;
    constructor(net: PetriNet, containedTraces: Array<Trace>);
    static fromPartialOrder(po: PartialOrderNetWithContainedTraces, changed?: boolean): PrimeMinerInput;
}
