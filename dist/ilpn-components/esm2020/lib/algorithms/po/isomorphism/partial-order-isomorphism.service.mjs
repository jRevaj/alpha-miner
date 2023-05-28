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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGlhbC1vcmRlci1pc29tb3JwaGlzbS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvcG8vaXNvbW9ycGhpc20vcGFydGlhbC1vcmRlci1pc29tb3JwaGlzbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHekMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sK0JBQStCLENBQUM7O0FBS25FLE1BQU0sT0FBTyw4QkFBOEI7SUFFdkM7SUFDQSxDQUFDO0lBRU0sMEJBQTBCLENBQUMsYUFBMkIsRUFBRSxhQUEyQjtRQUN0RixhQUFhLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUMvQyxhQUFhLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUUvQyxNQUFNLFFBQVEsR0FBZ0MsRUFBRSxDQUFDO1FBQ2pELEtBQUssTUFBTSxZQUFZLElBQUksYUFBYSxDQUFDLGFBQWEsRUFBRTtZQUNwRCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQW9CLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsRztRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1FBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1FBQzNDLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO1FBQ3JELE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRyxDQUFDO1lBQ2xDLE1BQU0sUUFBUSxHQUFpQixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8s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Y2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1BhcnRpYWxPcmRlcn0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvL21vZGVsL3BhcnRpYWwtb3JkZXInO1xyXG5pbXBvcnQge0V2ZW50fSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG8vbW9kZWwvZXZlbnQnO1xyXG5pbXBvcnQge0lzb21vcnBoaXNtQ2FuZGlkYXRlfSBmcm9tICcuL21vZGVsL2lzb21vcnBoaXNtLWNhbmRpZGF0ZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFBhcnRpYWxPcmRlcklzb21vcnBoaXNtU2VydmljZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFyZVBhcnRpYWxPcmRlcnNJc29tb3JwaGljKHBhcnRpYWxPcmRlckE6IFBhcnRpYWxPcmRlciwgcGFydGlhbE9yZGVyQjogUGFydGlhbE9yZGVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcGFydGlhbE9yZGVyQS5kZXRlcm1pbmVJbml0aWFsQW5kRmluYWxFdmVudHMoKTtcclxuICAgICAgICBwYXJ0aWFsT3JkZXJCLmRldGVybWluZUluaXRpYWxBbmRGaW5hbEV2ZW50cygpO1xyXG5cclxuICAgICAgICBjb25zdCB1bnNvbHZlZDogQXJyYXk8SXNvbW9ycGhpc21DYW5kaWRhdGU+ID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBpbml0aWFsRXZlbnQgb2YgcGFydGlhbE9yZGVyQS5pbml0aWFsRXZlbnRzKSB7XHJcbiAgICAgICAgICAgIHVuc29sdmVkLnB1c2gobmV3IElzb21vcnBoaXNtQ2FuZGlkYXRlKGluaXRpYWxFdmVudCwgQXJyYXkuZnJvbShwYXJ0aWFsT3JkZXJCLmluaXRpYWxFdmVudHMpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYXBwaW5nQUIgPSBuZXcgTWFwPHN0cmluZywgRXZlbnQ+KCk7XHJcbiAgICAgICAgY29uc3QgbWFwcGluZ0JBID0gbmV3IE1hcDxzdHJpbmcsIEV2ZW50PigpO1xyXG4gICAgICAgIGNvbnN0IHB1c2hlZFRvQmFjayA9IG5ldyBTZXQ8SXNvbW9ycGhpc21DYW5kaWRhdGU+KCk7XHJcbiAgICAgICAgd2hpbGUgKHVuc29sdmVkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgcHJvYmxlbSA9IHVuc29sdmVkLnNoaWZ0KCkhO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2aW91czogQXJyYXk8RXZlbnQ+ID0gQXJyYXkuZnJvbShwcm9ibGVtLnRhcmdldC5wcmV2aW91c0V2ZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChwcmV2aW91cy5zb21lKHAgPT4gIW1hcHBpbmdBQi5oYXMocC5pZCkpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwcmUtc2V0IHdhcyBub3QgeWV0IGRldGVybWluZWQsIHdlIGhhdmUgdG8gd2FpdFxyXG4gICAgICAgICAgICAgICAgaWYgKHB1c2hlZFRvQmFjay5oYXMocHJvYmxlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwdXNoZWRUb0JhY2suYWRkKHByb2JsZW0pO1xyXG4gICAgICAgICAgICAgICAgdW5zb2x2ZWQucHVzaChwcm9ibGVtKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb2JsZW0uY2FuZGlkYXRlcyA9IHByb2JsZW0uY2FuZGlkYXRlcy5maWx0ZXIoYyA9PiAhbWFwcGluZ0JBLmhhcyhjLmlkKSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IHByb2JsZW0uY2FuZGlkYXRlcy5maW5kKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2FtZUxhYmVsID0gYy5sYWJlbCA9PT0gcHJvYmxlbS50YXJnZXQubGFiZWw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNhbWVMYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjLnByZXZpb3VzRXZlbnRzLnNpemUgIT09IHByb2JsZW0udGFyZ2V0LnByZXZpb3VzRXZlbnRzLnNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYy5uZXh0RXZlbnRzLnNpemUgIT09IHByb2JsZW0udGFyZ2V0Lm5leHRFdmVudHMuc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzTGFiZWxzID0gbmV3IFNldChBcnJheS5mcm9tKGMucHJldmlvdXNFdmVudHMpLm1hcChwID0+IHAubGFiZWwhKSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcHJvYmxlbS50YXJnZXQucHJldmlvdXNFdmVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXByZXZpb3VzTGFiZWxzLmhhcyhwLmxhYmVsISkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0xhYmVscy5kZWxldGUocC5sYWJlbCEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAobWF0Y2ggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwdXNoZWRUb0JhY2suY2xlYXIoKTtcclxuXHJcbiAgICAgICAgICAgIG1hcHBpbmdBQi5zZXQocHJvYmxlbS50YXJnZXQuaWQsIG1hdGNoKTtcclxuICAgICAgICAgICAgbWFwcGluZ0JBLnNldChtYXRjaC5pZCwgcHJvYmxlbS50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IG5leHQgb2YgcHJvYmxlbS50YXJnZXQubmV4dEV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdW5zb2x2ZWQucHVzaChuZXcgSXNvbW9ycGhpc21DYW5kaWRhdGUobmV4dCwgQXJyYXkuZnJvbShtYXRjaC5uZXh0RXZlbnRzKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4iXX0=