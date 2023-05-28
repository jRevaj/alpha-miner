import { PetriNet } from '../../../models/pn/model/petri-net';
import { PetriNetToPartialOrderTransformerService } from '../transformation/petri-net-to-partial-order-transformer.service';
import { PartialOrderIsomorphismService } from '../../po/isomorphism/partial-order-isomorphism.service';
import * as i0 from "@angular/core";
export declare class PetriNetIsomorphismService {
    protected _pnToPoTransformer: PetriNetToPartialOrderTransformerService;
    protected _poIsomorphism: PartialOrderIsomorphismService;
    constructor(_pnToPoTransformer: PetriNetToPartialOrderTransformerService, _poIsomorphism: PartialOrderIsomorphismService);
    arePartialOrderPetriNetsIsomorphic(partialOrderA: PetriNet, partialOrderB: PetriNet): boolean;
    arePetriNetsIsomorphic(netA: PetriNet, netB: PetriNet): boolean;
    private compareBasicNetProperties;
    private determinePossibleTransitionMappings;
    private determinePossiblePlaceMappings;
    private isMappingAPartialOrderIsomorphism;
    private isMappingAPetriNetIsomorphism;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetIsomorphismService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetIsomorphismService>;
}
