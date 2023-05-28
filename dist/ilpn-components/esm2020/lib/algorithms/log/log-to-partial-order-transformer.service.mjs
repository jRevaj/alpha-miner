import { Injectable } from '@angular/core';
import { PrefixTree } from '../../utility/prefix-tree';
import { PetriNetSequence } from './concurrency-oracle/alpha-oracle/petri-net-sequence';
import { LogCleaner } from './log-cleaner';
import { Place } from '../../models/pn/model/place';
import { Transition } from '../../models/pn/model/transition';
import { MapSet } from '../../utility/map-set';
import { EditableStringSequenceWrapper } from '../../utility/string-sequence';
import { PartialOrderNetWithContainedTraces } from '../../models/pn/model/partial-order-net-with-contained-traces';
import { LogEvent } from '../../models/log/model/logEvent';
import * as i0 from "@angular/core";
import * as i1 from "../pn/isomorphism/petri-net-isomorphism.service";
export class LogToPartialOrderTransformerService extends LogCleaner {
    constructor(_pnIsomorphismService) {
        super();
        this._pnIsomorphismService = _pnIsomorphismService;
    }
    transformToPartialOrders(log, concurrencyRelation, config = {}) {
        if (log.length === 0) {
            return [];
        }
        if (!!config.cleanLog) {
            log = this.cleanLog(log);
        }
        else {
            console.warn(`relabeling a log with both 'start' and 'complete' events will result in unexpected label associations!`);
        }
        concurrencyRelation.relabeler.relabelSequencesPreserveNonUniqueIdentities(log);
        const sequences = this.convertLogToPetriNetSequences(log, !!config.discardPrefixes);
        // transitive reduction requires all places to be internal => always add start/stop and remove later
        sequences.forEach(seq => {
            this.addStartAndStopEvent(seq);
        });
        const partialOrders = this.convertSequencesToPartialOrders(sequences, concurrencyRelation);
        this.removeTransitiveDependencies(partialOrders);
        if (!config.addStartStopEvent) {
            partialOrders.forEach(po => {
                this.removeStartAndStopEvent(po);
            });
        }
        const result = this.filterAndCombinePartialOrderNets(partialOrders);
        concurrencyRelation.relabeler.undoSequencesLabeling(result.map(po => new EditableStringSequenceWrapper(po.net.getTransitions())));
        return result;
    }
    convertLogToPetriNetSequences(log, discardPrefixes) {
        const netSequences = new Set();
        const tree = new PrefixTree(new PetriNetSequence());
        for (const trace of log) {
            tree.insert(trace, () => {
                throw new Error('should never be called');
            }, (node, treeNode) => {
                if (discardPrefixes && treeNode.hasChildren()) {
                    node.net.frequency = 0;
                    netSequences.delete(node);
                }
                else {
                    node.net.frequency = node.net.frequency === undefined ? 1 : node.net.frequency + 1;
                    netSequences.add(node);
                }
            }, discardPrefixes ? (s, node, treeNode) => {
                if (treeNode.hasChildren()) {
                    node.net.frequency = 0;
                    netSequences.delete(node);
                }
            } : undefined, (step, prefix, previousNode) => {
                const newNode = previousNode.clone();
                newNode.appendEvent(step);
                return newNode;
            });
        }
        return Array.from(netSequences);
    }
    addStartAndStopEvent(sequence) {
        // add events to net
        const sequenceNet = sequence.net;
        const firstLast = sequenceNet.getPlaces().filter(p => p.ingoingArcs.length === 0 || p.outgoingArcs.length === 0);
        if (firstLast.length !== 2) {
            console.debug(sequenceNet);
            throw new Error('Illegal state. A sequence must have one start and one end place.');
        }
        let first, last;
        if (firstLast[0].ingoingArcs.length === 0) {
            first = firstLast[0];
            last = firstLast[1];
        }
        else {
            first = firstLast[1];
            last = firstLast[0];
        }
        const preStart = new Place();
        const start = new Transition(LogToPartialOrderTransformerService.START_SYMBOL);
        sequenceNet.addPlace(preStart);
        sequenceNet.addTransition(start);
        sequenceNet.addArc(preStart, start);
        sequenceNet.addArc(start, first);
        const stop = new Transition(LogToPartialOrderTransformerService.STOP_SYMBOL);
        const postStop = new Place();
        sequenceNet.addTransition(stop);
        sequenceNet.addPlace(postStop);
        sequenceNet.addArc(last, stop);
        sequenceNet.addArc(stop, postStop);
        // add events to trace
        sequence.trace.events.unshift(new LogEvent(LogToPartialOrderTransformerService.START_SYMBOL));
        sequence.trace.events.push(new LogEvent(LogToPartialOrderTransformerService.STOP_SYMBOL));
    }
    removeStartAndStopEvent(partialOrder) {
        // remove from net
        const partialOrderNet = partialOrder.net;
        if (partialOrderNet.inputPlaces.size !== 1 || partialOrderNet.outputPlaces.size !== 1) {
            console.debug(partialOrderNet);
            throw new Error('illegal state');
        }
        let startTransition = undefined;
        partialOrderNet.inputPlaces.forEach(id => {
            const inPlace = partialOrderNet.getPlace(id);
            startTransition = inPlace.outgoingArcs[0].destination;
            partialOrderNet.removePlace(id);
        });
        if (startTransition === undefined || startTransition.label !== LogToPartialOrderTransformerService.START_SYMBOL) {
            throw new Error('illegal state');
        }
        partialOrderNet.removeTransition(startTransition);
        let stopTransition = undefined;
        partialOrderNet.outputPlaces.forEach(id => {
            const outPlace = partialOrderNet.getPlace(id);
            stopTransition = outPlace.ingoingArcs[0].source;
            partialOrderNet.removePlace(id);
        });
        if (stopTransition === undefined || stopTransition.label !== LogToPartialOrderTransformerService.STOP_SYMBOL) {
            throw new Error('illegal state');
        }
        partialOrderNet.removeTransition(stopTransition);
        // remove from trace
        partialOrder.containedTraces[0].events.shift();
        partialOrder.containedTraces[0].events.pop();
    }
    convertSequencesToPartialOrders(sequences, concurrencyRelation) {
        return sequences.map(seq => this.convertSequenceToPartialOrder(seq, concurrencyRelation));
    }
    convertSequenceToPartialOrder(sequence, concurrencyRelation) {
        const net = sequence.net;
        const placeQueue = net.getPlaces();
        while (placeQueue.length > 0) {
            const place = placeQueue.shift();
            if (place.ingoingArcs.length === 0 || place.outgoingArcs.length === 0) {
                continue;
            }
            if (place.ingoingArcs.length > 1 || place.outgoingArcs.length > 1) {
                console.debug(place);
                console.debug(sequence);
                throw new Error('Illegal state. The processed net is not a partial order!');
            }
            const preEvent = place.ingoingArcs[0].source;
            const postEvent = place.outgoingArcs[0].destination;
            if (preEvent.label === postEvent.label // no auto-concurrency
                || !concurrencyRelation.isConcurrent(preEvent.label, postEvent.label)
                || !concurrencyRelation.isConcurrent(postEvent.label, preEvent.label)) {
                continue;
            }
            net.removePlace(place);
            for (const a of preEvent.ingoingArcs) {
                const inPlace = a.source;
                if (inPlace.ingoingArcs.length === 0 && postEvent.ingoingArcs.some(a => a.source.ingoingArcs.length === 0)) {
                    continue;
                }
                if (inPlace.ingoingArcs.length > 0) {
                    const inTransId = inPlace.ingoingArcs[0].sourceId;
                    if (postEvent.ingoingArcs.some(a => a.source.ingoingArcs[0]?.sourceId === inTransId)) {
                        continue;
                    }
                }
                const clone = new Place();
                net.addPlace(clone);
                placeQueue.push(clone);
                if (inPlace.ingoingArcs.length > 0) {
                    net.addArc(inPlace.ingoingArcs[0].source, clone);
                }
                net.addArc(clone, postEvent);
            }
            for (const a of postEvent.outgoingArcs) {
                const outPlace = a.destination;
                if (outPlace.outgoingArcs.length === 0 && preEvent.outgoingArcs.some(a => a.destination.outgoingArcs.length === 0)) {
                    continue;
                }
                if (outPlace.outgoingArcs.length > 0) {
                    const outTransId = outPlace.outgoingArcs[0].destinationId;
                    if (preEvent.outgoingArcs.some(a => a.destination.outgoingArcs[0]?.destinationId === outTransId)) {
                        continue;
                    }
                }
                const clone = new Place();
                net.addPlace(clone);
                placeQueue.push(clone);
                if (outPlace.outgoingArcs.length > 0) {
                    net.addArc(clone, outPlace.outgoingArcs[0].destination);
                }
                net.addArc(preEvent, clone);
            }
        }
        return new PartialOrderNetWithContainedTraces(net, [sequence.trace]);
    }
    removeTransitiveDependencies(pos) {
        pos.forEach(po => this.performTransitiveReduction(po.net));
    }
    performTransitiveReduction(partialOrder) {
        // algorithm based on "Algorithm A" from https://www.sciencedirect.com/science/article/pii/0304397588900321
        // the paper itself offers an improvement over this Algorithm - might be useful if A proves to be too slow
        const reverseTransitionOrder = this.reverseTopologicalTransitionOrdering(partialOrder);
        const reverseOrder = new Map(reverseTransitionOrder.map((t, i) => [t.getId(), i]));
        const transitiveDescendants = new MapSet();
        const reducedDescendants = new MapSet();
        for (const t of reverseTransitionOrder) {
            transitiveDescendants.add(t.getId(), t.getId());
            const childrenIds = this.getChildIds(t).sort((id1, id2) => reverseOrder.get(id2) - reverseOrder.get(id1));
            for (const childId of childrenIds) {
                if (!transitiveDescendants.has(t.getId(), childId)) {
                    transitiveDescendants.addAll(t.getId(), transitiveDescendants.get(childId));
                    reducedDescendants.add(t.getId(), childId);
                }
            }
        }
        // remove transitive connections (places)
        for (const t of partialOrder.getTransitions()) {
            if (t.label === LogToPartialOrderTransformerService.STOP_SYMBOL) {
                continue;
            }
            for (const a of t.outgoingArcs) {
                if (!reducedDescendants.has(t.getId(), a.destination.outgoingArcs[0].destinationId)) {
                    partialOrder.removePlace(a.destinationId);
                }
            }
        }
    }
    getChildIds(transition) {
        return transition.outgoingArcs.flatMap(a => a.destination.outgoingArcs.map(ta => ta.destination.getId()));
    }
    /**
     * Returns an array containing the transitions of the given net. The result is in reverse-topological order i.e.
     * transitions at the front of the Array appear later in the net.
     *
     * Implementation based on https://www.geeksforgeeks.org/topological-sorting/3
     * @param net a Petri Net representation of a partial order
     */
    reverseTopologicalTransitionOrdering(net) {
        const resultStack = [];
        const visited = new Set();
        for (const t of net.getTransitions()) {
            if (visited.has(t.getId())) {
                continue;
            }
            this.topologicalOrderingUtil(t, visited, resultStack);
        }
        return resultStack;
    }
    topologicalOrderingUtil(t, visited, resultStack) {
        visited.add(t.getId());
        for (const a of t.outgoingArcs) {
            const nextTransition = a.destination.outgoingArcs[0]?.destination;
            if (nextTransition === undefined) {
                continue;
            }
            if (visited.has(nextTransition.getId())) {
                continue;
            }
            this.topologicalOrderingUtil(nextTransition, visited, resultStack);
        }
        resultStack.push(t);
    }
    filterAndCombinePartialOrderNets(partialOrders) {
        const unique = [partialOrders.shift()];
        for (const uncheckedOrder of partialOrders) {
            let discard = false;
            for (const uniqueOrder of unique) {
                if (this._pnIsomorphismService.arePartialOrderPetriNetsIsomorphic(uncheckedOrder.net, uniqueOrder.net)) {
                    discard = true;
                    uniqueOrder.net.frequency = uniqueOrder.net.frequency + uncheckedOrder.net.frequency;
                    uniqueOrder.containedTraces.push(...uncheckedOrder.containedTraces);
                    break;
                }
            }
            if (!discard) {
                unique.push(uncheckedOrder);
            }
        }
        return unique;
    }
}
LogToPartialOrderTransformerService.START_SYMBOL = '▶';
LogToPartialOrderTransformerService.STOP_SYMBOL = '■';
LogToPartialOrderTransformerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, deps: [{ token: i1.PetriNetIsomorphismService }], target: i0.ɵɵFactoryTarget.Injectable });
LogToPartialOrderTransformerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetIsomorphismService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXRvLXBhcnRpYWwtb3JkZXItdHJhbnNmb3JtZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL2xvZy9sb2ctdG8tcGFydGlhbC1vcmRlci10cmFuc2Zvcm1lci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJekMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQ3RGLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUM1RCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFFNUUsT0FBTyxFQUFDLGtDQUFrQyxFQUFDLE1BQU0sK0RBQStELENBQUM7QUFDakgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlDQUFpQyxDQUFDOzs7QUFXekQsTUFBTSxPQUFPLG1DQUFvQyxTQUFRLFVBQVU7SUFLL0QsWUFBc0IscUJBQWlEO1FBQ25FLEtBQUssRUFBRSxDQUFDO1FBRFUsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUE0QjtJQUV2RSxDQUFDO0lBRU0sd0JBQXdCLENBQUMsR0FBaUIsRUFBRSxtQkFBd0MsRUFBRSxTQUFvRCxFQUFFO1FBQy9JLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEIsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUVELElBQUks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QVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtUcmFjZX0gZnJvbSAnLi4vLi4vbW9kZWxzL2xvZy9tb2RlbC90cmFjZSc7XHJcbmltcG9ydCB7Q29uY3VycmVuY3lSZWxhdGlvbn0gZnJvbSAnLi4vLi4vbW9kZWxzL2NvbmN1cnJlbmN5L21vZGVsL2NvbmN1cnJlbmN5LXJlbGF0aW9uJztcclxuaW1wb3J0IHtQZXRyaU5ldH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BldHJpLW5ldCc7XHJcbmltcG9ydCB7UHJlZml4VHJlZX0gZnJvbSAnLi4vLi4vdXRpbGl0eS9wcmVmaXgtdHJlZSc7XHJcbmltcG9ydCB7UGV0cmlOZXRTZXF1ZW5jZX0gZnJvbSAnLi9jb25jdXJyZW5jeS1vcmFjbGUvYWxwaGEtb3JhY2xlL3BldHJpLW5ldC1zZXF1ZW5jZSc7XHJcbmltcG9ydCB7TG9nQ2xlYW5lcn0gZnJvbSAnLi9sb2ctY2xlYW5lcic7XHJcbmltcG9ydCB7UGxhY2V9IGZyb20gJy4uLy4uL21vZGVscy9wbi9tb2RlbC9wbGFjZSc7XHJcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSAnLi4vLi4vbW9kZWxzL3BuL21vZGVsL3RyYW5zaXRpb24nO1xyXG5pbXBvcnQge01hcFNldH0gZnJvbSAnLi4vLi4vdXRpbGl0eS9tYXAtc2V0JztcclxuaW1wb3J0IHtFZGl0YWJsZVN0cmluZ1NlcXVlbmNlV3JhcHBlcn0gZnJvbSAnLi4vLi4vdXRpbGl0eS9zdHJpbmctc2VxdWVuY2UnO1xyXG5pbXBvcnQge1BldHJpTmV0SXNvbW9ycGhpc21TZXJ2aWNlfSBmcm9tICcuLi9wbi9pc29tb3JwaGlzbS9wZXRyaS1uZXQtaXNvbW9ycGhpc20uc2VydmljZSc7XHJcbmltcG9ydCB7UGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlc30gZnJvbSAnLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BhcnRpYWwtb3JkZXItbmV0LXdpdGgtY29udGFpbmVkLXRyYWNlcyc7XHJcbmltcG9ydCB7TG9nRXZlbnR9IGZyb20gJy4uLy4uL21vZGVscy9sb2cvbW9kZWwvbG9nRXZlbnQnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMb2dUb1BhcnRpYWxPcmRlclRyYW5zZm9ybWVyQ29uZmlndXJhdGlvbiB7XHJcbiAgICBjbGVhbkxvZz86IGJvb2xlYW47XHJcbiAgICBhZGRTdGFydFN0b3BFdmVudD86IGJvb2xlYW47XHJcbiAgICBkaXNjYXJkUHJlZml4ZXM/OiBib29sZWFuO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIExvZ1RvUGFydGlhbE9yZGVyVHJhbnNmb3JtZXJTZXJ2aWNlIGV4dGVuZHMgTG9nQ2xlYW5lciB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBTVEFSVF9TWU1CT0wgPSAn4pa2JztcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU1RPUF9TWU1CT0wgPSAn4pagJztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX3BuSXNvbW9ycGhpc21TZXJ2aWNlOiBQZXRyaU5ldElzb21vcnBoaXNtU2VydmljZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zZm9ybVRvUGFydGlhbE9yZGVycyhsb2c6IEFycmF5PFRyYWNlPiwgY29uY3VycmVuY3lSZWxhdGlvbjogQ29uY3VycmVuY3lSZWxhdGlvbiwgY29uZmlnOiBMb2dUb1BhcnRpYWxPcmRlclRyYW5zZm9ybWVyQ29uZmlndXJhdGlvbiA9IHt9KTogQXJyYXk8UGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlcz4ge1xyXG4gICAgICAgIGlmIChsb2cubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghIWNvbmZpZy5jbGVhbkxvZykge1xyXG4gICAgICAgICAgICBsb2cgPSB0aGlzLmNsZWFuTG9nKGxvZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGByZWxhYmVsaW5nIGEgbG9nIHdpdGggYm90aCAnc3RhcnQnIGFuZCAnY29tcGxldGUnIGV2ZW50cyB3aWxsIHJlc3VsdCBpbiB1bmV4cGVjdGVkIGxhYmVsIGFzc29jaWF0aW9ucyFgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbmN1cnJlbmN5UmVsYXRpb24ucmVsYWJlbGVyLnJlbGFiZWxTZXF1ZW5jZXNQcmVzZXJ2ZU5vblVuaXF1ZUlkZW50aXRpZXMobG9nKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2VxdWVuY2VzID0gdGhpcy5jb252ZXJ0TG9nVG9QZXRyaU5ldFNlcXVlbmNlcyhsb2csICEhY29uZmlnLmRpc2NhcmRQcmVmaXhlcyk7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zaXRpdmUgcmVkdWN0aW9uIHJlcXVpcmVzIGFsbCBwbGFjZXMgdG8gYmUgaW50ZXJuYWwgPT4gYWx3YXlzIGFkZCBzdGFydC9zdG9wIGFuZCByZW1vdmUgbGF0ZXJcclxuICAgICAgICBzZXF1ZW5jZXMuZm9yRWFjaChzZXEgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFN0YXJ0QW5kU3RvcEV2ZW50KHNlcSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgcGFydGlhbE9yZGVycyA9IHRoaXMuY29udmVydFNlcXVlbmNlc1RvUGFydGlhbE9yZGVycyhzZXF1ZW5jZXMsIGNvbmN1cnJlbmN5UmVsYXRpb24pO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlVHJhbnNpdGl2ZURlcGVuZGVuY2llcyhwYXJ0aWFsT3JkZXJzKTtcclxuICAgICAgICBpZiAoIWNvbmZpZy5hZGRTdGFydFN0b3BFdmVudCkge1xyXG4gICAgICAgICAgICBwYXJ0aWFsT3JkZXJzLmZvckVhY2gocG8gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTdGFydEFuZFN0b3BFdmVudChwbyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmZpbHRlckFuZENvbWJpbmVQYXJ0aWFsT3JkZXJOZXRzKHBhcnRpYWxPcmRlcnMpO1xyXG5cclxuICAgICAgICBjb25jdXJyZW5jeVJlbGF0aW9uLnJlbGFiZWxlci51bmRvU2VxdWVuY2VzTGFiZWxpbmcocmVzdWx0Lm1hcChwbyA9PiBuZXcgRWRpdGFibGVTdHJpbmdTZXF1ZW5jZVdyYXBwZXIocG8ubmV0LmdldFRyYW5zaXRpb25zKCkpKSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0TG9nVG9QZXRyaU5ldFNlcXVlbmNlcyhsb2c6IEFycmF5PFRyYWNlPiwgZGlzY2FyZFByZWZpeGVzOiBib29sZWFuKTogQXJyYXk8UGV0cmlOZXRTZXF1ZW5jZT4ge1xyXG4gICAgICAgIGNvbnN0IG5ldFNlcXVlbmNlcyA9IG5ldyBTZXQ8UGV0cmlOZXRTZXF1ZW5jZT4oKTtcclxuICAgICAgICBjb25zdCB0cmVlID0gbmV3IFByZWZpeFRyZWU8UGV0cmlOZXRTZXF1ZW5jZT4obmV3IFBldHJpTmV0U2VxdWVuY2UoKSk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdHJhY2Ugb2YgbG9nKSB7XHJcbiAgICAgICAgICAgIHRyZWUuaW5zZXJ0KHRyYWNlLFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2hvdWxkIG5ldmVyIGJlIGNhbGxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChub2RlLCB0cmVlTm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNjYXJkUHJlZml4ZXMgJiYgdHJlZU5vZGUuaGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLm5ldC5mcmVxdWVuY3kgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXRTZXF1ZW5jZXMuZGVsZXRlKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUubmV0LmZyZXF1ZW5jeSA9IG5vZGUubmV0LmZyZXF1ZW5jeSA9PT0gdW5kZWZpbmVkID8gMSA6IG5vZGUubmV0LmZyZXF1ZW5jeSArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldFNlcXVlbmNlcy5hZGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRpc2NhcmRQcmVmaXhlcyA/IChzLCBub2RlLCB0cmVlTm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmVlTm9kZS5oYXNDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUhLm5ldC5mcmVxdWVuY3kgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXRTZXF1ZW5jZXMuZGVsZXRlKG5vZGUhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgKHN0ZXAsIHByZWZpeCwgcHJldmlvdXNOb2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3Tm9kZSA9IHByZXZpb3VzTm9kZSEuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdOb2RlLmFwcGVuZEV2ZW50KHN0ZXApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdOb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV0U2VxdWVuY2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZFN0YXJ0QW5kU3RvcEV2ZW50KHNlcXVlbmNlOiBQZXRyaU5ldFNlcXVlbmNlKSB7XHJcbiAgICAgICAgLy8gYWRkIGV2ZW50cyB0byBuZXRcclxuICAgICAgICBjb25zdCBzZXF1ZW5jZU5ldCA9IHNlcXVlbmNlLm5ldDtcclxuICAgICAgICBjb25zdCBmaXJzdExhc3QgPSBzZXF1ZW5jZU5ldC5nZXRQbGFjZXMoKS5maWx0ZXIocCA9PiBwLmluZ29pbmdBcmNzLmxlbmd0aCA9PT0gMCB8fCBwLm91dGdvaW5nQXJjcy5sZW5ndGggPT09IDApO1xyXG4gICAgICAgIGlmIChmaXJzdExhc3QubGVuZ3RoICE9PSAyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoc2VxdWVuY2VOZXQpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgc3RhdGUuIEEgc2VxdWVuY2UgbXVzdCBoYXZlIG9uZSBzdGFydCBhbmQgb25lIGVuZCBwbGFjZS4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZpcnN0LCBsYXN0OiBQbGFjZTtcclxuICAgICAgICBpZiAoZmlyc3RMYXN0WzBdLmluZ29pbmdBcmNzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBmaXJzdCA9IGZpcnN0TGFzdFswXTtcclxuICAgICAgICAgICAgbGFzdCA9IGZpcnN0TGFzdFsxXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmaXJzdCA9IGZpcnN0TGFzdFsxXTtcclxuICAgICAgICAgICAgbGFzdCA9IGZpcnN0TGFzdFswXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHByZVN0YXJ0ID0gbmV3IFBsYWNlKCk7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgVHJhbnNpdGlvbihMb2dUb1BhcnRpYWxPcmRlclRyYW5zZm9ybWVyU2VydmljZS5TVEFSVF9TWU1CT0wpO1xyXG4gICAgICAgIHNlcXVlbmNlTmV0LmFkZFBsYWNlKHByZVN0YXJ0KTtcclxuICAgICAgICBzZXF1ZW5jZU5ldC5hZGRUcmFuc2l0aW9uKHN0YXJ0KTtcclxuICAgICAgICBzZXF1ZW5jZU5ldC5hZGRBcmMocHJlU3RhcnQsIHN0YXJ0KTtcclxuICAgICAgICBzZXF1ZW5jZU5ldC5hZGRBcmMoc3RhcnQsIGZpcnN0KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RvcCA9IG5ldyBUcmFuc2l0aW9uKExvZ1RvUGFydGlhbE9yZGVyVHJhbnNmb3JtZXJTZXJ2aWNlLlNUT1BfU1lNQk9MKTtcclxuICAgICAgICBjb25zdCBwb3N0U3RvcCA9IG5ldyBQbGFjZSgpO1xyXG4gICAgICAgIHNlcXVlbmNlTmV0LmFkZFRyYW5zaXRpb24oc3RvcCk7XHJcbiAgICAgICAgc2VxdWVuY2VOZXQuYWRkUGxhY2UocG9zdFN0b3ApO1xyXG4gICAgICAgIHNlcXVlbmNlTmV0LmFkZEFyYyhsYXN0LCBzdG9wKTtcclxuICAgICAgICBzZXF1ZW5jZU5ldC5hZGRBcmMoc3RvcCwgcG9zdFN0b3ApO1xyXG5cclxuICAgICAgICAvLyBhZGQgZXZlbnRzIHRvIHRyYWNlXHJcbiAgICAgICAgc2VxdWVuY2UudHJhY2UuZXZlbnRzLnVuc2hpZnQobmV3IExvZ0V2ZW50KExvZ1RvUGFydGlhbE9yZGVyVHJhbnNmb3JtZXJTZXJ2aWNlLlNUQVJUX1NZTUJPTCkpO1xyXG4gICAgICAgIHNlcXVlbmNlLnRyYWNlLmV2ZW50cy5wdXNoKG5ldyBMb2dFdmVudChMb2dUb1BhcnRpYWxPcmRlclRyYW5zZm9ybWVyU2VydmljZS5TVE9QX1NZTUJPTCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlU3RhcnRBbmRTdG9wRXZlbnQocGFydGlhbE9yZGVyOiBQYXJ0aWFsT3JkZXJOZXRXaXRoQ29udGFpbmVkVHJhY2VzKSB7XHJcbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gbmV0XHJcbiAgICAgICAgY29uc3QgcGFydGlhbE9yZGVyTmV0ID0gcGFydGlhbE9yZGVyLm5ldDtcclxuICAgICAgICBpZiAocGFydGlhbE9yZGVyTmV0LmlucHV0UGxhY2VzLnNpemUgIT09IDEgfHwgcGFydGlhbE9yZGVyTmV0Lm91dHB1dFBsYWNlcy5zaXplICE9PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcocGFydGlhbE9yZGVyTmV0KTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbGxlZ2FsIHN0YXRlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3RhcnRUcmFuc2l0aW9uOiBUcmFuc2l0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHBhcnRpYWxPcmRlck5ldC5pbnB1dFBsYWNlcy5mb3JFYWNoKGlkID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW5QbGFjZSA9IHBhcnRpYWxPcmRlck5ldC5nZXRQbGFjZShpZCkhO1xyXG4gICAgICAgICAgICBzdGFydFRyYW5zaXRpb24gPSBpblBsYWNlLm91dGdvaW5nQXJjc1swXS5kZXN0aW5hdGlvbiBhcyBUcmFuc2l0aW9uO1xyXG4gICAgICAgICAgICBwYXJ0aWFsT3JkZXJOZXQucmVtb3ZlUGxhY2UoaWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc3RhcnRUcmFuc2l0aW9uID09PSB1bmRlZmluZWQgfHwgKHN0YXJ0VHJhbnNpdGlvbiBhcyBUcmFuc2l0aW9uKS5sYWJlbCAhPT0gTG9nVG9QYXJ0aWFsT3JkZXJUcmFuc2Zvcm1lclNlcnZpY2UuU1RBUlRfU1lNQk9MKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaWxsZWdhbCBzdGF0ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJ0aWFsT3JkZXJOZXQucmVtb3ZlVHJhbnNpdGlvbihzdGFydFRyYW5zaXRpb24pO1xyXG5cclxuICAgICAgICBsZXQgc3RvcFRyYW5zaXRpb246IFRyYW5zaXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcGFydGlhbE9yZGVyTmV0Lm91dHB1dFBsYWNlcy5mb3JFYWNoKGlkID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3V0UGxhY2UgPSBwYXJ0aWFsT3JkZXJOZXQuZ2V0UGxhY2UoaWQpITtcclxuICAgICAgICAgICAgc3RvcFRyYW5zaXRpb24gPSBvdXRQbGFjZS5pbmdvaW5nQXJjc1swXS5zb3VyY2UgYXMgVHJhbnNpdGlvbjtcclxuICAgICAgICAgICAgcGFydGlhbE9yZGVyTmV0LnJlbW92ZVBsYWNlKGlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHN0b3BUcmFuc2l0aW9uID09PSB1bmRlZmluZWQgfHwgKHN0b3BUcmFuc2l0aW9uIGFzIFRyYW5zaXRpb24pLmxhYmVsICE9PSBMb2dUb1BhcnRpYWxPcmRlclRyYW5zZm9ybWVyU2VydmljZS5TVE9QX1NZTUJPTCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lsbGVnYWwgc3RhdGUnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFydGlhbE9yZGVyTmV0LnJlbW92ZVRyYW5zaXRpb24oc3RvcFRyYW5zaXRpb24pO1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgZnJvbSB0cmFjZVxyXG4gICAgICAgIHBhcnRpYWxPcmRlci5jb250YWluZWRUcmFjZXNbMF0uZXZlbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgcGFydGlhbE9yZGVyLmNvbnRhaW5lZFRyYWNlc1swXS5ldmVudHMucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0U2VxdWVuY2VzVG9QYXJ0aWFsT3JkZXJzKHNlcXVlbmNlczogQXJyYXk8UGV0cmlOZXRTZXF1ZW5jZT4sIGNvbmN1cnJlbmN5UmVsYXRpb246IENvbmN1cnJlbmN5UmVsYXRpb24pOiBBcnJheTxQYXJ0aWFsT3JkZXJOZXRXaXRoQ29udGFpbmVkVHJhY2VzPiB7XHJcbiAgICAgICAgcmV0dXJuIHNlcXVlbmNlcy5tYXAoc2VxID0+IHRoaXMuY29udmVydFNlcXVlbmNlVG9QYXJ0aWFsT3JkZXIoc2VxLCBjb25jdXJyZW5jeVJlbGF0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0U2VxdWVuY2VUb1BhcnRpYWxPcmRlcihzZXF1ZW5jZTogUGV0cmlOZXRTZXF1ZW5jZSwgY29uY3VycmVuY3lSZWxhdGlvbjogQ29uY3VycmVuY3lSZWxhdGlvbik6IFBhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXMge1xyXG4gICAgICAgIGNvbnN0IG5ldCA9IHNlcXVlbmNlLm5ldDtcclxuICAgICAgICBjb25zdCBwbGFjZVF1ZXVlID0gbmV0LmdldFBsYWNlcygpO1xyXG5cclxuICAgICAgICB3aGlsZSAocGxhY2VRdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlID0gcGxhY2VRdWV1ZS5zaGlmdCgpIGFzIFBsYWNlO1xyXG4gICAgICAgICAgICBpZiAocGxhY2UuaW5nb2luZ0FyY3MubGVuZ3RoID09PSAwIHx8IHBsYWNlLm91dGdvaW5nQXJjcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwbGFjZS5pbmdvaW5nQXJjcy5sZW5ndGggPiAxIHx8IHBsYWNlLm91dGdvaW5nQXJjcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKHBsYWNlKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoc2VxdWVuY2UpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIHN0YXRlLiBUaGUgcHJvY2Vzc2VkIG5ldCBpcyBub3QgYSBwYXJ0aWFsIG9yZGVyIScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwcmVFdmVudCA9IChwbGFjZS5pbmdvaW5nQXJjc1swXS5zb3VyY2UgYXMgVHJhbnNpdGlvbik7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc3RFdmVudCA9IChwbGFjZS5vdXRnb2luZ0FyY3NbMF0uZGVzdGluYXRpb24gYXMgVHJhbnNpdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHByZUV2ZW50LmxhYmVsISA9PT0gcG9zdEV2ZW50LmxhYmVsISAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vIGF1dG8tY29uY3VycmVuY3lcclxuICAgICAgICAgICAgICAgIHx8ICFjb25jdXJyZW5jeVJlbGF0aW9uLmlzQ29uY3VycmVudChwcmVFdmVudC5sYWJlbCEsIHBvc3RFdmVudC5sYWJlbCEpXHJcbiAgICAgICAgICAgICAgICB8fCAhY29uY3VycmVuY3lSZWxhdGlvbi5pc0NvbmN1cnJlbnQocG9zdEV2ZW50LmxhYmVsISwgcHJlRXZlbnQubGFiZWwhKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuZXQucmVtb3ZlUGxhY2UocGxhY2UpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBhIG9mIHByZUV2ZW50LmluZ29pbmdBcmNzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpblBsYWNlID0gYS5zb3VyY2UgYXMgUGxhY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluUGxhY2UuaW5nb2luZ0FyY3MubGVuZ3RoID09PSAwICYmIHBvc3RFdmVudC5pbmdvaW5nQXJjcy5zb21lKGEgPT4gYS5zb3VyY2UuaW5nb2luZ0FyY3MubGVuZ3RoID09PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGluUGxhY2UuaW5nb2luZ0FyY3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluVHJhbnNJZCA9IGluUGxhY2UuaW5nb2luZ0FyY3NbMF0uc291cmNlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3RFdmVudC5pbmdvaW5nQXJjcy5zb21lKGEgPT4gYS5zb3VyY2UuaW5nb2luZ0FyY3NbMF0/LnNvdXJjZUlkID09PSBpblRyYW5zSWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IG5ldyBQbGFjZSgpO1xyXG4gICAgICAgICAgICAgICAgbmV0LmFkZFBsYWNlKGNsb25lKTtcclxuICAgICAgICAgICAgICAgIHBsYWNlUXVldWUucHVzaChjbG9uZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluUGxhY2UuaW5nb2luZ0FyY3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldC5hZGRBcmMoaW5QbGFjZS5pbmdvaW5nQXJjc1swXS5zb3VyY2UgYXMgVHJhbnNpdGlvbiwgY2xvbmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG5ldC5hZGRBcmMoY2xvbmUsIHBvc3RFdmVudClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBhIG9mIHBvc3RFdmVudC5vdXRnb2luZ0FyY3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG91dFBsYWNlID0gYS5kZXN0aW5hdGlvbiBhcyBQbGFjZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3V0UGxhY2Uub3V0Z29pbmdBcmNzLmxlbmd0aCA9PT0gMCAmJiBwcmVFdmVudC5vdXRnb2luZ0FyY3Muc29tZShhID0+IGEuZGVzdGluYXRpb24ub3V0Z29pbmdBcmNzLmxlbmd0aCA9PT0gMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvdXRQbGFjZS5vdXRnb2luZ0FyY3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dFRyYW5zSWQgPSBvdXRQbGFjZS5vdXRnb2luZ0FyY3NbMF0uZGVzdGluYXRpb25JZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJlRXZlbnQub3V0Z29pbmdBcmNzLnNvbWUoYSA9PiBhLmRlc3RpbmF0aW9uLm91dGdvaW5nQXJjc1swXT8uZGVzdGluYXRpb25JZCA9PT0gb3V0VHJhbnNJZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsb25lID0gbmV3IFBsYWNlKCk7XHJcbiAgICAgICAgICAgICAgICBuZXQuYWRkUGxhY2UoY2xvbmUpO1xyXG4gICAgICAgICAgICAgICAgcGxhY2VRdWV1ZS5wdXNoKGNsb25lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3V0UGxhY2Uub3V0Z29pbmdBcmNzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXQuYWRkQXJjKGNsb25lLCBvdXRQbGFjZS5vdXRnb2luZ0FyY3NbMF0uZGVzdGluYXRpb24gYXMgVHJhbnNpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbmV0LmFkZEFyYyhwcmVFdmVudCwgY2xvbmUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlcyhuZXQsIFtzZXF1ZW5jZS50cmFjZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlVHJhbnNpdGl2ZURlcGVuZGVuY2llcyhwb3M6IEFycmF5PFBhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXM+KSB7XHJcbiAgICAgICAgcG9zLmZvckVhY2gocG8gPT4gdGhpcy5wZXJmb3JtVHJhbnNpdGl2ZVJlZHVjdGlvbihwby5uZXQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBlcmZvcm1UcmFuc2l0aXZlUmVkdWN0aW9uKHBhcnRpYWxPcmRlcjogUGV0cmlOZXQpIHtcclxuICAgICAgICAvLyBhbGdvcml0aG0gYmFzZWQgb24gXCJBbGdvcml0aG0gQVwiIGZyb20gaHR0cHM6Ly93d3cuc2NpZW5jZWRpcmVjdC5jb20vc2NpZW5jZS9hcnRpY2xlL3BpaS8wMzA0Mzk3NTg4OTAwMzIxXHJcbiAgICAgICAgLy8gdGhlIHBhcGVyIGl0c2VsZiBvZmZlcnMgYW4gaW1wcm92ZW1lbnQgb3ZlciB0aGlzIEFsZ29yaXRobSAtIG1pZ2h0IGJlIHVzZWZ1bCBpZiBBIHByb3ZlcyB0byBiZSB0b28gc2xvd1xyXG5cclxuICAgICAgICBjb25zdCByZXZlcnNlVHJhbnNpdGlvbk9yZGVyID0gdGhpcy5yZXZlcnNlVG9wb2xvZ2ljYWxUcmFuc2l0aW9uT3JkZXJpbmcocGFydGlhbE9yZGVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmV2ZXJzZU9yZGVyID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4ocmV2ZXJzZVRyYW5zaXRpb25PcmRlci5tYXAoKHQsIGkpID0+IFt0LmdldElkKCksIGldKSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNpdGl2ZURlc2NlbmRhbnRzID0gbmV3IE1hcFNldDxzdHJpbmcsIHN0cmluZz4oKTtcclxuICAgICAgICBjb25zdCByZWR1Y2VkRGVzY2VuZGFudHMgPSBuZXcgTWFwU2V0PHN0cmluZywgc3RyaW5nPigpO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgcmV2ZXJzZVRyYW5zaXRpb25PcmRlcikge1xyXG4gICAgICAgICAgICB0cmFuc2l0aXZlRGVzY2VuZGFudHMuYWRkKHQuZ2V0SWQoKSwgdC5nZXRJZCgpKTtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW5JZHMgPSB0aGlzLmdldENoaWxkSWRzKHQpLnNvcnQoKGlkMSwgaWQyKSA9PiByZXZlcnNlT3JkZXIuZ2V0KGlkMikhIC0gcmV2ZXJzZU9yZGVyLmdldChpZDEpISk7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGRJZCBvZiBjaGlsZHJlbklkcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0cmFuc2l0aXZlRGVzY2VuZGFudHMuaGFzKHQuZ2V0SWQoKSwgY2hpbGRJZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aXZlRGVzY2VuZGFudHMuYWRkQWxsKHQuZ2V0SWQoKSwgdHJhbnNpdGl2ZURlc2NlbmRhbnRzLmdldChjaGlsZElkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVkdWNlZERlc2NlbmRhbnRzLmFkZCh0LmdldElkKCksIGNoaWxkSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZW1vdmUgdHJhbnNpdGl2ZSBjb25uZWN0aW9ucyAocGxhY2VzKVxyXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBwYXJ0aWFsT3JkZXIuZ2V0VHJhbnNpdGlvbnMoKSkge1xyXG4gICAgICAgICAgICBpZiAodC5sYWJlbCA9PT0gTG9nVG9QYXJ0aWFsT3JkZXJUcmFuc2Zvcm1lclNlcnZpY2UuU1RPUF9TWU1CT0wpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBvZiB0Lm91dGdvaW5nQXJjcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZWR1Y2VkRGVzY2VuZGFudHMuaGFzKHQuZ2V0SWQoKSwgYS5kZXN0aW5hdGlvbi5vdXRnb2luZ0FyY3NbMF0uZGVzdGluYXRpb25JZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsT3JkZXIucmVtb3ZlUGxhY2UoYS5kZXN0aW5hdGlvbklkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldENoaWxkSWRzKHRyYW5zaXRpb246IFRyYW5zaXRpb24pOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbi5vdXRnb2luZ0FyY3MuZmxhdE1hcChhID0+IGEuZGVzdGluYXRpb24ub3V0Z29pbmdBcmNzLm1hcCh0YSA9PiB0YS5kZXN0aW5hdGlvbi5nZXRJZCgpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHRyYW5zaXRpb25zIG9mIHRoZSBnaXZlbiBuZXQuIFRoZSByZXN1bHQgaXMgaW4gcmV2ZXJzZS10b3BvbG9naWNhbCBvcmRlciBpLmUuXHJcbiAgICAgKiB0cmFuc2l0aW9ucyBhdCB0aGUgZnJvbnQgb2YgdGhlIEFycmF5IGFwcGVhciBsYXRlciBpbiB0aGUgbmV0LlxyXG4gICAgICpcclxuICAgICAqIEltcGxlbWVudGF0aW9uIGJhc2VkIG9uIGh0dHBzOi8vd3d3LmdlZWtzZm9yZ2Vla3Mub3JnL3RvcG9sb2dpY2FsLXNvcnRpbmcvM1xyXG4gICAgICogQHBhcmFtIG5ldCBhIFBldHJpIE5ldCByZXByZXNlbnRhdGlvbiBvZiBhIHBhcnRpYWwgb3JkZXJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZXZlcnNlVG9wb2xvZ2ljYWxUcmFuc2l0aW9uT3JkZXJpbmcobmV0OiBQZXRyaU5ldCk6IEFycmF5PFRyYW5zaXRpb24+IHtcclxuICAgICAgICBjb25zdCByZXN1bHRTdGFjazogQXJyYXk8VHJhbnNpdGlvbj4gPSBbXTtcclxuICAgICAgICBjb25zdCB2aXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIG5ldC5nZXRUcmFuc2l0aW9ucygpKSB7XHJcbiAgICAgICAgICAgIGlmICh2aXNpdGVkLmhhcyh0LmdldElkKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRvcG9sb2dpY2FsT3JkZXJpbmdVdGlsKHQsIHZpc2l0ZWQsIHJlc3VsdFN0YWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdFN0YWNrO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdG9wb2xvZ2ljYWxPcmRlcmluZ1V0aWwodDogVHJhbnNpdGlvbiwgdmlzaXRlZDogU2V0PHN0cmluZz4sIHJlc3VsdFN0YWNrOiBBcnJheTxUcmFuc2l0aW9uPikge1xyXG4gICAgICAgIHZpc2l0ZWQuYWRkKHQuZ2V0SWQoKSk7XHJcbiAgICAgICAgZm9yIChjb25zdCBhIG9mIHQub3V0Z29pbmdBcmNzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRUcmFuc2l0aW9uID0gYS5kZXN0aW5hdGlvbi5vdXRnb2luZ0FyY3NbMF0/LmRlc3RpbmF0aW9uO1xyXG4gICAgICAgICAgICBpZiAobmV4dFRyYW5zaXRpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZpc2l0ZWQuaGFzKG5leHRUcmFuc2l0aW9uLmdldElkKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRvcG9sb2dpY2FsT3JkZXJpbmdVdGlsKG5leHRUcmFuc2l0aW9uIGFzIFRyYW5zaXRpb24sIHZpc2l0ZWQsIHJlc3VsdFN0YWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0U3RhY2sucHVzaCh0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbHRlckFuZENvbWJpbmVQYXJ0aWFsT3JkZXJOZXRzKHBhcnRpYWxPcmRlcnM6IEFycmF5PFBhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXM+KTogQXJyYXk8UGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlcz4ge1xyXG4gICAgICAgIGNvbnN0IHVuaXF1ZTogQXJyYXk8UGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlcz4gPSBbcGFydGlhbE9yZGVycy5zaGlmdCgpIV07XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdW5jaGVja2VkT3JkZXIgb2YgcGFydGlhbE9yZGVycykge1xyXG4gICAgICAgICAgICBsZXQgZGlzY2FyZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuaXF1ZU9yZGVyIG9mIHVuaXF1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BuSXNvbW9ycGhpc21TZXJ2aWNlLmFyZVBhcnRpYWxPcmRlclBldHJpTmV0c0lzb21vcnBoaWModW5jaGVja2VkT3JkZXIubmV0LCB1bmlxdWVPcmRlci5uZXQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzY2FyZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5pcXVlT3JkZXIubmV0LmZyZXF1ZW5jeSA9IHVuaXF1ZU9yZGVyLm5ldC5mcmVxdWVuY3khICsgdW5jaGVja2VkT3JkZXIubmV0LmZyZXF1ZW5jeSE7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5pcXVlT3JkZXIuY29udGFpbmVkVHJhY2VzLnB1c2goLi4udW5jaGVja2VkT3JkZXIuY29udGFpbmVkVHJhY2VzKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWRpc2NhcmQpIHtcclxuICAgICAgICAgICAgICAgIHVuaXF1ZS5wdXNoKHVuY2hlY2tlZE9yZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVuaXF1ZTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19