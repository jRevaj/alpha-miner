import { Injectable } from '@angular/core';
import { MultisetEquivalentTraces } from './multiset-equivalent-traces';
import { MultisetMap } from '../../../../utility/multiset-map';
import { PrefixTree } from '../../../../utility/prefix-tree';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { IncrementingCounter } from '../../../../utility/incrementing-counter';
import { Place } from '../../../../models/pn/model/place';
import { Transition } from '../../../../models/pn/model/transition';
import { forkJoin, map } from 'rxjs';
import { TraceConversionResult } from './trace-conversion-result';
import { Relabeler } from '../../../../utility/relabeler';
import { LogCleaner } from '../../log-cleaner';
import * as i0 from "@angular/core";
import * as i1 from "../../../pn/regions/petri-net-region-synthesis.service";
export class AbelOracleService extends LogCleaner {
    constructor(_regionSynthesisService) {
        super();
        this._regionSynthesisService = _regionSynthesisService;
    }
    determineConcurrency(log) {
        const multisetEquivalentTraces = this.obtainMultisetEquivalentTraces(log);
        return forkJoin(multisetEquivalentTraces.map(traces => this.computePartialOrderFromEquivalentTraces(traces)));
    }
    obtainMultisetEquivalentTraces(log) {
        const multisetEquivalentTraces = new MultisetMap();
        const tracePrefixTree = new PrefixTree();
        for (const t of log) {
            const trace = this.cleanTrace(t);
            const multiset = {};
            tracePrefixTree.insert(trace, () => {
                let equivalence = multisetEquivalentTraces.get(multiset);
                if (equivalence === undefined) {
                    equivalence = this.createEquivalence(trace, multiset);
                    multisetEquivalentTraces.put(equivalence);
                }
                else {
                    equivalence.addTrace(trace);
                }
                return equivalence;
            }, equivalence => {
                equivalence.incrementCount();
            }, event => {
                if (multiset[event] === undefined) {
                    multiset[event] = 1;
                }
                else {
                    multiset[event] += 1;
                }
            });
        }
        return multisetEquivalentTraces.values();
    }
    createEquivalence(trace, multiset) {
        const equivalence = new MultisetEquivalentTraces(multiset);
        equivalence.addTrace(trace);
        return equivalence;
    }
    computePartialOrderFromEquivalentTraces(traces) {
        const conversionResult = this.convertTracesToPetriNets(traces.traces);
        return this._regionSynthesisService.synthesise(conversionResult.nets, { obtainPartialOrders: true, oneBoundRegions: true }).pipe(map(r => {
            const net = this.relabelNet(r.result, conversionResult.labelMapping);
            net.frequency = traces.count;
            return net;
        }));
    }
    convertTracesToPetriNets(traces) {
        const relabeler = new Relabeler();
        const nets = traces.map(trace => {
            const netCounter = new IncrementingCounter();
            const net = new PetriNet();
            let lastPlace = new Place();
            net.addPlace(lastPlace);
            for (const event of trace.events) {
                const t = new Transition(relabeler.getNewUniqueLabel(event.name));
                net.addTransition(t);
                net.addArc(lastPlace, t);
                lastPlace = new Place();
                net.addPlace(lastPlace);
                net.addArc(t, lastPlace);
            }
            relabeler.restartSequence();
            return net;
        });
        return new TraceConversionResult(nets, relabeler.getLabelMapping());
    }
    relabelNet(net, labelMapping) {
        net.getTransitions().forEach(t => {
            t.label = labelMapping.get(t.label);
        });
        return net;
    }
}
AbelOracleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AbelOracleService, deps: [{ token: i1.PetriNetRegionSynthesisService }], target: i0.ɵɵFactoryTarget.Injectable });
AbelOracleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AbelOracleService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AbelOracleService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetRegionSynthesisService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoizrFiZWwtb3JhY2xlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9sb2cvY29uY3VycmVuY3ktb3JhY2xlL86xYmVsLW9yYWNsZS/OsWJlbC1vcmFjbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ3RFLE9BQU8sRUFBVyxXQUFXLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFFM0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQy9ELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBQzdFLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUN4RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDbEUsT0FBTyxFQUFDLFFBQVEsRUFBRSxHQUFHLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQzs7O0FBSzdDLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxVQUFVO0lBRTdDLFlBQW9CLHVCQUF1RDtRQUN2RSxLQUFLLEVBQUUsQ0FBQztRQURRLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBZ0M7SUFFM0UsQ0FBQztJQUVNLG9CQUFvQixDQUFDLEdBQWlCO1FBQ3pDLE1BQU0s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QkFBaUI7a0JBSDdCLFVBQVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtUcmFjZX0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL2xvZy9tb2RlbC90cmFjZSc7XHJcbmltcG9ydCB7TXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzfSBmcm9tICcuL211bHRpc2V0LWVxdWl2YWxlbnQtdHJhY2VzJztcclxuaW1wb3J0IHtNdWx0aXNldCwgTXVsdGlzZXRNYXB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdHkvbXVsdGlzZXQtbWFwJztcclxuaW1wb3J0IHtQcmVmaXhUcmVlfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXR5L3ByZWZpeC10cmVlJztcclxuaW1wb3J0IHtQZXRyaU5ldFJlZ2lvblN5bnRoZXNpc1NlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3BuL3JlZ2lvbnMvcGV0cmktbmV0LXJlZ2lvbi1zeW50aGVzaXMuc2VydmljZSc7XHJcbmltcG9ydCB7UGV0cmlOZXR9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9wZXRyaS1uZXQnO1xyXG5pbXBvcnQge0luY3JlbWVudGluZ0NvdW50ZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdHkvaW5jcmVtZW50aW5nLWNvdW50ZXInO1xyXG5pbXBvcnQge1BsYWNlfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGxhY2UnO1xyXG5pbXBvcnQge1RyYW5zaXRpb259IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC90cmFuc2l0aW9uJztcclxuaW1wb3J0IHtmb3JrSm9pbiwgbWFwLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtUcmFjZUNvbnZlcnNpb25SZXN1bHR9IGZyb20gJy4vdHJhY2UtY29udmVyc2lvbi1yZXN1bHQnO1xyXG5pbXBvcnQge1JlbGFiZWxlcn0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0eS9yZWxhYmVsZXInO1xyXG5pbXBvcnQge0xvZ0NsZWFuZXJ9IGZyb20gJy4uLy4uL2xvZy1jbGVhbmVyJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQWJlbE9yYWNsZVNlcnZpY2UgZXh0ZW5kcyBMb2dDbGVhbmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZWdpb25TeW50aGVzaXNTZXJ2aWNlOiBQZXRyaU5ldFJlZ2lvblN5bnRoZXNpc1NlcnZpY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXRlcm1pbmVDb25jdXJyZW5jeShsb2c6IEFycmF5PFRyYWNlPik6IE9ic2VydmFibGU8QXJyYXk8UGV0cmlOZXQ+PiB7XHJcbiAgICAgICAgY29uc3QgbXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzID0gdGhpcy5vYnRhaW5NdWx0aXNldEVxdWl2YWxlbnRUcmFjZXMobG9nKTtcclxuICAgICAgICByZXR1cm4gZm9ya0pvaW4obXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzLm1hcCh0cmFjZXMgPT4gdGhpcy5jb21wdXRlUGFydGlhbE9yZGVyRnJvbUVxdWl2YWxlbnRUcmFjZXModHJhY2VzKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb2J0YWluTXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzKGxvZzogQXJyYXk8VHJhY2U+KTogQXJyYXk8TXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzPiB7XHJcbiAgICAgICAgY29uc3QgbXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzID0gbmV3IE11bHRpc2V0TWFwPE11bHRpc2V0RXF1aXZhbGVudFRyYWNlcz4oKTtcclxuICAgICAgICBjb25zdCB0cmFjZVByZWZpeFRyZWUgPSBuZXcgUHJlZml4VHJlZTxNdWx0aXNldEVxdWl2YWxlbnRUcmFjZXM+KCk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBsb2cpIHtcclxuICAgICAgICAgICAgY29uc3QgdHJhY2UgPSB0aGlzLmNsZWFuVHJhY2UodCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtdWx0aXNldDogTXVsdGlzZXQgPSB7fTtcclxuICAgICAgICAgICAgdHJhY2VQcmVmaXhUcmVlLmluc2VydCh0cmFjZSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVxdWl2YWxlbmNlID0gbXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzLmdldChtdWx0aXNldCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXF1aXZhbGVuY2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVxdWl2YWxlbmNlID0gdGhpcy5jcmVhdGVFcXVpdmFsZW5jZSh0cmFjZSwgbXVsdGlzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpc2V0RXF1aXZhbGVudFRyYWNlcy5wdXQoZXF1aXZhbGVuY2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlcXVpdmFsZW5jZS5hZGRUcmFjZSh0cmFjZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXF1aXZhbGVuY2U7XHJcbiAgICAgICAgICAgIH0sIGVxdWl2YWxlbmNlID0+IHtcclxuICAgICAgICAgICAgICAgIGVxdWl2YWxlbmNlLmluY3JlbWVudENvdW50KCk7XHJcbiAgICAgICAgICAgIH0sIGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChtdWx0aXNldFtldmVudF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpc2V0W2V2ZW50XSA9IDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpc2V0W2V2ZW50XSArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtdWx0aXNldEVxdWl2YWxlbnRUcmFjZXMudmFsdWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVFcXVpdmFsZW5jZSh0cmFjZTogVHJhY2UsIG11bHRpc2V0OiBNdWx0aXNldCk6IE11bHRpc2V0RXF1aXZhbGVudFRyYWNlcyB7XHJcbiAgICAgICAgY29uc3QgZXF1aXZhbGVuY2UgPSBuZXcgTXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzKG11bHRpc2V0KTtcclxuICAgICAgICBlcXVpdmFsZW5jZS5hZGRUcmFjZSh0cmFjZSk7XHJcbiAgICAgICAgcmV0dXJuIGVxdWl2YWxlbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29tcHV0ZVBhcnRpYWxPcmRlckZyb21FcXVpdmFsZW50VHJhY2VzKHRyYWNlczogTXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzKTogT2JzZXJ2YWJsZTxQZXRyaU5ldD4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnZlcnNpb25SZXN1bHQgPSB0aGlzLmNvbnZlcnRUcmFjZXNUb1BldHJpTmV0cyh0cmFjZXMudHJhY2VzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZ2lvblN5bnRoZXNpc1NlcnZpY2Uuc3ludGhlc2lzZShjb252ZXJzaW9uUmVzdWx0Lm5ldHMsIHtvYnRhaW5QYXJ0aWFsT3JkZXJzOiB0cnVlLCBvbmVCb3VuZFJlZ2lvbnM6IHRydWV9KS5waXBlKFxyXG4gICAgICAgICAgICBtYXAociA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXQgPSB0aGlzLnJlbGFiZWxOZXQoci5yZXN1bHQsIGNvbnZlcnNpb25SZXN1bHQubGFiZWxNYXBwaW5nKTtcclxuICAgICAgICAgICAgICAgIG5ldC5mcmVxdWVuY3kgPSB0cmFjZXMuY291bnQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0VHJhY2VzVG9QZXRyaU5ldHModHJhY2VzOiBBcnJheTxUcmFjZT4pOiBUcmFjZUNvbnZlcnNpb25SZXN1bHQge1xyXG4gICAgICAgIGNvbnN0IHJlbGFiZWxlciA9IG5ldyBSZWxhYmVsZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV0czogQXJyYXk8UGV0cmlOZXQ+ID0gdHJhY2VzLm1hcCh0cmFjZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ldENvdW50ZXIgPSBuZXcgSW5jcmVtZW50aW5nQ291bnRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBuZXQgPSBuZXcgUGV0cmlOZXQoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsYXN0UGxhY2UgPSBuZXcgUGxhY2UoKTtcclxuICAgICAgICAgICAgbmV0LmFkZFBsYWNlKGxhc3RQbGFjZSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHRyYWNlLmV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IG5ldyBUcmFuc2l0aW9uKHJlbGFiZWxlci5nZXROZXdVbmlxdWVMYWJlbChldmVudC5uYW1lKSk7XHJcbiAgICAgICAgICAgICAgICBuZXQuYWRkVHJhbnNpdGlvbih0KTtcclxuICAgICAgICAgICAgICAgIG5ldC5hZGRBcmMobGFzdFBsYWNlLCB0KTtcclxuICAgICAgICAgICAgICAgIGxhc3RQbGFjZSA9IG5ldyBQbGFjZSgpO1xyXG4gICAgICAgICAgICAgICAgbmV0LmFkZFBsYWNlKGxhc3RQbGFjZSk7XHJcbiAgICAgICAgICAgICAgICBuZXQuYWRkQXJjKHQsIGxhc3RQbGFjZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlbGFiZWxlci5yZXN0YXJ0U2VxdWVuY2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmFjZUNvbnZlcnNpb25SZXN1bHQobmV0cywgcmVsYWJlbGVyLmdldExhYmVsTWFwcGluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbGFiZWxOZXQobmV0OiBQZXRyaU5ldCwgbGFiZWxNYXBwaW5nOiBNYXA8c3RyaW5nLCBzdHJpbmc+KTogUGV0cmlOZXQge1xyXG4gICAgICAgIG5ldC5nZXRUcmFuc2l0aW9ucygpLmZvckVhY2godCA9PiB7XHJcbiAgICAgICAgICAgIHQubGFiZWwgPSBsYWJlbE1hcHBpbmcuZ2V0KHQubGFiZWwhKSE7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldDtcclxuICAgIH1cclxufVxyXG4iXX0=