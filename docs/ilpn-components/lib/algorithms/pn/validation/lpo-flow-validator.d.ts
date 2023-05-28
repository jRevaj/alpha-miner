import { PetriNet } from '../../../models/pn/model/petri-net';
import { PartialOrder } from '../../../models/po/model/partial-order';
import { Place } from '../../../models/pn/model/place';
import { LpoValidator } from './classes/lpo-validator';
import { ValidationResult } from './classes/validation-result';
import { Event } from '../../../models/po/model/event';
export declare class LpoFlowValidator extends LpoValidator {
    constructor(petriNet: PetriNet, lpo: PartialOrder);
    validate(): Array<ValidationResult>;
    protected checkFlowForPlace(place: Place, events: Array<Event>): boolean;
    private eventStart;
    private eventEnd;
}
