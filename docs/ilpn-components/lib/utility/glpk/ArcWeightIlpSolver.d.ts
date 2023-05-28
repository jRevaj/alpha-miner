import { IlpSolver } from './abstract-ilp-solver';
import { Observable } from 'rxjs';
import { GLPK } from 'glpk.js';
import { SolutionVariable } from './model/solution-variable';
export declare abstract class ArcWeightIlpSolver extends IlpSolver {
    private readonly _labelVariableMapIngoing;
    private readonly _labelVariableMapOutgoing;
    private readonly _inverseLabelVariableMapIngoing;
    private readonly _inverseLabelVariableMapOutgoing;
    protected constructor(solver$: Observable<GLPK>);
    protected transitionVariableName(label: string, prefix: 'x' | 'y'): string;
    getInverseVariableMapping(variable: string): SolutionVariable;
}
