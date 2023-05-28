import { Injectable } from '@angular/core';
import { MapSet } from '../../../utility/map-set';
import { MappingManager } from './classes/mapping-manager';
import { Transition } from '../../../models/pn/model/transition';
import * as i0 from "@angular/core";
import * as i1 from "../transformation/petri-net-to-partial-order-transformer.service";
import * as i2 from "../../po/isomorphism/partial-order-isomorphism.service";
export class PetriNetIsomorphismService {
    constructor(_pnToPoTransformer, _poIsomorphism) {
        this._pnToPoTransformer = _pnToPoTransformer;
        this._poIsomorphism = _poIsomorphism;
    }
    arePartialOrderPetriNetsIsomorphic(partialOrderA, partialOrderB) {
        if (!this.compareBasicNetProperties(partialOrderA, partialOrderB)) {
            return false;
        }
        return this._poIsomorphism.arePartialOrdersIsomorphic(this._pnToPoTransformer.transform(partialOrderA), this._pnToPoTransformer.transform(partialOrderB));
    }
    arePetriNetsIsomorphic(netA, netB) {
        return !!this.getIsomorphicPetriNetMapping(netA, netB);
    }
    getIsomorphicPetriNetMapping(netA, netB) {
        if (!this.compareBasicNetProperties(netA, netB)) {
            return undefined;
        }
        const transitionMapping = this.determinePossibleTransitionMappings(netA, netB);
        if (transitionMapping === undefined) {
            return undefined;
        }
        const placeMapping = this.determinePossiblePlaceMappings(netA, netB);
        if (placeMapping === undefined) {
            return undefined;
        }
        const transitionMappingManager = new MappingManager(transitionMapping);
        const placeMappingManager = new MappingManager(placeMapping);
        let done = false;
        do {
            const transitionMapping = transitionMappingManager.getCurrentMapping();
            const uniqueTransitionsMapped = new Set(transitionMapping.values());
            if (transitionMapping.size === uniqueTransitionsMapped.size) { // bijective transition mapping
                const placeMapping = placeMappingManager.getCurrentMapping();
                const uniquePlacesMapped = new Set(placeMapping.values());
                if (placeMapping.size === uniquePlacesMapped.size // bijective place mapping
                    && this.isMappingAPetriNetIsomorphism(netA, netB, transitionMapping, placeMapping)) {
                    return {
                        placeMapping,
                        transitionMapping
                    };
                }
            }
            const carry = transitionMappingManager.moveToNextMapping();
            if (carry) {
                done = placeMappingManager.moveToNextMapping();
            }
        } while (!done);
        return undefined;
    }
    compareBasicNetProperties(netA, netB) {
        return netA.getTransitionCount() === netB.getTransitionCount()
            && netA.getPlaceCount() === netB.getPlaceCount()
            && netA.getArcCount() === netB.getArcCount()
            && netA.inputPlaces.size === netB.inputPlaces.size
            && netA.outputPlaces.size === netB.outputPlaces.size;
    }
    determinePossibleTransitionMappings(netA, netB) {
        const transitionMapping = new MapSet();
        for (const tA of netA.getTransitions()) {
            let wasMapped = false;
            for (const tB of netB.getTransitions()) {
                if (tA.label === tB.label
                    && tA.ingoingArcs.length === tB.ingoingArcs.length
                    && tA.outgoingArcs.length === tB.outgoingArcs.length) {
                    wasMapped = true;
                    transitionMapping.add(tA.getId(), tB.getId());
                }
            }
            if (!wasMapped) {
                return undefined;
            }
        }
        return transitionMapping;
    }
    determinePossiblePlaceMappings(netA, netB) {
        const placeMapping = new MapSet();
        for (const pA of netA.getPlaces()) {
            let wasMapped = false;
            for (const pB of netB.getPlaces()) {
                if (pA.marking === pB.marking
                    && pA.ingoingArcs.length === pB.ingoingArcs.length
                    && pA.outgoingArcs.length === pB.outgoingArcs.length) {
                    wasMapped = true;
                    placeMapping.add(pA.getId(), pB.getId());
                }
            }
            if (!wasMapped) {
                return undefined;
            }
        }
        return placeMapping;
    }
    isMappingAPartialOrderIsomorphism(partialOrderA, partialOrderB, transitionMapping) {
        const unmappedArcs = partialOrderB.getPlaces().filter(p => p.ingoingArcs.length !== 0 && p.outgoingArcs.length !== 0);
        for (const arc of partialOrderA.getPlaces()) {
            if (arc.ingoingArcs.length === 0 || arc.outgoingArcs.length === 0) {
                continue;
            }
            const preTransitionB = transitionMapping.get(arc.ingoingArcs[0].sourceId);
            const postTransitionB = transitionMapping.get(arc.outgoingArcs[0].destinationId);
            const fittingArcIndex = unmappedArcs.findIndex(unmapped => unmapped.ingoingArcs[0].sourceId === preTransitionB && unmapped.outgoingArcs[0].destinationId === postTransitionB);
            if (fittingArcIndex === -1) {
                return false;
            }
            unmappedArcs.splice(fittingArcIndex, 1);
        }
        return true;
    }
    isMappingAPetriNetIsomorphism(netA, netB, transitionMapping, placeMapping) {
        const unmappedArcs = netB.getArcs();
        for (const arc of netA.getArcs()) {
            let arcSourceId;
            let arcDestinationId;
            if (arc.source instanceof Transition) {
                arcSourceId = transitionMapping.get(arc.sourceId);
                arcDestinationId = placeMapping.get(arc.destinationId);
            }
            else {
                arcSourceId = placeMapping.get(arc.sourceId);
                arcDestinationId = transitionMapping.get(arc.destinationId);
            }
            // TODO arc weight is not considered when creating possible mappings. Inclusion of this property might make the algorithm more efficient
            const fittingArcIndex = unmappedArcs.findIndex(unmapped => unmapped.sourceId === arcSourceId && unmapped.destinationId === arcDestinationId && unmapped.weight === arc.weight);
            if (fittingArcIndex === -1) {
                return false;
            }
            unmappedArcs.splice(fittingArcIndex, 1);
        }
        return true;
    }
}
PetriNetIsomorphismService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetIsomorphismService, deps: [{ token: i1.PetriNetToPartialOrderTransformerService }, { token: i2.PartialOrderIsomorphismService }], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetIsomorphismService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetIsomorphismService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetIsomorphismService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetToPartialOrderTransformerService }, { type: i2.PartialOrderIsomorphismService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LWlzb21vcnBoaXNtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9wbi9pc29tb3JwaGlzbS9wZXRyaS1uZXQtaXNvbW9ycGhpc20uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7O0FBVy9ELE1BQU0sT0FBTywwQkFBMEI7SUFFbkMsWUFBc0Isa0JBQTRELEVBQzVELGNBQThDO1FBRDlDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEM7UUFDNUQsbUJBQWMsR0FBZCxjQUFjLENBQWdDO0lBQ3BFLENBQUM7SUFFTSxrQ0FBa0MsQ0FBQyxhQUF1QixFQUFFLGFBQXVCO1FBQ3RGLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1lBQy9ELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLDBCQUEwQixDQUNqRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUNoRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUNuRCxDQUFDO0lBQ04sQ0FBQztJQUVNLHNCQUFzQixDQUFDLElBQWMsRUFBRSxJQUFjO1FBQ3hELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FB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QTBCO2tCQUh0QyxVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UGV0cmlOZXR9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9wZXRyaS1uZXQnO1xyXG5pbXBvcnQge01hcFNldH0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0eS9tYXAtc2V0JztcclxuaW1wb3J0IHtNYXBwaW5nTWFuYWdlcn0gZnJvbSAnLi9jbGFzc2VzL21hcHBpbmctbWFuYWdlcic7XHJcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3RyYW5zaXRpb24nO1xyXG5pbXBvcnQge1xyXG4gICAgUGV0cmlOZXRUb1BhcnRpYWxPcmRlclRyYW5zZm9ybWVyU2VydmljZVxyXG59IGZyb20gJy4uL3RyYW5zZm9ybWF0aW9uL3BldHJpLW5ldC10by1wYXJ0aWFsLW9yZGVyLXRyYW5zZm9ybWVyLnNlcnZpY2UnO1xyXG5pbXBvcnQge1BhcnRpYWxPcmRlcklzb21vcnBoaXNtU2VydmljZX0gZnJvbSAnLi4vLi4vcG8vaXNvbW9ycGhpc20vcGFydGlhbC1vcmRlci1pc29tb3JwaGlzbS5zZXJ2aWNlJztcclxuaW1wb3J0IHtNYXBwaW5nfSBmcm9tICcuL2NsYXNzZXMvbWFwcGluZyc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQZXRyaU5ldElzb21vcnBoaXNtU2VydmljZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9wblRvUG9UcmFuc2Zvcm1lcjogUGV0cmlOZXRUb1BhcnRpYWxPcmRlclRyYW5zZm9ybWVyU2VydmljZSxcclxuICAgICAgICAgICAgICAgIHByb3RlY3RlZCBfcG9Jc29tb3JwaGlzbTogUGFydGlhbE9yZGVySXNvbW9ycGhpc21TZXJ2aWNlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFyZVBhcnRpYWxPcmRlclBldHJpTmV0c0lzb21vcnBoaWMocGFydGlhbE9yZGVyQTogUGV0cmlOZXQsIHBhcnRpYWxPcmRlckI6IFBldHJpTmV0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBhcmVCYXNpY05ldFByb3BlcnRpZXMocGFydGlhbE9yZGVyQSwgcGFydGlhbE9yZGVyQikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvSXNvbW9ycGhpc20uYXJlUGFydGlhbE9yZGVyc0lzb21vcnBoaWMoXHJcbiAgICAgICAgICAgIHRoaXMuX3BuVG9Qb1RyYW5zZm9ybWVyLnRyYW5zZm9ybShwYXJ0aWFsT3JkZXJBKSxcclxuICAgICAgICAgICAgdGhpcy5fcG5Ub1BvVHJhbnNmb3JtZXIudHJhbnNmb3JtKHBhcnRpYWxPcmRlckIpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXJlUGV0cmlOZXRzSXNvbW9ycGhpYyhuZXRBOiBQZXRyaU5ldCwgbmV0QjogUGV0cmlOZXQpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLmdldElzb21vcnBoaWNQZXRyaU5ldE1hcHBpbmcobmV0QSwgbmV0Qik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldElzb21vcnBoaWNQZXRyaU5ldE1hcHBpbmcobmV0QTogUGV0cmlOZXQsIG5ldEI6IFBldHJpTmV0KTogTWFwcGluZyB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbXBhcmVCYXNpY05ldFByb3BlcnRpZXMobmV0QSwgbmV0QikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb25NYXBwaW5nID0gdGhpcy5kZXRlcm1pbmVQb3NzaWJsZVRyYW5zaXRpb25NYXBwaW5ncyhuZXRBLCBuZXRCKTtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbk1hcHBpbmcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGxhY2VNYXBwaW5nID0gdGhpcy5kZXRlcm1pbmVQb3NzaWJsZVBsYWNlTWFwcGluZ3MobmV0QSwgbmV0Qik7XHJcbiAgICAgICAgaWYgKHBsYWNlTWFwcGluZyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0cmFuc2l0aW9uTWFwcGluZ01hbmFnZXIgPSBuZXcgTWFwcGluZ01hbmFnZXIodHJhbnNpdGlvbk1hcHBpbmcpO1xyXG4gICAgICAgIGNvbnN0IHBsYWNlTWFwcGluZ01hbmFnZXIgPSBuZXcgTWFwcGluZ01hbmFnZXIocGxhY2VNYXBwaW5nKTtcclxuXHJcbiAgICAgICAgbGV0IGRvbmUgPSBmYWxzZTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb25NYXBwaW5nID0gdHJhbnNpdGlvbk1hcHBpbmdNYW5hZ2VyLmdldEN1cnJlbnRNYXBwaW5nKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHVuaXF1ZVRyYW5zaXRpb25zTWFwcGVkID0gbmV3IFNldDxzdHJpbmc+KHRyYW5zaXRpb25NYXBwaW5nLnZhbHVlcygpKTtcclxuICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25NYXBwaW5nLnNpemUgPT09IHVuaXF1ZVRyYW5zaXRpb25zTWFwcGVkLnNpemUpIHsgLy8gYmlqZWN0aXZlIHRyYW5zaXRpb24gbWFwcGluZ1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGxhY2VNYXBwaW5nID0gcGxhY2VNYXBwaW5nTWFuYWdlci5nZXRDdXJyZW50TWFwcGluZygpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdW5pcXVlUGxhY2VzTWFwcGVkID0gbmV3IFNldDxzdHJpbmc+KHBsYWNlTWFwcGluZy52YWx1ZXMoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxhY2VNYXBwaW5nLnNpemUgPT09IHVuaXF1ZVBsYWNlc01hcHBlZC5zaXplIC8vIGJpamVjdGl2ZSBwbGFjZSBtYXBwaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5pc01hcHBpbmdBUGV0cmlOZXRJc29tb3JwaGlzbShuZXRBLCBuZXRCLCB0cmFuc2l0aW9uTWFwcGluZywgcGxhY2VNYXBwaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlTWFwcGluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbk1hcHBpbmdcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjYXJyeSA9IHRyYW5zaXRpb25NYXBwaW5nTWFuYWdlci5tb3ZlVG9OZXh0TWFwcGluZygpO1xyXG4gICAgICAgICAgICBpZiAoY2FycnkpIHtcclxuICAgICAgICAgICAgICAgIGRvbmUgPSBwbGFjZU1hcHBpbmdNYW5hZ2VyLm1vdmVUb05leHRNYXBwaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IHdoaWxlICghZG9uZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb21wYXJlQmFzaWNOZXRQcm9wZXJ0aWVzKG5ldEE6IFBldHJpTmV0LCBuZXRCOiBQZXRyaU5ldCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBuZXRBLmdldFRyYW5zaXRpb25Db3VudCgpID09PSBuZXRCLmdldFRyYW5zaXRpb25Db3VudCgpXHJcbiAgICAgICAgICAgICYmIG5ldEEuZ2V0UGxhY2VDb3VudCgpID09PSBuZXRCLmdldFBsYWNlQ291bnQoKVxyXG4gICAgICAgICAgICAmJiBuZXRBLmdldEFyY0NvdW50KCkgPT09IG5ldEIuZ2V0QXJjQ291bnQoKVxyXG4gICAgICAgICAgICAmJiBuZXRBLmlucHV0UGxhY2VzLnNpemUgPT09IG5ldEIuaW5wdXRQbGFjZXMuc2l6ZVxyXG4gICAgICAgICAgICAmJiBuZXRBLm91dHB1dFBsYWNlcy5zaXplID09PSBuZXRCLm91dHB1dFBsYWNlcy5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5lUG9zc2libGVUcmFuc2l0aW9uTWFwcGluZ3MobmV0QTogUGV0cmlOZXQsIG5ldEI6IFBldHJpTmV0KTogTWFwU2V0PHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbk1hcHBpbmcgPSBuZXcgTWFwU2V0PHN0cmluZywgc3RyaW5nPigpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdEEgb2YgbmV0QS5nZXRUcmFuc2l0aW9ucygpKSB7XHJcbiAgICAgICAgICAgIGxldCB3YXNNYXBwZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCB0QiBvZiBuZXRCLmdldFRyYW5zaXRpb25zKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0QS5sYWJlbCA9PT0gdEIubGFiZWxcclxuICAgICAgICAgICAgICAgICAgICAmJiB0QS5pbmdvaW5nQXJjcy5sZW5ndGggPT09IHRCLmluZ29pbmdBcmNzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHRBLm91dGdvaW5nQXJjcy5sZW5ndGggPT09IHRCLm91dGdvaW5nQXJjcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXNNYXBwZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25NYXBwaW5nLmFkZCh0QS5nZXRJZCgpLCB0Qi5nZXRJZCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXdhc01hcHBlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcHBpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmVQb3NzaWJsZVBsYWNlTWFwcGluZ3MobmV0QTogUGV0cmlOZXQsIG5ldEI6IFBldHJpTmV0KTogTWFwU2V0PHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgcGxhY2VNYXBwaW5nID0gbmV3IE1hcFNldDxzdHJpbmcsIHN0cmluZz4oKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHBBIG9mIG5ldEEuZ2V0UGxhY2VzKCkpIHtcclxuICAgICAgICAgICAgbGV0IHdhc01hcHBlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBCIG9mIG5ldEIuZ2V0UGxhY2VzKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwQS5tYXJraW5nID09PSBwQi5tYXJraW5nXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgcEEuaW5nb2luZ0FyY3MubGVuZ3RoID09PSBwQi5pbmdvaW5nQXJjcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAmJiBwQS5vdXRnb2luZ0FyY3MubGVuZ3RoID09PSBwQi5vdXRnb2luZ0FyY3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FzTWFwcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZU1hcHBpbmcuYWRkKHBBLmdldElkKCksIHBCLmdldElkKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghd2FzTWFwcGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwbGFjZU1hcHBpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc01hcHBpbmdBUGFydGlhbE9yZGVySXNvbW9ycGhpc20ocGFydGlhbE9yZGVyQTogUGV0cmlOZXQsIHBhcnRpYWxPcmRlckI6IFBldHJpTmV0LCB0cmFuc2l0aW9uTWFwcGluZzogTWFwPHN0cmluZywgc3RyaW5nPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHVubWFwcGVkQXJjcyA9IHBhcnRpYWxPcmRlckIuZ2V0UGxhY2VzKCkuZmlsdGVyKHAgPT4gcC5pbmdvaW5nQXJjcy5sZW5ndGggIT09IDAgJiYgcC5vdXRnb2luZ0FyY3MubGVuZ3RoICE9PSAwKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBhcmMgb2YgcGFydGlhbE9yZGVyQS5nZXRQbGFjZXMoKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJjLmluZ29pbmdBcmNzLmxlbmd0aCA9PT0gMCB8fCBhcmMub3V0Z29pbmdBcmNzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcHJlVHJhbnNpdGlvbkIgPSB0cmFuc2l0aW9uTWFwcGluZy5nZXQoYXJjLmluZ29pbmdBcmNzWzBdLnNvdXJjZUlkKSE7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc3RUcmFuc2l0aW9uQiA9IHRyYW5zaXRpb25NYXBwaW5nLmdldChhcmMub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uSWQpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZml0dGluZ0FyY0luZGV4ID0gdW5tYXBwZWRBcmNzLmZpbmRJbmRleCh1bm1hcHBlZCA9PiB1bm1hcHBlZC5pbmdvaW5nQXJjc1swXS5zb3VyY2VJZCA9PT0gcHJlVHJhbnNpdGlvbkIgJiYgdW5tYXBwZWQub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uSWQgPT09IHBvc3RUcmFuc2l0aW9uQik7XHJcbiAgICAgICAgICAgIGlmIChmaXR0aW5nQXJjSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdW5tYXBwZWRBcmNzLnNwbGljZShmaXR0aW5nQXJjSW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc01hcHBpbmdBUGV0cmlOZXRJc29tb3JwaGlzbShuZXRBOiBQZXRyaU5ldCwgbmV0QjogUGV0cmlOZXQsIHRyYW5zaXRpb25NYXBwaW5nOiBNYXA8c3RyaW5nLCBzdHJpbmc+LCBwbGFjZU1hcHBpbmc6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCB1bm1hcHBlZEFyY3MgPSBuZXRCLmdldEFyY3MoKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBhcmMgb2YgbmV0QS5nZXRBcmNzKCkpIHtcclxuICAgICAgICAgICAgbGV0IGFyY1NvdXJjZUlkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCBhcmNEZXN0aW5hdGlvbklkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGlmIChhcmMuc291cmNlIGluc3RhbmNlb2YgVHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgYXJjU291cmNlSWQgPSB0cmFuc2l0aW9uTWFwcGluZy5nZXQoYXJjLnNvdXJjZUlkKSE7XHJcbiAgICAgICAgICAgICAgICBhcmNEZXN0aW5hdGlvbklkID0gcGxhY2VNYXBwaW5nLmdldChhcmMuZGVzdGluYXRpb25JZCkhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJjU291cmNlSWQgPSBwbGFjZU1hcHBpbmcuZ2V0KGFyYy5zb3VyY2VJZCkhO1xyXG4gICAgICAgICAgICAgICAgYXJjRGVzdGluYXRpb25JZCA9IHRyYW5zaXRpb25NYXBwaW5nLmdldChhcmMuZGVzdGluYXRpb25JZCkhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPIGFyYyB3ZWlnaHQgaXMgbm90IGNvbnNpZGVyZWQgd2hlbiBjcmVhdGluZyBwb3NzaWJsZSBtYXBwaW5ncy4gSW5jbHVzaW9uIG9mIHRoaXMgcHJvcGVydHkgbWlnaHQgbWFrZSB0aGUgYWxnb3JpdGhtIG1vcmUgZWZmaWNpZW50XHJcbiAgICAgICAgICAgIGNvbnN0IGZpdHRpbmdBcmNJbmRleCA9IHVubWFwcGVkQXJjcy5maW5kSW5kZXgodW5tYXBwZWQgPT4gdW5tYXBwZWQuc291cmNlSWQgPT09IGFyY1NvdXJjZUlkICYmIHVubWFwcGVkLmRlc3RpbmF0aW9uSWQgPT09IGFyY0Rlc3RpbmF0aW9uSWQgJiYgdW5tYXBwZWQud2VpZ2h0ID09PSBhcmMud2VpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKGZpdHRpbmdBcmNJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1bm1hcHBlZEFyY3Muc3BsaWNlKGZpdHRpbmdBcmNJbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4iXX0=