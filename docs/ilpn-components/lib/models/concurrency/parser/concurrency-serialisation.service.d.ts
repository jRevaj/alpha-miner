import { ConcurrencyRelation } from '../model/concurrency-relation';
import { Relabeler } from '../../../utility/relabeler';
import { ConcurrencyMatrix } from '../model/concurrency-matrix';
import * as i0 from "@angular/core";
interface OrderedOriginal {
    original: string;
    order: number;
}
export declare class ConcurrencySerialisationService {
    private static PARALLEL_SYMBOL;
    constructor();
    serialise(concurrency: ConcurrencyRelation): string;
    protected iterateConcurrentEntries(matrix: ConcurrencyMatrix, symmetric: boolean, consumer: (a: string, b: string, fab?: number, fba?: number) => void): void;
    protected processMatrixEntry(matrix: ConcurrencyMatrix, labelA: string, labelB: string, consumer: (a: string, b: string, fab?: number, fba?: number) => void): void;
    protected getOriginalLabel(label: string, cachedUniqueLabels: Map<string, OrderedOriginal>, relabeler: Relabeler): OrderedOriginal;
    protected formatConcurrencyEntry(formattedLabelA: string, formattedLabelB: string): string;
    protected formatConcurrencyEntry(formattedLabelA: string, formattedLabelB: string, frequencyAB: number, frequencyBA: number): string;
    protected formatUniqueLabel(label: OrderedOriginal): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConcurrencySerialisationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ConcurrencySerialisationService>;
}
export {};
