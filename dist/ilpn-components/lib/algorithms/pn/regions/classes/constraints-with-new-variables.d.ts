import { SubjectTo } from '../../../../models/glpk/subject-to';
export declare class ConstraintsWithNewVariables {
    private readonly _binaryVariables;
    private readonly _integerVariables;
    private readonly _constraints;
    constructor(constraints: SubjectTo | Array<SubjectTo>, binaryVariables?: string | Array<string>, integerVariables?: string | Array<string>);
    get binaryVariables(): Array<string>;
    get integerVariables(): Array<string>;
    get constraints(): Array<SubjectTo>;
    static combine(...constraints: Array<ConstraintsWithNewVariables>): ConstraintsWithNewVariables;
    static combineAndIntroduceVariables(newBinaryVariables?: string | Array<string>, newIntegerVariables?: string | Array<string>, ...constraints: Array<ConstraintsWithNewVariables>): ConstraintsWithNewVariables;
}
