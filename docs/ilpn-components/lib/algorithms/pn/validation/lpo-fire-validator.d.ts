import { PetriNet } from '../../../models/pn/model/petri-net';
import { PartialOrder } from '../../../models/po/model/partial-order';
import { ValidationResult } from './classes/validation-result';
import { LpoFlowValidator } from './lpo-flow-validator';
export declare class LpoFireValidator extends LpoFlowValidator {
    private readonly _places;
    constructor(petriNet: PetriNet, lpo: PartialOrder);
    protected modifyLPO(): void;
    validate(): Array<ValidationResult>;
    private buildTotalOrdering;
    private fireForwards;
    private fireBackwards;
    private fire;
    private getPIndex;
    private newBoolArray;
}
