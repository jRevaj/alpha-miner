import { Injectable } from '@angular/core';
import { PartialOrder } from '../model/partial-order';
import { AbstractBlockParser } from '../../../utility/abstract-block-parser';
import { BlockType } from './block-type';
import { Event } from '../model/event';
import * as i0 from "@angular/core";
export class PartialOrderParserService extends AbstractBlockParser {
    constructor() {
        super(['run', 'po', 'ps', 'log'], [BlockType.EVENTS, BlockType.ARCS]);
    }
    parse(text) {
        const po = super.parse(text);
        if (po !== undefined) {
            po.determineInitialAndFinalEvents();
        }
        return po;
    }
    newResult() {
        return new PartialOrder();
    }
    resolveBlockParser(block) {
        switch (block) {
            case BlockType.EVENTS:
                return (lines, result) => this.parseEvents(lines, result);
            case BlockType.ARCS:
                return (lines, result) => this.parseArcs(lines, result);
            default:
                return undefined;
        }
    }
    parseEvents(lines, partialOrder) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length !== 2) {
                throw new Error(`line ${line} does not have the correct number of elements! Event definitions must consist of exactly two elements!`);
            }
            partialOrder.addEvent(new Event(parts[0], parts[1]));
        });
    }
    parseArcs(lines, partialOrder) {
        this.parseEachLine(lines, (parts, line) => {
            if (parts.length !== 2) {
                throw new Error(`line ${line} does not have the correct number of elements! Arc definitions must consist of exactly two elements!`);
            }
            if (parts[0] === parts[1]) {
                throw new Error(`line ${line} specifies a reflexive arc! Partial order must be ireflexive!`);
            }
            const first = partialOrder.getEvent(parts[0]);
            const second = partialOrder.getEvent(parts[1]);
            if (first === undefined || second === undefined) {
                throw new Error(`line ${line} specifies an arc between at least one event that does not exist in the partial order!`);
            }
            first.addNextEvent(second);
        });
    }
}
PartialOrderParserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderParserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PartialOrderParserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderParserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PartialOrderParserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGlhbC1vcmRlci1wYXJzZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9tb2RlbHMvcG8vcGFyc2VyL3BhcnRpYWwtb3JkZXItcGFyc2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDM0UsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBS3JDLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxtQkFBaUM7SUFFNUU7UUFDSSxLQUFLLENBQ0QsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFDMUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FDckMsQ0FBQztJQUNOLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBWTtRQUN2QixNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtZQUNsQixFQUFFLENBQUMsOEJBQThCLEVBQUUsQ0FBQztTQUN2QztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVTLFNBQVM7UUFDZixPQUFPLElBQUksWUFBWSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVTLGtCQUFrQixDQUFDLEtBQWE7UUFDdEMsUUFBUSxLQUFLLEVBQUU7WUFDWCxLQUFLLFNBQVMsQ0FBQyxNQUFNO2dCQUNqQixPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDOUQsS0FBSyxTQUFTLENBQUMsSUFBSTtnQkFDZixPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUQ7Z0JBQ0ksT0FBTyxTQUFTLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRU8sV0FBVyxDQUFDLEtBQW9CLEVBQUUsWUFBMEI7UUFDaEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdEMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksd0dBQXdHLENBQUMsQ0FBQzthQUN6STtZQUNELFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sU0FBUyxDQUFDLEtBQW9CLEVBQUUsWUFBMEI7UUFDOUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdEMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksc0dBQXNHLENBQUMsQ0FBQzthQUN2STtZQUNELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksK0RBQStELENBQUMsQ0FBQzthQUNoRztZQUNELE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksd0ZBQXdGLENBQUMsQ0FBQzthQUN6SDtZQUNELEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztzSEF4RFEseUJBQXlCOzBIQUF6Qix5QkFBeUIsY0FGdEIsTUFBTTsyRkFFVCx5QkFBeUI7a0JBSHJDLFVBQVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtQYXJ0aWFsT3JkZXJ9IGZyb20gJy4uL21vZGVsL3BhcnRpYWwtb3JkZXInO1xyXG5pbXBvcnQge0Fic3RyYWN0QmxvY2tQYXJzZXJ9IGZyb20gJy4uLy4uLy4uL3V0aWxpdHkvYWJzdHJhY3QtYmxvY2stcGFyc2VyJztcclxuaW1wb3J0IHtCbG9ja1R5cGV9IGZyb20gJy4vYmxvY2stdHlwZSc7XHJcbmltcG9ydCB7RXZlbnR9IGZyb20gJy4uL21vZGVsL2V2ZW50JztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgUGFydGlhbE9yZGVyUGFyc2VyU2VydmljZSBleHRlbmRzIEFic3RyYWN0QmxvY2tQYXJzZXI8UGFydGlhbE9yZGVyPiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoXHJcbiAgICAgICAgICAgIFsncnVuJywgJ3BvJywgJ3BzJywgJ2xvZyddLFxyXG4gICAgICAgICAgICBbQmxvY2tUeXBlLkVWRU5UUywgQmxvY2tUeXBlLkFSQ1NdXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBvdmVycmlkZSBwYXJzZSh0ZXh0OiBzdHJpbmcpOiBQYXJ0aWFsT3JkZXIgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IHBvID0gc3VwZXIucGFyc2UodGV4dCk7XHJcbiAgICAgICAgaWYgKHBvICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcG8uZGV0ZXJtaW5lSW5pdGlhbEFuZEZpbmFsRXZlbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwbztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbmV3UmVzdWx0KCk6IFBhcnRpYWxPcmRlciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJ0aWFsT3JkZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVzb2x2ZUJsb2NrUGFyc2VyKGJsb2NrOiBzdHJpbmcpOiAoKGxpbmVzOiBBcnJheTxzdHJpbmc+LCByZXN1bHQ6IFBhcnRpYWxPcmRlcikgPT4gdm9pZCkgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHN3aXRjaCAoYmxvY2spIHtcclxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRVZFTlRTOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChsaW5lcywgcmVzdWx0KSA9PiB0aGlzLnBhcnNlRXZlbnRzKGxpbmVzLCByZXN1bHQpO1xyXG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5BUkNTOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChsaW5lcywgcmVzdWx0KSA9PiB0aGlzLnBhcnNlQXJjcyhsaW5lcywgcmVzdWx0KTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VFdmVudHMobGluZXM6IEFycmF5PHN0cmluZz4sIHBhcnRpYWxPcmRlcjogUGFydGlhbE9yZGVyKSB7XHJcbiAgICAgICAgdGhpcy5wYXJzZUVhY2hMaW5lKGxpbmVzLCAocGFydHMsIGxpbmUpID0+IHtcclxuICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBsaW5lICR7bGluZX0gZG9lcyBub3QgaGF2ZSB0aGUgY29ycmVjdCBudW1iZXIgb2YgZWxlbWVudHMhIEV2ZW50IGRlZmluaXRpb25zIG11c3QgY29uc2lzdCBvZiBleGFjdGx5IHR3byBlbGVtZW50cyFgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYXJ0aWFsT3JkZXIuYWRkRXZlbnQobmV3IEV2ZW50KHBhcnRzWzBdLCBwYXJ0c1sxXSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VBcmNzKGxpbmVzOiBBcnJheTxzdHJpbmc+LCBwYXJ0aWFsT3JkZXI6IFBhcnRpYWxPcmRlcikge1xyXG4gICAgICAgIHRoaXMucGFyc2VFYWNoTGluZShsaW5lcywgKHBhcnRzLCBsaW5lKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggIT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgbGluZSAke2xpbmV9IGRvZXMgbm90IGhhdmUgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGVsZW1lbnRzISBBcmMgZGVmaW5pdGlvbnMgbXVzdCBjb25zaXN0IG9mIGV4YWN0bHkgdHdvIGVsZW1lbnRzIWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXJ0c1swXSA9PT0gcGFydHNbMV0pIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgbGluZSAke2xpbmV9IHNwZWNpZmllcyBhIHJlZmxleGl2ZSBhcmMhIFBhcnRpYWwgb3JkZXIgbXVzdCBiZSBpcmVmbGV4aXZlIWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0ID0gcGFydGlhbE9yZGVyLmdldEV2ZW50KHBhcnRzWzBdKTtcclxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kID0gcGFydGlhbE9yZGVyLmdldEV2ZW50KHBhcnRzWzFdKTtcclxuICAgICAgICAgICAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQgfHwgc2Vjb25kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgbGluZSAke2xpbmV9IHNwZWNpZmllcyBhbiBhcmMgYmV0d2VlbiBhdCBsZWFzdCBvbmUgZXZlbnQgdGhhdCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgcGFydGlhbCBvcmRlciFgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaXJzdC5hZGROZXh0RXZlbnQoc2Vjb25kKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19