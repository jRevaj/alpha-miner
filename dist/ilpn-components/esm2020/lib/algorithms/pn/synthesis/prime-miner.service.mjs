import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, EMPTY, filter, from, map } from 'rxjs';
import { PetriNet } from '../../../models/pn/model/petri-net';
import { PrimeMinerResult } from './prime-miner-result';
import * as i0 from "@angular/core";
import * as i1 from "../regions/petri-net-region-synthesis.service";
import * as i2 from "../isomorphism/petri-net-isomorphism.service";
import * as i3 from "../transformation/implicit-place-remover.service";
export class PrimeMinerService {
    constructor(_synthesisService, _isomorphismService, _implicitPlaceRemover) {
        this._synthesisService = _synthesisService;
        this._isomorphismService = _isomorphismService;
        this._implicitPlaceRemover = _implicitPlaceRemover;
    }
    mine(minerInputs, config = {}) {
        if (minerInputs.length === 0) {
            console.error('Miner input must be non empty');
            return EMPTY;
        }
        minerInputs.sort((a, b) => (b.net?.frequency ?? 0) - (a.net?.frequency ?? 0));
        let bestResult = new PrimeMinerResult(new PetriNet(), [], []);
        let nextInputIndex = 1;
        const minerInput$ = new BehaviorSubject(minerInputs[0]);
        return minerInput$.pipe(concatMap(nextInput => {
            return this._synthesisService.synthesise([bestResult.net, nextInput.net], config).pipe(map(result => ({ result, containedTraces: [...bestResult.containedTraces, ...nextInput.containedTraces] })));
        }), map(result => {
            console.debug(`Iteration ${nextInputIndex} completed`, result);
            const synthesisedNet = result.result.result;
            const r = [];
            if (this.isConnected(synthesisedNet)) {
                let noImplicit = this._implicitPlaceRemover.removeImplicitPlaces(synthesisedNet);
                if (!this._isomorphismService.arePetriNetsIsomorphic(bestResult.net, noImplicit)
                    && !bestResult.net.isEmpty()) {
                    r.push(bestResult);
                }
                bestResult = new PrimeMinerResult(noImplicit, [...bestResult.supportedPoIndices, nextInputIndex], result.containedTraces);
                if (nextInputIndex === minerInputs.length) {
                    r.push(bestResult);
                }
            }
            if (nextInputIndex < minerInputs.length) {
                minerInput$.next(minerInputs[nextInputIndex]);
                nextInputIndex++;
            }
            else {
                minerInput$.complete();
            }
            console.debug('best running result', bestResult);
            return r;
        }), filter(a => a.length > 0), concatMap(a => from(a)));
    }
    isConnected(net) {
        return net.getTransitions().every(t => t.ingoingArcs.length > 0);
    }
}
PrimeMinerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, deps: [{ token: i1.PetriNetRegionSynthesisService }, { token: i2.PetriNetIsomorphismService }, { token: i3.ImplicitPlaceRemoverService }], target: i0.ɵɵFactoryTarget.Injectable });
PrimeMinerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetRegionSynthesisService }, { type: i2.PetriNetIsomorphismService }, { type: i3.ImplicitPlaceRemoverService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWUtbWluZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL3BuL3N5bnRoZXNpcy9wcmltZS1taW5lci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQ3RGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUc1RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7QUFRdEQsTUFBTSxPQUFPLGlCQUFpQjtJQUUxQixZQUFzQixpQkFBaUQsRUFDakQsbUJBQStDLEVBQy9DLHFCQUFrRDtRQUZsRCxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWdDO1FBQ2pELHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBNEI7UUFDL0MsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUE2QjtJQUN4RSxDQUFDO0lBRU0sSUFBSSxDQUFDLFdBQXNELEVBQUUsU0FBK0IsRUFBRTtRQUNqRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUMvQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUMs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QUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb25jYXRNYXAsIEVNUFRZLCBmaWx0ZXIsIGZyb20sIG1hcCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UGV0cmlOZXR9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9wZXRyaS1uZXQnO1xyXG5pbXBvcnQge1BldHJpTmV0UmVnaW9uU3ludGhlc2lzU2VydmljZX0gZnJvbSAnLi4vcmVnaW9ucy9wZXRyaS1uZXQtcmVnaW9uLXN5bnRoZXNpcy5zZXJ2aWNlJztcclxuaW1wb3J0IHtSZWdpb25zQ29uZmlndXJhdGlvbn0gZnJvbSAnLi4vcmVnaW9ucy9jbGFzc2VzL3JlZ2lvbnMtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7UHJpbWVNaW5lclJlc3VsdH0gZnJvbSAnLi9wcmltZS1taW5lci1yZXN1bHQnO1xyXG5pbXBvcnQge1BldHJpTmV0SXNvbW9ycGhpc21TZXJ2aWNlfSBmcm9tICcuLi9pc29tb3JwaGlzbS9wZXRyaS1uZXQtaXNvbW9ycGhpc20uc2VydmljZSc7XHJcbmltcG9ydCB7SW1wbGljaXRQbGFjZVJlbW92ZXJTZXJ2aWNlfSBmcm9tICcuLi90cmFuc2Zvcm1hdGlvbi9pbXBsaWNpdC1wbGFjZS1yZW1vdmVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge1BhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXN9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9wYXJ0aWFsLW9yZGVyLW5ldC13aXRoLWNvbnRhaW5lZC10cmFjZXMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQcmltZU1pbmVyU2VydmljZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9zeW50aGVzaXNTZXJ2aWNlOiBQZXRyaU5ldFJlZ2lvblN5bnRoZXNpc1NlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2lzb21vcnBoaXNtU2VydmljZTogUGV0cmlOZXRJc29tb3JwaGlzbVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2ltcGxpY2l0UGxhY2VSZW1vdmVyOiBJbXBsaWNpdFBsYWNlUmVtb3ZlclNlcnZpY2UpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbWluZShtaW5lcklucHV0czogQXJyYXk8UGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlcz4sIGNvbmZpZzogUmVnaW9uc0NvbmZpZ3VyYXRpb24gPSB7fSk6IE9ic2VydmFibGU8UHJpbWVNaW5lclJlc3VsdD4ge1xyXG4gICAgICAgIGlmIChtaW5lcklucHV0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTWluZXIgaW5wdXQgbXVzdCBiZSBub24gZW1wdHknKTtcclxuICAgICAgICAgICAgcmV0dXJuIEVNUFRZO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWluZXJJbnB1dHMuc29ydCgoYSwgYikgPT4gKGIubmV0Py5mcmVxdWVuY3kgPz8gMCkgLSAoYS5uZXQ/LmZyZXF1ZW5jeSA/PyAwKSk7XHJcblxyXG4gICAgICAgIGxldCBiZXN0UmVzdWx0ID0gbmV3IFByaW1lTWluZXJSZXN1bHQobmV3IFBldHJpTmV0KCksIFtdLCBbXSk7XHJcbiAgICAgICAgbGV0IG5leHRJbnB1dEluZGV4ID0gMTtcclxuXHJcbiAgICAgICAgY29uc3QgbWluZXJJbnB1dCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KG1pbmVySW5wdXRzWzBdKTtcclxuICAgICAgICByZXR1cm4gbWluZXJJbnB1dCQucGlwZShcclxuICAgICAgICAgICAgY29uY2F0TWFwKG5leHRJbnB1dCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ludGhlc2lzU2VydmljZS5zeW50aGVzaXNlKFtiZXN0UmVzdWx0Lm5ldCwgbmV4dElucHV0Lm5ldF0sIGNvbmZpZykucGlwZShtYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0+ICh7cmVzdWx0LCBjb250YWluZWRUcmFjZXM6IFsuLi5iZXN0UmVzdWx0LmNvbnRhaW5lZFRyYWNlcywgLi4ubmV4dElucHV0LmNvbnRhaW5lZFRyYWNlc119KVxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBtYXAocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYEl0ZXJhdGlvbiAke25leHRJbnB1dEluZGV4fSBjb21wbGV0ZWRgLCByZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHN5bnRoZXNpc2VkTmV0ID0gcmVzdWx0LnJlc3VsdC5yZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByOiBBcnJheTxQcmltZU1pbmVyUmVzdWx0PiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoc3ludGhlc2lzZWROZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vSW1wbGljaXQgPSB0aGlzLl9pbXBsaWNpdFBsYWNlUmVtb3Zlci5yZW1vdmVJbXBsaWNpdFBsYWNlcyhzeW50aGVzaXNlZE5ldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5faXNvbW9ycGhpc21TZXJ2aWNlLmFyZVBldHJpTmV0c0lzb21vcnBoaWMoYmVzdFJlc3VsdC5uZXQsIG5vSW1wbGljaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICFiZXN0UmVzdWx0Lm5ldC5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgci5wdXNoKGJlc3RSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmVzdFJlc3VsdCA9IG5ldyBQcmltZU1pbmVyUmVzdWx0KG5vSW1wbGljaXQsIFsuLi5iZXN0UmVzdWx0LnN1cHBvcnRlZFBvSW5kaWNlcywgbmV4dElucHV0SW5kZXhdLCByZXN1bHQuY29udGFpbmVkVHJhY2VzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbnB1dEluZGV4ID09PSBtaW5lcklucHV0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgci5wdXNoKGJlc3RSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dElucHV0SW5kZXggPCBtaW5lcklucHV0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBtaW5lcklucHV0JC5uZXh0KG1pbmVySW5wdXRzW25leHRJbnB1dEluZGV4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dElucHV0SW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWluZXJJbnB1dCQuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdiZXN0IHJ1bm5pbmcgcmVzdWx0JywgYmVzdFJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGZpbHRlcihhID0+IGEubGVuZ3RoID4gMCksXHJcbiAgICAgICAgICAgIGNvbmNhdE1hcChhID0+IGZyb20oYSkpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlzQ29ubmVjdGVkKG5ldDogUGV0cmlOZXQpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbmV0LmdldFRyYW5zaXRpb25zKCkuZXZlcnkodCA9PiB0LmluZ29pbmdBcmNzLmxlbmd0aCA+IDApO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==