import { PetriNet } from '../../../models/pn/model/petri-net';
import * as i0 from "@angular/core";
export declare class BranchingProcessFoldingService {
    constructor();
    foldPartialOrders(pos: Array<PetriNet>): PetriNet;
    private addStartEvent;
    private addPoToBranchingProcess;
    private fold;
    private attemptEventFolding;
    private addConflict;
    static ɵfac: i0.ɵɵFactoryDeclaration<BranchingProcessFoldingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BranchingProcessFoldingService>;
}
