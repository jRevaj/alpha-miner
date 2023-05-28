import { ConcurrencyOracle } from '../concurrency-oracle';
import { Trace } from '../../../../models/log/model/trace';
import { ConcurrencyRelation } from '../../../../models/concurrency/model/concurrency-relation';
import { Relabeler } from '../../../../utility/relabeler';
import { OccurrenceMatrix } from '../occurrence-matrix';
import { TimestampOracleConfiguration } from './timestamp-oracle-configuration';
import { LogCleaner } from '../../log-cleaner';
import * as i0 from "@angular/core";
export declare class TimestampOracleService extends LogCleaner implements ConcurrencyOracle {
    determineConcurrency(log: Array<Trace>, config?: TimestampOracleConfiguration): ConcurrencyRelation;
    protected filterTraceAndPairStartCompleteEvents(trace: Trace): void;
    protected relabelPairedLog(log: Array<Trace>, relabeler: Relabeler): void;
    protected constructOccurrenceMatrix(log: Array<Trace>, unique: boolean): OccurrenceMatrix;
    protected addAllInProgressToMatrix(started: string, inProgress: Set<string>, matrix: OccurrenceMatrix): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimestampOracleService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimestampOracleService>;
}
