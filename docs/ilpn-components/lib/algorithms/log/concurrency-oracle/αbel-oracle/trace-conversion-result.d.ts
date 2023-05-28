import { PetriNet } from '../../../../models/pn/model/petri-net';
export declare class TraceConversionResult {
    nets: Array<PetriNet>;
    labelMapping: Map<string, string>;
    constructor(nets: Array<PetriNet>, labelMapping: Map<string, string>);
}
