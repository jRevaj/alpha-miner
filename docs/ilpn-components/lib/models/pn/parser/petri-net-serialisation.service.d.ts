import { PetriNet } from '../model/petri-net';
import * as i0 from "@angular/core";
export declare class PetriNetSerialisationService {
    constructor();
    serialise(net: PetriNet): string;
    private serialiseFrequency;
    private serialiseTransitions;
    private serialisePlaces;
    private serialiseArcs;
    private removeSpaces;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetSerialisationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetSerialisationService>;
}
