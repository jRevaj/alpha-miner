import { PetriNet } from '../../../models/pn/model/petri-net';
import { CoverabilityTree } from './model/coverability-tree';
import { Marking } from '../../../models/pn/model/marking';
import * as i0 from "@angular/core";
export declare class PetriNetCoverabilityService {
    constructor();
    getCoverabilityTree(net: PetriNet): CoverabilityTree;
    protected computeNextOmegaMarking(nextMarking: Marking, ancestors: Array<CoverabilityTree>): Marking;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetCoverabilityService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetCoverabilityService>;
}
