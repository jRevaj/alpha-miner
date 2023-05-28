import { Injectable } from '@angular/core';
import { ConcurrencyRelation } from '../../../../models/concurrency/model/concurrency-relation';
import { Relabeler } from '../../../../utility/relabeler';
import { Lifecycle } from '../../../../models/log/model/lifecycle';
import { OccurenceMatrixType, OccurrenceMatrix } from '../occurrence-matrix';
import { cleanLog } from '../../clean-log';
import * as i0 from "@angular/core";
export class TimestampOracleService {
    determineConcurrency(log, config = {}) {
        if (log.length === 0) {
            return ConcurrencyRelation.noConcurrency();
        }
        log.forEach(t => {
            this.filterTraceAndPairStartCompleteEvents(t);
        });
        const relabeler = new Relabeler();
        if (config.distinguishSameLabels) {
            this.relabelPairedLog(log, relabeler);
        }
        else {
            relabeler.relabelSequencesPreserveNonUniqueIdentities(log);
        }
        const matrix = this.constructOccurrenceMatrix(log, !!config.distinguishSameLabels);
        return ConcurrencyRelation.fromOccurrenceMatrix(matrix, relabeler);
    }
    filterTraceAndPairStartCompleteEvents(trace) {
        const startedEvents = new Map();
        for (const e of trace.events) {
            switch (e.lifecycle) {
                case Lifecycle.START:
                    if (startedEvents.has(e.name)) {
                        throw new Error('TimestampOracle does not currently support auto-concurrency in the log!');
                    }
                    startedEvents.set(e.name, e);
                    break;
                case Lifecycle.COMPLETE:
                    if (startedEvents.has(e.name)) {
                        const pair = startedEvents.get(e.name);
                        e.setPairEvent(pair);
                        pair.setPairEvent(e);
                        startedEvents.delete(e.name);
                    }
                    break;
            }
        }
        if (startedEvents.size > 0) {
            // unpaired start events exist
            const unpaired = Array.from(startedEvents.values());
            trace.events = trace.events.filter(e => !unpaired.includes(e));
        }
    }
    relabelPairedLog(log, relabeler) {
        const filteredLog = cleanLog(log);
        relabeler.uniquelyRelabelSequences(filteredLog);
        for (const trace of filteredLog) {
            for (const event of trace.events) {
                const pair = event.getPairEvent();
                if (pair !== undefined) {
                    pair.name = event.name;
                }
            }
        }
    }
    constructOccurrenceMatrix(log, unique) {
        const matrix = new OccurrenceMatrix(unique ? OccurenceMatrixType.UNIQUE : OccurenceMatrixType.WILDCARD);
        for (const trace of log) {
            const startedEvents = new Set();
            for (const event of trace.events) {
                switch (event.lifecycle) {
                    case Lifecycle.START:
                        this.addAllInProgressToMatrix(event.name, startedEvents, matrix);
                        startedEvents.add(event.name);
                        break;
                    case Lifecycle.COMPLETE:
                        if (startedEvents.has(event.name)) {
                            startedEvents.delete(event.name);
                        }
                        else {
                            // standalone
                            this.addAllInProgressToMatrix(event.name, startedEvents, matrix);
                        }
                        break;
                }
            }
        }
        return matrix;
    }
    addAllInProgressToMatrix(started, inProgress, matrix) {
        for (const progress of inProgress) {
            matrix.add(started, progress);
            matrix.add(progress, started);
        }
    }
}
TimestampOracleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: TimestampOracleService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TimestampOracleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: TimestampOracleService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: TimestampOracleService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXN0YW1wLW9yYWNsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvbG9nL2NvbmN1cnJlbmN5LW9yYWNsZS90aW1lc3RhbXAtb3JhY2xlL3RpbWVzdGFtcC1vcmFjbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDJEQUEyRCxDQUFDO0FBQzlGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUV4RCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDakUsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFM0UsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQU16QyxNQUFNLE9BQU8sc0JBQXNCO0lBRS9CLG9CQUFvQixDQUFDLEdBQWlCLEVBQUUsU0FBdUMsRUFBRTtRQUM3RSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sbUJBQW1CLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDOUM7UUFFRCxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNsQyxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3pDO2FBQU07WUFDSCxT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LFNBQVMsQ0FBQyxLQUFLO3dCQUNoQixJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQ2pFLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUM5QixNQUFNO29CQUNWLEtBQUssU0FBUyxDQUFDLFFBQVE7d0JBQ25CLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7NEJBQy9CLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3lCQUNwQzs2QkFBTTs0QkFDSCxhQUFhOzRCQUNiLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQzt5QkFDcEU7d0JBQ0QsTUFBTTtpQkFDYjthQUNKO1NBQ0o7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRVMsd0JBQXdCLENBQUMsT0FBZSxFQUFFLFVBQXVCLEVBQUUsTUFBd0I7UUFDakcsS0FBSyxNQUFNLFFBQVEsSUFBSSxVQUFVLEVBQUU7WUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDOzttSEEvRlEsc0JBQXNCO3VIQUF0QixzQkFBc0IsY0FGbkIsTUFBTTsyRkFFVCxzQkFBc0I7a0JBSGxDLFVBQVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtDb25jdXJyZW5jeU9yYWNsZX0gZnJvbSAnLi4vY29uY3VycmVuY3ktb3JhY2xlJztcclxuaW1wb3J0IHtUcmFjZX0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL2xvZy9tb2RlbC90cmFjZSc7XHJcbmltcG9ydCB7Q29uY3VycmVuY3lSZWxhdGlvbn0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL2NvbmN1cnJlbmN5L21vZGVsL2NvbmN1cnJlbmN5LXJlbGF0aW9uJztcclxuaW1wb3J0IHtSZWxhYmVsZXJ9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxpdHkvcmVsYWJlbGVyJztcclxuaW1wb3J0IHtMb2dFdmVudH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWxzL2xvZy9tb2RlbC9sb2dFdmVudCc7XHJcbmltcG9ydCB7TGlmZWN5Y2xlfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbHMvbG9nL21vZGVsL2xpZmVjeWNsZSc7XHJcbmltcG9ydCB7T2NjdXJlbmNlTWF0cml4VHlwZSwgT2NjdXJyZW5jZU1hdHJpeH0gZnJvbSAnLi4vb2NjdXJyZW5jZS1tYXRyaXgnO1xyXG5pbXBvcnQge1RpbWVzdGFtcE9yYWNsZUNvbmZpZ3VyYXRpb259IGZyb20gJy4vdGltZXN0YW1wLW9yYWNsZS1jb25maWd1cmF0aW9uJztcclxuaW1wb3J0IHtjbGVhbkxvZ30gZnJvbSAnLi4vLi4vY2xlYW4tbG9nJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFRpbWVzdGFtcE9yYWNsZVNlcnZpY2UgaW1wbGVtZW50cyBDb25jdXJyZW5jeU9yYWNsZSB7XHJcblxyXG4gICAgZGV0ZXJtaW5lQ29uY3VycmVuY3kobG9nOiBBcnJheTxUcmFjZT4sIGNvbmZpZzogVGltZXN0YW1wT3JhY2xlQ29uZmlndXJhdGlvbiA9IHt9KTogQ29uY3VycmVuY3lSZWxhdGlvbiB7XHJcbiAgICAgICAgaWYgKGxvZy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvbmN1cnJlbmN5UmVsYXRpb24ubm9Db25jdXJyZW5jeSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9nLmZvckVhY2godCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyVHJhY2VBbmRQYWlyU3RhcnRDb21wbGV0ZUV2ZW50cyh0KTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zdCByZWxhYmVsZXIgPSBuZXcgUmVsYWJlbGVyKCk7XHJcbiAgICAgICAgaWYgKGNvbmZpZy5kaXN0aW5ndWlzaFNhbWVMYWJlbHMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWxhYmVsUGFpcmVkTG9nKGxvZywgcmVsYWJlbGVyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWxhYmVsZXIucmVsYWJlbFNlcXVlbmNlc1ByZXNlcnZlTm9uVW5pcXVlSWRlbnRpdGllcyhsb2cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWF0cml4ID0gdGhpcy5jb25zdHJ1Y3RPY2N1cnJlbmNlTWF0cml4KGxvZywgISFjb25maWcuZGlzdGluZ3Vpc2hTYW1lTGFiZWxzKTtcclxuICAgICAgICByZXR1cm4gQ29uY3VycmVuY3lSZWxhdGlvbi5mcm9tT2NjdXJyZW5jZU1hdHJpeChtYXRyaXgsIHJlbGFiZWxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGZpbHRlclRyYWNlQW5kUGFpclN0YXJ0Q29tcGxldGVFdmVudHModHJhY2U6IFRyYWNlKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRlZEV2ZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBMb2dFdmVudD4oKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBlIG9mIHRyYWNlLmV2ZW50cykge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGUubGlmZWN5Y2xlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIExpZmVjeWNsZS5TVEFSVDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRlZEV2ZW50cy5oYXMoZS5uYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RpbWVzdGFtcE9yYWNsZSBkb2VzIG5vdCBjdXJyZW50bHkgc3VwcG9ydCBhdXRvLWNvbmN1cnJlbmN5IGluIHRoZSBsb2chJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ZWRFdmVudHMuc2V0KGUubmFtZSwgZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIExpZmVjeWNsZS5DT01QTEVURTpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRlZEV2ZW50cy5oYXMoZS5uYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWlyID0gc3RhcnRlZEV2ZW50cy5nZXQoZS5uYW1lKSE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc2V0UGFpckV2ZW50KHBhaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWlyLnNldFBhaXJFdmVudChlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRlZEV2ZW50cy5kZWxldGUoZS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdGFydGVkRXZlbnRzLnNpemUgPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIHVucGFpcmVkIHN0YXJ0IGV2ZW50cyBleGlzdFxyXG4gICAgICAgICAgICBjb25zdCB1bnBhaXJlZCA9IEFycmF5LmZyb20oc3RhcnRlZEV2ZW50cy52YWx1ZXMoKSk7XHJcbiAgICAgICAgICAgIHRyYWNlLmV2ZW50cyA9IHRyYWNlLmV2ZW50cy5maWx0ZXIoZSA9PiAhdW5wYWlyZWQuaW5jbHVkZXMoZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVsYWJlbFBhaXJlZExvZyhsb2c6IEFycmF5PFRyYWNlPiwgcmVsYWJlbGVyOiBSZWxhYmVsZXIpIHtcclxuICAgICAgICBjb25zdCBmaWx0ZXJlZExvZyA9IGNsZWFuTG9nKGxvZyk7XHJcbiAgICAgICAgcmVsYWJlbGVyLnVuaXF1ZWx5UmVsYWJlbFNlcXVlbmNlcyhmaWx0ZXJlZExvZyk7XHJcbiAgICAgICAgZm9yIChjb25zdCB0cmFjZSBvZiBmaWx0ZXJlZExvZykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIHRyYWNlLmV2ZW50cykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFpciA9IGV2ZW50LmdldFBhaXJFdmVudCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhaXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhaXIubmFtZSA9IGV2ZW50Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdE9jY3VycmVuY2VNYXRyaXgobG9nOiBBcnJheTxUcmFjZT4sIHVuaXF1ZTogYm9vbGVhbik6IE9jY3VycmVuY2VNYXRyaXgge1xyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBPY2N1cnJlbmNlTWF0cml4KHVuaXF1ZSA/IE9jY3VyZW5jZU1hdHJpeFR5cGUuVU5JUVVFIDogT2NjdXJlbmNlTWF0cml4VHlwZS5XSUxEQ0FSRCk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdHJhY2Ugb2YgbG9nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ZWRFdmVudHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiB0cmFjZS5ldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQubGlmZWN5Y2xlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBMaWZlY3ljbGUuU1RBUlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQWxsSW5Qcm9ncmVzc1RvTWF0cml4KGV2ZW50Lm5hbWUsIHN0YXJ0ZWRFdmVudHMsIG1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ZWRFdmVudHMuYWRkKGV2ZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIExpZmVjeWNsZS5DT01QTEVURTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0ZWRFdmVudHMuaGFzKGV2ZW50Lm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydGVkRXZlbnRzLmRlbGV0ZShldmVudC5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0YW5kYWxvbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQWxsSW5Qcm9ncmVzc1RvTWF0cml4KGV2ZW50Lm5hbWUsIHN0YXJ0ZWRFdmVudHMsIG1hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGFkZEFsbEluUHJvZ3Jlc3NUb01hdHJpeChzdGFydGVkOiBzdHJpbmcsIGluUHJvZ3Jlc3M6IFNldDxzdHJpbmc+LCBtYXRyaXg6IE9jY3VycmVuY2VNYXRyaXgpOiB2b2lkIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHByb2dyZXNzIG9mIGluUHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgbWF0cml4LmFkZChzdGFydGVkLCBwcm9ncmVzcyk7XHJcbiAgICAgICAgICAgIG1hdHJpeC5hZGQocHJvZ3Jlc3MsIHN0YXJ0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=