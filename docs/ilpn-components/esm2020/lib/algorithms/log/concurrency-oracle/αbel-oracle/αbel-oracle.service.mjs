import { Injectable } from '@angular/core';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { Place } from '../../../../models/pn/model/place';
import { Transition } from '../../../../models/pn/model/transition';
import { forkJoin, map } from 'rxjs';
import { TraceConversionResult } from './trace-conversion-result';
import { Relabeler } from '../../../../utility/relabeler';
import { TraceMultisetEquivalentStateTraverser } from '../../../../utility/multiset/trace-multiset-equivalent-state-traverser';
import * as i0 from "@angular/core";
import * as i1 from "../../../pn/regions/petri-net-region-synthesis.service";
export class AbelOracleService {
    constructor(_regionSynthesisService) {
        this._regionSynthesisService = _regionSynthesisService;
    }
    determineConcurrency(log) {
        const multisetEquivalentTraces = this.obtainMultisetEquivalentTraces(log);
        return forkJoin(multisetEquivalentTraces.map(traces => this.computePartialOrderFromEquivalentTraces(traces)));
    }
    obtainMultisetEquivalentTraces(log) {
        const explorer = new TraceMultisetEquivalentStateTraverser();
        return explorer.traverseMultisetEquivalentStates(log);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoizrFiZWwtb3JhY2xlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9sb2cvY29uY3VycmVuY3ktb3JhY2xlL86xYmVsLW9yYWNsZS/OsWJlbC1vcmFjbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSXpDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUMvRCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDeEQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUN4RCxPQUFPLEVBQ0gscUNBQXFDLEVBQ3hDLE1BQU0sd0VBQXdFLENBQUM7OztBQU1oRixNQUFNLE9BQU8saUJBQWlCO0lBRTFCLFlBQW9CLHVCQUF1RDtRQUF2RCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQWdDO0lBQzNFLENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxHQUFpQjtRQUN6QyxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxRSxPQUFPLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xILENBQUM7SUFFTyw4QkFBOEIsQ0FBQyxHQUFpQjtRQUNwRCxNQUFNLFFBQVEsR0FBRyxJQUFJLHFDQUFxQyxFQUFFLENBQUM7UUFDN0QsT0FBTyxRQUFRLENBQUMsZ0NBQWdDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVPLHVDQUF1QyxDQUFDLE1BQWdDO1FBQzVFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0RSxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEVBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FDMUgsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ0osTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUM3QixPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUNMLENBQUM7SUFDTixDQUFDO0lBRU8sd0JBQXdCLENBQUMsTUFBb0I7UUFDakQsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUVsQyxNQUFNLElBQUksR0FBb0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBRTNCLElBQUksU0FBUyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7WUFDNUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUV4QixLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQzlCLE1BQU0sQ0FBQyxHQUFHLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUN4QixHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUM1QjtZQUVELFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUM1QixPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLHFCQUFxQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRU8sVUFBVSxDQUFDLEdBQWEsRUFBRSxZQUFpQztRQUMvRCxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzdCLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBTSxDQUFFLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7OzhHQXpEUSxpQkFBaUI7a0hBQWpCLGlCQUFpQixjQUZkLE1BQU07MkZBRVQsaUJBQWlCO2tCQUg3QixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7VHJhY2V9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9sb2cvbW9kZWwvdHJhY2UnO1xyXG5pbXBvcnQge011bHRpc2V0RXF1aXZhbGVudFRyYWNlc30gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0eS9tdWx0aXNldC9tdWx0aXNldC1lcXVpdmFsZW50LXRyYWNlcyc7XHJcbmltcG9ydCB7UGV0cmlOZXRSZWdpb25TeW50aGVzaXNTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9wbi9yZWdpb25zL3BldHJpLW5ldC1yZWdpb24tc3ludGhlc2lzLnNlcnZpY2UnO1xyXG5pbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtQbGFjZX0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BsYWNlJztcclxuaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvdHJhbnNpdGlvbic7XHJcbmltcG9ydCB7Zm9ya0pvaW4sIG1hcCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7VHJhY2VDb252ZXJzaW9uUmVzdWx0fSBmcm9tICcuL3RyYWNlLWNvbnZlcnNpb24tcmVzdWx0JztcclxuaW1wb3J0IHtSZWxhYmVsZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdHkvcmVsYWJlbGVyJztcclxuaW1wb3J0IHtcclxuICAgIFRyYWNlTXVsdGlzZXRFcXVpdmFsZW50U3RhdGVUcmF2ZXJzZXJcclxufSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXR5L211bHRpc2V0L3RyYWNlLW11bHRpc2V0LWVxdWl2YWxlbnQtc3RhdGUtdHJhdmVyc2VyJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEFiZWxPcmFjbGVTZXJ2aWNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZWdpb25TeW50aGVzaXNTZXJ2aWNlOiBQZXRyaU5ldFJlZ2lvblN5bnRoZXNpc1NlcnZpY2UpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGV0ZXJtaW5lQ29uY3VycmVuY3kobG9nOiBBcnJheTxUcmFjZT4pOiBPYnNlcnZhYmxlPEFycmF5PFBldHJpTmV0Pj4ge1xyXG4gICAgICAgIGNvbnN0IG11bHRpc2V0RXF1aXZhbGVudFRyYWNlcyA9IHRoaXMub2J0YWluTXVsdGlzZXRFcXVpdmFsZW50VHJhY2VzKGxvZyk7XHJcbiAgICAgICAgcmV0dXJuIGZvcmtKb2luKG11bHRpc2V0RXF1aXZhbGVudFRyYWNlcy5tYXAodHJhY2VzID0+IHRoaXMuY29tcHV0ZVBhcnRpYWxPcmRlckZyb21FcXVpdmFsZW50VHJhY2VzKHRyYWNlcykpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9idGFpbk11bHRpc2V0RXF1aXZhbGVudFRyYWNlcyhsb2c6IEFycmF5PFRyYWNlPik6IEFycmF5PE11bHRpc2V0RXF1aXZhbGVudFRyYWNlcz4ge1xyXG4gICAgICAgIGNvbnN0IGV4cGxvcmVyID0gbmV3IFRyYWNlTXVsdGlzZXRFcXVpdmFsZW50U3RhdGVUcmF2ZXJzZXIoKTtcclxuICAgICAgICByZXR1cm4gZXhwbG9yZXIudHJhdmVyc2VNdWx0aXNldEVxdWl2YWxlbnRTdGF0ZXMobG9nKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbXB1dGVQYXJ0aWFsT3JkZXJGcm9tRXF1aXZhbGVudFRyYWNlcyh0cmFjZXM6IE11bHRpc2V0RXF1aXZhbGVudFRyYWNlcyk6IE9ic2VydmFibGU8UGV0cmlOZXQ+IHtcclxuICAgICAgICBjb25zdCBjb252ZXJzaW9uUmVzdWx0ID0gdGhpcy5jb252ZXJ0VHJhY2VzVG9QZXRyaU5ldHModHJhY2VzLnRyYWNlcyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWdpb25TeW50aGVzaXNTZXJ2aWNlLnN5bnRoZXNpc2UoY29udmVyc2lvblJlc3VsdC5uZXRzLCB7b2J0YWluUGFydGlhbE9yZGVyczogdHJ1ZSwgb25lQm91bmRSZWdpb25zOiB0cnVlfSkucGlwZShcclxuICAgICAgICAgICAgbWFwKHIgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV0ID0gdGhpcy5yZWxhYmVsTmV0KHIucmVzdWx0LCBjb252ZXJzaW9uUmVzdWx0LmxhYmVsTWFwcGluZyk7XHJcbiAgICAgICAgICAgICAgICBuZXQuZnJlcXVlbmN5ID0gdHJhY2VzLmNvdW50O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udmVydFRyYWNlc1RvUGV0cmlOZXRzKHRyYWNlczogQXJyYXk8VHJhY2U+KTogVHJhY2VDb252ZXJzaW9uUmVzdWx0IHtcclxuICAgICAgICBjb25zdCByZWxhYmVsZXIgPSBuZXcgUmVsYWJlbGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5ldHM6IEFycmF5PFBldHJpTmV0PiA9IHRyYWNlcy5tYXAodHJhY2UgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuZXQgPSBuZXcgUGV0cmlOZXQoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsYXN0UGxhY2UgPSBuZXcgUGxhY2UoKTtcclxuICAgICAgICAgICAgbmV0LmFkZFBsYWNlKGxhc3RQbGFjZSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHRyYWNlLmV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IG5ldyBUcmFuc2l0aW9uKHJlbGFiZWxlci5nZXROZXdVbmlxdWVMYWJlbChldmVudC5uYW1lKSk7XHJcbiAgICAgICAgICAgICAgICBuZXQuYWRkVHJhbnNpdGlvbih0KTtcclxuICAgICAgICAgICAgICAgIG5ldC5hZGRBcmMobGFzdFBsYWNlLCB0KTtcclxuICAgICAgICAgICAgICAgIGxhc3RQbGFjZSA9IG5ldyBQbGFjZSgpO1xyXG4gICAgICAgICAgICAgICAgbmV0LmFkZFBsYWNlKGxhc3RQbGFjZSk7XHJcbiAgICAgICAgICAgICAgICBuZXQuYWRkQXJjKHQsIGxhc3RQbGFjZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlbGFiZWxlci5yZXN0YXJ0U2VxdWVuY2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUcmFjZUNvbnZlcnNpb25SZXN1bHQobmV0cywgcmVsYWJlbGVyLmdldExhYmVsTWFwcGluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbGFiZWxOZXQobmV0OiBQZXRyaU5ldCwgbGFiZWxNYXBwaW5nOiBNYXA8c3RyaW5nLCBzdHJpbmc+KTogUGV0cmlOZXQge1xyXG4gICAgICAgIG5ldC5nZXRUcmFuc2l0aW9ucygpLmZvckVhY2godCA9PiB7XHJcbiAgICAgICAgICAgIHQubGFiZWwgPSBsYWJlbE1hcHBpbmcuZ2V0KHQubGFiZWwhKSE7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldDtcclxuICAgIH1cclxufVxyXG4iXX0=