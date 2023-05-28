import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IlpSolverService } from '../../../../utility/glpk/ilp-solver.service';
import { cleanLog } from '../../../log/clean-log';
import { IlpMinerIlpSolver } from './ilp-miner-ilp-solver';
import { PetriNet } from '../../../../models/pn/model/petri-net';
import { Place } from '../../../../models/pn/model/place';
import { Transition } from '../../../../models/pn/model/transition';
import { VariableType } from '../../../../utility/glpk/model/variable-type';
import * as i0 from "@angular/core";
import * as i1 from "../../transformation/duplicate-place-remover.service";
export class IlpMinerService extends IlpSolverService {
    constructor(_duplicatePlaceRemover) {
        super();
        this._duplicatePlaceRemover = _duplicatePlaceRemover;
    }
    mine(log) {
        const cleanedLog = cleanLog(log);
        const solver = new IlpMinerIlpSolver(this._solver$.asObservable());
        return solver.findSolutions(cleanedLog).pipe(map(solutions => {
            const net = new PetriNet();
            const transitionMap = new Map();
            for (const placeSolution of solutions) {
                const place = new Place();
                net.addPlace(place);
                Object.entries(placeSolution.solution.result.vars).forEach(([variable, value]) => {
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
            return {
                net: this._duplicatePlaceRemover.removeDuplicatePlaces(net),
                report: [`number of inequalities: ${solutions[0].ilp.subjectTo.length - 2}`, `number of variables: ${solutions[0].ilp.binaries.length}`]
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
}
IlpMinerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpMinerService, deps: [{ token: i1.DuplicatePlaceRemoverService }], target: i0.ɵɵFactoryTarget.Injectable });
IlpMinerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpMinerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpMinerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.DuplicatePlaceRemoverService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWxwLW1pbmVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9wbi9zeW50aGVzaXMvaWxwLW1pbmVyL2lscC1taW5lci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLEdBQUcsRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUVyQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw2Q0FBNkMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQy9ELE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUN4RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDbEUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDhDQUE4QyxDQUFDOzs7QUFPMUUsTUFBTSxPQUFPLGVBQWdCLFNBQVEsZ0JBQWdCO0lBRWpELFlBQW9CLHNCQUFvRDtRQUNwRSxLQUFLLEVBQUUsQ0FBQztRQURRLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBOEI7SUFFeEUsQ0FBQztJQUVNLElBQUksQ0FBQyxHQUFpQjtRQUN6QixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDbkUsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElB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QUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDakIsT0FBTyxDQUFDLENBQUM7U0FDWjtRQUNELENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQzs7NEdBcEVRLGVBQWU7Z0hBQWYsZUFBZSxjQUZaLE1BQU07MkZBRVQsZUFBZTtrQkFIM0IsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1RyYWNlfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvbG9nL21vZGVsL3RyYWNlJztcclxuaW1wb3J0IHttYXAsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge05ldEFuZFJlcG9ydH0gZnJvbSAnLi4vbW9kZWwvbmV0LWFuZC1yZXBvcnQnO1xyXG5pbXBvcnQge0lscFNvbHZlclNlcnZpY2V9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdHkvZ2xway9pbHAtc29sdmVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge2NsZWFuTG9nfSBmcm9tICcuLi8uLi8uLi9sb2cvY2xlYW4tbG9nJztcclxuaW1wb3J0IHtJbHBNaW5lcklscFNvbHZlcn0gZnJvbSAnLi9pbHAtbWluZXItaWxwLXNvbHZlcic7XHJcbmltcG9ydCB7UGV0cmlOZXR9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9wZXRyaS1uZXQnO1xyXG5pbXBvcnQge1BsYWNlfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGxhY2UnO1xyXG5pbXBvcnQge1RyYW5zaXRpb259IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC90cmFuc2l0aW9uJztcclxuaW1wb3J0IHtWYXJpYWJsZVR5cGV9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdHkvZ2xway9tb2RlbC92YXJpYWJsZS10eXBlJztcclxuaW1wb3J0IHtEdXBsaWNhdGVQbGFjZVJlbW92ZXJTZXJ2aWNlfSBmcm9tICcuLi8uLi90cmFuc2Zvcm1hdGlvbi9kdXBsaWNhdGUtcGxhY2UtcmVtb3Zlci5zZXJ2aWNlJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIElscE1pbmVyU2VydmljZSBleHRlbmRzIElscFNvbHZlclNlcnZpY2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2R1cGxpY2F0ZVBsYWNlUmVtb3ZlcjogRHVwbGljYXRlUGxhY2VSZW1vdmVyU2VydmljZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1pbmUobG9nOiBBcnJheTxUcmFjZT4pOiBPYnNlcnZhYmxlPE5ldEFuZFJlcG9ydD4ge1xyXG4gICAgICAgIGNvbnN0IGNsZWFuZWRMb2cgPSBjbGVhbkxvZyhsb2cpO1xyXG4gICAgICAgIGNvbnN0IHNvbHZlciA9IG5ldyBJbHBNaW5lcklscFNvbHZlcih0aGlzLl9zb2x2ZXIkLmFzT2JzZXJ2YWJsZSgpKTtcclxuICAgICAgICByZXR1cm4gc29sdmVyLmZpbmRTb2x1dGlvbnMoY2xlYW5lZExvZykucGlwZShtYXAoc29sdXRpb25zID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV0ID0gbmV3IFBldHJpTmV0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb25NYXAgPSBuZXcgTWFwPHN0cmluZywgVHJhbnNpdGlvbj4oKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGxhY2VTb2x1dGlvbiBvZiBzb2x1dGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBsYWNlID0gbmV3IFBsYWNlKCk7XHJcbiAgICAgICAgICAgICAgICBuZXQuYWRkUGxhY2UocGxhY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHBsYWNlU29sdXRpb24uc29sdXRpb24ucmVzdWx0LnZhcnMpLmZvckVhY2goKFt2YXJpYWJsZSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IHNvbHZlci5nZXRJbnZlcnNlVmFyaWFibGVNYXBwaW5nKHZhcmlhYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGRlY29kZWQudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFZhcmlhYmxlVHlwZS5JTklUSUFMX01BUktJTkc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZS5tYXJraW5nID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVmFyaWFibGVUeXBlLklOR09JTkdfV0VJR0hUOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdCA9IHRoaXMuZ2V0VHJhbnNpdGlvbihkZWNvZGVkLmxhYmVsLCBuZXQsIHRyYW5zaXRpb25NYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV0LmFkZEFyYyhwbGFjZSwgdCwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFZhcmlhYmxlVHlwZS5PVVRHT0lOR19XRUlHSFQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ID0gdGhpcy5nZXRUcmFuc2l0aW9uKGRlY29kZWQubGFiZWwsIG5ldCwgdHJhbnNpdGlvbk1hcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXQuYWRkQXJjKHQsIHBsYWNlLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgdCBvZiBuZXQuZ2V0VHJhbnNpdGlvbnMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHQuaW5nb2luZ0FyY3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcCA9IG5ldyBQbGFjZSgxKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXQuYWRkUGxhY2UocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV0LmFkZEFyYyhwLCB0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0Lm91dGdvaW5nQXJjcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwID0gbmV3IFBsYWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV0LmFkZFBsYWNlKHApO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldC5hZGRBcmModCwgcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuZXQ6IHRoaXMuX2R1cGxpY2F0ZVBsYWNlUmVtb3Zlci5yZW1vdmVEdXBsaWNhdGVQbGFjZXMobmV0KSxcclxuICAgICAgICAgICAgICAgIHJlcG9ydDogW2BudW1iZXIgb2YgaW5lcXVhbGl0aWVzOiAke3NvbHV0aW9uc1swXS5pbHAuc3ViamVjdFRvLmxlbmd0aCAtIDJ9YCwgYG51bWJlciBvZiB2YXJpYWJsZXM6ICR7c29sdXRpb25zWzBdLmlscC5iaW5hcmllcyEubGVuZ3RofWBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRUcmFuc2l0aW9uKGxhYmVsOiBzdHJpbmcsIG5ldDogUGV0cmlOZXQsIG1hcDogTWFwPHN0cmluZywgVHJhbnNpdGlvbj4pOiBUcmFuc2l0aW9uIHtcclxuICAgICAgICBsZXQgdCA9IG1hcC5nZXQobGFiZWwpO1xyXG4gICAgICAgIGlmICh0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHQgPSBuZXcgVHJhbnNpdGlvbihsYWJlbCk7XHJcbiAgICAgICAgbmV0LmFkZFRyYW5zaXRpb24odCk7XHJcbiAgICAgICAgbWFwLnNldChsYWJlbCwgdCk7XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbn1cclxuIl19