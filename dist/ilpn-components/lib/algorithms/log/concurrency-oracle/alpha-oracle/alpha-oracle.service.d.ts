import { ConcurrencyOracle } from '../concurrency-oracle';
import { Trace } from '../../../../models/log/model/trace';
import { AlphaOracleConfiguration } from './alpha-oracle-configuration';
import { OccurenceMatrixType, OccurrenceMatrix } from '../occurrence-matrix';
import { ConcurrencyRelation } from '../../../../models/concurrency/model/concurrency-relation';
import { LogCleaner } from '../../log-cleaner';
import * as i0 from "@angular/core";
export declare class AlphaOracleService extends LogCleaner implements ConcurrencyOracle {
    constructor();
    determineConcurrency(log: Array<Trace>, config?: AlphaOracleConfiguration): ConcurrencyRelation;
    computeOccurrenceMatrix(log: Array<Trace>, lookAheadDistance?: number, matrixType?: OccurenceMatrixType, cleanLog?: boolean): OccurrenceMatrix;
    static ɵfac: i0.ɵɵFactoryDeclaration<AlphaOracleService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AlphaOracleService>;
}
