import { Injectable } from '@angular/core';
import { Trace } from '../model/trace';
import { LogEvent } from '../model/logEvent';
import * as i0 from "@angular/core";
export class XesLogParserService {
    constructor() {
    }
    parse(text) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        return this.parseTraces(xml.getElementsByTagName('trace'));
    }
    parseTraces(traceElements) {
        const result = [];
        for (let i = 0; i < traceElements.length; i++) {
            result.push(this.parseTrace(traceElements.item(i)));
        }
        return result;
    }
    parseTrace(element) {
        const trace = this.createTrace(element.querySelectorAll('trace > string'));
        const events = element.getElementsByTagName("event");
        for (let i = 0; i < events.length; i++) {
            trace.appendEvent(this.parseEvent(events.item(i)));
        }
        return trace;
    }
    createTrace(traceAttributes) {
        const trace = new Trace();
        const attributes = this.parseKeyValue(traceAttributes);
        this.setIfPresent('concept:name', attributes, name => {
            trace.name = name;
        });
        this.setIfPresent('description', attributes, description => {
            trace.description = description;
        });
        for (const key of attributes.keys()) {
            console.debug(`unknown xml attribute key '${key}'`, traceAttributes);
        }
        return trace;
    }
    parseEvent(element) {
        const stringAttributes = this.parseKeyValue(element.getElementsByTagName('string'));
        const name = this.getAndRemove('concept:name', stringAttributes);
        if (name === undefined) {
            console.debug(element);
            throw new Error(`Event name is not defined!`);
        }
        const event = new LogEvent(name);
        this.setIfPresent('org:resource', stringAttributes, resource => {
            event.resource = resource;
        });
        this.setIfPresent('lifecycle:transition', stringAttributes, lifecycle => {
            event.lifecycle = lifecycle;
        });
        for (const [key, value] of stringAttributes.entries()) {
            event.setAttribute(key, value);
        }
        const dateAttributes = this.parseKeyValue(element.getElementsByTagName('date'));
        this.setIfPresent('time:timestamp', dateAttributes, timestamp => {
            event.timestamp = new Date(timestamp);
        });
        for (const [key, value] of dateAttributes.entries()) {
            event.setAttribute(key, value);
        }
        return event;
    }
    parseKeyValue(attributes) {
        const result = new Map();
        for (let i = 0; i < attributes.length; i++) {
            const element = attributes.item(i);
            const elementAttributes = element.attributes;
            const valueAttribute = elementAttributes.getNamedItem('value');
            if (valueAttribute === null) {
                console.debug(`xml element has no attribute 'value'`, element);
                continue;
            }
            const value = valueAttribute.value;
            const keyAttribute = elementAttributes.getNamedItem('key');
            if (keyAttribute === null) {
                console.debug(`xml element has no attribute 'key'`, element);
                continue;
            }
            const key = keyAttribute.value;
            result.set(key, value);
        }
        return result;
    }
    getAndRemove(key, map) {
        const result = map.get(key);
        map.delete(key);
        return result;
    }
    setIfPresent(key, map, setter) {
        const value = this.getAndRemove(key, map);
        if (value !== undefined) {
            setter(value);
        }
    }
}
XesLogParserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: XesLogParserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
XesLogParserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: XesLogParserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: XesLogParserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGVzLWxvZy1wYXJzZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9tb2RlbHMvbG9nL3BhcnNlci94ZXMtbG9nLXBhcnNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3JDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQzs7QUFNM0MsTUFBTSxPQUFPLG1CQUFtQjtJQUU1QjtJQUNBLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBWTtRQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDL0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFckQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTyxXQUFXLENBQUMsYUFBd0M7UUFDeEQsTUFBTSxNQUFNLEdBQWlCLEVBQUUsQ0FBQztRQUVoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU8sVUFBVSxDQUFDLE9BQWdCO1FBQy9CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxD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RyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLFlBQVksQ0FBQyxHQUFXLEVBQUUsR0FBd0IsRUFBRSxNQUEyQjtRQUNuRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQzs7Z0hBN0hRLG1CQUFtQjtvSEFBbkIsbUJBQW1CLGNBRmhCLE1BQU07MkZBRVQsbUJBQW1CO2tCQUgvQixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7VHJhY2V9IGZyb20gJy4uL21vZGVsL3RyYWNlJztcclxuaW1wb3J0IHtMb2dFdmVudH0gZnJvbSAnLi4vbW9kZWwvbG9nRXZlbnQnO1xyXG5pbXBvcnQge0xpZmVjeWNsZX0gZnJvbSAnLi4vbW9kZWwvbGlmZWN5Y2xlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgWGVzTG9nUGFyc2VyU2VydmljZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyc2UodGV4dDogc3RyaW5nKTogQXJyYXk8VHJhY2U+IHtcclxuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICAgICAgY29uc3QgeG1sID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCBcInRleHQveG1sXCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVRyYWNlcyh4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RyYWNlJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VUcmFjZXModHJhY2VFbGVtZW50czogSFRNTENvbGxlY3Rpb25PZjxFbGVtZW50Pik6IEFycmF5PFRyYWNlPiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBBcnJheTxUcmFjZT4gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFjZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMucGFyc2VUcmFjZSh0cmFjZUVsZW1lbnRzLml0ZW0oaSkhKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VUcmFjZShlbGVtZW50OiBFbGVtZW50KTogVHJhY2Uge1xyXG4gICAgICAgIGNvbnN0IHRyYWNlID0gdGhpcy5jcmVhdGVUcmFjZShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3RyYWNlID4gc3RyaW5nJykpO1xyXG5cclxuICAgICAgICBjb25zdCBldmVudHMgPSBlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZXZlbnRcIik7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdHJhY2UuYXBwZW5kRXZlbnQodGhpcy5wYXJzZUV2ZW50KGV2ZW50cy5pdGVtKGkpISkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYWNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVHJhY2UodHJhY2VBdHRyaWJ1dGVzOiBOb2RlTGlzdE9mPEVsZW1lbnQ+KTogVHJhY2Uge1xyXG4gICAgICAgIGNvbnN0IHRyYWNlID0gbmV3IFRyYWNlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLnBhcnNlS2V5VmFsdWUodHJhY2VBdHRyaWJ1dGVzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJZlByZXNlbnQoJ2NvbmNlcHQ6bmFtZScsIGF0dHJpYnV0ZXMsIG5hbWUgPT4ge1xyXG4gICAgICAgICAgICB0cmFjZS5uYW1lID0gbmFtZTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLnNldElmUHJlc2VudCgnZGVzY3JpcHRpb24nLCBhdHRyaWJ1dGVzLCBkZXNjcmlwdGlvbiA9PiB7XHJcbiAgICAgICAgICAgIHRyYWNlLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGF0dHJpYnV0ZXMua2V5cygpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYHVua25vd24geG1sIGF0dHJpYnV0ZSBrZXkgJyR7a2V5fSdgLCB0cmFjZUF0dHJpYnV0ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYWNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VFdmVudChlbGVtZW50OiBFbGVtZW50KTogTG9nRXZlbnQge1xyXG4gICAgICAgIGNvbnN0IHN0cmluZ0F0dHJpYnV0ZXMgPSB0aGlzLnBhcnNlS2V5VmFsdWUoZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3RyaW5nJykpO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5nZXRBbmRSZW1vdmUoJ2NvbmNlcHQ6bmFtZScsIHN0cmluZ0F0dHJpYnV0ZXMpO1xyXG4gICAgICAgIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhlbGVtZW50KTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFdmVudCBuYW1lIGlzIG5vdCBkZWZpbmVkIWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgTG9nRXZlbnQobmFtZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0SWZQcmVzZW50KCdvcmc6cmVzb3VyY2UnLCBzdHJpbmdBdHRyaWJ1dGVzLCByZXNvdXJjZSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnJlc291cmNlID0gcmVzb3VyY2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZXRJZlByZXNlbnQoJ2xpZmVjeWNsZTp0cmFuc2l0aW9uJywgc3RyaW5nQXR0cmlidXRlcywgbGlmZWN5Y2xlID0+IHtcclxuICAgICAgICAgICAgZXZlbnQubGlmZWN5Y2xlID0gbGlmZWN5Y2xlIGFzIExpZmVjeWNsZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIHN0cmluZ0F0dHJpYnV0ZXMuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGVBdHRyaWJ1dGVzID0gdGhpcy5wYXJzZUtleVZhbHVlKGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RhdGUnKSk7XHJcbiAgICAgICAgdGhpcy5zZXRJZlByZXNlbnQoJ3RpbWU6dGltZXN0YW1wJywgZGF0ZUF0dHJpYnV0ZXMsIHRpbWVzdGFtcCA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50LnRpbWVzdGFtcCA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZGF0ZUF0dHJpYnV0ZXMuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBldmVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlS2V5VmFsdWUoYXR0cmlidXRlczogSFRNTENvbGxlY3Rpb25PZjxFbGVtZW50PiB8IE5vZGVMaXN0T2Y8RWxlbWVudD4pOiBNYXA8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGF0dHJpYnV0ZXMuaXRlbShpKSE7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmFsdWVBdHRyaWJ1dGUgPSBlbGVtZW50QXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ3ZhbHVlJyk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZUF0dHJpYnV0ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgeG1sIGVsZW1lbnQgaGFzIG5vIGF0dHJpYnV0ZSAndmFsdWUnYCwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZUF0dHJpYnV0ZS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGtleUF0dHJpYnV0ZSA9IGVsZW1lbnRBdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgna2V5Jyk7XHJcbiAgICAgICAgICAgIGlmIChrZXlBdHRyaWJ1dGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYHhtbCBlbGVtZW50IGhhcyBubyBhdHRyaWJ1dGUgJ2tleSdgLCBlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlBdHRyaWJ1dGUudmFsdWU7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEFuZFJlbW92ZShrZXk6IHN0cmluZywgbWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBtYXAuZ2V0KGtleSk7XHJcbiAgICAgICAgbWFwLmRlbGV0ZShrZXkpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJZlByZXNlbnQoa2V5OiBzdHJpbmcsIG1hcDogTWFwPHN0cmluZywgc3RyaW5nPiwgc2V0dGVyOiAodjogc3RyaW5nKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldEFuZFJlbW92ZShrZXksIG1hcCk7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc2V0dGVyKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19