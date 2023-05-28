import { ArcWeightIlpSolver } from '../../../../utility/glpk/ArcWeightIlpSolver';
import { Observable } from 'rxjs';
import { GLPK } from 'glpk.js';
import { PartialOrder } from '../../../../models/po/model/partial-order';
import { ProblemSolution } from '../../../../models/glpk/problem-solution';
import { PetriNet } from '../../../../models/pn/model/petri-net';
export declare class Ilp2MinerIlpSolver extends ArcWeightIlpSolver {
    private static readonly PO_ARC_SEPARATOR;
    private static readonly FINAL_MARKING;
    private readonly _directlyFollowsExtractor;
    private readonly _poVariableNames;
    constructor(solver$: Observable<GLPK>);
    findSolutions(pos: Array<PartialOrder> | PetriNet): Observable<Array<ProblemSolution>>;
    private firingRule;
    private tokenFlow;
    private initialMarking;
    private getPoEventId;
    private getPoArcId;
    private branchingProcessFiringRule;
    private branchingProcessTokenFlow;
    private getPlaceVariable;
    private setUpBaseIlp;
    private populateIlp;
}
