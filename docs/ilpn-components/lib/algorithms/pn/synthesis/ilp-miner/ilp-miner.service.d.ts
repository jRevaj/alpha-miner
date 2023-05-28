import { Trace } from '../../../../models/log/model/trace';
import { Observable } from 'rxjs';
import { NetAndReport } from '../model/net-and-report';
import { IlpSolverService } from '../../../../utility/glpk/ilp-solver.service';
import { DuplicatePlaceRemoverService } from '../../transformation/duplicate-place-remover.service';
import * as i0 from "@angular/core";
export declare class IlpMinerService extends IlpSolverService {
    private _duplicatePlaceRemover;
    constructor(_duplicatePlaceRemover: DuplicatePlaceRemoverService);
    mine(log: Array<Trace>): Observable<NetAndReport>;
    private getTransition;
    static ɵfac: i0.ɵɵFactoryDeclaration<IlpMinerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IlpMinerService>;
}
