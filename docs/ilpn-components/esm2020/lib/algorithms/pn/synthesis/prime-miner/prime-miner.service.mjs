import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, EMPTY, filter, from, map, of } from 'rxjs';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { PrimeMinerResult } from './prime-miner-result';
import { PrimeMinerInput } from './prime-miner-input';
import { LpoFireValidator } from '../../validation/lpo-fire-validator';
import { SynthesisResult } from '../../regions/classes/synthesis-result';
import * as i0 from "@angular/core";
import * as i1 from "../../regions/petri-net-region-synthesis.service";
import * as i2 from "../../isomorphism/petri-net-isomorphism.service";
import * as i3 from "../../transformation/implicit-place-remover.service";
import * as i4 from "../../transformation/petri-net-to-partial-order-transformer.service";
export class PrimeMinerService {
    constructor(_synthesisService, _isomorphismService, _implicitPlaceRemover, _pnToPoTransformer) {
        this._synthesisService = _synthesisService;
        this._isomorphismService = _isomorphismService;
        this._implicitPlaceRemover = _implicitPlaceRemover;
        this._pnToPoTransformer = _pnToPoTransformer;
    }
    mine(minerInputs, config = {}) {
        if (minerInputs.length === 0) {
            console.error('Miner input must be non empty');
            return EMPTY;
        }
        minerInputs.sort((a, b) => (b.net?.frequency ?? 0) - (a.net?.frequency ?? 0));
        let bestResult = new PrimeMinerResult(new PetriNet(), [], []);
        let nextInputIndex = 1;
        const minerInput$ = new BehaviorSubject(PrimeMinerInput.fromPartialOrder(minerInputs[0], true));
        return minerInput$.pipe(concatMap(nextInput => {
            let mustSynthesise = nextInput.lastIterationChangedModel;
            if (!nextInput.lastIterationChangedModel) {
                const po = this._pnToPoTransformer.transform(nextInput.net);
                try {
                    const validator = new LpoFireValidator(bestResult.net, po);
                    mustSynthesise = validator.validate().some(r => !r.valid);
                }
                catch (e) {
                    mustSynthesise = true;
                }
            }
            if (mustSynthesise) {
                return this._synthesisService.synthesise([bestResult.net, nextInput.net], config).pipe(map(result => ({
                    result,
                    containedTraces: [...bestResult.containedTraces, ...nextInput.containedTraces]
                })));
            }
            else {
                return of({
                    result: new SynthesisResult([bestResult.net], bestResult.net),
                    containedTraces: bestResult.containedTraces,
                    unchanged: true
                });
            }
        }), map((result) => {
            console.debug(`Iteration ${nextInputIndex} completed`, result);
            const synthesisedNet = result.result.result;
            const r = [];
            let changed = !result.unchanged;
            if (changed && (config.skipConnectivityCheck || this.isConnected(synthesisedNet))) {
                let noImplicit = this._implicitPlaceRemover.removeImplicitPlaces(synthesisedNet);
                changed = !this._isomorphismService.arePetriNetsIsomorphic(bestResult.net, noImplicit);
                if (changed && !bestResult.net.isEmpty()) {
                    r.push(bestResult);
                }
                bestResult = new PrimeMinerResult(noImplicit, [...bestResult.supportedPoIndices, nextInputIndex], result.containedTraces);
            }
            if (nextInputIndex === minerInputs.length) {
                r.push(bestResult);
            }
            if (nextInputIndex < minerInputs.length) {
                minerInput$.next(PrimeMinerInput.fromPartialOrder(minerInputs[nextInputIndex], changed));
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
PrimeMinerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, deps: [{ token: i1.PetriNetRegionSynthesisService }, { token: i2.PetriNetIsomorphismService }, { token: i3.ImplicitPlaceRemoverService }, { token: i4.PetriNetToPartialOrderTransformerService }], target: i0.ɵɵFactoryTarget.Injectable });
PrimeMinerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PrimeMinerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetRegionSynthesisService }, { type: i2.PetriNetIsomorphismService }, { type: i3.ImplicitPlaceRemoverService }, { type: i4.PetriNetToPartialOrderTransformerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWUtbWluZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL3BuL3N5bnRoZXNpcy9wcmltZS1taW5lci9wcmltZS1taW5lci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFjLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMxRixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFFL0QsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFJdEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBSXJFLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQzs7Ozs7O0FBUXZFLE1BQU0sT0FBTyxpQkFBaUI7SUFFMUIsWUFBc0IsaUJBQWlELEVBQ2pELG1CQUErQyxFQUMvQyxxQkFBa0QsRUFDbEQsa0JBQTREO1FBSDVELHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBZ0M7UUFDakQsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUE0QjtRQUMvQywwQkFBcUIsR0FBckIscUJBQXFCLENBQTZCO1FBQ2xELHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEM7SUFDbEYsQ0FBQztJQUVNLElBQUksQ0FBQyxXQUFzRCxFQUFFLFNBQWtDLEVBQUU7UUFDcEcsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMxQixPQUFPLENBQUMsS0FBSyxDQUFDLCtC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Q0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDOzs4R0F2RlEsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FGZCxNQUFNOzJGQUVULGlCQUFpQjtrQkFIN0IsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29uY2F0TWFwLCBFTVBUWSwgZmlsdGVyLCBmcm9tLCBtYXAsIE9ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtQZXRyaU5ldH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BldHJpLW5ldCc7XHJcbmltcG9ydCB7UGV0cmlOZXRSZWdpb25TeW50aGVzaXNTZXJ2aWNlfSBmcm9tICcuLi8uLi9yZWdpb25zL3BldHJpLW5ldC1yZWdpb24tc3ludGhlc2lzLnNlcnZpY2UnO1xyXG5pbXBvcnQge1ByaW1lTWluZXJSZXN1bHR9IGZyb20gJy4vcHJpbWUtbWluZXItcmVzdWx0JztcclxuaW1wb3J0IHtQZXRyaU5ldElzb21vcnBoaXNtU2VydmljZX0gZnJvbSAnLi4vLi4vaXNvbW9ycGhpc20vcGV0cmktbmV0LWlzb21vcnBoaXNtLnNlcnZpY2UnO1xyXG5pbXBvcnQge0ltcGxpY2l0UGxhY2VSZW1vdmVyU2VydmljZX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtYXRpb24vaW1wbGljaXQtcGxhY2UtcmVtb3Zlci5zZXJ2aWNlJztcclxuaW1wb3J0IHtQYXJ0aWFsT3JkZXJOZXRXaXRoQ29udGFpbmVkVHJhY2VzfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGFydGlhbC1vcmRlci1uZXQtd2l0aC1jb250YWluZWQtdHJhY2VzJztcclxuaW1wb3J0IHtQcmltZU1pbmVySW5wdXR9IGZyb20gJy4vcHJpbWUtbWluZXItaW5wdXQnO1xyXG5pbXBvcnQge0xwb0ZpcmVWYWxpZGF0b3J9IGZyb20gJy4uLy4uL3ZhbGlkYXRpb24vbHBvLWZpcmUtdmFsaWRhdG9yJztcclxuaW1wb3J0IHtcclxuICAgIFBldHJpTmV0VG9QYXJ0aWFsT3JkZXJUcmFuc2Zvcm1lclNlcnZpY2VcclxufSBmcm9tICcuLi8uLi90cmFuc2Zvcm1hdGlvbi9wZXRyaS1uZXQtdG8tcGFydGlhbC1vcmRlci10cmFuc2Zvcm1lci5zZXJ2aWNlJztcclxuaW1wb3J0IHtTeW50aGVzaXNSZXN1bHR9IGZyb20gJy4uLy4uL3JlZ2lvbnMvY2xhc3Nlcy9zeW50aGVzaXMtcmVzdWx0JztcclxuaW1wb3J0IHtUcmFjZX0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL2xvZy9tb2RlbC90cmFjZSc7XHJcbmltcG9ydCB7UHJpbWVNaW5lckNvbmZpZ3VyYXRpb259IGZyb20gJy4vcHJpbWUtbWluZXItY29uZmlndXJhdGlvbic7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQcmltZU1pbmVyU2VydmljZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9zeW50aGVzaXNTZXJ2aWNlOiBQZXRyaU5ldFJlZ2lvblN5bnRoZXNpc1NlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2lzb21vcnBoaXNtU2VydmljZTogUGV0cmlOZXRJc29tb3JwaGlzbVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2ltcGxpY2l0UGxhY2VSZW1vdmVyOiBJbXBsaWNpdFBsYWNlUmVtb3ZlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgX3BuVG9Qb1RyYW5zZm9ybWVyOiBQZXRyaU5ldFRvUGFydGlhbE9yZGVyVHJhbnNmb3JtZXJTZXJ2aWNlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1pbmUobWluZXJJbnB1dHM6IEFycmF5PFBhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXM+LCBjb25maWc6IFByaW1lTWluZXJDb25maWd1cmF0aW9uID0ge30pOiBPYnNlcnZhYmxlPFByaW1lTWluZXJSZXN1bHQ+IHtcclxuICAgICAgICBpZiAobWluZXJJbnB1dHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ01pbmVyIGlucHV0IG11c3QgYmUgbm9uIGVtcHR5Jyk7XHJcbiAgICAgICAgICAgIHJldHVybiBFTVBUWTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1pbmVySW5wdXRzLnNvcnQoKGEsIGIpID0+IChiLm5ldD8uZnJlcXVlbmN5ID8/IDApIC0gKGEubmV0Py5mcmVxdWVuY3kgPz8gMCkpO1xyXG5cclxuICAgICAgICBsZXQgYmVzdFJlc3VsdCA9IG5ldyBQcmltZU1pbmVyUmVzdWx0KG5ldyBQZXRyaU5ldCgpLCBbXSwgW10pO1xyXG4gICAgICAgIGxldCBuZXh0SW5wdXRJbmRleCA9IDE7XHJcblxyXG4gICAgICAgIGNvbnN0IG1pbmVySW5wdXQkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxQcmltZU1pbmVySW5wdXQ+KFByaW1lTWluZXJJbnB1dC5mcm9tUGFydGlhbE9yZGVyKG1pbmVySW5wdXRzWzBdLCB0cnVlKSk7XHJcbiAgICAgICAgcmV0dXJuIG1pbmVySW5wdXQkLnBpcGUoXHJcbiAgICAgICAgICAgIGNvbmNhdE1hcChuZXh0SW5wdXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG11c3RTeW50aGVzaXNlID0gbmV4dElucHV0Lmxhc3RJdGVyYXRpb25DaGFuZ2VkTW9kZWw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5leHRJbnB1dC5sYXN0SXRlcmF0aW9uQ2hhbmdlZE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG8gPSB0aGlzLl9wblRvUG9UcmFuc2Zvcm1lci50cmFuc2Zvcm0obmV4dElucHV0Lm5ldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9yID0gbmV3IExwb0ZpcmVWYWxpZGF0b3IoYmVzdFJlc3VsdC5uZXQsIHBvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXVzdFN5bnRoZXNpc2UgPSB2YWxpZGF0b3IudmFsaWRhdGUoKS5zb21lKHIgPT4gIXIudmFsaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXVzdFN5bnRoZXNpc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobXVzdFN5bnRoZXNpc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ludGhlc2lzU2VydmljZS5zeW50aGVzaXNlKFtiZXN0UmVzdWx0Lm5ldCwgbmV4dElucHV0Lm5ldF0sIGNvbmZpZykucGlwZShtYXAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVkVHJhY2VzOiBbLi4uYmVzdFJlc3VsdC5jb250YWluZWRUcmFjZXMsIC4uLm5leHRJbnB1dC5jb250YWluZWRUcmFjZXNdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogbmV3IFN5bnRoZXNpc1Jlc3VsdChbYmVzdFJlc3VsdC5uZXRdLCBiZXN0UmVzdWx0Lm5ldCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lZFRyYWNlczogYmVzdFJlc3VsdC5jb250YWluZWRUcmFjZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuY2hhbmdlZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbWFwKChyZXN1bHQ6IHtyZXN1bHQ6IFN5bnRoZXNpc1Jlc3VsdCwgY29udGFpbmVkVHJhY2VzOiBBcnJheTxUcmFjZT4sIHVuY2hhbmdlZD86IGJvb2xlYW59KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBJdGVyYXRpb24gJHtuZXh0SW5wdXRJbmRleH0gY29tcGxldGVkYCwgcmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzeW50aGVzaXNlZE5ldCA9IHJlc3VsdC5yZXN1bHQucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcjogQXJyYXk8UHJpbWVNaW5lclJlc3VsdD4gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2hhbmdlZCA9ICFyZXN1bHQudW5jaGFuZ2VkO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZWQgJiYgKGNvbmZpZy5za2lwQ29ubmVjdGl2aXR5Q2hlY2sgfHwgdGhpcy5pc0Nvbm5lY3RlZChzeW50aGVzaXNlZE5ldCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vSW1wbGljaXQgPSB0aGlzLl9pbXBsaWNpdFBsYWNlUmVtb3Zlci5yZW1vdmVJbXBsaWNpdFBsYWNlcyhzeW50aGVzaXNlZE5ldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSAhdGhpcy5faXNvbW9ycGhpc21TZXJ2aWNlLmFyZVBldHJpTmV0c0lzb21vcnBoaWMoYmVzdFJlc3VsdC5uZXQsIG5vSW1wbGljaXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkICYmICFiZXN0UmVzdWx0Lm5ldC5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgci5wdXNoKGJlc3RSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYmVzdFJlc3VsdCA9IG5ldyBQcmltZU1pbmVyUmVzdWx0KG5vSW1wbGljaXQsIFsuLi5iZXN0UmVzdWx0LnN1cHBvcnRlZFBvSW5kaWNlcywgbmV4dElucHV0SW5kZXhdLCByZXN1bHQuY29udGFpbmVkVHJhY2VzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dElucHV0SW5kZXggPT09IG1pbmVySW5wdXRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHIucHVzaChiZXN0UmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dElucHV0SW5kZXggPCBtaW5lcklucHV0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBtaW5lcklucHV0JC5uZXh0KFByaW1lTWluZXJJbnB1dC5mcm9tUGFydGlhbE9yZGVyKG1pbmVySW5wdXRzW25leHRJbnB1dEluZGV4XSwgY2hhbmdlZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRJbnB1dEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbmVySW5wdXQkLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnYmVzdCBydW5uaW5nIHJlc3VsdCcsIGJlc3RSZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBmaWx0ZXIoYSA9PiBhLmxlbmd0aCA+IDApLFxyXG4gICAgICAgICAgICBjb25jYXRNYXAoYSA9PiBmcm9tKGEpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc0Nvbm5lY3RlZChuZXQ6IFBldHJpTmV0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldC5nZXRUcmFuc2l0aW9ucygpLmV2ZXJ5KHQgPT4gdC5pbmdvaW5nQXJjcy5sZW5ndGggPiAwKTtcclxuICAgIH1cclxufVxyXG4iXX0=