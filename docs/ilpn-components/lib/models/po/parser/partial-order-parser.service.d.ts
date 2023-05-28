import { PartialOrder } from '../model/partial-order';
import { AbstractBlockParser } from '../../../utility/abstract-block-parser';
import * as i0 from "@angular/core";
export declare class PartialOrderParserService extends AbstractBlockParser<PartialOrder> {
    constructor();
    parse(text: string): PartialOrder | undefined;
    protected newResult(): PartialOrder;
    protected resolveBlockParser(block: string): ((lines: Array<string>, result: PartialOrder) => void) | undefined;
    private parseEvents;
    private parseArcs;
    static ɵfac: i0.ɵɵFactoryDeclaration<PartialOrderParserService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PartialOrderParserService>;
}
