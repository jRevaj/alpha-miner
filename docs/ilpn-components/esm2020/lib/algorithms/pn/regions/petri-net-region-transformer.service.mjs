import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class PetriNetRegionTransformerService {
    constructor() {
    }
    displayRegionInNet(solution, net) {
        const result = net.clone();
        Object.entries(solution.result.vars).forEach(([id, marking]) => {
            const place = result.getPlace(id);
            if (place === undefined) {
                return; // continue
            }
            place.marking = marking;
        });
        return result;
    }
}
PetriNetRegionTransformerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionTransformerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetRegionTransformerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionTransformerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionTransformerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LXJlZ2lvbi10cmFuc2Zvcm1lci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY29tcG9uZW50cy9zcmMvbGliL2FsZ29yaXRobXMvcG4vcmVnaW9ucy9wZXRyaS1uZXQtcmVnaW9uLXRyYW5zZm9ybWVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFPekMsTUFBTSxPQUFPLGdDQUFnQztJQUV6QztJQUNBLENBQUM7SUFFTSxrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLEdBQWE7UUFDckQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFO1lBQzNELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEMsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNyQixPQUFPLENBQUMsV0FBVzthQUN0QjtZQUNELEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7NkhBakJRLGdDQUFnQztpSUFBaEMsZ0NBQWdDLGNBRjdCLE1BQU07MkZBRVQsZ0NBQWdDO2tCQUg1QyxVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UmVzdWx0fSBmcm9tICdnbHBrLmpzJztcclxuaW1wb3J0IHtQZXRyaU5ldH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3BuL21vZGVsL3BldHJpLW5ldCc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFBldHJpTmV0UmVnaW9uVHJhbnNmb3JtZXJTZXJ2aWNlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVJlZ2lvbkluTmV0KHNvbHV0aW9uOiBSZXN1bHQsIG5ldDogUGV0cmlOZXQpOiBQZXRyaU5ldCB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV0LmNsb25lKCk7XHJcblxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHNvbHV0aW9uLnJlc3VsdC52YXJzKS5mb3JFYWNoKChbaWQsIG1hcmtpbmddKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlID0gcmVzdWx0LmdldFBsYWNlKGlkKTtcclxuICAgICAgICAgICAgaWYgKHBsYWNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gY29udGludWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbGFjZS5tYXJraW5nID0gbWFya2luZztcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==