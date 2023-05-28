import { PetriNet } from '../../../models/pn/model/petri-net';
import * as i0 from "@angular/core";
export declare class DuplicatePlaceRemoverService {
    constructor();
    /**
     * @param net a labeled Petri Net containing duplicate places
     * @returns a copy of the input Petri net without the duplicate places
     */
    removeDuplicatePlaces(net: PetriNet): PetriNet;
    private arePlacesTheSame;
    private compareArcs;
    static ɵfac: i0.ɵɵFactoryDeclaration<DuplicatePlaceRemoverService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DuplicatePlaceRemoverService>;
}
