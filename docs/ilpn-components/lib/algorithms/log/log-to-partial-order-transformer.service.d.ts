import { Trace } from '../../models/log/model/trace';
import { ConcurrencyRelation } from '../../models/concurrency/model/concurrency-relation';
import { LogCleaner } from './log-cleaner';
import { PetriNetIsomorphismService } from '../pn/isomorphism/petri-net-isomorphism.service';
import { PartialOrderNetWithContainedTraces } from '../../models/pn/model/partial-order-net-with-contained-traces';
import * as i0 from "@angular/core";
export interface LogToPartialOrderTransformerConfiguration {
    cleanLog?: boolean;
    addStartStopEvent?: boolean;
    discardPrefixes?: boolean;
}
export declare class LogToPartialOrderTransformerService extends LogCleaner {
    protected _pnIsomorphismService: PetriNetIsomorphismService;
    static readonly START_SYMBOL = "\u25B6";
    static readonly STOP_SYMBOL = "\u25A0";
    constructor(_pnIsomorphismService: PetriNetIsomorphismService);
    transformToPartialOrders(log: Array<Trace>, concurrencyRelation: ConcurrencyRelation, config?: LogToPartialOrderTransformerConfiguration): Array<PartialOrderNetWithContainedTraces>;
    private convertLogToPetriNetSequences;
    private addStartAndStopEvent;
    private removeStartAndStopEvent;
    private convertSequencesToPartialOrders;
    private convertSequenceToPartialOrder;
    private removeTransitiveDependencies;
    private performTransitiveReduction;
    private getChildIds;
    /**
     * Returns an array containing the transitions of the given net. The result is in reverse-topological order i.e.
     * transitions at the front of the Array appear later in the net.
     *
     * Implementation based on https://www.geeksforgeeks.org/topological-sorting/3
     * @param net a Petri Net representation of a partial order
     */
    private reverseTopologicalTransitionOrdering;
    private topologicalOrderingUtil;
    private filterAndCombinePartialOrderNets;
    static ɵfac: i0.ɵɵFactoryDeclaration<LogToPartialOrderTransformerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LogToPartialOrderTransformerService>;
}
