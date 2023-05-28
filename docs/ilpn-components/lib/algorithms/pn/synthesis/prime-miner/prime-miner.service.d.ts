import { Observable } from 'rxjs';
import { PetriNetRegionSynthesisService } from '../../regions/petri-net-region-synthesis.service';
import { PrimeMinerResult } from './prime-miner-result';
import { PetriNetIsomorphismService } from '../../isomorphism/petri-net-isomorphism.service';
import { ImplicitPlaceRemoverService } from '../../transformation/implicit-place-remover.service';
import { PartialOrderNetWithContainedTraces } from '../../../../models/pn/model/partial-order-net-with-contained-traces';
import { PetriNetToPartialOrderTransformerService } from '../../transformation/petri-net-to-partial-order-transformer.service';
import { PrimeMinerConfiguration } from './prime-miner-configuration';
import * as i0 from "@angular/core";
export declare class PrimeMinerService {
    protected _synthesisService: PetriNetRegionSynthesisService;
    protected _isomorphismService: PetriNetIsomorphismService;
    protected _implicitPlaceRemover: ImplicitPlaceRemoverService;
    protected _pnToPoTransformer: PetriNetToPartialOrderTransformerService;
    constructor(_synthesisService: PetriNetRegionSynthesisService, _isomorphismService: PetriNetIsomorphismService, _implicitPlaceRemover: ImplicitPlaceRemoverService, _pnToPoTransformer: PetriNetToPartialOrderTransformerService);
    mine(minerInputs: Array<PartialOrderNetWithContainedTraces>, config?: PrimeMinerConfiguration): Observable<PrimeMinerResult>;
    private isConnected;
    static ɵfac: i0.ɵɵFactoryDeclaration<PrimeMinerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PrimeMinerService>;
}
