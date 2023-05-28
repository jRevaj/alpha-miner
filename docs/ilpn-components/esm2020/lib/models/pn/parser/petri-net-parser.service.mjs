import { Injectable } from '@angular/core';
import { PetriNet } from '../model/petri-net';
import { Place } from '../model/place';
import { Transition } from '../model/transition';
import { Arc } from '../model/arc';
import { AbstractBlockParser } from '../../../utility/abstract-block-parser';
import { BlockType } from './block-type';
import * as i0 from "@angular/core";
export class PetriNetParserService extends AbstractBlockParser {
    constructor() {
        super('pn', [BlockType.PLACES, BlockType.TRANSITIONS, BlockType.ARCS]);
    }
    newResult() {
        return new PetriNet();
    }
    resolveBlockParser(block) {
        switch (block) {
            case BlockType.PLACES:
                return (lines, result) => this.parsePlaces(lines, result);
            case BlockType.TRANSITIONS:
                return (lines, result) => this.parseTransitions(lines, result);
            case BlockType.ARCS:
                return (lines, result) => this.parseArcs(lines, result);
            default:
                return undefined;
        }
    }
    parsePlaces(lines, net) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length !== 2) {
                throw new Error(`line '${line}' does not have the correct number of elements! Place definition must contain exactly two elements!`);
            }
            const initialMarking = parseInt(parts[1]);
            if (isNaN(initialMarking)) {
                throw new Error(`line '${line}' marking cannot be parsed into a number! Place marking must be a non-negative integer!`);
            }
            if (initialMarking < 0) {
                throw new Error(`line '${line}' marking is less than 0! Place marking must be a non-negative integer!`);
            }
            if (net.getPlace(parts[0]) !== undefined || net.getTransition(parts[0]) !== undefined) {
                throw new Error(`line '${line}' place ids must be unique!`);
            }
            const place = new Place(initialMarking, 0, 0, parts[0]);
            net.addPlace(place);
        });
    }
    parseTransitions(lines, net) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length < 1 || parts.length > 2) {
                throw new Error(`line '${line}' does not have the correct number of elements! Transition definition must contain one or two elements!`);
            }
            if (net.getTransition(parts[0]) !== undefined || net.getPlace(parts[0]) !== undefined) {
                throw new Error(`line '${line}' transition ids must be unique!`);
            }
            net.addTransition(new Transition(parts[1], 0, 0, parts[0]));
        });
    }
    parseArcs(lines, net) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length < 2 || parts.length > 3) {
                throw new Error(`line '${line}' does not have the correct number of elements! Arc definition must contain two or three elements!`);
            }
            let weight = 1;
            if (parts.length === 3) {
                weight = parseInt(parts[2]);
                if (isNaN(weight)) {
                    throw new Error(`line '${line}' arc weight cannot be parsed into a number! Arc weight must be a positive integer!`);
                }
                if (weight < 1) {
                    throw new Error(`line '${line}' arc weight is less than 1! Arc weight must be a positive integer!`);
                }
            }
            const srcDest = this.extractSourceAndDestination(parts[0], parts[1], line, net);
            const arcId = parts[0] + ' ' + parts[1];
            if (net.getArc(arcId) !== undefined) {
                throw new Error(`line '${line}' duplicate arcs between elements are not allowed!`);
            }
            const arc = new Arc(arcId, srcDest.source, srcDest.destination, weight);
            net.addArc(arc);
        });
    }
    extractSourceAndDestination(sourceId, destinationId, line, net) {
        let source = net.getPlace(sourceId);
        let destination = net.getTransition(destinationId);
        if (!!source && !!destination) {
            return { source, destination };
        }
        source = net.getTransition(sourceId);
        destination = net.getPlace(destinationId);
        if (!!source && !!destination) {
            return { source, destination };
        }
        throw new Error(`line '${line}' arc source or destination is invalid! Arc must reference existing net elements and connect a place with a transition or a transition with a place!`);
    }
}
PetriNetParserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetParserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetParserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetParserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetParserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LXBhcnNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL21vZGVscy9wbi9wYXJzZXIvcGV0cmktbmV0LXBhcnNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDL0MsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUdqQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDOztBQUt2QyxNQUFNLE9BQU8scUJBQXNCLFNBQVEsbUJBQTZCO0lBRXBFO1FBQ0ksS0FBSyxDQUNELElBQUksRUFDSixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQzVELENBQUM7SUFDTixDQUFDO0lBRVMsU0FBUztRQUNmLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRVMsa0JBQWtCLENBQUMsS0FBYTtRQUN0QyxRQUFRLEtBQUssRUFBRTtZQUNYLEtBQUssU0FBUyxDQUFDLE1BQU07Z0JBQ2pCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5RCxLQUFLLFNBQVMsQ0FBQyxXQUFXO2dCQUN0QixPQUFPLENBQUMs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cEcsSUFBSSxNQUFNLEdBQXFCLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEQsSUFBSSxXQUFXLEdBQXFCLEdBQUcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUU7WUFDM0IsT0FBTyxFQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUMsQ0FBQztTQUNoQztRQUNELE1BQU0sR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLFdBQVcsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQzNCLE9BQU8sRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFDLENBQUM7U0FDaEM7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxzSkFBc0osQ0FBQyxDQUFDO0lBQ3pMLENBQUM7O2tIQWpHUSxxQkFBcUI7c0hBQXJCLHFCQUFxQixjQUZsQixNQUFNOzJGQUVULHFCQUFxQjtrQkFIakMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1BldHJpTmV0fSBmcm9tICcuLi9tb2RlbC9wZXRyaS1uZXQnO1xyXG5pbXBvcnQge1BsYWNlfSBmcm9tICcuLi9tb2RlbC9wbGFjZSc7XHJcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSAnLi4vbW9kZWwvdHJhbnNpdGlvbic7XHJcbmltcG9ydCB7QXJjfSBmcm9tICcuLi9tb2RlbC9hcmMnO1xyXG5pbXBvcnQge1NvdXJjZUFuZERlc3RpbmF0aW9ufSBmcm9tICcuL3NvdXJjZS1hbmQtZGVzdGluYXRpb24nO1xyXG5pbXBvcnQge05vZGV9IGZyb20gJy4uL21vZGVsL25vZGUnO1xyXG5pbXBvcnQge0Fic3RyYWN0QmxvY2tQYXJzZXJ9IGZyb20gJy4uLy4uLy4uL3V0aWxpdHkvYWJzdHJhY3QtYmxvY2stcGFyc2VyJztcclxuaW1wb3J0IHtCbG9ja1R5cGV9IGZyb20gJy4vYmxvY2stdHlwZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFBldHJpTmV0UGFyc2VyU2VydmljZSBleHRlbmRzIEFic3RyYWN0QmxvY2tQYXJzZXI8UGV0cmlOZXQ+IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcclxuICAgICAgICAgICAgJ3BuJyxcclxuICAgICAgICAgICAgW0Jsb2NrVHlwZS5QTEFDRVMsIEJsb2NrVHlwZS5UUkFOU0lUSU9OUywgQmxvY2tUeXBlLkFSQ1NdXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbmV3UmVzdWx0KCk6IFBldHJpTmV0IHtcclxuICAgICAgICByZXR1cm4gbmV3IFBldHJpTmV0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlc29sdmVCbG9ja1BhcnNlcihibG9jazogc3RyaW5nKTogKChsaW5lczogQXJyYXk8c3RyaW5nPiwgcmVzdWx0OiBQZXRyaU5ldCkgPT4gdm9pZCkgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHN3aXRjaCAoYmxvY2spIHtcclxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuUExBQ0VTOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChsaW5lcywgcmVzdWx0KSA9PiB0aGlzLnBhcnNlUGxhY2VzKGxpbmVzLCByZXN1bHQpO1xyXG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5UUkFOU0lUSU9OUzpcclxuICAgICAgICAgICAgICAgIHJldHVybiAobGluZXMsIHJlc3VsdCkgPT4gdGhpcy5wYXJzZVRyYW5zaXRpb25zKGxpbmVzLCByZXN1bHQpO1xyXG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5BUkNTOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChsaW5lcywgcmVzdWx0KSA9PiB0aGlzLnBhcnNlQXJjcyhsaW5lcywgcmVzdWx0KTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VQbGFjZXMobGluZXM6IEFycmF5PHN0cmluZz4sIG5ldDogUGV0cmlOZXQpIHtcclxuICAgICAgICB0aGlzLnBhcnNlRWFjaExpbmUobGluZXMsIChwYXJ0cywgbGluZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoICE9PSAyKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGxpbmUgJyR7bGluZX0nIGRvZXMgbm90IGhhdmUgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGVsZW1lbnRzISBQbGFjZSBkZWZpbml0aW9uIG11c3QgY29udGFpbiBleGFjdGx5IHR3byBlbGVtZW50cyFgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBpbml0aWFsTWFya2luZyA9IHBhcnNlSW50KHBhcnRzWzFdKVxyXG4gICAgICAgICAgICBpZiAoaXNOYU4oaW5pdGlhbE1hcmtpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGxpbmUgJyR7bGluZX0nIG1hcmtpbmcgY2Fubm90IGJlIHBhcnNlZCBpbnRvIGEgbnVtYmVyISBQbGFjZSBtYXJraW5nIG11c3QgYmUgYSBub24tbmVnYXRpdmUgaW50ZWdlciFgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5pdGlhbE1hcmtpbmcgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGxpbmUgJyR7bGluZX0nIG1hcmtpbmcgaXMgbGVzcyB0aGFuIDAhIFBsYWNlIG1hcmtpbmcgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChuZXQuZ2V0UGxhY2UocGFydHNbMF0pICE9PSB1bmRlZmluZWQgfHwgbmV0LmdldFRyYW5zaXRpb24ocGFydHNbMF0pICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgbGluZSAnJHtsaW5lfScgcGxhY2UgaWRzIG11c3QgYmUgdW5pcXVlIWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlID0gbmV3IFBsYWNlKGluaXRpYWxNYXJraW5nLCAwLCAwLCBwYXJ0c1swXSk7XHJcbiAgICAgICAgICAgIG5ldC5hZGRQbGFjZShwbGFjZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZVRyYW5zaXRpb25zKGxpbmVzOiBBcnJheTxzdHJpbmc+LCBuZXQ6IFBldHJpTmV0KSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZUVhY2hMaW5lKGxpbmVzLCAocGFydHMsIGxpbmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA8IDEgfHwgcGFydHMubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBsaW5lICcke2xpbmV9JyBkb2VzIG5vdCBoYXZlIHRoZSBjb3JyZWN0IG51bWJlciBvZiBlbGVtZW50cyEgVHJhbnNpdGlvbiBkZWZpbml0aW9uIG11c3QgY29udGFpbiBvbmUgb3IgdHdvIGVsZW1lbnRzIWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChuZXQuZ2V0VHJhbnNpdGlvbihwYXJ0c1swXSkgIT09IHVuZGVmaW5lZCB8fCBuZXQuZ2V0UGxhY2UocGFydHNbMF0pICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgbGluZSAnJHtsaW5lfScgdHJhbnNpdGlvbiBpZHMgbXVzdCBiZSB1bmlxdWUhYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV0LmFkZFRyYW5zaXRpb24obmV3IFRyYW5zaXRpb24ocGFydHNbMV0sIDAsIDAsIHBhcnRzWzBdKSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlQXJjcyhsaW5lczogQXJyYXk8c3RyaW5nPiwgbmV0OiBQZXRyaU5ldCkge1xyXG4gICAgICAgIHRoaXMucGFyc2VFYWNoTGluZShsaW5lcywgKHBhcnRzLCBsaW5lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyIHx8IHBhcnRzLmxlbmd0aCA+IDMpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgbGluZSAnJHtsaW5lfScgZG9lcyBub3QgaGF2ZSB0aGUgY29ycmVjdCBudW1iZXIgb2YgZWxlbWVudHMhIEFyYyBkZWZpbml0aW9uIG11c3QgY29udGFpbiB0d28gb3IgdGhyZWUgZWxlbWVudHMhYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHdlaWdodCA9IDE7XHJcbiAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIHdlaWdodCA9IHBhcnNlSW50KHBhcnRzWzJdKVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKHdlaWdodCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGxpbmUgJyR7bGluZX0nIGFyYyB3ZWlnaHQgY2Fubm90IGJlIHBhcnNlZCBpbnRvIGEgbnVtYmVyISBBcmMgd2VpZ2h0IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyIWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHdlaWdodCA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGxpbmUgJyR7bGluZX0nIGFyYyB3ZWlnaHQgaXMgbGVzcyB0aGFuIDEhIEFyYyB3ZWlnaHQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIhYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc3JjRGVzdCA9IHRoaXMuZXh0cmFjdFNvdXJjZUFuZERlc3RpbmF0aW9uKHBhcnRzWzBdLCBwYXJ0c1sxXSwgbGluZSwgbmV0KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFyY0lkID0gcGFydHNbMF0gKyAnICcgKyBwYXJ0c1sxXTtcclxuICAgICAgICAgICAgaWYgKG5ldC5nZXRBcmMoYXJjSWQpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgbGluZSAnJHtsaW5lfScgZHVwbGljYXRlIGFyY3MgYmV0d2VlbiBlbGVtZW50cyBhcmUgbm90IGFsbG93ZWQhYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFyYyA9IG5ldyBBcmMoYXJjSWQsIHNyY0Rlc3Quc291cmNlLCBzcmNEZXN0LmRlc3RpbmF0aW9uLCB3ZWlnaHQpO1xyXG4gICAgICAgICAgICBuZXQuYWRkQXJjKGFyYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHRyYWN0U291cmNlQW5kRGVzdGluYXRpb24oc291cmNlSWQ6IHN0cmluZywgZGVzdGluYXRpb25JZDogc3RyaW5nLCBsaW5lOiBzdHJpbmcsIG5ldDogUGV0cmlOZXQpOiBTb3VyY2VBbmREZXN0aW5hdGlvbiB7XHJcbiAgICAgICAgbGV0IHNvdXJjZTogTm9kZSB8IHVuZGVmaW5lZCA9IG5ldC5nZXRQbGFjZShzb3VyY2VJZCk7XHJcbiAgICAgICAgbGV0IGRlc3RpbmF0aW9uOiBOb2RlIHwgdW5kZWZpbmVkID0gbmV0LmdldFRyYW5zaXRpb24oZGVzdGluYXRpb25JZCk7XHJcbiAgICAgICAgaWYgKCEhc291cmNlICYmICEhZGVzdGluYXRpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtzb3VyY2UsIGRlc3RpbmF0aW9ufTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc291cmNlID0gbmV0LmdldFRyYW5zaXRpb24oc291cmNlSWQpO1xyXG4gICAgICAgIGRlc3RpbmF0aW9uID0gbmV0LmdldFBsYWNlKGRlc3RpbmF0aW9uSWQpO1xyXG4gICAgICAgIGlmICghIXNvdXJjZSAmJiAhIWRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7c291cmNlLCBkZXN0aW5hdGlvbn07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgbGluZSAnJHtsaW5lfScgYXJjIHNvdXJjZSBvciBkZXN0aW5hdGlvbiBpcyBpbnZhbGlkISBBcmMgbXVzdCByZWZlcmVuY2UgZXhpc3RpbmcgbmV0IGVsZW1lbnRzIGFuZCBjb25uZWN0IGEgcGxhY2Ugd2l0aCBhIHRyYW5zaXRpb24gb3IgYSB0cmFuc2l0aW9uIHdpdGggYSBwbGFjZSFgKTtcclxuICAgIH1cclxufVxyXG4iXX0=