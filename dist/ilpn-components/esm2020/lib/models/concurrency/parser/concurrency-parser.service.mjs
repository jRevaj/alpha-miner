import { Injectable } from '@angular/core';
import { ConcurrencyRelation } from '../model/concurrency-relation';
import { AbstractParser } from '../../../utility/abstract-parser';
import * as i0 from "@angular/core";
export class ConcurrencyParserService extends AbstractParser {
    constructor() {
        super('concurrency');
    }
    processFileLines(lines) {
        const result = ConcurrencyRelation.noConcurrency();
        const relabeler = result.relabeler;
        for (const line of lines) {
            if (line.trimEnd().length === 0) {
                continue;
            }
            const match = line.match(ConcurrencyParserService.LINE_REGEX);
            if (match === null) {
                console.debug(line);
                console.debug('line could not be matched with regex');
                continue;
            }
            const eventA = this.getUniqueLabel(match[1], parseInt(match[2]), relabeler);
            const eventB = this.getUniqueLabel(match[3], parseInt(match[4]), relabeler);
            if (!eventA.isWildcard && !eventB.isWildcard) {
                result.setUniqueConcurrent(eventA.label, eventB.label);
            }
            else if (eventA.isWildcard && eventB.isWildcard) {
                result.setWildcardConcurrent(eventA.label, eventB.label);
            }
            else if (eventA.isWildcard && !eventB.isWildcard) {
                result.setMixedConcurrent(eventA.label, eventB.label);
            }
            else {
                result.setMixedConcurrent(eventB.label, eventA.label);
            }
        }
        relabeler.restartSequence();
        return result;
    }
    getUniqueLabel(label, oneBasedOrder, relabeler) {
        if (isNaN(oneBasedOrder)) {
            return {
                isWildcard: true,
                label
            };
        }
        const storedOrder = relabeler.getLabelOrder().get(label);
        const storedLabel = storedOrder?.[oneBasedOrder - 1];
        if (storedLabel !== undefined) {
            return {
                label: storedLabel
            };
        }
        let missingCount;
        if (storedOrder === undefined) {
            missingCount = oneBasedOrder;
        }
        else {
            missingCount = oneBasedOrder - storedOrder.length;
        }
        let missingLabel;
        for (let i = 0; i < missingCount; i++) {
            missingLabel = relabeler.getNewUniqueLabel(label);
        }
        return {
            label: missingLabel
        };
    }
}
ConcurrencyParserService.LINE_REGEX = /^(.+?)(?:\[([1-9]\d*)\])?(?:\|\||∥)(.+?)(?:\[([1-9]\d*)\])?(?: #\d+ \d+)?$/;
ConcurrencyParserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencyParserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ConcurrencyParserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencyParserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ConcurrencyParserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY3VycmVuY3ktcGFyc2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvbW9kZWxzL2NvbmN1cnJlbmN5L3BhcnNlci9jb25jdXJyZW5jeS1wYXJzZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQzs7QUFhaEUsTUFBTSxPQUFPLHdCQUF5QixTQUFRLGNBQW1DO0lBSTdFO1FBQ0ksS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFUyxnQkFBZ0IsQ0FBQyxLQUFvQjtRQUMzQyxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBRW5DLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzdCLFNBQVM7YUFDWjtZQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUQsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO2dCQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7Z0JBQ3RELFNBQVM7YUFDWjtZQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1RSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFNUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO2dCQUMxQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDMUQ7aUJBQU0sSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7Z0JBQy9DLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM1RDtpQkFBTSxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO2dCQUNoRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekQ7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3pEO1NBQ0o7UUFFRCxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDNUIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVTLGNBQWMsQ0FBQyxLQUFhLEVBQUUsYUFBcUIsRUFBRSxTQUFvQjtRQUMvRSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN0QixPQUFPO2dCQUNILFVBQVUsRUFBRSxJQUFJO2dCQUNoQixLQUFLO2FBQ1IsQ0FBQztTQUNMO1FBRUQsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RCxNQUFNLFdBQVcsR0FBRyxXQUFXLEVBQUUsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzNCLE9BQU87Z0JBQ0gsS0FBSyxFQUFFLFdBQVc7YUFDckIsQ0FBQztTQUNMO1FBRUQsSUFBSSxZQUFZLENBQUM7UUFDakIsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzNCLFlBQVksR0FBRyxhQUFhLENBQUM7U0FDaEM7YUFBTTtZQUNILFlBQVksR0FBRyxhQUFhLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztTQUNyRDtRQUVELElBQUksWUFBb0IsQ0FBQztRQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLFlBQVksR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDckQ7UUFFRCxPQUFPO1lBQ0gsS0FBSyxFQUFFLFlBQWE7U0FDdkIsQ0FBQztJQUNOLENBQUM7O0FBdkVnQixtQ0FBVSxHQUFHLDRFQUE2RSxDQUFBO3FIQUZsRyx3QkFBd0I7eUhBQXhCLHdCQUF3QixjQUZyQixNQUFNOzJGQUVULHdCQUF3QjtrQkFIcEMsVUFBVTttQkFBQztvQkFDUixVQUFVLEVBQUUsTUFBTTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0NvbmN1cnJlbmN5UmVsYXRpb259IGZyb20gJy4uL21vZGVsL2NvbmN1cnJlbmN5LXJlbGF0aW9uJztcclxuaW1wb3J0IHtBYnN0cmFjdFBhcnNlcn0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0eS9hYnN0cmFjdC1wYXJzZXInO1xyXG5pbXBvcnQge1JlbGFiZWxlcn0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0eS9yZWxhYmVsZXInO1xyXG5cclxuXHJcbmludGVyZmFjZSBSZWxhYmVsaW5nUmVzdWx0IHtcclxuICAgIGlzV2lsZGNhcmQ/OiBib29sZWFuO1xyXG4gICAgbGFiZWw6IHN0cmluZztcclxufVxyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29uY3VycmVuY3lQYXJzZXJTZXJ2aWNlIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXI8Q29uY3VycmVuY3lSZWxhdGlvbj4ge1xyXG5cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgTElORV9SRUdFWCA9IC9eKC4rPykoPzpcXFsoWzEtOV1cXGQqKVxcXSk/KD86XFx8XFx8fOKIpSkoLis/KSg/OlxcWyhbMS05XVxcZCopXFxdKT8oPzogI1xcZCsgXFxkKyk/JC87XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoJ2NvbmN1cnJlbmN5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb2Nlc3NGaWxlTGluZXMobGluZXM6IEFycmF5PHN0cmluZz4pOiBDb25jdXJyZW5jeVJlbGF0aW9uIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBDb25jdXJyZW5jeVJlbGF0aW9uLm5vQ29uY3VycmVuY3koKTtcclxuICAgICAgICBjb25zdCByZWxhYmVsZXIgPSByZXN1bHQucmVsYWJlbGVyO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgICAgICAgaWYgKGxpbmUudHJpbUVuZCgpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaChDb25jdXJyZW5jeVBhcnNlclNlcnZpY2UuTElORV9SRUdFWCk7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhsaW5lKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2xpbmUgY291bGQgbm90IGJlIG1hdGNoZWQgd2l0aCByZWdleCcpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50QSA9IHRoaXMuZ2V0VW5pcXVlTGFiZWwobWF0Y2hbMV0sIHBhcnNlSW50KG1hdGNoWzJdKSwgcmVsYWJlbGVyKTtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnRCID0gdGhpcy5nZXRVbmlxdWVMYWJlbChtYXRjaFszXSwgcGFyc2VJbnQobWF0Y2hbNF0pLCByZWxhYmVsZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFldmVudEEuaXNXaWxkY2FyZCAmJiAhZXZlbnRCLmlzV2lsZGNhcmQpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5zZXRVbmlxdWVDb25jdXJyZW50KGV2ZW50QS5sYWJlbCwgZXZlbnRCLmxhYmVsKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudEEuaXNXaWxkY2FyZCAmJiBldmVudEIuaXNXaWxkY2FyZCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnNldFdpbGRjYXJkQ29uY3VycmVudChldmVudEEubGFiZWwsIGV2ZW50Qi5sYWJlbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnRBLmlzV2lsZGNhcmQgJiYgIWV2ZW50Qi5pc1dpbGRjYXJkKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuc2V0TWl4ZWRDb25jdXJyZW50KGV2ZW50QS5sYWJlbCwgZXZlbnRCLmxhYmVsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5zZXRNaXhlZENvbmN1cnJlbnQoZXZlbnRCLmxhYmVsLCBldmVudEEubGFiZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWxhYmVsZXIucmVzdGFydFNlcXVlbmNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0VW5pcXVlTGFiZWwobGFiZWw6IHN0cmluZywgb25lQmFzZWRPcmRlcjogbnVtYmVyLCByZWxhYmVsZXI6IFJlbGFiZWxlcik6IFJlbGFiZWxpbmdSZXN1bHQge1xyXG4gICAgICAgIGlmIChpc05hTihvbmVCYXNlZE9yZGVyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaXNXaWxkY2FyZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGxhYmVsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdG9yZWRPcmRlciA9IHJlbGFiZWxlci5nZXRMYWJlbE9yZGVyKCkuZ2V0KGxhYmVsKTtcclxuICAgICAgICBjb25zdCBzdG9yZWRMYWJlbCA9IHN0b3JlZE9yZGVyPy5bb25lQmFzZWRPcmRlciAtIDFdO1xyXG4gICAgICAgIGlmIChzdG9yZWRMYWJlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogc3RvcmVkTGFiZWxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtaXNzaW5nQ291bnQ7XHJcbiAgICAgICAgaWYgKHN0b3JlZE9yZGVyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbWlzc2luZ0NvdW50ID0gb25lQmFzZWRPcmRlcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtaXNzaW5nQ291bnQgPSBvbmVCYXNlZE9yZGVyIC0gc3RvcmVkT3JkZXIubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG1pc3NpbmdMYWJlbDogc3RyaW5nO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWlzc2luZ0NvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgbWlzc2luZ0xhYmVsID0gcmVsYWJlbGVyLmdldE5ld1VuaXF1ZUxhYmVsKGxhYmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBtaXNzaW5nTGFiZWwhXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iXX0=