import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as i0 from "@angular/core";
export class IlpSolverService {
    constructor() {
        this._solver$ = new ReplaySubject(1);
        // get the solver object
        const promise = import('glpk.js');
        promise.then(result => {
            // @ts-ignore
            result.default().then(glpk => {
                this._solver$.next(glpk);
            });
        });
    }
    ngOnDestroy() {
        this._solver$.complete();
    }
}
IlpSolverService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpSolverService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
IlpSolverService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpSolverService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: IlpSolverService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWxwLXNvbHZlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL3V0aWxpdHkvZ2xway9pbHAtc29sdmVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sTUFBTSxDQUFDOztBQUtuQyxNQUFNLE9BQWdCLGdCQUFnQjtJQUlsQztRQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxhQUFhLENBQU8sQ0FBQyxDQUFDLENBQUM7UUFFM0Msd0JBQXdCO1FBQ3hCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xCLGFBQWE7WUFDYixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLENBQUM7OzZHQW5CaUIsZ0JBQWdCO2lIQUFoQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFEckMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgT25EZXN0cm95fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtSZXBsYXlTdWJqZWN0fSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtHTFBLfSBmcm9tICdnbHBrLmpzJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbHBTb2x2ZXJTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3NvbHZlciQ6IFJlcGxheVN1YmplY3Q8R0xQSz47XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX3NvbHZlciQgPSBuZXcgUmVwbGF5U3ViamVjdDxHTFBLPigxKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IHRoZSBzb2x2ZXIgb2JqZWN0XHJcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IGltcG9ydCgnZ2xway5qcycpO1xyXG4gICAgICAgIHByb21pc2UudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHJlc3VsdC5kZWZhdWx0KCkudGhlbihnbHBrID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NvbHZlciQubmV4dChnbHBrKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc29sdmVyJC5jb21wbGV0ZSgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==