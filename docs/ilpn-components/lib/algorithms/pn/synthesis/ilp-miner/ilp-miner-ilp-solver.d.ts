import { ArcWeightIlpSolver } from '../../../../utility/glpk/ArcWeightIlpSolver';
import { Observable } from 'rxjs';
import { GLPK } from 'glpk.js';
import { Trace } from '../../../../models/log/model/trace';
import { ProblemSolution } from '../../../../models/glpk/problem-solution';
export declare class IlpMinerIlpSolver extends ArcWeightIlpSolver {
    constructor(solver$: Observable<GLPK>);
    findSolutions(log: Array<Trace>): Observable<Array<ProblemSolution>>;
    private firingRule;
    private setUpBaseIlp;
    private populateIlp;
}
