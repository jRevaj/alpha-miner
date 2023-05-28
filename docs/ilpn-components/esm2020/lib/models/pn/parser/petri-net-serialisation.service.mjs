import { Injectable } from '@angular/core';
import { BlockType } from './block-type';
import { AbstractParser } from '../../../utility/abstract-parser';
import * as i0 from "@angular/core";
export class PetriNetSerialisationService {
    constructor() {
    }
    serialise(net) {
        return `${AbstractParser.TYPE_BLOCK} pn\n`
            + this.serialiseFrequency(net.frequency)
            + this.serialiseTransitions(net.getTransitions())
            + this.serialisePlaces(net.getPlaces())
            + this.serialiseArcs(net.getArcs());
    }
    serialiseFrequency(frequency) {
        if (frequency === undefined) {
            return '';
        }
        return `${BlockType.FREQUENCY} ${frequency}\n`;
    }
    serialiseTransitions(transitions) {
        let result = `${BlockType.TRANSITIONS}\n`;
        transitions.forEach(t => {
            result += `${this.removeSpaces(t.getId(), t.getId())} ${this.removeSpaces(t.label ?? '', t.getId())}\n`;
        });
        return result;
    }
    serialisePlaces(places) {
        let result = `${BlockType.PLACES}\n`;
        places.forEach(p => {
            result += `${this.removeSpaces(p.getId(), p.getId())} ${p.marking}\n`;
        });
        return result;
    }
    serialiseArcs(arcs) {
        let result = `${BlockType.ARCS}\n`;
        arcs.forEach(a => {
            result += `${this.removeSpaces(a.sourceId, a.getId())} ${this.removeSpaces(a.destinationId, a.getId())}`;
            if (a.weight > 1) {
                result += ` ${a.weight}`;
            }
            result += '\n';
        });
        return result;
    }
    removeSpaces(str, id) {
        if (str.includes(' ')) {
            console.warn(`Petri net element with id '${id}' contains a spaces in its definition! Replacing spaces with underscores, no uniqueness check is performed!`);
            return str.replace(/ /g, '_');
        }
        else {
            return str;
        }
    }
}
PetriNetSerialisationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetSerialisationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetSerialisationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetSerialisationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetSerialisationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LXNlcmlhbGlzYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9tb2RlbHMvcG4vcGFyc2VyL3BldHJpLW5ldC1zZXJpYWxpc2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUt6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQzs7QUFLaEUsTUFBTSxPQUFPLDRCQUE0QjtJQUVyQztJQUNBLENBQUM7SUFFTSxTQUFTLENBQUMsR0FBYTtRQUMxQixPQUFPLEdBQUcsY0FBYyxDQUFDLFVBQVUsT0FBTztjQUN4QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztjQUN0QyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO2NBQy9DLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2NBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVPLGtCQUFrQixDQUFDLFNBQTZCO1FBQ3BELElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUN6QixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBQ0QsT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFTLElBQUksU0FBUyxJQUFJLENBQUM7SUFDbkQsQ0FBQztJQUVPLG9CQUFvQixDQUFDLFdBQThCO1FBQ3ZELElBQUksTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLFdBQVcsSUFBSSxDQUFDO1FBQzFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQzVHLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLGVBQWUsQ0FBQyxNQUFvQjtRQUN4QyxJQUFJLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQztRQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLGFBQWEsQ0FBQyxJQUFnQjtRQUNsQyxJQUFJLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3pHLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzVCO1lBQ0QsTUFBTSxJQUFJLElBQUksQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTyxZQUFZLENBQUMsR0FBVyxFQUFFLEVBQVU7UUFDeEMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsOEJBQThCLEVBQUUsNkdBQTZHLENBQUMsQ0FBQTtZQUMzSixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ2pDO2FBQ0k7WUFDRCxPQUFPLEdBQUcsQ0FBQztTQUNkO0lBQ0wsQ0FBQzs7eUhBeERRLDRCQUE0Qjs2SEFBNUIsNEJBQTRCLGNBRnpCLE1BQU07MkZBRVQsNEJBQTRCO2tCQUh4QyxVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UGV0cmlOZXR9IGZyb20gJy4uL21vZGVsL3BldHJpLW5ldCc7XHJcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSAnLi4vbW9kZWwvdHJhbnNpdGlvbic7XHJcbmltcG9ydCB7UGxhY2V9IGZyb20gJy4uL21vZGVsL3BsYWNlJztcclxuaW1wb3J0IHtBcmN9IGZyb20gJy4uL21vZGVsL2FyYyc7XHJcbmltcG9ydCB7QmxvY2tUeXBlfSBmcm9tICcuL2Jsb2NrLXR5cGUnO1xyXG5pbXBvcnQge0Fic3RyYWN0UGFyc2VyfSBmcm9tICcuLi8uLi8uLi91dGlsaXR5L2Fic3RyYWN0LXBhcnNlcic7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFBldHJpTmV0U2VyaWFsaXNhdGlvblNlcnZpY2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXJpYWxpc2UobmV0OiBQZXRyaU5ldCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGAke0Fic3RyYWN0UGFyc2VyLlRZUEVfQkxPQ0t9IHBuXFxuYFxyXG4gICAgICAgICsgdGhpcy5zZXJpYWxpc2VGcmVxdWVuY3kobmV0LmZyZXF1ZW5jeSlcclxuICAgICAgICArIHRoaXMuc2VyaWFsaXNlVHJhbnNpdGlvbnMobmV0LmdldFRyYW5zaXRpb25zKCkpXHJcbiAgICAgICAgKyB0aGlzLnNlcmlhbGlzZVBsYWNlcyhuZXQuZ2V0UGxhY2VzKCkpXHJcbiAgICAgICAgKyB0aGlzLnNlcmlhbGlzZUFyY3MobmV0LmdldEFyY3MoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXJpYWxpc2VGcmVxdWVuY3koZnJlcXVlbmN5OiBudW1iZXIgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChmcmVxdWVuY3kgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBgJHtCbG9ja1R5cGUuRlJFUVVFTkNZfSAke2ZyZXF1ZW5jeX1cXG5gO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VyaWFsaXNlVHJhbnNpdGlvbnModHJhbnNpdGlvbnM6IEFycmF5PFRyYW5zaXRpb24+KTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gYCR7QmxvY2tUeXBlLlRSQU5TSVRJT05TfVxcbmA7XHJcbiAgICAgICAgdHJhbnNpdGlvbnMuZm9yRWFjaCh0ID0+IHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGAke3RoaXMucmVtb3ZlU3BhY2VzKHQuZ2V0SWQoKSwgdC5nZXRJZCgpKX0gJHt0aGlzLnJlbW92ZVNwYWNlcyh0LmxhYmVsID8/ICcnLCB0LmdldElkKCkpfVxcbmA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlcmlhbGlzZVBsYWNlcyhwbGFjZXM6IEFycmF5PFBsYWNlPik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGAke0Jsb2NrVHlwZS5QTEFDRVN9XFxuYDtcclxuICAgICAgICBwbGFjZXMuZm9yRWFjaChwID0+IHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGAke3RoaXMucmVtb3ZlU3BhY2VzKHAuZ2V0SWQoKSwgcC5nZXRJZCgpKX0gJHtwLm1hcmtpbmd9XFxuYDtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VyaWFsaXNlQXJjcyhhcmNzOiBBcnJheTxBcmM+KTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gYCR7QmxvY2tUeXBlLkFSQ1N9XFxuYDtcclxuICAgICAgICBhcmNzLmZvckVhY2goYSA9PiB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBgJHt0aGlzLnJlbW92ZVNwYWNlcyhhLnNvdXJjZUlkLCBhLmdldElkKCkpfSAke3RoaXMucmVtb3ZlU3BhY2VzKGEuZGVzdGluYXRpb25JZCwgYS5nZXRJZCgpKX1gO1xyXG4gICAgICAgICAgICBpZiAoYS53ZWlnaHQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gYCAke2Eud2VpZ2h0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdWx0ICs9ICdcXG4nO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVTcGFjZXMoc3RyOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChzdHIuaW5jbHVkZXMoJyAnKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFBldHJpIG5ldCBlbGVtZW50IHdpdGggaWQgJyR7aWR9JyBjb250YWlucyBhIHNwYWNlcyBpbiBpdHMgZGVmaW5pdGlvbiEgUmVwbGFjaW5nIHNwYWNlcyB3aXRoIHVuZGVyc2NvcmVzLCBubyB1bmlxdWVuZXNzIGNoZWNrIGlzIHBlcmZvcm1lZCFgKVxyXG4gICAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyAvZywgJ18nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==