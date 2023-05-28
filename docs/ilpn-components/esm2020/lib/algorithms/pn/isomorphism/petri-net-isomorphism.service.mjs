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
        if (!this.compareBasicNetProperties(netA, netB)) {
            return false;
        }
        const transitionMapping = this.determinePossibleTransitionMappings(netA, netB);
        if (transitionMapping === undefined) {
            return false;
        }
        const placeMapping = this.determinePossiblePlaceMappings(netA, netB);
        if (placeMapping === undefined) {
            return false;
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
                    return true;
                }
            }
            const carry = transitionMappingManager.moveToNextMapping();
            if (carry) {
                done = placeMappingManager.moveToNextMapping();
            }
        } while (!done);
        return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LWlzb21vcnBoaXNtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9wbi9pc29tb3JwaGlzbS9wZXRyaS1uZXQtaXNvbW9ycGhpc20uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7O0FBUy9ELE1BQU0sT0FBTywwQkFBMEI7SUFFbkMsWUFBc0Isa0JBQTRELEVBQzVELGNBQThDO1FBRDlDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEM7UUFDNUQsbUJBQWMsR0FBZCxjQUFjLENBQWdDO0lBQ3BFLENBQUM7SUFFTSxrQ0FBa0MsQ0FBQyxhQUF1QixFQUFFLGFBQXVCO1FBQ3RGLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1lBQy9ELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLDBCQUEwQixDQUNqRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUNoRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUNuRCxDQUFDO0lBQ04sQ0FBQztJQUVNLHNCQUFzQixDQUFDLElBQWMsRUFBRSxJQUFjO1FBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQzdDLE9BQU8sS0FB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QUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDOUIsSUFBSSxXQUFtQixDQUFDO1lBQ3hCLElBQUksZ0JBQXdCLENBQUM7WUFDN0IsSUFBSSxHQUFHLENBQUMsTUFBTSxZQUFZLFVBQVUsRUFBRTtnQkFDbEMsV0FBVyxHQUFHLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFFLENBQUM7Z0JBQ25ELGdCQUFnQixHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBRSxDQUFDO2FBQzNEO2lCQUFNO2dCQUNILFdBQVcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUUsQ0FBQztnQkFDOUMsZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUUsQ0FBQzthQUNoRTtZQUVELHdJQUF3STtZQUN4SSxNQUFNLGVBQWUsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxXQUFXLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxnQkFBZ0IsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvSyxJQUFJLGVBQWUsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxLQUFLLENBQUM7YUFDaEI7WUFDRCxZQUFZLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMzQztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7O3VIQWxKUSwwQkFBMEI7MkhBQTFCLDBCQUEwQixjQUZ2QixNQUFNOzJGQUVULDBCQUEwQjtrQkFIdEMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtNYXBTZXR9IGZyb20gJy4uLy4uLy4uL3V0aWxpdHkvbWFwLXNldCc7XHJcbmltcG9ydCB7TWFwcGluZ01hbmFnZXJ9IGZyb20gJy4vY2xhc3Nlcy9tYXBwaW5nLW1hbmFnZXInO1xyXG5pbXBvcnQge1RyYW5zaXRpb259IGZyb20gJy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC90cmFuc2l0aW9uJztcclxuaW1wb3J0IHtcclxuICAgIFBldHJpTmV0VG9QYXJ0aWFsT3JkZXJUcmFuc2Zvcm1lclNlcnZpY2VcclxufSBmcm9tICcuLi90cmFuc2Zvcm1hdGlvbi9wZXRyaS1uZXQtdG8tcGFydGlhbC1vcmRlci10cmFuc2Zvcm1lci5zZXJ2aWNlJztcclxuaW1wb3J0IHtQYXJ0aWFsT3JkZXJJc29tb3JwaGlzbVNlcnZpY2V9IGZyb20gJy4uLy4uL3BvL2lzb21vcnBoaXNtL3BhcnRpYWwtb3JkZXItaXNvbW9ycGhpc20uc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFBldHJpTmV0SXNvbW9ycGhpc21TZXJ2aWNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX3BuVG9Qb1RyYW5zZm9ybWVyOiBQZXRyaU5ldFRvUGFydGlhbE9yZGVyVHJhbnNmb3JtZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgcHJvdGVjdGVkIF9wb0lzb21vcnBoaXNtOiBQYXJ0aWFsT3JkZXJJc29tb3JwaGlzbVNlcnZpY2UpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXJlUGFydGlhbE9yZGVyUGV0cmlOZXRzSXNvbW9ycGhpYyhwYXJ0aWFsT3JkZXJBOiBQZXRyaU5ldCwgcGFydGlhbE9yZGVyQjogUGV0cmlOZXQpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29tcGFyZUJhc2ljTmV0UHJvcGVydGllcyhwYXJ0aWFsT3JkZXJBLCBwYXJ0aWFsT3JkZXJCKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9Jc29tb3JwaGlzbS5hcmVQYXJ0aWFsT3JkZXJzSXNvbW9ycGhpYyhcclxuICAgICAgICAgICAgdGhpcy5fcG5Ub1BvVHJhbnNmb3JtZXIudHJhbnNmb3JtKHBhcnRpYWxPcmRlckEpLFxyXG4gICAgICAgICAgICB0aGlzLl9wblRvUG9UcmFuc2Zvcm1lci50cmFuc2Zvcm0ocGFydGlhbE9yZGVyQilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhcmVQZXRyaU5ldHNJc29tb3JwaGljKG5ldEE6IFBldHJpTmV0LCBuZXRCOiBQZXRyaU5ldCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5jb21wYXJlQmFzaWNOZXRQcm9wZXJ0aWVzKG5ldEEsIG5ldEIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb25NYXBwaW5nID0gdGhpcy5kZXRlcm1pbmVQb3NzaWJsZVRyYW5zaXRpb25NYXBwaW5ncyhuZXRBLCBuZXRCKTtcclxuICAgICAgICBpZiAodHJhbnNpdGlvbk1hcHBpbmcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwbGFjZU1hcHBpbmcgPSB0aGlzLmRldGVybWluZVBvc3NpYmxlUGxhY2VNYXBwaW5ncyhuZXRBLCBuZXRCKTtcclxuICAgICAgICBpZiAocGxhY2VNYXBwaW5nID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbk1hcHBpbmdNYW5hZ2VyID0gbmV3IE1hcHBpbmdNYW5hZ2VyKHRyYW5zaXRpb25NYXBwaW5nKTtcclxuICAgICAgICBjb25zdCBwbGFjZU1hcHBpbmdNYW5hZ2VyID0gbmV3IE1hcHBpbmdNYW5hZ2VyKHBsYWNlTWFwcGluZyk7XHJcblxyXG4gICAgICAgIGxldCBkb25lID0gZmFsc2U7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2l0aW9uTWFwcGluZyA9IHRyYW5zaXRpb25NYXBwaW5nTWFuYWdlci5nZXRDdXJyZW50TWFwcGluZygpO1xyXG4gICAgICAgICAgICBjb25zdCB1bmlxdWVUcmFuc2l0aW9uc01hcHBlZCA9IG5ldyBTZXQ8c3RyaW5nPih0cmFuc2l0aW9uTWFwcGluZy52YWx1ZXMoKSk7XHJcbiAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uTWFwcGluZy5zaXplID09PSB1bmlxdWVUcmFuc2l0aW9uc01hcHBlZC5zaXplKSB7IC8vIGJpamVjdGl2ZSB0cmFuc2l0aW9uIG1hcHBpbmdcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBsYWNlTWFwcGluZyA9IHBsYWNlTWFwcGluZ01hbmFnZXIuZ2V0Q3VycmVudE1hcHBpbmcoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXF1ZVBsYWNlc01hcHBlZCA9IG5ldyBTZXQ8c3RyaW5nPihwbGFjZU1hcHBpbmcudmFsdWVzKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlTWFwcGluZy5zaXplID09PSB1bmlxdWVQbGFjZXNNYXBwZWQuc2l6ZSAvLyBiaWplY3RpdmUgcGxhY2UgbWFwcGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICYmIHRoaXMuaXNNYXBwaW5nQVBldHJpTmV0SXNvbW9ycGhpc20obmV0QSwgbmV0QiwgdHJhbnNpdGlvbk1hcHBpbmcsIHBsYWNlTWFwcGluZykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY2FycnkgPSB0cmFuc2l0aW9uTWFwcGluZ01hbmFnZXIubW92ZVRvTmV4dE1hcHBpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGNhcnJ5KSB7XHJcbiAgICAgICAgICAgICAgICBkb25lID0gcGxhY2VNYXBwaW5nTWFuYWdlci5tb3ZlVG9OZXh0TWFwcGluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSB3aGlsZSAoIWRvbmUpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb21wYXJlQmFzaWNOZXRQcm9wZXJ0aWVzKG5ldEE6IFBldHJpTmV0LCBuZXRCOiBQZXRyaU5ldCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBuZXRBLmdldFRyYW5zaXRpb25Db3VudCgpID09PSBuZXRCLmdldFRyYW5zaXRpb25Db3VudCgpXHJcbiAgICAgICAgICAgICYmIG5ldEEuZ2V0UGxhY2VDb3VudCgpID09PSBuZXRCLmdldFBsYWNlQ291bnQoKVxyXG4gICAgICAgICAgICAmJiBuZXRBLmdldEFyY0NvdW50KCkgPT09IG5ldEIuZ2V0QXJjQ291bnQoKVxyXG4gICAgICAgICAgICAmJiBuZXRBLmlucHV0UGxhY2VzLnNpemUgPT09IG5ldEIuaW5wdXRQbGFjZXMuc2l6ZVxyXG4gICAgICAgICAgICAmJiBuZXRBLm91dHB1dFBsYWNlcy5zaXplID09PSBuZXRCLm91dHB1dFBsYWNlcy5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5lUG9zc2libGVUcmFuc2l0aW9uTWFwcGluZ3MobmV0QTogUGV0cmlOZXQsIG5ldEI6IFBldHJpTmV0KTogTWFwU2V0PHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbk1hcHBpbmcgPSBuZXcgTWFwU2V0PHN0cmluZywgc3RyaW5nPigpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdEEgb2YgbmV0QS5nZXRUcmFuc2l0aW9ucygpKSB7XHJcbiAgICAgICAgICAgIGxldCB3YXNNYXBwZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCB0QiBvZiBuZXRCLmdldFRyYW5zaXRpb25zKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0QS5sYWJlbCA9PT0gdEIubGFiZWxcclxuICAgICAgICAgICAgICAgICAgICAmJiB0QS5pbmdvaW5nQXJjcy5sZW5ndGggPT09IHRCLmluZ29pbmdBcmNzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICYmIHRBLm91dGdvaW5nQXJjcy5sZW5ndGggPT09IHRCLm91dGdvaW5nQXJjcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXNNYXBwZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25NYXBwaW5nLmFkZCh0QS5nZXRJZCgpLCB0Qi5nZXRJZCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXdhc01hcHBlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcHBpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmVQb3NzaWJsZVBsYWNlTWFwcGluZ3MobmV0QTogUGV0cmlOZXQsIG5ldEI6IFBldHJpTmV0KTogTWFwU2V0PHN0cmluZywgc3RyaW5nPiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgcGxhY2VNYXBwaW5nID0gbmV3IE1hcFNldDxzdHJpbmcsIHN0cmluZz4oKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHBBIG9mIG5ldEEuZ2V0UGxhY2VzKCkpIHtcclxuICAgICAgICAgICAgbGV0IHdhc01hcHBlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBCIG9mIG5ldEIuZ2V0UGxhY2VzKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwQS5tYXJraW5nID09PSBwQi5tYXJraW5nXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgcEEuaW5nb2luZ0FyY3MubGVuZ3RoID09PSBwQi5pbmdvaW5nQXJjcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAmJiBwQS5vdXRnb2luZ0FyY3MubGVuZ3RoID09PSBwQi5vdXRnb2luZ0FyY3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FzTWFwcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZU1hcHBpbmcuYWRkKHBBLmdldElkKCksIHBCLmdldElkKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghd2FzTWFwcGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwbGFjZU1hcHBpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc01hcHBpbmdBUGFydGlhbE9yZGVySXNvbW9ycGhpc20ocGFydGlhbE9yZGVyQTogUGV0cmlOZXQsIHBhcnRpYWxPcmRlckI6IFBldHJpTmV0LCB0cmFuc2l0aW9uTWFwcGluZzogTWFwPHN0cmluZywgc3RyaW5nPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHVubWFwcGVkQXJjcyA9IHBhcnRpYWxPcmRlckIuZ2V0UGxhY2VzKCkuZmlsdGVyKHAgPT4gcC5pbmdvaW5nQXJjcy5sZW5ndGggIT09IDAgJiYgcC5vdXRnb2luZ0FyY3MubGVuZ3RoICE9PSAwKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBhcmMgb2YgcGFydGlhbE9yZGVyQS5nZXRQbGFjZXMoKSkge1xyXG4gICAgICAgICAgICBpZiAoYXJjLmluZ29pbmdBcmNzLmxlbmd0aCA9PT0gMCB8fCBhcmMub3V0Z29pbmdBcmNzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcHJlVHJhbnNpdGlvbkIgPSB0cmFuc2l0aW9uTWFwcGluZy5nZXQoYXJjLmluZ29pbmdBcmNzWzBdLnNvdXJjZUlkKSE7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc3RUcmFuc2l0aW9uQiA9IHRyYW5zaXRpb25NYXBwaW5nLmdldChhcmMub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uSWQpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZml0dGluZ0FyY0luZGV4ID0gdW5tYXBwZWRBcmNzLmZpbmRJbmRleCh1bm1hcHBlZCA9PiB1bm1hcHBlZC5pbmdvaW5nQXJjc1swXS5zb3VyY2VJZCA9PT0gcHJlVHJhbnNpdGlvbkIgJiYgdW5tYXBwZWQub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uSWQgPT09IHBvc3RUcmFuc2l0aW9uQik7XHJcbiAgICAgICAgICAgIGlmIChmaXR0aW5nQXJjSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdW5tYXBwZWRBcmNzLnNwbGljZShmaXR0aW5nQXJjSW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc01hcHBpbmdBUGV0cmlOZXRJc29tb3JwaGlzbShuZXRBOiBQZXRyaU5ldCwgbmV0QjogUGV0cmlOZXQsIHRyYW5zaXRpb25NYXBwaW5nOiBNYXA8c3RyaW5nLCBzdHJpbmc+LCBwbGFjZU1hcHBpbmc6IE1hcDxzdHJpbmcsIHN0cmluZz4pOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCB1bm1hcHBlZEFyY3MgPSBuZXRCLmdldEFyY3MoKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBhcmMgb2YgbmV0QS5nZXRBcmNzKCkpIHtcclxuICAgICAgICAgICAgbGV0IGFyY1NvdXJjZUlkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGxldCBhcmNEZXN0aW5hdGlvbklkOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGlmIChhcmMuc291cmNlIGluc3RhbmNlb2YgVHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgYXJjU291cmNlSWQgPSB0cmFuc2l0aW9uTWFwcGluZy5nZXQoYXJjLnNvdXJjZUlkKSE7XHJcbiAgICAgICAgICAgICAgICBhcmNEZXN0aW5hdGlvbklkID0gcGxhY2VNYXBwaW5nLmdldChhcmMuZGVzdGluYXRpb25JZCkhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJjU291cmNlSWQgPSBwbGFjZU1hcHBpbmcuZ2V0KGFyYy5zb3VyY2VJZCkhO1xyXG4gICAgICAgICAgICAgICAgYXJjRGVzdGluYXRpb25JZCA9IHRyYW5zaXRpb25NYXBwaW5nLmdldChhcmMuZGVzdGluYXRpb25JZCkhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPIGFyYyB3ZWlnaHQgaXMgbm90IGNvbnNpZGVyZWQgd2hlbiBjcmVhdGluZyBwb3NzaWJsZSBtYXBwaW5ncy4gSW5jbHVzaW9uIG9mIHRoaXMgcHJvcGVydHkgbWlnaHQgbWFrZSB0aGUgYWxnb3JpdGhtIG1vcmUgZWZmaWNpZW50XHJcbiAgICAgICAgICAgIGNvbnN0IGZpdHRpbmdBcmNJbmRleCA9IHVubWFwcGVkQXJjcy5maW5kSW5kZXgodW5tYXBwZWQgPT4gdW5tYXBwZWQuc291cmNlSWQgPT09IGFyY1NvdXJjZUlkICYmIHVubWFwcGVkLmRlc3RpbmF0aW9uSWQgPT09IGFyY0Rlc3RpbmF0aW9uSWQgJiYgdW5tYXBwZWQud2VpZ2h0ID09PSBhcmMud2VpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKGZpdHRpbmdBcmNJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1bm1hcHBlZEFyY3Muc3BsaWNlKGZpdHRpbmdBcmNJbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4iXX0=