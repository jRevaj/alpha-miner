import { OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GLPK } from 'glpk.js';
import * as i0 from "@angular/core";
export declare abstract class IlpSolverService implements OnDestroy {
    protected readonly _solver$: ReplaySubject<GLPK>;
    protected constructor();
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IlpSolverService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IlpSolverService>;
}
