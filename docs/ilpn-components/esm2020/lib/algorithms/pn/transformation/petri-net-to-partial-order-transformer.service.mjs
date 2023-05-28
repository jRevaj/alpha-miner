import { Injectable } from '@angular/core';
import { PartialOrder } from '../../../models/po/model/partial-order';
import { Event } from '../../../models/po/model/event';
import * as i0 from "@angular/core";
export class PetriNetToPartialOrderTransformerService {
    constructor() {
    }
    transform(net) {
        const badPlace = net.getPlaces().find(p => p.ingoingArcs.length > 1 || p.outgoingArcs.length > 1 || (p.ingoingArcs.length === 1 && p.outgoingArcs.length === 1 && p.ingoingArcs[0].sourceId === p.outgoingArcs[0].destinationId));
        if (badPlace !== undefined) {
            throw new Error(`The given Petri net is not a partial order! The place with id '${badPlace.id}' has too many in-/outgoing arcs or is part of a self-loop.`);
        }
        const badTransition = net.getTransitions().find(t => t.ingoingArcs.length === 0 || t.outgoingArcs.length === 0 || t.label === undefined);
        if (badTransition !== undefined) {
            throw new Error(`The given Petri net is not a partial order! The transition with id '${badTransition.id}' has an empty pre-/post-set or is unlabeled`);
        }
        const result = new PartialOrder();
        for (const t of net.getTransitions()) {
            result.addEvent(new Event(t.id, t.label));
        }
        for (const t of net.getTransitions()) {
            const event = result.getEvent(t.id);
            for (const arc of t.outgoingArcs) {
                const nextTransitionId = arc.destination.outgoingArcs[0]?.destinationId;
                if (nextTransitionId !== undefined) {
                    event.addNextEvent(result.getEvent(nextTransitionId));
                }
            }
        }
        return result;
    }
}
PetriNetToPartialOrderTransformerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetToPartialOrderTransformerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetToPartialOrderTransformerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetToPartialOrderTransformerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetToPartialOrderTransformerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LXRvLXBhcnRpYWwtb3JkZXItdHJhbnNmb3JtZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL3BuL3RyYW5zZm9ybWF0aW9uL3BldHJpLW5ldC10by1wYXJ0aWFsLW9yZGVyLXRyYW5zZm9ybWVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDcEUsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdDQUFnQyxDQUFDOztBQUtyRCxNQUFNLE9BQU8sd0NBQXdDO0lBRWpEO0lBQ0EsQ0FBQztJQUVNLFNBQVMsQ0FBQyxHQUFhO1FBQzFCLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDbE8sSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0VBQWtFLFFBQVEsQ0FBQyxFQUFFLDZEQUE2RCxDQUFDLENBQUM7U0FDL0o7UUFDRCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ3pJLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRTtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHVFQUF1RSxhQUFhLENBQUMsRUFBRSw4Q0FBOEMsQ0FBQyxDQUFDO1NBQzFKO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNsQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNsQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDOUM7UUFDRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNsQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFHLENBQUUsQ0FBQztZQUN0QyxLQUFLLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUU7Z0JBQzlCLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDO2dCQUN4RSxJQUFJLGdCQUFnQixLQUFLLFNBQVMsRUFBRTtvQkFDaEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFFLENBQUMsQ0FBQztpQkFDMUQ7YUFDSjtTQUNKO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7cUlBOUJRLHdDQUF3Qzt5SUFBeEMsd0NBQXdDLGNBRnJDLE1BQU07MkZBRVQsd0NBQXdDO2tCQUhwRCxVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UGV0cmlOZXR9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9wZXRyaS1uZXQnO1xyXG5pbXBvcnQge1BhcnRpYWxPcmRlcn0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BvL21vZGVsL3BhcnRpYWwtb3JkZXInO1xyXG5pbXBvcnQge0V2ZW50fSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG8vbW9kZWwvZXZlbnQnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQZXRyaU5ldFRvUGFydGlhbE9yZGVyVHJhbnNmb3JtZXJTZXJ2aWNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtKG5ldDogUGV0cmlOZXQpOiBQYXJ0aWFsT3JkZXIge1xyXG4gICAgICAgIGNvbnN0IGJhZFBsYWNlID0gbmV0LmdldFBsYWNlcygpLmZpbmQocCA9PiBwLmluZ29pbmdBcmNzLmxlbmd0aCA+IDEgfHwgcC5vdXRnb2luZ0FyY3MubGVuZ3RoID4gMSB8fCAocC5pbmdvaW5nQXJjcy5sZW5ndGggPT09IDEgJiYgcC5vdXRnb2luZ0FyY3MubGVuZ3RoID09PSAxICYmIHAuaW5nb2luZ0FyY3NbMF0uc291cmNlSWQgPT09IHAub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uSWQpKTtcclxuICAgICAgICBpZiAoYmFkUGxhY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBnaXZlbiBQZXRyaSBuZXQgaXMgbm90IGEgcGFydGlhbCBvcmRlciEgVGhlIHBsYWNlIHdpdGggaWQgJyR7YmFkUGxhY2UuaWR9JyBoYXMgdG9vIG1hbnkgaW4tL291dGdvaW5nIGFyY3Mgb3IgaXMgcGFydCBvZiBhIHNlbGYtbG9vcC5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYmFkVHJhbnNpdGlvbiA9IG5ldC5nZXRUcmFuc2l0aW9ucygpLmZpbmQodCA9PiB0LmluZ29pbmdBcmNzLmxlbmd0aCA9PT0gMCB8fCB0Lm91dGdvaW5nQXJjcy5sZW5ndGggPT09IDAgfHwgdC5sYWJlbCA9PT0gdW5kZWZpbmVkKTtcclxuICAgICAgICBpZiAoYmFkVHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGdpdmVuIFBldHJpIG5ldCBpcyBub3QgYSBwYXJ0aWFsIG9yZGVyISBUaGUgdHJhbnNpdGlvbiB3aXRoIGlkICcke2JhZFRyYW5zaXRpb24uaWR9JyBoYXMgYW4gZW1wdHkgcHJlLS9wb3N0LXNldCBvciBpcyB1bmxhYmVsZWRgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQYXJ0aWFsT3JkZXIoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgbmV0LmdldFRyYW5zaXRpb25zKCkpIHtcclxuICAgICAgICAgICAgcmVzdWx0LmFkZEV2ZW50KG5ldyBFdmVudCh0LmlkISwgdC5sYWJlbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgbmV0LmdldFRyYW5zaXRpb25zKCkpIHtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSByZXN1bHQuZ2V0RXZlbnQodC5pZCEpITtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBhcmMgb2YgdC5vdXRnb2luZ0FyY3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRUcmFuc2l0aW9uSWQgPSBhcmMuZGVzdGluYXRpb24ub3V0Z29pbmdBcmNzWzBdPy5kZXN0aW5hdGlvbklkO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHRUcmFuc2l0aW9uSWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmFkZE5leHRFdmVudChyZXN1bHQuZ2V0RXZlbnQobmV4dFRyYW5zaXRpb25JZCkhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbn1cclxuIl19