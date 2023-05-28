import { Injectable } from '@angular/core';
import { IsomorphismCandidate } from './model/isomorphism-candidate';
import * as i0 from "@angular/core";
export class PartialOrderIsomorphismService {
    constructor() {
    }
    arePartialOrdersIsomorphic(partialOrderA, partialOrderB) {
        partialOrderA.determineInitialAndFinalEvents();
        partialOrderB.determineInitialAndFinalEvents();
        const unsolved = [];
        for (const initialEvent of partialOrderA.initialEvents) {
            unsolved.push(new IsomorphismCandidate(initialEvent, Array.from(partialOrderB.initialEvents)));
        }
        const mappingAB = new Map();
        const mappingBA = new Map();
        const pushedToBack = new Set();
        while (unsolved.length > 0) {
            const problem = unsolved.shift();
            if (mappingAB.has(problem.target.id)) {
                continue;
            }
            const previous = Array.from(problem.target.previousEvents);
            if (previous.some(p => !mappingAB.has(p.id))) {
                // pre-set was not yet determined, we have to wait
                if (pushedToBack.has(problem)) {
                    return false;
                }
                pushedToBack.add(problem);
                unsolved.push(problem);
                continue;
            }
            problem.candidates = problem.candidates.filter(c => !mappingBA.has(c.id));
            const match = problem.candidates.find(c => {
                const sameLabel = c.label === problem.target.label;
                if (!sameLabel) {
                    return false;
                }
                if (c.previousEvents.size !== problem.target.previousEvents.size) {
                    return false;
                }
                if (c.nextEvents.size !== problem.target.nextEvents.size) {
                    return false;
                }
                const previousLabels = new Set(Array.from(c.previousEvents).map(p => p.label));
                for (const p of problem.target.previousEvents) {
                    if (!previousLabels.has(p.label)) {
                        return false;
                    }
                    previousLabels.delete(p.label);
                }
                return true;
            });
            if (match === undefined) {
                return false;
            }
            pushedToBack.clear();
            mappingAB.set(problem.target.id, match);
            mappingBA.set(match.id, problem.target);
            for (const next of problem.target.nextEvents) {
                unsolved.push(new IsomorphismCandidate(next, Array.from(match.nextEvents)));
            }
        }
        return true;
    }
}
PartialOrderIsomorphismService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderIsomorphismService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PartialOrderIsomorphismService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderIsomorphismService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderIsomorphismService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGlhbC1vcmRlci1pc29tb3JwaGlzbS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvcG8vaXNvbW9ycGhpc20vcGFydGlhbC1vcmRlci1pc29tb3JwaGlzbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHekMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sK0JBQStCLENBQUM7O0FBS25FLE1BQU0sT0FBTyw4QkFBOEI7SUFFdkM7SUFDQSxDQUFDO0lBRU0sMEJBQTBCLENBQUMsYUFBMkIsRUFBRSxhQUEyQjtRQUN0RixhQUFhLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUMvQyxhQUFhLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUUvQyxNQUFNLFFBQVEsR0FBZ0MsRUFBRSxDQUFDO1FBQ2pELEtBQUssTUFBTSxZQUFZLElBQUksYUFBYSxDQUFDLGFBQWEsRUFBRTtZQUNwRCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQW9CLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsRztRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1FBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1FBQzNDLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO1FBQ3JELE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRyxDQUFDO1lBQ2xDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxD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QkFBOEIsY0FGM0IsTUFBTTsyRkFFVCw4QkFBOEI7a0JBSDFDLFVBQVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtQYXJ0aWFsT3JkZXJ9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wby9tb2RlbC9wYXJ0aWFsLW9yZGVyJztcclxuaW1wb3J0IHtFdmVudH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvL21vZGVsL2V2ZW50JztcclxuaW1wb3J0IHtJc29tb3JwaGlzbUNhbmRpZGF0ZX0gZnJvbSAnLi9tb2RlbC9pc29tb3JwaGlzbS1jYW5kaWRhdGUnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWFsT3JkZXJJc29tb3JwaGlzbVNlcnZpY2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcmVQYXJ0aWFsT3JkZXJzSXNvbW9ycGhpYyhwYXJ0aWFsT3JkZXJBOiBQYXJ0aWFsT3JkZXIsIHBhcnRpYWxPcmRlckI6IFBhcnRpYWxPcmRlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHBhcnRpYWxPcmRlckEuZGV0ZXJtaW5lSW5pdGlhbEFuZEZpbmFsRXZlbnRzKCk7XHJcbiAgICAgICAgcGFydGlhbE9yZGVyQi5kZXRlcm1pbmVJbml0aWFsQW5kRmluYWxFdmVudHMoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdW5zb2x2ZWQ6IEFycmF5PElzb21vcnBoaXNtQ2FuZGlkYXRlPiA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgaW5pdGlhbEV2ZW50IG9mIHBhcnRpYWxPcmRlckEuaW5pdGlhbEV2ZW50cykge1xyXG4gICAgICAgICAgICB1bnNvbHZlZC5wdXNoKG5ldyBJc29tb3JwaGlzbUNhbmRpZGF0ZShpbml0aWFsRXZlbnQsIEFycmF5LmZyb20ocGFydGlhbE9yZGVyQi5pbml0aWFsRXZlbnRzKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWFwcGluZ0FCID0gbmV3IE1hcDxzdHJpbmcsIEV2ZW50PigpO1xyXG4gICAgICAgIGNvbnN0IG1hcHBpbmdCQSA9IG5ldyBNYXA8c3RyaW5nLCBFdmVudD4oKTtcclxuICAgICAgICBjb25zdCBwdXNoZWRUb0JhY2sgPSBuZXcgU2V0PElzb21vcnBoaXNtQ2FuZGlkYXRlPigpO1xyXG4gICAgICAgIHdoaWxlICh1bnNvbHZlZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2JsZW0gPSB1bnNvbHZlZC5zaGlmdCgpITtcclxuICAgICAgICAgICAgaWYgKG1hcHBpbmdBQi5oYXMocHJvYmxlbS50YXJnZXQuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXM6IEFycmF5PEV2ZW50PiA9IEFycmF5LmZyb20ocHJvYmxlbS50YXJnZXQucHJldmlvdXNFdmVudHMpO1xyXG4gICAgICAgICAgICBpZiAocHJldmlvdXMuc29tZShwID0+ICFtYXBwaW5nQUIuaGFzKHAuaWQpKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcHJlLXNldCB3YXMgbm90IHlldCBkZXRlcm1pbmVkLCB3ZSBoYXZlIHRvIHdhaXRcclxuICAgICAgICAgICAgICAgIGlmIChwdXNoZWRUb0JhY2suaGFzKHByb2JsZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHVzaGVkVG9CYWNrLmFkZChwcm9ibGVtKTtcclxuICAgICAgICAgICAgICAgIHVuc29sdmVkLnB1c2gocHJvYmxlbSk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9ibGVtLmNhbmRpZGF0ZXMgPSBwcm9ibGVtLmNhbmRpZGF0ZXMuZmlsdGVyKGMgPT4gIW1hcHBpbmdCQS5oYXMoYy5pZCkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBwcm9ibGVtLmNhbmRpZGF0ZXMuZmluZChjID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNhbWVMYWJlbCA9IGMubGFiZWwgPT09IHByb2JsZW0udGFyZ2V0LmxhYmVsO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzYW1lTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYy5wcmV2aW91c0V2ZW50cy5zaXplICE9PSBwcm9ibGVtLnRhcmdldC5wcmV2aW91c0V2ZW50cy5zaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGMubmV4dEV2ZW50cy5zaXplICE9PSBwcm9ibGVtLnRhcmdldC5uZXh0RXZlbnRzLnNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0xhYmVscyA9IG5ldyBTZXQoQXJyYXkuZnJvbShjLnByZXZpb3VzRXZlbnRzKS5tYXAocCA9PiBwLmxhYmVsISkpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwIG9mIHByb2JsZW0udGFyZ2V0LnByZXZpb3VzRXZlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwcmV2aW91c0xhYmVscy5oYXMocC5sYWJlbCEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNMYWJlbHMuZGVsZXRlKHAubGFiZWwhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKG1hdGNoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcHVzaGVkVG9CYWNrLmNsZWFyKCk7XHJcblxyXG4gICAgICAgICAgICBtYXBwaW5nQUIuc2V0KHByb2JsZW0udGFyZ2V0LmlkLCBtYXRjaCk7XHJcbiAgICAgICAgICAgIG1hcHBpbmdCQS5zZXQobWF0Y2guaWQsIHByb2JsZW0udGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBuZXh0IG9mIHByb2JsZW0udGFyZ2V0Lm5leHRFdmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHVuc29sdmVkLnB1c2gobmV3IElzb21vcnBoaXNtQ2FuZGlkYXRlKG5leHQsIEFycmF5LmZyb20obWF0Y2gubmV4dEV2ZW50cykpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuIl19