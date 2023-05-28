import { PetriNet } from '../../../models/pn/model/petri-net';
import { Observable } from 'rxjs';
import { SynthesisResult } from './classes/synthesis-result';
import { RegionsConfiguration } from './classes/regions-configuration';
import { PetriNetRegionsService } from './petri-net-regions.service';
import { PetriNetSerialisationService } from '../../../models/pn/parser/petri-net-serialisation.service';
import * as i0 from "@angular/core";
export declare class PetriNetRegionSynthesisService {
    private _regionService;
    private _serializer;
    constructor(_regionService: PetriNetRegionsService, _serializer: PetriNetSerialisationService);
    synthesise(input: PetriNet | Array<PetriNet>, config?: RegionsConfiguration, fileName?: string): Observable<SynthesisResult>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PetriNetRegionSynthesisService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PetriNetRegionSynthesisService>;
}
