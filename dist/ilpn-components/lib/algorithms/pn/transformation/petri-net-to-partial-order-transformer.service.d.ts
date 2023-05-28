import { PetriNet } from '../../../models/pn/model/petri-net';
import { PartialOrder } from '../../../models/po/model/partial-order';
import * as i0 from "@angular/core";
export declare class PetriNetToPartialOrderTransformerService {
    constructor();
    transform(net: PetriNet): PartialOrder;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetToPartialOrderTransformerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetToPartialOrderTransformerService>;
}
