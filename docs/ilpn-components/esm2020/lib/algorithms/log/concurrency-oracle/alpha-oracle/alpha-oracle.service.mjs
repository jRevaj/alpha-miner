import { Injectable } from '@angular/core';
import { OccurenceMatrixType, OccurrenceMatrix } from '../occurrence-matrix';
import { ConcurrencyRelation } from '../../../../models/concurrency/model/concurrency-relation';
import { Relabeler } from '../../../../utility/relabeler';
import { cleanLog } from '../../clean-log';
import * as i0 from "@angular/core";
export class AlphaOracleService {
    determineConcurrency(log, config = {}) {
        if (log.length === 0) {
            return ConcurrencyRelation.noConcurrency();
        }
        const cleanedLog = cleanLog(log);
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
    computeOccurrenceMatrix(log, lookAheadDistance = 1, matrixType = OccurenceMatrixType.UNIQUE, shouldCleanLog = false) {
        const matrix = new OccurrenceMatrix(matrixType);
        if (shouldCleanLog) {
            log = cleanLog(log);
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
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxwaGEtb3JhY2xlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb21wb25lbnRzL3NyYy9saWIvYWxnb3JpdGhtcy9sb2cvY29uY3VycmVuY3ktb3JhY2xlL2FscGhhLW9yYWNsZS9hbHBoYS1vcmFjbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSXpDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzNFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDJEQUEyRCxDQUFDO0FBQzlGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7O0FBTXpDLE1BQU0sT0FBTyxrQkFBa0I7SUFFM0Isb0JBQW9CLENBQUMsR0FBaUIsRUFBRSxTQUFtQyxFQUFFO1FBQ3pFLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEIsT0FBTyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUM5QztRQUVELE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQyxNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRTtZQUNoQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNILFNBQVMsQ0FBQywyQ0FBMkMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyRTtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FDdkMsVUFBVSxFQUNWLE1BQU0sQ0FBQyxpQkFBaUIsRUFDeEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FDM0YsQ0FBQztRQUVGLE9BQU8sbUJBQW1CLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFTSx1QkFBdUIsQ0FBQyxHQUFpQixFQUFFLG9CQUE0QixDQUFDLEVBQUUsYUFBa0MsbUJBQW1CLENBQUMsTUFBTSxFQUFFLGlCQUEwQixLQUFLO1FBQzFLLE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEQsSUFBSSxjQUFjLEVBQUU7WUFDaEIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN2QjtRQUVELEtBQUssTUFBTSxLQUFLLElBQUksR0FBRyxFQUFFO1lBQ3JCLE1BQU0sTUFBTSxHQUFrQixFQUFFLENBQUM7WUFDakMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO2dCQUNqQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEVBQUU7b0JBQ25DLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDbEI7Z0JBQ0QsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLEVBQUU7b0JBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUN2QjtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JCO1NBQ0o7UUFFRCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7OytHQWhEUSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQUZmLE1BQU07MkZBRVQsa0JBQWtCO2tCQUg5QixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Q29uY3VycmVuY3lPcmFjbGV9IGZyb20gJy4uL2NvbmN1cnJlbmN5LW9yYWNsZSc7XHJcbmltcG9ydCB7VHJhY2V9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9sb2cvbW9kZWwvdHJhY2UnO1xyXG5pbXBvcnQge0FscGhhT3JhY2xlQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9hbHBoYS1vcmFjbGUtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7T2NjdXJlbmNlTWF0cml4VHlwZSwgT2NjdXJyZW5jZU1hdHJpeH0gZnJvbSAnLi4vb2NjdXJyZW5jZS1tYXRyaXgnO1xyXG5pbXBvcnQge0NvbmN1cnJlbmN5UmVsYXRpb259IGZyb20gJy4uLy4uLy4uLy4uL21vZGVscy9jb25jdXJyZW5jeS9tb2RlbC9jb25jdXJyZW5jeS1yZWxhdGlvbic7XHJcbmltcG9ydCB7UmVsYWJlbGVyfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsaXR5L3JlbGFiZWxlcic7XHJcbmltcG9ydCB7Y2xlYW5Mb2d9IGZyb20gJy4uLy4uL2NsZWFuLWxvZyc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbHBoYU9yYWNsZVNlcnZpY2UgaW1wbGVtZW50cyBDb25jdXJyZW5jeU9yYWNsZSB7XHJcblxyXG4gICAgZGV0ZXJtaW5lQ29uY3VycmVuY3kobG9nOiBBcnJheTxUcmFjZT4sIGNvbmZpZzogQWxwaGFPcmFjbGVDb25maWd1cmF0aW9uID0ge30pOiBDb25jdXJyZW5jeVJlbGF0aW9uIHtcclxuICAgICAgICBpZiAobG9nLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29uY3VycmVuY3lSZWxhdGlvbi5ub0NvbmN1cnJlbmN5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjbGVhbmVkTG9nID0gY2xlYW5Mb2cobG9nKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVsYWJlbGVyID0gbmV3IFJlbGFiZWxlcigpO1xyXG4gICAgICAgIGlmICghIWNvbmZpZy5kaXN0aW5ndWlzaFNhbWVMYWJlbHMpIHtcclxuICAgICAgICAgICAgcmVsYWJlbGVyLnVuaXF1ZWx5UmVsYWJlbFNlcXVlbmNlcyhjbGVhbmVkTG9nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWxhYmVsZXIucmVsYWJlbFNlcXVlbmNlc1ByZXNlcnZlTm9uVW5pcXVlSWRlbnRpdGllcyhjbGVhbmVkTG9nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IHRoaXMuY29tcHV0ZU9jY3VycmVuY2VNYXRyaXgoXHJcbiAgICAgICAgICAgIGNsZWFuZWRMb2csXHJcbiAgICAgICAgICAgIGNvbmZpZy5sb29rQWhlYWREaXN0YW5jZSxcclxuICAgICAgICAgICAgY29uZmlnLmRpc3Rpbmd1aXNoU2FtZUxhYmVscyA/IE9jY3VyZW5jZU1hdHJpeFR5cGUuVU5JUVVFIDogT2NjdXJlbmNlTWF0cml4VHlwZS5XSUxEQ0FSRFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBDb25jdXJyZW5jeVJlbGF0aW9uLmZyb21PY2N1cnJlbmNlTWF0cml4KG1hdHJpeCwgcmVsYWJlbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29tcHV0ZU9jY3VycmVuY2VNYXRyaXgobG9nOiBBcnJheTxUcmFjZT4sIGxvb2tBaGVhZERpc3RhbmNlOiBudW1iZXIgPSAxLCBtYXRyaXhUeXBlOiBPY2N1cmVuY2VNYXRyaXhUeXBlID0gT2NjdXJlbmNlTWF0cml4VHlwZS5VTklRVUUsIHNob3VsZENsZWFuTG9nOiBib29sZWFuID0gZmFsc2UpOiBPY2N1cnJlbmNlTWF0cml4IHtcclxuICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgT2NjdXJyZW5jZU1hdHJpeChtYXRyaXhUeXBlKTtcclxuXHJcbiAgICAgICAgaWYgKHNob3VsZENsZWFuTG9nKSB7XHJcbiAgICAgICAgICAgIGxvZyA9IGNsZWFuTG9nKGxvZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHRyYWNlIG9mIGxvZykge1xyXG4gICAgICAgICAgICBjb25zdCBwcmVmaXg6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBzdGVwIG9mIHRyYWNlLmV2ZW50TmFtZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXgubGVuZ3RoID4gbG9va0FoZWFkRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmVmaXguc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZSBvZiBwcmVmaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXguYWRkKGUsIHN0ZXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJlZml4LnB1c2goc3RlcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZGVidWcobWF0cml4KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxufVxyXG4iXX0=