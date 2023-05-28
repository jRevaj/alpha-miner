import { Variable } from './variable';
import { Bound } from './bound';
export declare type SubjectTo = {
    name: string;
    vars: Array<Variable>;
    bnds: Bound;
};
