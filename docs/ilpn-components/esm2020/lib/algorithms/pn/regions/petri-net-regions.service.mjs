import { Injectable } from '@angular/core';
import { RegionIlpSolver } from './classes/region-ilp-solver';
import { IlpSolverService } from '../../../utility/glpk/ilp-solver.service';
import * as i0 from "@angular/core";
import * as i1 from "./petri-net-region-transformer.service";
export class PetriNetRegionsService extends IlpSolverService {
    constructor(_regionTransformer) {
        super();
        this._regionTransformer = _regionTransformer;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LXJlZ2lvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL3BuL3JlZ2lvbnMvcGV0cmktbmV0LXJlZ2lvbnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBS3pDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUU1RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQzs7O0FBSzFFLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxnQkFBZ0I7SUFFeEQsWUFBb0Isa0JBQW9EO1FBQ3BFLEtBQUssRUFBRSxDQUFDO1FBRFEsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFrQztJQUV4RSxDQUFDO0lBRU0sY0FBYyxDQUFDLElBQXFCLEVBQUUsTUFBNEI7UUFDckUsT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkgsQ0FBQzs7bUhBUlEsc0JBQXNCO3VIQUF0QixzQkFBc0IsY0FGbkIsTUFBTTsyRkFFVCxzQkFBc0I7a0JBSGxDLFVBQVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtQZXRyaU5ldH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BldHJpLW5ldCc7XHJcbmltcG9ydCB7UmVnaW9uc0NvbmZpZ3VyYXRpb259IGZyb20gJy4vY2xhc3Nlcy9yZWdpb25zLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1JlZ2lvbn0gZnJvbSAnLi9jbGFzc2VzL3JlZ2lvbic7XHJcbmltcG9ydCB7UmVnaW9uSWxwU29sdmVyfSBmcm9tICcuL2NsYXNzZXMvcmVnaW9uLWlscC1zb2x2ZXInO1xyXG5pbXBvcnQge1BldHJpTmV0UmVnaW9uVHJhbnNmb3JtZXJTZXJ2aWNlfSBmcm9tICcuL3BldHJpLW5ldC1yZWdpb24tdHJhbnNmb3JtZXIuc2VydmljZSc7XHJcbmltcG9ydCB7SWxwU29sdmVyU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vdXRpbGl0eS9nbHBrL2lscC1zb2x2ZXIuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFBldHJpTmV0UmVnaW9uc1NlcnZpY2UgZXh0ZW5kcyBJbHBTb2x2ZXJTZXJ2aWNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZWdpb25UcmFuc2Zvcm1lcjogUGV0cmlOZXRSZWdpb25UcmFuc2Zvcm1lclNlcnZpY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb21wdXRlUmVnaW9ucyhuZXRzOiBBcnJheTxQZXRyaU5ldD4sIGNvbmZpZzogUmVnaW9uc0NvbmZpZ3VyYXRpb24pOiBPYnNlcnZhYmxlPFJlZ2lvbj4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUmVnaW9uSWxwU29sdmVyKHRoaXMuX3JlZ2lvblRyYW5zZm9ybWVyLCB0aGlzLl9zb2x2ZXIkLmFzT2JzZXJ2YWJsZSgpKS5jb21wdXRlUmVnaW9ucyhuZXRzLCBjb25maWcpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==