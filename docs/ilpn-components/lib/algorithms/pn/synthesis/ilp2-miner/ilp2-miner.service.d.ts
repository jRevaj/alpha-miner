import { IlpSolverService } from '../../../../utility/glpk/ilp-solver.service';
import { Observable } from 'rxjs';
import { NetAndReport } from '../model/net-and-report';
import { PartialOrder } from '../../../../models/po/model/partial-order';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { DuplicatePlaceRemoverService } from '../../transformation/duplicate-place-remover.service';
import * as i0 from "@angular/core";
export declare class Ilp2MinerService extends IlpSolverService {
    private _duplicatePlaceRemover;
    constructor(_duplicatePlaceRemover: DuplicatePlaceRemoverService);
    mine(pos: Array<PartialOrder> | PetriNet): Observable<NetAndReport>;
    private getTransition;
    private removeArtificialStartTransition;
    static ɵfac: i0.ɵɵFactoryDeclaration<Ilp2MinerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Ilp2MinerService>;
}
