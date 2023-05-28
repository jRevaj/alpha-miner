import { Injectable } from '@angular/core';
import { IlpSolverService } from '../../../../utility/glpk/ilp-solver.service';
import { map } from 'rxjs';
import { Ilp2MinerIlpSolver } from './ilp2-miner-ilp-solver';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { Transition } from '../../../../models/pn/model/transition';
import { Place } from '../../../../models/pn/model/place';
import { VariableType } from '../../../../utility/glpk/model/variable-type';
import { LogSymbol } from '../../../log/log-symbol';
import * as i0 from "@angular/core";
import * as i1 from "../../transformation/duplicate-place-remover.service";
export class Ilp2MinerService extends IlpSolverService {
    constructor(_duplicatePlaceRemover) {
        super();
        this._duplicatePlaceRemover = _duplicatePlaceRemover;
    }
    mine(pos) {
        const solver = new Ilp2MinerIlpSolver(this._solver$.asObservable());
        return solver.findSolutions(pos).pipe(map(solutions => {
            let net = new PetriNet();
            const transitionMap = new Map();
            for (const placeSolution of solutions) {
                const place = new Place();
                net.addPlace(place);
                // TODO fix the hack, if the goal variables become generals
                const goalVariables = placeSolution.ilp.binaries;
                Object.entries(placeSolution.solution.result.vars).forEach(([variable, value]) => {
                    if (!goalVariables.some(g => g === variable)) {
                        return;
                    }
                    const decoded = solver.getInverseVariableMapping(variable);
                    let t;
                    if (value === 0) {
                        return;
                    }
                    switch (decoded.type) {
                        case VariableType.INITIAL_MARKING:
                            place.marking = value;
                            return;
                        case VariableType.INGOING_WEIGHT:
                            t = this.getTransition(decoded.label, net, transitionMap);
                            net.addArc(place, t, value);
                            return;
                        case VariableType.OUTGOING_WEIGHT:
                            t = this.getTransition(decoded.label, net, transitionMap);
                            net.addArc(t, place, value);
                            return;
                    }
                });
            }
            for (const t of net.getTransitions()) {
                if (t.ingoingArcs.length === 0) {
                    const p = new Place(1);
                    net.addPlace(p);
                    net.addArc(p, t);
                }
                if (t.outgoingArcs.length === 0) {
                    const p = new Place();
                    net.addPlace(p);
                    net.addArc(t, p);
                }
            }
            net = this._duplicatePlaceRemover.removeDuplicatePlaces(net);
            this.removeArtificialStartTransition(net);
            return {
                net,
                report: [`number of inequalities: ${solutions[0].ilp.subjectTo.length - 2}`, `number of variables: ${solutions[0].ilp.binaries.length + solutions[0].ilp.generals.length}`]
            };
        }));
    }
    getTransition(label, net, map) {
        let t = map.get(label);
        if (t !== undefined) {
            return t;
        }
        t = new Transition(label);
        net.addTransition(t);
        map.set(label, t);
        return t;
    }
    removeArtificialStartTransition(net) {
        const start = net.getTransitions().find(t => t.label === LogSymbol.START);
        if (start === undefined) {
            return;
        }
        for (const outA of start.outgoingArcs) {
            const p = outA.destination;
            p.marking += p.marking + outA.weight;
        }
        for (const inA of start.ingoingArcs) {
            const p = inA.source;
            net.removePlace(p);
        }
        net.removeTransition(start);
    }
}
Ilp2MinerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: Ilp2MinerService, deps: [{ token: i1.DuplicatePlaceRemoverService }], target: i0.ɵɵFactoryTarget.Injectable });
Ilp2MinerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: Ilp2MinerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: Ilp2MinerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.DuplicatePlaceRemoverService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWxwMi1taW5lci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvcG4vc3ludGhlc2lzL2lscDItbWluZXIvaWxwMi1taW5lci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFDN0UsT0FBTyxFQUFDLEdBQUcsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUVyQyxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUUzRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDL0QsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHdDQUF3QyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUN4RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sOENBQThDLENBQUM7QUFFMUUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDOzs7QUFNbEQsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdCQUFnQjtJQUVsRCxZQUFvQixzQkFBb0Q7UUFDcEUsS0FBSyxFQUFFLENBQUM7UUFEUSwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQThCO0lBRXhFLENBQUM7SUFFTSxJQUFJLENBQUMsR0FBbUM7UUFDM0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDcEUsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbEQsSUFB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QUFHLENBQUMsTUFBZSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEI7UUFDRCxHQUFHLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7NkdBN0ZRLGdCQUFnQjtpSEFBaEIsZ0JBQWdCLGNBRmIsTUFBTTsyRkFFVCxnQkFBZ0I7a0JBSDVCLFVBQVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtJbHBTb2x2ZXJTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXR5L2dscGsvaWxwLXNvbHZlci5zZXJ2aWNlJztcclxuaW1wb3J0IHttYXAsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge05ldEFuZFJlcG9ydH0gZnJvbSAnLi4vbW9kZWwvbmV0LWFuZC1yZXBvcnQnO1xyXG5pbXBvcnQge0lscDJNaW5lcklscFNvbHZlcn0gZnJvbSAnLi9pbHAyLW1pbmVyLWlscC1zb2x2ZXInO1xyXG5pbXBvcnQge1BhcnRpYWxPcmRlcn0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL3BvL21vZGVsL3BhcnRpYWwtb3JkZXInO1xyXG5pbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvdHJhbnNpdGlvbic7XHJcbmltcG9ydCB7UGxhY2V9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9wbGFjZSc7XHJcbmltcG9ydCB7VmFyaWFibGVUeXBlfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXR5L2dscGsvbW9kZWwvdmFyaWFibGUtdHlwZSc7XHJcbmltcG9ydCB7RHVwbGljYXRlUGxhY2VSZW1vdmVyU2VydmljZX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtYXRpb24vZHVwbGljYXRlLXBsYWNlLXJlbW92ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7TG9nU3ltYm9sfSBmcm9tICcuLi8uLi8uLi9sb2cvbG9nLXN5bWJvbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJbHAyTWluZXJTZXJ2aWNlIGV4dGVuZHMgSWxwU29sdmVyU2VydmljZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZHVwbGljYXRlUGxhY2VSZW1vdmVyOiBEdXBsaWNhdGVQbGFjZVJlbW92ZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbWluZShwb3M6IEFycmF5PFBhcnRpYWxPcmRlcj4gfCBQZXRyaU5ldCk6IE9ic2VydmFibGU8TmV0QW5kUmVwb3J0PiB7XHJcbiAgICAgICAgY29uc3Qgc29sdmVyID0gbmV3IElscDJNaW5lcklscFNvbHZlcih0aGlzLl9zb2x2ZXIkLmFzT2JzZXJ2YWJsZSgpKTtcclxuICAgICAgICByZXR1cm4gc29sdmVyLmZpbmRTb2x1dGlvbnMocG9zKS5waXBlKG1hcChzb2x1dGlvbnMgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbmV0ID0gbmV3IFBldHJpTmV0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb25NYXAgPSBuZXcgTWFwPHN0cmluZywgVHJhbnNpdGlvbj4oKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGxhY2VTb2x1dGlvbiBvZiBzb2x1dGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBsYWNlID0gbmV3IFBsYWNlKCk7XHJcbiAgICAgICAgICAgICAgICBuZXQuYWRkUGxhY2UocGxhY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRPRE8gZml4IHRoZSBoYWNrLCBpZiB0aGUgZ29hbCB2YXJpYWJsZXMgYmVjb21lIGdlbmVyYWxzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnb2FsVmFyaWFibGVzID0gcGxhY2VTb2x1dGlvbi5pbHAuYmluYXJpZXMhO1xyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHBsYWNlU29sdXRpb24uc29sdXRpb24ucmVzdWx0LnZhcnMpLmZvckVhY2goKFt2YXJpYWJsZSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFnb2FsVmFyaWFibGVzLnNvbWUoZyA9PiBnID09PSB2YXJpYWJsZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IHNvbHZlci5nZXRJbnZlcnNlVmFyaWFibGVNYXBwaW5nKHZhcmlhYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlY29kZWQudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFZhcmlhYmxlVHlwZS5JTklUSUFMX01BUktJTkc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZS5tYXJraW5nID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVmFyaWFibGVUeXBlLklOR09JTkdfV0VJR0hUOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHRoaXMuZ2V0VHJhbnNpdGlvbihkZWNvZGVkLmxhYmVsLCBuZXQsIHRyYW5zaXRpb25NYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV0LmFkZEFyYyhwbGFjZSwgdCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFZhcmlhYmxlVHlwZS5PVVRHT0lOR19XRUlHSFQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ID0gdGhpcy5nZXRUcmFuc2l0aW9uKGRlY29kZWQubGFiZWwsIG5ldCwgdHJhbnNpdGlvbk1hcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXQuYWRkQXJjKHQsIHBsYWNlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBuZXQuZ2V0VHJhbnNpdGlvbnMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHQuaW5nb2luZ0FyY3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IG5ldyBQbGFjZSgxKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXQuYWRkUGxhY2UocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV0LmFkZEFyYyhwLCB0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0Lm91dGdvaW5nQXJjcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbmV3IFBsYWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV0LmFkZFBsYWNlKHApO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldC5hZGRBcmModCwgcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5ldCA9IHRoaXMuX2R1cGxpY2F0ZVBsYWNlUmVtb3Zlci5yZW1vdmVEdXBsaWNhdGVQbGFjZXMobmV0KTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVBcnRpZmljaWFsU3RhcnRUcmFuc2l0aW9uKG5ldCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgbmV0LFxyXG4gICAgICAgICAgICAgICAgcmVwb3J0OiBbYG51bWJlciBvZiBpbmVxdWFsaXRpZXM6ICR7c29sdXRpb25zWzBdLmlscC5zdWJqZWN0VG8ubGVuZ3RoIC0gMn1gLCBgbnVtYmVyIG9mIHZhcmlhYmxlczogJHtzb2x1dGlvbnNbMF0uaWxwLmJpbmFyaWVzIS5sZW5ndGggKyBzb2x1dGlvbnNbMF0uaWxwLmdlbmVyYWxzIS5sZW5ndGh9YF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFRyYW5zaXRpb24obGFiZWw6IHN0cmluZywgbmV0OiBQZXRyaU5ldCwgbWFwOiBNYXA8c3RyaW5nLCBUcmFuc2l0aW9uPik6IFRyYW5zaXRpb24ge1xyXG4gICAgICAgIGxldCB0ID0gbWFwLmdldChsYWJlbCk7XHJcbiAgICAgICAgaWYgKHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdCA9IG5ldyBUcmFuc2l0aW9uKGxhYmVsKTtcclxuICAgICAgICBuZXQuYWRkVHJhbnNpdGlvbih0KTtcclxuICAgICAgICBtYXAuc2V0KGxhYmVsLCB0KTtcclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUFydGlmaWNpYWxTdGFydFRyYW5zaXRpb24obmV0OiBQZXRyaU5ldCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV0LmdldFRyYW5zaXRpb25zKCkuZmluZCh0ID0+IHQubGFiZWwgPT09IExvZ1N5bWJvbC5TVEFSVCk7XHJcbiAgICAgICAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IG91dEEgb2Ygc3RhcnQub3V0Z29pbmdBcmNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAgPSBvdXRBLmRlc3RpbmF0aW9uIGFzIFBsYWNlO1xyXG4gICAgICAgICAgICBwLm1hcmtpbmcgKz0gcC5tYXJraW5nICsgb3V0QS53ZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3QgaW5BIG9mIHN0YXJ0LmluZ29pbmdBcmNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAgPSBpbkEuc291cmNlIGFzIFBsYWNlO1xyXG4gICAgICAgICAgICBuZXQucmVtb3ZlUGxhY2UocCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ldC5yZW1vdmVUcmFuc2l0aW9uKHN0YXJ0KTtcclxuICAgIH1cclxufVxyXG4iXX0=