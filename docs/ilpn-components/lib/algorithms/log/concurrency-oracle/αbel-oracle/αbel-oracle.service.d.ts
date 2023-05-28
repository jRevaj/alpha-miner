import { Trace } from '../../../../models/log/model/trace';
import { PetriNetRegionSynthesisService } from '../../../pn/regions/petri-net-region-synthesis.service';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class AbelOracleService {
    private _regionSynthesisService;
    constructor(_regionSynthesisService: PetriNetRegionSynthesisService);
    determineConcurrency(log: Array<Trace>): Observable<Array<PetriNet>>;
    private obtainMultisetEquivalentTraces;
    private computePartialOrderFromEquivalentTraces;
    private convertTracesToPetriNets;
    private relabelNet;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbelOracleService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AbelOracleService>;
}
