import { Relabeler } from '../../../utility/relabeler';
import { OccurrenceMatrix } from '../../../algorithms/log/concurrency-oracle/occurrence-matrix';
import { ConcurrencyMatrices, ConcurrencyMatrix } from './concurrency-matrix';
export declare class ConcurrencyRelation {
    private readonly _relabeler;
    private readonly _uniqueConcurrencyMatrix;
    private readonly _wildcardConcurrencyMatrix;
    private readonly _mixedConcurrencyMatrix;
    private readonly _wildCardLabels;
    protected constructor(relabeler: Relabeler);
    static noConcurrency(): ConcurrencyRelation;
    static fromOccurrenceMatrix(matrix: OccurrenceMatrix, relabeler: Relabeler): ConcurrencyRelation;
    isConcurrent(labelA: string, labelB: string): boolean;
    setUniqueConcurrent(uniqueLabelA: string, uniqueLabelB: string, concurrency?: boolean): void;
    setUniqueConcurrent(uniqueLabelA: string, uniqueLabelB: string, frequencyAB: number, frequencyBA: number): void;
    setWildcardConcurrent(wildcardLabelA: string, wildcardLabelB: string, concurrency?: boolean): void;
    setWildcardConcurrent(wildcardLabelA: string, wildcardLabelB: string, frequencyAB: number, frequencyBA: number): void;
    setMixedConcurrent(wildcardLabel: string, uniqueLabel: string, concurrency?: boolean): void;
    protected set(matrix: ConcurrencyMatrix, uniqueLabelA: string, uniqueLabelB: string, concurrency?: boolean): void;
    protected set(matrix: ConcurrencyMatrix, uniqueLabelA: string, uniqueLabelB: string, frequency: number): void;
    protected read(matrix: ConcurrencyMatrix, row: string, column: string): boolean;
    protected getWildcard(label: string): string | undefined;
    get relabeler(): Relabeler;
    cloneConcurrencyMatrices(): ConcurrencyMatrices;
    protected cloneMatrix(matrix: ConcurrencyMatrix): ConcurrencyMatrix;
}
