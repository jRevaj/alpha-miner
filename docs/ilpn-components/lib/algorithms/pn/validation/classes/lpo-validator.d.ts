import { PetriNet } from '../../../../models/pn/model/petri-net';
import { PartialOrder } from '../../../../models/po/model/partial-order';
import { ValidationResult } from './validation-result';
export declare abstract class LpoValidator {
    protected readonly _petriNet: PetriNet;
    protected readonly _lpo: PartialOrder;
    protected constructor(petriNet: PetriNet, lpo: PartialOrder);
    protected modifyLPO(): void;
    abstract validate(): Array<ValidationResult>;
}
