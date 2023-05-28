import { Observable } from 'rxjs';
import { PetriNetRegionSynthesisService } from '../regions/petri-net-region-synthesis.service';
import { RegionsConfiguration } from '../regions/classes/regions-configuration';
import { PrimeMinerResult } from './prime-miner-result';
import { PetriNetIsomorphismService } from '../isomorphism/petri-net-isomorphism.service';
import { ImplicitPlaceRemoverService } from '../transformation/implicit-place-remover.service';
import { PartialOrderNetWithContainedTraces } from '../../../models/pn/model/partial-order-net-with-contained-traces';
import * as i0 from "@angular/core";
export declare class PrimeMinerService {
    protected _synthesisService: PetriNetRegionSynthesisService;
    protected _isomorphismService: PetriNetIsomorphismService;
    protected _implicitPlaceRemover: ImplicitPlaceRemoverService;
    constructor(_synthesisService: PetriNetRegionSynthesisService, _isomorphismService: PetriNetIsomorphismService, _implicitPlaceRemover: ImplicitPlaceRemoverService);
    mine(minerInputs: Array<PartialOrderNetWithContainedTraces>, config?: RegionsConfiguration): Observable<PrimeMinerResult>;
    private isConnected;
    static ɵfac: i0.ɵɵFactoryDeclaration<PrimeMinerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PrimeMinerService>;
}
