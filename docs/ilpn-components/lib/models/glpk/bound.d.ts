import { Constraint } from './glpk-constants';
export declare type Bound = {
    type: Constraint;
    ub: number;
    lb: number;
};
