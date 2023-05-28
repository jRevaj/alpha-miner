import { PetriNet } from '../../../models/pn/model/petri-net';
import { RegionsConfiguration } from './classes/regions-configuration';
import { Observable } from 'rxjs';
import { Region } from './classes/region';
import { PetriNetRegionTransformerService } from './petri-net-region-transformer.service';
import { IlpSolverService } from '../../../utility/glpk/ilp-solver.service';
import * as i0 from "@angular/core";
export declare class PetriNetRegionsService extends IlpSolverService {
    private _regionTransformer;
    constructor(_regionTransformer: PetriNetRegionTransformerService);
    computeRegions(nets: Array<PetriNet>, config: RegionsConfiguration): Observable<Region>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetRegionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetRegionsService>;
}
