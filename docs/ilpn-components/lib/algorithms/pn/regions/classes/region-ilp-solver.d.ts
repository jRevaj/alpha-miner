import { Observable } from 'rxjs';
import { GLPK } from 'glpk.js';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { PetriNetRegionTransformerService } from '../petri-net-region-transformer.service';
import { Region } from './region';
import { RegionsConfiguration } from './regions-configuration';
import { IlpSolver } from '../../../../utility/glpk/abstract-ilp-solver';
export declare class RegionIlpSolver extends IlpSolver {
    private _regionTransformer;
    private _placeVariables;
    constructor(_regionTransformer: PetriNetRegionTransformerService, _solver$: Observable<GLPK>);
    computeRegions(nets: Array<PetriNet>, config: RegionsConfiguration): Observable<Region>;
    private combineInputNets;
    private setUpInitialILP;
    private createInitialConstraints;
    private addConstraintsToILP;
    private collectTransitionByLabel;
}
