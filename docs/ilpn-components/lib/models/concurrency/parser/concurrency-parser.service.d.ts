import { ConcurrencyRelation } from '../model/concurrency-relation';
import { AbstractParser } from '../../../utility/abstract-parser';
import { Relabeler } from '../../../utility/relabeler';
import * as i0 from "@angular/core";
interface RelabelingResult {
    isWildcard?: boolean;
    label: string;
}
export declare class ConcurrencyParserService extends AbstractParser<ConcurrencyRelation> {
    protected static LINE_REGEX: RegExp;
    constructor();
    protected processFileLines(lines: Array<string>): ConcurrencyRelation | undefined;
    protected getUniqueLabel(label: string, oneBasedOrder: number, relabeler: Relabeler): RelabelingResult;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConcurrencyParserService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ConcurrencyParserService>;
}
export {};
