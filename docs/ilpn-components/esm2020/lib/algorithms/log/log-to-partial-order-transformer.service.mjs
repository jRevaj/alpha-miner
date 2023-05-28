import { Injectable } from '@angular/core';
import { PrefixTree } from '../../utility/prefix-graphs/prefix-tree';
import { PetriNetSequence } from './concurrency-oracle/alpha-oracle/petri-net-sequence';
import { Place } from '../../models/pn/model/place';
import { Transition } from '../../models/pn/model/transition';
import { MapSet } from '../../utility/map-set';
import { EditableStringSequenceWrapper } from '../../utility/string-sequence';
import { PartialOrderNetWithContainedTraces } from '../../models/pn/model/partial-order-net-with-contained-traces';
import { LogEvent } from '../../models/log/model/logEvent';
import { cleanLog } from './clean-log';
import { LogSymbol } from './log-symbol';
import * as i0 from "@angular/core";
import * as i1 from "../pn/isomorphism/petri-net-isomorphism.service";
export class LogToPartialOrderTransformerService {
    constructor(_pnIsomorphismService) {
        this._pnIsomorphismService = _pnIsomorphismService;
    }
    transformToPartialOrders(log, concurrencyRelation, config = {}) {
        if (log.length === 0) {
            return [];
        }
        if (!!config.cleanLog) {
            log = cleanLog(log);
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
        const tree = new PrefixTree();
        for (const trace of log) {
            const sequence = new PetriNetSequence();
            tree.insert(trace, treeNode => {
                if (discardPrefixes && treeNode.hasChildren()) {
                    return undefined;
                }
                sequence.net.frequency = 1;
                netSequences.add(sequence);
                return sequence;
            }, (node, treeNode) => {
                if (!discardPrefixes || !treeNode.hasChildren()) {
                    node.net.frequency = node.net.frequency === undefined ? 1 : node.net.frequency + 1;
                }
            }, (label, previousNode) => {
                sequence.appendEvent(label);
                if (discardPrefixes && previousNode !== undefined) {
                    netSequences.delete(previousNode);
                }
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
        const start = new Transition(LogSymbol.START);
        sequenceNet.addPlace(preStart);
        sequenceNet.addTransition(start);
        sequenceNet.addArc(preStart, start);
        sequenceNet.addArc(start, first);
        const stop = new Transition(LogSymbol.STOP);
        const postStop = new Place();
        sequenceNet.addTransition(stop);
        sequenceNet.addPlace(postStop);
        sequenceNet.addArc(last, stop);
        sequenceNet.addArc(stop, postStop);
        // add events to trace
        sequence.trace.events.unshift(new LogEvent(LogSymbol.START));
        sequence.trace.events.push(new LogEvent(LogSymbol.STOP));
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
        if (startTransition === undefined || startTransition.label !== LogSymbol.START) {
            throw new Error('illegal state');
        }
        partialOrderNet.removeTransition(startTransition);
        let stopTransition = undefined;
        partialOrderNet.outputPlaces.forEach(id => {
            const outPlace = partialOrderNet.getPlace(id);
            stopTransition = outPlace.ingoingArcs[0].source;
            partialOrderNet.removePlace(id);
        });
        if (stopTransition === undefined || stopTransition.label !== LogSymbol.STOP) {
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
            if (t.label === LogSymbol.STOP) {
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
LogToPartialOrderTransformerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, deps: [{ token: i1.PetriNetIsomorphismService }], target: i0.ɵɵFactoryTarget.Injectable });
LogToPartialOrderTransformerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: LogToPartialOrderTransformerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetIsomorphismService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXRvLXBhcnRpYWwtb3JkZXItdHJhbnNmb3JtZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL2xvZy9sb2ctdG8tcGFydGlhbC1vcmRlci10cmFuc2Zvcm1lci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJekMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBQ25FLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQ3RGLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDNUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBQyw2QkFBNkIsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRTVFLE9BQU8sRUFBQyxrQ0FBa0MsRUFBQyxNQUFNLCtEQUErRCxDQUFDO0FBQ2pILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUN6RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7OztBQVl2QyxNQUFNLE9BQU8sbUNBQW1DO0lBRTVDLFlBQXNCLHFCQUFpRDtRQUFqRCwwQkFBcUIsR0FBckIscUJBQXFCLENBQTRCO0lBQ3ZFLENBQUM7SUFFTSx3QkFBd0IsQ0FBQyxHQUFpQixFQUFFLG1CQUF3QyxFQUFFLFNBQW9ELEVBQUU7UUFDL0ksSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQixPQUFPLEVBQUUsQ0FBQztTQUNi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QUFnQyxDQUFDLGFBQXdEO1FBQzdGLE1BQU0sTUFBTSxHQUE4QyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUcsQ0FBQyxDQUFDO1FBRW5GLEtBQUssTUFBTSxjQUFjLElBQUksYUFBYSxFQUFFO1lBQ3hDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNwQixLQUFLLE1BQU0sV0FBVyxJQUFJLE1BQU0sRUFBRTtnQkFDOUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsa0NBQWtDLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3BHLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQ2YsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFVLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFVLENBQUM7b0JBQ3ZGLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUNwRSxNQUFNO2lCQUNUO2FBQ0o7WUFDRCxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7YUFDL0I7U0FDSjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7O2dJQWhVUSxtQ0FBbUM7b0lBQW5DLG1DQUFtQyxjQUZoQyxNQUFNOzJGQUVULG1DQUFtQztrQkFIL0MsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1RyYWNlfSBmcm9tICcuLi8uLi9tb2RlbHMvbG9nL21vZGVsL3RyYWNlJztcclxuaW1wb3J0IHtDb25jdXJyZW5jeVJlbGF0aW9ufSBmcm9tICcuLi8uLi9tb2RlbHMvY29uY3VycmVuY3kvbW9kZWwvY29uY3VycmVuY3ktcmVsYXRpb24nO1xyXG5pbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGV0cmktbmV0JztcclxuaW1wb3J0IHtQcmVmaXhUcmVlfSBmcm9tICcuLi8uLi91dGlsaXR5L3ByZWZpeC1ncmFwaHMvcHJlZml4LXRyZWUnO1xyXG5pbXBvcnQge1BldHJpTmV0U2VxdWVuY2V9IGZyb20gJy4vY29uY3VycmVuY3ktb3JhY2xlL2FscGhhLW9yYWNsZS9wZXRyaS1uZXQtc2VxdWVuY2UnO1xyXG5pbXBvcnQge1BsYWNlfSBmcm9tICcuLi8uLi9tb2RlbHMvcG4vbW9kZWwvcGxhY2UnO1xyXG5pbXBvcnQge1RyYW5zaXRpb259IGZyb20gJy4uLy4uL21vZGVscy9wbi9tb2RlbC90cmFuc2l0aW9uJztcclxuaW1wb3J0IHtNYXBTZXR9IGZyb20gJy4uLy4uL3V0aWxpdHkvbWFwLXNldCc7XHJcbmltcG9ydCB7RWRpdGFibGVTdHJpbmdTZXF1ZW5jZVdyYXBwZXJ9IGZyb20gJy4uLy4uL3V0aWxpdHkvc3RyaW5nLXNlcXVlbmNlJztcclxuaW1wb3J0IHtQZXRyaU5ldElzb21vcnBoaXNtU2VydmljZX0gZnJvbSAnLi4vcG4vaXNvbW9ycGhpc20vcGV0cmktbmV0LWlzb21vcnBoaXNtLnNlcnZpY2UnO1xyXG5pbXBvcnQge1BhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXN9IGZyb20gJy4uLy4uL21vZGVscy9wbi9tb2RlbC9wYXJ0aWFsLW9yZGVyLW5ldC13aXRoLWNvbnRhaW5lZC10cmFjZXMnO1xyXG5pbXBvcnQge0xvZ0V2ZW50fSBmcm9tICcuLi8uLi9tb2RlbHMvbG9nL21vZGVsL2xvZ0V2ZW50JztcclxuaW1wb3J0IHtjbGVhbkxvZ30gZnJvbSAnLi9jbGVhbi1sb2cnO1xyXG5pbXBvcnQge0xvZ1N5bWJvbH0gZnJvbSAnLi9sb2ctc3ltYm9sJztcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExvZ1RvUGFydGlhbE9yZGVyVHJhbnNmb3JtZXJDb25maWd1cmF0aW9uIHtcclxuICAgIGNsZWFuTG9nPzogYm9vbGVhbjtcclxuICAgIGFkZFN0YXJ0U3RvcEV2ZW50PzogYm9vbGVhbjtcclxuICAgIGRpc2NhcmRQcmVmaXhlcz86IGJvb2xlYW47XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9nVG9QYXJ0aWFsT3JkZXJUcmFuc2Zvcm1lclNlcnZpY2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfcG5Jc29tb3JwaGlzbVNlcnZpY2U6IFBldHJpTmV0SXNvbW9ycGhpc21TZXJ2aWNlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zZm9ybVRvUGFydGlhbE9yZGVycyhsb2c6IEFycmF5PFRyYWNlPiwgY29uY3VycmVuY3lSZWxhdGlvbjogQ29uY3VycmVuY3lSZWxhdGlvbiwgY29uZmlnOiBMb2dUb1BhcnRpYWxPcmRlclRyYW5zZm9ybWVyQ29uZmlndXJhdGlvbiA9IHt9KTogQXJyYXk8UGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlcz4ge1xyXG4gICAgICAgIGlmIChsb2cubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghIWNvbmZpZy5jbGVhbkxvZykge1xyXG4gICAgICAgICAgICBsb2cgPSBjbGVhbkxvZyhsb2cpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgcmVsYWJlbGluZyBhIGxvZyB3aXRoIGJvdGggJ3N0YXJ0JyBhbmQgJ2NvbXBsZXRlJyBldmVudHMgd2lsbCByZXN1bHQgaW4gdW5leHBlY3RlZCBsYWJlbCBhc3NvY2lhdGlvbnMhYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25jdXJyZW5jeVJlbGF0aW9uLnJlbGFiZWxlci5yZWxhYmVsU2VxdWVuY2VzUHJlc2VydmVOb25VbmlxdWVJZGVudGl0aWVzKGxvZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlcXVlbmNlcyA9IHRoaXMuY29udmVydExvZ1RvUGV0cmlOZXRTZXF1ZW5jZXMobG9nLCAhIWNvbmZpZy5kaXNjYXJkUHJlZml4ZXMpO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2l0aXZlIHJlZHVjdGlvbiByZXF1aXJlcyBhbGwgcGxhY2VzIHRvIGJlIGludGVybmFsID0+IGFsd2F5cyBhZGQgc3RhcnQvc3RvcCBhbmQgcmVtb3ZlIGxhdGVyXHJcbiAgICAgICAgc2VxdWVuY2VzLmZvckVhY2goc2VxID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGRTdGFydEFuZFN0b3BFdmVudChzZXEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHBhcnRpYWxPcmRlcnMgPSB0aGlzLmNvbnZlcnRTZXF1ZW5jZXNUb1BhcnRpYWxPcmRlcnMoc2VxdWVuY2VzLCBjb25jdXJyZW5jeVJlbGF0aW9uKTtcclxuICAgICAgICB0aGlzLnJlbW92ZVRyYW5zaXRpdmVEZXBlbmRlbmNpZXMocGFydGlhbE9yZGVycyk7XHJcbiAgICAgICAgaWYgKCFjb25maWcuYWRkU3RhcnRTdG9wRXZlbnQpIHtcclxuICAgICAgICAgICAgcGFydGlhbE9yZGVycy5mb3JFYWNoKHBvID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlU3RhcnRBbmRTdG9wRXZlbnQocG8pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5maWx0ZXJBbmRDb21iaW5lUGFydGlhbE9yZGVyTmV0cyhwYXJ0aWFsT3JkZXJzKTtcclxuXHJcbiAgICAgICAgY29uY3VycmVuY3lSZWxhdGlvbi5yZWxhYmVsZXIudW5kb1NlcXVlbmNlc0xhYmVsaW5nKHJlc3VsdC5tYXAocG8gPT4gbmV3IEVkaXRhYmxlU3RyaW5nU2VxdWVuY2VXcmFwcGVyKHBvLm5ldC5nZXRUcmFuc2l0aW9ucygpKSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udmVydExvZ1RvUGV0cmlOZXRTZXF1ZW5jZXMobG9nOiBBcnJheTxUcmFjZT4sIGRpc2NhcmRQcmVmaXhlczogYm9vbGVhbik6IEFycmF5PFBldHJpTmV0U2VxdWVuY2U+IHtcclxuICAgICAgICBjb25zdCBuZXRTZXF1ZW5jZXMgPSBuZXcgU2V0PFBldHJpTmV0U2VxdWVuY2U+KCk7XHJcbiAgICAgICAgY29uc3QgdHJlZSA9IG5ldyBQcmVmaXhUcmVlPFBldHJpTmV0U2VxdWVuY2U+KCk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdHJhY2Ugb2YgbG9nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlcXVlbmNlID0gbmV3IFBldHJpTmV0U2VxdWVuY2UoKTtcclxuICAgICAgICAgICAgdHJlZS5pbnNlcnQodHJhY2UsXHJcbiAgICAgICAgICAgICAgICB0cmVlTm9kZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc2NhcmRQcmVmaXhlcyAmJiB0cmVlTm9kZS5oYXNDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNlcXVlbmNlLm5ldC5mcmVxdWVuY3kgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldFNlcXVlbmNlcy5hZGQoc2VxdWVuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXF1ZW5jZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAobm9kZSwgdHJlZU5vZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRpc2NhcmRQcmVmaXhlcyB8fCAhdHJlZU5vZGUuaGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLm5ldC5mcmVxdWVuY3kgPSBub2RlLm5ldC5mcmVxdWVuY3kgPT09IHVuZGVmaW5lZCA/IDEgOiBub2RlLm5ldC5mcmVxdWVuY3kgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIChsYWJlbCwgcHJldmlvdXNOb2RlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VxdWVuY2UuYXBwZW5kRXZlbnQobGFiZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXNjYXJkUHJlZml4ZXMgJiYgcHJldmlvdXNOb2RlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV0U2VxdWVuY2VzLmRlbGV0ZShwcmV2aW91c05vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldFNlcXVlbmNlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRTdGFydEFuZFN0b3BFdmVudChzZXF1ZW5jZTogUGV0cmlOZXRTZXF1ZW5jZSkge1xyXG4gICAgICAgIC8vIGFkZCBldmVudHMgdG8gbmV0XHJcbiAgICAgICAgY29uc3Qgc2VxdWVuY2VOZXQgPSBzZXF1ZW5jZS5uZXQ7XHJcbiAgICAgICAgY29uc3QgZmlyc3RMYXN0ID0gc2VxdWVuY2VOZXQuZ2V0UGxhY2VzKCkuZmlsdGVyKHAgPT4gcC5pbmdvaW5nQXJjcy5sZW5ndGggPT09IDAgfHwgcC5vdXRnb2luZ0FyY3MubGVuZ3RoID09PSAwKTtcclxuICAgICAgICBpZiAoZmlyc3RMYXN0Lmxlbmd0aCAhPT0gMikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKHNlcXVlbmNlTmV0KTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIHN0YXRlLiBBIHNlcXVlbmNlIG11c3QgaGF2ZSBvbmUgc3RhcnQgYW5kIG9uZSBlbmQgcGxhY2UuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmaXJzdCwgbGFzdDogUGxhY2U7XHJcbiAgICAgICAgaWYgKGZpcnN0TGFzdFswXS5pbmdvaW5nQXJjcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZmlyc3QgPSBmaXJzdExhc3RbMF07XHJcbiAgICAgICAgICAgIGxhc3QgPSBmaXJzdExhc3RbMV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmlyc3QgPSBmaXJzdExhc3RbMV07XHJcbiAgICAgICAgICAgIGxhc3QgPSBmaXJzdExhc3RbMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwcmVTdGFydCA9IG5ldyBQbGFjZSgpO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbmV3IFRyYW5zaXRpb24oTG9nU3ltYm9sLlNUQVJUKTtcclxuICAgICAgICBzZXF1ZW5jZU5ldC5hZGRQbGFjZShwcmVTdGFydCk7XHJcbiAgICAgICAgc2VxdWVuY2VOZXQuYWRkVHJhbnNpdGlvbihzdGFydCk7XHJcbiAgICAgICAgc2VxdWVuY2VOZXQuYWRkQXJjKHByZVN0YXJ0LCBzdGFydCk7XHJcbiAgICAgICAgc2VxdWVuY2VOZXQuYWRkQXJjKHN0YXJ0LCBmaXJzdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0b3AgPSBuZXcgVHJhbnNpdGlvbihMb2dTeW1ib2wuU1RPUCk7XHJcbiAgICAgICAgY29uc3QgcG9zdFN0b3AgPSBuZXcgUGxhY2UoKTtcclxuICAgICAgICBzZXF1ZW5jZU5ldC5hZGRUcmFuc2l0aW9uKHN0b3ApO1xyXG4gICAgICAgIHNlcXVlbmNlTmV0LmFkZFBsYWNlKHBvc3RTdG9wKTtcclxuICAgICAgICBzZXF1ZW5jZU5ldC5hZGRBcmMobGFzdCwgc3RvcCk7XHJcbiAgICAgICAgc2VxdWVuY2VOZXQuYWRkQXJjKHN0b3AsIHBvc3RTdG9wKTtcclxuXHJcbiAgICAgICAgLy8gYWRkIGV2ZW50cyB0byB0cmFjZVxyXG4gICAgICAgIHNlcXVlbmNlLnRyYWNlLmV2ZW50cy51bnNoaWZ0KG5ldyBMb2dFdmVudChMb2dTeW1ib2wuU1RBUlQpKTtcclxuICAgICAgICBzZXF1ZW5jZS50cmFjZS5ldmVudHMucHVzaChuZXcgTG9nRXZlbnQoTG9nU3ltYm9sLlNUT1ApKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZVN0YXJ0QW5kU3RvcEV2ZW50KHBhcnRpYWxPcmRlcjogUGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlcykge1xyXG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIG5ldFxyXG4gICAgICAgIGNvbnN0IHBhcnRpYWxPcmRlck5ldCA9IHBhcnRpYWxPcmRlci5uZXQ7XHJcbiAgICAgICAgaWYgKHBhcnRpYWxPcmRlck5ldC5pbnB1dFBsYWNlcy5zaXplICE9PSAxIHx8IHBhcnRpYWxPcmRlck5ldC5vdXRwdXRQbGFjZXMuc2l6ZSAhPT0gMSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKHBhcnRpYWxPcmRlck5ldCk7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaWxsZWdhbCBzdGF0ZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHN0YXJ0VHJhbnNpdGlvbjogVHJhbnNpdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBwYXJ0aWFsT3JkZXJOZXQuaW5wdXRQbGFjZXMuZm9yRWFjaChpZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluUGxhY2UgPSBwYXJ0aWFsT3JkZXJOZXQuZ2V0UGxhY2UoaWQpITtcclxuICAgICAgICAgICAgc3RhcnRUcmFuc2l0aW9uID0gaW5QbGFjZS5vdXRnb2luZ0FyY3NbMF0uZGVzdGluYXRpb24gYXMgVHJhbnNpdGlvbjtcclxuICAgICAgICAgICAgcGFydGlhbE9yZGVyTmV0LnJlbW92ZVBsYWNlKGlkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0VHJhbnNpdGlvbiA9PT0gdW5kZWZpbmVkIHx8IChzdGFydFRyYW5zaXRpb24gYXMgVHJhbnNpdGlvbikubGFiZWwgIT09IExvZ1N5bWJvbC5TVEFSVCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lsbGVnYWwgc3RhdGUnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFydGlhbE9yZGVyTmV0LnJlbW92ZVRyYW5zaXRpb24oc3RhcnRUcmFuc2l0aW9uKTtcclxuXHJcbiAgICAgICAgbGV0IHN0b3BUcmFuc2l0aW9uOiBUcmFuc2l0aW9uIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHBhcnRpYWxPcmRlck5ldC5vdXRwdXRQbGFjZXMuZm9yRWFjaChpZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dFBsYWNlID0gcGFydGlhbE9yZGVyTmV0LmdldFBsYWNlKGlkKSE7XHJcbiAgICAgICAgICAgIHN0b3BUcmFuc2l0aW9uID0gb3V0UGxhY2UuaW5nb2luZ0FyY3NbMF0uc291cmNlIGFzIFRyYW5zaXRpb247XHJcbiAgICAgICAgICAgIHBhcnRpYWxPcmRlck5ldC5yZW1vdmVQbGFjZShpZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzdG9wVHJhbnNpdGlvbiA9PT0gdW5kZWZpbmVkIHx8IChzdG9wVHJhbnNpdGlvbiBhcyBUcmFuc2l0aW9uKS5sYWJlbCAhPT0gTG9nU3ltYm9sLlNUT1ApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbGxlZ2FsIHN0YXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhcnRpYWxPcmRlck5ldC5yZW1vdmVUcmFuc2l0aW9uKHN0b3BUcmFuc2l0aW9uKTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gdHJhY2VcclxuICAgICAgICBwYXJ0aWFsT3JkZXIuY29udGFpbmVkVHJhY2VzWzBdLmV2ZW50cy5zaGlmdCgpO1xyXG4gICAgICAgIHBhcnRpYWxPcmRlci5jb250YWluZWRUcmFjZXNbMF0uZXZlbnRzLnBvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udmVydFNlcXVlbmNlc1RvUGFydGlhbE9yZGVycyhzZXF1ZW5jZXM6IEFycmF5PFBldHJpTmV0U2VxdWVuY2U+LCBjb25jdXJyZW5jeVJlbGF0aW9uOiBDb25jdXJyZW5jeVJlbGF0aW9uKTogQXJyYXk8UGFydGlhbE9yZGVyTmV0V2l0aENvbnRhaW5lZFRyYWNlcz4ge1xyXG4gICAgICAgIHJldHVybiBzZXF1ZW5jZXMubWFwKHNlcSA9PiB0aGlzLmNvbnZlcnRTZXF1ZW5jZVRvUGFydGlhbE9yZGVyKHNlcSwgY29uY3VycmVuY3lSZWxhdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udmVydFNlcXVlbmNlVG9QYXJ0aWFsT3JkZXIoc2VxdWVuY2U6IFBldHJpTmV0U2VxdWVuY2UsIGNvbmN1cnJlbmN5UmVsYXRpb246IENvbmN1cnJlbmN5UmVsYXRpb24pOiBQYXJ0aWFsT3JkZXJOZXRXaXRoQ29udGFpbmVkVHJhY2VzIHtcclxuICAgICAgICBjb25zdCBuZXQgPSBzZXF1ZW5jZS5uZXQ7XHJcbiAgICAgICAgY29uc3QgcGxhY2VRdWV1ZSA9IG5ldC5nZXRQbGFjZXMoKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKHBsYWNlUXVldWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBwbGFjZSA9IHBsYWNlUXVldWUuc2hpZnQoKSBhcyBQbGFjZTtcclxuICAgICAgICAgICAgaWYgKHBsYWNlLmluZ29pbmdBcmNzLmxlbmd0aCA9PT0gMCB8fCBwbGFjZS5vdXRnb2luZ0FyY3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxhY2UuaW5nb2luZ0FyY3MubGVuZ3RoID4gMSB8fCBwbGFjZS5vdXRnb2luZ0FyY3MubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhwbGFjZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKHNlcXVlbmNlKTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSWxsZWdhbCBzdGF0ZS4gVGhlIHByb2Nlc3NlZCBuZXQgaXMgbm90IGEgcGFydGlhbCBvcmRlciEnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJlRXZlbnQgPSAocGxhY2UuaW5nb2luZ0FyY3NbMF0uc291cmNlIGFzIFRyYW5zaXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBwb3N0RXZlbnQgPSAocGxhY2Uub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uIGFzIFRyYW5zaXRpb24pO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBwcmVFdmVudC5sYWJlbCEgPT09IHBvc3RFdmVudC5sYWJlbCEgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBubyBhdXRvLWNvbmN1cnJlbmN5XHJcbiAgICAgICAgICAgICAgICB8fCAhY29uY3VycmVuY3lSZWxhdGlvbi5pc0NvbmN1cnJlbnQocHJlRXZlbnQubGFiZWwhLCBwb3N0RXZlbnQubGFiZWwhKVxyXG4gICAgICAgICAgICAgICAgfHwgIWNvbmN1cnJlbmN5UmVsYXRpb24uaXNDb25jdXJyZW50KHBvc3RFdmVudC5sYWJlbCEsIHByZUV2ZW50LmxhYmVsISlcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV0LnJlbW92ZVBsYWNlKHBsYWNlKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBvZiBwcmVFdmVudC5pbmdvaW5nQXJjcykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5QbGFjZSA9IGEuc291cmNlIGFzIFBsYWNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpblBsYWNlLmluZ29pbmdBcmNzLmxlbmd0aCA9PT0gMCAmJiBwb3N0RXZlbnQuaW5nb2luZ0FyY3Muc29tZShhID0+IGEuc291cmNlLmluZ29pbmdBcmNzLmxlbmd0aCA9PT0gMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpblBsYWNlLmluZ29pbmdBcmNzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpblRyYW5zSWQgPSBpblBsYWNlLmluZ29pbmdBcmNzWzBdLnNvdXJjZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3N0RXZlbnQuaW5nb2luZ0FyY3Muc29tZShhID0+IGEuc291cmNlLmluZ29pbmdBcmNzWzBdPy5zb3VyY2VJZCA9PT0gaW5UcmFuc0lkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xvbmUgPSBuZXcgUGxhY2UoKTtcclxuICAgICAgICAgICAgICAgIG5ldC5hZGRQbGFjZShjbG9uZSk7XHJcbiAgICAgICAgICAgICAgICBwbGFjZVF1ZXVlLnB1c2goY2xvbmUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpblBsYWNlLmluZ29pbmdBcmNzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXQuYWRkQXJjKGluUGxhY2UuaW5nb2luZ0FyY3NbMF0uc291cmNlIGFzIFRyYW5zaXRpb24sIGNsb25lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBuZXQuYWRkQXJjKGNsb25lLCBwb3N0RXZlbnQpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgYSBvZiBwb3N0RXZlbnQub3V0Z29pbmdBcmNzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRQbGFjZSA9IGEuZGVzdGluYXRpb24gYXMgUGxhY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG91dFBsYWNlLm91dGdvaW5nQXJjcy5sZW5ndGggPT09IDAgJiYgcHJlRXZlbnQub3V0Z29pbmdBcmNzLnNvbWUoYSA9PiBhLmRlc3RpbmF0aW9uLm91dGdvaW5nQXJjcy5sZW5ndGggPT09IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob3V0UGxhY2Uub3V0Z29pbmdBcmNzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRUcmFuc0lkID0gb3V0UGxhY2Uub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZUV2ZW50Lm91dGdvaW5nQXJjcy5zb21lKGEgPT4gYS5kZXN0aW5hdGlvbi5vdXRnb2luZ0FyY3NbMF0/LmRlc3RpbmF0aW9uSWQgPT09IG91dFRyYW5zSWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IG5ldyBQbGFjZSgpO1xyXG4gICAgICAgICAgICAgICAgbmV0LmFkZFBsYWNlKGNsb25lKTtcclxuICAgICAgICAgICAgICAgIHBsYWNlUXVldWUucHVzaChjbG9uZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG91dFBsYWNlLm91dGdvaW5nQXJjcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV0LmFkZEFyYyhjbG9uZSwgb3V0UGxhY2Uub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uIGFzIFRyYW5zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG5ldC5hZGRBcmMocHJlRXZlbnQsIGNsb25lKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFBhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXMobmV0LCBbc2VxdWVuY2UudHJhY2VdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZVRyYW5zaXRpdmVEZXBlbmRlbmNpZXMocG9zOiBBcnJheTxQYXJ0aWFsT3JkZXJOZXRXaXRoQ29udGFpbmVkVHJhY2VzPikge1xyXG4gICAgICAgIHBvcy5mb3JFYWNoKHBvID0+IHRoaXMucGVyZm9ybVRyYW5zaXRpdmVSZWR1Y3Rpb24ocG8ubmV0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwZXJmb3JtVHJhbnNpdGl2ZVJlZHVjdGlvbihwYXJ0aWFsT3JkZXI6IFBldHJpTmV0KSB7XHJcbiAgICAgICAgLy8gYWxnb3JpdGhtIGJhc2VkIG9uIFwiQWxnb3JpdGhtIEFcIiBmcm9tIGh0dHBzOi8vd3d3LnNjaWVuY2VkaXJlY3QuY29tL3NjaWVuY2UvYXJ0aWNsZS9waWkvMDMwNDM5NzU4ODkwMDMyMVxyXG4gICAgICAgIC8vIHRoZSBwYXBlciBpdHNlbGYgb2ZmZXJzIGFuIGltcHJvdmVtZW50IG92ZXIgdGhpcyBBbGdvcml0aG0gLSBtaWdodCBiZSB1c2VmdWwgaWYgQSBwcm92ZXMgdG8gYmUgdG9vIHNsb3dcclxuXHJcbiAgICAgICAgY29uc3QgcmV2ZXJzZVRyYW5zaXRpb25PcmRlciA9IHRoaXMucmV2ZXJzZVRvcG9sb2dpY2FsVHJhbnNpdGlvbk9yZGVyaW5nKHBhcnRpYWxPcmRlcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHJldmVyc2VPcmRlciA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KHJldmVyc2VUcmFuc2l0aW9uT3JkZXIubWFwKCh0LCBpKSA9PiBbdC5nZXRJZCgpLCBpXSkpO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zaXRpdmVEZXNjZW5kYW50cyA9IG5ldyBNYXBTZXQ8c3RyaW5nLCBzdHJpbmc+KCk7XHJcbiAgICAgICAgY29uc3QgcmVkdWNlZERlc2NlbmRhbnRzID0gbmV3IE1hcFNldDxzdHJpbmcsIHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHJldmVyc2VUcmFuc2l0aW9uT3JkZXIpIHtcclxuICAgICAgICAgICAgdHJhbnNpdGl2ZURlc2NlbmRhbnRzLmFkZCh0LmdldElkKCksIHQuZ2V0SWQoKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuSWRzID0gdGhpcy5nZXRDaGlsZElkcyh0KS5zb3J0KChpZDEsIGlkMikgPT4gcmV2ZXJzZU9yZGVyLmdldChpZDIpISAtIHJldmVyc2VPcmRlci5nZXQoaWQxKSEpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoaWxkSWQgb2YgY2hpbGRyZW5JZHMpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdHJhbnNpdGl2ZURlc2NlbmRhbnRzLmhhcyh0LmdldElkKCksIGNoaWxkSWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGl2ZURlc2NlbmRhbnRzLmFkZEFsbCh0LmdldElkKCksIHRyYW5zaXRpdmVEZXNjZW5kYW50cy5nZXQoY2hpbGRJZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZHVjZWREZXNjZW5kYW50cy5hZGQodC5nZXRJZCgpLCBjaGlsZElkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHRyYW5zaXRpdmUgY29ubmVjdGlvbnMgKHBsYWNlcylcclxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgcGFydGlhbE9yZGVyLmdldFRyYW5zaXRpb25zKCkpIHtcclxuICAgICAgICAgICAgaWYgKHQubGFiZWwgPT09IExvZ1N5bWJvbC5TVE9QKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGEgb2YgdC5vdXRnb2luZ0FyY3MpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVkdWNlZERlc2NlbmRhbnRzLmhhcyh0LmdldElkKCksIGEuZGVzdGluYXRpb24ub3V0Z29pbmdBcmNzWzBdLmRlc3RpbmF0aW9uSWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydGlhbE9yZGVyLnJlbW92ZVBsYWNlKGEuZGVzdGluYXRpb25JZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDaGlsZElkcyh0cmFuc2l0aW9uOiBUcmFuc2l0aW9uKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb24ub3V0Z29pbmdBcmNzLmZsYXRNYXAoYSA9PiBhLmRlc3RpbmF0aW9uLm91dGdvaW5nQXJjcy5tYXAodGEgPT4gdGEuZGVzdGluYXRpb24uZ2V0SWQoKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSB0cmFuc2l0aW9ucyBvZiB0aGUgZ2l2ZW4gbmV0LiBUaGUgcmVzdWx0IGlzIGluIHJldmVyc2UtdG9wb2xvZ2ljYWwgb3JkZXIgaS5lLlxyXG4gICAgICogdHJhbnNpdGlvbnMgYXQgdGhlIGZyb250IG9mIHRoZSBBcnJheSBhcHBlYXIgbGF0ZXIgaW4gdGhlIG5ldC5cclxuICAgICAqXHJcbiAgICAgKiBJbXBsZW1lbnRhdGlvbiBiYXNlZCBvbiBodHRwczovL3d3dy5nZWVrc2ZvcmdlZWtzLm9yZy90b3BvbG9naWNhbC1zb3J0aW5nLzNcclxuICAgICAqIEBwYXJhbSBuZXQgYSBQZXRyaSBOZXQgcmVwcmVzZW50YXRpb24gb2YgYSBwYXJ0aWFsIG9yZGVyXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmV2ZXJzZVRvcG9sb2dpY2FsVHJhbnNpdGlvbk9yZGVyaW5nKG5ldDogUGV0cmlOZXQpOiBBcnJheTxUcmFuc2l0aW9uPiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0U3RhY2s6IEFycmF5PFRyYW5zaXRpb24+ID0gW107XHJcbiAgICAgICAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBuZXQuZ2V0VHJhbnNpdGlvbnMoKSkge1xyXG4gICAgICAgICAgICBpZiAodmlzaXRlZC5oYXModC5nZXRJZCgpKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50b3BvbG9naWNhbE9yZGVyaW5nVXRpbCh0LCB2aXNpdGVkLCByZXN1bHRTdGFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRTdGFjaztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvcG9sb2dpY2FsT3JkZXJpbmdVdGlsKHQ6IFRyYW5zaXRpb24sIHZpc2l0ZWQ6IFNldDxzdHJpbmc+LCByZXN1bHRTdGFjazogQXJyYXk8VHJhbnNpdGlvbj4pIHtcclxuICAgICAgICB2aXNpdGVkLmFkZCh0LmdldElkKCkpO1xyXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiB0Lm91dGdvaW5nQXJjcykge1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0VHJhbnNpdGlvbiA9IGEuZGVzdGluYXRpb24ub3V0Z29pbmdBcmNzWzBdPy5kZXN0aW5hdGlvbjtcclxuICAgICAgICAgICAgaWYgKG5leHRUcmFuc2l0aW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2aXNpdGVkLmhhcyhuZXh0VHJhbnNpdGlvbi5nZXRJZCgpKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50b3BvbG9naWNhbE9yZGVyaW5nVXRpbChuZXh0VHJhbnNpdGlvbiBhcyBUcmFuc2l0aW9uLCB2aXNpdGVkLCByZXN1bHRTdGFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc3VsdFN0YWNrLnB1c2godCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaWx0ZXJBbmRDb21iaW5lUGFydGlhbE9yZGVyTmV0cyhwYXJ0aWFsT3JkZXJzOiBBcnJheTxQYXJ0aWFsT3JkZXJOZXRXaXRoQ29udGFpbmVkVHJhY2VzPik6IEFycmF5PFBhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXM+IHtcclxuICAgICAgICBjb25zdCB1bmlxdWU6IEFycmF5PFBhcnRpYWxPcmRlck5ldFdpdGhDb250YWluZWRUcmFjZXM+ID0gW3BhcnRpYWxPcmRlcnMuc2hpZnQoKSFdO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHVuY2hlY2tlZE9yZGVyIG9mIHBhcnRpYWxPcmRlcnMpIHtcclxuICAgICAgICAgICAgbGV0IGRpc2NhcmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCB1bmlxdWVPcmRlciBvZiB1bmlxdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wbklzb21vcnBoaXNtU2VydmljZS5hcmVQYXJ0aWFsT3JkZXJQZXRyaU5ldHNJc29tb3JwaGljKHVuY2hlY2tlZE9yZGVyLm5ldCwgdW5pcXVlT3JkZXIubmV0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2NhcmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHVuaXF1ZU9yZGVyLm5ldC5mcmVxdWVuY3kgPSB1bmlxdWVPcmRlci5uZXQuZnJlcXVlbmN5ISArIHVuY2hlY2tlZE9yZGVyLm5ldC5mcmVxdWVuY3khO1xyXG4gICAgICAgICAgICAgICAgICAgIHVuaXF1ZU9yZGVyLmNvbnRhaW5lZFRyYWNlcy5wdXNoKC4uLnVuY2hlY2tlZE9yZGVyLmNvbnRhaW5lZFRyYWNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFkaXNjYXJkKSB7XHJcbiAgICAgICAgICAgICAgICB1bmlxdWUucHVzaCh1bmNoZWNrZWRPcmRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1bmlxdWU7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==