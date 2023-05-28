import { Marking } from '../../../../models/pn/model/marking';
export declare class CoverabilityTree {
    private readonly _omegaMarking;
    private readonly _ancestors;
    private readonly _children;
    constructor(omegaMarking: Marking, ancestors?: Array<CoverabilityTree>);
    get omegaMarking(): Marking;
    get ancestors(): Array<CoverabilityTree>;
    getChildren(): Array<CoverabilityTree>;
    getChildrenMap(): Map<string, CoverabilityTree>;
    addChild(label: string, marking: Marking): CoverabilityTree;
}
