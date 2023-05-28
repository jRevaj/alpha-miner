import { PetriNet } from '../../../models/pn/model/petri-net';
import { LogCleaner } from '../../log/log-cleaner';
import { Marking } from '../../../models/pn/model/marking';
import { PetriNetCoverabilityService } from '../reachability/petri-net-coverability.service';
import * as i0 from "@angular/core";
export declare class ImplicitPlaceRemoverService extends LogCleaner {
    protected _coverabilityTreeService: PetriNetCoverabilityService;
    constructor(_coverabilityTreeService: PetriNetCoverabilityService);
    /**
     * @param net a labeled Petri Net containing implicit places with no label-splitting
     * @returns a copy of the input Petri net without the implicit places
     */
    removeImplicitPlaces(net: PetriNet): PetriNet;
    protected generateReachableMarkings(net: PetriNet): Map<string, Marking>;
    protected getLabelMapping(net: PetriNet): Map<string, string>;
    protected stringifyMarking(marking: Marking, placeOrdering: Array<string>): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImplicitPlaceRemoverService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ImplicitPlaceRemoverService>;
}
