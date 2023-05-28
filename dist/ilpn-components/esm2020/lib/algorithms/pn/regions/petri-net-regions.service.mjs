import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { RegionIlpSolver } from './classes/region-ilp-solver';
import * as i0 from "@angular/core";
import * as i1 from "./petri-net-region-transformer.service";
export class PetriNetRegionsService {
    constructor(_regionTransformer) {
        this._regionTransformer = _regionTransformer;
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
    computeRegions(nets, config) {
        return new RegionIlpSolver(this._regionTransformer, this._solver$.asObservable()).computeRegions(nets, config);
    }
}
PetriNetRegionsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionsService, deps: [{ token: i1.PetriNetRegionTransformerService }], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetRegionsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetRegionTransformerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LXJlZ2lvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL3BuL3JlZ2lvbnMvcGV0cmktbmV0LXJlZ2lvbnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBR3BELE9BQU8sRUFBYSxhQUFhLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFL0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDZCQUE2QixDQUFDOzs7QUFPNUQsTUFBTSxPQUFPLHNCQUFzQjtJQUkvQixZQUFvQixrQkFBb0Q7UUFBcEQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFrQztRQUNwRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksYUFBYSxDQUFPLENBQUMsQ0FBQyxDQUFDO1FBRTNDLHdCQUF3QjtRQUN4QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsQixhQUFhO1lBQ2IsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sY0FBYyxDQUFDLElBQXFCLEVBQUUsTUFBNEI7UUFDckUsT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkgsQ0FBQzs7bUhBdkJRLHNCQUFzQjt1SEFBdEIsc0JBQXNCLGNBRm5CLE1BQU07MkZBRVQsc0JBQXNCO2tCQUhsQyxVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgT25EZXN0cm95fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtQZXRyaU5ldH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BldHJpLW5ldCc7XHJcbmltcG9ydCB7UmVnaW9uc0NvbmZpZ3VyYXRpb259IGZyb20gJy4vY2xhc3Nlcy9yZWdpb25zLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQge09ic2VydmFibGUsIFJlcGxheVN1YmplY3R9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1JlZ2lvbn0gZnJvbSAnLi9jbGFzc2VzL3JlZ2lvbic7XHJcbmltcG9ydCB7UmVnaW9uSWxwU29sdmVyfSBmcm9tICcuL2NsYXNzZXMvcmVnaW9uLWlscC1zb2x2ZXInO1xyXG5pbXBvcnQge1BldHJpTmV0UmVnaW9uVHJhbnNmb3JtZXJTZXJ2aWNlfSBmcm9tICcuL3BldHJpLW5ldC1yZWdpb24tdHJhbnNmb3JtZXIuc2VydmljZSc7XHJcbmltcG9ydCB7R0xQS30gZnJvbSAnZ2xway5qcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFBldHJpTmV0UmVnaW9uc1NlcnZpY2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3NvbHZlciQ6IFJlcGxheVN1YmplY3Q8R0xQSz47XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVnaW9uVHJhbnNmb3JtZXI6IFBldHJpTmV0UmVnaW9uVHJhbnNmb3JtZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5fc29sdmVyJCA9IG5ldyBSZXBsYXlTdWJqZWN0PEdMUEs+KDEpO1xyXG5cclxuICAgICAgICAvLyBnZXQgdGhlIHNvbHZlciBvYmplY3RcclxuICAgICAgICBjb25zdCBwcm9taXNlID0gaW1wb3J0KCdnbHBrLmpzJyk7XHJcbiAgICAgICAgcHJvbWlzZS50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgcmVzdWx0LmRlZmF1bHQoKS50aGVuKGdscGsgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc29sdmVyJC5uZXh0KGdscGspO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zb2x2ZXIkLmNvbXBsZXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbXB1dGVSZWdpb25zKG5ldHM6IEFycmF5PFBldHJpTmV0PiwgY29uZmlnOiBSZWdpb25zQ29uZmlndXJhdGlvbik6IE9ic2VydmFibGU8UmVnaW9uPiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdpb25JbHBTb2x2ZXIodGhpcy5fcmVnaW9uVHJhbnNmb3JtZXIsIHRoaXMuX3NvbHZlciQuYXNPYnNlcnZhYmxlKCkpLmNvbXB1dGVSZWdpb25zKG5ldHMsIGNvbmZpZyk7XHJcbiAgICB9XHJcbn1cclxuIl19