import { Injectable } from '@angular/core';
import { LogCleaner } from '../../log/log-cleaner';
import * as i0 from "@angular/core";
import * as i1 from "../reachability/petri-net-coverability.service";
export class ImplicitPlaceRemoverService extends LogCleaner {
    constructor(_coverabilityTreeService) {
        super();
        this._coverabilityTreeService = _coverabilityTreeService;
    }
    /**
     * @param net a labeled Petri Net containing implicit places with no label-splitting
     * @returns a copy of the input Petri net without the implicit places
     */
    removeImplicitPlaces(net) {
        const reachableMarkings = this.generateReachableMarkings(net);
        const placeOrdering = net.getPlaces().map(p => p.id);
        const removedPlaceIds = new Set();
        const result = net.clone();
        p1For: for (const p1 of placeOrdering) {
            if (removedPlaceIds.has(p1)) {
                continue;
            }
            p2For: for (const p2 of placeOrdering) {
                if (removedPlaceIds.has(p2)) {
                    continue;
                }
                if (p1 === p2) {
                    continue;
                }
                let isGreater = false;
                for (const marking of reachableMarkings.values()) {
                    if (marking.get(p1) < marking.get(p2)) {
                        continue p2For;
                    }
                    else if (marking.get(p1) > marking.get(p2)) {
                        isGreater = true;
                    }
                }
                if (isGreater) {
                    // p1 is > than some other place p2 => p1 is an implicit place and can be removed from the net
                    removedPlaceIds.add(p1);
                    result.removePlace(p1);
                    continue p1For;
                }
            }
        }
        return result;
    }
    generateReachableMarkings(net) {
        const reachableMarkings = new Map();
        const toExplore = [this._coverabilityTreeService.getCoverabilityTree(net)];
        const placeOrdering = toExplore[0].omegaMarking.getKeys();
        while (toExplore.length > 0) {
            const next = toExplore.shift();
            toExplore.push(...next.getChildren());
            const m = next.omegaMarking;
            reachableMarkings.set(this.stringifyMarking(m, placeOrdering), m);
        }
        return reachableMarkings;
    }
    getLabelMapping(net) {
        const result = new Map();
        for (const t of net.getTransitions()) {
            if (t.label === undefined) {
                throw new Error(`Silent transitions are unsupported! The transition with id '${t.id}' has no label`);
            }
            if (result.has(t.label)) {
                throw new Error(`Label splitting is not supported! The label '${t.label}' is shared by at least two transitions`);
            }
            result.set(t.label, t.id);
        }
        return result;
    }
    stringifyMarking(marking, placeOrdering) {
        return placeOrdering.map(pid => marking.get(pid)).join(',');
    }
}
ImplicitPlaceRemoverService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ImplicitPlaceRemoverService, deps: [{ token: i1.PetriNetCoverabilityService }], target: i0.ɵɵFactoryTarget.Injectable });
ImplicitPlaceRemoverService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ImplicitPlaceRemoverService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ImplicitPlaceRemoverService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetCoverabilityService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbGljaXQtcGxhY2UtcmVtb3Zlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvcG4vdHJhbnNmb3JtYXRpb24vaW1wbGljaXQtcGxhY2UtcmVtb3Zlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHVCQUF1QixDQUFDOzs7QUFPakQsTUFBTSxPQUFPLDJCQUE0QixTQUFRLFVBQVU7SUFFdkQsWUFBc0Isd0JBQXFEO1FBQ3ZFLEtBQUssRUFBRSxDQUFDO1FBRFUsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUE2QjtJQUUzRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksb0JBQW9CLENBQUMsR0FBYTtRQUNyQyxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU5RCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sZUFBZSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7UUFDMUMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTNCLEtBQUssRUFDTCxLQUFLLE1BQU0sRUFBRSxJQUFJLGFBQWEsRUFBRTtZQUM1QixJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ3pCLFNBQVM7YUFDWjtZQUVELEtBQUssRUFDTCxLQUFLLE1BQU0sRUFBRSxJQUFJLGFBQWEsRUFBRTtnQkFDNUIsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxF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QztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtMb2dDbGVhbmVyfSBmcm9tICcuLi8uLi9sb2cvbG9nLWNsZWFuZXInO1xyXG5pbXBvcnQge01hcmtpbmd9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9tYXJraW5nJztcclxuaW1wb3J0IHtQZXRyaU5ldENvdmVyYWJpbGl0eVNlcnZpY2V9IGZyb20gJy4uL3JlYWNoYWJpbGl0eS9wZXRyaS1uZXQtY292ZXJhYmlsaXR5LnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJbXBsaWNpdFBsYWNlUmVtb3ZlclNlcnZpY2UgZXh0ZW5kcyBMb2dDbGVhbmVyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2NvdmVyYWJpbGl0eVRyZWVTZXJ2aWNlOiBQZXRyaU5ldENvdmVyYWJpbGl0eVNlcnZpY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG5ldCBhIGxhYmVsZWQgUGV0cmkgTmV0IGNvbnRhaW5pbmcgaW1wbGljaXQgcGxhY2VzIHdpdGggbm8gbGFiZWwtc3BsaXR0aW5nXHJcbiAgICAgKiBAcmV0dXJucyBhIGNvcHkgb2YgdGhlIGlucHV0IFBldHJpIG5ldCB3aXRob3V0IHRoZSBpbXBsaWNpdCBwbGFjZXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUltcGxpY2l0UGxhY2VzKG5ldDogUGV0cmlOZXQpOiBQZXRyaU5ldCB7XHJcbiAgICAgICAgY29uc3QgcmVhY2hhYmxlTWFya2luZ3MgPSB0aGlzLmdlbmVyYXRlUmVhY2hhYmxlTWFya2luZ3MobmV0KTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxhY2VPcmRlcmluZyA9IG5ldC5nZXRQbGFjZXMoKS5tYXAocCA9PiBwLmlkISk7XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlZFBsYWNlSWRzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV0LmNsb25lKCk7XHJcblxyXG4gICAgICAgIHAxRm9yOlxyXG4gICAgICAgIGZvciAoY29uc3QgcDEgb2YgcGxhY2VPcmRlcmluZykge1xyXG4gICAgICAgICAgICBpZiAocmVtb3ZlZFBsYWNlSWRzLmhhcyhwMSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwMkZvcjpcclxuICAgICAgICAgICAgZm9yIChjb25zdCBwMiBvZiBwbGFjZU9yZGVyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVtb3ZlZFBsYWNlSWRzLmhhcyhwMikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwMSA9PT0gcDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaXNHcmVhdGVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1hcmtpbmcgb2YgcmVhY2hhYmxlTWFya2luZ3MudmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWFya2luZy5nZXQocDEpISA8IG1hcmtpbmcuZ2V0KHAyKSEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgcDJGb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXJraW5nLmdldChwMSkhID4gbWFya2luZy5nZXQocDIpISkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0dyZWF0ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNHcmVhdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcDEgaXMgPiB0aGFuIHNvbWUgb3RoZXIgcGxhY2UgcDIgPT4gcDEgaXMgYW4gaW1wbGljaXQgcGxhY2UgYW5kIGNhbiBiZSByZW1vdmVkIGZyb20gdGhlIG5ldFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWRQbGFjZUlkcy5hZGQocDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZW1vdmVQbGFjZShwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgcDFGb3I7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlUmVhY2hhYmxlTWFya2luZ3MobmV0OiBQZXRyaU5ldCk6IE1hcDxzdHJpbmcsIE1hcmtpbmc+IHtcclxuICAgICAgICBjb25zdCByZWFjaGFibGVNYXJraW5ncyA9IG5ldyBNYXA8c3RyaW5nLCBNYXJraW5nPigpO1xyXG4gICAgICAgIGNvbnN0IHRvRXhwbG9yZSA9IFt0aGlzLl9jb3ZlcmFiaWxpdHlUcmVlU2VydmljZS5nZXRDb3ZlcmFiaWxpdHlUcmVlKG5ldCldO1xyXG4gICAgICAgIGNvbnN0IHBsYWNlT3JkZXJpbmcgPSB0b0V4cGxvcmVbMF0ub21lZ2FNYXJraW5nLmdldEtleXMoKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKHRvRXhwbG9yZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0b0V4cGxvcmUuc2hpZnQoKSE7XHJcbiAgICAgICAgICAgIHRvRXhwbG9yZS5wdXNoKC4uLm5leHQuZ2V0Q2hpbGRyZW4oKSlcclxuICAgICAgICAgICAgY29uc3QgbSA9IG5leHQub21lZ2FNYXJraW5nO1xyXG4gICAgICAgICAgICByZWFjaGFibGVNYXJraW5ncy5zZXQodGhpcy5zdHJpbmdpZnlNYXJraW5nKG0sIHBsYWNlT3JkZXJpbmcpLCBtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZWFjaGFibGVNYXJraW5ncztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0TGFiZWxNYXBwaW5nKG5ldDogUGV0cmlOZXQpOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBuZXQuZ2V0VHJhbnNpdGlvbnMoKSkge1xyXG4gICAgICAgICAgICBpZiAodC5sYWJlbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNpbGVudCB0cmFuc2l0aW9ucyBhcmUgdW5zdXBwb3J0ZWQhIFRoZSB0cmFuc2l0aW9uIHdpdGggaWQgJyR7dC5pZH0nIGhhcyBubyBsYWJlbGApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaGFzKHQubGFiZWwhKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMYWJlbCBzcGxpdHRpbmcgaXMgbm90IHN1cHBvcnRlZCEgVGhlIGxhYmVsICcke3QubGFiZWx9JyBpcyBzaGFyZWQgYnkgYXQgbGVhc3QgdHdvIHRyYW5zaXRpb25zYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdWx0LnNldCh0LmxhYmVsLCB0LmlkISk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN0cmluZ2lmeU1hcmtpbmcobWFya2luZzogTWFya2luZywgcGxhY2VPcmRlcmluZzogQXJyYXk8c3RyaW5nPik6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHBsYWNlT3JkZXJpbmcubWFwKHBpZCA9PiBtYXJraW5nLmdldChwaWQpKS5qb2luKCcsJyk7XHJcbiAgICB9XHJcbn1cclxuIl19