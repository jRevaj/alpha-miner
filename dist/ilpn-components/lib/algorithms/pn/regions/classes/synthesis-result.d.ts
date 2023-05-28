import { PetriNet } from '../../../../models/pn/model/petri-net';
export declare class SynthesisResult {
    input: Array<PetriNet>;
    result: PetriNet;
    fileName: string;
    constructor(input: Array<PetriNet>, result: PetriNet, fileName: string);
}
