export declare class ValidationResult {
    valid: boolean;
    phase: ValidationPhase;
    constructor(valid: boolean, phase: ValidationPhase);
}
export declare enum ValidationPhase {
    FLOW = "flow",
    FORWARDS = "forwards",
    BACKWARDS = "backwards"
}
