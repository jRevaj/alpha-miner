import { Injectable } from '@angular/core';
import { OccurenceMatrixType, OccurrenceMatrix } from '../occurrence-matrix';
import { ConcurrencyRelation } from '../../../../models/concurrency/model/concurrency-relation';
import { LogCleaner } from '../../log-cleaner';
import { Relabeler } from '../../../../utility/relabeler';
import * as i0 from "@angular/core";
export class AlphaOracleService extends LogCleaner {
    constructor() {
        super();
    }
    determineConcurrency(log, config = {}) {
        if (log.length === 0) {
            return ConcurrencyRelation.noConcurrency();
        }
        const cleanedLog = this.cleanLog(log);
        const relabeler = new Relabeler();
        if (!!config.distinguishSameLabels) {
            relabeler.uniquelyRelabelSequences(cleanedLog);
        }
        else {
            relabeler.relabelSequencesPreserveNonUniqueIdentities(cleanedLog);
        }
        const matrix = this.computeOccurrenceMatrix(cleanedLog, config.lookAheadDistance, config.distinguishSameLabels ? OccurenceMatrixType.UNIQUE : OccurenceMatrixType.WILDCARD);
        return ConcurrencyRelation.fromOccurrenceMatrix(matrix, relabeler);
    }
    computeOccurrenceMatrix(log, lookAheadDistance = 1, matrixType = OccurenceMatrixType.UNIQUE, cleanLog = false) {
        const matrix = new OccurrenceMatrix(matrixType);
        if (cleanLog) {
            log = this.cleanLog(log);
        }
        for (const trace of log) {
            const prefix = [];
            for (const step of trace.eventNames) {
                if (prefix.length > lookAheadDistance) {
                    prefix.shift();
                }
                for (const e of prefix) {
                    matrix.add(e, step);
                }
                prefix.push(step);
            }
        }
        console.debug(matrix);
        return matrix;
    }
}
AlphaOracleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AlphaOracleService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AlphaOracleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AlphaOracleService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: AlphaOracleService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxwaGEtb3JhY2xlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9sb2cvY29uY3VycmVuY3ktb3JhY2xlL2FscGhhLW9yYWNsZS9hbHBoYS1vcmFjbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSXpDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzNFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDJEQUEyRCxDQUFDO0FBQzlGLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sK0JBQStCLENBQUM7O0FBTXhELE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxVQUFVO0lBRTlDO1FBQ0ksS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsb0JBQW9CLENBQUMsR0FBaUIsRUFBRSxTQUFtQyxFQUFFO1FBQ3pFLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEIsT0FBTyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUM5QztRQUVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUU7WUFDaEMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2xEO2FBQU07WUFDSCxTQUFTLENBQUMsMkNBQTJDLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckU7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQ3ZDLFVBQVUsRUFDVixNQUFNLENBQUMsaUJBQWlCLEVBQ3hCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQzNGLENBQUM7UUFFRixPQUFPLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU0sdUJBQXVCLENBQUMsR0FBaUIsRUFBRSxvQkFBNEIsQ0FBQyxFQUFFLGFBQWtDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxXQUFvQixLQUFLO1FBQ3BLLE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEQsSUFBSSxRQUFRLEVBQUU7WUFDVixHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1QjtRQUVELEtBQUssTUFBTSxLQUFLLElBQUksR0FBRyxFQUFFO1lBQ3JCLE1BQU0sTUFBTSxHQUFrQixFQUFFLENBQUM7WUFDakMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO2dCQUNqQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEVBQUU7b0JBQ25DLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDbEI7Z0JBQ0QsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLEVBQUU7b0JBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUN2QjtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JCO1NBQ0o7UUFFRCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7OytHQXBEUSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQUZmLE1BQU07MkZBRVQsa0JBQWtCO2tCQUg5QixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Q29uY3VycmVuY3lPcmFjbGV9IGZyb20gJy4uL2NvbmN1cnJlbmN5LW9yYWNsZSc7XHJcbmltcG9ydCB7VHJhY2V9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9sb2cvbW9kZWwvdHJhY2UnO1xyXG5pbXBvcnQge0FscGhhT3JhY2xlQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9hbHBoYS1vcmFjbGUtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7T2NjdXJlbmNlTWF0cml4VHlwZSwgT2NjdXJyZW5jZU1hdHJpeH0gZnJvbSAnLi4vb2NjdXJyZW5jZS1tYXRyaXgnO1xyXG5pbXBvcnQge0NvbmN1cnJlbmN5UmVsYXRpb259IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9jb25jdXJyZW5jeS9tb2RlbC9jb25jdXJyZW5jeS1yZWxhdGlvbic7XHJcbmltcG9ydCB7TG9nQ2xlYW5lcn0gZnJvbSAnLi4vLi4vbG9nLWNsZWFuZXInO1xyXG5pbXBvcnQge1JlbGFiZWxlcn0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbGl0eS9yZWxhYmVsZXInO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICAgIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQWxwaGFPcmFjbGVTZXJ2aWNlIGV4dGVuZHMgTG9nQ2xlYW5lciBpbXBsZW1lbnRzIENvbmN1cnJlbmN5T3JhY2xlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluZUNvbmN1cnJlbmN5KGxvZzogQXJyYXk8VHJhY2U+LCBjb25maWc6IEFscGhhT3JhY2xlQ29uZmlndXJhdGlvbiA9IHt9KTogQ29uY3VycmVuY3lSZWxhdGlvbiB7XHJcbiAgICAgICAgaWYgKGxvZy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvbmN1cnJlbmN5UmVsYXRpb24ubm9Db25jdXJyZW5jeSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xlYW5lZExvZyA9IHRoaXMuY2xlYW5Mb2cobG9nKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVsYWJlbGVyID0gbmV3IFJlbGFiZWxlcigpO1xyXG4gICAgICAgIGlmICghIWNvbmZpZy5kaXN0aW5ndWlzaFNhbWVMYWJlbHMpIHtcclxuICAgICAgICAgICAgcmVsYWJlbGVyLnVuaXF1ZWx5UmVsYWJlbFNlcXVlbmNlcyhjbGVhbmVkTG9nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWxhYmVsZXIucmVsYWJlbFNlcXVlbmNlc1ByZXNlcnZlTm9uVW5pcXVlSWRlbnRpdGllcyhjbGVhbmVkTG9nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IHRoaXMuY29tcHV0ZU9jY3VycmVuY2VNYXRyaXgoXHJcbiAgICAgICAgICAgIGNsZWFuZWRMb2csXHJcbiAgICAgICAgICAgIGNvbmZpZy5sb29rQWhlYWREaXN0YW5jZSxcclxuICAgICAgICAgICAgY29uZmlnLmRpc3Rpbmd1aXNoU2FtZUxhYmVscyA/IE9jY3VyZW5jZU1hdHJpeFR5cGUuVU5JUVVFIDogT2NjdXJlbmNlTWF0cml4VHlwZS5XSUxEQ0FSRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb25jdXJyZW5jeVJlbGF0aW9uLmZyb21PY2N1cnJlbmNlTWF0cml4KG1hdHJpeCwgcmVsYWJlbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29tcHV0ZU9jY3VycmVuY2VNYXRyaXgobG9nOiBBcnJheTxUcmFjZT4sIGxvb2tBaGVhZERpc3RhbmNlOiBudW1iZXIgPSAxLCBtYXRyaXhUeXBlOiBPY2N1cmVuY2VNYXRyaXhUeXBlID0gT2NjdXJlbmNlTWF0cml4VHlwZS5VTklRVUUsIGNsZWFuTG9nOiBib29sZWFuID0gZmFsc2UpOiBPY2N1cnJlbmNlTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgT2NjdXJyZW5jZU1hdHJpeChtYXRyaXhUeXBlKTtcclxuXHJcbiAgICAgICAgaWYgKGNsZWFuTG9nKSB7XHJcbiAgICAgICAgICAgIGxvZyA9IHRoaXMuY2xlYW5Mb2cobG9nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgdHJhY2Ugb2YgbG9nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeDogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHN0ZXAgb2YgdHJhY2UuZXZlbnROYW1lcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeC5sZW5ndGggPiBsb29rQWhlYWREaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBlIG9mIHByZWZpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeC5hZGQoZSwgc3RlcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcmVmaXgucHVzaChzdGVwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhtYXRyaXgpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWF0cml4O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==