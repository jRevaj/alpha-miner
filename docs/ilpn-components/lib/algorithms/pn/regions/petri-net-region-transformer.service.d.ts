import { Result } from 'glpk.js';
import { PetriNet } from '../../../models/pn/model/petri-net';
import * as i0 from "@angular/core";
export declare class PetriNetRegionTransformerService {
    constructor();
    displayRegionInNet(solution: Result, net: PetriNet): PetriNet;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetRegionTransformerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetRegionTransformerService>;
}
