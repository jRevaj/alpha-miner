import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SynthesisResult } from './classes/synthesis-result';
import { RegionSynthesiser } from './classes/region-synthesiser';
import * as i0 from "@angular/core";
import * as i1 from "./petri-net-regions.service";
import * as i2 from "../../../models/pn/parser/petri-net-serialisation.service";
export class PetriNetRegionSynthesisService {
    constructor(_regionService, _serializer) {
        this._regionService = _regionService;
        this._serializer = _serializer;
    }
    synthesise(input, config = {}, fileName = 'result') {
        const result$ = new ReplaySubject(1);
        const synthesiser = new RegionSynthesiser();
        const arrayInput = Array.isArray(input) ? input : [input];
        this._regionService.computeRegions(arrayInput, config).subscribe({
            next: region => {
                synthesiser.addRegion(region);
                console.debug(this._serializer.serialise(region.net));
            },
            complete: () => {
                result$.next(new SynthesisResult(arrayInput, synthesiser.synthesise(), fileName));
                result$.complete();
            }
        });
        return result$.asObservable();
    }
}
PetriNetRegionSynthesisService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionSynthesisService, deps: [{ token: i1.PetriNetRegionsService }, { token: i2.PetriNetSerialisationService }], target: i0.ɵɵFactoryTarget.Injectable });
PetriNetRegionSynthesisService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionSynthesisService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: PetriNetRegionSynthesisService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: i1.PetriNetRegionsService }, { type: i2.PetriNetSerialisationService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0cmktbmV0LXJlZ2lvbi1zeW50aGVzaXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvbXBvbmVudHMvc3JjL2xpYi9hbGdvcml0aG1zL3BuL3JlZ2lvbnMvcGV0cmktbmV0LXJlZ2lvbi1zeW50aGVzaXMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBYSxhQUFhLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDOzs7O0FBUS9ELE1BQU0sT0FBTyw4QkFBOEI7SUFFdkMsWUFBb0IsY0FBc0MsRUFBVSxXQUF5QztRQUF6RixtQkFBYyxHQUFkLGNBQWMsQ0FBd0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBOEI7SUFDN0csQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFpQyxFQUFFLFNBQStCLEVBQUUsRUFBRSxXQUFtQixRQUFRO1FBQy9HLE1BQU0sT0FBTyxHQUFHLElBQUksYUFBYSxDQUFrQixDQUFDLENBQUMsQ0FBQztRQUN0RCxNQUFNLFdBQVcsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFFNUMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFELElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDN0QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUNYLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzlCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDMUQsQ0FBQztZQUNELFFBQVEsRUFBRSxHQUFHLEVBQUU7Z0JBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFVBQVUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xGLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN2QixDQUFDO1NBQ0osQ0FBQyxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDbEMsQ0FBQzs7MkhBdkJRLDhCQUE4QjsrSEFBOUIsOEJBQThCLGNBRjNCLE1BQU07MkZBRVQsOEJBQThCO2tCQUgxQyxVQUFVO21CQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7UGV0cmlOZXR9IGZyb20gJy4uLy4uLy4uL21vZGVscy9wbi9tb2RlbC9wZXRyaS1uZXQnO1xyXG5pbXBvcnQge09ic2VydmFibGUsIFJlcGxheVN1YmplY3R9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1N5bnRoZXNpc1Jlc3VsdH0gZnJvbSAnLi9jbGFzc2VzL3N5bnRoZXNpcy1yZXN1bHQnO1xyXG5pbXBvcnQge1JlZ2lvblN5bnRoZXNpc2VyfSBmcm9tICcuL2NsYXNzZXMvcmVnaW9uLXN5bnRoZXNpc2VyJztcclxuaW1wb3J0IHtSZWdpb25zQ29uZmlndXJhdGlvbn0gZnJvbSAnLi9jbGFzc2VzL3JlZ2lvbnMtY29uZmlndXJhdGlvbic7XHJcbmltcG9ydCB7UGV0cmlOZXRSZWdpb25zU2VydmljZX0gZnJvbSAnLi9wZXRyaS1uZXQtcmVnaW9ucy5zZXJ2aWNlJztcclxuaW1wb3J0IHtQZXRyaU5ldFNlcmlhbGlzYXRpb25TZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvcG4vcGFyc2VyL3BldHJpLW5ldC1zZXJpYWxpc2F0aW9uLnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQZXRyaU5ldFJlZ2lvblN5bnRoZXNpc1NlcnZpY2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlZ2lvblNlcnZpY2U6IFBldHJpTmV0UmVnaW9uc1NlcnZpY2UsIHByaXZhdGUgX3NlcmlhbGl6ZXI6IFBldHJpTmV0U2VyaWFsaXNhdGlvblNlcnZpY2UpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3ludGhlc2lzZShpbnB1dDogUGV0cmlOZXQgfCBBcnJheTxQZXRyaU5ldD4sIGNvbmZpZzogUmVnaW9uc0NvbmZpZ3VyYXRpb24gPSB7fSwgZmlsZU5hbWU6IHN0cmluZyA9ICdyZXN1bHQnKTogT2JzZXJ2YWJsZTxTeW50aGVzaXNSZXN1bHQ+IHtcclxuICAgICAgICBjb25zdCByZXN1bHQkID0gbmV3IFJlcGxheVN1YmplY3Q8U3ludGhlc2lzUmVzdWx0PigxKTtcclxuICAgICAgICBjb25zdCBzeW50aGVzaXNlciA9IG5ldyBSZWdpb25TeW50aGVzaXNlcigpO1xyXG5cclxuICAgICAgICBjb25zdCBhcnJheUlucHV0ID0gQXJyYXkuaXNBcnJheShpbnB1dCkgPyBpbnB1dCA6IFtpbnB1dF07XHJcblxyXG4gICAgICAgIHRoaXMuX3JlZ2lvblNlcnZpY2UuY29tcHV0ZVJlZ2lvbnMoYXJyYXlJbnB1dCwgY29uZmlnKS5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICBuZXh0OiByZWdpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgc3ludGhlc2lzZXIuYWRkUmVnaW9uKHJlZ2lvbik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKHRoaXMuX3NlcmlhbGl6ZXIuc2VyaWFsaXNlKHJlZ2lvbi5uZXQpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCQubmV4dChuZXcgU3ludGhlc2lzUmVzdWx0KGFycmF5SW5wdXQsIHN5bnRoZXNpc2VyLnN5bnRoZXNpc2UoKSwgZmlsZU5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCQuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0JC5hc09ic2VydmFibGUoKTtcclxuICAgIH1cclxufVxyXG4iXX0=