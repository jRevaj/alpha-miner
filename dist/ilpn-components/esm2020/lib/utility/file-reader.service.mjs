import { Injectable } from '@angular/core';
import { forkJoin, of, ReplaySubject } from 'rxjs';
import { DropFile } from './drop-file';
import * as i0 from "@angular/core";
export class FileReaderService {
    processFileUpload(files) {
        if (files === undefined) {
            return of([]);
        }
        const files$ = [];
        for (let i = 0; i < files.length; i++) {
            files$.push(this.readFile(files[i]));
        }
        return forkJoin(files$);
    }
    readFile(file) {
        const reader = new FileReader();
        const result = new ReplaySubject(1);
        reader.onerror = (e) => {
            console.debug('Error while reading file content', file, e);
            result.complete();
        };
        reader.onloadend = () => {
            result.next(new DropFile(file.name, reader.result));
            result.complete();
        };
        reader.readAsText(file);
        return result.asObservable();
    }
}
FileReaderService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileReaderService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FileReaderService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileReaderService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: FileReaderService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1yZWFkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi91dGlsaXR5L2ZpbGUtcmVhZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsUUFBUSxFQUFjLEVBQUUsRUFBRSxhQUFhLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUFLckMsTUFBTSxPQUFPLGlCQUFpQjtJQUUxQixpQkFBaUIsQ0FBQyxLQUEyQjtRQUN6QyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDakI7UUFDRCxNQUFNLE1BQU0sR0FBZ0MsRUFBRSxDQUFDO1FBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVPLFFBQVEsQ0FBQyxJQUFVO1FBQ3ZCLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxhQUFhLENBQVcsQ0FBQyxDQUFDLENBQUM7UUFDOUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRTtZQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzlELE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUE7UUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pDLENBQUM7OzhHQTNCUSxpQkFBaUI7a0hBQWpCLGlCQUFpQixjQUZkLE1BQU07MkZBRVQsaUJBQWlCO2tCQUg3QixVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Zm9ya0pvaW4sIE9ic2VydmFibGUsIG9mLCBSZXBsYXlTdWJqZWN0fSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtEcm9wRmlsZX0gZnJvbSAnLi9kcm9wLWZpbGUnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlUmVhZGVyU2VydmljZSB7XHJcblxyXG4gICAgcHJvY2Vzc0ZpbGVVcGxvYWQoZmlsZXM6IEZpbGVMaXN0IHwgdW5kZWZpbmVkKTogT2JzZXJ2YWJsZTxBcnJheTxEcm9wRmlsZT4+IHtcclxuICAgICAgICBpZiAoZmlsZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2YoW10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBmaWxlcyQ6IEFycmF5PE9ic2VydmFibGU8RHJvcEZpbGU+PiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZmlsZXMkLnB1c2godGhpcy5yZWFkRmlsZShmaWxlc1tpXSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZvcmtKb2luKGZpbGVzJCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkRmlsZShmaWxlOiBGaWxlKTogT2JzZXJ2YWJsZTxEcm9wRmlsZT4ge1xyXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFJlcGxheVN1YmplY3Q8RHJvcEZpbGU+KDEpO1xyXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnRXJyb3Igd2hpbGUgcmVhZGluZyBmaWxlIGNvbnRlbnQnLCBmaWxlLCBlKTtcclxuICAgICAgICAgICAgcmVzdWx0LmNvbXBsZXRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIub25sb2FkZW5kID0gKCkgPT4ge1xyXG4gICAgICAgICAgICByZXN1bHQubmV4dChuZXcgRHJvcEZpbGUoZmlsZS5uYW1lLCByZWFkZXIucmVzdWx0IGFzIHN0cmluZykpO1xyXG4gICAgICAgICAgICByZXN1bHQuY29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxufVxyXG4iXX0=