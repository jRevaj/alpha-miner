import { OnDestroy } from '@angular/core';
import { PetriNet } from '../../../models/pn/model/petri-net';
import { RegionsConfiguration } from './classes/regions-configuration';
import { Observable } from 'rxjs';
import { Region } from './classes/region';
import { PetriNetRegionTransformerService } from './petri-net-region-transformer.service';
import * as i0 from "@angular/core";
export declare class PetriNetRegionsService implements OnDestroy {
    private _regionTransformer;
    private readonly _solver$;
    constructor(_regionTransformer: PetriNetRegionTransformerService);
    ngOnDestroy(): void;
    computeRegions(nets: Array<PetriNet>, config: RegionsConfiguration): Observable<Region>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetRegionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetRegionsService>;
}
